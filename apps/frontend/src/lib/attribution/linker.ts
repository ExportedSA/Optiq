import "server-only";

import { prisma } from "@/lib/prisma";
import type {
  AttributionModel,
  TouchPointData,
  AttributionLinkInput,
} from "@/lib/attribution/types";
import {
  extractClickIds,
  inferPlatformFromClickId,
} from "@/lib/attribution/types";

const LOOKBACK_DAYS = 30;

function computeWeights(
  touchPoints: TouchPointData[],
  model: AttributionModel,
): number[] {
  const n = touchPoints.length;
  if (n === 0) return [];

  switch (model) {
    case "FIRST_TOUCH":
      return touchPoints.map((_, i) => (i === 0 ? 1 : 0));

    case "LAST_TOUCH":
      return touchPoints.map((_, i) => (i === n - 1 ? 1 : 0));

    case "LINEAR":
      return touchPoints.map(() => 1 / n);

    case "TIME_DECAY": {
      const decayRate = 0.5;
      const halfLifeMs = 7 * 24 * 60 * 60 * 1000;
      const lastTs = touchPoints[n - 1].occurredAt.getTime();
      const rawWeights = touchPoints.map((tp) => {
        const age = lastTs - tp.occurredAt.getTime();
        return Math.pow(decayRate, age / halfLifeMs);
      });
      const sum = rawWeights.reduce((a, b) => a + b, 0);
      return rawWeights.map((w) => w / sum);
    }

    case "POSITION_BASED": {
      if (n === 1) return [1];
      if (n === 2) return [0.5, 0.5];
      const firstLast = 0.4;
      const middle = 0.2 / (n - 2);
      return touchPoints.map((_, i) => {
        if (i === 0 || i === n - 1) return firstLast;
        return middle;
      });
    }

    default:
      return touchPoints.map(() => 1 / n);
  }
}

export async function recordTouchPoint(params: {
  siteId: string;
  anonId: string;
  sessionId: string;
  url: string;
  referrer: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmTerm: string | null;
  utmContent: string | null;
}): Promise<{ id: string }> {
  const clickIds = extractClickIds(params.url);
  const platformCode = inferPlatformFromClickId(clickIds);

  const tp = await prisma.touchPoint.create({
    data: {
      siteId: params.siteId,
      anonId: params.anonId,
      sessionId: params.sessionId,
      occurredAt: new Date(),
      utmSource: params.utmSource,
      utmMedium: params.utmMedium,
      utmCampaign: params.utmCampaign,
      utmTerm: params.utmTerm,
      utmContent: params.utmContent,
      gclid: clickIds.gclid,
      fbclid: clickIds.fbclid,
      ttclid: clickIds.ttclid,
      msclkid: clickIds.msclkid,
      clickId: clickIds.clickId,
      referrer: params.referrer,
      landingUrl: params.url,
      platformCode,
    },
    select: { id: true },
  });

  return tp;
}

export async function linkConversionToTouchPoints(params: {
  siteId: string;
  conversionId: string;
  anonId: string;
  conversionTime: Date;
  models?: AttributionModel[];
}): Promise<{ linked: number }> {
  const models: AttributionModel[] = params.models ?? [
    "FIRST_TOUCH",
    "LAST_TOUCH",
    "LINEAR",
    "TIME_DECAY",
    "POSITION_BASED",
  ];

  const lookbackStart = new Date(
    params.conversionTime.getTime() - LOOKBACK_DAYS * 24 * 60 * 60 * 1000,
  );

  const touchPoints = (await prisma.touchPoint.findMany({
    where: {
      siteId: params.siteId,
      anonId: params.anonId,
      occurredAt: {
        gte: lookbackStart,
        lte: params.conversionTime,
      },
    },
    orderBy: { occurredAt: "asc" },
  })) as TouchPointData[];

  if (touchPoints.length === 0) {
    return { linked: 0 };
  }

  const links: AttributionLinkInput[] = [];

  for (const model of models) {
    const weights = computeWeights(touchPoints, model);

    for (let i = 0; i < touchPoints.length; i++) {
      if (weights[i] <= 0) continue;

      links.push({
        siteId: params.siteId,
        conversionId: params.conversionId,
        touchPointId: touchPoints[i].id,
        model,
        weight: weights[i],
        position: i + 1,
        touchPointCount: touchPoints.length,
      });
    }
  }

  await prisma.attributionLink.createMany({
    data: links,
    skipDuplicates: true,
  });

  return { linked: links.length };
}

