import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { requireActiveOrgId } from "@/lib/tenant";
import { GoogleAdsService } from "@/lib/googleAds";
import type { Prisma } from "@prisma/client";

const IngestSchema = z.object({
  customerId: z.string().min(1),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  granularity: z.enum(["campaign", "ad"]).default("campaign"),
});

async function ensureGoogleAdsPlatform() {
  const existing = await prisma.platform.findUnique({
    where: { code: "GOOGLE_ADS" },
    select: { id: true },
  });
  if (existing) return existing;

  return prisma.platform.create({
    data: {
      code: "GOOGLE_ADS",
      name: "Google Ads",
    },
    select: { id: true },
  });
}

export async function POST(req: Request) {
  const orgId = await requireActiveOrgId();
  const json = await req.json().catch(() => null);
  const parsed = IngestSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const platform = await ensureGoogleAdsPlatform();

  const svc = new GoogleAdsService();
  const rows =
    parsed.data.granularity === "ad"
      ? await svc.fetchDailyAdMetrics({
          organizationId: orgId,
          customerId: parsed.data.customerId,
          startDate: parsed.data.startDate,
          endDate: parsed.data.endDate,
        })
      : await svc.fetchDailyCampaignMetrics({
          organizationId: orgId,
          customerId: parsed.data.customerId,
          startDate: parsed.data.startDate,
          endDate: parsed.data.endDate,
        });

  const adAccount = await prisma.adAccount.upsert({
    where: {
      organizationId_platformId_externalId: {
        organizationId: orgId,
        platformId: platform.id,
        externalId: parsed.data.customerId,
      },
    },
    create: {
      organizationId: orgId,
      platformId: platform.id,
      externalId: parsed.data.customerId,
      name: `Google Ads ${parsed.data.customerId}`,
      currency: "USD",
      timezone: "UTC",
      status: "ACTIVE",
    },
    update: {
      name: `Google Ads ${parsed.data.customerId}`,
      status: "ACTIVE",
    },
    select: { id: true },
  });

  await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    for (const r of rows) {
      const campaign = await tx.campaign.upsert({
        where: {
          organizationId_platformId_externalId: {
            organizationId: orgId,
            platformId: platform.id,
            externalId: r.campaignId,
          },
        },
        create: {
          organizationId: orgId,
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

      if (parsed.data.granularity === "ad" && r.adId) {
        const ad = await tx.ad.upsert({
          where: {
            organizationId_platformId_externalId: {
              organizationId: orgId,
              platformId: platform.id,
              externalId: r.adId,
            },
          },
          create: {
            organizationId: orgId,
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
              organizationId: orgId,
              adId: ad.id,
              date: new Date(r.date),
            },
          },
          create: {
            organizationId: orgId,
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
              organizationId: orgId,
              campaignId: campaign.id,
              date: new Date(r.date),
            },
          },
          create: {
            organizationId: orgId,
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

  return NextResponse.json({ ok: true, rows: rows.length }, { status: 200 });
}
