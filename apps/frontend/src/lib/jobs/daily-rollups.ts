/**
 * Daily Rollups Job
 * 
 * Aggregates cost and attribution data into daily rollups for reporting.
 * Creates rollups at multiple grains: organization, platform, campaign.
 * 
 * Features:
 * - Aggregates spend, impressions, clicks from CostFact/DailyMetrics
 * - Joins with attribution data for conversions
 * - Calculates CPA, ROAS, CTR, CPC
 * - Computes waste metrics (spend with no conversions)
 * - Idempotent (upsert by unique key)
 * - Rebuildable (can reprocess any date range)
 */

import { prisma } from "@/lib/prisma";
import { appLogger } from "@/lib/observability";
import type { AttributionModel } from "@/lib/attribution/types";

export interface RollupResult {
  organizationId: string;
  date: string;
  rollupsCreated: number;
  rollupsUpdated: number;
}

export interface DailyRollupsResult {
  startedAt: Date;
  completedAt: Date;
  daysProcessed: number;
  totalRollups: number;
  results: RollupResult[];
}

export interface DailyRollupsOptions {
  /** Specific organization to process */
  organizationId?: string;
  /** Start date for rollup period */
  startDate?: Date;
  /** End date for rollup period */
  endDate?: Date;
  /** Number of days to process (default: 7) */
  days?: number;
  /** Attribution model to use (default: LAST_TOUCH) */
  attributionModel?: AttributionModel;
  /** Force rebuild even if rollups exist */
  rebuild?: boolean;
}

const DEFAULT_DAYS = 7;
const MICROS_PER_UNIT = 1_000_000;

/**
 * Run daily rollups aggregation
 */
export async function runDailyRollups(options?: DailyRollupsOptions): Promise<DailyRollupsResult> {
  const logger = appLogger.child({ job: "daily-rollups" });
  const startedAt = new Date();

  const attributionModel = options?.attributionModel ?? "LAST_TOUCH";
  const days = options?.days ?? DEFAULT_DAYS;

  // Calculate date range
  const endDate = options?.endDate ?? new Date();
  endDate.setHours(0, 0, 0, 0);

  const startDate = options?.startDate ?? new Date(endDate);
  if (!options?.startDate) {
    startDate.setDate(startDate.getDate() - days);
  }

  logger.info("Starting daily rollups", {
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    attributionModel,
    organizationId: options?.organizationId,
  });

  const results: RollupResult[] = [];
  let totalRollups = 0;

  // Get organizations to process
  const organizations = await prisma.organization.findMany({
    where: options?.organizationId ? { id: options.organizationId } : {},
    select: { id: true },
  });

  // Process each day in the range
  const currentDate = new Date(startDate);
  let daysProcessed = 0;

  while (currentDate <= endDate) {
    const dateStr = currentDate.toISOString().split("T")[0];
    logger.debug(`Processing date: ${dateStr}`);

    for (const org of organizations) {
      try {
        const result = await processOrganizationRollups(
          org.id,
          currentDate,
          attributionModel,
          logger
        );

        results.push({
          organizationId: org.id,
          date: dateStr,
          rollupsCreated: result.created,
          rollupsUpdated: result.updated,
        });

        totalRollups += result.created + result.updated;
      } catch (error) {
        logger.error(`Failed to process rollups for org ${org.id} on ${dateStr}`, error as Error);
      }
    }

    daysProcessed++;
    currentDate.setDate(currentDate.getDate() + 1);
  }

  const completedAt = new Date();

  logger.info("Daily rollups completed", {
    daysProcessed,
    totalRollups,
    durationMs: completedAt.getTime() - startedAt.getTime(),
  });

  return {
    startedAt,
    completedAt,
    daysProcessed,
    totalRollups,
    results,
  };
}

/**
 * Process rollups for a single organization on a single day
 */
