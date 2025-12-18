/**
 * Google Ads OAuth Routes
 * 
 * Handles OAuth connection flow for Google Ads
 */

import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();

const GOOGLE_OAUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_ADS_SCOPES = ["https://www.googleapis.com/auth/adwords"];

/**
 * OAuth state schema
 */
const OAuthStateSchema = z.object({
  organizationId: z.string(),
  nonce: z.string(),
  timestamp: z.number(),
});

/**
 * Register Google Ads OAuth routes
 */
export async function registerGoogleAdsOAuthRoutes(app: FastifyInstance) {
  /**
   * GET /api/integrations/google-ads/connect
   * 
   * Initialize OAuth flow
   */
  app.get(
    "/api/integrations/google-ads/connect",
    async (req: FastifyRequest<{
      Querystring: { organizationId: string };
    }>, reply: FastifyReply) => {
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
        const state = Buffer.from(
          JSON.stringify({
            organizationId,
            nonce: crypto.randomBytes(16).toString("hex"),
            timestamp: Date.now(),
          }),
        ).toString("base64");

        // Build OAuth URL
        const authUrl = new URL(GOOGLE_OAUTH_URL);
        authUrl.searchParams.set("client_id", process.env.GOOGLE_CLIENT_ID || "");
        authUrl.searchParams.set("redirect_uri", process.env.GOOGLE_REDIRECT_URI || "");
        authUrl.searchParams.set("response_type", "code");
        authUrl.searchParams.set("scope", GOOGLE_ADS_SCOPES.join(" "));
        authUrl.searchParams.set("state", state);
        authUrl.searchParams.set("access_type", "offline");
        authUrl.searchParams.set("prompt", "consent");

        return reply.status(200).send({
          success: true,
          authUrl: authUrl.toString(),
        });
      } catch (error) {
        req.log.error({ err: error }, "Failed to initialize Google Ads OAuth");
        return reply.status(500).send({
          success: false,
          error: "Failed to initialize OAuth flow",
        });
      }
    },
  );

  /**
   * GET /api/integrations/google-ads/callback
   * 
   * Handle OAuth callback
   */
  app.get(
    "/api/integrations/google-ads/callback",
    async (req: FastifyRequest<{
      Querystring: { code?: string; state?: string; error?: string };
    }>, reply: FastifyReply) => {
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

        // Exchange code for tokens
        const tokenResponse = await fetch(GOOGLE_TOKEN_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            code,
            client_id: process.env.GOOGLE_CLIENT_ID || "",
            client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
            redirect_uri: process.env.GOOGLE_REDIRECT_URI || "",
            grant_type: "authorization_code",
          }),
        });

        if (!tokenResponse.ok) {
          const errorText = await tokenResponse.text();
          req.log.error({ error: errorText }, "Token exchange failed");
          return reply.redirect("/dashboard/integrations?error=token_exchange_failed");
        }

        const tokens = await tokenResponse.json();

        // Fetch accessible accounts
        const accountsResponse = await fetch(
          "https://googleads.googleapis.com/v16/customers:listAccessibleCustomers",
          {
            headers: {
              Authorization: `Bearer ${tokens.access_token}`,
            },
          },
        );

        if (!accountsResponse.ok) {
          req.log.error("Failed to fetch accessible accounts");
          return reply.redirect("/dashboard/integrations?error=account_fetch_failed");
        }

        const accountsData = await accountsResponse.json();
        const customerIds = accountsData.resourceNames?.map((name: string) =>
          name.replace("customers/", ""),
        ) || [];

        // Store credential
        const expiresAt = new Date(Date.now() + tokens.expires_in * 1000);

        await prisma.googleAdsCredential.create({
          data: {
            organizationId: validatedState.organizationId,
            accessToken: tokens.access_token,
            refreshToken: tokens.refresh_token,
            expiresAt,
            scope: tokens.scope,
            customerIds: customerIds.join(","),
          },
        });

        return reply.redirect("/dashboard/integrations?connected=google_ads");
      } catch (error) {
        req.log.error({ err: error }, "OAuth callback failed");
        return reply.redirect("/dashboard/integrations?error=callback_failed");
      }
    },
  );

  /**
   * POST /api/integrations/google-ads/refresh
   * 
   * Manually refresh token
   */
  app.post(
    "/api/integrations/google-ads/refresh",
    async (req: FastifyRequest<{
      Body: { organizationId: string };
    }>, reply: FastifyReply) => {
      try {
        const { organizationId } = req.body;

        const credential = await prisma.googleAdsCredential.findFirst({
          where: { organizationId },
          orderBy: { createdAt: "desc" },
        });

        if (!credential || !credential.refreshToken) {
          return reply.status(404).send({
            success: false,
            error: "No credential found",
          });
        }

        // Refresh token
        const tokenResponse = await fetch(GOOGLE_TOKEN_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            refresh_token: credential.refreshToken,
            client_id: process.env.GOOGLE_CLIENT_ID || "",
            client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
            grant_type: "refresh_token",
          }),
        });

        if (!tokenResponse.ok) {
          const errorText = await tokenResponse.text();
          req.log.error({ error: errorText }, "Token refresh failed");
          return reply.status(500).send({
            success: false,
            error: "Token refresh failed",
          });
        }

        const tokens = await tokenResponse.json();
        const expiresAt = new Date(Date.now() + tokens.expires_in * 1000);

        // Update credential
        await prisma.googleAdsCredential.update({
          where: { id: credential.id },
          data: {
            accessToken: tokens.access_token,
            expiresAt,
          },
        });

        return reply.status(200).send({
          success: true,
          expiresAt,
        });
      } catch (error) {
        req.log.error({ err: error }, "Token refresh failed");
        return reply.status(500).send({
          success: false,
          error: "Failed to refresh token",
        });
      }
    },
  );

  /**
   * DELETE /api/integrations/google-ads/disconnect
   * 
   * Disconnect Google Ads
   */
  app.delete(
    "/api/integrations/google-ads/disconnect",
    async (req: FastifyRequest<{
      Body: { organizationId: string };
    }>, reply: FastifyReply) => {
      try {
        const { organizationId } = req.body;

        const credential = await prisma.googleAdsCredential.findFirst({
          where: { organizationId },
        });

        if (credential) {
          // Revoke token with Google
          await fetch("https://oauth2.googleapis.com/revoke", {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
              token: credential.accessToken,
            }),
          });

          // Delete credential
          await prisma.googleAdsCredential.delete({
            where: { id: credential.id },
          });
        }

        return reply.status(200).send({
          success: true,
        });
      } catch (error) {
        req.log.error({ err: error }, "Disconnect failed");
        return reply.status(500).send({
          success: false,
          error: "Failed to disconnect",
        });
      }
    },
  );

  app.log.info("Google Ads OAuth routes registered");
}
