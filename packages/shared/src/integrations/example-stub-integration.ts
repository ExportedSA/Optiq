import { BaseIntegration } from "./base-integration";
import type {
  ConnectionParams,
  ConnectionResult,
  IntegrationConfig,
  OAuthToken,
  PlatformCode,
  SyncOptions,
  SyncResult,
} from "./types";

export class ExampleStubIntegration extends BaseIntegration {
  readonly platform: PlatformCode = "LINKEDIN";
  readonly name = "Example Stub";

  constructor(config: IntegrationConfig) {
    super(config);
  }

  protected getAuthEndpoint(): string {
    return "https://example.invalid/oauth/authorize";
  }

  protected getTokenEndpoint(): string {
    return "https://example.invalid/oauth/token";
  }

  async connect(params: ConnectionParams): Promise<string> {
    return this.buildAuthUrl(params);
  }

  async completeConnection(
    organizationId: string,
    code: string,
    state?: string,
  ): Promise<ConnectionResult> {
    void organizationId;
    void state;
    void code;

    return {
      success: true,
      accountId: "stub_account",
      accountName: "Stub Account",
      token: {
        accessToken: "stub_access_token",
        refreshToken: "stub_refresh_token",
        expiresAt: new Date(Date.now() + 3600_000),
        scope: "stub",
        tokenType: "Bearer",
      },
    };
  }

  async refreshToken(organizationId: string, accountId: string): Promise<OAuthToken> {
    void organizationId;
    void accountId;

    return {
      accessToken: "stub_access_token_refreshed",
      refreshToken: "stub_refresh_token",
      expiresAt: new Date(Date.now() + 3600_000),
      scope: "stub",
      tokenType: "Bearer",
    };
  }

  async syncAccounts(organizationId: string): Promise<SyncResult> {
    void organizationId;
    return { success: true, synced: 0, failed: 0 };
  }

  async syncCampaigns(
    organizationId: string,
    accountId: string,
    options?: SyncOptions,
  ): Promise<SyncResult> {
    void organizationId;
    void accountId;
    void options;
    return { success: true, synced: 0, failed: 0 };
  }

  async syncAds(organizationId: string, campaignId: string, options?: SyncOptions): Promise<SyncResult> {
    void organizationId;
    void campaignId;
    void options;
    return { success: true, synced: 0, failed: 0 };
  }

  async syncCosts(organizationId: string, accountId: string, options: SyncOptions): Promise<SyncResult> {
    void organizationId;
    void accountId;
    void options;
    return { success: true, synced: 0, failed: 0 };
  }

  async testConnection(organizationId: string, accountId: string): Promise<boolean> {
    void organizationId;
    void accountId;
    return true;
  }

  async disconnect(organizationId: string, accountId: string): Promise<void> {
    void organizationId;
    void accountId;
  }
}
