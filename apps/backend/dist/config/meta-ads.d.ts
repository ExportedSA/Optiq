/**
 * Meta Ads Configuration
 *
 * API versions, rate limits, and retry settings
 */
export declare const META_ADS_CONFIG: {
    readonly apiVersion: "v19.0";
    readonly baseUrl: "https://graph.facebook.com";
    readonly oauthUrl: "https://www.facebook.com/v19.0/dialog/oauth";
    readonly tokenUrl: "https://graph.facebook.com/v19.0/oauth/access_token";
    readonly scopes: readonly ["ads_read", "ads_management", "business_management"];
    readonly rateLimits: {
        readonly callsPerHour: 200;
        readonly callsPerMinute: 200;
        readonly burstLimit: 50;
    };
    readonly retry: {
        readonly maxAttempts: 3;
        readonly initialDelayMs: 1000;
        readonly maxDelayMs: 30000;
        readonly backoffMultiplier: 2;
        readonly retryableStatusCodes: readonly [429, 500, 502, 503, 504];
    };
    readonly paging: {
        readonly defaultLimit: 100;
        readonly maxLimit: 500;
    };
    readonly sync: {
        readonly backfillDays: 90;
        readonly batchSize: 25;
        readonly concurrentRequests: 5;
    };
    readonly insights: {
        readonly fields: readonly ["campaign_id", "campaign_name", "adset_id", "adset_name", "ad_id", "ad_name", "impressions", "clicks", "spend", "actions", "action_values"];
        readonly breakdowns: readonly ["publisher_platform"];
        readonly actionTypes: readonly ["purchase", "add_to_cart", "lead", "complete_registration"];
    };
};
export type MetaAdsConfig = typeof META_ADS_CONFIG;
//# sourceMappingURL=meta-ads.d.ts.map