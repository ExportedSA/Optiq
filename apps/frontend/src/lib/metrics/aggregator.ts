import "server-only";

import { prisma } from "@/lib/prisma";
import type {
  TimeGranularity,
  EntityLevel,
  DateRange,
  MetricsFilter,
  RawMetrics,
  AggregatedMetricsRow,
  MetricsSummary,
  MetricsWithWaste,
} from "./types";
import {
  computeMetrics,
  computeChange,
  buildCacheKey,
  getPeriodBounds,
} from "./types";
import { MetricsCache, metricsCache } from "./cache";

export interface AggregatorConfig {
  targetCpaMicros?: bigint;
  useCache?: boolean;
  cacheTtlMs?: number;
}

const DEFAULT_TARGET_CPA_MICROS = BigInt(25_000_000);

export class MetricsAggregator {
  private readonly config: Required<AggregatorConfig>;
  private readonly cache: MetricsCache;

  constructor(config: AggregatorConfig = {}) {
    this.config = {
      targetCpaMicros: config.targetCpaMicros ?? DEFAULT_TARGET_CPA_MICROS,
      useCache: config.useCache ?? true,
      cacheTtlMs: config.cacheTtlMs ?? 5 * 60 * 1000,
    };
    this.cache = metricsCache;
  }

  async aggregateByPeriod(params: {
    filter: MetricsFilter;
    granularity: TimeGranularity;
    entityLevel: EntityLevel;
  }): Promise<AggregatedMetricsRow[]> {
    const cacheKey = buildCacheKey({
      organizationId: params.filter.organizationId,
      entityLevel: params.entityLevel,
      entityId: null,
      granularity: params.granularity,
      dateRange: params.filter.dateRange,
    });

    if (this.config.useCache) {
      const cached = this.cache.get(cacheKey);
      if (cached) return cached;
    }

    const rows = await this.queryMetrics(params);

    if (this.config.useCache) {
      this.cache.set(cacheKey, rows, this.config.cacheTtlMs);
    }

    return rows;
  }

  private async queryMetrics(params: {
    filter: MetricsFilter;
    granularity: TimeGranularity;
    entityLevel: EntityLevel;
  }): Promise<AggregatedMetricsRow[]> {
    const { filter, granularity, entityLevel } = params;

    switch (entityLevel) {
      case "organization":
        return this.aggregateOrganization(filter, granularity);
      case "platform":
        return this.aggregateByPlatform(filter, granularity);
      case "ad_account":
        return this.aggregateByAdAccount(filter, granularity);
      case "campaign":
        return this.aggregateByCampaign(filter, granularity);
      case "ad":
        return this.aggregateByAd(filter, granularity);
      default:
        return [];
    }
  }

  private async aggregateOrganization(
    filter: MetricsFilter,
    granularity: TimeGranularity
  ): Promise<AggregatedMetricsRow[]> {
    const metrics = await prisma.dailyAdAccountMetric.findMany({
      where: {
        organizationId: filter.organizationId,
        date: { gte: filter.dateRange.start, lte: filter.dateRange.end },
        ...(filter.platformCodes?.length
          ? { platform: { code: { in: filter.platformCodes as ("GOOGLE_ADS" | "META" | "TIKTOK" | "LINKEDIN")[] } } }
          : {}),
      },
      select: {
        date: true,
        impressions: true,
        clicks: true,
        spendMicros: true,
        conversions: true,
        revenueMicros: true,
      },
    });

    return this.groupByPeriod(metrics, granularity, {
      entityLevel: "organization",
      entityId: filter.organizationId,
      entityName: "Organization Total",
      platformCode: null,
    });
  }

  private async aggregateByPlatform(
    filter: MetricsFilter,
    granularity: TimeGranularity
  ): Promise<AggregatedMetricsRow[]> {
    const metrics = await prisma.dailyAdAccountMetric.findMany({
      where: {
        organizationId: filter.organizationId,
        date: { gte: filter.dateRange.start, lte: filter.dateRange.end },
        ...(filter.platformCodes?.length
          ? { platform: { code: { in: filter.platformCodes as ("GOOGLE_ADS" | "META" | "TIKTOK" | "LINKEDIN")[] } } }
          : {}),
      },
      select: {
        date: true,
        impressions: true,
        clicks: true,
        spendMicros: true,
        conversions: true,
        revenueMicros: true,
        platform: { select: { code: true, name: true } },
      },
    });

    const byPlatform = new Map<string, typeof metrics>();
    for (const m of metrics) {
      const key = m.platform.code;
      if (!byPlatform.has(key)) byPlatform.set(key, []);
      byPlatform.get(key)!.push(m);
    }

    const results: AggregatedMetricsRow[] = [];
    for (const [platformCode, platformMetrics] of byPlatform) {
      const platformName = platformMetrics[0]?.platform.name ?? platformCode;
      const rows = this.groupByPeriod(platformMetrics, granularity, {
        entityLevel: "platform",
        entityId: platformCode,
        entityName: platformName,
        platformCode,
      });
      results.push(...rows);
    }

    return results.sort((a, b) => a.periodStart.getTime() - b.periodStart.getTime());
  }

