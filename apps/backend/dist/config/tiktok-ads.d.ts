/**
 * TikTok Ads Configuration
 *
 * API versions, endpoints, and sync settings
 */
export declare const TIKTOK_ADS_CONFIG: {
    readonly apiVersion: "v1.3";
    readonly baseUrl: "https://business-api.tiktok.com/open_api";
    readonly authUrl: "https://business-api.tiktok.com/portal/auth";
    readonly tokenUrl: "https://business-api.tiktok.com/open_api/v1.3/oauth2/access_token";
    readonly scopes: readonly ["ad_account:read", "campaign:read", "adgroup:read", "ad:read", "reporting:read"];
    readonly rateLimits: {
        readonly defaultCallsPerMinute: 60;
        readonly reportingCallsPerMinute: 10;
    };
    readonly retry: {
        readonly maxAttempts: 3;
        readonly initialDelayMs: 1000;
        readonly maxDelayMs: 30000;
        readonly backoffMultiplier: 2;
        readonly retryableStatusCodes: readonly [429, 500, 502, 503, 504];
    };
    readonly paging: {
        readonly defaultPageSize: 100;
        readonly maxPageSize: 1000;
    };
    readonly sync: {
        readonly backfillDays: 90;
        readonly batchSize: 20;
    };
    readonly reporting: {
        readonly dimensions: readonly ["ad_id", "adgroup_id", "campaign_id"];
        readonly metrics: readonly ["spend", "impressions", "clicks", "conversion", "cost_per_conversion", "conversion_rate", "total_complete_payment_rate"];
        readonly dataLevel: "AUCTION_AD";
    };
};
export type TikTokAdsConfig = typeof TIKTOK_ADS_CONFIG;
//# sourceMappingURL=tiktok-ads.d.ts.map