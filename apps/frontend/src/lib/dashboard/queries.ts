import "server-only";

import { prisma } from "@/lib/prisma";
import { metricsAggregator } from "@/lib/metrics";
import { wasteEvaluator } from "@/lib/waste";
import type { MetricsSummary } from "@/lib/metrics";

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

  const summary = await metricsAggregator.getSummary({
    filter: {
      organizationId: params.organizationId,
      dateRange: { start: startDate, end: endDate },
    },
    entityLevel: "organization",
    comparePrevious: true,
  });

  const wasteAnalysis = await wasteEvaluator.evaluateOrganization({
    organizationId: params.organizationId,
    windowDays: days,
    endDate,
  });

  const totalWastedSpend = wasteAnalysis.alerts.reduce(
    (sum, a) => sum + Number(a.spendMicros) / 1_000_000,
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
      organizationId: params.organizationId,
      windowDays: days,
      endDate: prevEndDate,
    });

    const prevTotalWasted = prevWasteAnalysis.alerts.reduce(
      (sum, a) => sum + Number(a.spendMicros) / 1_000_000,
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
      status: { in: ["COMPLETED", "FAILED"] },
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
    type: job.status === "COMPLETED" ? "success" : "error",
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
