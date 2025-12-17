"use client";

import { useMemo } from "react";
import type { TimeSeriesPoint, PlatformTimeSeries } from "@/lib/analytics";

interface SpendConversionChartProps {
  data: TimeSeriesPoint[];
  platformData?: PlatformTimeSeries[];
  showPlatformOverlay?: boolean;
  height?: number;
}

const PLATFORM_COLORS: Record<string, string> = {
  GOOGLE_ADS: "#4285F4",
  META: "#1877F2",
  TIKTOK: "#FF0050",
  LINKEDIN: "#0A66C2",
};

function formatCurrency(value: number): string {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`;
  return `$${value.toFixed(0)}`;
}

function formatNumber(value: number): string {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  return value.toFixed(0);
}

export function SpendConversionChart({
  data,
  platformData,
  showPlatformOverlay = false,
  height = 300,
}: SpendConversionChartProps) {
  const chartData = useMemo(() => {
    if (data.length === 0) return null;

    const maxSpend = Math.max(...data.map((d) => d.spend), 1);
    const maxConversions = Math.max(...data.map((d) => d.conversions), 1);

    const spendPadding = maxSpend * 0.1;
    const convPadding = maxConversions * 0.1;

    const normalizedSpend = data.map((d) => ({
      ...d,
      spendNorm: d.spend / (maxSpend + spendPadding),
      convNorm: d.conversions / (maxConversions + convPadding),
    }));

    return {
      points: normalizedSpend,
      maxSpend: maxSpend + spendPadding,
      maxConversions: maxConversions + convPadding,
    };
  }, [data]);

  const platformChartData = useMemo(() => {
    if (!platformData || !showPlatformOverlay) return null;

    const maxSpend = Math.max(
      ...platformData.flatMap((p) => p.data.map((d) => d.spend)),
      1
    );

    return platformData.map((platform) => ({
      ...platform,
      normalizedData: platform.data.map((d) => ({
        ...d,
        spendNorm: d.spend / (maxSpend * 1.1),
      })),
    }));
  }, [platformData, showPlatformOverlay]);

  if (!chartData || data.length === 0) {
    return (
      <div
        className="flex items-center justify-center rounded-xl border border-zinc-200 bg-white"
        style={{ height }}
      >
        <p className="text-sm text-zinc-500">No data available</p>
      </div>
    );
  }

  const chartWidth = 100;
  const chartHeight = 100;
  const padding = { top: 10, right: 10, bottom: 20, left: 10 };
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  const xStep = innerWidth / Math.max(chartData.points.length - 1, 1);

  const spendPath = chartData.points
    .map((p, i) => {
      const x = padding.left + i * xStep;
      const y = padding.top + innerHeight * (1 - p.spendNorm);
      return `${i === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");

  const convPath = chartData.points
    .map((p, i) => {
      const x = padding.left + i * xStep;
      const y = padding.top + innerHeight * (1 - p.convNorm);
      return `${i === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");

  const spendAreaPath =
    spendPath +
    ` L ${padding.left + (chartData.points.length - 1) * xStep} ${padding.top + innerHeight}` +
    ` L ${padding.left} ${padding.top + innerHeight} Z`;

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-blue-500" />
            <span className="text-xs text-zinc-600">Spend</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-green-500" />
            <span className="text-xs text-zinc-600">Conversions</span>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs text-zinc-500">
          <span>Max: {formatCurrency(chartData.maxSpend)}</span>
          <span>Max: {formatNumber(chartData.maxConversions)} conv</span>
        </div>
      </div>

      <svg
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        className="w-full"
        style={{ height }}
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="spendGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.05" />
          </linearGradient>
        </defs>

        {[0, 0.25, 0.5, 0.75, 1].map((tick) => (
          <line
            key={tick}
            x1={padding.left}
            y1={padding.top + innerHeight * tick}
            x2={padding.left + innerWidth}
            y2={padding.top + innerHeight * tick}
            stroke="#e4e4e7"
            strokeWidth="0.5"
          />
        ))}

        <path d={spendAreaPath} fill="url(#spendGradient)" />

        <path
          d={spendPath}
          fill="none"
          stroke="#3B82F6"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />

        <path
          d={convPath}
          fill="none"
          stroke="#22C55E"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />

        {showPlatformOverlay &&
          platformChartData?.map((platform) => {
            const platformPath = platform.normalizedData
              .map((p, i) => {
                const x = padding.left + i * xStep;
                const y = padding.top + innerHeight * (1 - p.spendNorm);
                return `${i === 0 ? "M" : "L"} ${x} ${y}`;
              })
              .join(" ");

            return (
              <path
                key={platform.platformCode}
                d={platformPath}
                fill="none"
                stroke={PLATFORM_COLORS[platform.platformCode] ?? "#6B7280"}
                strokeWidth="1.5"
                strokeDasharray="4 2"
                vectorEffect="non-scaling-stroke"
                opacity="0.7"
              />
            );
          })}

        {chartData.points.map((p, i) => {
          const x = padding.left + i * xStep;
          const ySpend = padding.top + innerHeight * (1 - p.spendNorm);
          const yConv = padding.top + innerHeight * (1 - p.convNorm);

          return (
            <g key={p.date}>
              <circle
                cx={x}
                cy={ySpend}
                r="1.5"
                fill="#3B82F6"
                className="hover:r-3 transition-all"
              />
              <circle
                cx={x}
                cy={yConv}
                r="1.5"
                fill="#22C55E"
                className="hover:r-3 transition-all"
              />
            </g>
          );
        })}

        {chartData.points.length <= 31 &&
          chartData.points
            .filter((_, i) => i % Math.ceil(chartData.points.length / 7) === 0)
            .map((p, i, arr) => {
              const originalIndex = chartData.points.findIndex(
                (pt) => pt.date === p.date
              );
              const x = padding.left + originalIndex * xStep;
              const label = new Date(p.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              });

              return (
                <text
                  key={p.date}
                  x={x}
                  y={chartHeight - 2}
                  textAnchor={
                    i === 0 ? "start" : i === arr.length - 1 ? "end" : "middle"
                  }
                  className="fill-zinc-500"
                  style={{ fontSize: "3px" }}
                >
                  {label}
                </text>
              );
            })}
      </svg>

      {showPlatformOverlay && platformData && platformData.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-zinc-100 pt-3">
          <span className="text-xs text-zinc-500">Platforms:</span>
          {platformData.map((platform) => (
            <div key={platform.platformCode} className="flex items-center gap-1.5">
              <span
                className="h-2 w-4 rounded-sm"
                style={{
                  backgroundColor:
                    PLATFORM_COLORS[platform.platformCode] ?? "#6B7280",
                }}
              />
              <span className="text-xs text-zinc-600">{platform.platformName}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
