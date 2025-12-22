/**
 * Google Ads API Client
 * 
 * Fetches cost data from Google Ads API with rate limiting
 */

import "server-only";
import { appLogger } from "@/lib/observability";

const API_VERSION = "v16";
const BASE_URL = `https://googleads.googleapis.com/${API_VERSION}`;

// Rate limiting: 15,000 operations per day per developer token
// Conservative: ~6 requests per minute
const RATE_LIMIT_DELAY_MS = 10000; // 10 seconds between calls

export interface GoogleAdsCostData {
  date: string;
  grain: "CAMPAIGN" | "ADGROUP" | "AD";
  entityExternalId: string;
  entityName: string;
  campaignExternalId?: string;
  campaignName?: string;
  adGroupExternalId?: string;
  adGroupName?: string;
  adExternalId?: string;
  adName?: string;
  impressions: number;
  clicks: number;
  spendMicros: number;
}

interface GoogleAdsReportRow {
  segments?: {
    date?: string;
  };
  campaign?: {
    id?: string;
    name?: string;
  };
  adGroup?: {
    id?: string;
    name?: string;
  };
  adGroupAd?: {
    ad?: {
      id?: string;
      name?: string;
    };
  };
  metrics?: {
    impressions?: string;
    clicks?: string;
    costMicros?: string;
  };
}

/**
 * Fetch daily cost data from Google Ads API
 */
export async function fetchGoogleAdsCostData(
  accessToken: string,
  developerToken: string,
  customerId: string,
  startDate: Date,
  endDate: Date,
  grain: "CAMPAIGN" | "ADGROUP" | "AD" = "CAMPAIGN"
): Promise<GoogleAdsCostData[]> {
  const logger = appLogger.child({ integration: "google-ads-client" });

  const dateStart = startDate.toISOString().split("T")[0].replace(/-/g, "");
  const dateStop = endDate.toISOString().split("T")[0].replace(/-/g, "");

  // Build GAQL query based on grain
  let query: string;
  
  switch (grain) {
    case "CAMPAIGN":
      query = `
        SELECT
          segments.date,
          campaign.id,
          campaign.name,
          metrics.impressions,
          metrics.clicks,
          metrics.cost_micros
        FROM campaign
        WHERE segments.date BETWEEN '${dateStart}' AND '${dateStop}'
          AND campaign.status != 'REMOVED'
      `;
      break;
    case "ADGROUP":
      query = `
        SELECT
          segments.date,
          campaign.id,
          campaign.name,
          ad_group.id,
          ad_group.name,
          metrics.impressions,
          metrics.clicks,
          metrics.cost_micros
        FROM ad_group
        WHERE segments.date BETWEEN '${dateStart}' AND '${dateStop}'
          AND ad_group.status != 'REMOVED'
      `;
      break;
    case "AD":
      query = `
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
          metrics.cost_micros
        FROM ad_group_ad
        WHERE segments.date BETWEEN '${dateStart}' AND '${dateStop}'
          AND ad_group_ad.status != 'REMOVED'
      `;
      break;
  }

  const url = `${BASE_URL}/customers/${customerId}/googleAds:search`;
  
  const allData: GoogleAdsCostData[] = [];
  let pageToken: string | undefined;

  do {
    logger.debug("Fetching Google Ads report", { customerId, grain });

    const requestBody: any = { query };
    if (pageToken) {
      requestBody.pageToken = pageToken;
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "developer-token": developerToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const error = await response.text();
      logger.error("Google Ads API error", { status: response.status, error });
      
      // Handle rate limiting
      if (response.status === 429) {
        const retryAfter = response.headers.get("retry-after");
        const delayMs = retryAfter ? parseInt(retryAfter) * 1000 : 60000;
        logger.warn("Rate limited, waiting", { delayMs });
        await sleep(delayMs);
        continue; // Retry same request
      }

      throw new Error(`Google Ads API error: ${response.status} ${error}`);
    }

    const data = await response.json();
    const results: GoogleAdsReportRow[] = data.results || [];

    // Transform to our format
    for (const row of results) {
      const costData: GoogleAdsCostData = {
        date: row.segments?.date || "",
        grain,
        entityExternalId: "",
        entityName: "",
        impressions: parseInt(row.metrics?.impressions || "0"),
        clicks: parseInt(row.metrics?.clicks || "0"),
        spendMicros: parseInt(row.metrics?.costMicros || "0"),
      };

      // Set entity ID and name based on grain
      switch (grain) {
        case "CAMPAIGN":
          costData.entityExternalId = row.campaign?.id?.toString() || "";
          costData.entityName = row.campaign?.name || "";
          costData.campaignExternalId = row.campaign?.id?.toString();
          costData.campaignName = row.campaign?.name;
          break;
        case "ADGROUP":
          costData.entityExternalId = row.adGroup?.id?.toString() || "";
          costData.entityName = row.adGroup?.name || "";
          costData.campaignExternalId = row.campaign?.id?.toString();
          costData.campaignName = row.campaign?.name;
          costData.adGroupExternalId = row.adGroup?.id?.toString();
          costData.adGroupName = row.adGroup?.name;
          break;
        case "AD":
          costData.entityExternalId = row.adGroupAd?.ad?.id?.toString() || "";
          costData.entityName = row.adGroupAd?.ad?.name || "";
          costData.campaignExternalId = row.campaign?.id?.toString();
          costData.campaignName = row.campaign?.name;
          costData.adGroupExternalId = row.adGroup?.id?.toString();
          costData.adGroupName = row.adGroup?.name;
          costData.adExternalId = row.adGroupAd?.ad?.id?.toString();
          costData.adName = row.adGroupAd?.ad?.name;
          break;
      }

      allData.push(costData);
    }

    // Check for pagination
    pageToken = data.nextPageToken;

    // Rate limiting delay
    if (pageToken) {
      await sleep(RATE_LIMIT_DELAY_MS);
    }
  } while (pageToken);

  logger.info("Fetched Google Ads cost data", {
    customerId,
    grain,
    records: allData.length,
  });

  return allData;
}

/**
 * Sleep utility
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Retry wrapper with exponential backoff
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelayMs: number = 1000
): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt < maxRetries - 1) {
        const delayMs = baseDelayMs * Math.pow(2, attempt);
        await sleep(delayMs);
      }
    }
  }

  throw lastError;
}
