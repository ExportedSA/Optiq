/**
 * Base Integration Class
 *
 * Provides common functionality for all platform integrations
 */
import type { Integration, PlatformCode, ConnectionParams, ConnectionResult, OAuthToken, SyncOptions, SyncResult, IntegrationConfig } from "./types";
/**
 * Abstract base class for integrations
 * Implements common OAuth and sync patterns
 */
export declare abstract class BaseIntegration implements Integration {
    abstract readonly platform: PlatformCode;
    abstract readonly name: string;
    protected config: IntegrationConfig;
    constructor(config: IntegrationConfig);
    /**
     * Build OAuth authorization URL
     */
    protected buildAuthUrl(params: ConnectionParams): string;
    /**
     * Exchange authorization code for tokens
     */
    protected exchangeCodeForToken(code: string, redirectUri: string): Promise<OAuthToken>;
    /**
     * Refresh access token using refresh token
     */
    protected refreshAccessToken(refreshToken: string): Promise<OAuthToken>;
    /**
     * Parse token response from OAuth provider
     */
    protected parseTokenResponse(data: any): OAuthToken;
    /**
     * Make authenticated API request
     */
    protected apiRequest<T>(endpoint: string, accessToken: string, options?: RequestInit): Promise<T>;
    /**
     * Batch process items with rate limiting
     */
    protected batchProcess<T, R>(items: T[], processor: (item: T) => Promise<R>, batchSize?: number): Promise<SyncResult>;
    /**
     * Get OAuth authorization endpoint
     */
    protected abstract getAuthEndpoint(): string;
    /**
     * Get OAuth token endpoint
     */
    protected abstract getTokenEndpoint(): string;
    /**
     * Initialize OAuth connection flow
     */
    abstract connect(params: ConnectionParams): Promise<string>;
    /**
     * Complete OAuth connection
     */
    abstract completeConnection(organizationId: string, code: string, state?: string): Promise<ConnectionResult>;
    /**
     * Refresh expired access token
     */
    abstract refreshToken(organizationId: string, accountId: string): Promise<OAuthToken>;
    /**
     * Sync account metadata
     */
    abstract syncAccounts(organizationId: string): Promise<SyncResult>;
    /**
     * Sync campaigns
     */
    abstract syncCampaigns(organizationId: string, accountId: string, options?: SyncOptions): Promise<SyncResult>;
    /**
     * Sync ads
     */
    abstract syncAds(organizationId: string, campaignId: string, options?: SyncOptions): Promise<SyncResult>;
    /**
     * Sync cost metrics
     */
    abstract syncCosts(organizationId: string, accountId: string, options: SyncOptions): Promise<SyncResult>;
    /**
     * Test connection validity
     */
    abstract testConnection(organizationId: string, accountId: string): Promise<boolean>;
    /**
     * Disconnect and revoke tokens
     */
    abstract disconnect(organizationId: string, accountId: string): Promise<void>;
}
//# sourceMappingURL=base-integration.d.ts.map