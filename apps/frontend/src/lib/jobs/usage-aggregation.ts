import { prisma } from "@/lib/prisma";
import { appLogger } from "@/lib/observability";
import { PLAN_DEFINITIONS, calculateOverages, type PlanTier } from "@optiq/shared";

/**
 * Usage Aggregation Job (Frontend Version)
 * 
 * Runs daily to aggregate usage counters and update billing records.
 * This is a simplified version that can run in Vercel serverless functions.
 */

export async function runUsageAggregation(): Promise<void> {
  const logger = appLogger.child({ job: "usage-aggregation" });
  logger.info("Starting usage aggregation");

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);

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

  logger.info(`Processing ${subscriptions.length} subscriptions`);

  for (const subscription of subscriptions) {
    try {
      await aggregateSubscriptionUsage(subscription, yesterday, today, logger);
    } catch (error) {
      logger.error(`Error aggregating usage for subscription ${subscription.id}`, error as Error);
    }
  }

  logger.info("Usage aggregation completed");
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
