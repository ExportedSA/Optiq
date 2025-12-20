/**
 * Meta Ads OAuth Routes
 *
 * Handles OAuth connection flow for Meta Marketing API (Facebook & Instagram)
 */
import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";
import { META_ADS_CONFIG } from "../../config/meta-ads";
import { encryptString } from "../../utils/crypto";
const prisma = new PrismaClient();
/**
 * OAuth state schema
 */
const OAuthStateSchema = z.object({
    organizationId: z.string(),
    nonce: z.string(),
    timestamp: z.number(),
});
/**
 * Register Meta Ads OAuth routes
 */
export async function registerMetaAdsOAuthRoutes(app) {
    /**
     * GET /api/integrations/meta-ads/connect
     *
     * Initialize OAuth flow
     */
    app.get("/api/integrations/meta-ads/connect", async (req, reply) => {
        try {
            const { organizationId } = req.query;
            // Verify organization exists
            const org = await prisma.organization.findUnique({
                where: { id: organizationId },
            });
            if (!org) {
                return reply.status(404).send({
                    success: false,
                    error: "Organization not found",
                });
            }
            // Generate state token
            const state = Buffer.from(JSON.stringify({
                organizationId,
                nonce: crypto.randomBytes(16).toString("hex"),
                timestamp: Date.now(),
            })).toString("base64");
            // Build OAuth URL
            const authUrl = new URL(META_ADS_CONFIG.oauthUrl);
            authUrl.searchParams.set("client_id", process.env.META_APP_ID || "");
            authUrl.searchParams.set("redirect_uri", process.env.META_REDIRECT_URI || "");
            authUrl.searchParams.set("state", state);
            authUrl.searchParams.set("scope", META_ADS_CONFIG.scopes.join(","));
            return reply.status(200).send({
                success: true,
                authUrl: authUrl.toString(),
            });
        }
        catch (error) {
            req.log.error({ err: error }, "Failed to initialize Meta Ads OAuth");
            return reply.status(500).send({
                success: false,
                error: "Failed to initialize OAuth flow",
            });
        }
    });
    /**
     * GET /api/integrations/meta-ads/callback
     *
     * Handle OAuth callback
     */
    app.get("/api/integrations/meta-ads/callback", async (req, reply) => {
        try {
            const { code, state, error } = req.query;
            if (error) {
                return reply.redirect(`/dashboard/integrations?error=${error}`);
            }
            if (!code || !state) {
                return reply.redirect("/dashboard/integrations?error=missing_params");
            }
            // Decode and validate state
            const stateData = JSON.parse(Buffer.from(state, "base64").toString());
            const validatedState = OAuthStateSchema.parse(stateData);
            // Check state age (max 10 minutes)
            if (Date.now() - validatedState.timestamp > 10 * 60 * 1000) {
                return reply.redirect("/dashboard/integrations?error=state_expired");
            }
            // Exchange code for long-lived token
            const tokenUrl = new URL(META_ADS_CONFIG.tokenUrl);
            tokenUrl.searchParams.set("client_id", process.env.META_APP_ID || "");
            tokenUrl.searchParams.set("client_secret", process.env.META_APP_SECRET || "");
            tokenUrl.searchParams.set("redirect_uri", process.env.META_REDIRECT_URI || "");
            tokenUrl.searchParams.set("code", code);
            const tokenResponse = await fetch(tokenUrl.toString());
            if (!tokenResponse.ok) {
                const errorText = await tokenResponse.text();
                req.log.error({ error: errorText }, "Token exchange failed");
                return reply.redirect("/dashboard/integrations?error=token_exchange_failed");
            }
            const tokenData = (await tokenResponse.json());
            // Exchange short-lived token for long-lived token (60 days)
            const longLivedUrl = new URL(`${META_ADS_CONFIG.baseUrl}/${META_ADS_CONFIG.apiVersion}/oauth/access_token`);
            longLivedUrl.searchParams.set("grant_type", "fb_exchange_token");
            longLivedUrl.searchParams.set("client_id", process.env.META_APP_ID || "");
            longLivedUrl.searchParams.set("client_secret", process.env.META_APP_SECRET || "");
            longLivedUrl.searchParams.set("fb_exchange_token", tokenData.access_token);
            const longLivedResponse = await fetch(longLivedUrl.toString());
            if (!longLivedResponse.ok) {
                req.log.error("Failed to get long-lived token");
                return reply.redirect("/dashboard/integrations?error=long_lived_token_failed");
            }
            const longLivedData = (await longLivedResponse.json());
            // Fetch user's ad accounts
            const accountsUrl = new URL(`${META_ADS_CONFIG.baseUrl}/${META_ADS_CONFIG.apiVersion}/me/adaccounts`);
            accountsUrl.searchParams.set("access_token", longLivedData.access_token);
            accountsUrl.searchParams.set("fields", "id,name,currency,timezone_name,account_status");
            const accountsResponse = await fetch(accountsUrl.toString());
            if (!accountsResponse.ok) {
                req.log.error("Failed to fetch ad accounts");
                return reply.redirect("/dashboard/integrations?error=account_fetch_failed");
            }
            const accountsData = (await accountsResponse.json());
            const accounts = accountsData.data || [];
            // Store credential (expires in 60 days)
            const expiresAt = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000);
            for (const acc of accounts) {
                await prisma.integrationConnection.upsert({
                    where: {
                        organizationId_platformCode_externalAccountId: {
                            organizationId: validatedState.organizationId,
                            platformCode: "META",
                            externalAccountId: acc.id,
                        },
                    },
                    create: {
                        organizationId: validatedState.organizationId,
                        platformCode: "META",
                        externalAccountId: acc.id,
                        externalAccountName: acc.name ?? null,
                        currency: acc.currency ?? null,
                        timezone: acc.timezone_name ?? null,
                        status: "CONNECTED",
                        accessTokenEnc: encryptString(longLivedData.access_token),
                        refreshTokenEnc: null,
                        accessTokenExpiresAt: expiresAt,
                        refreshTokenExpiresAt: null,
                        scope: META_ADS_CONFIG.scopes.join(","),
                        tokenType: "Bearer",
                        metadata: null,
                    },
                    update: {
                        externalAccountName: acc.name ?? null,
                        currency: acc.currency ?? null,
                        timezone: acc.timezone_name ?? null,
                        status: "CONNECTED",
                        accessTokenEnc: encryptString(longLivedData.access_token),
                        accessTokenExpiresAt: expiresAt,
                        scope: META_ADS_CONFIG.scopes.join(","),
                        tokenType: "Bearer",
                    },
                    select: { id: true },
                });
            }
            return reply.redirect("/dashboard/integrations?connected=meta_ads");
        }
        catch (error) {
            req.log.error({ err: error }, "OAuth callback failed");
            return reply.redirect("/dashboard/integrations?error=callback_failed");
        }
    });
    /**
     * POST /api/integrations/meta-ads/refresh
     *
     * Refresh long-lived token (extends by 60 days)
     */
    app.post("/api/integrations/meta-ads/refresh", async (req, reply) => {
        try {
            const { organizationId } = req.body;
            const connection = await prisma.integrationConnection.findFirst({
                where: { organizationId, platformCode: "META", status: "CONNECTED" },
                orderBy: { updatedAt: "desc" },
            });
            if (!connection?.accessTokenEnc) {
                return reply.status(404).send({ success: false, error: "No connection found" });
            }
            // NOTE: We cannot refresh without decrypting. In v1, refresh should be done via reconnect.
            return reply.status(501).send({
                success: false,
                error: "NOT_IMPLEMENTED",
            });
        }
        catch (error) {
            req.log.error({ err: error }, "Token refresh failed");
            return reply.status(500).send({
                success: false,
                error: "Failed to refresh token",
            });
        }
    });
    /**
     * DELETE /api/integrations/meta-ads/disconnect
     *
     * Disconnect Meta Ads
     */
    app.delete("/api/integrations/meta-ads/disconnect", async (req, reply) => {
        try {
            const { organizationId } = req.body;
            await prisma.integrationConnection.updateMany({
                where: { organizationId, platformCode: "META" },
                data: { status: "DISCONNECTED" },
            });
            return reply.status(200).send({
                success: true,
            });
        }
        catch (error) {
            req.log.error({ err: error }, "Disconnect failed");
            return reply.status(500).send({
                success: false,
                error: "Failed to disconnect",
            });
        }
    });
    app.log.info("Meta Ads OAuth routes registered");
}
//# sourceMappingURL=meta-ads-oauth.js.map