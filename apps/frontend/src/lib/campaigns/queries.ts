import "server-only";

import { prisma } from "@/lib/prisma";
import { wasteEvaluator } from "@/lib/waste";

export type SortField =
  | "name"
  | "platform"
  | "spend"
  | "conversions"
  | "cpa"
  | "roas"
  | "impressions"
  | "clicks"
  | "ctr";

export type SortDirection = "asc" | "desc";

export interface CampaignFilters {
  organizationId: string;
  platformCodes?: string[];
  adAccountIds?: string[];
  status?: string[];
  search?: string;
  dateRange: {
    start: Date;
    end: Date;
  };
}

export interface CampaignPerformanceRow {
  id: string;
  name: string;
  externalId: string;
  platformCode: string;
  platformName: string;
  adAccountId: string;
  adAccountName: string;
  status: string;
  impressions: number;
  clicks: number;
  spend: number;
  conversions: number;
  revenue: number;
  ctr: number | null;
  cpc: number | null;
  cpa: number | null;
  roas: number | null;
  wasteLevel: "none" | "low" | "medium" | "high" | "critical";
  wastedSpend: number;
  wasteReason: string | null;
}

export interface CampaignPerformanceResult {
  campaigns: CampaignPerformanceRow[];
  total: number;
  platforms: Array<{ code: string; name: string; count: number }>;
}