  private async aggregateByAdAccount(
    filter: MetricsFilter,
    granularity: TimeGranularity
  ): Promise<AggregatedMetricsRow[]> {
    const metrics = await prisma.dailyAdAccountMetric.findMany({
      where: {
        organizationId: filter.organizationId,
        date: { gte: filter.dateRange.start, lte: filter.dateRange.end },
        ...(filter.adAccountIds?.length ? { adAccountId: { in: filter.adAccountIds } } : {}),
        ...(filter.platformCodes?.length
          ? { platform: { code: { in: filter.platformCodes as ("GOOGLE_ADS" | "META" | "TIKTOK" | "LINKEDIN")[] } } }
          : {}),
      },
      select: {
        date: true,
        adAccountId: true,
        impressions: true,
        clicks: true,
        spendMicros: true,
        conversions: true,
        revenueMicros: true,
        adAccount: { select: { name: true } },
        platform: { select: { code: true } },
      },
    });

    const byAccount = new Map<string, typeof metrics>();
    for (const m of metrics) {
      if (!byAccount.has(m.adAccountId)) byAccount.set(m.adAccountId, []);
      byAccount.get(m.adAccountId)!.push(m);
    }

    const results: AggregatedMetricsRow[] = [];
    for (const [accountId, accountMetrics] of byAccount) {
      const accountName = accountMetrics[0]?.adAccount.name ?? accountId;
      const platformCode = accountMetrics[0]?.platform.code ?? null;
      const rows = this.groupByPeriod(accountMetrics, granularity, {
        entityLevel: "ad_account",
        entityId: accountId,
        entityName: accountName,
        platformCode,
      });
      results.push(...rows);
    }

    return results.sort((a, b) => a.periodStart.getTime() - b.periodStart.getTime());
  }

  private async aggregateByCampaign(
    filter: MetricsFilter,
    granularity: TimeGranularity
  ): Promise<AggregatedMetricsRow[]> {
    const metrics = await prisma.dailyCampaignMetric.findMany({
      where: {
        organizationId: filter.organizationId,
        date: { gte: filter.dateRange.start, lte: filter.dateRange.end },
        ...(filter.campaignIds?.length ? { campaignId: { in: filter.campaignIds } } : {}),
        ...(filter.adAccountIds?.length ? { adAccountId: { in: filter.adAccountIds } } : {}),
        ...(filter.platformCodes?.length
          ? { platform: { code: { in: filter.platformCodes as ("GOOGLE_ADS" | "META" | "TIKTOK" | "LINKEDIN")[] } } }
          : {}),
      },
      select: {
        date: true,
        campaignId: true,
        impressions: true,
        clicks: true,
        spendMicros: true,
        conversions: true,
        revenueMicros: true,
        campaign: { select: { name: true } },
        platform: { select: { code: true } },
      },
    });

    const byCampaign = new Map<string, typeof metrics>();
    for (const m of metrics) {
      if (!byCampaign.has(m.campaignId)) byCampaign.set(m.campaignId, []);
      byCampaign.get(m.campaignId)!.push(m);
    }

    const results: AggregatedMetricsRow[] = [];
    for (const [campaignId, campaignMetrics] of byCampaign) {
      const campaignName = campaignMetrics[0]?.campaign.name ?? campaignId;
      const platformCode = campaignMetrics[0]?.platform.code ?? null;
      const rows = this.groupByPeriod(campaignMetrics, granularity, {
        entityLevel: "campaign",
        entityId: campaignId,
        entityName: campaignName,
        platformCode,
      });
      results.push(...rows);
    }

    return results.sort((a, b) => a.periodStart.getTime() - b.periodStart.getTime());
  }

  private async aggregateByAd(
    filter: MetricsFilter,
    granularity: TimeGranularity
  ): Promise<AggregatedMetricsRow[]> {
    const metrics = await prisma.dailyAdMetric.findMany({
      where: {
        organizationId: filter.organizationId,
        date: { gte: filter.dateRange.start, lte: filter.dateRange.end },
        ...(filter.adIds?.length ? { adId: { in: filter.adIds } } : {}),
        ...(filter.campaignIds?.length ? { campaignId: { in: filter.campaignIds } } : {}),
        ...(filter.adAccountIds?.length ? { adAccountId: { in: filter.adAccountIds } } : {}),
        ...(filter.platformCodes?.length
          ? { platform: { code: { in: filter.platformCodes as ("GOOGLE_ADS" | "META" | "TIKTOK" | "LINKEDIN")[] } } }
          : {}),
      },
      select: {
        date: true,
        adId: true,
        impressions: true,
        clicks: true,
        spendMicros: true,
        conversions: true,
        revenueMicros: true,
        ad: { select: { name: true } },
        platform: { select: { code: true } },
      },
    });

    const byAd = new Map<string, typeof metrics>();
    for (const m of metrics) {
      if (!byAd.has(m.adId)) byAd.set(m.adId, []);
      byAd.get(m.adId)!.push(m);
    }

    const results: AggregatedMetricsRow[] = [];
    for (const [adId, adMetrics] of byAd) {
      const adName = adMetrics[0]?.ad.name ?? adId;
      const platformCode = adMetrics[0]?.platform.code ?? null;
      const rows = this.groupByPeriod(adMetrics, granularity, {
        entityLevel: "ad",
        entityId: adId,
        entityName: adName,
        platformCode,
      });
      results.push(...rows);
    }

    return results.sort((a, b) => a.periodStart.getTime() - b.periodStart.getTime());
  }

