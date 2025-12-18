/**
 * Meta Ads Cost Sync Service
 * 
 * Syncs campaign, ad set, and ad costs from Meta Marketing API
 * Includes Facebook and Instagram via Meta's unified API
 */

import { PrismaClient } from "@prisma/client";
import { META_ADS_CONFIG } from "../config/meta-ads";
import { createMetaApiClient } from "./meta-api-client";

const prisma = new PrismaClient();

/**
 * Get valid access token (refresh if needed)
 */
async function getValidAccessToken(organizationId: string): Promise<string> {
  const credential = await prisma.metaAdsCredential.findFirst({
    where: { organizationId },
    orderBy: { createdAt: "desc" },
  });

  if (!credential) {
    throw new Error("No Meta Ads credential found");
  }

  // Check if token will expire in next 7 days
  const expiresAt = new Date(credential.expiresAt);
  const sevenDaysFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  if (expiresAt <= sevenDaysFromNow) {
    // Refresh token
    const refreshUrl = new URL(`${META_ADS_CONFIG.baseUrl}/${META_ADS_CONFIG.apiVersion}/oauth/access_token`);
    refreshUrl.searchParams.set("grant_type", "fb_exchange_token");
    refreshUrl.searchParams.set("client_id", process.env.META_APP_ID || "");
    refreshUrl.searchParams.set("client_secret", process.env.META_APP_SECRET || "");
    refreshUrl.searchParams.set("fb_exchange_token", credential.accessToken);

    const response = await fetch(refreshUrl.toString());

    if (!response.ok) {
      throw new Error("Failed to refresh token");
    }

    const tokenData = await response.json();
    const newExpiresAt = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000);

    await prisma.metaAdsCredential.update({
      where: { id: credential.id },
      data: {
        accessToken: tokenData.access_token,
        expiresAt: newExpiresAt,
      },
    });

    return tokenData.access_token;
  }

  return credential.accessToken;
}

/**
 * Normalize name
 */
function normalizeName(name: string): string {
  return name.trim().replace(/\s+/g, " ");
}

/**
 * Format date for Meta API (YYYY-MM-DD)
 */
function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

/**
 * Sync campaigns for an account
 */
async function syncCampaigns(
  organizationId: string,
  platformId: string,
  accountId: string,
  adAccountId: string,
  client: any,
): Promise<number> {
  const campaigns = await client.fetchAll(`${adAccountId}/campaigns`, {
    fields: "id,name,status,objective,start_time,stop_time",
  });

  let synced = 0;

  for (const campaign of campaigns) {
    await prisma.campaign.upsert({
      where: {
        organizationId_platformId_externalId: {
          organizationId,
          platformId,
          externalId: campaign.id,
        },
      },
      create: {
        organizationId,
        platformId,
        adAccountId: accountId,
        externalId: campaign.id,
        name: normalizeName(campaign.name),
        status: campaign.status === "ACTIVE" ? "ACTIVE" : "PAUSED",
        objective: campaign.objective,
        startDate: campaign.start_time ? new Date(campaign.start_time) : null,
        endDate: campaign.stop_time ? new Date(campaign.stop_time) : null,
      },
      update: {
        name: normalizeName(campaign.name),
        status: campaign.status === "ACTIVE" ? "ACTIVE" : "PAUSED",
        objective: campaign.objective,
        startDate: campaign.start_time ? new Date(campaign.start_time) : null,
        endDate: campaign.stop_time ? new Date(campaign.stop_time) : null,
      },
    });

    synced++;
  }

  return synced;
}

/**
 * Sync ads for campaigns
 */
async function syncAds(
  organizationId: string,
  platformId: string,
  accountId: string,
  adAccountId: string,
  client: any,
): Promise<number> {
  const ads = await client.fetchAll(`${adAccountId}/ads`, {
    fields: "id,name,status,campaign_id,creative",
  });

  let synced = 0;

  for (const ad of ads) {
    // Find campaign in database
    const campaign = await prisma.campaign.findFirst({
      where: {
        organizationId,
        platformId,
        externalId: ad.campaign_id,
      },
    });

    if (campaign) {
      await prisma.ad.upsert({
        where: {
          organizationId_platformId_externalId: {
            organizationId,
            platformId,
            externalId: ad.id,
          },
        },
        create: {
          organizationId,
          platformId,
          adAccountId: accountId,
          campaignId: campaign.id,
          externalId: ad.id,
          name: normalizeName(ad.name),
          status: ad.status === "ACTIVE" ? "ACTIVE" : "PAUSED",
        },
        update: {
          name: normalizeName(ad.name),
          status: ad.status === "ACTIVE" ? "ACTIVE" : "PAUSED",
        },
      });

      synced++;
    }
  }

  return synced;
}

/**
 * Sync cost insights for an account
 */
