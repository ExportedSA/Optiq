import { PrismaClient } from "@prisma/client";
import { decryptString, encryptString } from "../utils/crypto";
import { TikTokAdsClient } from "../services/tiktok-ads-client";
import { env } from "../env";
const prisma = new PrismaClient();
const BACKFILL_DAYS = 90;
function normalizeName(name) {
    return name.trim().replace(/\s+/g, " ");
}
function asIsoDate(d) {
    return d.toISOString().slice(0, 10);
}
export async function runTikTokAdsCostSyncJob(params) {
    void env; // referenced to ensure env is loaded
    const platform = await prisma.platform.upsert({
        where: { code: "TIKTOK" },
        create: { code: "TIKTOK", name: "TikTok Ads" },
        update: {},
    });
    const orgIds = params?.organizationId
        ? [params.organizationId]
        : (await prisma.integrationConnection.findMany({
            where: { platformCode: "TIKTOK", status: "CONNECTED" },
            distinct: ["organizationId"],
            select: { organizationId: true },
        })).map((x) => x.organizationId);
    const client = new TikTokAdsClient();
    for (const organizationId of orgIds) {
        const connections = await prisma.integrationConnection.findMany({
            where: {
                organizationId,
                platformCode: "TIKTOK",
                status: "CONNECTED",
                ...(params?.advertiserId ? { externalAccountId: params.advertiserId } : {}),
            },
        });
        for (const conn of connections) {
            if (!conn.refreshTokenEnc)
                continue;
            const now = Date.now();
            const accessExp = conn.accessTokenExpiresAt?.getTime() ?? 0;
            let accessToken;
            if (conn.accessTokenEnc && accessExp - now > 60_000) {
                accessToken = decryptString(conn.accessTokenEnc);
            }
            else {
                const refreshToken = decryptString(conn.refreshTokenEnc);
                const refreshed = await client.refreshToken(refreshToken);
                const newAccessExp = new Date(Date.now() + refreshed.expires_in * 1000);
                const newRefreshExp = new Date(Date.now() + refreshed.refresh_expires_in * 1000);
                await prisma.integrationConnection.update({
                    where: { id: conn.id },
                    data: {
                        accessTokenEnc: encryptString(refreshed.access_token),
                        refreshTokenEnc: encryptString(refreshed.refresh_token),
                        accessTokenExpiresAt: newAccessExp,
                        refreshTokenExpiresAt: newRefreshExp,
                        scope: refreshed.scope,
                        status: "CONNECTED",
                    },
                    select: { id: true },
                });
                accessToken = refreshed.access_token;
            }
            // ensure ad account exists
            const adAccount = await prisma.adAccount.upsert({
                where: {
                    organizationId_platformId_externalId: {
                        organizationId,
                        platformId: platform.id,
                        externalId: conn.externalAccountId,
                    },
                },
                create: {
                    organizationId,
                    platformId: platform.id,
                    externalId: conn.externalAccountId,
                    name: conn.externalAccountName ?? `TikTok ${conn.externalAccountId}`,
                    currency: conn.currency ?? "USD",
                    timezone: conn.timezone ?? "UTC",
                    status: "ACTIVE",
                },
                update: {
                    name: conn.externalAccountName ?? `TikTok ${conn.externalAccountId}`,
                    status: "ACTIVE",
                },
            });
            let startDate = params?.startDate ?? new Date();
            let endDate = params?.endDate ?? new Date();
            if (params?.backfill) {
                startDate = new Date();
                startDate.setDate(startDate.getDate() - BACKFILL_DAYS);
                endDate = new Date();
            }
            else if (!params?.startDate) {
                startDate = new Date();
                startDate.setDate(startDate.getDate() - 1);
                endDate = new Date(startDate);
            }
            const start = asIsoDate(startDate);
            const end = asIsoDate(endDate);
            // campaign grain
            const campaignRows = await client.fetchDailyCampaignReport({
                advertiserId: conn.externalAccountId,
                accessToken,
                startDate: start,
                endDate: end,
            });
            for (const r of campaignRows) {
                const date = new Date(r.date + "T00:00:00Z");
                await prisma.costFact.upsert({
                    where: {
                        organizationId_platformId_adAccountId_date_grain_entityExternalId_publisherPlatform: {
                            organizationId,
                            platformId: platform.id,
                            adAccountId: adAccount.id,
                            date,
                            grain: "CAMPAIGN",
                            entityExternalId: r.campaignId,
                            publisherPlatform: null,
                        },
                    },
                    create: {
                        organizationId,
                        platformId: platform.id,
                        adAccountId: adAccount.id,
                        date,
                        grain: "CAMPAIGN",
                        entityExternalId: r.campaignId,
                        entityName: r.campaignName ? normalizeName(r.campaignName) : null,
                        campaignExternalId: r.campaignId,
                        campaignName: r.campaignName ? normalizeName(r.campaignName) : null,
                        publisherPlatform: null,
                        impressions: r.impressions,
                        clicks: r.clicks,
                        spendMicros: r.spendMicros,
                        conversions: r.conversions,
                        revenueMicros: BigInt(0),
                    },
                    update: {
                        entityName: r.campaignName ? normalizeName(r.campaignName) : null,
                        campaignName: r.campaignName ? normalizeName(r.campaignName) : null,
                        impressions: r.impressions,
                        clicks: r.clicks,
                        spendMicros: r.spendMicros,
                        conversions: r.conversions,
                    },
                    select: { id: true },
                });
            }
            // ad grain
            const adRows = await client.fetchDailyAdReport({
                advertiserId: conn.externalAccountId,
                accessToken,
                startDate: start,
                endDate: end,
            });
            for (const r of adRows) {
                if (!r.adId)
                    continue;
                const date = new Date(r.date + "T00:00:00Z");
                await prisma.costFact.upsert({
                    where: {
                        organizationId_platformId_adAccountId_date_grain_entityExternalId_publisherPlatform: {
                            organizationId,
                            platformId: platform.id,
                            adAccountId: adAccount.id,
                            date,
                            grain: "AD",
                            entityExternalId: r.adId,
                            publisherPlatform: null,
                        },
                    },
                    create: {
                        organizationId,
                        platformId: platform.id,
                        adAccountId: adAccount.id,
                        date,
                        grain: "AD",
                        entityExternalId: r.adId,
                        entityName: r.adName ? normalizeName(r.adName) : null,
                        campaignExternalId: r.campaignId,
                        campaignName: r.campaignName ? normalizeName(r.campaignName) : null,
                        adExternalId: r.adId,
                        adName: r.adName ? normalizeName(r.adName) : null,
                        publisherPlatform: null,
                        impressions: r.impressions,
                        clicks: r.clicks,
                        spendMicros: r.spendMicros,
                        conversions: r.conversions,
                        revenueMicros: BigInt(0),
                    },
                    update: {
                        entityName: r.adName ? normalizeName(r.adName) : null,
                        campaignName: r.campaignName ? normalizeName(r.campaignName) : null,
                        adName: r.adName ? normalizeName(r.adName) : null,
                        impressions: r.impressions,
                        clicks: r.clicks,
                        spendMicros: r.spendMicros,
                        conversions: r.conversions,
                    },
                    select: { id: true },
                });
            }
        }
    }
}
//# sourceMappingURL=tiktok-ads-cost-sync.js.map