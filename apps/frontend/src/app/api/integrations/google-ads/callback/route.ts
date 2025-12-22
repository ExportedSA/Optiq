/**
 * Google Ads OAuth Callback Endpoint
 * 
 * Handles OAuth callback from Google, exchanges code for tokens,
 * fetches accessible customers, and creates IntegrationConnection records
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { encryptToken } from "@/lib/integrations/encryption";
import { appLogger } from "@/lib/observability";
import { google } from "googleapis";

export const runtime = "nodejs";

interface GoogleTokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
  scope: string;
}

interface GoogleAdsCustomer {
  resourceName: string;
  id: string;
  descriptiveName?: string;
  currencyCode?: string;
  timeZone?: string;
  manager?: boolean;
}

/**
 * GET /api/integrations/google-ads/callback
 * Handle OAuth callback and create connections
 */
export async function GET(request: Request) {
  const logger = appLogger.child({ integration: "google-ads-oauth" });

  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");

    // Handle OAuth errors
    if (error) {
      logger.warn("Google Ads OAuth error", { error });
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/app/integrations?error=google_oauth_denied`
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

    // Create OAuth2 client
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      `${process.env.NEXTAUTH_URL}/api/integrations/google-ads/callback`
    );

    // Exchange code for tokens
    const { tokens } = await oauth2Client.getToken(code);

    if (!tokens.access_token) {
      logger.error("No access token received from Google");
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/app/integrations?error=token_exchange_failed`
      );
    }

    // Set credentials for API calls
    oauth2Client.setCredentials(tokens);

    // Fetch accessible customers using Google Ads API
    const developerToken = process.env.GOOGLE_ADS_DEVELOPER_TOKEN;
    if (!developerToken) {
      logger.error("Google Ads developer token not configured");
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/app/integrations?error=developer_token_missing`
      );
    }

    // Get accessible customers
    const customersResponse = await fetch(
      "https://googleads.googleapis.com/v16/customers:listAccessibleCustomers",
      {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
          "developer-token": developerToken,
        },
      }
    );

    if (!customersResponse.ok) {
      const errorText = await customersResponse.text();
      logger.error("Failed to fetch Google Ads customers", { error: errorText });
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/app/integrations?error=fetch_customers_failed`
      );
    }

    const customersData = await customersResponse.json();
    const customerResourceNames: string[] = customersData.resourceNames || [];

    if (customerResourceNames.length === 0) {
      logger.warn("No Google Ads customers found");
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/app/integrations?error=no_customers`
      );
    }

    // Extract customer IDs from resource names (format: customers/1234567890)
    const customerIds = customerResourceNames.map(name => name.split("/")[1]);

    // Fetch details for each customer
    const customers: GoogleAdsCustomer[] = [];
    for (const customerId of customerIds) {
      try {
        const query = `
          SELECT 
            customer.id,
            customer.descriptive_name,
            customer.currency_code,
            customer.time_zone,
            customer.manager
          FROM customer
          WHERE customer.id = ${customerId}
        `;

        const detailsResponse = await fetch(
          `https://googleads.googleapis.com/v16/customers/${customerId}/googleAds:search`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${tokens.access_token}`,
              "developer-token": developerToken,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ query }),
          }
        );

        if (detailsResponse.ok) {
          const detailsData = await detailsResponse.json();
          if (detailsData.results && detailsData.results.length > 0) {
            const customer = detailsData.results[0].customer;
            customers.push({
              resourceName: `customers/${customerId}`,
              id: customerId,
              descriptiveName: customer.descriptiveName,
              currencyCode: customer.currencyCode,
              timeZone: customer.timeZone,
              manager: customer.manager,
            });
          }
        }
      } catch (error) {
        logger.warn("Failed to fetch customer details", { customerId, error });
      }
    }

    // Encrypt tokens
    const accessTokenEnc = encryptToken(tokens.access_token);
    const refreshTokenEnc = tokens.refresh_token ? encryptToken(tokens.refresh_token) : null;
    const accessTokenExpiresAt = tokens.expiry_date
      ? new Date(tokens.expiry_date)
      : new Date(Date.now() + 3600 * 1000); // Default 1 hour expiry

    // Create IntegrationConnection for each customer
    const connections = [];
    for (const customer of customers) {
      // Skip manager accounts (MCC accounts)
      if (customer.manager) {
        logger.info("Skipping Google Ads manager account", { customerId: customer.id });
        continue;
      }

      const connection = await prisma.integrationConnection.upsert({
        where: {
          organizationId_platformCode_externalAccountId: {
            organizationId,
            platformCode: "GOOGLE_ADS",
            externalAccountId: customer.id,
          },
        },
        create: {
          organizationId,
          platformCode: "GOOGLE_ADS",
          externalAccountId: customer.id,
          externalAccountName: customer.descriptiveName || `Customer ${customer.id}`,
          currency: customer.currencyCode,
          timezone: customer.timeZone,
          status: "CONNECTED",
          accessTokenEnc,
          refreshTokenEnc,
          accessTokenExpiresAt,
          scope: tokens.scope,
          tokenType: tokens.token_type || "Bearer",
          metadata: {
            resourceName: customer.resourceName,
            manager: customer.manager,
          },
        },
        update: {
          externalAccountName: customer.descriptiveName || `Customer ${customer.id}`,
          currency: customer.currencyCode,
          timezone: customer.timeZone,
          status: "CONNECTED",
          accessTokenEnc,
          refreshTokenEnc,
          accessTokenExpiresAt,
          scope: tokens.scope,
          tokenType: tokens.token_type || "Bearer",
          metadata: {
            resourceName: customer.resourceName,
            manager: customer.manager,
          },
          updatedAt: new Date(),
        },
      });

      connections.push(connection);
      logger.info("Created/updated Google Ads connection", {
        connectionId: connection.id,
        customerId: customer.id,
      });
    }

    logger.info("Google Ads OAuth completed", {
      organizationId,
      connectionsCreated: connections.length,
    });

    // Redirect to integrations page with success
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/app/integrations?success=google_ads_connected&count=${connections.length}`
    );
  } catch (error) {
    logger.error("Google Ads OAuth callback error", error as Error);
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/app/integrations?error=internal_error`
    );
  }
}