async function syncCostInsights(
  organizationId: string,
  platformId: string,
  accountId: string,
  adAccountId: string,
  client: any,
  startDate: Date,
  endDate: Date,
): Promise<{ synced: number; failed: number }> {
  const insights = await client.fetchAll(`${adAccountId}/insights`, {
    fields: META_ADS_CONFIG.insights.fields.join(","),
    time_range: JSON.stringify({
      since: formatDate(startDate),
      until: formatDate(endDate),
    }),
    level: "ad",
    time_increment: "1",
    breakdowns: META_ADS_CONFIG.insights.breakdowns.join(","),
  });

  let synced = 0;
  let failed = 0;

  // Group insights by date and campaign/ad
  const groupedInsights = new Map<string, any>();

  for (const insight of insights) {
    const date = new Date(insight.date_start);
    const campaignId = insight.campaign_id;
    const adId = insight.ad_id;

    // Campaign-level key
    const campaignKey = `${formatDate(date)}_campaign_${campaignId}`;
    if (!groupedInsights.has(campaignKey)) {
      groupedInsights.set(campaignKey, {
        type: "campaign",
        date,
        campaignId,
        campaignName: insight.campaign_name,
        impressions: 0,
        clicks: 0,
        spend: 0,
        conversions: 0,
        revenue: 0,
      });
    }
    const campaignMetric = groupedInsights.get(campaignKey);
    campaignMetric.impressions += parseInt(insight.impressions || "0");
    campaignMetric.clicks += parseInt(insight.clicks || "0");
    campaignMetric.spend += parseFloat(insight.spend || "0");

    // Extract conversions and revenue from actions
    if (insight.actions) {
      for (const action of insight.actions) {
        if (META_ADS_CONFIG.insights.actionTypes.includes(action.action_type)) {
          campaignMetric.conversions += parseFloat(action.value || "0");
        }
      }
    }
    if (insight.action_values) {
      for (const actionValue of insight.action_values) {
        if (actionValue.action_type === "purchase") {
          campaignMetric.revenue += parseFloat(actionValue.value || "0");
        }
      }
    }

    // Ad-level key
    const adKey = `${formatDate(date)}_ad_${adId}`;
    if (!groupedInsights.has(adKey)) {
      groupedInsights.set(adKey, {
        type: "ad",
        date,
        campaignId,
        adId,
        adName: insight.ad_name,
        impressions: 0,
        clicks: 0,
        spend: 0,
        conversions: 0,
        revenue: 0,
      });
    }
    const adMetric = groupedInsights.get(adKey);
    adMetric.impressions += parseInt(insight.impressions || "0");
    adMetric.clicks += parseInt(insight.clicks || "0");
    adMetric.spend += parseFloat(insight.spend || "0");

    if (insight.actions) {
      for (const action of insight.actions) {
        if (META_ADS_CONFIG.insights.actionTypes.includes(action.action_type)) {
          adMetric.conversions += parseFloat(action.value || "0");
        }
      }
    }
    if (insight.action_values) {
      for (const actionValue of insight.action_values) {
        if (actionValue.action_type === "purchase") {
          adMetric.revenue += parseFloat(actionValue.value || "0");
        }
      }
    }
  }

  // Store metrics in database
  for (const [key, metric] of groupedInsights.entries()) {
    try {
      if (metric.type === "campaign") {
        const campaign = await prisma.campaign.findFirst({
          where: {
            organizationId,
            platformId,
            externalId: metric.campaignId,
          },
        });

        if (campaign) {
          await prisma.dailyCampaignMetric.upsert({
            where: {
              organizationId_platformId_campaignId_date: {
                organizationId,
                platformId,
                campaignId: campaign.id,
                date: metric.date,
              },
            },
            create: {
              organizationId,
              platformId,
              adAccountId: accountId,
              campaignId: campaign.id,
              date: metric.date,
              impressions: BigInt(metric.impressions),
              clicks: BigInt(metric.clicks),
              spendMicros: BigInt(Math.round(metric.spend * 1_000_000)),
              conversions: metric.conversions,
              revenue: BigInt(Math.round(metric.revenue * 1_000_000)),
            },
            update: {
              impressions: BigInt(metric.impressions),
              clicks: BigInt(metric.clicks),
              spendMicros: BigInt(Math.round(metric.spend * 1_000_000)),
              conversions: metric.conversions,
              revenue: BigInt(Math.round(metric.revenue * 1_000_000)),
            },
          });
          synced++;
        }
      } else if (metric.type === "ad") {
        const ad = await prisma.ad.findFirst({
          where: {
            organizationId,
            platformId,
            externalId: metric.adId,
          },
        });

        if (ad) {
          await prisma.dailyAdMetric.upsert({
            where: {
              organizationId_platformId_adId_date: {
                organizationId,
                platformId,
                adId: ad.id,
                date: metric.date,
              },
            },
            create: {
              organizationId,
              platformId,
              adAccountId: accountId,
              campaignId: ad.campaignId,
              adId: ad.id,
              date: metric.date,
              impressions: BigInt(metric.impressions),
              clicks: BigInt(metric.clicks),
              spendMicros: BigInt(Math.round(metric.spend * 1_000_000)),
              conversions: metric.conversions,
              revenue: BigInt(Math.round(metric.revenue * 1_000_000)),
            },
            update: {
              impressions: BigInt(metric.impressions),
              clicks: BigInt(metric.clicks),
              spendMicros: BigInt(Math.round(metric.spend * 1_000_000)),
              conversions: metric.conversions,
              revenue: BigInt(Math.round(metric.revenue * 1_000_000)),
            },
          });
          synced++;
        }
      }
    } catch (error) {
      console.error(`Failed to store metric ${key}:`, error);
      failed++;
    }
  }

  return { synced, failed };
}

