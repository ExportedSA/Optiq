"use server";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";

import { authOptions } from "@/lib/auth";
import { metricsAggregator } from "@/lib/metrics";
import { wasteEvaluator } from "@/lib/waste";
import type { TimeGranularity, EntityLevel } from "@/lib/metrics";

const QuerySchema = z.object({
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  channels: z.string().optional(),
  granularity: z.enum(["day", "week", "month"]).default("day"),
  breakdown: z.enum(["platform", "campaign", "ad"]).default("campaign"),
});

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.activeOrgId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const orgId = session.user.activeOrgId;
  const url = new URL(req.url);
  const params = QuerySchema.safeParse({
    startDate: url.searchParams.get("startDate"),
    endDate: url.searchParams.get("endDate"),
    channels: url.searchParams.get("channels"),
    granularity: url.searchParams.get("granularity") ?? "day",
    breakdown: url.searchParams.get("breakdown") ?? "campaign",
  });

  if (!params.success) {
    return NextResponse.json({ error: "invalid_params" }, { status: 400 });
  }

  const { startDate, endDate, channels, granularity, breakdown } = params.data;

  const dateRange = {
    start: new Date(startDate + "T00:00:00"),
    end: new Date(endDate + "T23:59:59.999"),
  };

  const platformCodes = channels ? channels.split(",").filter(Boolean) : undefined;

  const filter = {
    organizationId: orgId,
    dateRange,
    platformCodes,
  };

  try {
    const [summary, timeseries, breakdownData, wasteAnalysis] = await Promise.all([
      metricsAggregator.getSummary({
        filter,
        entityLevel: "organization",
        comparePrevious: true,
      }),
      metricsAggregator.aggregateByPeriod({
        filter,
        granularity: granularity as TimeGranularity,
        entityLevel: "organization",
      }),
      metricsAggregator.aggregateByPeriod({
        filter,
        granularity: "day",
        entityLevel: breakdown as EntityLevel,
      }),
      wasteEvaluator.evaluateOrganization({
        organizationId: orgId,
        windowDays: Math.ceil((dateRange.end.getTime() - dateRange.start.getTime()) / 86400000),
        endDate: dateRange.end,
      }),
    ]);

    const totalWaste = wasteAnalysis.alerts.reduce(
      (sum, a) => sum + Number(a.spendMicros) / 1_000_000,
      0
    );

    const wastePercent = summary.current.spend > 0
      ? (totalWaste / summary.current.spend) * 100
      : 0;

    const kpis = {
      spend: summary.current.spend,
      revenue: summary.current.revenue,
      roas: summary.current.roas,
      cpa: summary.current.cpa,
      conversions: summary.current.conversions,
      impressions: summary.current.impressions,
      clicks: summary.current.clicks,
      wasteAmount: totalWaste,
      wastePercent,
      changes: summary.change,
    };

    const timeseriesData = timeseries.map((row) => ({
      date: row.period,
      spend: row.metrics.spend,
      revenue: row.metrics.revenue,
      conversions: row.metrics.conversions,
      roas: row.metrics.roas,
      cpa: row.metrics.cpa,
    }));

    const entityTotals = new Map<string, {
      entityId: string;
      entityName: string;
      platformCode: string | null;
      spend: number;
      revenue: number;
      conversions: number;
      impressions: number;
      clicks: number;
      roas: number | null;
      cpa: number | null;
    }>();

    for (const row of breakdownData) {
      const key = row.entityId ?? "unknown";
      const existing = entityTotals.get(key);
      if (existing) {
        existing.spend += row.metrics.spend;
        existing.revenue += row.metrics.revenue;
        existing.conversions += row.metrics.conversions;
        existing.impressions += row.metrics.impressions;
        existing.clicks += row.metrics.clicks;
      } else {
        entityTotals.set(key, {
          entityId: row.entityId ?? "unknown",
          entityName: row.entityName ?? "Unknown",
          platformCode: row.platformCode,
          spend: row.metrics.spend,
          revenue: row.metrics.revenue,
          conversions: row.metrics.conversions,
          impressions: row.metrics.impressions,
          clicks: row.metrics.clicks,
          roas: null,
          cpa: null,
        });
      }
    }

    const breakdownRows = Array.from(entityTotals.values()).map((e) => ({
      ...e,
      roas: e.spend > 0 ? e.revenue / e.spend : null,
      cpa: e.conversions > 0 ? e.spend / e.conversions : null,
    }));

    breakdownRows.sort((a, b) => b.spend - a.spend);

    return NextResponse.json({
      kpis,
      timeseries: timeseriesData,
      breakdown: breakdownRows.slice(0, 50),
    });
  } catch (error) {
    console.error("ROI dashboard error:", error);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
