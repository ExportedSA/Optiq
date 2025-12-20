/**
 * Google Ads Integration (Example Stub)
 *
 * Demonstrates how to implement the integration framework
 */
import { BaseIntegration } from "./base-integration";
import type { PlatformCode, ConnectionParams, ConnectionResult, OAuthToken, SyncOptions, SyncResult, IntegrationConfig } from "./types";
/**
 * Google Ads integration implementation
 */
export declare class GoogleAdsIntegration extends BaseIntegration {
    readonly platform: PlatformCode;
    readonly name = "Google Ads";
    constructor(config: IntegrationConfig);
    protected getAuthEndpoint(): string;
    protected getTokenEndpoint(): string;
    connect(params: ConnectionParams): Promise<string>;
    completeConnection(organizationId: string, code: string, state?: string): Promise<ConnectionResult>;
    refreshToken(organizationId: string, accountId: string): Promise<OAuthToken>;
    syncAccounts(organizationId: string): Promise<SyncResult>;
    syncCampaigns(organizationId: string, accountId: string, options?: SyncOptions): Promise<SyncResult>;
    syncAds(organizationId: string, campaignId: string, options?: SyncOptions): Promise<SyncResult>;
    syncCosts(organizationId: string, accountId: string, options: SyncOptions): Promise<SyncResult>;
    testConnection(organizationId: string, accountId: string): Promise<boolean>;
    disconnect(organizationId: string, accountId: string): Promise<void>;
    private fetchAccountInfo;
    private fetchCampaigns;
    private fetchCostMetrics;
    private getAccessToken;
    private getStoredRefreshToken;
    private updateStoredToken;
    private removeStoredToken;
    private storeCampaign;
    private storeCostMetric;
}
//# sourceMappingURL=google-ads-integration.d.ts.map