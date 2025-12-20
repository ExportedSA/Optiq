import { PrismaClient } from "@prisma/client";
import { META_ADS_CONFIG } from "../config/meta-ads";
import { createMetaApiClient } from "../services/meta-api-client";
import { decryptString } from "../utils/crypto";
const prisma = new PrismaClient();
function normalizeName(name) {
    return name.trim().replace(/\s+/g, " ");
}
function formatDate(date) {
    return date.toISOString().split("T")[0];
}
export async function runMetaAdsCostSyncJob(params) {
    const orgIds = params?.organizationId
        ? [params.organizationId]
        : (await prisma.integrationConnection.findMany({
            where: { platformCode: "META", status: "CONNECTED" },
            distinct: ["organizationId"],
            select: { organizationId: true },
        })).map((x) => x.organizationId);
    const platform = await prisma.platform.upsert({
        where: { code: "META" },
        create: { code: "META", name: "Meta Ads" },
        update: {},
    });
    for (const organizationId of orgIds) {
        const connections = await prisma.integrationConnection.findMany({
            where: { organizationId, platformCode: "META", status: "CONNECTED" },
            orderBy: { updatedAt: "desc" },
        });
        for (const conn of connections) {
            if (!conn.accessTokenEnc)
                continue;
            const accessToken = decryptString(conn.accessTokenEnc);
            const client = createMetaApiClient(accessToken);
            // ensure AdAccount exists
            let adAccount = await prisma.adAccount.findFirst({
                where: {
                    organizationId,
                    platformId: platform.id,
                    externalId: conn.externalAccountId,
                },
            });
            if (!adAccount) {
                // fetch minimal account metadata
                const accountData = await client.request(conn.externalAccountId, {
                    fields: "name,currency,timezone_name",
                });
                adAccount = await prisma.adAccount.create({
                    data: {
                        organizationId,
                        platformId: platform.id,
                        externalId: conn.externalAccountId,
                        name: normalizeName(accountData.name || conn.externalAccountName || `Meta Ad Account ${conn.externalAccountId}`),
                        currency: accountData.currency || conn.currency || "USD",
                        timezone: accountData.timezone_name || conn.timezone || "UTC",
                    },
                });
            }
            // determine range
            let startDate = params?.startDate ?? new Date();
            let endDate = params?.endDate ?? new Date();
            if (params?.backfill) {
                startDate = new Date();
                startDate.setDate(startDate.getDate() - META_ADS_CONFIG.sync.backfillDays);
                endDate = new Date();
            }
            else if (!params?.startDate) {
                startDate = new Date();
                startDate.setDate(startDate.getDate() - 1);
                endDate = new Date(startDate);
            }
            // fetch insights at ad level (Meta recommends level=ad and aggregate ourselves)
            const grouped = new Map();
            for await (const page of client.fetchAllPages(`${conn.externalAccountId}/insights`, {
                fields: META_ADS_CONFIG.insights.fields.join(","),
                time_range: JSON.stringify({ since: formatDate(startDate), until: formatDate(endDate) }),
                level: "ad",
                time_increment: "1",
                breakdowns: META_ADS_CONFIG.insights.breakdowns.join(","),
            })) {
                for (const row of page) {
                    const date = new Date(row.date_start + "T00:00:00Z");
                    const publisherPlatform = row.publisher_platform || "UNKNOWN";
                    const impressions = BigInt(parseInt(row.impressions || "0", 10));
                    const clicks = BigInt(parseInt(row.clicks || "0", 10));
                    const spendMicros = BigInt(Math.round(parseFloat(row.spend || "0") * 1_000_000));
                    const campaignId = row.campaign_id || "";
                    const adsetId = row.adset_id || "";
                    const adId = row.ad_id || "";
                    // campaign grain
                    if (campaignId) {
                        const key = `${formatDate(date)}|CAMPAIGN|${campaignId}|${publisherPlatform}`;
                        const agg = grouped.get(key) || {
                            grain: "CAMPAIGN",
                            date,
                            entityExternalId: campaignId,
                            entityName: row.campaign_name ? normalizeName(row.campaign_name) : null,
                            campaignExternalId: campaignId,
                            campaignName: row.campaign_name ? normalizeName(row.campaign_name) : null,
                            publisherPlatform,
                            impressions: BigInt(0),
                            clicks: BigInt(0),
                            spendMicros: BigInt(0),
                        };
                        agg.impressions += impressions;
                        agg.clicks += clicks;
                        agg.spendMicros += spendMicros;
                        grouped.set(key, agg);
                    }
                    // adset grain
                    if (adsetId) {
                        const key = `${formatDate(date)}|ADSET|${adsetId}|${publisherPlatform}`;
                        const agg = grouped.get(key) || {
                            grain: "ADSET",
                            date,
                            entityExternalId: adsetId,
                            entityName: row.adset_name ? normalizeName(row.adset_name) : null,
                            campaignExternalId: campaignId || null,
                            campaignName: row.campaign_name ? normalizeName(row.campaign_name) : null,
                            adsetExternalId: adsetId,
                            adsetName: row.adset_name ? normalizeName(row.adset_name) : null,
                            publisherPlatform,
                            impressions: BigInt(0),
                            clicks: BigInt(0),
                            spendMicros: BigInt(0),
                        };
                        agg.impressions += impressions;
                        agg.clicks += clicks;
                        agg.spendMicros += spendMicros;
                        grouped.set(key, agg);
                    }
                    // ad grain
                    if (adId) {
                        const key = `${formatDate(date)}|AD|${adId}|${publisherPlatform}`;
                        const agg = grouped.get(key) || {
                            grain: "AD",
                            date,
                            entityExternalId: adId,
                            entityName: row.ad_name ? normalizeName(row.ad_name) : null,
                            campaignExternalId: campaignId || null,
                            campaignName: row.campaign_name ? normalizeName(row.campaign_name) : null,
                            adsetExternalId: adsetId || null,
                            adsetName: row.adset_name ? normalizeName(row.adset_name) : null,
                            adExternalId: adId,
                            adName: row.ad_name ? normalizeName(row.ad_name) : null,
                            publisherPlatform,
                            impressions: BigInt(0),
                            clicks: BigInt(0),
                            spendMicros: BigInt(0),
                        };
                        agg.impressions += impressions;
                        agg.clicks += clicks;
                        agg.spendMicros += spendMicros;
                        grouped.set(key, agg);
                    }
                }
            }
            // upsert into CostFact
            for (const metric of grouped.values()) {
                await prisma.costFact.upsert({
                    where: {
                        organizationId_platformId_adAccountId_date_grain_entityExternalId_publisherPlatform: {
                            organizationId,
                            platformId: platform.id,
                            adAccountId: adAccount.id,
                            date: metric.date,
                            grain: metric.grain,
                            entityExternalId: metric.entityExternalId,
                            publisherPlatform: metric.publisherPlatform,
                        },
                    },
                    create: {
                        organizationId,
                        platformId: platform.id,
                        adAccountId: adAccount.id,
                        date: metric.date,
                        grain: metric.grain,
                        entityExternalId: metric.entityExternalId,
                        entityName: metric.entityName,
                        campaignExternalId: metric.campaignExternalId ?? null,
                        campaignName: metric.campaignName ?? null,
                        adsetExternalId: metric.adsetExternalId ?? null,
                        adsetName: metric.adsetName ?? null,
                        adExternalId: metric.adExternalId ?? null,
                        adName: metric.adName ?? null,
                        publisherPlatform: metric.publisherPlatform,
                        impressions: metric.impressions,
                        clicks: metric.clicks,
                        spendMicros: metric.spendMicros,
                        conversions: BigInt(0),
                        revenueMicros: BigInt(0),
                    },
                    update: {
                        entityName: metric.entityName,
                        campaignName: metric.campaignName ?? null,
                        adsetName: metric.adsetName ?? null,
                        adName: metric.adName ?? null,
                        impressions: metric.impressions,
                        clicks: metric.clicks,
                        spendMicros: metric.spendMicros,
                    },
                    select: { id: true },
                });
            }
        }
    }
}
//# sourceMappingURL=meta-ads-cost-sync.js.map