async function processOrganizationRollups(
  organizationId: string,
  date: Date,
  attributionModel: AttributionModel,
  logger: typeof appLogger
): Promise<{ created: number; updated: number }> {
  let created = 0;
  let updated = 0;

  // Get cost data aggregated by platform and campaign
  const costData = await getCostDataForDate(organizationId, date);

  // Get attribution data for the date
  const attributionData = await getAttributionDataForDate(organizationId, date, attributionModel);

  // Create organization-level rollup
  const orgRollup = await createOrganizationRollup(
    organizationId,
    date,
    costData,
    attributionData,
    attributionModel
  );
  if (orgRollup.isNew) created++;
  else updated++;

  // Create platform-level rollups
  const platformIds = [...new Set(costData.map((c) => c.platformId))];
  for (const platformId of platformIds) {
    const platformCosts = costData.filter((c) => c.platformId === platformId);
    const platformAttribution = attributionData.filter((a) => a.platformId === platformId);

    const platformRollup = await createPlatformRollup(
      organizationId,
      platformId,
      date,
      platformCosts,
      platformAttribution,
      attributionModel
    );
    if (platformRollup.isNew) created++;
    else updated++;
  }

  // Create campaign-level rollups
  const campaignIds = [...new Set(costData.filter((c) => c.campaignId).map((c) => c.campaignId!))];
  for (const campaignId of campaignIds) {
    const campaignCosts = costData.filter((c) => c.campaignId === campaignId);
    const campaignAttribution = attributionData.filter((a) => a.campaignId === campaignId);

    const campaignRollup = await createCampaignRollup(
      organizationId,
      campaignId,
      date,
      campaignCosts,
      campaignAttribution,
      attributionModel
    );
    if (campaignRollup.isNew) created++;
    else updated++;
  }

  return { created, updated };
}

/**
 * Get cost data for a specific date
 */
async function getCostDataForDate(
  organizationId: string,
  date: Date
): Promise<Array<{
  platformId: string;
  campaignId: string | null;
  impressions: bigint;
  clicks: bigint;
  spendMicros: bigint;
}>> {
  // Aggregate from DailyCampaignMetric
  const campaignMetrics = await prisma.dailyCampaignMetric.findMany({
    where: {
      organizationId,
      date,
    },
    select: {
      platformId: true,
      campaignId: true,
      impressions: true,
      clicks: true,
      spendMicros: true,
    },
  });

  return campaignMetrics.map((m) => ({
    platformId: m.platformId,
    campaignId: m.campaignId,
    impressions: m.impressions,
    clicks: m.clicks,
    spendMicros: m.spendMicros,
  }));
}

/**
 * Get attribution data for a specific date
 */
async function getAttributionDataForDate(
  organizationId: string,
  date: Date,
  model: AttributionModel
): Promise<Array<{
  platformId: string | null;
  campaignId: string | null;
  conversions: number;
  conversionValue: bigint;
}>> {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + 1);

  // Get conversions that occurred on this date
  const conversions = await prisma.trackingEvent.findMany({
    where: {
      type: "CONVERSION",
      occurredAt: {
        gte: date,
        lt: nextDate,
      },
      site: {
        organizationId,
      },
    },
    select: {
      id: true,
      valueMicros: true,
    },
  });

  if (conversions.length === 0) {
    return [];
  }

  const conversionIds = conversions.map((c) => c.id);

  // Get attribution links for these conversions
  const attributionLinks = await prisma.attributionLink.findMany({
    where: {
      conversionId: { in: conversionIds },
      model,
    },
    include: {
      touchPoint: {
        select: {
          platformCode: true,
          campaignId: true,
        },
      },
    },
  });

  // Aggregate by platform and campaign
  const aggregated = new Map<string, {
    platformId: string | null;
    campaignId: string | null;
    conversions: number;
    conversionValue: bigint;
  }>();

  for (const link of attributionLinks) {
    const conversion = conversions.find((c) => c.id === link.conversionId);
    const platformId = link.touchPoint.platformCode;
    const campaignId = link.touchPoint.campaignId;
    const key = `${platformId ?? "unknown"}-${campaignId ?? "unknown"}`;

    const existing = aggregated.get(key) || {
      platformId: platformId ? await getPlatformIdByCode(platformId) : null,
      campaignId,
      conversions: 0,
      conversionValue: BigInt(0),
    };

    existing.conversions += link.weight;
    if (conversion?.valueMicros) {
      existing.conversionValue += BigInt(Math.round(Number(conversion.valueMicros) * link.weight));
    }

    aggregated.set(key, existing);
  }

  return Array.from(aggregated.values());
}

