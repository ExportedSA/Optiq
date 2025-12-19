import "server-only";

import { prisma } from "@/lib/prisma";
import { metricsAggregator } from "@/lib/metrics";
import { wasteEvaluator } from "@/lib/waste";
import type { MetricsSummary } from "@/lib/metrics";

const MICROS_PER_UNIT = 1_000_000;

export interface DashboardKpis {
  totalSpend: number;
  totalConversions: number;
  overallCpa: number | null;
  wastedSpendPercent: number;
  roas: number | null;
  previousPeriod: {
    totalSpend: number;
    totalConversions: number;
    overallCpa: number | null;
    wastedSpendPercent: number;
  } | null;
  changes: {
    spend: number;
    conversions: number;
    cpa: number | null;
    wastedSpendPercent: number;
  } | null;
}

/**
 * Get dashboard KPIs from daily_rollups (fast path)
 * Falls back to metrics aggregator if no rollups exist
 */
export async function getDashboardKpis(params: {
  organizationId: string;
  days?: number;
}): Promise<DashboardKpis> {
  const days = params.days ?? 30;
  const endDate = new Date();
  endDate.setHours(23, 59, 59, 999);

  const startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - days + 1);
  startDate.setHours(0, 0, 0, 0);

  // Try to get data from daily_rollups first (fast path)
  const rollupKpis = await getDashboardKpisFromRollups(params.organizationId, startDate, endDate, days);
  if (rollupKpis) {
    return rollupKpis;
  }

  // Fall back to metrics aggregator (slower but works without rollups)
  return getDashboardKpisFromMetrics(params.organizationId, startDate, endDate, days);
}

/**
 * Get KPIs from pre-aggregated daily_rollups
 */
async function getDashboardKpisFromRollups(
  organizationId: string,
  startDate: Date,
  endDate: Date,
  days: number
): Promise<DashboardKpis | null> {
  // Get current period rollups at organization level
  const currentRollups = await prisma.dailyRollup.findMany({
    where: {
      organizationId,
      grain: "organization",
      date: { gte: startDate, lte: endDate },
    },
  });

  if (currentRollups.length === 0) {
    return null; // No rollups, fall back to metrics
  }

  // Aggregate current period
  const current = aggregateRollups(currentRollups);

  // Get previous period for comparison
  const prevEndDate = new Date(startDate);
  prevEndDate.setDate(prevEndDate.getDate() - 1);
  const prevStartDate = new Date(prevEndDate);
  prevStartDate.setDate(prevStartDate.getDate() - days + 1);

  const previousRollups = await prisma.dailyRollup.findMany({
    where: {
      organizationId,
      grain: "organization",
      date: { gte: prevStartDate, lte: prevEndDate },
    },
  });

  const previous = previousRollups.length > 0 ? aggregateRollups(previousRollups) : null;

  // Calculate changes
  const changes = previous ? {
    spend: current.spend > 0 && previous.spend > 0 
      ? ((current.spend - previous.spend) / previous.spend) * 100 
      : 0,
    conversions: current.conversions > 0 && previous.conversions > 0
      ? ((current.conversions - previous.conversions) / previous.conversions) * 100
      : 0,
    cpa: current.cpa !== null && previous.cpa !== null && previous.cpa > 0
      ? ((current.cpa - previous.cpa) / previous.cpa) * 100
      : null,
    wastedSpendPercent: current.wastedSpendPercent - previous.wastedSpendPercent,
  } : null;

  return {
    totalSpend: current.spend,
    totalConversions: current.conversions,
    overallCpa: current.cpa,
    wastedSpendPercent: current.wastedSpendPercent,
    roas: current.roas,
    previousPeriod: previous ? {
      totalSpend: previous.spend,
      totalConversions: previous.conversions,
      overallCpa: previous.cpa,
      wastedSpendPercent: previous.wastedSpendPercent,
    } : null,
    changes,
  };
}

/**
 * Aggregate rollup records into summary metrics
 */
function aggregateRollups(rollups: Array<{
  spendMicros: bigint;
  conversions: number;
  conversionValue: bigint;
  wasteSpendMicros: bigint;
  cpa: number | null;
  roas: number | null;
}>): {
  spend: number;
  conversions: number;
  revenue: number;
  cpa: number | null;
  roas: number | null;
  wastedSpendPercent: number;
} {
  const totalSpendMicros = rollups.reduce((sum, r) => sum + Number(r.spendMicros), 0);
  const totalConversions = rollups.reduce((sum, r) => sum + r.conversions, 0);
  const totalRevenueMicros = rollups.reduce((sum, r) => sum + Number(r.conversionValue), 0);
  const totalWasteMicros = rollups.reduce((sum, r) => sum + Number(r.wasteSpendMicros), 0);

  const spend = totalSpendMicros / MICROS_PER_UNIT;
  const revenue = totalRevenueMicros / MICROS_PER_UNIT;
  const cpa = totalConversions > 0 ? spend / totalConversions : null;
  const roas = spend > 0 ? revenue / spend : null;
  const wastedSpendPercent = spend > 0 ? (totalWasteMicros / MICROS_PER_UNIT / spend) * 100 : 0;

  return { spend, conversions: totalConversions, revenue, cpa, roas, wastedSpendPercent };
}

