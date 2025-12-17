import "server-only";

import { prisma } from "@/lib/prisma";
import type {
  WasteConfig,
  WasteAlert,
  WasteAnalysis,
  WasteLevel,
  WasteReason,
  EntityType,
  AggregatedMetrics,
} from "./types";
import {
  DEFAULT_WASTE_CONFIG,
  microsToDollars,
  computeCpa,
  computeCtr,
  determineWasteLevel,
} from "./types";

type RollingWindow = {
  start: Date;
  end: Date;
  days: number;
};

function createRollingWindow(days: number, endDate?: Date): RollingWindow {
  const end = endDate ?? new Date();
  end.setHours(23, 59, 59, 999);

  const start = new Date(end);
  start.setDate(start.getDate() - days + 1);
  start.setHours(0, 0, 0, 0);

  return { start, end, days };
}

function generateAlertId(
  entityType: EntityType,
  entityId: string,
  reason: WasteReason,
  windowEnd: Date
): string {
  const dateStr = windowEnd.toISOString().split("T")[0];
  return `${entityType}_${entityId}_${reason}_${dateStr}`;
}

function buildRecommendation(reason: WasteReason, metrics: AggregatedMetrics): string {
  switch (reason) {
    case "zero_conversions_high_spend":
      return `Consider pausing this ${metrics.entityType.replace("_", " ")} or reviewing targeting. Spent $${microsToDollars(metrics.spendMicros).toFixed(2)} with no conversions.`;

    case "cpa_above_target":
      const cpa = computeCpa(metrics.spendMicros, metrics.conversions);
      return `CPA of $${cpa?.toFixed(2) ?? "N/A"} exceeds target. Review ad creative, landing page, or audience targeting.`;

    case "low_ctr_high_spend":
      const ctr = computeCtr(metrics.clicks, metrics.impressions);
      return `CTR of ${ctr.toFixed(2)}% is below threshold. Consider refreshing creative or adjusting targeting.`;

    case "declining_performance":
      return `Performance has declined over the analysis period. Review recent changes and consider optimization.`;

    default:
      return `Review this ${metrics.entityType.replace("_", " ")} for potential optimization opportunities.`;
  }
}

export class WasteEvaluator {
  private readonly config: WasteConfig;

  constructor(config: Partial<WasteConfig> = {}) {
    this.config = { ...DEFAULT_WASTE_CONFIG, ...config };
  }

  async evaluateOrganization(params: {
    organizationId: string;
    windowDays?: number;
    endDate?: Date;
  }): Promise<WasteAnalysis> {
    const window = createRollingWindow(
      params.windowDays ?? this.config.rollingWindowDays,
      params.endDate
    );

    const [accountAlerts, campaignAlerts, adAlerts] = await Promise.all([
      this.evaluateAdAccounts(params.organizationId, window),
      this.evaluateCampaigns(params.organizationId, window),
      this.evaluateAds(params.organizationId, window),
    ]);

    const alerts = [...accountAlerts, ...campaignAlerts, ...adAlerts];

    const totalWastedSpendMicros = alerts.reduce(
      (sum, a) => sum + a.spendMicros,
      BigInt(0)
    );

    const byLevel: Record<WasteLevel, number> = {
      none: 0,
      low: 0,
      medium: 0,
      high: 0,
      critical: 0,
    };

    const byReason: Record<WasteReason, number> = {
      zero_conversions_high_spend: 0,
      cpa_above_target: 0,
      low_ctr_high_spend: 0,
      declining_performance: 0,
    };

    const byEntityType: Record<EntityType, number> = {
      ad_account: 0,
      campaign: 0,
      ad: 0,
    };

    for (const alert of alerts) {
      byLevel[alert.level]++;
      byReason[alert.reason]++;
      byEntityType[alert.entityType]++;
    }

    return {
      organizationId: params.organizationId,
      windowStart: window.start,
      windowEnd: window.end,
      totalWastedSpendMicros,
      alerts,
      byLevel,
      byReason,
      byEntityType,
    };
  }

