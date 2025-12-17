"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { CampaignPerformanceRow, SortField, SortDirection } from "@/lib/campaigns";

interface Column {
  key: SortField | "actions";
  label: string;
  sortable: boolean;
  align?: "left" | "right" | "center";
  format?: (value: unknown, row: CampaignPerformanceRow) => React.ReactNode;
}

const columns: Column[] = [
  {
    key: "name",
    label: "Campaign",
    sortable: true,
    align: "left",
    format: (_, row) => (
      <div>
        <Link
          href={`/app/campaigns/${row.id}`}
          className="font-medium text-zinc-900 hover:text-zinc-700 hover:underline"
        >
          {row.name}
        </Link>
        <div className="text-xs text-zinc-500">{row.externalId}</div>
      </div>
    ),
  },
  {
    key: "platform",
    label: "Platform",
    sortable: true,
    align: "left",
    format: (_, row) => (
      <span className="inline-flex items-center gap-1.5">
        <PlatformIcon code={row.platformCode} />
        <span>{row.platformName}</span>
      </span>
    ),
  },
  {
    key: "spend",
    label: "Spend",
    sortable: true,
    align: "right",
    format: (value) => formatCurrency(value as number),
  },
  {
    key: "conversions",
    label: "Conv.",
    sortable: true,
    align: "right",
    format: (value) => formatNumber(value as number),
  },
  {
    key: "cpa",
    label: "CPA",
    sortable: true,
    align: "right",
    format: (value) => (value != null ? formatCurrency(value as number) : "—"),
  },
  {
    key: "roas",
    label: "ROAS",
    sortable: true,
    align: "right",
    format: (value) => (value != null ? `${(value as number).toFixed(2)}x` : "—"),
  },
  {
    key: "impressions",
    label: "Impr.",
    sortable: true,
    align: "right",
    format: (value) => formatNumber(value as number),
  },
  {
    key: "clicks",
    label: "Clicks",
    sortable: true,
    align: "right",
    format: (value) => formatNumber(value as number),
  },
  {
    key: "ctr",
    label: "CTR",
    sortable: true,
    align: "right",
    format: (value) => (value != null ? `${(value as number).toFixed(2)}%` : "—"),
  },
  {
    key: "actions",
    label: "",
    sortable: false,
    align: "center",
    format: (_, row) => (
      <Link
        href={`/app/campaigns/${row.id}`}
        className="text-zinc-500 hover:text-zinc-700"
        title="View details"
      >
        <ChevronRightIcon />
      </Link>
    ),
  },
];

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

function getWasteClass(level: string): string {
  switch (level) {
    case "critical":
      return "bg-red-50 border-l-4 border-l-red-500";
    case "high":
      return "bg-orange-50 border-l-4 border-l-orange-500";
    case "medium":
      return "bg-yellow-50 border-l-4 border-l-yellow-500";
    case "low":
      return "bg-amber-50 border-l-4 border-l-amber-400";
    default:
      return "";
  }
}

interface DataTableProps {
  data: CampaignPerformanceRow[];
  initialSort?: { field: SortField; direction: SortDirection };
  onSortChange?: (sort: { field: SortField; direction: SortDirection }) => void;
}

export function CampaignDataTable({
  data,
  initialSort = { field: "spend", direction: "desc" },
  onSortChange,
}: DataTableProps) {
  const [sort, setSort] = useState(initialSort);

  const sortedData = useMemo(() => {
    if (!onSortChange) {
      return [...data].sort((a, b) => {
        const aVal = a[sort.field as keyof CampaignPerformanceRow];
        const bVal = b[sort.field as keyof CampaignPerformanceRow];

        if (aVal === null || aVal === undefined) return 1;
        if (bVal === null || bVal === undefined) return -1;

        if (typeof aVal === "string" && typeof bVal === "string") {
          return sort.direction === "asc"
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal);
        }

        if (typeof aVal === "number" && typeof bVal === "number") {
          return sort.direction === "asc" ? aVal - bVal : bVal - aVal;
        }

        return 0;
      });
    }
    return data;
  }, [data, sort, onSortChange]);

  const handleSort = (field: SortField) => {
    const newSort = {
      field,
      direction:
        sort.field === field && sort.direction === "asc" ? "desc" : "asc",
    } as { field: SortField; direction: SortDirection };

    setSort(newSort);
    onSortChange?.(newSort);
  };

  if (data.length === 0) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white p-12 text-center">
        <p className="text-sm text-zinc-500">No campaigns found</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-3 font-medium text-zinc-600 ${
                    col.align === "right"
                      ? "text-right"
                      : col.align === "center"
                      ? "text-center"
                      : "text-left"
                  } ${col.sortable ? "cursor-pointer select-none hover:bg-zinc-100" : ""}`}
                  onClick={() => col.sortable && col.key !== "actions" && handleSort(col.key as SortField)}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.label}
                    {col.sortable && col.key !== "actions" && (
                      <SortIcon
                        active={sort.field === col.key}
                        direction={sort.field === col.key ? sort.direction : undefined}
                      />
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedData.map((row) => (
              <tr
                key={row.id}
                className={`border-b border-zinc-100 transition-colors hover:bg-zinc-50 ${getWasteClass(row.wasteLevel)}`}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`px-4 py-3 ${
                      col.align === "right"
                        ? "text-right"
                        : col.align === "center"
                        ? "text-center"
                        : "text-left"
                    }`}
                  >
                    {col.format
                      ? col.format(row[col.key as keyof CampaignPerformanceRow], row)
                      : String(row[col.key as keyof CampaignPerformanceRow] ?? "")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SortIcon({
  active,
  direction,
}: {
  active: boolean;
  direction?: SortDirection;
}) {
  return (
    <svg
      className={`h-4 w-4 ${active ? "text-zinc-900" : "text-zinc-400"}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      {direction === "asc" ? (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      ) : direction === "desc" ? (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      ) : (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
      )}
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );
}

function PlatformIcon({ code }: { code: string }) {
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
      className={`inline-flex h-5 w-5 items-center justify-center rounded text-xs font-bold text-white ${
        colors[code] ?? "bg-zinc-500"
      }`}
    >
      {labels[code] ?? "?"}
    </span>
  );
}