  private groupByPeriod(
    metrics: Array<{
      date: Date;
      impressions: bigint;
      clicks: bigint;
      spendMicros: bigint;
      conversions: bigint;
      revenueMicros: bigint;
    }>,
    granularity: TimeGranularity,
    entity: {
      entityLevel: EntityLevel;
      entityId: string;
      entityName: string;
      platformCode: string | null;
    }
  ): AggregatedMetricsRow[] {
    const byPeriod = new Map<string, RawMetrics>();

    for (const m of metrics) {
      const { label } = getPeriodBounds(m.date, granularity);

      if (!byPeriod.has(label)) {
        byPeriod.set(label, {
          impressions: BigInt(0),
          clicks: BigInt(0),
          spendMicros: BigInt(0),
          conversions: BigInt(0),
          revenueMicros: BigInt(0),
        });
      }

      const agg = byPeriod.get(label)!;
      agg.impressions += m.impressions;
      agg.clicks += m.clicks;
      agg.spendMicros += m.spendMicros;
      agg.conversions += m.conversions;
      agg.revenueMicros += m.revenueMicros;
    }

    const rows: AggregatedMetricsRow[] = [];

    for (const [period, raw] of byPeriod) {
      const sampleDate = metrics.find((m) => {
        const { label } = getPeriodBounds(m.date, granularity);
        return label === period;
      })?.date;

      if (!sampleDate) continue;

      const { start, end } = getPeriodBounds(sampleDate, granularity);

      rows.push({
        period,
        periodStart: start,
        periodEnd: end,
        entityId: entity.entityId,
        entityName: entity.entityName,
        entityLevel: entity.entityLevel,
        platformCode: entity.platformCode,
        metrics: computeMetrics(raw, this.config.targetCpaMicros),
      });
    }

    return rows.sort((a, b) => a.periodStart.getTime() - b.periodStart.getTime());
  }

  async getSummary(params: {
    filter: MetricsFilter;
    entityLevel: EntityLevel;
    comparePrevious?: boolean;
  }): Promise<MetricsSummary> {
    const currentMetrics = await this.aggregateTotal(params.filter, params.entityLevel);

    if (!params.comparePrevious) {
      return { current: currentMetrics, previous: null, change: null };
    }

    const rangeDays = Math.ceil(
      (params.filter.dateRange.end.getTime() - params.filter.dateRange.start.getTime()) /
        (1000 * 60 * 60 * 24)
    );

    const previousEnd = new Date(params.filter.dateRange.start);
    previousEnd.setDate(previousEnd.getDate() - 1);
    const previousStart = new Date(previousEnd);
    previousStart.setDate(previousStart.getDate() - rangeDays + 1);

    const previousFilter: MetricsFilter = {
      ...params.filter,
      dateRange: { start: previousStart, end: previousEnd },
    };

    const previousMetrics = await this.aggregateTotal(previousFilter, params.entityLevel);

    return {
      current: currentMetrics,
      previous: previousMetrics,
      change: computeChange(currentMetrics, previousMetrics),
    };
  }

  private async aggregateTotal(
    filter: MetricsFilter,
    entityLevel: EntityLevel
  ): Promise<MetricsWithWaste> {
    const rows = await this.aggregateByPeriod({
      filter,
      granularity: "day",
      entityLevel,
    });

    const totals: RawMetrics = {
      impressions: BigInt(0),
      clicks: BigInt(0),
      spendMicros: BigInt(0),
      conversions: BigInt(0),
      revenueMicros: BigInt(0),
    };

    for (const row of rows) {
      totals.impressions += BigInt(Math.round(row.metrics.impressions));
      totals.clicks += BigInt(Math.round(row.metrics.clicks));
      totals.spendMicros += BigInt(Math.round(row.metrics.spend * 1_000_000));
      totals.conversions += BigInt(Math.round(row.metrics.conversions));
      totals.revenueMicros += BigInt(Math.round(row.metrics.revenue * 1_000_000));
    }

    return computeMetrics(totals, this.config.targetCpaMicros);
  }

  invalidateCache(organizationId: string): number {
    return this.cache.invalidateOrganization(organizationId);
  }

  getConfig(): AggregatorConfig {
    return { ...this.config };
  }
}

export const metricsAggregator = new MetricsAggregator();
