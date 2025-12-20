/**
 * Credential Manager
 *
 * Centralized credential management using IntegrationConnection
 * Replaces platform-specific credential tables
 */
import { PrismaClient } from "@prisma/client";
import { encryptString, decryptString } from "../utils/encryption";
export class CredentialManager {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    /**
     * Store or update credentials for a platform
     */
    async upsertCredential(params) {
        const { organizationId, platformCode, externalAccountId, externalAccountName, credentials, currency, timezone, } = params;
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
                metadata: credentials.metadata,
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
                metadata: credentials.metadata,
                updatedAt: new Date(),
            },
        });
    }
    /**
     * Get credentials for a platform
     */
    async getCredential(params) {
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
        }
        else {
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
            metadata: connection.metadata,
        };
    }
    /**
     * Get all credentials for a platform
     */
    async getAllCredentials(params) {
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
            accessToken: decryptString(c.accessTokenEnc),
            refreshToken: c.refreshTokenEnc ? decryptString(c.refreshTokenEnc) : null,
            accessTokenExpiresAt: c.accessTokenExpiresAt,
            refreshTokenExpiresAt: c.refreshTokenExpiresAt,
            scope: c.scope,
            metadata: c.metadata,
        }));
    }
    /**
     * Update access token (e.g., after refresh)
     */
    async updateAccessToken(params) {
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
    async deleteCredential(params) {
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
    async hasCredentials(params) {
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
    async getOrganizationsWithCredentials(platformCode) {
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
//# sourceMappingURL=credential-manager.js.map