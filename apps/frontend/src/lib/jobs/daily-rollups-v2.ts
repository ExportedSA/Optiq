/**
 * Daily Rollups Job V2
 * 
 * Joins CostFact with AttributionLink weights to compute:
 * - Attributed conversions (fractional based on weights)
 * - Conversion value
 * - CPA, ROAS
 * - Waste spend (spend where conversions = 0)
 * 
 * Persists to DailyRollup by grain (ORG, PLATFORM, CAMPAIGN, ADSET, AD)
 * and attributionModel with idempotent upsert.
 */

import "server-only";
import { prisma } from "@/lib/prisma";
import { appLogger } from "@/lib/observability";
import type { AttributionModel, RollupGrain } from "@prisma/client";

export interface DailyRollupJobOptions {
  /** Specific organization to process */
  organizationId?: string;
  /** Start date for rollup period */
  fromDate: Date;
  /** End date for rollup period */
  toDate: Date;
  /** Attribution model to use */
  attributionModel: AttributionModel;
  /** Force rebuild even if rollups exist */
  rebuild?: boolean;
}

export interface DailyRollupJobResult {
  startedAt: Date;
  completedAt: Date;
  attributionModel: AttributionModel;
  daysProcessed: number;
  rollupsCreated: number;
  rollupsUpdated: number;
  errors: number;
}

interface RollupMetrics {
  impressions: bigint;
  clicks: bigint;
  spendMicros: bigint;
  conversions: number;
  conversionValue: bigint;
  cpa: number | null;
  roas: number | null;
  ctr: number | null;
  cpc: number | null;
  wasteSpendMicros: bigint;
  wastePct: number;
}

/**
 * Run daily rollups job
 */
export async function runDailyRollupsV2(
  options: DailyRollupJobOptions
): Promise<DailyRollupJobResult> {
  const logger = appLogger.child({ job: "daily-rollups-v2" });
  const startedAt = new Date();

  logger.info("Starting daily rollups job", {
    organizationId: options.organizationId,
    fromDate: options.fromDate.toISOString(),
    toDate: options.toDate.toISOString(),
    attributionModel: options.attributionModel,
    rebuild: options.rebuild,
  });

  let daysProcessed = 0;
  let rollupsCreated = 0;
  let rollupsUpdated = 0;
  let errors = 0;

  try {
    // Get organizations to process
    const organizations = await prisma.organization.findMany({
      where: options.organizationId ? { id: options.organizationId } : {},
      select: { id: true },
    });

    // Process each day in the range
    const currentDate = new Date(options.fromDate);
    currentDate.setHours(0, 0, 0, 0);

    while (currentDate <= options.toDate) {
      logger.debug(`Processing date: ${currentDate.toISOString()}`);

      for (const org of organizations) {
        try {
          const result = await processDayRollups(
            org.id,
            currentDate,
            options.attributionModel,
            options.rebuild || false,
            logger
          );

          rollupsCreated += result.created;
          rollupsUpdated += result.updated;
        } catch (error) {
          errors++;
          logger.error(`Failed to process rollups for ${org.id} on ${currentDate.toISOString()}`, error as Error);
        }
      }

      daysProcessed++;
      currentDate.setDate(currentDate.getDate() + 1);
    }
  } catch (error) {
    logger.error("Daily rollups job failed", error as Error);
    throw error;
  }

  const completedAt = new Date();

  logger.info("Daily rollups job completed", {
    attributionModel: options.attributionModel,
    daysProcessed,
    rollupsCreated,
    rollupsUpdated,
    errors,
    durationMs: completedAt.getTime() - startedAt.getTime(),
  });

  return {
    startedAt,
    completedAt,
    attributionModel: options.attributionModel,
    daysProcessed,
    rollupsCreated,
    rollupsUpdated,
    errors,
  };
}

/**
 * Process rollups for a single day and organization
 */
