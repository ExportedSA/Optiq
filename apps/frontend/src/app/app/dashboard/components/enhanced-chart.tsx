"use client";

import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";
import { format } from "date-fns";

interface EnhancedChartProps {
  dateRange: { from: Date; to: Date };
  platform: string | null;
  attributionModel: string;
}

interface ChartDataPoint {
  date: string;
  spend: number;
  conversions: number;
  revenue: number;
  roas: number;
  cpa: number;
  waste: number;
}

type ChartType = "line" | "area" | "bar";
type MetricType = "spend" | "conversions" | "revenue" | "roas" | "cpa" | "waste";

export function EnhancedChart({ dateRange, platform, attributionModel }: EnhancedChartProps) {
  const [data, setData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState<ChartType>("area");
  const [selectedMetrics, setSelectedMetrics] = useState<MetricType[]>(["spend", "conversions"]);
  const [showComparison, setShowComparison] = useState(false);

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

  const toggleMetric = (metric: MetricType) => {
    setSelectedMetrics(prev => 
      prev.includes(metric) 
        ? prev.filter(m => m !== metric)
        : [...prev, metric]
    );
  };

  const exportData = () => {
    const csv = [
      ["Date", ...selectedMetrics.map(m => m.charAt(0).toUpperCase() + m.slice(1))].join(","),
      ...data.map(d => [
        format(new Date(d.date), "yyyy-MM-dd"),
        ...selectedMetrics.map(m => {
          const value = d[m];
          return m === "spend" || m === "revenue" || m === "waste" 
            ? (value / 1_000_000).toFixed(2)
            : value.toFixed(2);
        })
      ].join(","))
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `optiq-metrics-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="h-80 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Over Time</h3>
        <div className="text-center py-12 text-gray-500">
          No data available for the selected period
        </div>
      </div>
    );
  }

  const metricConfig: Record<MetricType, { label: string; color: string; format: (v: number) => string }> = {
    spend: { 
      label: "Spend", 
      color: "#3b82f6",
      format: (v) => `$${(v / 1_000_000).toFixed(2)}`
    },
    conversions: { 
      label: "Conversions", 
      color: "#22c55e",
      format: (v) => v.toFixed(1)
    },
    revenue: { 
      label: "Revenue", 
      color: "#8b5cf6",
      format: (v) => `$${(v / 1_000_000).toFixed(2)}`
    },
    roas: { 
      label: "ROAS", 
      color: "#f59e0b",
      format: (v) => `${v.toFixed(2)}x`
    },
    cpa: { 
      label: "CPA", 
      color: "#ec4899",
      format: (v) => `$${v.toFixed(2)}`
    },
    waste: { 
      label: "Waste", 
      color: "#ef4444",
      format: (v) => `$${(v / 1_000_000).toFixed(2)}`
    },
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4">
          <p className="font-semibold text-gray-900 mb-2">
            {format(new Date(label), "MMM dd, yyyy")}
          </p>
          {payload.map((entry: any, index: number) => {
            const metric = entry.dataKey as MetricType;
            const config = metricConfig[metric];
            return (
              <div key={index} className="flex items-center justify-between gap-4 text-sm">
                <span className="flex items-center gap-2">
                  <span 
                    className="inline-block w-3 h-3 rounded-full" 
                    style={{ backgroundColor: entry.color }}
                  />
                  {config.label}:
                </span>
                <span className="font-semibold">{config.format(entry.value as number)}</span>
              </div>
            );
          })}
        </div>
      );
    }
    return null;
  };

  const ChartComponent = chartType === "line" ? LineChart : chartType === "area" ? AreaChart : BarChart;
  const DataComponent = chartType === "line" ? Line : chartType === "area" ? Area : Bar;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Performance Over Time</h3>
          <p className="text-sm text-gray-600 mt-1">Interactive metrics visualization</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {/* Chart Type Selector */}
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
            {(["line", "area", "bar"] as ChartType[]).map(type => (
              <button
                key={type}
                onClick={() => setChartType(type)}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  chartType === type
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>

          {/* Export Button */}
          <button
            onClick={exportData}
            className="px-3 py-1 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center gap-1"
          >
            <span>📥</span>
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Metric Toggles */}
      <div className="flex flex-wrap gap-2 mb-6">
        {(Object.keys(metricConfig) as MetricType[]).map(metric => {
          const config = metricConfig[metric];
          const isSelected = selectedMetrics.includes(metric);
          return (
            <button
              key={metric}
              onClick={() => toggleMetric(metric)}
              className={`px-3 py-1.5 text-sm rounded-lg border-2 transition-all ${
                isSelected
                  ? "border-current shadow-sm"
                  : "border-gray-200 text-gray-600 hover:border-gray-300"
              }`}
              style={isSelected ? { 
                borderColor: config.color,
                backgroundColor: `${config.color}15`,
                color: config.color
              } : {}}
            >
              <span className="inline-block w-2 h-2 rounded-full mr-2" style={{ backgroundColor: config.color }} />
              {config.label}
            </button>
          );
        })}
      </div>

      {/* Chart */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ChartComponent data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="date" 
              tickFormatter={(date) => format(new Date(date), "MMM dd")}
              stroke="#6b7280"
              style={{ fontSize: "12px" }}
            />
            <YAxis 
              stroke="#6b7280"
              style={{ fontSize: "12px" }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ fontSize: "14px" }}
              formatter={(value) => metricConfig[value as MetricType]?.label || value}
            />
            
            {selectedMetrics.map(metric => {
              const config = metricConfig[metric];
              const dataKey = metric;
              
              if (chartType === "line") {
                return (
                  <Line
                    key={metric}
                    type="monotone"
                    dataKey={dataKey}
                    stroke={config.color}
                    strokeWidth={2}
                    dot={{ fill: config.color, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                );
              } else if (chartType === "area") {
                return (
                  <Area
                    key={metric}
                    type="monotone"
                    dataKey={dataKey}
                    stroke={config.color}
                    fill={config.color}
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                );
              } else {
                return (
                  <Bar
                    key={metric}
                    dataKey={dataKey}
                    fill={config.color}
                    radius={[4, 4, 0, 0]}
                  />
                );
              }
            })}
          </ChartComponent>
        </ResponsiveContainer>
      </div>

      {/* Chart Stats Summary */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {selectedMetrics.map(metric => {
            const config = metricConfig[metric];
            const values = data.map(d => d[metric]);
            const total = values.reduce((sum, v) => sum + v, 0);
            const avg = total / values.length;
            const max = Math.max(...values);
            
            return (
              <div key={metric} className="text-center">
                <p className="text-xs text-gray-600 mb-1">{config.label} Avg</p>
                <p className="text-lg font-semibold" style={{ color: config.color }}>
                  {config.format(avg)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Max: {config.format(max)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
