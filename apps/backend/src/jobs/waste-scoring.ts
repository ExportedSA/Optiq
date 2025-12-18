/**
 * Waste Scoring Aggregator
 * 
 * Identifies inefficient ad spend by:
 * - Finding spend with zero attributed conversions
 * - Detecting CPA breaches (actual > target)
 * - Detecting ROAS breaches (actual < target)
 * - Computing daily aggregates per workspace/channel
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Waste scoring configuration
 */
export interface WasteScoringConfig {
  /**
   * Attribution model to use for scoring
   */
  attributionModel: "FIRST_TOUCH" | "LAST_TOUCH" | "LINEAR" | "TIME_DECAY" | "POSITION_BASED";

  /**
   * Target CPA in dollars (optional)
   */
  targetCpa?: number;

  /**
   * Target ROAS (optional)
   */
  targetRoas?: number;

  /**
   * Date to score (defaults to yesterday)
   */
  date?: Date;
}

const DEFAULT_CONFIG: WasteScoringConfig = {
  attributionModel: "LAST_TOUCH",
  targetCpa: undefined,
  targetRoas: undefined,
};

/**
 * Convert dollars to micros
 */
function toMicros(dollars: number): bigint {
  return BigInt(Math.round(dollars * 1_000_000));
}

/**
 * Convert micros to dollars
 */
function fromMicros(micros: bigint): number {
  return Number(micros) / 1_000_000;
}

/**
 * Calculate waste score for a specific entity (platform/account/campaign/ad)
 */
async function calculateWasteScore(
  organizationId: string,
  date: Date,
  platformId?: string,
  adAccountId?: string,
  campaignId?: string,
  adId?: string,
  config: WasteScoringConfig = DEFAULT_CONFIG,
): Promise<void> {
  // Build where clause for metrics
  const metricsWhere: any = {
    organizationId,
    date,
    ...(platformId && { platformId }),
    ...(adAccountId && { adAccountId }),
    ...(campaignId && { campaignId }),
    ...(adId && { adId }),
  };

  // Get spend metrics
  let totalSpend = BigInt(0);
  
  if (adId) {
    // Ad level
    const metrics = await prisma.dailyAdMetric.findMany({ where: metricsWhere });
    totalSpend = metrics.reduce((sum, m) => sum + m.spendMicros, BigInt(0));
  } else if (campaignId) {
    // Campaign level
    const metrics = await prisma.dailyCampaignMetric.findMany({ where: metricsWhere });
    totalSpend = metrics.reduce((sum, m) => sum + m.spendMicros, BigInt(0));
  } else if (adAccountId) {
    // Account level
    const metrics = await prisma.dailyAdAccountMetric.findMany({ where: metricsWhere });
    totalSpend = metrics.reduce((sum, m) => sum + m.spendMicros, BigInt(0));
  }

  if (totalSpend === BigInt(0)) {
    return; // No spend, nothing to score
  }

  // Get attributed conversions for this entity
  // This requires joining attribution links to touchpoints to campaigns/ads
  const attributionLinks = await prisma.$queryRaw<Array<{
    conversions: bigint;
    revenue: bigint;
  }>>`
    SELECT 
      COUNT(DISTINCT al."conversionId") as conversions,
      COALESCE(SUM(te."valueMicros"), 0) as revenue
    FROM "AttributionLink" al
    JOIN "TouchPoint" tp ON al."touchPointId" = tp.id
    JOIN "TrackingEvent" te ON al."conversionId" = te.id
    WHERE al.model = ${config.attributionModel}
      AND tp."siteId" IN (
        SELECT id FROM "TrackingSite" WHERE "organizationId" = ${organizationId}
      )
      AND te."occurredAt"::date = ${date}
      ${adId ? prisma.sql`AND tp."adId" = ${adId}` : prisma.sql``}
      ${campaignId && !adId ? prisma.sql`AND tp."campaignId" = ${campaignId}` : prisma.sql``}
      ${adAccountId && !campaignId ? prisma.sql`AND tp."adAccountId" = ${adAccountId}` : prisma.sql``}
      ${platformId && !adAccountId ? prisma.sql`AND tp."platformId" = ${platformId}` : prisma.sql``}
  `;

  const attributedConversions = Number(attributionLinks[0]?.conversions || 0);
  const attributedRevenue = BigInt(attributionLinks[0]?.revenue || 0);

  // Calculate waste spend (spend with 0 conversions)
  const wasteSpend = attributedConversions === 0 ? totalSpend : BigInt(0);
  const wastePercent = attributedConversions === 0 ? 100 : 0;

  // Calculate CPA and ROAS
  const cpa = attributedConversions > 0 ? totalSpend / BigInt(attributedConversions) : null;
  const roas = totalSpend > BigInt(0) ? Number(attributedRevenue) / Number(totalSpend) : null;

  // Check target breaches
  const targetCpaMicros = config.targetCpa ? toMicros(config.targetCpa) : null;
  const cpaBreach = targetCpaMicros && cpa ? cpa > targetCpaMicros : false;
  const roasBreach = config.targetRoas && roas ? roas < config.targetRoas : false;

  // Upsert waste score
  await prisma.wasteScore.upsert({
    where: {
      organizationId_date_platformId_adAccountId_campaignId_adId_attributionModel: {
        organizationId,
        date,
        platformId: platformId || null,
        adAccountId: adAccountId || null,
        campaignId: campaignId || null,
        adId: adId || null,
        attributionModel: config.attributionModel,
      },
    },
    create: {
      organizationId,
      date,
      platformId,
      adAccountId,
      campaignId,
      adId,
      totalSpend,
      wasteSpend,
      attributedConversions,
      attributedRevenue,
      cpa,
      roas,
      wastePercent,
      targetCpa: targetCpaMicros,
      targetRoas: config.targetRoas,
      cpaBreach,
      roasBreach,
      attributionModel: config.attributionModel,
    },
    update: {
      totalSpend,
      wasteSpend,
      attributedConversions,
      attributedRevenue,
      cpa,
      roas,
      wastePercent,
      targetCpa: targetCpaMicros,
      targetRoas: config.targetRoas,
      cpaBreach,
      roasBreach,
    },
  });
}