export async function matchTouchPointsToCampaigns(params: {
  siteId: string;
  touchPointIds: string[];
}): Promise<
  Map<
    string,
    {
      platformCode: string | null;
      campaignId: string | null;
      adAccountId: string | null;
      adId: string | null;
    }
  >
> {
  const result = new Map<
    string,
    {
      platformCode: string | null;
      campaignId: string | null;
      adAccountId: string | null;
      adId: string | null;
    }
  >();

  const touchPoints = await prisma.touchPoint.findMany({
    where: {
      siteId: params.siteId,
      id: { in: params.touchPointIds },
    },
    select: {
      id: true,
      gclid: true,
      fbclid: true,
      ttclid: true,
      utmSource: true,
      utmCampaign: true,
      platformCode: true,
      campaignId: true,
      adAccountId: true,
      adId: true,
    },
  });

  for (const tp of touchPoints) {
    if (tp.campaignId) {
      result.set(tp.id, {
        platformCode: tp.platformCode,
        campaignId: tp.campaignId,
        adAccountId: tp.adAccountId,
        adId: tp.adId,
      });
      continue;
    }

    let platformCode = tp.platformCode;
    let campaignId: string | null = null;
    let adAccountId: string | null = null;
    let adId: string | null = null;

    if (tp.gclid) {
      platformCode = "GOOGLE_ADS";
    } else if (tp.fbclid) {
      platformCode = "META";
    } else if (tp.ttclid) {
      platformCode = "TIKTOK";
    }

    if (tp.utmCampaign && platformCode) {
      const campaign = await prisma.campaign.findFirst({
        where: {
          platform: { code: platformCode as any },
          OR: [
            { externalId: tp.utmCampaign },
            { name: { contains: tp.utmCampaign, mode: "insensitive" } },
          ],
        },
        select: {
          id: true,
          adAccountId: true,
          platformId: true,
        },
      });

      if (campaign) {
        campaignId = campaign.id;
        adAccountId = campaign.adAccountId;
      }
    }

    result.set(tp.id, {
      platformCode,
      campaignId,
      adAccountId,
      adId,
    });

    if (campaignId || adAccountId) {
      await prisma.touchPoint.update({
        where: { id: tp.id },
        data: {
          platformCode,
          campaignId,
          adAccountId,
          adId,
        },
        select: { id: true },
      });
    }
  }

  return result;
}

export async function getAttributionForConversion(params: {
  conversionId: string;
  model?: AttributionModel;
}): Promise<
  Array<{
    touchPointId: string;
    weight: number;
    position: number;
    touchPointCount: number;
    platformCode: string | null;
    campaignId: string | null;
    utmSource: string | null;
    utmCampaign: string | null;
    gclid: string | null;
    fbclid: string | null;
    occurredAt: Date;
  }>
> {
  const links = await prisma.attributionLink.findMany({
    where: {
      conversionId: params.conversionId,
      ...(params.model ? { model: params.model } : {}),
    },
    include: {
      touchPoint: {
        select: {
          id: true,
          platformCode: true,
          campaignId: true,
          utmSource: true,
          utmCampaign: true,
          gclid: true,
          fbclid: true,
          occurredAt: true,
        },
      },
    },
    orderBy: { position: "asc" },
  });

  return links.map((l) => ({
    touchPointId: l.touchPointId,
    weight: l.weight,
    position: l.position,
    touchPointCount: l.touchPointCount,
    platformCode: l.touchPoint.platformCode,
    campaignId: l.touchPoint.campaignId,
    utmSource: l.touchPoint.utmSource,
    utmCampaign: l.touchPoint.utmCampaign,
    gclid: l.touchPoint.gclid,
    fbclid: l.touchPoint.fbclid,
    occurredAt: l.touchPoint.occurredAt,
  }));
}