/**
 * Get platform ID by code
 */
async function getPlatformIdByCode(code: string): Promise<string | null> {
  const platform = await prisma.platform.findUnique({
    where: { code: code as any },
    select: { id: true },
  });
  return platform?.id ?? null;
}

/**
 * Create organization-level rollup
 */
async function createOrganizationRollup(
  organizationId: string,
  date: Date,
  costData: Array<{ impressions: bigint; clicks: bigint; spendMicros: bigint }>,
  attributionData: Array<{ conversions: number; conversionValue: bigint }>,
  attributionModel: AttributionModel
): Promise<{ isNew: boolean }> {
  const impressions = costData.reduce((sum, c) => sum + c.impressions, BigInt(0));
  const clicks = costData.reduce((sum, c) => sum + c.clicks, BigInt(0));
  const spendMicros = costData.reduce((sum, c) => sum + c.spendMicros, BigInt(0));
  const conversions = attributionData.reduce((sum, a) => sum + a.conversions, 0);
  const conversionValue = attributionData.reduce((sum, a) => sum + a.conversionValue, BigInt(0));

  const metrics = calculateMetrics(impressions, clicks, spendMicros, conversions, conversionValue);

  const existing = await prisma.$queryRaw<Array<{ id: string }>>`
    SELECT id FROM "DailyRollup"
    WHERE "organizationId" = ${organizationId}
      AND "date" = ${date}
      AND "grain" = 'organization'
      AND "platformId" IS NULL
      AND "campaignId" IS NULL
      AND "attributionModel" = ${attributionModel}
    LIMIT 1
  `;

  if (existing.length > 0) {
    await prisma.$executeRaw`
      UPDATE "DailyRollup"
      SET
        "impressions" = ${impressions},
        "clicks" = ${clicks},
        "spendMicros" = ${spendMicros},
        "conversions" = ${conversions},
        "conversionValue" = ${conversionValue},
        "attributedConversions" = ${conversions},
        "cpa" = ${metrics.cpa},
        "roas" = ${metrics.roas},
        "ctr" = ${metrics.ctr},
        "cpc" = ${metrics.cpc},
        "wasteSpendMicros" = ${metrics.wasteSpendMicros},
        "wastePct" = ${metrics.wastePct},
        "updatedAt" = NOW()
      WHERE id = ${existing[0].id}
    `;
    return { isNew: false };
  }

  await prisma.$executeRaw`
    INSERT INTO "DailyRollup" (
      "id", "organizationId", "date", "grain", "platformId", "campaignId",
      "impressions", "clicks", "spendMicros", "conversions", "conversionValue",
      "attributedConversions", "cpa", "roas", "ctr", "cpc",
      "wasteSpendMicros", "wastePct", "attributionModel", "createdAt", "updatedAt"
    ) VALUES (
      gen_random_uuid()::text, ${organizationId}, ${date}, 'organization', NULL, NULL,
      ${impressions}, ${clicks}, ${spendMicros}, ${conversions}, ${conversionValue},
      ${conversions}, ${metrics.cpa}, ${metrics.roas}, ${metrics.ctr}, ${metrics.cpc},
      ${metrics.wasteSpendMicros}, ${metrics.wastePct}, ${attributionModel}, NOW(), NOW()
    )
  `;

  return { isNew: true };
}

/**
 * Create platform-level rollup
 */
