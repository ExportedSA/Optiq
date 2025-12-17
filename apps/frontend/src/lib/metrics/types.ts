import "server-only";

export type TimeGranularity = "day" | "week" | "month" | "quarter" | "year";

export type EntityLevel = "organization" | "platform" | "ad_account" | "campaign" | "ad";

export interface DateRange {
  start: Date;
  end: Date;
}

export interface MetricsFilter {
  organizationId: string;
  platformCodes?: string[];
  adAccountIds?: string[];
  campaignIds?: string[];
  adIds?: string[];
  dateRange: DateRange;
}

export interface RawMetrics {
  impressions: bigint;
  clicks: bigint;
  spendMicros: bigint;
  conversions: bigint;
  revenueMicros: bigint;
}

export interface ComputedMetrics {
  impressions: number;
  clicks: number;
  spend: number;
  conversions: number;
  revenue: number;
  ctr: number | null;
  cpc: number | null;
  cpa: number | null;
  roas: number | null;
  conversionRate: number | null;
}

export interface MetricsWithWaste extends ComputedMetrics {
  wastedSpend: number;
  wastePercent: number;
  efficientSpend: number;
}

export interface AggregatedMetricsRow {
  period: string;
  periodStart: Date;
  periodEnd: Date;
  entityId: string | null;
  entityName: string | null;
  entityLevel: EntityLevel;
  platformCode: string | null;
  metrics: MetricsWithWaste;
}

export interface MetricsSummary {
  current: MetricsWithWaste;
  previous: MetricsWithWaste | null;
  change: MetricsChange | null;
}

export interface MetricsChange {
  impressions: number;
  clicks: number;
  spend: number;
  conversions: number;
  revenue: number;
  cpa: number | null;
  roas: number | null;
  wastePercent: number;
}

export interface CacheKey {
  type: "metrics";
  organizationId: string;
  entityLevel: EntityLevel;
  entityId: string | null;
  granularity: TimeGranularity;
  dateRange: string;
}

export interface CachedMetrics {
  key: string;
  data: AggregatedMetricsRow[];
  computedAt: Date;
  expiresAt: Date;
}

export function microsToDollars(micros: bigint): number {
  return Number(micros) / 1_000_000;
}

export function computeMetrics(raw: RawMetrics, targetCpaMicros?: bigint): MetricsWithWaste {
  const impressions = Number(raw.impressions);
  const clicks = Number(raw.clicks);
  const spend = microsToDollars(raw.spendMicros);
  const conversions = Number(raw.conversions);
  const revenue = microsToDollars(raw.revenueMicros);

  const ctr = impressions > 0 ? (clicks / impressions) * 100 : null;
  const cpc = clicks > 0 ? spend / clicks : null;
  const cpa = conversions > 0 ? spend / conversions : null;
  const roas = spend > 0 ? revenue / spend : null;
  const conversionRate = clicks > 0 ? (conversions / clicks) * 100 : null;

  let wastedSpend = 0;
  let efficientSpend = spend;

  if (conversions === 0 && spend > 0) {
    wastedSpend = spend;
    efficientSpend = 0;
  } else if (targetCpaMicros && conversions > 0 && cpa !== null) {
    const targetCpa = microsToDollars(targetCpaMicros);
    if (cpa > targetCpa) {
      wastedSpend = spend - targetCpa * conversions;
      efficientSpend = targetCpa * conversions;
    }
  }

  const wastePercent = spend > 0 ? (wastedSpend / spend) * 100 : 0;

  return {
    impressions,
    clicks,
    spend,
    conversions,
    revenue,
    ctr,
    cpc,
    cpa,
    roas,
    conversionRate,
    wastedSpend,
    wastePercent,
    efficientSpend,
  };
}

export function computeChange(
  current: MetricsWithWaste,
  previous: MetricsWithWaste
): MetricsChange {
  const pctChange = (curr: number, prev: number): number => {
    if (prev === 0) return curr > 0 ? 100 : 0;
    return ((curr - prev) / prev) * 100;
  };

  return {
    impressions: pctChange(current.impressions, previous.impressions),
    clicks: pctChange(current.clicks, previous.clicks),
    spend: pctChange(current.spend, previous.spend),
    conversions: pctChange(current.conversions, previous.conversions),
    revenue: pctChange(current.revenue, previous.revenue),
    cpa:
      current.cpa !== null && previous.cpa !== null
        ? pctChange(current.cpa, previous.cpa)
        : null,
    roas:
      current.roas !== null && previous.roas !== null
        ? pctChange(current.roas, previous.roas)
        : null,
    wastePercent: current.wastePercent - previous.wastePercent,
  };
}

export function buildCacheKey(params: {
  organizationId: string;
  entityLevel: EntityLevel;
  entityId: string | null;
  granularity: TimeGranularity;
  dateRange: DateRange;
}): string {
  const dateStr = `${params.dateRange.start.toISOString().split("T")[0]}_${params.dateRange.end.toISOString().split("T")[0]}`;
  return `metrics:${params.organizationId}:${params.entityLevel}:${params.entityId ?? "all"}:${params.granularity}:${dateStr}`;
}

export function getPeriodBounds(
  date: Date,
  granularity: TimeGranularity
): { start: Date; end: Date; label: string } {
  const d = new Date(date);

  switch (granularity) {
    case "day": {
      const start = new Date(d.getFullYear(), d.getMonth(), d.getDate());
      const end = new Date(start);
      end.setDate(end.getDate() + 1);
      end.setMilliseconds(-1);
      return { start, end, label: start.toISOString().split("T")[0] };
    }

    case "week": {
      const day = d.getDay();
      const diff = d.getDate() - day + (day === 0 ? -6 : 1);
      const start = new Date(d.getFullYear(), d.getMonth(), diff);
      const end = new Date(start);
      end.setDate(end.getDate() + 7);
      end.setMilliseconds(-1);
      const weekNum = Math.ceil(
        ((start.getTime() - new Date(start.getFullYear(), 0, 1).getTime()) / 86400000 + 1) / 7
      );
      return { start, end, label: `${start.getFullYear()}-W${String(weekNum).padStart(2, "0")}` };
    }

    case "month": {
      const start = new Date(d.getFullYear(), d.getMonth(), 1);
      const end = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
      return {
        start,
        end,
        label: `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, "0")}`,
      };
    }

    case "quarter": {
      const quarter = Math.floor(d.getMonth() / 3);
      const start = new Date(d.getFullYear(), quarter * 3, 1);
      const end = new Date(d.getFullYear(), quarter * 3 + 3, 0, 23, 59, 59, 999);
      return { start, end, label: `${start.getFullYear()}-Q${quarter + 1}` };
    }

    case "year": {
      const start = new Date(d.getFullYear(), 0, 1);
      const end = new Date(d.getFullYear(), 11, 31, 23, 59, 59, 999);
      return { start, end, label: String(d.getFullYear()) };
    }
  }
}