async function processDayRollups(
  organizationId: string,
  date: Date,
  attributionModel: AttributionModel,
  rebuild: boolean,
  logger: typeof appLogger
): Promise<{ created: number; updated: number }> {
  let created = 0;
  let updated = 0;

  // Get cost data for the day
  const costData = await getCostData(organizationId, date);

  // Get attribution data for the day
  const attributionData = await getAttributionData(organizationId, date, attributionModel);

  // Create rollups at each grain level
  const grains: { grain: RollupGrain; groupBy: string[] }[] = [
    { grain: "ORGANIZATION", groupBy: [] },
    { grain: "PLATFORM", groupBy: ["platformId"] },
    { grain: "CAMPAIGN", groupBy: ["platformId", "campaignId"] },
    { grain: "ADSET", groupBy: ["platformId", "campaignId", "adsetId"] },
    { grain: "AD", groupBy: ["platformId", "campaignId", "adsetId", "adId"] },
  ];

  for (const { grain, groupBy } of grains) {
    const result = await createRollupsByGrain(
      organizationId,
      date,
      grain,
      groupBy,
      costData,
      attributionData,
      attributionModel,
      rebuild
    );

    created += result.created;
    updated += result.updated;
  }

  return { created, updated };
}

/**
 * Get cost data from DailyCampaignMetric
 */
async function getCostData(organizationId: string, date: Date) {
  return prisma.dailyCampaignMetric.findMany({
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
      campaign: {
        select: {
          id: true,
          externalId: true,
          name: true,
        },
      },
    },
  });
}

/**
 * Get attribution data by joining conversions with attribution links
 */
async function getAttributionData(
  organizationId: string,
  date: Date,
  attributionModel: AttributionModel
) {
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

  const conversionIds = conversions.map(c => c.id);

  // Get attribution links with weights
  const attributionLinks = await prisma.attributionLink.findMany({
    where: {
      conversionId: { in: conversionIds },
      model: attributionModel,
      weight: { gt: 0 }, // Only links with calculated weights
    },
    include: {
      touchPoint: {
        select: {
          platformCode: true,
          campaignId: true,
        },
      },
      conversion: {
        select: {
          valueMicros: true,
        },
      },
    },
  });

  // Map attribution links to platform/campaign with weighted conversions
  return attributionLinks.map(link => {
    const conversion = conversions.find(c => c.id === link.conversionId);
    
    return {
      platformCode: link.touchPoint.platformCode,
      campaignId: link.touchPoint.campaignId,
      conversions: link.weight, // Fractional conversion based on weight
      conversionValue: conversion?.valueMicros 
        ? BigInt(Math.round(Number(conversion.valueMicros) * link.weight))
        : BigInt(0),
    };
  });
}

/**
 * Create rollups for a specific grain level
 */
async function createRollupsByGrain(
  organizationId: string,
  date: Date,
  grain: RollupGrain,
  groupByFields: string[],
  costData: any[],
  attributionData: any[],
  attributionModel: AttributionModel,
  rebuild: boolean
): Promise<{ created: number; updated: number }> {
  let created = 0;
  let updated = 0;

  // Group data by the specified fields
  const groups = new Map<string, any>();

  // Group cost data
  for (const cost of costData) {
    const key = groupByFields.map(field => {
      if (field === "adsetId" || field === "adId") {
        return cost.campaign?.[field] || "null";
      }
      return cost[field] || "null";
    }).join("|");

    if (!groups.has(key)) {
      groups.set(key, {
        platformId: cost.platformId,
        campaignId: cost.campaignId,
        adsetId: cost.campaign?.adsetId,
        adId: cost.campaign?.adId,
        impressions: BigInt(0),
        clicks: BigInt(0),
        spendMicros: BigInt(0),
        conversions: 0,
        conversionValue: BigInt(0),
      });
    }

    const group = groups.get(key)!;
    group.impressions += cost.impressions;
    group.clicks += cost.clicks;
    group.spendMicros += cost.spendMicros;
  }

  // Add attribution data
  for (const attr of attributionData) {
    const key = groupByFields.map(field => {
      if (field === "platformId") {
        // Map platformCode to platformId (would need platform lookup)
        return attr.platformCode || "null";
      }
      return attr[field] || "null";
    }).join("|");

    if (groups.has(key)) {
      const group = groups.get(key)!;
      group.conversions += attr.conversions;
      group.conversionValue += attr.conversionValue;
    }
  }

  // Create/update rollups for each group
  for (const [key, data] of groups) {
    const metrics = calculateMetrics(
      data.impressions,
      data.clicks,
      data.spendMicros,
      data.conversions,
      data.conversionValue
    );

    const result = await upsertDailyRollup({
      organizationId,
      date,
      grain,
      platformId: groupByFields.includes("platformId") ? data.platformId : null,
      campaignId: groupByFields.includes("campaignId") ? data.campaignId : null,
      adsetId: groupByFields.includes("adsetId") ? data.adsetId : null,
      adId: groupByFields.includes("adId") ? data.adId : null,
      attributionModel,
      metrics: {
        ...metrics,
        impressions: data.impressions,
        clicks: data.clicks,
        spendMicros: data.spendMicros,
        conversions: data.conversions,
        conversionValue: data.conversionValue,
      },
      rebuild,
    });

    if (result.created) created++;
    else updated++;
  }

  return { created, updated };
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
): Omit<RollupMetrics, "impressions" | "clicks" | "spendMicros" | "conversions" | "conversionValue"> {
  const spend = Number(spendMicros) / 1_000_000;
  const revenue = Number(conversionValue) / 1_000_000;

  // CPA (Cost Per Acquisition)
  const cpa = conversions > 0 ? spend / conversions : null;

  // ROAS (Return On Ad Spend)
  const roas = spend > 0 ? revenue / spend : null;

  // CTR (Click-Through Rate)
  const ctr = impressions > 0 ? (Number(clicks) / Number(impressions)) * 100 : null;

  // CPC (Cost Per Click)
  const cpc = clicks > 0 ? spend / Number(clicks) : null;

  // Waste spend (spend with no conversions)
  const wasteSpendMicros = conversions === 0 ? spendMicros : BigInt(0);
  const wastePct = spend > 0 ? (Number(wasteSpendMicros) / Number(spendMicros)) * 100 : 0;

  return {
    cpa,
    roas,
    ctr,
    cpc,
    wasteSpendMicros,
    wastePct,
  };
}

