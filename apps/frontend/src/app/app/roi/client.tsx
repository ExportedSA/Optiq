"use client";

import { useState, useEffect, useCallback } from "react";

import {
  KpiCard,
  KpiCardGrid,
  TimeseriesChartCard,
  BreakdownTable,
  DashboardFilters,
  getDefaultFilters,
} from "@/components/dashboard";
import type { FilterState, TimeseriesPoint, BreakdownRow } from "@/components/dashboard";

interface DashboardData {
  kpis: {
    spend: number;
    revenue: number;
    roas: number | null;
    cpa: number | null;
    conversions: number;
    impressions: number;
    clicks: number;
    wasteAmount: number;
    wastePercent: number;
    changes: {
      spend: number;
      revenue: number;
      roas: number | null;
      cpa: number | null;
      conversions: number;
      wastePercent: number;
    } | null;
  };
  timeseries: TimeseriesPoint[];
  breakdown: BreakdownRow[];
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(Math.round(value));
}

function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

type TrendDirection = "up" | "down" | "neutral";

function getTrend(change: number | null, invert = false): TrendDirection {
  if (change === null || change === 0) return "neutral";
  const isUp = change > 0;
  if (invert) return isUp ? "down" : "up";
  return isUp ? "up" : "down";
}

export function RoiDashboardClient() {
  const [filters, setFilters] = useState<FilterState>(getDefaultFilters);
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams({
      startDate: filters.startDate,
      endDate: filters.endDate,
      granularity: filters.granularity,
      breakdown: filters.breakdown,
    });

    if (filters.channels.length > 0) {
      params.set("channels", filters.channels.join(","));
    }

    try {
      const res = await fetch(`/api/dashboard/roi?${params.toString()}`);
      if (!res.ok) {
        throw new Error("Failed to fetch dashboard data");
      }
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const breakdownLabel = filters.breakdown === "platform"
    ? "Channel"
    : filters.breakdown === "campaign"
    ? "Campaign"
    : "Ad";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">ROI Dashboard</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Multi-touch attribution ROI, ROAS, CPA, and waste analysis
        </p>
      </div>

      <DashboardFilters value={filters} onChange={setFilters} />

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <KpiCardGrid>
        <KpiCard
          title="Total Spend"
          value={data ? formatCurrency(data.kpis.spend) : "$0.00"}
          change={data?.kpis.changes?.spend ?? null}
          changeLabel="vs last period"
          trend={getTrend(data?.kpis.changes?.spend ?? null)}
          loading={loading}
          icon={<SpendIcon />}
        />
        <KpiCard
          title="Attributed Revenue"
          value={data ? formatCurrency(data.kpis.revenue) : "$0.00"}
          change={data?.kpis.changes?.revenue ?? null}
          changeLabel="vs last period"
          trend={getTrend(data?.kpis.changes?.revenue ?? null)}
          loading={loading}
          icon={<RevenueIcon />}
        />
        <KpiCard
          title="ROAS"
          value={data?.kpis.roas ? `${data.kpis.roas.toFixed(2)}x` : "—"}
          change={data?.kpis.changes?.roas ?? null}
          changeLabel="vs last period"
          trend={getTrend(data?.kpis.changes?.roas ?? null)}
          loading={loading}
          icon={<RoasIcon />}
        />
        <KpiCard
          title="CPA"
          value={data?.kpis.cpa ? formatCurrency(data.kpis.cpa) : "—"}
          change={data?.kpis.changes?.cpa ?? null}
          changeLabel="vs last period"
          trend={getTrend(data?.kpis.changes?.cpa ?? null, true)}
          loading={loading}
          icon={<CpaIcon />}
        />
      </KpiCardGrid>

      <KpiCardGrid>
        <KpiCard
          title="Wasted Spend"
          value={data ? formatCurrency(data.kpis.wasteAmount) : "$0.00"}
          loading={loading}
          icon={<WasteIcon />}
        />
        <KpiCard
          title="Waste %"
          value={data ? formatPercent(data.kpis.wastePercent) : "0.0%"}
          change={data?.kpis.changes?.wastePercent ?? null}
          changeLabel="vs last period"
          trend={getTrend(data?.kpis.changes?.wastePercent ?? null, true)}
          loading={loading}
          icon={<WastePercentIcon />}
        />
        <KpiCard
          title="Conversions"
          value={data ? formatNumber(data.kpis.conversions) : "0"}
          change={data?.kpis.changes?.conversions ?? null}
          changeLabel="vs last period"
          trend={getTrend(data?.kpis.changes?.conversions ?? null)}
          loading={loading}
          icon={<ConversionIcon />}
        />
        <KpiCard
          title="Clicks"
          value={data ? formatNumber(data.kpis.clicks) : "0"}
          loading={loading}
          icon={<ClickIcon />}
        />
      </KpiCardGrid>

      <div className="rounded-xl border border-zinc-200 bg-white p-6">
        <h2 className="mb-4 text-sm font-medium text-zinc-900">Trendlines</h2>
        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-[180px] animate-pulse rounded-lg bg-zinc-100" />
            ))}
          </div>
        ) : data ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <TimeseriesChartCard
              title="Spend"
              data={data.timeseries}
              metric="spend"
              currentValue={formatCurrency(data.kpis.spend)}
              change={data.kpis.changes?.spend}
            />
            <TimeseriesChartCard
              title="Revenue"
              data={data.timeseries}
              metric="revenue"
              currentValue={formatCurrency(data.kpis.revenue)}
              change={data.kpis.changes?.revenue}
            />
            <TimeseriesChartCard
              title="ROAS"
              data={data.timeseries}
              metric="roas"
              currentValue={data.kpis.roas ? `${data.kpis.roas.toFixed(2)}x` : "—"}
              change={data.kpis.changes?.roas}
            />
          </div>
        ) : null}
      </div>

      <div>
        <h2 className="mb-4 text-sm font-medium text-zinc-900">
          Breakdown by {breakdownLabel}
        </h2>
        {loading ? (
          <div className="h-[300px] animate-pulse rounded-xl bg-zinc-100" />
        ) : data ? (
          <BreakdownTable data={data.breakdown} entityLabel={breakdownLabel} />
        ) : null}
      </div>
    </div>
  );
}

function SpendIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function RevenueIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  );
}

function RoasIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );
}

function CpaIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
    </svg>
  );
}

function WasteIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  );
}

function WastePercentIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
    </svg>
  );
}

function ConversionIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function ClickIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
    </svg>
  );
}
