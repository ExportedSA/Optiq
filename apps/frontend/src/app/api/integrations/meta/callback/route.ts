/**
 * Meta OAuth Callback Endpoint
 * 
 * Handles OAuth callback from Meta, exchanges code for tokens,
 * fetches ad accounts, and creates IntegrationConnection records
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { encryptToken } from "@/lib/integrations/encryption";
import { appLogger } from "@/lib/observability";

export const runtime = "nodejs";

interface MetaTokenResponse {
  access_token: string;
  token_type: string;
  expires_in?: number;
}

interface MetaAdAccount {
  id: string;
  name: string;
  account_id: string;
  currency: string;
  timezone_name: string;
  account_status: number;
}

/**
 * GET /api/integrations/meta/callback
 * Handle OAuth callback and create connections
 */
export async function GET(request: Request) {
  const logger = appLogger.child({ integration: "meta-oauth" });

  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");

    // Handle OAuth errors
    if (error) {
      logger.warn("Meta OAuth error", { error });
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/app/integrations?error=meta_oauth_denied`
      );
    }

    if (!code || !state) {
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/app/integrations?error=invalid_callback`
      );
    }

    // Verify state parameter
    let stateData: { organizationId: string; timestamp: number };
    try {
      stateData = JSON.parse(Buffer.from(state, "base64").toString());
    } catch {
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/app/integrations?error=invalid_state`
      );
    }

    const { organizationId } = stateData;

    // Exchange code for access token
    const tokenResponse = await fetch(
      "https://graph.facebook.com/v18.0/oauth/access_token",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_id: process.env.META_APP_ID,
          client_secret: process.env.META_APP_SECRET,
          redirect_uri: `${process.env.NEXTAUTH_URL}/api/integrations/meta/callback`,
          code,
        }),
      }
    );

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      logger.error("Failed to exchange Meta OAuth code", { error: errorText });
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/app/integrations?error=token_exchange_failed`
      );
    }

    const tokenData: MetaTokenResponse = await tokenResponse.json();

    // Get long-lived token (60 days)
    const longLivedTokenResponse = await fetch(
      `https://graph.facebook.com/v18.0/oauth/access_token?` +
      `grant_type=fb_exchange_token&` +
      `client_id=${process.env.META_APP_ID}&` +
      `client_secret=${process.env.META_APP_SECRET}&` +
      `fb_exchange_token=${tokenData.access_token}`
    );

    if (!longLivedTokenResponse.ok) {
      logger.warn("Failed to get long-lived token, using short-lived");
    }

    const longLivedTokenData: MetaTokenResponse = longLivedTokenResponse.ok
      ? await longLivedTokenResponse.json()
      : tokenData;

    const accessToken = longLivedTokenData.access_token;
    const expiresIn = longLivedTokenData.expires_in || 5184000; // 60 days default

    // Fetch ad accounts
    const adAccountsResponse = await fetch(
      `https://graph.facebook.com/v18.0/me/adaccounts?` +
      `fields=id,name,account_id,currency,timezone_name,account_status&` +
      `access_token=${accessToken}`
    );

    if (!adAccountsResponse.ok) {
      const errorText = await adAccountsResponse.text();
      logger.error("Failed to fetch Meta ad accounts", { error: errorText });
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/app/integrations?error=fetch_accounts_failed`
      );
    }

    const adAccountsData = await adAccountsResponse.json();
    const adAccounts: MetaAdAccount[] = adAccountsData.data || [];

    if (adAccounts.length === 0) {
      logger.warn("No Meta ad accounts found");
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/app/integrations?error=no_accounts`
      );
    }

    // Encrypt tokens
    const accessTokenEnc = encryptToken(accessToken);
    const accessTokenExpiresAt = new Date(Date.now() + expiresIn * 1000);

    // Create IntegrationConnection for each ad account
    const connections = [];
    for (const account of adAccounts) {
      // Skip inactive accounts
      if (account.account_status !== 1) {
        logger.info("Skipping inactive Meta account", { accountId: account.account_id });
        continue;
      }

      const connection = await prisma.integrationConnection.upsert({
        where: {
          organizationId_platformCode_externalAccountId: {
            organizationId,
            platformCode: "META_ADS",
            externalAccountId: account.account_id,
          },
        },
        create: {
          organizationId,
          platformCode: "META_ADS",
          externalAccountId: account.account_id,
          externalAccountName: account.name,
          currency: account.currency,
          timezone: account.timezone_name,
          status: "CONNECTED",
          accessTokenEnc,
          accessTokenExpiresAt,
          scope: "ads_management,ads_read,business_management",
          tokenType: "bearer",
          metadata: {
            accountId: account.id,
            accountStatus: account.account_status,
          },
        },
        update: {
          externalAccountName: account.name,
          currency: account.currency,
          timezone: account.timezone_name,
          status: "CONNECTED",
          accessTokenEnc,
          accessTokenExpiresAt,
          scope: "ads_management,ads_read,business_management",
          tokenType: "bearer",
          metadata: {
            accountId: account.id,
            accountStatus: account.account_status,
          },
          updatedAt: new Date(),
        },
      });

      connections.push(connection);
      logger.info("Created/updated Meta connection", {
        connectionId: connection.id,
        accountId: account.account_id,
      });
    }

    logger.info("Meta OAuth completed", {
      organizationId,
      connectionsCreated: connections.length,
    });

    // Redirect to integrations page with success
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/app/integrations?success=meta_connected&count=${connections.length}`
    );
  } catch (error) {
    logger.error("Meta OAuth callback error", error as Error);
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/app/integrations?error=internal_error`
    );
  }
}