/**
 * Upsert DailyRollup record (idempotent)
 */
async function upsertDailyRollup(params: {
  organizationId: string;
  date: Date;
  grain: RollupGrain;
  platformId: string | null;
  campaignId: string | null;
  adsetId: string | null;
  adId: string | null;
  attributionModel: AttributionModel;
  metrics: RollupMetrics;
  rebuild: boolean;
}): Promise<{ created: boolean }> {
  const {
    organizationId,
    date,
    grain,
    platformId,
    campaignId,
    adsetId,
    adId,
    attributionModel,
    metrics,
    rebuild,
  } = params;

  // Check if rollup already exists
  const existing = await prisma.dailyRollup.findFirst({
    where: {
      organizationId,
      date,
      grain,
      platformId,
      campaignId,
      adsetId,
      adId,
      attributionModel,
    },
  });

  if (existing && !rebuild) {
    // Skip if already exists and not rebuilding
    return { created: false };
  }

  // Upsert the rollup
  await prisma.dailyRollup.upsert({
    where: {
      organizationId_date_grain_platformId_campaignId_adsetId_adId_attributionModel: {
        organizationId,
        date,
        grain,
        platformId: platformId || "",
        campaignId: campaignId || "",
        adsetId: adsetId || "",
        adId: adId || "",
        attributionModel,
      },
    },
    create: {
      organizationId,
      date,
      grain,
      platformId,
      campaignId,
      adsetId,
      adId,
      attributionModel,
      impressions: metrics.impressions,
      clicks: metrics.clicks,
      spendMicros: metrics.spendMicros,
      conversions: metrics.conversions,
      conversionValue: metrics.conversionValue,
      attributedConversions: metrics.conversions,
      cpa: metrics.cpa,
      roas: metrics.roas,
      ctr: metrics.ctr,
      cpc: metrics.cpc,
      wasteSpendMicros: metrics.wasteSpendMicros,
      wastePct: metrics.wastePct,
    },
    update: {
      impressions: metrics.impressions,
      clicks: metrics.clicks,
      spendMicros: metrics.spendMicros,
      conversions: metrics.conversions,
      conversionValue: metrics.conversionValue,
      attributedConversions: metrics.conversions,
      cpa: metrics.cpa,
      roas: metrics.roas,
      ctr: metrics.ctr,
      cpc: metrics.cpc,
      wasteSpendMicros: metrics.wasteSpendMicros,
      wastePct: metrics.wastePct,
      updatedAt: new Date(),
    },
  });

  return { created: !existing };
}
