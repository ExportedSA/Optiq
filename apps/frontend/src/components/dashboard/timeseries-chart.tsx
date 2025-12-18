"use client";

import { useMemo } from "react";

export interface TimeseriesPoint {
  date: string;
  spend: number;
  revenue: number;
  conversions: number;
  roas: number | null;
  cpa: number | null;
}

interface TimeseriesChartProps {
  data: TimeseriesPoint[];
  metric: "spend" | "revenue" | "conversions" | "roas" | "cpa";
  height?: number;
  showGrid?: boolean;
}

const METRIC_CONFIG = {
  spend: { label: "Spend", color: "#3b82f6", format: (v: number) => `$${v.toLocaleString(undefined, { maximumFractionDigits: 0 })}` },
  revenue: { label: "Revenue", color: "#10b981", format: (v: number) => `$${v.toLocaleString(undefined, { maximumFractionDigits: 0 })}` },
  conversions: { label: "Conversions", color: "#8b5cf6", format: (v: number) => v.toLocaleString(undefined, { maximumFractionDigits: 0 }) },
  roas: { label: "ROAS", color: "#f59e0b", format: (v: number) => `${v.toFixed(2)}x` },
  cpa: { label: "CPA", color: "#ef4444", format: (v: number) => `$${v.toFixed(2)}` },
};

export function TimeseriesChart({
  data,
  metric,
  height = 200,
  showGrid = true,
}: TimeseriesChartProps) {
  const config = METRIC_CONFIG[metric];

  const { points, minY, maxY, yTicks } = useMemo(() => {
    if (data.length === 0) {
      return { points: [], minY: 0, maxY: 100, yTicks: [0, 50, 100] };
    }

    const values = data.map((d) => d[metric] ?? 0);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;
    const padding = range * 0.1;

    const minY = Math.max(0, min - padding);
    const maxY = max + padding;

    const tickCount = 5;
    const tickStep = (maxY - minY) / (tickCount - 1);
    const yTicks = Array.from({ length: tickCount }, (_, i) => minY + i * tickStep);

    const width = 100;
    const pts = data.map((d, i) => {
      const x = data.length === 1 ? 50 : (i / (data.length - 1)) * width;
      const y = maxY === minY ? 50 : 100 - ((((d[metric] ?? 0) - minY) / (maxY - minY)) * 100);
      return { x, y, value: d[metric] ?? 0, date: d.date };
    });

    return { points: pts, minY, maxY, yTicks };
  }, [data, metric]);

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50" style={{ height }}>
        <span className="text-sm text-zinc-500">No data available</span>
      </div>
    );
  }

  const pathD = points.length > 0
    ? `M ${points.map((p) => `${p.x},${p.y}`).join(" L ")}`
    : "";

  const areaD = points.length > 0
    ? `M ${points[0].x},100 L ${points.map((p) => `${p.x},${p.y}`).join(" L ")} L ${points[points.length - 1].x},100 Z`
    : "";

  return (
    <div className="relative" style={{ height }}>
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="h-full w-full"
      >
        {showGrid && (
          <g className="text-zinc-200">
            {yTicks.map((_, i) => (
              <line
                key={i}
                x1="0"
                y1={100 - (i / (yTicks.length - 1)) * 100}
                x2="100"
                y2={100 - (i / (yTicks.length - 1)) * 100}
                stroke="currentColor"
                strokeWidth="0.2"
              />
            ))}
          </g>
        )}

        <defs>
          <linearGradient id={`gradient-${metric}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={config.color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={config.color} stopOpacity="0" />
          </linearGradient>
        </defs>

        <path
          d={areaD}
          fill={`url(#gradient-${metric})`}
        />

        <path
          d={pathD}
          fill="none"
          stroke={config.color}
          strokeWidth="0.5"
          vectorEffect="non-scaling-stroke"
        />

        {points.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="0.8"
            fill={config.color}
            className="opacity-0 hover:opacity-100 transition-opacity"
          />
        ))}
      </svg>

      <div className="absolute left-0 top-0 flex h-full flex-col justify-between py-1 text-[10px] text-zinc-500">
        {yTicks.slice().reverse().map((tick, i) => (
          <span key={i}>{config.format(tick)}</span>
        ))}
      </div>

      <div className="absolute bottom-0 left-8 right-0 flex justify-between text-[10px] text-zinc-500">
        {data.length > 0 && (
          <>
            <span>{data[0].date}</span>
            {data.length > 1 && <span>{data[data.length - 1].date}</span>}
          </>
        )}
      </div>
    </div>
  );
}

export function TimeseriesChartCard({
  title,
  data,
  metric,
  currentValue,
  change,
}: {
  title: string;
  data: TimeseriesPoint[];
  metric: "spend" | "revenue" | "conversions" | "roas" | "cpa";
  currentValue: string;
  change?: number | null;
}) {
  const config = METRIC_CONFIG[metric];

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-zinc-600">{title}</h3>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-semibold text-zinc-900">{currentValue}</span>
            {change !== undefined && change !== null && (
              <span className={`text-sm ${change >= 0 ? "text-green-600" : "text-red-600"}`}>
                {change >= 0 ? "+" : ""}{change.toFixed(1)}%
              </span>
            )}
          </div>
        </div>
        <div
          className="h-3 w-3 rounded-full"
          style={{ backgroundColor: config.color }}
        />
      </div>
      <TimeseriesChart data={data} metric={metric} height={120} />
    </div>
  );
}
