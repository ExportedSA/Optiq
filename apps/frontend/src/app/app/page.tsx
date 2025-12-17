import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { getDashboardKpis, getRecentActivity, getTopWasteAlerts } from "@/lib/dashboard";
import { KpiCard, KpiCardGrid } from "@/components/dashboard";
import type { TrendDirection } from "@/components/dashboard";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

function getTrend(change: number | null, invert = false): TrendDirection {
  if (change === null || change === 0) return "neutral";
  const isUp = change > 0;
  if (invert) return isUp ? "down" : "up";
  return isUp ? "up" : "down";
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const orgId = session?.user?.activeOrgId;

  let kpis = null;
  let recentActivity: Awaited<ReturnType<typeof getRecentActivity>> = [];
  let wasteAlerts: Awaited<ReturnType<typeof getTopWasteAlerts>> = [];

  if (orgId) {
    try {
      [kpis, recentActivity, wasteAlerts] = await Promise.all([
        getDashboardKpis({ organizationId: orgId, days: 30 }),
        getRecentActivity({ organizationId: orgId, limit: 5 }),
        getTopWasteAlerts({ organizationId: orgId, limit: 5 }),
      ]);
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Welcome back, {session?.user?.name ?? session?.user?.email}
        </p>
      </div>

      <KpiCardGrid>
        <KpiCard
          title="Total Spend"
          value={kpis ? formatCurrency(kpis.totalSpend) : "$0.00"}
          change={kpis?.changes?.spend ?? null}
          changeLabel="vs last period"
          trend={getTrend(kpis?.changes?.spend ?? null)}
          icon={<SpendIcon />}
        />
        <KpiCard
          title="Conversions"
          value={kpis ? formatNumber(kpis.totalConversions) : "0"}
          change={kpis?.changes?.conversions ?? null}
          changeLabel="vs last period"
          trend={getTrend(kpis?.changes?.conversions ?? null)}
          icon={<ConversionIcon />}
        />
        <KpiCard
          title="CPA"
          value={kpis?.overallCpa ? formatCurrency(kpis.overallCpa) : "—"}
          change={kpis?.changes?.cpa ?? null}
          changeLabel="vs last period"
          trend={getTrend(kpis?.changes?.cpa ?? null, true)}
          icon={<CpaIcon />}
        />
        <KpiCard
          title="Wasted Spend"
          value={kpis ? formatPercent(kpis.wastedSpendPercent) : "0.0%"}
          change={kpis?.changes?.wastedSpendPercent ?? null}
          changeLabel="vs last period"
          trend={getTrend(kpis?.changes?.wastedSpendPercent ?? null, true)}
          icon={<WasteIcon />}
        />
      </KpiCardGrid>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-zinc-200 bg-white p-6">
          <h2 className="text-sm font-medium text-zinc-900">Recent Activity</h2>
          {recentActivity.length > 0 ? (
            <ul className="mt-4 space-y-3">
              {recentActivity.map((activity) => (
                <li key={activity.id} className="flex items-start gap-3">
                  <span
                    className={`mt-0.5 h-2 w-2 rounded-full ${
                      activity.type === "success" ? "bg-green-500" : "bg-red-500"
                    }`}
                  />
                  <div className="flex-1">
                    <p className="text-sm text-zinc-700">{activity.description}</p>
                    <p className="text-xs text-zinc-500">
                      {activity.timestamp.toLocaleString()}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-zinc-500">No recent activity</p>
          )}
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-6">
          <h2 className="text-sm font-medium text-zinc-900">Waste Alerts</h2>
          {wasteAlerts.length > 0 ? (
            <ul className="mt-4 space-y-3">
              {wasteAlerts.map((alert) => (
                <li key={alert.id} className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-zinc-700">{alert.entityName}</p>
                    <p className="text-xs text-zinc-500 capitalize">{alert.reason}</p>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      alert.level === "critical"
                        ? "bg-red-100 text-red-700"
                        : alert.level === "high"
                        ? "bg-orange-100 text-orange-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {formatCurrency(alert.wastedSpend)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-zinc-500">No waste alerts</p>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-6">
        <h2 className="text-sm font-medium text-zinc-900">Quick Actions</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <a
            href="/app/integrations"
            className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
          >
            <span>🔌</span> Connect Ad Platform
          </a>
          <a
            href="/app/campaigns"
            className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
          >
            <span>📢</span> View Campaigns
          </a>
          <a
            href="/app/waste"
            className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
          >
            <span>💸</span> Check Waste
          </a>
        </div>
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

function ConversionIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
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