async function createPlatformRollup(
  organizationId: string,
  platformId: string,
  date: Date,
  costData: Array<{ impressions: bigint; clicks: bigint; spendMicros: bigint }>,
  attributionData: Array<{ conversions: number; conversionValue: bigint }>,
  attributionModel: AttributionModel
): Promise<{ isNew: boolean }> {
  const impressions = costData.reduce((sum, c) => sum + c.impressions, BigInt(0));
  const clicks = costData.reduce((sum, c) => sum + c.clicks, BigInt(0));
  const spendMicros = costData.reduce((sum, c) => sum + c.spendMicros, BigInt(0));
  const conversions = attributionData.reduce((sum, a) => sum + a.conversions, 0);
  const conversionValue = attributionData.reduce((sum, a) => sum + a.conversionValue, BigInt(0));

  const metrics = calculateMetrics(impressions, clicks, spendMicros, conversions, conversionValue);

  const existing = await prisma.$queryRaw<Array<{ id: string }>>`
    SELECT id FROM "DailyRollup"
    WHERE "organizationId" = ${organizationId}
      AND "date" = ${date}
      AND "grain" = 'platform'
      AND "platformId" = ${platformId}
      AND "campaignId" IS NULL
      AND "attributionModel" = ${attributionModel}
    LIMIT 1
  `;

  if (existing.length > 0) {
    await prisma.$executeRaw`
      UPDATE "DailyRollup"
      SET
        "impressions" = ${impressions},
        "clicks" = ${clicks},
        "spendMicros" = ${spendMicros},
        "conversions" = ${conversions},
        "conversionValue" = ${conversionValue},
        "attributedConversions" = ${conversions},
        "cpa" = ${metrics.cpa},
        "roas" = ${metrics.roas},
        "ctr" = ${metrics.ctr},
        "cpc" = ${metrics.cpc},
        "wasteSpendMicros" = ${metrics.wasteSpendMicros},
        "wastePct" = ${metrics.wastePct},
        "updatedAt" = NOW()
      WHERE id = ${existing[0].id}
    `;
    return { isNew: false };
  }

  await prisma.$executeRaw`
    INSERT INTO "DailyRollup" (
      "id", "organizationId", "date", "grain", "platformId", "campaignId",
      "impressions", "clicks", "spendMicros", "conversions", "conversionValue",
      "attributedConversions", "cpa", "roas", "ctr", "cpc",
      "wasteSpendMicros", "wastePct", "attributionModel", "createdAt", "updatedAt"
    ) VALUES (
      gen_random_uuid()::text, ${organizationId}, ${date}, 'platform', ${platformId}, NULL,
      ${impressions}, ${clicks}, ${spendMicros}, ${conversions}, ${conversionValue},
      ${conversions}, ${metrics.cpa}, ${metrics.roas}, ${metrics.ctr}, ${metrics.cpc},
      ${metrics.wasteSpendMicros}, ${metrics.wastePct}, ${attributionModel}, NOW(), NOW()
    )
  `;

  return { isNew: true };
}

/**
 * Create campaign-level rollup
 */
