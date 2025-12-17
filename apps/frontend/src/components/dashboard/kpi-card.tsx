"use client";

import type { ReactNode } from "react";

export type TrendDirection = "up" | "down" | "neutral";

export interface KpiCardProps {
  title: string;
  value: string;
  change?: number | null;
  changeLabel?: string;
  trend?: TrendDirection;
  icon?: ReactNode;
  loading?: boolean;
  format?: "currency" | "number" | "percent";
}

function getTrendColor(trend: TrendDirection, invertColors = false): string {
  if (trend === "neutral") return "text-zinc-500";
  if (invertColors) {
    return trend === "up" ? "text-red-600" : "text-green-600";
  }
  return trend === "up" ? "text-green-600" : "text-red-600";
}

function getTrendIcon(trend: TrendDirection): string {
  if (trend === "up") return "↑";
  if (trend === "down") return "↓";
  return "→";
}

export function KpiCard({
  title,
  value,
  change,
  changeLabel,
  trend = "neutral",
  icon,
  loading = false,
}: KpiCardProps) {
  if (loading) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white p-6">
        <div className="flex items-center justify-between">
          <div className="h-4 w-24 animate-pulse rounded bg-zinc-200" />
          {icon && <div className="text-zinc-400">{icon}</div>}
        </div>
        <div className="mt-3 h-8 w-32 animate-pulse rounded bg-zinc-200" />
        <div className="mt-2 h-4 w-20 animate-pulse rounded bg-zinc-200" />
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 transition-shadow hover:shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-zinc-600">{title}</span>
        {icon && <div className="text-zinc-400">{icon}</div>}
      </div>

      <div className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900">
        {value}
      </div>

      {change !== undefined && change !== null && (
        <div className={`mt-1 flex items-center gap-1 text-sm ${getTrendColor(trend)}`}>
          <span>{getTrendIcon(trend)}</span>
          <span>
            {change >= 0 ? "+" : ""}
            {change.toFixed(1)}%
          </span>
          {changeLabel && (
            <span className="text-zinc-500">{changeLabel}</span>
          )}
        </div>
      )}
    </div>
  );
}

export function KpiCardGrid({ children }: { children: ReactNode }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {children}
    </div>
  );
}
