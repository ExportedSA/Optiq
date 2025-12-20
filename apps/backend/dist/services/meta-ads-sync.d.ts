/**
 * Meta Ads Cost Sync Service
 *
 * Syncs campaign, ad set, and ad costs from Meta Marketing API
 * Includes Facebook and Instagram via Meta's unified API
 */
/**
 * Sync Meta Ads data for an organization
 */
export declare function syncMetaAdsData(organizationId: string, options?: {
    backfill?: boolean;
    startDate?: Date;
    endDate?: Date;
}): Promise<{
    success: boolean;
    campaigns: number;
    ads: number;
    metrics: {
        synced: number;
        failed: number;
    };
    error?: string;
}>;
/**
 * Run daily Meta Ads sync job
 */
export declare function runMetaAdsSyncJob(): Promise<void>;
//# sourceMappingURL=meta-ads-sync.d.ts.map