async function createCampaignRollup(
  organizationId: string,
  campaignId: string,
  date: Date,
  costData: Array<{ platformId: string; impressions: bigint; clicks: bigint; spendMicros: bigint }>,
  attributionData: Array<{ conversions: number; conversionValue: bigint }>,
  attributionModel: AttributionModel
): Promise<{ isNew: boolean }> {
  const impressions = costData.reduce((sum, c) => sum + c.impressions, BigInt(0));
  const clicks = costData.reduce((sum, c) => sum + c.clicks, BigInt(0));
  const spendMicros = costData.reduce((sum, c) => sum + c.spendMicros, BigInt(0));
  const conversions = attributionData.reduce((sum, a) => sum + a.conversions, 0);
  const conversionValue = attributionData.reduce((sum, a) => sum + a.conversionValue, BigInt(0));
  const platformId = costData[0]?.platformId;

  const metrics = calculateMetrics(impressions, clicks, spendMicros, conversions, conversionValue);

  const existing = await prisma.$queryRaw<Array<{ id: string }>>`
    SELECT id FROM "DailyRollup"
    WHERE "organizationId" = ${organizationId}
      AND "date" = ${date}
      AND "grain" = 'campaign'
      AND "campaignId" = ${campaignId}
      AND "attributionModel" = ${attributionModel}
    LIMIT 1
  `;

  if (existing.length > 0) {
    await prisma.$executeRaw`
      UPDATE "DailyRollup"
      SET
        "impressions" = ${impressions},
        "clicks" = ${clicks},
        "spendMicros" = ${spendMicros},
        "conversions" = ${conversions},
        "conversionValue" = ${conversionValue},
        "attributedConversions" = ${conversions},
        "cpa" = ${metrics.cpa},
        "roas" = ${metrics.roas},
        "ctr" = ${metrics.ctr},
        "cpc" = ${metrics.cpc},
        "wasteSpendMicros" = ${metrics.wasteSpendMicros},
        "wastePct" = ${metrics.wastePct},
        "updatedAt" = NOW()
      WHERE id = ${existing[0].id}
    `;
    return { isNew: false };
  }

  await prisma.$executeRaw`
    INSERT INTO "DailyRollup" (
      "id", "organizationId", "date", "grain", "platformId", "campaignId",
      "impressions", "clicks", "spendMicros", "conversions", "conversionValue",
      "attributedConversions", "cpa", "roas", "ctr", "cpc",
      "wasteSpendMicros", "wastePct", "attributionModel", "createdAt", "updatedAt"
    ) VALUES (
      gen_random_uuid()::text, ${organizationId}, ${date}, 'campaign', ${platformId}, ${campaignId},
      ${impressions}, ${clicks}, ${spendMicros}, ${conversions}, ${conversionValue},
      ${conversions}, ${metrics.cpa}, ${metrics.roas}, ${metrics.ctr}, ${metrics.cpc},
      ${metrics.wasteSpendMicros}, ${metrics.wastePct}, ${attributionModel}, NOW(), NOW()
    )
  `;

  return { isNew: true };
}

/**
 * Calculate derived metrics
 */
function calculateMetrics(
  impressions: bigint,
  clicks: bigint,
  spendMicros: bigint,
  conversions: number,
  conversionValue: bigint
): {
  cpa: number | null;
  roas: number | null;
  ctr: number | null;
  cpc: number | null;
  wasteSpendMicros: bigint;
  wastePct: number;
} {
  const spend = Number(spendMicros) / MICROS_PER_UNIT;
  const revenue = Number(conversionValue) / MICROS_PER_UNIT;
  const impressionsNum = Number(impressions);
  const clicksNum = Number(clicks);

  // CPA = spend / conversions
  const cpa = conversions > 0 ? spend / conversions : null;

  // ROAS = revenue / spend
  const roas = spend > 0 ? revenue / spend : null;

  // CTR = clicks / impressions
  const ctr = impressionsNum > 0 ? (clicksNum / impressionsNum) * 100 : null;

  // CPC = spend / clicks
  const cpc = clicksNum > 0 ? spend / clicksNum : null;

  // Waste = spend with no conversions
  const wasteSpendMicros = conversions === 0 ? spendMicros : BigInt(0);
  const wastePct = spend > 0 && conversions === 0 ? 100 : 0;

  return { cpa, roas, ctr, cpc, wasteSpendMicros, wastePct };
}

/**
 * Build journeys by linking events to conversions
 */