/**
 * Sync Meta Ads data for an organization
 */
export async function syncMetaAdsData(
  organizationId: string,
  options: {
    backfill?: boolean;
    startDate?: Date;
    endDate?: Date;
  } = {},
): Promise<{
  success: boolean;
  campaigns: number;
  ads: number;
  metrics: { synced: number; failed: number };
  error?: string;
}> {
  try {
    // Get access token
    const accessToken = await getValidAccessToken(organizationId);

    // Create API client
    const client = createMetaApiClient(accessToken);

    // Get credential to find account IDs
    const credential = await prisma.metaAdsCredential.findFirst({
      where: { organizationId },
      orderBy: { createdAt: "desc" },
    });

    if (!credential) {
      throw new Error("No credential found");
    }

    const accountIds = credential.accountIds.split(",");

    // Get or create platform
    let platform = await prisma.platform.findUnique({
      where: { code: "META" },
    });

    if (!platform) {
      platform = await prisma.platform.create({
        data: {
          code: "META",
          name: "Meta Ads",
        },
      });
    }

    let totalCampaigns = 0;
    let totalAds = 0;
    let totalMetrics = { synced: 0, failed: 0 };

    // Process each ad account
    for (const adAccountId of accountIds) {
      // Get or create ad account
      let account = await prisma.adAccount.findFirst({
        where: {
          organizationId,
          platformId: platform.id,
          externalId: adAccountId,
        },
      });

      if (!account) {
        // Fetch account details
        const accountData = await client.request<any>(adAccountId, {
          fields: "name,currency,timezone_name",
        });

        account = await prisma.adAccount.create({
          data: {
            organizationId,
            platformId: platform.id,
            externalId: adAccountId,
            name: accountData.name || `Meta Ad Account ${adAccountId}`,
            currency: accountData.currency || "USD",
            timezone: accountData.timezone_name || "UTC",
          },
        });
      }

      // Sync campaigns
      const campaignCount = await syncCampaigns(
        organizationId,
        platform.id,
        account.id,
        adAccountId,
        client,
      );
      totalCampaigns += campaignCount;

      // Sync ads
      const adCount = await syncAds(
        organizationId,
        platform.id,
        account.id,
        adAccountId,
        client,
      );
      totalAds += adCount;

      // Determine date range
      let startDate = options.startDate || new Date();
      let endDate = options.endDate || new Date();

      if (options.backfill) {
        startDate = new Date();
        startDate.setDate(startDate.getDate() - META_ADS_CONFIG.sync.backfillDays);
        endDate = new Date();
      } else if (!options.startDate) {
        // Incremental: yesterday only
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 1);
        endDate = new Date(startDate);
      }

      // Sync cost insights
      const metricsResult = await syncCostInsights(
        organizationId,
        platform.id,
        account.id,
        adAccountId,
        client,
        startDate,
        endDate,
      );

      totalMetrics.synced += metricsResult.synced;
      totalMetrics.failed += metricsResult.failed;
    }

    return {
      success: true,
      campaigns: totalCampaigns,
      ads: totalAds,
      metrics: totalMetrics,
    };
  } catch (error) {
    console.error("Meta Ads sync failed:", error);
    return {
      success: false,
      campaigns: 0,
      ads: 0,
      metrics: { synced: 0, failed: 0 },
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Run daily Meta Ads sync job
 */
export async function runMetaAdsSyncJob(): Promise<void> {
  console.log("Starting Meta Ads sync job...");

  // Get all organizations with Meta Ads credentials
  const credentials = await prisma.metaAdsCredential.findMany({
    distinct: ["organizationId"],
    select: { organizationId: true },
  });

  for (const { organizationId } of credentials) {
    try {
      console.log(`Syncing Meta Ads for organization: ${organizationId}`);
      const result = await syncMetaAdsData(organizationId, { backfill: false });
      console.log(`  Campaigns: ${result.campaigns}`);
      console.log(`  Ads: ${result.ads}`);
      console.log(`  Metrics synced: ${result.metrics.synced}`);
      console.log(`  Metrics failed: ${result.metrics.failed}`);
    } catch (error) {
      console.error(`Failed to sync organization ${organizationId}:`, error);
    }
  }

  console.log("Meta Ads sync job completed");
}