  private async evaluateAdAccounts(
    organizationId: string,
    window: RollingWindow
  ): Promise<WasteAlert[]> {
    const metrics = await prisma.dailyAdAccountMetric.groupBy({
      by: ["adAccountId"],
      where: {
        organizationId,
        date: { gte: window.start, lte: window.end },
      },
      _sum: {
        impressions: true,
        clicks: true,
        spendMicros: true,
        conversions: true,
        revenueMicros: true,
      },
    });

    const alerts: WasteAlert[] = [];

    for (const m of metrics) {
      const account = await prisma.adAccount.findUnique({
        where: { id: m.adAccountId },
        select: { id: true, name: true, platform: { select: { code: true } } },
      });

      if (!account) continue;

      const aggregated: AggregatedMetrics = {
        entityId: m.adAccountId,
        entityName: account.name,
        entityType: "ad_account",
        platformCode: account.platform.code,
        impressions: m._sum.impressions ?? BigInt(0),
        clicks: m._sum.clicks ?? BigInt(0),
        spendMicros: m._sum.spendMicros ?? BigInt(0),
        conversions: m._sum.conversions ?? BigInt(0),
        revenueMicros: m._sum.revenueMicros ?? BigInt(0),
      };

      const accountAlerts = this.detectWaste(aggregated, window, organizationId);
      alerts.push(...accountAlerts);
    }

    return alerts;
  }

  private async evaluateCampaigns(
    organizationId: string,
    window: RollingWindow
  ): Promise<WasteAlert[]> {
    const metrics = await prisma.dailyCampaignMetric.groupBy({
      by: ["campaignId"],
      where: {
        organizationId,
        date: { gte: window.start, lte: window.end },
      },
      _sum: {
        impressions: true,
        clicks: true,
        spendMicros: true,
        conversions: true,
        revenueMicros: true,
      },
    });

    const alerts: WasteAlert[] = [];

    for (const m of metrics) {
      const campaign = await prisma.campaign.findUnique({
        where: { id: m.campaignId },
        select: { id: true, name: true, platform: { select: { code: true } } },
      });

      if (!campaign) continue;

      const aggregated: AggregatedMetrics = {
        entityId: m.campaignId,
        entityName: campaign.name,
        entityType: "campaign",
        platformCode: campaign.platform.code,
        impressions: m._sum.impressions ?? BigInt(0),
        clicks: m._sum.clicks ?? BigInt(0),
        spendMicros: m._sum.spendMicros ?? BigInt(0),
        conversions: m._sum.conversions ?? BigInt(0),
        revenueMicros: m._sum.revenueMicros ?? BigInt(0),
      };

      const campaignAlerts = this.detectWaste(aggregated, window, organizationId);
      alerts.push(...campaignAlerts);
    }

    return alerts;
  }

  private async evaluateAds(
    organizationId: string,
    window: RollingWindow
  ): Promise<WasteAlert[]> {
    const metrics = await prisma.dailyAdMetric.groupBy({
      by: ["adId"],
      where: {
        organizationId,
        date: { gte: window.start, lte: window.end },
      },
      _sum: {
        impressions: true,
        clicks: true,
        spendMicros: true,
        conversions: true,
        revenueMicros: true,
      },
    });

    const alerts: WasteAlert[] = [];

    for (const m of metrics) {
      const ad = await prisma.ad.findUnique({
        where: { id: m.adId },
        select: { id: true, name: true, platform: { select: { code: true } } },
      });

      if (!ad) continue;

      const aggregated: AggregatedMetrics = {
        entityId: m.adId,
        entityName: ad.name ?? `Ad ${m.adId}`,
        entityType: "ad",
        platformCode: ad.platform.code,
        impressions: m._sum.impressions ?? BigInt(0),
        clicks: m._sum.clicks ?? BigInt(0),
        spendMicros: m._sum.spendMicros ?? BigInt(0),
        conversions: m._sum.conversions ?? BigInt(0),
        revenueMicros: m._sum.revenueMicros ?? BigInt(0),
      };

      const adAlerts = this.detectWaste(aggregated, window, organizationId);
      alerts.push(...adAlerts);
    }

    return alerts;
  }

