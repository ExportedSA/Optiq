/**
 * TikTok Ads Configuration
 * 
 * API versions, endpoints, and sync settings
 */

export const TIKTOK_ADS_CONFIG = {
  // API Configuration
  apiVersion: "v1.3",
  baseUrl: "https://business-api.tiktok.com/open_api",
  authUrl: "https://business-api.tiktok.com/portal/auth",
  tokenUrl: "https://business-api.tiktok.com/open_api/v1.3/oauth2/access_token",
  
  // OAuth Scopes
  scopes: [
    "ad_account:read",
    "campaign:read",
    "adgroup:read",
    "ad:read",
    "reporting:read",
  ],
  
  // Rate Limits (TikTok uses different limits per endpoint)
  rateLimits: {
    defaultCallsPerMinute: 60,
    reportingCallsPerMinute: 10,
  },
  
  // Retry Configuration
  retry: {
    maxAttempts: 3,
    initialDelayMs: 1000,
    maxDelayMs: 30000,
    backoffMultiplier: 2,
    retryableStatusCodes: [429, 500, 502, 503, 504],
  },
  
  // Paging Configuration
  paging: {
    defaultPageSize: 100,
    maxPageSize: 1000,
  },
  
  // Sync Configuration
  sync: {
    backfillDays: 90,
    batchSize: 20,
  },
  
  // Reporting Configuration
  reporting: {
    dimensions: ["ad_id", "adgroup_id", "campaign_id"],
    metrics: [
      "spend",
      "impressions",
      "clicks",
      "conversion",
      "cost_per_conversion",
      "conversion_rate",
      "total_complete_payment_rate",
    ],
    dataLevel: "AUCTION_AD", // Ad-level reporting
  },
} as const;

export type TikTokAdsConfig = typeof TIKTOK_ADS_CONFIG;
