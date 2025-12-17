import "server-only";

import type { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { GoogleAdsService } from "@/lib/googleAds";
import { MetaAdsService } from "@/lib/metaAds";
import { TikTokAdsService } from "@/lib/tiktokAds";
import { DailySyncPayloadSchema, type DailySyncPayload } from "@/lib/ingestion/types";

async function ensurePlatform(code: "GOOGLE_ADS" | "META" | "TIKTOK", name: string) {
  const existing = await prisma.platform.findUnique({
    where: { code },
    select: { id: true },
  });
  if (existing) return existing;

  return prisma.platform.create({
    data: { code, name },
    select: { id: true },
  });
}

export async function runDailySyncJob(params: {
  organizationId: string;
  payload: unknown;
}) {
  const parsed = DailySyncPayloadSchema.parse(params.payload) as DailySyncPayload;

  const platform =
    parsed.platform === "GOOGLE_ADS"
      ? await ensurePlatform("GOOGLE_ADS", "Google Ads")
      : parsed.platform === "META"
        ? await ensurePlatform("META", "Meta Ads")
        : await ensurePlatform("TIKTOK", "TikTok Ads");

  const adAccount = await prisma.adAccount.upsert({
    where: {
      organizationId_platformId_externalId: {
        organizationId: params.organizationId,
        platformId: platform.id,
        externalId: parsed.externalAccountId,
      },
    },
    create: {
      organizationId: params.organizationId,
      platformId: platform.id,
      externalId: parsed.externalAccountId,
      name: `${parsed.platform} ${parsed.externalAccountId}`,
      currency: "USD",
      timezone: "UTC",
      status: "ACTIVE",
    },
    update: {
      name: `${parsed.platform} ${parsed.externalAccountId}`,
      status: "ACTIVE",
    },
    select: { id: true },
  });

  if (parsed.platform === "GOOGLE_ADS") {
    const svc = new GoogleAdsService();
    const rows =
      parsed.granularity === "ad"
        ? await svc.fetchDailyAdMetrics({
            organizationId: params.organizationId,
            customerId: parsed.externalAccountId,
            startDate: parsed.startDate,
            endDate: parsed.endDate,
          })
        : await svc.fetchDailyCampaignMetrics({
            organizationId: params.organizationId,
            customerId: parsed.externalAccountId,
            startDate: parsed.startDate,
            endDate: parsed.endDate,
          });

    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      for (const r of rows) {
        const campaign = await tx.campaign.upsert({
          where: {
            organizationId_platformId_externalId: {
              organizationId: params.organizationId,
              platformId: platform.id,
              externalId: r.campaignId,
            },
          },
          create: {
            organizationId: params.organizationId,
            platformId: platform.id,
            adAccountId: adAccount.id,
            externalId: r.campaignId,
            name: r.campaignName,
            status: "ACTIVE",
          },
          update: {
            name: r.campaignName,
            status: "ACTIVE",
          },
          select: { id: true },
        });

        if (parsed.granularity === "ad" && r.adId) {
          const ad = await tx.ad.upsert({
            where: {
              organizationId_platformId_externalId: {
                organizationId: params.organizationId,
                platformId: platform.id,
                externalId: r.adId,
              },
            },
            create: {
              organizationId: params.organizationId,
              platformId: platform.id,
              adAccountId: adAccount.id,
              campaignId: campaign.id,
              externalId: r.adId,
              name: r.adName ?? r.adId,
              status: "ACTIVE",
            },
            update: {
              name: r.adName ?? r.adId,
              status: "ACTIVE",
            },
            select: { id: true },
          });

          await tx.dailyAdMetric.upsert({
            where: {
              organizationId_adId_date: {
                organizationId: params.organizationId,
                adId: ad.id,
                date: new Date(r.date),
              },
            },
            create: {
              organizationId: params.organizationId,
              platformId: platform.id,
              adAccountId: adAccount.id,
              campaignId: campaign.id,
              adId: ad.id,
              date: new Date(r.date),
              impressions: r.impressions,
              clicks: r.clicks,
              conversions: r.conversions,
              spendMicros: r.costMicros,
              revenueMicros: 0n,
            },
            update: {
              impressions: r.impressions,
              clicks: r.clicks,
              conversions: r.conversions,
              spendMicros: r.costMicros,
            },
            select: { id: true },
          });
        } else {
          await tx.dailyCampaignMetric.upsert({
            where: {
              organizationId_campaignId_date: {
                organizationId: params.organizationId,
                campaignId: campaign.id,
                date: new Date(r.date),
              },
            },
            create: {
              organizationId: params.organizationId,
              platformId: platform.id,
              adAccountId: adAccount.id,
              campaignId: campaign.id,
              date: new Date(r.date),
              impressions: r.impressions,
              clicks: r.clicks,
              conversions: r.conversions,
              spendMicros: r.costMicros,
              revenueMicros: 0n,
            },
            update: {
              impressions: r.impressions,
              clicks: r.clicks,
              conversions: r.conversions,
              spendMicros: r.costMicros,
            },
            select: { id: true },
          });
        }
      }
    });

    return { rows: rows.length };
  }

  if (parsed.platform === "META") {
    const svc = new MetaAdsService();
    const rows =
      parsed.granularity === "ad"
        ? await svc.fetchDailyAdInsights({
            organizationId: params.organizationId,
            metaAdAccountId: parsed.externalAccountId,
            startDate: parsed.startDate,
            endDate: parsed.endDate,
          })
        : await svc.fetchDailyCampaignInsights({
            organizationId: params.organizationId,
            metaAdAccountId: parsed.externalAccountId,
            startDate: parsed.startDate,
            endDate: parsed.endDate,
          });

    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      for (const r of rows) {
        const campaign = await tx.campaign.upsert({
          where: {
            organizationId_platformId_externalId: {
              organizationId: params.organizationId,
              platformId: platform.id,
              externalId: r.campaignId,
            },
          },
          create: {
            organizationId: params.organizationId,
            platformId: platform.id,
            adAccountId: adAccount.id,
            externalId: r.campaignId,
            name: r.campaignName,
            status: "ACTIVE",
          },
          update: {
            name: r.campaignName,
            status: "ACTIVE",
          },
          select: { id: true },
        });

        if (parsed.granularity === "ad" && r.adId) {
          const ad = await tx.ad.upsert({
            where: {
              organizationId_platformId_externalId: {
                organizationId: params.organizationId,
                platformId: platform.id,
                externalId: r.adId,
              },
            },
            create: {
              organizationId: params.organizationId,
              platformId: platform.id,
              adAccountId: adAccount.id,
              campaignId: campaign.id,
              externalId: r.adId,
              name: r.adName ?? r.adId,
              status: "ACTIVE",
            },
            update: {
              name: r.adName ?? r.adId,
              status: "ACTIVE",
            },
            select: { id: true },
          });

          await tx.dailyAdMetric.upsert({
            where: {
              organizationId_adId_date: {
                organizationId: params.organizationId,
                adId: ad.id,
                date: new Date(r.date),
              },
            },
            create: {
              organizationId: params.organizationId,
              platformId: platform.id,
              adAccountId: adAccount.id,
              campaignId: campaign.id,
              adId: ad.id,
              date: new Date(r.date),
              impressions: r.impressions,
              clicks: r.clicks,
              conversions: r.conversions,
              spendMicros: r.spendMicros,
              revenueMicros: 0n,
            },
            update: {
              impressions: r.impressions,
              clicks: r.clicks,
              conversions: r.conversions,
              spendMicros: r.spendMicros,
            },
            select: { id: true },
          });
        } else {
          await tx.dailyCampaignMetric.upsert({
            where: {
              organizationId_campaignId_date: {
                organizationId: params.organizationId,
                campaignId: campaign.id,
                date: new Date(r.date),
              },
            },
            create: {
              organizationId: params.organizationId,
              platformId: platform.id,
              adAccountId: adAccount.id,
              campaignId: campaign.id,
              date: new Date(r.date),
              impressions: r.impressions,
              clicks: r.clicks,
              conversions: r.conversions,
              spendMicros: r.spendMicros,
              revenueMicros: 0n,
            },
            update: {
              impressions: r.impressions,
              clicks: r.clicks,
              conversions: r.conversions,
              spendMicros: r.spendMicros,
            },
            select: { id: true },
          });
        }
      }
    });

    return { rows: rows.length };
  }

  const svc = new TikTokAdsService();
  const rows =
    parsed.granularity === "ad"
      ? await svc.fetchDailyAdReport({
          organizationId: params.organizationId,
          advertiserId: parsed.externalAccountId,
          startDate: parsed.startDate,
          endDate: parsed.endDate,
        })
      : await svc.fetchDailyCampaignReport({
          organizationId: params.organizationId,
          advertiserId: parsed.externalAccountId,
          startDate: parsed.startDate,
          endDate: parsed.endDate,
        });

  await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    for (const r of rows) {
      const campaign = await tx.campaign.upsert({
        where: {
          organizationId_platformId_externalId: {
            organizationId: params.organizationId,
            platformId: platform.id,
            externalId: r.campaignId,
          },
        },
        create: {
          organizationId: params.organizationId,
          platformId: platform.id,
          adAccountId: adAccount.id,
          externalId: r.campaignId,
          name: r.campaignName || r.campaignId,
          status: "ACTIVE",
        },
        update: {
          name: r.campaignName || r.campaignId,
          status: "ACTIVE",
        },
        select: { id: true },
      });

      if (parsed.granularity === "ad" && r.adId) {
        const ad = await tx.ad.upsert({
          where: {
            organizationId_platformId_externalId: {
              organizationId: params.organizationId,
              platformId: platform.id,
              externalId: r.adId,
            },
          },
          create: {
            organizationId: params.organizationId,
            platformId: platform.id,
            adAccountId: adAccount.id,
            campaignId: campaign.id,
            externalId: r.adId,
            name: r.adName ?? r.adId,
            status: "ACTIVE",
          },
          update: {
            name: r.adName ?? r.adId,
            status: "ACTIVE",
          },
          select: { id: true },
        });

        await tx.dailyAdMetric.upsert({
          where: {
            organizationId_adId_date: {
              organizationId: params.organizationId,
              adId: ad.id,
              date: new Date(r.date),
            },
          },
          create: {
            organizationId: params.organizationId,
            platformId: platform.id,
            adAccountId: adAccount.id,
            campaignId: campaign.id,
            adId: ad.id,
            date: new Date(r.date),
            impressions: r.impressions,
            clicks: r.clicks,
            conversions: r.conversions,
            spendMicros: r.spendMicros,
            revenueMicros: 0n,
          },
          update: {
            impressions: r.impressions,
            clicks: r.clicks,
            conversions: r.conversions,
            spendMicros: r.spendMicros,
          },
          select: { id: true },
        });
      } else {
        await tx.dailyCampaignMetric.upsert({
          where: {
            organizationId_campaignId_date: {
              organizationId: params.organizationId,
              campaignId: campaign.id,
              date: new Date(r.date),
            },
          },
          create: {
            organizationId: params.organizationId,
            platformId: platform.id,
            adAccountId: adAccount.id,
            campaignId: campaign.id,
            date: new Date(r.date),
            impressions: r.impressions,
            clicks: r.clicks,
            conversions: r.conversions,
            spendMicros: r.spendMicros,
            revenueMicros: 0n,
          },
          update: {
            impressions: r.impressions,
            clicks: r.clicks,
            conversions: r.conversions,
            spendMicros: r.spendMicros,
          },
          select: { id: true },
        });
      }
    }
  });

  return { rows: rows.length };
}