  private detectWaste(
    metrics: AggregatedMetrics,
    window: RollingWindow,
    organizationId: string
  ): WasteAlert[] {
    const alerts: WasteAlert[] = [];

    if (
      metrics.spendMicros >= this.config.spendThresholdMicros &&
      metrics.conversions === BigInt(0)
    ) {
      const reason: WasteReason = "zero_conversions_high_spend";
      const level = determineWasteLevel(metrics.spendMicros, this.config, reason);

      alerts.push({
        id: generateAlertId(metrics.entityType, metrics.entityId, reason, window.end),
        entityType: metrics.entityType,
        entityId: metrics.entityId,
        entityName: metrics.entityName,
        organizationId,
        platformCode: metrics.platformCode,
        reason,
        level,
        spendMicros: metrics.spendMicros,
        conversions: 0,
        cpa: null,
        targetCpa: microsToDollars(this.config.targetCpaMicros),
        windowStart: window.start,
        windowEnd: window.end,
        message: `${metrics.entityName} spent $${microsToDollars(metrics.spendMicros).toFixed(2)} with zero conversions in the last ${window.days} days.`,
        recommendation: buildRecommendation(reason, metrics),
      });
    }

    if (metrics.conversions > BigInt(0)) {
      const cpa = computeCpa(metrics.spendMicros, metrics.conversions);
      const targetCpa = microsToDollars(this.config.targetCpaMicros);
      const cpaThreshold = targetCpa * (1 + this.config.cpaTolerancePercent / 100);

      if (cpa !== null && cpa > cpaThreshold * 1_000_000) {
        const reason: WasteReason = "cpa_above_target";
        const level = determineWasteLevel(metrics.spendMicros, this.config, reason);

        const wastedSpend =
          metrics.spendMicros - BigInt(Math.round(targetCpa * 1_000_000 * Number(metrics.conversions)));

        alerts.push({
          id: generateAlertId(metrics.entityType, metrics.entityId, reason, window.end),
          entityType: metrics.entityType,
          entityId: metrics.entityId,
          entityName: metrics.entityName,
          organizationId,
          platformCode: metrics.platformCode,
          reason,
          level,
          spendMicros: wastedSpend > BigInt(0) ? wastedSpend : metrics.spendMicros,
          conversions: Number(metrics.conversions),
          cpa: cpa / 1_000_000,
          targetCpa,
          windowStart: window.start,
          windowEnd: window.end,
          message: `${metrics.entityName} has CPA of $${(cpa / 1_000_000).toFixed(2)} vs target of $${targetCpa.toFixed(2)} (${((cpa / 1_000_000 / targetCpa - 1) * 100).toFixed(0)}% over).`,
          recommendation: buildRecommendation(reason, metrics),
        });
      }
    }

    return alerts;
  }

  async evaluateCampaign(params: {
    organizationId: string;
    campaignId: string;
    windowDays?: number;
    endDate?: Date;
  }): Promise<WasteAlert[]> {
    const window = createRollingWindow(
      params.windowDays ?? this.config.rollingWindowDays,
      params.endDate
    );

    const metrics = await prisma.dailyCampaignMetric.aggregate({
      where: {
        organizationId: params.organizationId,
        campaignId: params.campaignId,
        date: { gte: window.start, lte: window.end },
      },
      _sum: {
        impressions: true,
        clicks: true,
        spendMicros: true,
        conversions: true,
        revenueMicros: true,
      },
    });

    const campaign = await prisma.campaign.findUnique({
      where: { id: params.campaignId },
      select: { id: true, name: true, platform: { select: { code: true } } },
    });

    if (!campaign) return [];

    const aggregated: AggregatedMetrics = {
      entityId: params.campaignId,
      entityName: campaign.name,
      entityType: "campaign",
      platformCode: campaign.platform.code,
      impressions: metrics._sum.impressions ?? BigInt(0),
      clicks: metrics._sum.clicks ?? BigInt(0),
      spendMicros: metrics._sum.spendMicros ?? BigInt(0),
      conversions: metrics._sum.conversions ?? BigInt(0),
      revenueMicros: metrics._sum.revenueMicros ?? BigInt(0),
    };

    return this.detectWaste(aggregated, window, params.organizationId);
  }

  async evaluateAd(params: {
    organizationId: string;
    adId: string;
    windowDays?: number;
    endDate?: Date;
  }): Promise<WasteAlert[]> {
    const window = createRollingWindow(
      params.windowDays ?? this.config.rollingWindowDays,
      params.endDate
    );

    const metrics = await prisma.dailyAdMetric.aggregate({
      where: {
        organizationId: params.organizationId,
        adId: params.adId,
        date: { gte: window.start, lte: window.end },
      },
      _sum: {
        impressions: true,
        clicks: true,
        spendMicros: true,
        conversions: true,
        revenueMicros: true,
      },
    });

    const ad = await prisma.ad.findUnique({
      where: { id: params.adId },
      select: { id: true, name: true, platform: { select: { code: true } } },
    });

    if (!ad) return [];

    const aggregated: AggregatedMetrics = {
      entityId: params.adId,
      entityName: ad.name ?? `Ad ${params.adId}`,
      entityType: "ad",
      platformCode: ad.platform.code,
      impressions: metrics._sum.impressions ?? BigInt(0),
      clicks: metrics._sum.clicks ?? BigInt(0),
      spendMicros: metrics._sum.spendMicros ?? BigInt(0),
      conversions: metrics._sum.conversions ?? BigInt(0),
      revenueMicros: metrics._sum.revenueMicros ?? BigInt(0),
    };

    return this.detectWaste(aggregated, window, params.organizationId);
  }

  getConfig(): WasteConfig {
    return { ...this.config };
  }

  withConfig(config: Partial<WasteConfig>): WasteEvaluator {
    return new WasteEvaluator({ ...this.config, ...config });
  }
}

export const wasteEvaluator = new WasteEvaluator();
