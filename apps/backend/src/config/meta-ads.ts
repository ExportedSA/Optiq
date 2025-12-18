/**
 * Meta Ads Configuration
 * 
 * API versions, rate limits, and retry settings
 */

export const META_ADS_CONFIG = {
  // API Configuration
  apiVersion: "v19.0",
  baseUrl: "https://graph.facebook.com",
  
  // OAuth
  oauthUrl: "https://www.facebook.com/v19.0/dialog/oauth",
  tokenUrl: "https://graph.facebook.com/v19.0/oauth/access_token",
  scopes: [
    "ads_read",
    "ads_management",
    "business_management",
  ],
  
  // Rate Limits
  rateLimits: {
    callsPerHour: 200,
    callsPerMinute: 200,
    burstLimit: 50,
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
    defaultLimit: 100,
    maxLimit: 500,
  },
  
  // Sync Configuration
  sync: {
    backfillDays: 90,
    batchSize: 25,
    concurrentRequests: 5,
  },
  
  // Insights Configuration
  insights: {
    fields: [
      "campaign_id",
      "campaign_name",
      "adset_id",
      "adset_name",
      "ad_id",
      "ad_name",
      "impressions",
      "clicks",
      "spend",
      "actions",
      "action_values",
    ],
    breakdowns: ["publisher_platform"], // Facebook, Instagram, etc.
    actionTypes: [
      "purchase",
      "add_to_cart",
      "lead",
      "complete_registration",
    ],
  },
} as const;

export type MetaAdsConfig = typeof META_ADS_CONFIG;
