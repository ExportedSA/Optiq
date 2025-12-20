/**
 * Meta Ads API Client
 * 
 * Fetches cost data from Meta (Facebook) Ads API with rate limiting
 */

import "server-only";
import { appLogger } from "@/lib/observability";

const API_VERSION = "v18.0";
const BASE_URL = `https://graph.facebook.com/${API_VERSION}`;

// Rate limiting: 200 calls per hour per user
const RATE_LIMIT_DELAY_MS = 200; // ~18 seconds between calls to stay under limit

export interface MetaCostData {
  date: string;
  grain: "CAMPAIGN" | "ADSET" | "AD";
  entityExternalId: string;
  entityName: string;
  campaignExternalId?: string;
  campaignName?: string;
  adsetExternalId?: string;
  adsetName?: string;
  adExternalId?: string;
  adName?: string;
  impressions: number;
  clicks: number;
  spendMicros: number;
}

interface MetaInsightsResponse {
  data: Array<{
    date_start: string;
    date_stop: string;
    campaign_id?: string;
    campaign_name?: string;
    adset_id?: string;
    adset_name?: string;
    ad_id?: string;
    ad_name?: string;
    impressions: string;
    clicks: string;
    spend: string;
  }>;
  paging?: {
    cursors?: {
      before: string;
      after: string;
    };
    next?: string;
  };
}

/**
 * Fetch daily cost data from Meta Ads API
 */
export async function fetchMetaCostData(
  accessToken: string,
  adAccountId: string,
  startDate: Date,
  endDate: Date,
  grain: "CAMPAIGN" | "ADSET" | "AD" = "CAMPAIGN"
): Promise<MetaCostData[]> {
  const logger = appLogger.child({ integration: "meta-ads-client" });

  const dateStart = startDate.toISOString().split("T")[0];
  const dateStop = endDate.toISOString().split("T")[0];

  // Determine level and fields based on grain
  let level: string;
  let breakdowns: string[] = [];
  
  switch (grain) {
    case "CAMPAIGN":
      level = "campaign";
      break;
    case "ADSET":
      level = "adset";
      break;
    case "AD":
      level = "ad";
      break;
  }

  const fields = [
    "campaign_id",
    "campaign_name",
    "adset_id",
    "adset_name",
    "ad_id",
    "ad_name",
    "impressions",
    "clicks",
    "spend",
  ].join(",");

  const url = new URL(`${BASE_URL}/${adAccountId}/insights`);
  url.searchParams.set("access_token", accessToken);
  url.searchParams.set("level", level);
  url.searchParams.set("fields", fields);
  url.searchParams.set("time_range", JSON.stringify({
    since: dateStart,
    until: dateStop,
  }));
  url.searchParams.set("time_increment", "1"); // Daily breakdown
  url.searchParams.set("limit", "1000");

  const allData: MetaCostData[] = [];
  let nextUrl: string | undefined = url.toString();

  while (nextUrl) {
    logger.debug("Fetching Meta insights", { adAccountId, level, url: nextUrl });

    const response = await fetch(nextUrl);

    if (!response.ok) {
      const error = await response.text();
      logger.error("Meta API error", { status: response.status, error });
      
      // Handle rate limiting
      if (response.status === 429) {
        const retryAfter = response.headers.get("retry-after");
        const delayMs = retryAfter ? parseInt(retryAfter) * 1000 : 60000;
        logger.warn("Rate limited, waiting", { delayMs });
        await sleep(delayMs);
        continue; // Retry same request
      }

      throw new Error(`Meta API error: ${response.status} ${error}`);
    }

    const data: MetaInsightsResponse = await response.json();

    // Transform to our format
    for (const insight of data.data) {
      const costData: MetaCostData = {
        date: insight.date_start,
        grain,
        entityExternalId: "",
        entityName: "",
        impressions: parseInt(insight.impressions || "0"),
        clicks: parseInt(insight.clicks || "0"),
        spendMicros: Math.round(parseFloat(insight.spend || "0") * 1_000_000),
      };

      // Set entity ID and name based on grain
      switch (grain) {
        case "CAMPAIGN":
          costData.entityExternalId = insight.campaign_id || "";
          costData.entityName = insight.campaign_name || "";
          costData.campaignExternalId = insight.campaign_id;
          costData.campaignName = insight.campaign_name;
          break;
        case "ADSET":
          costData.entityExternalId = insight.adset_id || "";
          costData.entityName = insight.adset_name || "";
          costData.campaignExternalId = insight.campaign_id;
          costData.campaignName = insight.campaign_name;
          costData.adsetExternalId = insight.adset_id;
          costData.adsetName = insight.adset_name;
          break;
        case "AD":
          costData.entityExternalId = insight.ad_id || "";
          costData.entityName = insight.ad_name || "";
          costData.campaignExternalId = insight.campaign_id;
          costData.campaignName = insight.campaign_name;
          costData.adsetExternalId = insight.adset_id;
          costData.adsetName = insight.adset_name;
          costData.adExternalId = insight.ad_id;
          costData.adName = insight.ad_name;
          break;
      }

      allData.push(costData);
    }

    // Check for pagination
    nextUrl = data.paging?.next;

    // Rate limiting delay
    if (nextUrl) {
      await sleep(RATE_LIMIT_DELAY_MS);
    }
  }

  logger.info("Fetched Meta cost data", {
    adAccountId,
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
