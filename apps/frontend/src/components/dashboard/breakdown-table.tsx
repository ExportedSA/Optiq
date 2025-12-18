"use client";

import { useState, useMemo } from "react";

export interface BreakdownRow {
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
}

type SortKey = "spend" | "revenue" | "conversions" | "roas" | "cpa" | "impressions" | "clicks";
type SortDir = "asc" | "desc";

interface BreakdownTableProps {
  data: BreakdownRow[];
  entityLabel?: string;
}

const PLATFORM_LABELS: Record<string, string> = {
  GOOGLE_ADS: "Google",
  META: "Meta",
  TIKTOK: "TikTok",
  LINKEDIN: "LinkedIn",
};

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

export function BreakdownTable({ data, entityLabel = "Campaign" }: BreakdownTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("spend");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const sorted = useMemo(() => {
    return [...data].sort((a, b) => {
      const aVal = a[sortKey] ?? 0;
      const bVal = b[sortKey] ?? 0;
      return sortDir === "desc" ? bVal - aVal : aVal - bVal;
    });
  }, [data, sortKey, sortDir]);

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir(sortDir === "desc" ? "asc" : "desc");
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  function SortHeader({ label, field }: { label: string; field: SortKey }) {
    const isActive = sortKey === field;
    return (
      <th
        className="cursor-pointer px-3 py-2 text-right text-xs font-medium text-zinc-500 hover:text-zinc-700"
        onClick={() => handleSort(field)}
      >
        <span className="inline-flex items-center gap-1">
          {label}
          {isActive && (
            <span className="text-zinc-400">{sortDir === "desc" ? "↓" : "↑"}</span>
          )}
        </span>
      </th>
    );
  }

  if (data.length === 0) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white p-6">
        <p className="text-center text-sm text-zinc-500">No data available</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead className="border-b border-zinc-100 bg-zinc-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-zinc-500">
                {entityLabel}
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-zinc-500">
                Channel
              </th>
              <SortHeader label="Spend" field="spend" />
              <SortHeader label="Revenue" field="revenue" />
              <SortHeader label="ROAS" field="roas" />
              <SortHeader label="CPA" field="cpa" />
              <SortHeader label="Conv." field="conversions" />
              <SortHeader label="Clicks" field="clicks" />
              <SortHeader label="Impr." field="impressions" />
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {sorted.map((row) => (
              <tr key={row.entityId} className="hover:bg-zinc-50">
                <td className="max-w-[200px] truncate px-4 py-3 text-sm font-medium text-zinc-900">
                  {row.entityName}
                </td>
                <td className="px-3 py-3">
                  {row.platformCode && (
                    <span className="inline-flex rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600">
                      {PLATFORM_LABELS[row.platformCode] ?? row.platformCode}
                    </span>
                  )}
                </td>
                <td className="px-3 py-3 text-right text-sm text-zinc-700">
                  {formatCurrency(row.spend)}
                </td>
                <td className="px-3 py-3 text-right text-sm text-zinc-700">
                  {formatCurrency(row.revenue)}
                </td>
                <td className="px-3 py-3 text-right text-sm">
                  {row.roas !== null ? (
                    <span className={row.roas >= 1 ? "text-green-600" : "text-red-600"}>
                      {row.roas.toFixed(2)}x
                    </span>
                  ) : (
                    <span className="text-zinc-400">—</span>
                  )}
                </td>
                <td className="px-3 py-3 text-right text-sm text-zinc-700">
                  {row.cpa !== null ? formatCurrency(row.cpa) : "—"}
                </td>
                <td className="px-3 py-3 text-right text-sm text-zinc-700">
                  {formatNumber(row.conversions)}
                </td>
                <td className="px-3 py-3 text-right text-sm text-zinc-700">
                  {formatNumber(row.clicks)}
                </td>
                <td className="px-3 py-3 text-right text-sm text-zinc-700">
                  {formatNumber(row.impressions)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
