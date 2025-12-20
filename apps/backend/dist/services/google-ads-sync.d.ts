/**
 * Google Ads Cost Sync Service
 *
 * Syncs campaign, ad group, and ad costs from Google Ads API
 * Supports backfill (90 days) and incremental updates
 */
/**
 * Sync Google Ads data for an organization
 */
export declare function syncGoogleAdsData(organizationId: string, options?: {
    backfill?: boolean;
    startDate?: Date;
    endDate?: Date;
}): Promise<{
    success: boolean;
    campaigns: number;
    metrics: {
        synced: number;
        failed: number;
    };
    error?: string;
}>;
/**
 * Run daily Google Ads sync job
 */
export declare function runGoogleAdsSyncJob(): Promise<void>;
//# sourceMappingURL=google-ads-sync.d.ts.map