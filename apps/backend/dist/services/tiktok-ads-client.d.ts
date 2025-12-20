type TikTokTokenResponse = {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    refresh_expires_in: number;
    scope: string;
};
export type TikTokReportingRow = {
    date: string;
    campaignId: string;
    campaignName?: string;
    adId?: string;
    adName?: string;
    impressions: bigint;
    clicks: bigint;
    spendMicros: bigint;
    conversions: bigint;
};
export declare class TikTokAdsClient {
    private readonly baseUrl;
    constructor();
    buildAuthUrl(params: {
        state: string;
    }): string;
    exchangeCode(code: string): Promise<TikTokTokenResponse>;
    refreshToken(refreshToken: string): Promise<TikTokTokenResponse>;
    fetchDailyCampaignReport(params: {
        advertiserId: string;
        accessToken: string;
        startDate: string;
        endDate: string;
    }): Promise<TikTokReportingRow[]>;
    fetchDailyAdReport(params: {
        advertiserId: string;
        accessToken: string;
        startDate: string;
        endDate: string;
    }): Promise<TikTokReportingRow[]>;
    private fetchReport;
}
export {};
//# sourceMappingURL=tiktok-ads-client.d.ts.map