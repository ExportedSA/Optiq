"use client";

import { useState, useEffect } from "react";
import { format, subDays, startOfDay, endOfDay } from "date-fns";

/**
 * Comparison Mode Component
 * 
 * Side-by-side comparison of two date ranges
 * Features:
 * - Compare current vs previous period
 * - Compare custom date ranges
 * - Visual diff indicators
 * - Percentage change calculations
 */

interface ComparisonModeProps {
  attributionModel: string;
  platform: string | null;
}

interface PeriodData {
  spend: number;
  conversions: number;
  revenue: number;
  roas: number;
  cpa: number;
  impressions: number;
  clicks: number;
  ctr: number;
}

interface ComparisonData {
  periodA: PeriodData;
  periodB: PeriodData;
  changes: Record<keyof PeriodData, { value: number; percentage: number }>;
}

export function ComparisonMode({ attributionModel, platform }: ComparisonModeProps) {
  const [periodA, setPeriodA] = useState({
    from: startOfDay(subDays(new Date(), 30)),
    to: endOfDay(subDays(new Date(), 1)),
    label: "Last 30 Days",
  });
  
  const [periodB, setPeriodB] = useState({
    from: startOfDay(subDays(new Date(), 60)),
    to: endOfDay(subDays(new Date(), 31)),
    label: "Previous 30 Days",
  });

  const [data, setData] = useState<ComparisonData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComparisonData();
  }, [periodA, periodB, attributionModel, platform]);

  const fetchComparisonData = async () => {
    setLoading(true);
    try {
      const [responseA, responseB] = await Promise.all([
        fetch(`/api/dashboard/kpis?${new URLSearchParams({
          fromDate: periodA.from.toISOString(),
          toDate: periodA.to.toISOString(),
          attributionModel,
          ...(platform ? { platform } : {}),
        })}`),
        fetch(`/api/dashboard/kpis?${new URLSearchParams({
          fromDate: periodB.from.toISOString(),
          toDate: periodB.to.toISOString(),
          attributionModel,
          ...(platform ? { platform } : {}),
        })}`),
      ]);

      if (responseA.ok && responseB.ok) {
        const dataA = await responseA.json();
        const dataB = await responseB.json();

        const periodAData: PeriodData = {
          spend: dataA.totalSpend / 1_000_000,
          conversions: dataA.totalConversions,
          revenue: (dataA.totalSpend * dataA.avgRoas) / 1_000_000,
          roas: dataA.avgRoas,
          cpa: dataA.avgCpa,
          impressions: dataA.totalImpressions || 0,
          clicks: dataA.totalClicks || 0,
          ctr: dataA.avgCtr || 0,
        };

        const periodBData: PeriodData = {
          spend: dataB.totalSpend / 1_000_000,
          conversions: dataB.totalConversions,
          revenue: (dataB.totalSpend * dataB.avgRoas) / 1_000_000,
          roas: dataB.avgRoas,
          cpa: dataB.avgCpa,
          impressions: dataB.totalImpressions || 0,
          clicks: dataB.totalClicks || 0,
          ctr: dataB.avgCtr || 0,
        };

        const changes = Object.keys(periodAData).reduce((acc, key) => {
          const k = key as keyof PeriodData;
          const valueA = periodAData[k];
          const valueB = periodBData[k];
          const diff = valueA - valueB;
          const percentage = valueB !== 0 ? (diff / valueB) * 100 : 0;
          
          acc[k] = { value: diff, percentage };
          return acc;
        }, {} as Record<keyof PeriodData, { value: number; percentage: number }>);

        setData({
          periodA: periodAData,
          periodB: periodBData,
          changes,
        });
      }
    } catch (error) {
      console.error("Failed to fetch comparison data:", error);
    } finally {
      setLoading(false);
    }
  };

  const quickPresets = [
    {
      label: "Last 7 vs Previous 7",
      periodA: { from: startOfDay(subDays(new Date(), 7)), to: endOfDay(new Date()), label: "Last 7 Days" },
      periodB: { from: startOfDay(subDays(new Date(), 14)), to: endOfDay(subDays(new Date(), 8)), label: "Previous 7 Days" },
    },
    {
      label: "Last 30 vs Previous 30",
      periodA: { from: startOfDay(subDays(new Date(), 30)), to: endOfDay(new Date()), label: "Last 30 Days" },
      periodB: { from: startOfDay(subDays(new Date(), 60)), to: endOfDay(subDays(new Date(), 31)), label: "Previous 30 Days" },
    },
    {
      label: "This Month vs Last Month",
      periodA: { from: startOfDay(new Date(new Date().getFullYear(), new Date().getMonth(), 1)), to: endOfDay(new Date()), label: "This Month" },
      periodB: { from: startOfDay(new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1)), to: endOfDay(new Date(new Date().getFullYear(), new Date().getMonth(), 0)), label: "Last Month" },
    },
  ];

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-48 mb-6"></div>
          <div className="grid grid-cols-2 gap-6">
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const metrics: Array<{ key: keyof PeriodData; label: string; format: (v: number) => string; invertChange?: boolean }> = [
    { key: "spend", label: "Spend", format: (v) => `$${v.toFixed(2)}`, invertChange: true },
    { key: "conversions", label: "Conversions", format: (v) => v.toFixed(1) },
    { key: "revenue", label: "Revenue", format: (v) => `$${v.toFixed(2)}` },
    { key: "roas", label: "ROAS", format: (v) => `${v.toFixed(2)}x` },
    { key: "cpa", label: "CPA", format: (v) => `$${v.toFixed(2)}`, invertChange: true },
    { key: "impressions", label: "Impressions", format: (v) => v.toLocaleString() },
    { key: "clicks", label: "Clicks", format: (v) => v.toLocaleString() },
    { key: "ctr", label: "CTR", format: (v) => `${v.toFixed(2)}%` },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Period Comparison</h3>
          <p className="text-sm text-gray-600 mt-1">Compare performance across different time periods</p>
        </div>
        
        {/* Quick Presets */}
        <div className="flex gap-2">
          {quickPresets.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => {
                setPeriodA(preset.periodA);
                setPeriodB(preset.periodB);
              }}
              className="px-3 py-1.5 text-sm rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Period Labels */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-100 text-blue-900 font-semibold">
            <span className="mr-2">📅</span>
            {periodA.label}
          </div>
          <p className="text-xs text-gray-600 mt-2">
            {format(periodA.from, "MMM dd, yyyy")} - {format(periodA.to, "MMM dd, yyyy")}
          </p>
        </div>
        <div className="text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-lg bg-purple-100 text-purple-900 font-semibold">
            <span className="mr-2">📅</span>
            {periodB.label}
          </div>
          <p className="text-xs text-gray-600 mt-2">
            {format(periodB.from, "MMM dd, yyyy")} - {format(periodB.to, "MMM dd, yyyy")}
          </p>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Metric</th>
              <th className="text-right py-3 px-4 font-semibold text-blue-900">{periodA.label}</th>
              <th className="text-right py-3 px-4 font-semibold text-purple-900">{periodB.label}</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-900">Change</th>
            </tr>
          </thead>
          <tbody>
            {metrics.map((metric) => {
              const change = data.changes[metric.key];
              const isPositive = change.percentage > 0;
              const isGood = metric.invertChange ? !isPositive : isPositive;
              
              return (
                <tr key={metric.key} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 font-medium text-gray-900">{metric.label}</td>
                  <td className="py-3 px-4 text-right text-blue-900 font-semibold">
                    {metric.format(data.periodA[metric.key])}
                  </td>
                  <td className="py-3 px-4 text-right text-purple-900 font-semibold">
                    {metric.format(data.periodB[metric.key])}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-sm font-semibold ${
                      Math.abs(change.percentage) < 0.1 
                        ? "bg-gray-100 text-gray-700"
                        : isGood 
                          ? "bg-green-100 text-green-700" 
                          : "bg-red-100 text-red-700"
                    }`}>
                      {Math.abs(change.percentage) < 0.1 ? (
                        <span>→</span>
                      ) : isPositive ? (
                        <span>↑</span>
                      ) : (
                        <span>↓</span>
                      )}
                      <span>{Math.abs(change.percentage).toFixed(1)}%</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Summary Insights */}
      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
        <h4 className="font-semibold text-gray-900 mb-2">📊 Key Insights</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          {data.changes.roas.percentage > 5 && (
            <div className="flex items-center gap-2 text-green-700">
              <span>✓</span>
              <span>ROAS improved by {data.changes.roas.percentage.toFixed(1)}%</span>
            </div>
          )}
          {data.changes.cpa.percentage < -5 && (
            <div className="flex items-center gap-2 text-green-700">
              <span>✓</span>
              <span>CPA decreased by {Math.abs(data.changes.cpa.percentage).toFixed(1)}%</span>
            </div>
          )}
          {data.changes.conversions.percentage > 10 && (
            <div className="flex items-center gap-2 text-green-700">
              <span>✓</span>
              <span>Conversions up {data.changes.conversions.percentage.toFixed(1)}%</span>
            </div>
          )}
          {data.changes.spend.percentage > 20 && (
            <div className="flex items-center gap-2 text-orange-700">
              <span>⚠</span>
              <span>Spend increased significantly ({data.changes.spend.percentage.toFixed(1)}%)</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
