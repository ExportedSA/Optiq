import "server-only";

import { prisma } from "@/lib/prisma";
import type { AttributionModel, TouchPointData } from "./types";
import { extractClickIds, inferPlatformFromClickId } from "./types";
import {
  type AttributionModelStrategy,
  getModel,
  getAllModels,
  registerModel,
  coreModels,
  defaultModels,
} from "./models";

const DEFAULT_LOOKBACK_DAYS = 30;

export interface AttributionConfig {
  lookbackDays?: number;
  models?: AttributionModel[];
  defaultModel?: AttributionModel;
}

export interface AttributionResult {
  conversionId: string;
  touchPoints: Array<{
    touchPointId: string;
    position: number;
    weight: number;
    occurredAt: Date;
    utmSource: string | null;
    utmMedium: string | null;
    utmCampaign: string | null;
    platformCode: string | null;
    campaignId: string | null;
    gclid: string | null;
    fbclid: string | null;
  }>;
  firstTouch: {
    touchPointId: string;
    occurredAt: Date;
    utmSource: string | null;
    utmCampaign: string | null;
    platformCode: string | null;
  } | null;
  lastTouch: {
    touchPointId: string;
    occurredAt: Date;
    utmSource: string | null;
    utmCampaign: string | null;
    platformCode: string | null;
  } | null;
  totalTouchPoints: number;
  model: AttributionModel;
}

export interface ConversionAttributionSummary {
  conversionId: string;
  conversionTime: Date;
  firstTouch: TouchPointSummary | null;
  lastTouch: TouchPointSummary | null;
  allTouchPoints: TouchPointSummary[];
  attributionByModel: Record<AttributionModel, TouchPointAttribution[]>;
}

export interface TouchPointSummary {
  id: string;
  occurredAt: Date;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  platformCode: string | null;
  campaignId: string | null;
  gclid: string | null;
  fbclid: string | null;
  referrer: string | null;
}

export interface TouchPointAttribution {
  touchPointId: string;
  weight: number;
  position: number;
}

export class AttributionService {
  private readonly config: Required<AttributionConfig>;

  constructor(config: AttributionConfig = {}) {
    this.config = {
      lookbackDays: config.lookbackDays ?? DEFAULT_LOOKBACK_DAYS,
      models: config.models ?? defaultModels,
      defaultModel: config.defaultModel ?? "LINEAR",
    };
  }

