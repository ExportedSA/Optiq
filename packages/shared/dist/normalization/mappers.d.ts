import type { NormalizedCostRow } from "./types";
export type MetaInsightInput = {
    date_start: string;
    campaign_id?: string;
    campaign_name?: string;
    adset_id?: string;
    adset_name?: string;
    ad_id?: string;
    ad_name?: string;
    impressions?: string;
    clicks?: string;
    spend?: string;
    publisher_platform?: string;
};
export declare function mapMetaInsightToNormalized(row: MetaInsightInput): NormalizedCostRow;
export type TikTokReportingRowInput = {
    date: string;
    campaignId: string;
    campaignName?: string;
    adId?: string;
    adName?: string;
    impressions: bigint;
    clicks: bigint;
    spendMicros: bigint;
};
export declare function mapTikTokRowToNormalized(row: TikTokReportingRowInput): NormalizedCostRow;
export type GoogleAdsRowInput = {
    date: string;
    campaignId: string;
    campaignName?: string;
    adGroupId?: string;
    adGroupName?: string;
    adId?: string;
    adName?: string;
    impressions: bigint;
    clicks: bigint;
    spendMicros: bigint;
};
export declare function mapGoogleAdsRowToNormalized(row: GoogleAdsRowInput): NormalizedCostRow;
//# sourceMappingURL=mappers.d.ts.map