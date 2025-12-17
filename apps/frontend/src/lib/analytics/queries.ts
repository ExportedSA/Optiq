import "server-only";

import { prisma } from "@/lib/prisma";

export interface TimeSeriesPoint {
  date: string;
  spend: number;
  conversions: number;
  impressions: number;
  clicks: number;
  revenue: number;
}

export interface PlatformTimeSeries {
  platformCode: string;
  platformName: string;
  data: TimeSeriesPoint[];
}

export interface ChartData {
  total: TimeSeriesPoint[];
  byPlatform: PlatformTimeSeries[];
  summary: {
    totalSpend: number;
    totalConversions: number;
    avgCpa: number | null;
    totalRevenue: number;
  };
}

export async function getSpendConversionTimeSeries(params: {
  organizationId: string;
  startDate: Date;
  endDate: Date;
  platformCodes?: string[];
}): Promise<ChartData> {
  const whereBase: Record<string, unknown> = {
    organizationId: params.organizationId,
    date: { gte: params.startDate, lte: params.endDate },
  };

  if (params.platformCodes?.length) {
    whereBase.platform = { code: { in: params.platformCodes } };
  }

  const dailyMetrics = await prisma.dailyAdAccountMetric.findMany({
    where: whereBase,
    select: {
      date: true,
      impressions: true,
      clicks: true,
      spendMicros: true,
      conversions: true,
      revenueMicros: true,
      platform: { select: { code: true, name: true } },
    },
    orderBy: { date: "asc" },
  });

  const totalByDate = new Map<string, TimeSeriesPoint>();
  const byPlatformDate = new Map<string, Map<string, TimeSeriesPoint>>();
  const platformNames = new Map<string, string>();

  for (const m of dailyMetrics) {
    const dateStr = m.date.toISOString().split("T")[0];
    const spend = Number(m.spendMicros) / 1_000_000;
    const conversions = Number(m.conversions);
    const impressions = Number(m.impressions);
    const clicks = Number(m.clicks);
    const revenue = Number(m.revenueMicros) / 1_000_000;

    if (!totalByDate.has(dateStr)) {
      totalByDate.set(dateStr, {
        date: dateStr,
        spend: 0,
        conversions: 0,
        impressions: 0,
        clicks: 0,
        revenue: 0,
      });
    }
    const total = totalByDate.get(dateStr)!;
    total.spend += spend;
    total.conversions += conversions;
    total.impressions += impressions;
    total.clicks += clicks;
    total.revenue += revenue;

    const platformCode = m.platform.code;
    platformNames.set(platformCode, m.platform.name);

    if (!byPlatformDate.has(platformCode)) {
      byPlatformDate.set(platformCode, new Map());
    }
    const platformMap = byPlatformDate.get(platformCode)!;

    if (!platformMap.has(dateStr)) {
      platformMap.set(dateStr, {
        date: dateStr,
        spend: 0,
        conversions: 0,
        impressions: 0,
        clicks: 0,
        revenue: 0,
      });
    }
    const platformPoint = platformMap.get(dateStr)!;
    platformPoint.spend += spend;
    platformPoint.conversions += conversions;
    platformPoint.impressions += impressions;
    platformPoint.clicks += clicks;
    platformPoint.revenue += revenue;
  }

  const totalData = Array.from(totalByDate.values()).sort(
    (a, b) => a.date.localeCompare(b.date)
  );

  const byPlatform: PlatformTimeSeries[] = [];
  for (const [code, dateMap] of byPlatformDate) {
    byPlatform.push({
      platformCode: code,
      platformName: platformNames.get(code) ?? code,
      data: Array.from(dateMap.values()).sort((a, b) =>
        a.date.localeCompare(b.date)
      ),
    });
  }

  const totalSpend = totalData.reduce((sum, p) => sum + p.spend, 0);
  const totalConversions = totalData.reduce((sum, p) => sum + p.conversions, 0);
  const totalRevenue = totalData.reduce((sum, p) => sum + p.revenue, 0);
  const avgCpa = totalConversions > 0 ? totalSpend / totalConversions : null;

  return {
    total: totalData,
    byPlatform,
    summary: {
      totalSpend,
      totalConversions,
      avgCpa,
      totalRevenue,
    },
  };
}

export type DateRangePreset = "7d" | "14d" | "30d" | "90d" | "custom";

export function getDateRangeFromPreset(preset: DateRangePreset): {
  start: Date;
  end: Date;
} {
  const end = new Date();
  end.setHours(23, 59, 59, 999);

  const start = new Date(end);

  switch (preset) {
    case "7d":
      start.setDate(start.getDate() - 6);
      break;
    case "14d":
      start.setDate(start.getDate() - 13);
      break;
    case "30d":
      start.setDate(start.getDate() - 29);
      break;
    case "90d":
      start.setDate(start.getDate() - 89);
      break;
    default:
      start.setDate(start.getDate() - 29);
  }

  start.setHours(0, 0, 0, 0);

  return { start, end };
}
