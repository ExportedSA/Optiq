/**
 * Google Ads Cost Sync Service
 * 
 * Syncs campaign, ad group, and ad costs from Google Ads API
 * Supports backfill (90 days) and incremental updates
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const GOOGLE_ADS_API_URL = "https://googleads.googleapis.com/v16";
const BACKFILL_DAYS = 90;

/**
 * Get valid access token (refresh if expired)
 */
async function getValidAccessToken(organizationId: string): Promise<string> {
  const credential = await prisma.googleAdsCredential.findFirst({
    where: { organizationId },
    orderBy: { createdAt: "desc" },
  });

  if (!credential) {
    throw new Error("No Google Ads credential found");
  }

  // Check if token is expired or will expire in next 5 minutes
  const expiresAt = new Date(credential.expiresAt);
  const now = new Date();
  const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60 * 1000);

  if (expiresAt <= fiveMinutesFromNow) {
    // Refresh token
    if (!credential.refreshToken) {
      throw new Error("No refresh token available");
    }

    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        refresh_token: credential.refreshToken,
        client_id: process.env.GOOGLE_CLIENT_ID || "",
        client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
        grant_type: "refresh_token",
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error("Failed to refresh token");
    }

    const tokens = await tokenResponse.json();
    const newExpiresAt = new Date(Date.now() + tokens.expires_in * 1000);

    await prisma.googleAdsCredential.update({
      where: { id: credential.id },
      data: {
        accessToken: tokens.access_token,
        expiresAt: newExpiresAt,
      },
    });

    return tokens.access_token;
  }

  return credential.accessToken;
}

/**
 * Normalize campaign/ad group/ad name
 * Removes special characters, trims whitespace
 */
function normalizeName(name: string): string {
  return name.trim().replace(/\s+/g, " ");
}

/**
 * Format date for Google Ads API (YYYY-MM-DD)
 */
function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

/**
 * Parse timezone-aware date from Google Ads
 */
function parseDate(dateString: string, timezone: string): Date {
  // Google Ads returns dates in account timezone
  // For simplicity, we'll use UTC and store the date as-is
  return new Date(dateString + "T00:00:00Z");
}

/**
 * Fetch campaigns from Google Ads API
 */
async function fetchCampaigns(
  accessToken: string,
  customerId: string,
): Promise<any[]> {
  const query = `
    SELECT
      campaign.id,
      campaign.name,
      campaign.status,
      campaign.advertising_channel_type,
      campaign.start_date,
      campaign.end_date
    FROM campaign
    WHERE campaign.status != 'REMOVED'
  `;

  const response = await fetch(
    `${GOOGLE_ADS_API_URL}/customers/${customerId}/googleAds:searchStream`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "developer-token": process.env.GOOGLE_ADS_DEVELOPER_TOKEN || "",
        "login-customer-id": customerId,
      },
      body: JSON.stringify({ query }),
    },
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to fetch campaigns: ${error}`);
  }

  const data = await response.json();
  return data.results || [];
}

/**
 * Fetch cost metrics from Google Ads API
 */
async function fetchCostMetrics(
  accessToken: string,
  customerId: string,
  startDate: Date,
  endDate: Date,
  timezone: string,
): Promise<any[]> {
  const query = `
    SELECT
      segments.date,
      campaign.id,
      campaign.name,
      ad_group.id,
      ad_group.name,
      ad_group_ad.ad.id,
      ad_group_ad.ad.name,
      metrics.impressions,
      metrics.clicks,
      metrics.cost_micros,
      metrics.conversions,
      metrics.conversions_value
    FROM ad_group_ad
    WHERE segments.date >= '${formatDate(startDate)}'
      AND segments.date <= '${formatDate(endDate)}'
  `;

  const response = await fetch(
    `${GOOGLE_ADS_API_URL}/customers/${customerId}/googleAds:searchStream`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "developer-token": process.env.GOOGLE_ADS_DEVELOPER_TOKEN || "",
        "login-customer-id": customerId,
      },
      body: JSON.stringify({ query }),
    },
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to fetch cost metrics: ${error}`);
  }

  const data = await response.json();
  return data.results || [];
}

/**
 * Sync campaigns for an account
 */
