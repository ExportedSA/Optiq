import { prisma } from "@/lib/prisma";
import { appLogger } from "@/lib/observability";
import { PLAN_DEFINITIONS, calculateOverages, type PlanTier } from "@optiq/shared";

/**
 * Usage Aggregation Job (Frontend Version)
 * 
 * Runs daily to aggregate usage counters and update billing records.
 * This is a simplified version that can run in Vercel serverless functions.
 * 
 * Features:
 * - Aggregates event counts per workspace per day
 * - Writes to DailyUsageCounter table (idempotent upsert)
 * - Updates UsageRecord for billing period
 * - Supports backfill for missing days via USAGE_BACKFILL_DAYS env var
 */

export interface AggregationResult {
  processedSubscriptions: number;
  processedDays: number;
  errors: number;
}

/**
 * Run usage aggregation for all subscriptions
 * 
 * @param options - Optional configuration
 * @param options.backfillDays - Number of days to backfill (default: 1 = yesterday only)
 * @param options.organizationId - Specific organization to process (optional)
 */
export async function runUsageAggregation(options?: {
  backfillDays?: number;
  organizationId?: string;
}): Promise<AggregationResult> {
  const logger = appLogger.child({ job: "usage-aggregation" });
  
  // Check for backfill mode via env var or options
  const backfillDays = options?.backfillDays ?? 
    (process.env.USAGE_BACKFILL_DAYS ? parseInt(process.env.USAGE_BACKFILL_DAYS, 10) : 1);
  
  logger.info("Starting usage aggregation", { backfillDays, organizationId: options?.organizationId });

  const result: AggregationResult = {
    processedSubscriptions: 0,
    processedDays: 0,
    errors: 0,
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Get all organizations with active subscriptions
  const subscriptions = await prisma.subscription.findMany({
    where: {
      status: { in: ["ACTIVE", "TRIALING"] },
    },
    select: {
      id: true,
      organizationId: true,
      plan: true,
      monthlyEventLimit: true,
      currentPeriodStart: true,
      currentPeriodEnd: true,
    },
  });

  // Filter by organization if specified
  const filteredSubscriptions = options?.organizationId
    ? subscriptions.filter((s) => s.organizationId === options.organizationId)
    : subscriptions;

  logger.info(`Processing ${filteredSubscriptions.length} subscriptions`);

  // Process each day in the backfill range
  for (let dayOffset = backfillDays; dayOffset >= 1; dayOffset--) {
    const targetDate = new Date(today);
    targetDate.setDate(targetDate.getDate() - dayOffset);
    
    const nextDate = new Date(targetDate);
    nextDate.setDate(nextDate.getDate() + 1);

    logger.debug(`Processing date: ${targetDate.toISOString().split("T")[0]}`);

    for (const subscription of filteredSubscriptions) {
      try {
        await aggregateSubscriptionUsage(subscription, targetDate, nextDate, logger);
        result.processedDays++;
      } catch (error) {
        logger.error(`Error aggregating usage for subscription ${subscription.id}`, error as Error);
        result.errors++;
      }
    }
    
    result.processedSubscriptions = filteredSubscriptions.length;
  }

  logger.info("Usage aggregation completed", { ...result });
  return result;
}

async function aggregateSubscriptionUsage(
  subscription: {
    id: string;
    organizationId: string;
    plan: string;
    monthlyEventLimit: number | null;
    currentPeriodStart: Date;
    currentPeriodEnd: Date;
  },
  startDate: Date,
  endDate: Date,
  logger: typeof appLogger
): Promise<void> {
  const { organizationId } = subscription;

  // Get tracking sites for this org
  const sites = await prisma.trackingSite.findMany({
    where: { organizationId },
    select: { id: true },
  });

  const siteIds = sites.map((s) => s.id);

  // Count events by type for yesterday
  let pageViews = 0;
  let conversions = 0;
  let customEvents = 0;

  if (siteIds.length > 0) {
    // Use raw query to avoid Prisma type issues
    const eventCounts = await prisma.$queryRaw<Array<{ eventType: string; count: bigint }>>`
      SELECT "eventType", COUNT(*) as count
      FROM "TrackingEvent"
      WHERE "siteId" = ANY(${siteIds})
        AND "occurredAt" >= ${startDate}
        AND "occurredAt" < ${endDate}
      GROUP BY "eventType"
    `;

    for (const ec of eventCounts) {
      const count = Number(ec.count);
      switch (ec.eventType) {
        case "PAGE_VIEW":
          pageViews = count;
          break;
        case "CONVERSION":
          conversions = count;
          break;
        default:
          customEvents += count;
      }
    }
  }

  const totalEvents = pageViews + conversions + customEvents;

  // Count active connectors
  const activeConnectors = await prisma.adAccount.count({
    where: { organizationId, status: "ACTIVE" },
  });

  // Count active campaigns
  const activeCampaigns = await prisma.campaign.count({
    where: { organizationId, status: "ACTIVE" },
  });

  // Upsert daily counter
  await prisma.$executeRaw`
    INSERT INTO "DailyUsageCounter" (
      "id", "organizationId", "date",
      "pageViews", "conversions", "customEvents", "totalEvents",
      "activeConnectors", "activeCampaigns",
      "createdAt", "updatedAt"
    )
    VALUES (
      gen_random_uuid()::text, ${organizationId}, ${startDate},
      ${pageViews}, ${conversions}, ${customEvents}, ${totalEvents},
      ${activeConnectors}, ${activeCampaigns},
      NOW(), NOW()
    )
    ON CONFLICT ("organizationId", "date")
    DO UPDATE SET
      "pageViews" = EXCLUDED."pageViews",
      "conversions" = EXCLUDED."conversions",
      "customEvents" = EXCLUDED."customEvents",
      "totalEvents" = EXCLUDED."totalEvents",
      "activeConnectors" = EXCLUDED."activeConnectors",
      "activeCampaigns" = EXCLUDED."activeCampaigns",
      "updatedAt" = NOW()
  `;

  // Sum all events in current billing period
  const periodUsage = await prisma.$queryRaw<[{ total: bigint }]>`
    SELECT COALESCE(SUM("totalEvents"), 0) as total
    FROM "DailyUsageCounter"
    WHERE "organizationId" = ${organizationId}
      AND "date" >= ${subscription.currentPeriodStart}
      AND "date" <= ${subscription.currentPeriodEnd}
  `;

  const totalPeriodEvents = Number(periodUsage[0]?.total ?? 0);

  // Get plan limits
  const plan = subscription.plan as PlanTier;
  const planDef = PLAN_DEFINITIONS[plan] ?? PLAN_DEFINITIONS.FREE;

  const limits = {
    maxWorkspaces: planDef.limits.maxWorkspaces,
    maxConnectors: planDef.limits.maxConnectors,
    monthlyEventLimit: subscription.monthlyEventLimit ?? planDef.limits.monthlyEventLimit,
    dataRetentionDays: planDef.limits.dataRetentionDays,
    attributionModels: planDef.limits.attributionModels,
    alertsEnabled: planDef.limits.alertsEnabled,
    ssoEnabled: planDef.limits.ssoEnabled,
    prioritySupport: planDef.limits.prioritySupport,
  };

  const usage = {
    trackedEvents: totalPeriodEvents,
    connectedAccounts: activeConnectors,
    workspacesUsed: 1,
  };

  const overages = calculateOverages(usage, limits, planDef.pricing);

  // Upsert usage record
  await prisma.$executeRaw`
    INSERT INTO "UsageRecord" (
      "id", "subscriptionId", "organizationId",
      "periodStart", "periodEnd",
      "trackedEvents", "connectedAccounts", "workspacesUsed",
      "eventsOverage", "connectorsOverage", "overageAmountCents",
      "createdAt", "updatedAt"
    )
    VALUES (
      gen_random_uuid()::text, ${subscription.id}, ${organizationId},
      ${subscription.currentPeriodStart}, ${subscription.currentPeriodEnd},
      ${totalPeriodEvents}, ${activeConnectors}, 1,
      ${overages.eventsOverage}, ${overages.connectorsOverage}, ${overages.totalOverageCents},
      NOW(), NOW()
    )
    ON CONFLICT ("subscriptionId", "periodStart")
    DO UPDATE SET
      "trackedEvents" = EXCLUDED."trackedEvents",
      "connectedAccounts" = EXCLUDED."connectedAccounts",
      "eventsOverage" = EXCLUDED."eventsOverage",
      "connectorsOverage" = EXCLUDED."connectorsOverage",
      "overageAmountCents" = EXCLUDED."overageAmountCents",
      "updatedAt" = NOW()
  `;

  logger.debug(`Aggregated usage for org ${organizationId}: ${totalEvents} events yesterday, ${totalPeriodEvents} period total`);
}
