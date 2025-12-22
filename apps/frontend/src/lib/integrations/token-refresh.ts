/**
 * Token Refresh Utilities
 * 
 * Handles automatic token refresh for OAuth integrations
 */

import "server-only";
import { prisma } from "@/lib/prisma";
import { encryptToken, decryptToken } from "./encryption";
import { appLogger } from "@/lib/observability";

/**
 * Refresh Google Ads access token using refresh token
 */
export async function refreshGoogleAdsToken(connectionId: string): Promise<{
  accessToken: string;
  expiresAt: Date;
}> {
  const logger = appLogger.child({ integration: "google-ads-refresh" });

  // Get connection
  const connection = await prisma.integrationConnection.findUnique({
    where: { id: connectionId },
  });

  if (!connection || connection.platformCode !== "GOOGLE_ADS") {
    throw new Error("Invalid Google Ads connection");
  }

  if (!connection.refreshTokenEnc) {
    throw new Error("No refresh token available");
  }

  // Decrypt refresh token
  const refreshToken = decryptToken(connection.refreshTokenEnc);

  // Request new access token
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    logger.error("Failed to refresh Google Ads token", { error });
    
    // Mark connection as error
    await prisma.integrationConnection.update({
      where: { id: connectionId },
      data: { status: "ERROR" },
    });

    throw new Error("Failed to refresh token");
  }

  const data = await response.json();
  const accessToken = data.access_token;
  const expiresIn = data.expires_in || 3600;
  const expiresAt = new Date(Date.now() + expiresIn * 1000);

  // Encrypt and store new access token
  const accessTokenEnc = encryptToken(accessToken);

  await prisma.integrationConnection.update({
    where: { id: connectionId },
    data: {
      accessTokenEnc,
      accessTokenExpiresAt: expiresAt,
      status: "CONNECTED",
      updatedAt: new Date(),
    },
  });

  logger.info("Refreshed Google Ads token", { connectionId });

  return { accessToken, expiresAt };
}

/**
 * Refresh Meta access token (exchange for long-lived token)
 */
export async function refreshMetaToken(connectionId: string): Promise<{
  accessToken: string;
  expiresAt: Date;
}> {
  const logger = appLogger.child({ integration: "meta-refresh" });

  // Get connection
  const connection = await prisma.integrationConnection.findUnique({
    where: { id: connectionId },
  });

  if (!connection || connection.platformCode !== "META") {
    throw new Error("Invalid Meta connection");
  }

  if (!connection.accessTokenEnc) {
    throw new Error("No access token available");
  }

  // Decrypt current token
  const currentToken = decryptToken(connection.accessTokenEnc);

  // Exchange for new long-lived token
  const response = await fetch(
    `https://graph.facebook.com/v18.0/oauth/access_token?` +
    `grant_type=fb_exchange_token&` +
    `client_id=${process.env.META_APP_ID}&` +
    `client_secret=${process.env.META_APP_SECRET}&` +
    `fb_exchange_token=${currentToken}`
  );

  if (!response.ok) {
    const error = await response.text();
    logger.error("Failed to refresh Meta token", { error });
    
    // Mark connection as error
    await prisma.integrationConnection.update({
      where: { id: connectionId },
      data: { status: "ERROR" },
    });

    throw new Error("Failed to refresh token");
  }

  const data = await response.json();
  const accessToken = data.access_token;
  const expiresIn = data.expires_in || 5184000; // 60 days
  const expiresAt = new Date(Date.now() + expiresIn * 1000);

  // Encrypt and store new access token
  const accessTokenEnc = encryptToken(accessToken);

  await prisma.integrationConnection.update({
    where: { id: connectionId },
    data: {
      accessTokenEnc,
      accessTokenExpiresAt: expiresAt,
      status: "CONNECTED",
      updatedAt: new Date(),
    },
  });

  logger.info("Refreshed Meta token", { connectionId });

  return { accessToken, expiresAt };
}

/**
 * Get valid access token for a connection (auto-refresh if needed)
 */
export async function getValidAccessToken(connectionId: string): Promise<string> {
  const connection = await prisma.integrationConnection.findUnique({
    where: { id: connectionId },
  });

  if (!connection) {
    throw new Error("Connection not found");
  }

  if (connection.status !== "CONNECTED") {
    throw new Error("Connection is not active");
  }

  if (!connection.accessTokenEnc) {
    throw new Error("No access token available");
  }

  // Check if token is expired or will expire soon (within 5 minutes)
  const now = new Date();
  const expiresAt = connection.accessTokenExpiresAt;
  const needsRefresh = !expiresAt || expiresAt.getTime() - now.getTime() < 5 * 60 * 1000;

  if (needsRefresh) {
    // Refresh token based on platform
    if (connection.platformCode === "GOOGLE_ADS") {
      const { accessToken } = await refreshGoogleAdsToken(connectionId);
      return accessToken;
    } else if (connection.platformCode === "META") {
      const { accessToken } = await refreshMetaToken(connectionId);
      return accessToken;
    }
  }

  // Token is still valid, decrypt and return
  return decryptToken(connection.accessTokenEnc);
}

/**
 * Refresh all expiring tokens (cron job)
 */
export async function refreshExpiringTokens(): Promise<{
  refreshed: number;
  failed: number;
}> {
  const logger = appLogger.child({ job: "token-refresh" });

  // Find connections with tokens expiring in the next 24 hours
  const expiringConnections = await prisma.integrationConnection.findMany({
    where: {
      status: "CONNECTED",
      accessTokenExpiresAt: {
        lte: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    },
  });

  let refreshed = 0;
  let failed = 0;

  for (const connection of expiringConnections) {
    try {
      if (connection.platformCode === "GOOGLE_ADS") {
        await refreshGoogleAdsToken(connection.id);
        refreshed++;
      } else if (connection.platformCode === "META") {
        await refreshMetaToken(connection.id);
        refreshed++;
      }
    } catch (error) {
      logger.error("Failed to refresh token", {
        connectionId: connection.id,
        platform: connection.platformCode,
        error,
      });
      failed++;
    }
  }

  logger.info("Token refresh completed", { refreshed, failed });

  return { refreshed, failed };
}