/**
 * Calculate waste scores for all entities in an organization
 */
export async function calculateWasteScoresForOrganization(
  organizationId: string,
  config: WasteScoringConfig = DEFAULT_CONFIG,
): Promise<{
  processed: number;
  totalWaste: number;
  cpaBreach: number;
  roasBreach: number;
}> {
  const date = config.date || new Date(Date.now() - 24 * 60 * 60 * 1000); // Yesterday
  let processed = 0;
  let totalWaste = 0;
  let cpaBreach = 0;
  let roasBreach = 0;

  // Get all platforms for organization
  const platforms = await prisma.platform.findMany({
    where: {
      adAccounts: {
        some: { organizationId },
      },
    },
  });

  for (const platform of platforms) {
    // Platform level
    await calculateWasteScore(organizationId, date, platform.id, undefined, undefined, undefined, config);
    processed++;

    // Get accounts
    const accounts = await prisma.adAccount.findMany({
      where: { organizationId, platformId: platform.id },
    });

    for (const account of accounts) {
      // Account level
      await calculateWasteScore(organizationId, date, platform.id, account.id, undefined, undefined, config);
      processed++;

      // Get campaigns
      const campaigns = await prisma.campaign.findMany({
        where: { organizationId, adAccountId: account.id },
      });

      for (const campaign of campaigns) {
        // Campaign level
        await calculateWasteScore(organizationId, date, platform.id, account.id, campaign.id, undefined, config);
        processed++;

        // Get ads
        const ads = await prisma.ad.findMany({
          where: { organizationId, campaignId: campaign.id },
        });

        for (const ad of ads) {
          // Ad level
          await calculateWasteScore(organizationId, date, platform.id, account.id, campaign.id, ad.id, config);
          processed++;
        }
      }
    }
  }

  // Get summary stats
  const scores = await prisma.wasteScore.findMany({
    where: {
      organizationId,
      date,
      attributionModel: config.attributionModel,
    },
  });

  totalWaste = scores.reduce((sum, s) => sum + fromMicros(s.wasteSpend), 0);
  cpaBreach = scores.filter((s) => s.cpaBreach).length;
  roasBreach = scores.filter((s) => s.roasBreach).length;

  return {
    processed,
    totalWaste,
    cpaBreach,
    roasBreach,
  };
}

/**
 * Get waste score dashboard metrics
 */
export async function getWasteDashboardMetrics(
  organizationId: string,
  startDate: Date,
  endDate: Date,
  attributionModel: string = "LAST_TOUCH",
): Promise<{
  totalSpend: number;
  totalWaste: number;
  wastePercent: number;
  cpaBreach: number;
  roasBreach: number;
  topWasteCampaigns: Array<{
    campaignId: string;
    campaignName: string;
    wasteSpend: number;
    wastePercent: number;
  }>;
}> {
  const scores = await prisma.wasteScore.findMany({
    where: {
      organizationId,
      date: {
        gte: startDate,
        lte: endDate,
      },
      attributionModel,
    },
    include: {
      campaign: true,
    },
  });

  const totalSpend = scores.reduce((sum, s) => sum + fromMicros(s.totalSpend), 0);
  const totalWaste = scores.reduce((sum, s) => sum + fromMicros(s.wasteSpend), 0);
  const wastePercent = totalSpend > 0 ? (totalWaste / totalSpend) * 100 : 0;
  const cpaBreach = scores.filter((s) => s.cpaBreach).length;
  const roasBreach = scores.filter((s) => s.roasBreach).length;

  // Get top waste campaigns
  const campaignScores = scores.filter((s) => s.campaignId && s.campaign);
  const topWasteCampaigns = campaignScores
    .sort((a, b) => Number(b.wasteSpend - a.wasteSpend))
    .slice(0, 10)
    .map((s) => ({
      campaignId: s.campaignId!,
      campaignName: s.campaign!.name,
      wasteSpend: fromMicros(s.wasteSpend),
      wastePercent: s.wastePercent,
    }));

  return {
    totalSpend,
    totalWaste,
    wastePercent,
    cpaBreach,
    roasBreach,
    topWasteCampaigns,
  };
}

/**
 * Run waste scoring job for all organizations
 */
export async function runWasteScoringJob(config: WasteScoringConfig = DEFAULT_CONFIG): Promise<void> {
  console.log("Starting waste scoring job...");
  console.log("Config:", config);

  const organizations = await prisma.organization.findMany({
    select: { id: true, name: true },
  });

  for (const org of organizations) {
    try {
      console.log(`Processing organization: ${org.name}`);
      const result = await calculateWasteScoresForOrganization(org.id, config);
      console.log(`  Processed: ${result.processed} entities`);
      console.log(`  Total waste: $${result.totalWaste.toFixed(2)}`);
      console.log(`  CPA breaches: ${result.cpaBreach}`);
      console.log(`  ROAS breaches: ${result.roasBreach}`);
    } catch (error) {
      console.error(`Error processing organization ${org.name}:`, error);
    }
  }

  console.log("Waste scoring job completed");
}