  async recordTouchPoint(params: {
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

  async attributeConversion(params: {
    siteId: string;
    conversionId: string;
    anonId: string;
    conversionTime: Date;
    models?: AttributionModel[];
  }): Promise<{ linked: number; firstTouch: string | null; lastTouch: string | null }> {
    const models = params.models ?? this.config.models;
    const lookbackStart = new Date(
      params.conversionTime.getTime() -
        this.config.lookbackDays * 24 * 60 * 60 * 1000
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
      return { linked: 0, firstTouch: null, lastTouch: null };
    }

    const firstTouch = touchPoints[0].id;
    const lastTouch = touchPoints[touchPoints.length - 1].id;

    const links: Array<{
      siteId: string;
      conversionId: string;
      touchPointId: string;
      model: AttributionModel;
      weight: number;
      position: number;
      touchPointCount: number;
    }> = [];

    for (const modelName of models) {
      const modelStrategy = getModel(modelName);
      const weights = modelStrategy.computeWeights(touchPoints);

      for (let i = 0; i < touchPoints.length; i++) {
        if (weights[i] <= 0) continue;

        links.push({
          siteId: params.siteId,
          conversionId: params.conversionId,
          touchPointId: touchPoints[i].id,
          model: modelName,
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

    return { linked: links.length, firstTouch, lastTouch };
  }

  async getConversionAttribution(params: {
    conversionId: string;
    model?: AttributionModel;
  }): Promise<AttributionResult | null> {
    const model = params.model ?? this.config.defaultModel;

    const links = await prisma.attributionLink.findMany({
      where: {
        conversionId: params.conversionId,
        model,
      },
      include: {
        touchPoint: true,
      },
      orderBy: { position: "asc" },
    });

    if (links.length === 0) return null;

    const touchPoints = links.map((l: typeof links[number]) => ({
      touchPointId: l.touchPointId,
      position: l.position,
      weight: l.weight,
      occurredAt: l.touchPoint.occurredAt,
      utmSource: l.touchPoint.utmSource,
      utmMedium: l.touchPoint.utmMedium,
      utmCampaign: l.touchPoint.utmCampaign,
      platformCode: l.touchPoint.platformCode,
      campaignId: l.touchPoint.campaignId,
      gclid: l.touchPoint.gclid,
      fbclid: l.touchPoint.fbclid,
    }));

    const first = touchPoints[0];
    const last = touchPoints[touchPoints.length - 1];

    return {
      conversionId: params.conversionId,
      touchPoints,
      firstTouch: first
        ? {
            touchPointId: first.touchPointId,
            occurredAt: first.occurredAt,
            utmSource: first.utmSource,
            utmCampaign: first.utmCampaign,
            platformCode: first.platformCode,
          }
        : null,
      lastTouch: last
        ? {
            touchPointId: last.touchPointId,
            occurredAt: last.occurredAt,
            utmSource: last.utmSource,
            utmCampaign: last.utmCampaign,
            platformCode: last.platformCode,
          }
        : null,
      totalTouchPoints: links[0]?.touchPointCount ?? 0,
      model,
    };
  }

  async getFullAttributionSummary(params: {
    conversionId: string;
  }): Promise<ConversionAttributionSummary | null> {
    const conversion = await prisma.trackingEvent.findUnique({
      where: { id: params.conversionId },
      select: { id: true, occurredAt: true, siteId: true },
    });

    if (!conversion) return null;

    const allLinks = await prisma.attributionLink.findMany({
      where: { conversionId: params.conversionId },
      include: { touchPoint: true },
      orderBy: { position: "asc" },
    });

    if (allLinks.length === 0) return null;

    const touchPointMap = new Map<string, TouchPointSummary>();
    for (const link of allLinks) {
      if (!touchPointMap.has(link.touchPointId)) {
        touchPointMap.set(link.touchPointId, {
          id: link.touchPoint.id,
          occurredAt: link.touchPoint.occurredAt,
          utmSource: link.touchPoint.utmSource,
          utmMedium: link.touchPoint.utmMedium,
          utmCampaign: link.touchPoint.utmCampaign,
          platformCode: link.touchPoint.platformCode,
          campaignId: link.touchPoint.campaignId,
          gclid: link.touchPoint.gclid,
          fbclid: link.touchPoint.fbclid,
          referrer: link.touchPoint.referrer,
        });
      }
    }

    const allTouchPoints = Array.from(touchPointMap.values()).sort(
      (a, b) => a.occurredAt.getTime() - b.occurredAt.getTime()
    );

    const firstTouch = allTouchPoints[0] ?? null;
    const lastTouch = allTouchPoints[allTouchPoints.length - 1] ?? null;

    const attributionByModel: Record<AttributionModel, TouchPointAttribution[]> =
      {} as Record<AttributionModel, TouchPointAttribution[]>;

    for (const link of allLinks) {
      if (!attributionByModel[link.model as AttributionModel]) {
        attributionByModel[link.model as AttributionModel] = [];
      }
      attributionByModel[link.model as AttributionModel].push({
        touchPointId: link.touchPointId,
        weight: link.weight,
        position: link.position,
      });
    }

    return {
      conversionId: params.conversionId,
      conversionTime: conversion.occurredAt,
      firstTouch,
      lastTouch,
      allTouchPoints,
      attributionByModel,
    };
  }

  async getCampaignAttribution(params: {
    siteId: string;
    campaignId: string;
    model?: AttributionModel;
    startDate?: Date;
    endDate?: Date;
  }): Promise<{
    campaignId: string;
    totalConversions: number;
    attributedCredit: number;
    touchPointCount: number;
  }> {
    const model = params.model ?? this.config.defaultModel;

    const where: Record<string, unknown> = {
      siteId: params.siteId,
      model,
      touchPoint: { campaignId: params.campaignId },
    };

    if (params.startDate || params.endDate) {
      where.createdAt = {};
      if (params.startDate) (where.createdAt as Record<string, Date>).gte = params.startDate;
      if (params.endDate) (where.createdAt as Record<string, Date>).lte = params.endDate;
    }

    const links = await prisma.attributionLink.findMany({
      where,
      select: {
        conversionId: true,
        weight: true,
        touchPointId: true,
      },
    });

    const uniqueConversions = new Set(links.map((l: { conversionId: string }) => l.conversionId));
    const totalCredit = links.reduce((sum: number, l: { weight: number }) => sum + l.weight, 0);

    return {
      campaignId: params.campaignId,
      totalConversions: uniqueConversions.size,
      attributedCredit: totalCredit,
      touchPointCount: links.length,
    };
  }

  async matchTouchPointsToCampaigns(params: {
    siteId: string;
    touchPointIds: string[];
  }): Promise<number> {
    const touchPoints = await prisma.touchPoint.findMany({
      where: {
        siteId: params.siteId,
        id: { in: params.touchPointIds },
        campaignId: null,
      },
      select: {
        id: true,
        gclid: true,
        fbclid: true,
        ttclid: true,
        utmSource: true,
        utmCampaign: true,
        platformCode: true,
      },
    });

    let matched = 0;

    for (const tp of touchPoints) {
      let platformCode = tp.platformCode;

      if (tp.gclid) platformCode = "GOOGLE_ADS";
      else if (tp.fbclid) platformCode = "META";
      else if (tp.ttclid) platformCode = "TIKTOK";

      if (!tp.utmCampaign || !platformCode) continue;

      const campaign = await prisma.campaign.findFirst({
        where: {
          platform: { code: platformCode as "GOOGLE_ADS" | "META" | "TIKTOK" | "LINKEDIN" },
          OR: [
            { externalId: tp.utmCampaign },
            { name: { contains: tp.utmCampaign, mode: "insensitive" } },
          ],
        },
        select: { id: true, adAccountId: true },
      });

      if (campaign) {
        await prisma.touchPoint.update({
          where: { id: tp.id },
          data: {
            platformCode,
            campaignId: campaign.id,
            adAccountId: campaign.adAccountId,
          },
        });
        matched++;
      }
    }

    return matched;
  }

  registerCustomModel(model: AttributionModelStrategy): void {
    registerModel(model);
  }

  getAvailableModels(): AttributionModelStrategy[] {
    return getAllModels();
  }

  getDefaultModel(): AttributionModel {
    return this.config.defaultModel;
  }

  getLookbackDays(): number {
    return this.config.lookbackDays;
  }
}

export const attributionService = new AttributionService();

export { coreModels, registerModel, getModel, getAllModels };
