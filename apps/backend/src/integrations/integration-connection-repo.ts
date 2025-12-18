import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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

export async function upsertIntegrationConnection(params: IntegrationConnectionUpsertParams) {
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
      metadata: (params.metadata as any) ?? null,
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
      metadata: (params.metadata as any) ?? undefined,
    },
    select: { id: true },
  });
}

export async function getIntegrationConnection(params: {
  organizationId: string;
  platformCode: "META" | "GOOGLE_ADS" | "TIKTOK" | "LINKEDIN" | "X";
  externalAccountId: string;
}) {
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

export async function listIntegrationConnections(params: {
  organizationId: string;
  platformCode?: "META" | "GOOGLE_ADS" | "TIKTOK" | "LINKEDIN" | "X";
}) {
  return prisma.integrationConnection.findMany({
    where: {
      organizationId: params.organizationId,
      platformCode: params.platformCode,
    },
    orderBy: { updatedAt: "desc" },
  });
}