export async function getCampaignPerformance(params: {
  filters: CampaignFilters;
  sort?: { field: SortField; direction: SortDirection };
  page?: number;
  pageSize?: number;
}): Promise<CampaignPerformanceResult> {
  const { filters, sort, page = 1, pageSize = 50 } = params;

  const where: Record<string, unknown> = {
    organization: { id: filters.organizationId },
  };

  if (filters.platformCodes?.length) {
    where.platform = { code: { in: filters.platformCodes } };
  }

  if (filters.adAccountIds?.length) {
    where.adAccountId = { in: filters.adAccountIds };
  }

  if (filters.status?.length) {
    where.status = { in: filters.status };
  }

  if (filters.search) {
    where.OR = [
      { name: { contains: filters.search, mode: "insensitive" } },
      { externalId: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  const [campaigns, total, platformCounts] = await Promise.all([
    prisma.campaign.findMany({
      where,
      include: {
        platform: { select: { code: true, name: true } },
        adAccount: { select: { id: true, name: true } },
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.campaign.count({ where }),
    prisma.campaign.groupBy({
      by: ["platformId"],
      where: { organization: { id: filters.organizationId } },
      _count: { id: true },
    }),
  ]);

  const campaignIds = campaigns.map((c: { id: string }) => c.id);

  const metrics = await prisma.dailyCampaignMetric.groupBy({
    by: ["campaignId"],
    where: {
      campaignId: { in: campaignIds },
      date: { gte: filters.dateRange.start, lte: filters.dateRange.end },
    },
    _sum: {
      impressions: true,
      clicks: true,
      spendMicros: true,
      conversions: true,
      revenueMicros: true,
    },
  });

  type MetricSum = {
    impressions: bigint | null;
    clicks: bigint | null;
    spendMicros: bigint | null;
    conversions: bigint | null;
    revenueMicros: bigint | null;
  };

  const metricsMap = new Map<string, MetricSum>(
    metrics.map((m: typeof metrics[number]) => [m.campaignId, m._sum as MetricSum])
  );

  const wasteAnalysis = await wasteEvaluator.evaluateOrganization({
    organizationId: filters.organizationId,
    windowDays: Math.ceil(
      (filters.dateRange.end.getTime() - filters.dateRange.start.getTime()) /
        (1000 * 60 * 60 * 24)
    ),
    endDate: filters.dateRange.end,
  });

  const wasteMap = new Map(
    wasteAnalysis.alerts
      .filter((a) => a.entityType === "campaign")
      .map((a) => [a.entityId, a])
  );

  const rows: CampaignPerformanceRow[] = campaigns.map((campaign: typeof campaigns[number]) => {
    const m = metricsMap.get(campaign.id) ?? {
      impressions: BigInt(0),
      clicks: BigInt(0),
      spendMicros: BigInt(0),
      conversions: BigInt(0),
      revenueMicros: BigInt(0),
    };

    const impressions = Number(m.impressions ?? 0);
    const clicks = Number(m.clicks ?? 0);
    const spend = Number(m.spendMicros ?? 0) / 1_000_000;
    const conversions = Number(m.conversions ?? 0);
    const revenue = Number(m.revenueMicros ?? 0) / 1_000_000;

    const ctr = impressions > 0 ? (clicks / impressions) * 100 : null;
    const cpc = clicks > 0 ? spend / clicks : null;
    const cpa = conversions > 0 ? spend / conversions : null;
    const roas = spend > 0 ? revenue / spend : null;

    const waste = wasteMap.get(campaign.id);

    return {
      id: campaign.id,
      name: campaign.name,
      externalId: campaign.externalId,
      platformCode: campaign.platform.code,
      platformName: campaign.platform.name,
      adAccountId: campaign.adAccount.id,
      adAccountName: campaign.adAccount.name,
      status: campaign.status,
      impressions,
      clicks,
      spend,
      conversions,
      revenue,
      ctr,
      cpc,
      cpa,
      roas,
      wasteLevel: waste?.level ?? "none",
      wastedSpend: waste ? Number(waste.spendMicros) / 1_000_000 : 0,
      wasteReason: waste?.reason ?? null,
    };
  });

  if (sort) {
    rows.sort((a, b) => {
      let aVal: number | string | null = null;
      let bVal: number | string | null = null;

      switch (sort.field) {
        case "name":
          aVal = a.name.toLowerCase();
          bVal = b.name.toLowerCase();
          break;
        case "platform":
          aVal = a.platformCode;
          bVal = b.platformCode;
          break;
        case "spend":
          aVal = a.spend;
          bVal = b.spend;
          break;
        case "conversions":
          aVal = a.conversions;
          bVal = b.conversions;
          break;
        case "cpa":
          aVal = a.cpa ?? Infinity;
          bVal = b.cpa ?? Infinity;
          break;
        case "roas":
          aVal = a.roas ?? -Infinity;
          bVal = b.roas ?? -Infinity;
          break;
        case "impressions":
          aVal = a.impressions;
          bVal = b.impressions;
          break;
        case "clicks":
          aVal = a.clicks;
          bVal = b.clicks;
          break;
        case "ctr":
          aVal = a.ctr ?? -Infinity;
          bVal = b.ctr ?? -Infinity;
          break;
      }

      if (aVal === null || bVal === null) return 0;
      if (aVal < bVal) return sort.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sort.direction === "asc" ? 1 : -1;
      return 0;
    });
  }

  const platforms = await prisma.platform.findMany({
    where: { id: { in: platformCounts.map((p: { platformId: string }) => p.platformId) } },
    select: { code: true, name: true, id: true },
  });

  const platformsWithCounts = platforms.map((p: typeof platforms[number]) => ({
    code: p.code,
    name: p.name,
    count: platformCounts.find((pc: { platformId: string }) => pc.platformId === p.id)?._count?.id ?? 0,
  }));

  return {
    campaigns: rows,
    total,
    platforms: platformsWithCounts,
  };
}

export async function getCampaignDetails(params: {
  organizationId: string;
  campaignId: string;
  dateRange: { start: Date; end: Date };
}): Promise<{
  campaign: CampaignPerformanceRow | null;
  dailyMetrics: Array<{
    date: string;
    impressions: number;
    clicks: number;
    spend: number;
    conversions: number;
  }>;
  ads: Array<{
    id: string;
    name: string;
    spend: number;
    conversions: number;
    cpa: number | null;
  }>;
}> {
  const campaign = await prisma.campaign.findFirst({
    where: {
      id: params.campaignId,
      organization: { id: params.organizationId },
    },
    include: {
      platform: { select: { code: true, name: true } },
      adAccount: { select: { id: true, name: true } },
    },
  });

  if (!campaign) {
    return { campaign: null, dailyMetrics: [], ads: [] };
  }

  const [dailyMetrics, adMetrics] = await Promise.all([
    prisma.dailyCampaignMetric.findMany({
      where: {
        campaignId: params.campaignId,
        date: { gte: params.dateRange.start, lte: params.dateRange.end },
      },
      orderBy: { date: "asc" },
      select: {
        date: true,
        impressions: true,
        clicks: true,
        spendMicros: true,
        conversions: true,
      },
    }),
    prisma.dailyAdMetric.groupBy({
      by: ["adId"],
      where: {
        campaignId: params.campaignId,
        date: { gte: params.dateRange.start, lte: params.dateRange.end },
      },
      _sum: {
        spendMicros: true,
        conversions: true,
      },
    }),
  ]);

  const adIds = adMetrics.map((a: { adId: string }) => a.adId);
  const ads = await prisma.ad.findMany({
    where: { id: { in: adIds } },
    select: { id: true, name: true },
  });

  const adMap = new Map(ads.map((a: { id: string; name: string | null }) => [a.id, a.name]));

  type Totals = { impressions: number; clicks: number; spend: number; conversions: number; revenue: number };
  const totals = dailyMetrics.reduce(
    (acc: Totals, m: typeof dailyMetrics[number]): Totals => ({
      impressions: acc.impressions + Number(m.impressions),
      clicks: acc.clicks + Number(m.clicks),
      spend: acc.spend + Number(m.spendMicros) / 1_000_000,
      conversions: acc.conversions + Number(m.conversions),
      revenue: acc.revenue,
    }),
    { impressions: 0, clicks: 0, spend: 0, conversions: 0, revenue: 0 }
  );

  const ctr = totals.impressions > 0 ? (totals.clicks / totals.impressions) * 100 : null;
  const cpc = totals.clicks > 0 ? totals.spend / totals.clicks : null;
  const cpa = totals.conversions > 0 ? totals.spend / totals.conversions : null;
  const roas = totals.spend > 0 ? totals.revenue / totals.spend : null;

  return {
    campaign: {
      id: campaign.id,
      name: campaign.name,
      externalId: campaign.externalId,
      platformCode: campaign.platform.code,
      platformName: campaign.platform.name,
      adAccountId: campaign.adAccount.id,
      adAccountName: campaign.adAccount.name,
      status: campaign.status,
      ...totals,
      ctr,
      cpc,
      cpa,
      roas,
      wasteLevel: "none",
      wastedSpend: 0,
      wasteReason: null,
    },
    dailyMetrics: dailyMetrics.map((m: typeof dailyMetrics[number]) => ({
      date: m.date.toISOString().split("T")[0],
      impressions: Number(m.impressions),
      clicks: Number(m.clicks),
      spend: Number(m.spendMicros) / 1_000_000,
      conversions: Number(m.conversions),
    })),
    ads: adMetrics.map((a: typeof adMetrics[number]) => {
      const spend = Number(a._sum.spendMicros ?? 0) / 1_000_000;
      const conversions = Number(a._sum.conversions ?? 0);
      return {
        id: a.adId,
        name: adMap.get(a.adId) ?? a.adId,
        spend,
        conversions,
        cpa: conversions > 0 ? spend / conversions : null,
      };
    }),
  };
}
