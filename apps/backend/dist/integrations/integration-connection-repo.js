import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export async function upsertIntegrationConnection(params) {
    return prisma.integrationConnection.upsert({
        where: {
            organizationId_platformCode_externalAccountId: {
                organizationId: params.organizationId,
                platformCode: params.platformCode,
                externalAccountId: params.externalAccountId,
            },
        },
        create: {
            organizationId: params.organizationId,
            platformCode: params.platformCode,
            externalAccountId: params.externalAccountId,
            externalAccountName: params.externalAccountName ?? null,
            currency: params.currency ?? null,
            timezone: params.timezone ?? null,
            status: params.status ?? "CONNECTED",
            accessTokenEnc: params.accessTokenEnc ?? null,
            refreshTokenEnc: params.refreshTokenEnc ?? null,
            accessTokenExpiresAt: params.accessTokenExpiresAt ?? null,
            refreshTokenExpiresAt: params.refreshTokenExpiresAt ?? null,
            scope: params.scope ?? null,
            tokenType: params.tokenType ?? null,
            metadata: params.metadata ?? null,
        },
        update: {
            externalAccountName: params.externalAccountName ?? undefined,
            currency: params.currency ?? undefined,
            timezone: params.timezone ?? undefined,
            status: params.status ?? undefined,
            accessTokenEnc: params.accessTokenEnc ?? undefined,
            refreshTokenEnc: params.refreshTokenEnc ?? undefined,
            accessTokenExpiresAt: params.accessTokenExpiresAt ?? undefined,
            refreshTokenExpiresAt: params.refreshTokenExpiresAt ?? undefined,
            scope: params.scope ?? undefined,
            tokenType: params.tokenType ?? undefined,
            metadata: params.metadata ?? undefined,
        },
        select: { id: true },
    });
}
export async function getIntegrationConnection(params) {
    return prisma.integrationConnection.findUnique({
        where: {
            organizationId_platformCode_externalAccountId: {
                organizationId: params.organizationId,
                platformCode: params.platformCode,
                externalAccountId: params.externalAccountId,
            },
        },
    });
}
export async function listIntegrationConnections(params) {
    return prisma.integrationConnection.findMany({
        where: {
            organizationId: params.organizationId,
            platformCode: params.platformCode,
        },
        orderBy: { updatedAt: "desc" },
    });
}
//# sourceMappingURL=integration-connection-repo.js.map