/**
 * Credential Manager
 * 
 * Centralized credential management using IntegrationConnection
 * Replaces platform-specific credential tables
 */

import { PrismaClient, PlatformCode, IntegrationConnectionStatus } from "@prisma/client";
import { encryptString, decryptString } from "../utils/encryption";

export interface CredentialData {
  accessToken: string;
  refreshToken?: string;
  accessTokenExpiresAt?: Date;
  refreshTokenExpiresAt?: Date;
  scope?: string;
  metadata?: Record<string, unknown>;
}

export class CredentialManager {
  constructor(private prisma: PrismaClient) {}

  /**
   * Store or update credentials for a platform
   */
  async upsertCredential(params: {
    organizationId: string;
    platformCode: PlatformCode;
    externalAccountId: string;
    externalAccountName?: string;
    credentials: CredentialData;
    currency?: string;
    timezone?: string;
  }): Promise<void> {
    const {
      organizationId,
      platformCode,
      externalAccountId,
      externalAccountName,
      credentials,
      currency,
      timezone,
    } = params;

    await this.prisma.integrationConnection.upsert({
      where: {
        organizationId_platformCode_externalAccountId: {
          organizationId,
          platformCode,
          externalAccountId,
        },
      },
      create: {
        organizationId,
        platformCode,
        externalAccountId,
        externalAccountName,
        accessTokenEnc: credentials.accessToken ? encryptString(credentials.accessToken) : null,
        refreshTokenEnc: credentials.refreshToken ? encryptString(credentials.refreshToken) : null,
        accessTokenExpiresAt: credentials.accessTokenExpiresAt,
        refreshTokenExpiresAt: credentials.refreshTokenExpiresAt,
        scope: credentials.scope,
        currency,
        timezone,
        status: "CONNECTED",
        metadata: credentials.metadata as any,
      },
      update: {
        externalAccountName,
        accessTokenEnc: credentials.accessToken ? encryptString(credentials.accessToken) : undefined,
        refreshTokenEnc: credentials.refreshToken ? encryptString(credentials.refreshToken) : undefined,
        accessTokenExpiresAt: credentials.accessTokenExpiresAt,
        refreshTokenExpiresAt: credentials.refreshTokenExpiresAt,
        scope: credentials.scope,
        currency,
        timezone,
        status: "CONNECTED",
        metadata: credentials.metadata as any,
        updatedAt: new Date(),
      },
    });
  }

  /**
   * Get credentials for a platform
   */
  async getCredential(params: {
    organizationId: string;
    platformCode: PlatformCode;
    externalAccountId?: string;
  }): Promise<{
    id: string;
    externalAccountId: string;
    externalAccountName: string | null;
    accessToken: string;
    refreshToken: string | null;
    accessTokenExpiresAt: Date | null;
    refreshTokenExpiresAt: Date | null;
    scope: string | null;
    metadata: Record<string, unknown> | null;
  } | null> {
    const { organizationId, platformCode, externalAccountId } = params;

    let connection;

    if (externalAccountId) {
      connection = await this.prisma.integrationConnection.findUnique({
        where: {
          organizationId_platformCode_externalAccountId: {
            organizationId,
            platformCode,
            externalAccountId,
          },
        },
      });
    } else {
      // Get the most recent connection for this platform
      connection = await this.prisma.integrationConnection.findFirst({
        where: {
          organizationId,
          platformCode,
          status: "CONNECTED",
        },
        orderBy: { createdAt: "desc" },
      });
    }

    if (!connection || !connection.accessTokenEnc) {
      return null;
    }

    return {
      id: connection.id,
      externalAccountId: connection.externalAccountId,
      externalAccountName: connection.externalAccountName,
      accessToken: decryptString(connection.accessTokenEnc),
      refreshToken: connection.refreshTokenEnc ? decryptString(connection.refreshTokenEnc) : null,
      accessTokenExpiresAt: connection.accessTokenExpiresAt,
      refreshTokenExpiresAt: connection.refreshTokenExpiresAt,
      scope: connection.scope,
      metadata: connection.metadata as Record<string, unknown> | null,
    };
  }

  /**
   * Get all credentials for a platform
   */
  async getAllCredentials(params: {
    organizationId: string;
    platformCode: PlatformCode;
  }): Promise<Array<{
    id: string;
    externalAccountId: string;
    externalAccountName: string | null;
    accessToken: string;
    refreshToken: string | null;
    accessTokenExpiresAt: Date | null;
    refreshTokenExpiresAt: Date | null;
    scope: string | null;
    metadata: Record<string, unknown> | null;
  }>> {
    const { organizationId, platformCode } = params;

    const connections = await this.prisma.integrationConnection.findMany({
      where: {
        organizationId,
        platformCode,
        status: "CONNECTED",
      },
      orderBy: { createdAt: "desc" },
    });

    return connections
      .filter((c) => c.accessTokenEnc)
      .map((c) => ({
        id: c.id,
        externalAccountId: c.externalAccountId,
        externalAccountName: c.externalAccountName,
        accessToken: decryptString(c.accessTokenEnc!),
        refreshToken: c.refreshTokenEnc ? decryptString(c.refreshTokenEnc) : null,
        accessTokenExpiresAt: c.accessTokenExpiresAt,
        refreshTokenExpiresAt: c.refreshTokenExpiresAt,
        scope: c.scope,
        metadata: c.metadata as Record<string, unknown> | null,
      }));
  }

  /**
   * Update access token (e.g., after refresh)
   */
  async updateAccessToken(params: {
    id: string;
    accessToken: string;
    expiresAt?: Date;
  }): Promise<void> {
    await this.prisma.integrationConnection.update({
      where: { id: params.id },
      data: {
        accessTokenEnc: encryptString(params.accessToken),
        accessTokenExpiresAt: params.expiresAt,
        updatedAt: new Date(),
      },
    });
  }

  /**
   * Delete credentials
   */
  async deleteCredential(params: {
    organizationId: string;
    platformCode: PlatformCode;
    externalAccountId: string;
  }): Promise<void> {
    await this.prisma.integrationConnection.delete({
      where: {
        organizationId_platformCode_externalAccountId: {
          organizationId: params.organizationId,
          platformCode: params.platformCode,
          externalAccountId: params.externalAccountId,
        },
      },
    });
  }

  /**
   * Check if credentials exist for a platform
   */
  async hasCredentials(params: {
    organizationId: string;
    platformCode: PlatformCode;
  }): Promise<boolean> {
    const count = await this.prisma.integrationConnection.count({
      where: {
        organizationId: params.organizationId,
        platformCode: params.platformCode,
        status: "CONNECTED",
      },
    });

    return count > 0;
  }

  /**
   * List all organizations with credentials for a platform
   */
  async getOrganizationsWithCredentials(platformCode: PlatformCode): Promise<string[]> {
    const connections = await this.prisma.integrationConnection.findMany({
      where: {
        platformCode,
        status: "CONNECTED",
      },
      distinct: ["organizationId"],
      select: { organizationId: true },
    });

    return connections.map((c) => c.organizationId);
  }
}

// Export singleton instance
export const credentialManager = new CredentialManager(new PrismaClient());
