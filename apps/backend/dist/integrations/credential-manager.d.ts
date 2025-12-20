/**
 * Credential Manager
 *
 * Centralized credential management using IntegrationConnection
 * Replaces platform-specific credential tables
 */
import { PrismaClient, PlatformCode } from "@prisma/client";
export interface CredentialData {
    accessToken: string;
    refreshToken?: string;
    accessTokenExpiresAt?: Date;
    refreshTokenExpiresAt?: Date;
    scope?: string;
    metadata?: Record<string, unknown>;
}
export declare class CredentialManager {
    private prisma;
    constructor(prisma: PrismaClient);
    /**
     * Store or update credentials for a platform
     */
    upsertCredential(params: {
        organizationId: string;
        platformCode: PlatformCode;
        externalAccountId: string;
        externalAccountName?: string;
        credentials: CredentialData;
        currency?: string;
        timezone?: string;
    }): Promise<void>;
    /**
     * Get credentials for a platform
     */
    getCredential(params: {
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
    } | null>;
    /**
     * Get all credentials for a platform
     */
    getAllCredentials(params: {
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
    }>>;
    /**
     * Update access token (e.g., after refresh)
     */
    updateAccessToken(params: {
        id: string;
        accessToken: string;
        expiresAt?: Date;
    }): Promise<void>;
    /**
     * Delete credentials
     */
    deleteCredential(params: {
        organizationId: string;
        platformCode: PlatformCode;
        externalAccountId: string;
    }): Promise<void>;
    /**
     * Check if credentials exist for a platform
     */
    hasCredentials(params: {
        organizationId: string;
        platformCode: PlatformCode;
    }): Promise<boolean>;
    /**
     * List all organizations with credentials for a platform
     */
    getOrganizationsWithCredentials(platformCode: PlatformCode): Promise<string[]>;
}
export declare const credentialManager: CredentialManager;
//# sourceMappingURL=credential-manager.d.ts.map