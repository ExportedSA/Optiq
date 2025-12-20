import { BaseIntegration } from "./base-integration";
export class ExampleStubIntegration extends BaseIntegration {
    platform = "LINKEDIN";
    name = "Example Stub";
    constructor(config) {
        super(config);
    }
    getAuthEndpoint() {
        return "https://example.invalid/oauth/authorize";
    }
    getTokenEndpoint() {
        return "https://example.invalid/oauth/token";
    }
    async connect(params) {
        return this.buildAuthUrl(params);
    }
    async completeConnection(organizationId, code, state) {
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
    async refreshToken(organizationId, accountId) {
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
    async syncAccounts(organizationId) {
        void organizationId;
        return { success: true, synced: 0, failed: 0 };
    }
    async syncCampaigns(organizationId, accountId, options) {
        void organizationId;
        void accountId;
        void options;
        return { success: true, synced: 0, failed: 0 };
    }
    async syncAds(organizationId, campaignId, options) {
        void organizationId;
        void campaignId;
        void options;
        return { success: true, synced: 0, failed: 0 };
    }
    async syncCosts(organizationId, accountId, options) {
        void organizationId;
        void accountId;
        void options;
        return { success: true, synced: 0, failed: 0 };
    }
    async testConnection(organizationId, accountId) {
        void organizationId;
        void accountId;
        return true;
    }
    async disconnect(organizationId, accountId) {
        void organizationId;
        void accountId;
    }
}
//# sourceMappingURL=example-stub-integration.js.map