/**
 * Get KPIs from metrics aggregator (fallback)
 */
async function getDashboardKpisFromMetrics(
  organizationId: string,
  startDate: Date,
  endDate: Date,
  days: number
): Promise<DashboardKpis> {
  const summary = await metricsAggregator.getSummary({
    filter: {
      organizationId,
      dateRange: { start: startDate, end: endDate },
    },
    entityLevel: "organization",
    comparePrevious: true,
  });

  const wasteAnalysis = await wasteEvaluator.evaluateOrganization({
    organizationId,
    windowDays: days,
    endDate,
  });

  const totalWastedSpend = wasteAnalysis.alerts.reduce(
    (sum, a) => sum + Number(a.spendMicros) / MICROS_PER_UNIT,
    0
  );

  const wastedSpendPercent =
    summary.current.spend > 0
      ? (totalWastedSpend / summary.current.spend) * 100
      : 0;

  let previousWastedPercent = 0;
  if (summary.previous && summary.previous.spend > 0) {
    const prevEndDate = new Date(startDate);
    prevEndDate.setDate(prevEndDate.getDate() - 1);

    const prevWasteAnalysis = await wasteEvaluator.evaluateOrganization({
      organizationId,
      windowDays: days,
      endDate: prevEndDate,
    });

    const prevTotalWasted = prevWasteAnalysis.alerts.reduce(
      (sum, a) => sum + Number(a.spendMicros) / MICROS_PER_UNIT,
      0
    );

    previousWastedPercent =
      summary.previous.spend > 0
        ? (prevTotalWasted / summary.previous.spend) * 100
        : 0;
  }

  return {
    totalSpend: summary.current.spend,
    totalConversions: summary.current.conversions,
    overallCpa: summary.current.cpa,
    wastedSpendPercent,
    roas: summary.current.roas,
    previousPeriod: summary.previous
      ? {
          totalSpend: summary.previous.spend,
          totalConversions: summary.previous.conversions,
          overallCpa: summary.previous.cpa,
          wastedSpendPercent: previousWastedPercent,
        }
      : null,
    changes: summary.change
      ? {
          spend: summary.change.spend,
          conversions: summary.change.conversions,
          cpa: summary.change.cpa,
          wastedSpendPercent: wastedSpendPercent - previousWastedPercent,
        }
      : null,
  };
}

export async function getRecentActivity(params: {
  organizationId: string;
  limit?: number;
}): Promise<
  Array<{
    id: string;
    type: string;
    description: string;
    timestamp: Date;
  }>
> {
  const jobs = await prisma.ingestionJob.findMany({
    where: {
      organizationId: params.organizationId,
      status: { in: ["SUCCEEDED", "FAILED"] },
    },
    orderBy: { updatedAt: "desc" },
    take: params.limit ?? 5,
    select: {
      id: true,
      platform: true,
      jobType: true,
      status: true,
      updatedAt: true,
    },
  });

  return jobs.map((job: typeof jobs[number]) => ({
    id: job.id,
    type: job.status === "SUCCEEDED" ? "success" : "error",
    description: `${job.platform} ${job.jobType.toLowerCase().replace("_", " ")} ${job.status.toLowerCase()}`,
    timestamp: job.updatedAt,
  }));
}

export async function getTopWasteAlerts(params: {
  organizationId: string;
  limit?: number;
}): Promise<
  Array<{
    id: string;
    entityName: string;
    entityType: string;
    wastedSpend: number;
    reason: string;
    level: string;
  }>
> {
  const analysis = await wasteEvaluator.evaluateOrganization({
    organizationId: params.organizationId,
    windowDays: 7,
  });

  return analysis.alerts
    .sort((a, b) => Number(b.spendMicros) - Number(a.spendMicros))
    .slice(0, params.limit ?? 5)
    .map((alert) => ({
      id: alert.id,
      entityName: alert.entityName,
      entityType: alert.entityType,
      wastedSpend: Number(alert.spendMicros) / 1_000_000,
      reason: alert.reason.replace(/_/g, " "),
      level: alert.level,
    }));
}
