/**
 * Base Integration Class
 *
 * Provides common functionality for all platform integrations
 */
/**
 * Abstract base class for integrations
 * Implements common OAuth and sync patterns
 */
export class BaseIntegration {
    config;
    constructor(config) {
        this.config = config;
    }
    /**
     * Build OAuth authorization URL
     */
    buildAuthUrl(params) {
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
    async exchangeCodeForToken(code, redirectUri) {
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
    async refreshAccessToken(refreshToken) {
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
    parseTokenResponse(data) {
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
    async apiRequest(endpoint, accessToken, options) {
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
    async batchProcess(items, processor, batchSize = 10) {
        let synced = 0;
        let failed = 0;
        const errors = [];
        for (let i = 0; i < items.length; i += batchSize) {
            const batch = items.slice(i, i + batchSize);
            const results = await Promise.allSettled(batch.map(processor));
            results.forEach((result, index) => {
                if (result.status === "fulfilled") {
                    synced++;
                }
                else {
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
}
//# sourceMappingURL=base-integration.js.map