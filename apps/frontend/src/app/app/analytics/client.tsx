"use client";

import { useState } from "react";
import { DateRangeSelector } from "@/components/analytics/date-range-selector";
import { SpendConversionChart } from "@/components/analytics/spend-conversion-chart";
import type { ChartData, DateRangePreset } from "@/lib/analytics";

interface AnalyticsPageClientProps {
  initialData: ChartData;
  initialDateRange: { start: string; end: string };
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
  return new Intl.NumberFormat("en-US").format(value);
}

export function AnalyticsPageClient({
  initialData,
  initialDateRange,
}: AnalyticsPageClientProps) {
  const [datePreset, setDatePreset] = useState<DateRangePreset>("30d");
  const [customRange, setCustomRange] = useState<{ start: Date; end: Date }>({
    start: new Date(initialDateRange.start),
    end: new Date(initialDateRange.end),
  });
  const [showPlatformOverlay, setShowPlatformOverlay] = useState(true);
  const [data] = useState(initialData);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Analytics</h1>
          <p className="mt-1 text-sm text-zinc-600">
            Spend and conversion trends over time
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <DateRangeSelector
          value={datePreset}
          onChange={setDatePreset}
          customRange={customRange}
          onCustomRangeChange={setCustomRange}
        />

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={showPlatformOverlay}
            onChange={(e) => setShowPlatformOverlay(e.target.checked)}
            className="h-4 w-4 rounded border-zinc-300"
          />
          <span className="text-sm text-zinc-600">Show platform breakdown</span>
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          label="Total Spend"
          value={formatCurrency(data.summary.totalSpend)}
        />
        <SummaryCard
          label="Total Conversions"
          value={formatNumber(data.summary.totalConversions)}
        />
        <SummaryCard
          label="Average CPA"
          value={data.summary.avgCpa ? formatCurrency(data.summary.avgCpa) : "—"}
        />
        <SummaryCard
          label="Total Revenue"
          value={formatCurrency(data.summary.totalRevenue)}
        />
      </div>

      <div>
        <h2 className="mb-3 text-sm font-medium text-zinc-900">
          Spend vs Conversions
        </h2>
        <SpendConversionChart
          data={data.total}
          platformData={data.byPlatform}
          showPlatformOverlay={showPlatformOverlay}
          height={350}
        />
      </div>

      {data.byPlatform.length > 0 && (
        <div>
          <h2 className="mb-3 text-sm font-medium text-zinc-900">
            Platform Breakdown
          </h2>
          <div className="grid gap-4 lg:grid-cols-2">
            {data.byPlatform.map((platform) => {
              const totalSpend = platform.data.reduce((s, d) => s + d.spend, 0);
              const totalConv = platform.data.reduce((s, d) => s + d.conversions, 0);
              const cpa = totalConv > 0 ? totalSpend / totalConv : null;

              return (
                <div
                  key={platform.platformCode}
                  className="rounded-xl border border-zinc-200 bg-white p-4"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <PlatformBadge code={platform.platformCode} />
                      <span className="font-medium">{platform.platformName}</span>
                    </div>
                    <div className="text-right text-xs text-zinc-500">
                      <div>{formatCurrency(totalSpend)} spend</div>
                      <div>{formatNumber(totalConv)} conv</div>
                    </div>
                  </div>
                  <SpendConversionChart
                    data={platform.data}
                    height={150}
                    showPlatformOverlay={false}
                  />
                  <div className="mt-2 text-center text-xs text-zinc-500">
                    CPA: {cpa ? formatCurrency(cpa) : "—"}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4">
      <p className="text-xs font-medium text-zinc-500">{label}</p>
      <p className="mt-1 text-xl font-semibold tracking-tight">{value}</p>
    </div>
  );
}

function PlatformBadge({ code }: { code: string }) {
  const colors: Record<string, string> = {
    GOOGLE_ADS: "bg-blue-500",
    META: "bg-indigo-500",
    TIKTOK: "bg-pink-500",
    LINKEDIN: "bg-sky-600",
  };

  const labels: Record<string, string> = {
    GOOGLE_ADS: "G",
    META: "M",
    TIKTOK: "T",
    LINKEDIN: "L",
  };

  return (
    <span
      className={`inline-flex h-6 w-6 items-center justify-center rounded text-xs font-bold text-white ${
        colors[code] ?? "bg-zinc-500"
      }`}
    >
      {labels[code] ?? "?"}
    </span>
  );
}
