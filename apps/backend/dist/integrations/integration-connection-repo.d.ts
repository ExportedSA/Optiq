export type IntegrationConnectionUpsertParams = {
    organizationId: string;
    platformCode: "META" | "GOOGLE_ADS" | "TIKTOK" | "LINKEDIN" | "X";
    externalAccountId: string;
    externalAccountName?: string | null;
    currency?: string | null;
    timezone?: string | null;
    status?: "CONNECTED" | "DISCONNECTED" | "ERROR" | "EXPIRED";
    accessTokenEnc?: string | null;
    refreshTokenEnc?: string | null;
    accessTokenExpiresAt?: Date | null;
    refreshTokenExpiresAt?: Date | null;
    scope?: string | null;
    tokenType?: string | null;
    metadata?: unknown;
};
export declare function upsertIntegrationConnection(params: IntegrationConnectionUpsertParams): Promise<{
    id: string;
}>;
export declare function getIntegrationConnection(params: {
    organizationId: string;
    platformCode: "META" | "GOOGLE_ADS" | "TIKTOK" | "LINKEDIN" | "X";
    externalAccountId: string;
}): Promise<{
    metadata: import("@prisma/client/runtime/library").JsonValue | null;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    organizationId: string;
    platformCode: import("@prisma/client").$Enums.PlatformCode;
    externalAccountId: string;
    externalAccountName: string | null;
    currency: string | null;
    timezone: string | null;
    status: import("@prisma/client").$Enums.IntegrationConnectionStatus;
    accessTokenEnc: string | null;
    refreshTokenEnc: string | null;
    accessTokenExpiresAt: Date | null;
    refreshTokenExpiresAt: Date | null;
    scope: string | null;
    tokenType: string | null;
} | null>;
export declare function listIntegrationConnections(params: {
    organizationId: string;
    platformCode?: "META" | "GOOGLE_ADS" | "TIKTOK" | "LINKEDIN" | "X";
}): Promise<{
    metadata: import("@prisma/client/runtime/library").JsonValue | null;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    organizationId: string;
    platformCode: import("@prisma/client").$Enums.PlatformCode;
    externalAccountId: string;
    externalAccountName: string | null;
    currency: string | null;
    timezone: string | null;
    status: import("@prisma/client").$Enums.IntegrationConnectionStatus;
    accessTokenEnc: string | null;
    refreshTokenEnc: string | null;
    accessTokenExpiresAt: Date | null;
    refreshTokenExpiresAt: Date | null;
    scope: string | null;
    tokenType: string | null;
}[]>;
//# sourceMappingURL=integration-connection-repo.d.ts.map