export async function buildJourneys(options?: {
  organizationId?: string;
  startDate?: Date;
  endDate?: Date;
}): Promise<{ journeysCreated: number; eventsLinked: number }> {
  const logger = appLogger.child({ job: "build-journeys" });

  const endDate = options?.endDate ?? new Date();
  const startDate = options?.startDate ?? new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);

  logger.info("Building journeys", { startDate, endDate, organizationId: options?.organizationId });

  // Get tracking sites
  const sites = await prisma.trackingSite.findMany({
    where: options?.organizationId ? { organizationId: options.organizationId } : {},
    select: { id: true, organizationId: true },
  });

  let journeysCreated = 0;
  let eventsLinked = 0;

  for (const site of sites) {
    // Get conversions without journeys
    const conversions = await prisma.trackingEvent.findMany({
      where: {
        siteId: site.id,
        type: "CONVERSION",
        occurredAt: { gte: startDate, lte: endDate },
      },
      select: {
        id: true,
        anonId: true,
        sessionId: true,
        occurredAt: true,
        valueMicros: true,
        utmSource: true,
        utmCampaign: true,
      },
    });

    for (const conversion of conversions) {
      // Check if journey already exists
      const existingJourney = await prisma.journey.findFirst({
        where: {
          organizationId: site.organizationId,
          anonId: conversion.anonId,
          status: "CONVERTED",
        },
      });

      if (existingJourney) continue;

      // Get all events for this visitor before conversion
      const events = await prisma.trackingEvent.findMany({
        where: {
          siteId: site.id,
          anonId: conversion.anonId,
          occurredAt: { lte: conversion.occurredAt },
        },
        orderBy: { occurredAt: "asc" },
        select: {
          id: true,
          type: true,
          occurredAt: true,
          utmSource: true,
          utmMedium: true,
          utmCampaign: true,
        },
      });

      if (events.length === 0) continue;

      const firstEvent = events[0];
      const lastEvent = events[events.length - 1];

      // Create journey
      const journey = await prisma.journey.create({
        data: {
          organizationId: site.organizationId,
          anonId: conversion.anonId,
          sessionId: conversion.sessionId,
          status: "CONVERTED",
          startedAt: firstEvent.occurredAt,
          convertedAt: conversion.occurredAt,
          lastActivityAt: conversion.occurredAt,
          conversionValue: conversion.valueMicros,
          conversionName: "conversion",
          firstUtmSource: firstEvent.utmSource,
          firstUtmMedium: firstEvent.utmMedium,
          firstUtmCampaign: firstEvent.utmCampaign,
          lastUtmSource: lastEvent.utmSource,
          lastUtmMedium: lastEvent.utmMedium,
          lastUtmCampaign: lastEvent.utmCampaign,
          touchPointCount: events.length,
          eventCount: events.length,
        },
      });

      journeysCreated++;

      // Link events to journey
      for (let i = 0; i < events.length; i++) {
        await prisma.journeyEvent.create({
          data: {
            journeyId: journey.id,
            trackingEventId: events[i].id,
            sequenceNumber: i + 1,
            occurredAt: events[i].occurredAt,
          },
        });
        eventsLinked++;
      }
    }
  }

  logger.info("Journeys built", { journeysCreated, eventsLinked });

  return { journeysCreated, eventsLinked };
}

/**
 * Run attribution for unattributed conversions
 */
export async function runAttributionForConversions(options?: {
  organizationId?: string;
  startDate?: Date;
  endDate?: Date;
  models?: AttributionModel[];
}): Promise<{ conversionsProcessed: number; linksCreated: number }> {
  const logger = appLogger.child({ job: "run-attribution" });
  const { attributionService } = await import("@/lib/attribution/service");

  const models = options?.models ?? ["LAST_TOUCH", "LINEAR"] as AttributionModel[];
  const endDate = options?.endDate ?? new Date();
  const startDate = options?.startDate ?? new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);

  logger.info("Running attribution", { startDate, endDate, models });

  // Get tracking sites
  const sites = await prisma.trackingSite.findMany({
    where: options?.organizationId ? { organizationId: options.organizationId } : {},
    select: { id: true },
  });

  let conversionsProcessed = 0;
  let linksCreated = 0;

  for (const site of sites) {
    // Get conversions without attribution links
    const conversions = await prisma.trackingEvent.findMany({
      where: {
        siteId: site.id,
        type: "CONVERSION",
        occurredAt: { gte: startDate, lte: endDate },
        attributionLinks: { none: {} },
      },
      select: {
        id: true,
        anonId: true,
        occurredAt: true,
      },
    });

    for (const conversion of conversions) {
      const result = await attributionService.attributeConversion({
        siteId: site.id,
        conversionId: conversion.id,
        anonId: conversion.anonId,
        conversionTime: conversion.occurredAt,
        models,
      });

      conversionsProcessed++;
      linksCreated += result.linked;
    }
  }

  logger.info("Attribution completed", { conversionsProcessed, linksCreated });

  return { conversionsProcessed, linksCreated };
}
