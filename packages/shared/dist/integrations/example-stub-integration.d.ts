import { BaseIntegration } from "./base-integration";
import type { ConnectionParams, ConnectionResult, IntegrationConfig, OAuthToken, PlatformCode, SyncOptions, SyncResult } from "./types";
export declare class ExampleStubIntegration extends BaseIntegration {
    readonly platform: PlatformCode;
    readonly name = "Example Stub";
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
}
//# sourceMappingURL=example-stub-integration.d.ts.map