async function syncCampaigns(
  organizationId: string,
  platformId: string,
  accountId: string,
  customerId: string,
  accessToken: string,
): Promise<number> {
  const campaigns = await fetchCampaigns(accessToken, customerId);
  let synced = 0;

  for (const result of campaigns) {
    const campaign = result.campaign;

    await prisma.campaign.upsert({
      where: {
        organizationId_platformId_externalId: {
          organizationId,
          platformId,
          externalId: campaign.id.toString(),
        },
      },
      create: {
        organizationId,
        platformId,
        adAccountId: accountId,
        externalId: campaign.id.toString(),
        name: normalizeName(campaign.name),
        status: campaign.status === "ENABLED" ? "ACTIVE" : "PAUSED",
        objective: campaign.advertisingChannelType,
        startDate: campaign.startDate ? new Date(campaign.startDate) : null,
        endDate: campaign.endDate ? new Date(campaign.endDate) : null,
      },
      update: {
        name: normalizeName(campaign.name),
        status: campaign.status === "ENABLED" ? "ACTIVE" : "PAUSED",
        objective: campaign.advertisingChannelType,
        startDate: campaign.startDate ? new Date(campaign.startDate) : null,
        endDate: campaign.endDate ? new Date(campaign.endDate) : null,
      },
    });

    synced++;
  }

  return synced;
}

/**
 * Sync cost metrics for an account
 */
