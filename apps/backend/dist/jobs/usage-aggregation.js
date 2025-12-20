import { PrismaClient } from "@prisma/client";
import { createLogger } from "@optiq/shared";
import { PLAN_DEFINITIONS, calculateOverages } from "@optiq/shared";
const prisma = new PrismaClient();
const logger = createLogger("usage-aggregation");
/**
 * Daily Usage Aggregation Job
 *
 * Runs daily to:
 * 1. Aggregate daily event counts from tracking events
 * 2. Snapshot resource counts (connectors, campaigns)
 * 3. Update UsageRecord for billing period
 * 4. Calculate overages for invoicing
 */
export async function runUsageAggregation() {
    logger.info("Starting usage aggregation job");
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // Get all active organizations
    const organizations = await prisma.organization.findMany({
        where: { status: "ACTIVE" },
        select: { id: true },
    });
    logger.info(`Processing ${organizations.length} organizations`);
    for (const org of organizations) {
        try {
            await aggregateOrganizationUsage(org.id, yesterday, today);
        }
        catch (error) {
            logger.error(`Error aggregating usage for org ${org.id}:`, error);
        }
    }
    logger.info("Usage aggregation job completed");
}
async function aggregateOrganizationUsage(organizationId, startDate, endDate) {
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
        const eventCounts = await prisma.trackingEvent.groupBy({
            by: ["eventType"],
            where: {
                siteId: { in: siteIds },
                occurredAt: { gte: startDate, lt: endDate },
            },
            _count: { id: true },
        });
        for (const ec of eventCounts) {
            const count = ec._count.id;
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
    await prisma.$executeRaw `
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
    // Update billing period usage record
    await updateBillingPeriodUsage(organizationId);
    logger.debug(`Aggregated usage for org ${organizationId}: ${totalEvents} events`);
}
async function updateBillingPeriodUsage(organizationId) {
    const subscription = await prisma.subscription.findUnique({
        where: { organizationId },
    });
    if (!subscription) {
        return;
    }
    // Sum all events in current billing period
    const periodUsage = await prisma.$queryRaw `
    SELECT COALESCE(SUM("totalEvents"), 0) as total
    FROM "DailyUsageCounter"
    WHERE "organizationId" = ${organizationId}
      AND "date" >= ${subscription.currentPeriodStart}
      AND "date" <= ${subscription.currentPeriodEnd}
  `;
    const totalEvents = Number(periodUsage[0]?.total ?? 0);
    // Count current connectors
    const connectedAccounts = await prisma.adAccount.count({
        where: { organizationId, status: "ACTIVE" },
    });
    // Get plan limits
    const plan = subscription.plan;
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
        trackedEvents: totalEvents,
        connectedAccounts,
        workspacesUsed: 1,
    };
    const overages = calculateOverages(usage, limits, planDef.pricing);
    // Upsert usage record
    await prisma.$executeRaw `
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
      ${totalEvents}, ${connectedAccounts}, 1,
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
    // Log overage calculation for audit
    if (overages.totalOverageCents > 0) {
        await prisma.$executeRaw `
      INSERT INTO "MeteringAuditLog" ("id", "organizationId", "eventType", "eventCount", "metadata", "timestamp")
      VALUES (
        gen_random_uuid()::text, 
        ${organizationId}, 
        'overage_calculated', 
        1, 
        ${JSON.stringify({
            trackedEvents: totalEvents,
            eventLimit: limits.monthlyEventLimit,
            eventsOverage: overages.eventsOverage,
            connectorsOverage: overages.connectorsOverage,
            totalOverageCents: overages.totalOverageCents,
        })}::jsonb, 
        NOW()
      )
    `;
    }
}
export async function getUsageHistory(organizationId, days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);
    return prisma.$queryRaw `
    SELECT 
      "date",
      "pageViews",
      "conversions",
      "customEvents",
      "totalEvents",
      "apiRequests",
      "webhookCalls",
      "activeConnectors",
      "activeCampaigns",
      "throttledRequests",
      "softLimitHit",
      "hardLimitHit"
    FROM "DailyUsageCounter"
    WHERE "organizationId" = ${organizationId}
      AND "date" >= ${startDate}
    ORDER BY "date" DESC
  `;
}
export async function getAuditLog(organizationId, limit = 100) {
    return prisma.$queryRaw `
    SELECT 
      "id",
      "eventType",
      "eventCount",
      "metadata",
      "timestamp"
    FROM "MeteringAuditLog"
    WHERE "organizationId" = ${organizationId}
    ORDER BY "timestamp" DESC
    LIMIT ${limit}
  `;
}
//# sourceMappingURL=usage-aggregation.js.map