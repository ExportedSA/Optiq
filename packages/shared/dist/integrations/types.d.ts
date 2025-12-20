/**
 * Integration Framework Types
 *
 * Unified interfaces for ad platform integrations
 */
/**
 * Platform codes for supported integrations
 */
export type PlatformCode = "GOOGLE_ADS" | "META" | "TIKTOK" | "LINKEDIN" | "X";
/**
 * Integration status
 */
export type IntegrationStatus = "CONNECTED" | "DISCONNECTED" | "ERROR" | "EXPIRED";
/**
 * OAuth token data
 */
export interface OAuthToken {
    accessToken: string;
    refreshToken?: string;
    expiresAt?: Date;
    scope?: string;
    tokenType?: string;
}
/**
 * Connection parameters for OAuth flow
 */
export interface ConnectionParams {
    organizationId: string;
    redirectUri?: string;
    state?: string;
    scopes?: string[];
}
/**
 * Connection result
 */
export interface ConnectionResult {
    success: boolean;
    accountId?: string;
    accountName?: string;
    error?: string;
    token?: OAuthToken;
}
/**
 * Account metadata from platform
 */
export interface AccountMetadata {
    externalId: string;
    name: string;
    currency: string;
    timezone: string;
    status: "ACTIVE" | "PAUSED" | "ARCHIVED";
    accountType?: string;
    permissions?: string[];
}
/**
 * Campaign data from platform
 */
export interface CampaignData {
    externalId: string;
    name: string;
    status: "ACTIVE" | "PAUSED" | "ARCHIVED" | "DELETED";
    objective?: string;
    startDate?: Date;
    endDate?: Date;
    budget?: {
        amount: number;
        currency: string;
    };
}
/**
 * Ad data from platform
 */
export interface AdData {
    externalId: string;
    campaignId: string;
    name: string;
    status: "ACTIVE" | "PAUSED" | "ARCHIVED" | "DELETED";
    creative?: {
        type: string;
        title?: string;
        description?: string;
        imageUrl?: string;
        videoUrl?: string;
    };
}
/**
 * Cost metrics from platform
 */
export interface CostMetrics {
    date: Date;
    adAccountId?: string;
    campaignId?: string;
    adId?: string;
    impressions: number;
    clicks: number;
    spend: number;
    conversions?: number;
    revenue?: number;
}
/**
 * Sync options
 */
export interface SyncOptions {
    startDate: Date;
    endDate: Date;
    accountIds?: string[];
    campaignIds?: string[];
    batchSize?: number;
}
/**
 * Sync result
 */
export interface SyncResult {
    success: boolean;
    synced: number;
    failed: number;
    errors?: Array<{
        id: string;
        error: string;
    }>;
}
export interface IntegrationCore {
    readonly platform: PlatformCode;
    readonly name: string;
    connect(params: ConnectionParams): Promise<string>;
    refreshToken(organizationId: string, accountId: string): Promise<OAuthToken>;
    syncCampaigns(organizationId: string, accountId: string, options?: SyncOptions): Promise<SyncResult>;
    syncCosts(organizationId: string, accountId: string, options: SyncOptions): Promise<SyncResult>;
}
/**
 * Integration interface
 *
 * All platform integrations must implement this interface
 */
export interface Integration extends IntegrationCore {
    /**
     * Complete OAuth connection with authorization code
     */
    completeConnection(organizationId: string, code: string, state?: string): Promise<ConnectionResult>;
    /**
     * Refresh expired access token
     */
    refreshToken(organizationId: string, accountId: string): Promise<OAuthToken>;
    /**
     * Sync account metadata
     */
    syncAccounts(organizationId: string): Promise<SyncResult>;
    /**
     * Sync campaigns for an account
     */
    syncCampaigns(organizationId: string, accountId: string, options?: SyncOptions): Promise<SyncResult>;
    /**
     * Sync ads for a campaign
     */
    syncAds(organizationId: string, campaignId: string, options?: SyncOptions): Promise<SyncResult>;
    /**
     * Sync cost metrics
     */
    syncCosts(organizationId: string, accountId: string, options: SyncOptions): Promise<SyncResult>;
    /**
     * Test connection validity
     */
    testConnection(organizationId: string, accountId: string): Promise<boolean>;
    /**
     * Disconnect and revoke tokens
     */
    disconnect(organizationId: string, accountId: string): Promise<void>;
}
/**
 * Integration configuration
 */
export interface IntegrationConfig {
    clientId: string;
    clientSecret: string;
    redirectUri?: string;
    scopes?: string[];
    apiVersion?: string;
    baseUrl?: string;
}
/**
 * Integration factory interface
 */
export interface IntegrationFactory {
    /**
     * Create integration instance
     */
    create(platform: PlatformCode, config: IntegrationConfig): Integration;
    /**
     * Get all registered platforms
     */
    getSupportedPlatforms(): PlatformCode[];
    /**
     * Check if platform is supported
     */
    isSupported(platform: PlatformCode): boolean;
}
//# sourceMappingURL=types.d.ts.map