async function syncCostMetrics(
  organizationId: string,
  platformId: string,
  accountId: string,
  customerId: string,
  accessToken: string,
  startDate: Date,
  endDate: Date,
  timezone: string,
): Promise<{ synced: number; failed: number }> {
  const metrics = await fetchCostMetrics(accessToken, customerId, startDate, endDate, timezone);
  let synced = 0;
  let failed = 0;

  // Group metrics by date, campaign, ad group, and ad
  const groupedMetrics = new Map<string, any>();

  for (const result of metrics) {
    const date = parseDate(result.segments.date, timezone);
    const campaignId = result.campaign.id.toString();
    const adGroupId = result.adGroup?.id?.toString();
    const adId = result.adGroupAd?.ad?.id?.toString();

    // Create keys for different aggregation levels
    const campaignKey = `${formatDate(date)}_campaign_${campaignId}`;
    const adGroupKey = adGroupId ? `${formatDate(date)}_adgroup_${adGroupId}` : null;
    const adKey = adId ? `${formatDate(date)}_ad_${adId}` : null;

    // Aggregate campaign-level metrics
    if (!groupedMetrics.has(campaignKey)) {
      groupedMetrics.set(campaignKey, {
        type: "campaign",
        date,
        campaignId,
        campaignName: result.campaign.name,
        impressions: 0,
        clicks: 0,
        costMicros: 0,
        conversions: 0,
        conversionsValue: 0,
      });
    }
    const campaignMetric = groupedMetrics.get(campaignKey);
    campaignMetric.impressions += parseInt(result.metrics.impressions || "0");
    campaignMetric.clicks += parseInt(result.metrics.clicks || "0");
    campaignMetric.costMicros += parseInt(result.metrics.costMicros || "0");
    campaignMetric.conversions += parseFloat(result.metrics.conversions || "0");
    campaignMetric.conversionsValue += parseFloat(result.metrics.conversionsValue || "0");

    // Aggregate ad-level metrics
    if (adKey) {
      if (!groupedMetrics.has(adKey)) {
        groupedMetrics.set(adKey, {
          type: "ad",
          date,
          campaignId,
          adId,
          adName: result.adGroupAd.ad.name,
          impressions: 0,
          clicks: 0,
          costMicros: 0,
          conversions: 0,
          conversionsValue: 0,
        });
      }
      const adMetric = groupedMetrics.get(adKey);
      adMetric.impressions += parseInt(result.metrics.impressions || "0");
      adMetric.clicks += parseInt(result.metrics.clicks || "0");
      adMetric.costMicros += parseInt(result.metrics.costMicros || "0");
      adMetric.conversions += parseFloat(result.metrics.conversions || "0");
      adMetric.conversionsValue += parseFloat(result.metrics.conversionsValue || "0");
    }
  }

  // Store metrics in database
  for (const [key, metric] of groupedMetrics.entries()) {
    try {
      if (metric.type === "campaign") {
        // Get campaign from database
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
              spendMicros: BigInt(metric.costMicros),
              conversions: metric.conversions,
              revenue: BigInt(Math.round(metric.conversionsValue * 1_000_000)),
            },
            update: {
              impressions: BigInt(metric.impressions),
              clicks: BigInt(metric.clicks),
              spendMicros: BigInt(metric.costMicros),
              conversions: metric.conversions,
              revenue: BigInt(Math.round(metric.conversionsValue * 1_000_000)),
            },
          });
          synced++;
        }
      } else if (metric.type === "ad") {
        // Get ad from database
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
              spendMicros: BigInt(metric.costMicros),
              conversions: metric.conversions,
              revenue: BigInt(Math.round(metric.conversionsValue * 1_000_000)),
            },
            update: {
              impressions: BigInt(metric.impressions),
              clicks: BigInt(metric.clicks),
              spendMicros: BigInt(metric.costMicros),
              conversions: metric.conversions,
              revenue: BigInt(Math.round(metric.conversionsValue * 1_000_000)),
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
 * Sync Google Ads data for an organization
 */
export async function syncGoogleAdsData(
  organizationId: string,
  options: {
    backfill?: boolean;
    startDate?: Date;
    endDate?: Date;
  } = {},
): Promise<{
  success: boolean;
  campaigns: number;
  metrics: { synced: number; failed: number };
  error?: string;
}> {
  try {
    // Get access token
    const accessToken = await getValidAccessToken(organizationId);

    // Get credential to find customer IDs
    const credential = await prisma.googleAdsCredential.findFirst({
      where: { organizationId },
      orderBy: { createdAt: "desc" },
    });

    if (!credential) {
      throw new Error("No credential found");
    }

    const customerIds = credential.customerIds.split(",");

    // Get or create platform
    let platform = await prisma.platform.findUnique({
      where: { code: "GOOGLE_ADS" },
    });

    if (!platform) {
      platform = await prisma.platform.create({
        data: {
          code: "GOOGLE_ADS",
          name: "Google Ads",
        },
      });
    }

    let totalCampaigns = 0;
    let totalMetrics = { synced: 0, failed: 0 };

    // Process each customer account
    for (const customerId of customerIds) {
      // Get or create ad account
      let account = await prisma.adAccount.findFirst({
        where: {
          organizationId,
          platformId: platform.id,
          externalId: customerId,
        },
      });

      if (!account) {
        account = await prisma.adAccount.create({
          data: {
            organizationId,
            platformId: platform.id,
            externalId: customerId,
            name: `Google Ads Account ${customerId}`,
            currency: "USD", // TODO: Fetch from API
            timezone: "UTC", // TODO: Fetch from API
          },
        });
      }

      // Sync campaigns
      const campaignCount = await syncCampaigns(
        organizationId,
        platform.id,
        account.id,
        customerId,
        accessToken,
      );
      totalCampaigns += campaignCount;

      // Determine date range
      let startDate = options.startDate || new Date();
      let endDate = options.endDate || new Date();

      if (options.backfill) {
        // Backfill last 90 days
        startDate = new Date();
        startDate.setDate(startDate.getDate() - BACKFILL_DAYS);
        endDate = new Date();
      } else if (!options.startDate) {
        // Incremental: yesterday only
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 1);
        endDate = new Date(startDate);
      }

      // Sync cost metrics
      const metricsResult = await syncCostMetrics(
        organizationId,
        platform.id,
        account.id,
        customerId,
        accessToken,
        startDate,
        endDate,
        account.timezone,
      );

      totalMetrics.synced += metricsResult.synced;
      totalMetrics.failed += metricsResult.failed;
    }

    return {
      success: true,
      campaigns: totalCampaigns,
      metrics: totalMetrics,
    };
  } catch (error) {
    console.error("Google Ads sync failed:", error);
    return {
      success: false,
      campaigns: 0,
      metrics: { synced: 0, failed: 0 },
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Run daily Google Ads sync job
 */
export async function runGoogleAdsSyncJob(): Promise<void> {
  console.log("Starting Google Ads sync job...");

  // Get all organizations with Google Ads credentials
  const credentials = await prisma.googleAdsCredential.findMany({
    distinct: ["organizationId"],
    select: { organizationId: true },
  });

  for (const { organizationId } of credentials) {
    try {
      console.log(`Syncing Google Ads for organization: ${organizationId}`);
      const result = await syncGoogleAdsData(organizationId, { backfill: false });
      console.log(`  Campaigns: ${result.campaigns}`);
      console.log(`  Metrics synced: ${result.metrics.synced}`);
      console.log(`  Metrics failed: ${result.metrics.failed}`);
    } catch (error) {
      console.error(`Failed to sync organization ${organizationId}:`, error);
    }
  }

  console.log("Google Ads sync job completed");
}
