"use client";

import { useState, useEffect } from "react";

interface TimeSeriesChartProps {
  dateRange: { from: Date; to: Date };
  platform: string | null;
  attributionModel: string;
}

interface ChartDataPoint {
  date: string;
  spend: number;
  conversions: number;
  waste: number;
}

export function TimeSeriesChart({ dateRange, platform, attributionModel }: TimeSeriesChartProps) {
  const [data, setData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [metric, setMetric] = useState<"spend" | "conversions" | "waste">("spend");

  useEffect(() => {
    fetchChartData();
  }, [dateRange, platform, attributionModel]);

  const fetchChartData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        fromDate: dateRange.from.toISOString(),
        toDate: dateRange.to.toISOString(),
        attributionModel,
        ...(platform ? { platform } : {}),
      });

      const response = await fetch(`/api/dashboard/time-series?${params}`);
      if (response.ok) {
        const result = await response.json();
        setData(result.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch chart data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Over Time</h3>
        <div className="text-center py-12 text-gray-500">
          No data available for the selected period
        </div>
      </div>
    );
  }

  // Calculate max value for scaling
  const maxValue = Math.max(...data.map(d => {
    if (metric === "spend") return d.spend / 1_000_000;
    if (metric === "conversions") return d.conversions;
    return d.waste / 1_000_000;
  }));

  const chartHeight = 256; // 16rem
  const chartWidth = 800;
  const padding = { top: 20, right: 20, bottom: 40, left: 60 };
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  // Create points for the line
  const points = data.map((d, i) => {
    const x = padding.left + (i / (data.length - 1)) * innerWidth;
    const value = metric === "spend" ? d.spend / 1_000_000 : 
                  metric === "conversions" ? d.conversions : 
                  d.waste / 1_000_000;
    const y = padding.top + innerHeight - (value / maxValue) * innerHeight;
    return { x, y, value, date: d.date };
  });

  const pathData = points.map((p, i) => 
    `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
  ).join(' ');

  // Create area fill
  const areaData = `M ${padding.left} ${padding.top + innerHeight} ` +
    points.map(p => `L ${p.x} ${p.y}`).join(' ') +
    ` L ${padding.left + innerWidth} ${padding.top + innerHeight} Z`;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Performance Over Time</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setMetric("spend")}
            className={`px-3 py-1 text-sm rounded-lg ${
              metric === "spend"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Spend
          </button>
          <button
            onClick={() => setMetric("conversions")}
            className={`px-3 py-1 text-sm rounded-lg ${
              metric === "conversions"
                ? "bg-green-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Conversions
          </button>
          <button
            onClick={() => setMetric("waste")}
            className={`px-3 py-1 text-sm rounded-lg ${
              metric === "waste"
                ? "bg-red-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Waste
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <svg width={chartWidth} height={chartHeight} className="w-full">
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const y = padding.top + innerHeight - ratio * innerHeight;
            return (
              <g key={ratio}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={padding.left + innerWidth}
                  y2={y}
                  stroke="#e5e7eb"
                  strokeWidth="1"
                />
                <text
                  x={padding.left - 10}
                  y={y + 4}
                  textAnchor="end"
                  fontSize="12"
                  fill="#6b7280"
                >
                  {metric === "conversions" 
                    ? (maxValue * ratio).toFixed(0)
                    : `$${(maxValue * ratio).toFixed(0)}`
                  }
                </text>
              </g>
            );
          })}

          {/* Area fill */}
          <path
            d={areaData}
            fill={
              metric === "spend" ? "rgba(59, 130, 246, 0.1)" :
              metric === "conversions" ? "rgba(34, 197, 94, 0.1)" :
              "rgba(239, 68, 68, 0.1)"
            }
          />

          {/* Line */}
          <path
            d={pathData}
            fill="none"
            stroke={
              metric === "spend" ? "#3b82f6" :
              metric === "conversions" ? "#22c55e" :
              "#ef4444"
            }
            strokeWidth="2"
          />

          {/* Points */}
          {points.map((point, i) => (
            <g key={i}>
              <circle
                cx={point.x}
                cy={point.y}
                r="4"
                fill={
                  metric === "spend" ? "#3b82f6" :
                  metric === "conversions" ? "#22c55e" :
                  "#ef4444"
                }
              />
              <title>
                {point.date}: {
                  metric === "conversions" 
                    ? point.value.toFixed(1)
                    : `$${point.value.toFixed(2)}`
                }
              </title>
            </g>
          ))}

          {/* X-axis labels */}
          {points.filter((_, i) => i % Math.ceil(points.length / 7) === 0).map((point, i) => (
            <text
              key={i}
              x={point.x}
              y={padding.top + innerHeight + 20}
              textAnchor="middle"
              fontSize="12"
              fill="#6b7280"
            >
              {new Date(point.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
}
