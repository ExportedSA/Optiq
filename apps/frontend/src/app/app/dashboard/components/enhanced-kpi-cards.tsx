"use client";

import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";

interface EnhancedKPICardsProps {
  dateRange: { from: Date; to: Date };
  platform: string | null;
  attributionModel: string;
}

interface KPIData {
  totalSpend: number;
  totalConversions: number;
  avgCpa: number;
  avgRoas: number;
  totalWaste: number;
  wastePct: number;
  // Comparison data (previous period)
  prevSpend?: number;
  prevConversions?: number;
  prevCpa?: number;
  prevRoas?: number;
}

export function EnhancedKPICards({ dateRange, platform, attributionModel }: EnhancedKPICardsProps) {
  const [data, setData] = useState<KPIData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    fetchKPIs();
    
    // Auto-refresh every 30 seconds if enabled
    if (autoRefresh) {
      const interval = setInterval(() => {
        fetchKPIs();
      }, 30000);
      
      return () => clearInterval(interval);
    }
  }, [dateRange, platform, attributionModel, autoRefresh]);

  const fetchKPIs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        fromDate: dateRange.from.toISOString(),
        toDate: dateRange.to.toISOString(),
        attributionModel,
        comparePrevious: "true",
        ...(platform ? { platform } : {}),
      });

      const response = await fetch(`/api/dashboard/kpis?${params}`);
      if (response.ok) {
        const result = await response.json();
        setData(result);
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error("Failed to fetch KPIs:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateChange = (current: number, previous?: number): { value: number; isPositive: boolean } | null => {
    if (!previous || previous === 0) return null;
    const change = ((current - previous) / previous) * 100;
    return { value: Math.abs(change), isPositive: change >= 0 };
  };

  if (loading && !data) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-24"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const spendChange = calculateChange(data.totalSpend, data.prevSpend);
  const conversionChange = calculateChange(data.totalConversions, data.prevConversions);
  const cpaChange = calculateChange(data.avgCpa, data.prevCpa);
  const roasChange = calculateChange(data.avgRoas, data.prevRoas);

  const cards = [
    {
      label: "Total Spend",
      value: `$${(data.totalSpend / 1_000_000).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: spendChange,
      icon: "💰",
      color: "blue",
      invertChange: true, // Lower spend is better
    },
    {
      label: "Conversions",
      value: data.totalConversions.toLocaleString(undefined, { maximumFractionDigits: 1 }),
      change: conversionChange,
      icon: "🎯",
      color: "green",
      invertChange: false,
    },
    {
      label: "Avg CPA",
      value: data.avgCpa ? `$${data.avgCpa.toFixed(2)}` : "N/A",
      change: cpaChange,
      icon: "📊",
      color: "purple",
      invertChange: true, // Lower CPA is better
    },
    {
      label: "Avg ROAS",
      value: data.avgRoas ? `${data.avgRoas.toFixed(2)}x` : "N/A",
      change: roasChange,
      icon: "📈",
      color: "orange",
      invertChange: false,
    },
    {
      label: "Waste Spend",
      value: `$${(data.totalWaste / 1_000_000).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      subValue: `${data.wastePct.toFixed(1)}% of spend`,
      icon: "⚠️",
      color: "red",
      invertChange: true,
    },
  ];

  const colorClasses = {
    blue: "from-blue-50 to-blue-100 text-blue-900 border-blue-200",
    green: "from-green-50 to-green-100 text-green-900 border-green-200",
    purple: "from-purple-50 to-purple-100 text-purple-900 border-purple-200",
    orange: "from-orange-50 to-orange-100 text-orange-900 border-orange-200",
    red: "from-red-50 to-red-100 text-red-900 border-red-200",
  };

  return (
    <div className="space-y-4">
      {/* Header with last updated and refresh controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          <span>Last updated {formatDistanceToNow(lastUpdated, { addSuffix: true })}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-3 py-1 text-sm rounded-lg transition-colors ${
              autoRefresh
                ? "bg-green-100 text-green-700 hover:bg-green-200"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {autoRefresh ? "🔄 Auto-refresh ON" : "⏸️ Auto-refresh OFF"}
          </button>
          <button
            onClick={fetchKPIs}
            disabled={loading}
            className="px-3 py-1 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? "Refreshing..." : "↻ Refresh Now"}
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {cards.map((card, index) => {
          const change = card.change;
          const isGood = change ? (card.invertChange ? !change.isPositive : change.isPositive) : null;
          
          return (
            <div
              key={index}
              className={`bg-gradient-to-br ${colorClasses[card.color as keyof typeof colorClasses]} rounded-lg shadow-md border-2 p-6 transition-all hover:shadow-lg hover:scale-105`}
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium opacity-80">{card.label}</p>
                <span className="text-2xl">{card.icon}</span>
              </div>
              <p className="text-3xl font-bold mb-1">{card.value}</p>
              
              {/* Trend indicator */}
              {change && (
                <div className={`flex items-center gap-1 text-sm font-medium ${
                  isGood ? "text-green-700" : "text-red-700"
                }`}>
                  <span>{isGood ? "↑" : "↓"}</span>
                  <span>{change.value.toFixed(1)}%</span>
                  <span className="text-xs opacity-70">vs prev period</span>
                </div>
              )}
              
              {card.subValue && (
                <p className="text-xs opacity-70 mt-1">{card.subValue}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
