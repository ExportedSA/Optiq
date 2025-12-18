/**
 * Base Integration Class
 * 
 * Provides common functionality for all platform integrations
 */

import type {
  Integration,
  PlatformCode,
  ConnectionParams,
  ConnectionResult,
  OAuthToken,
  SyncOptions,
  SyncResult,
  IntegrationConfig,
} from "./types";

/**
 * Abstract base class for integrations
 * Implements common OAuth and sync patterns
 */
export abstract class BaseIntegration implements Integration {
  abstract readonly platform: PlatformCode;
  abstract readonly name: string;

  protected config: IntegrationConfig;

  constructor(config: IntegrationConfig) {
    this.config = config;
  }

  /**
   * Build OAuth authorization URL
   */
  protected buildAuthUrl(params: ConnectionParams): string {
    const authUrl = new URL(this.getAuthEndpoint());
    authUrl.searchParams.set("client_id", this.config.clientId);
    authUrl.searchParams.set("redirect_uri", params.redirectUri || this.config.redirectUri || "");
    authUrl.searchParams.set("response_type", "code");
    authUrl.searchParams.set("state", params.state || "");
    
    const scopes = params.scopes || this.config.scopes || [];
    if (scopes.length > 0) {
      authUrl.searchParams.set("scope", scopes.join(" "));
    }

    return authUrl.toString();
  }

  /**
   * Exchange authorization code for tokens
   */
  protected async exchangeCodeForToken(code: string, redirectUri: string): Promise<OAuthToken> {
    const response = await fetch(this.getTokenEndpoint(), {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
        redirect_uri: redirectUri,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Token exchange failed: ${error}`);
    }

    const data = await response.json();
    return this.parseTokenResponse(data);
  }

  /**
   * Refresh access token using refresh token
   */
  protected async refreshAccessToken(refreshToken: string): Promise<OAuthToken> {
    const response = await fetch(this.getTokenEndpoint(), {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Token refresh failed: ${error}`);
    }

    const data = await response.json();
    return this.parseTokenResponse(data);
  }

  /**
   * Parse token response from OAuth provider
   */
  protected parseTokenResponse(data: any): OAuthToken {
    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: data.expires_in 
        ? new Date(Date.now() + data.expires_in * 1000) 
        : undefined,
      scope: data.scope,
      tokenType: data.token_type || "Bearer",
    };
  }

  /**
   * Make authenticated API request
   */
  protected async apiRequest<T>(
    endpoint: string,
    accessToken: string,
    options?: RequestInit,
  ): Promise<T> {
    const url = `${this.config.baseUrl || ""}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API request failed: ${response.status} ${error}`);
    }

    return response.json();
  }

  /**
   * Batch process items with rate limiting
   */
  protected async batchProcess<T, R>(
    items: T[],
    processor: (item: T) => Promise<R>,
    batchSize: number = 10,
  ): Promise<SyncResult> {
    let synced = 0;
    let failed = 0;
    const errors: Array<{ id: string; error: string }> = [];

    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);
      const results = await Promise.allSettled(batch.map(processor));

      results.forEach((result, index) => {
        if (result.status === "fulfilled") {
          synced++;
        } else {
          failed++;
          errors.push({
            id: `item_${i + index}`,
            error: result.reason?.message || "Unknown error",
          });
        }
      });
    }

    return {
      success: failed === 0,
      synced,
      failed,
      errors: errors.length > 0 ? errors : undefined,
    };
  }

  // Abstract methods that must be implemented by each platform

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
  abstract completeConnection(
    organizationId: string,
    code: string,
    state?: string,
  ): Promise<ConnectionResult>;

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
  abstract syncCampaigns(
    organizationId: string,
    accountId: string,
    options?: SyncOptions,
  ): Promise<SyncResult>;

  /**
   * Sync ads
   */
  abstract syncAds(
    organizationId: string,
    campaignId: string,
    options?: SyncOptions,
  ): Promise<SyncResult>;

  /**
   * Sync cost metrics
   */
  abstract syncCosts(
    organizationId: string,
    accountId: string,
    options: SyncOptions,
  ): Promise<SyncResult>;

  /**
   * Test connection validity
   */
  abstract testConnection(organizationId: string, accountId: string): Promise<boolean>;

  /**
   * Disconnect and revoke tokens
   */
  abstract disconnect(organizationId: string, accountId: string): Promise<void>;
}
