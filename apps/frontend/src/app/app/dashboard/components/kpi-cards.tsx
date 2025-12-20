"use client";

import { useState, useEffect } from "react";

interface KPICardsProps {
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
}

export function KPICards({ dateRange, platform, attributionModel }: KPICardsProps) {
  const [data, setData] = useState<KPIData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchKPIs();
  }, [dateRange, platform, attributionModel]);

  const fetchKPIs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        fromDate: dateRange.from.toISOString(),
        toDate: dateRange.to.toISOString(),
        attributionModel,
        ...(platform ? { platform } : {}),
      });

      const response = await fetch(`/api/dashboard/kpis?${params}`);
      if (response.ok) {
        const result = await response.json();
        setData(result);
      }
    } catch (error) {
      console.error("Failed to fetch KPIs:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-24"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const cards = [
    {
      label: "Total Spend",
      value: `$${(data.totalSpend / 1_000_000).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: "💰",
      color: "blue",
    },
    {
      label: "Conversions",
      value: data.totalConversions.toLocaleString(undefined, { maximumFractionDigits: 1 }),
      icon: "🎯",
      color: "green",
    },
    {
      label: "Avg CPA",
      value: data.avgCpa ? `$${data.avgCpa.toFixed(2)}` : "N/A",
      icon: "📊",
      color: "purple",
    },
    {
      label: "Avg ROAS",
      value: data.avgRoas ? `${data.avgRoas.toFixed(2)}x` : "N/A",
      icon: "📈",
      color: "orange",
    },
    {
      label: "Waste Spend",
      value: `$${(data.totalWaste / 1_000_000).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      subValue: `${data.wastePct.toFixed(1)}% of spend`,
      icon: "⚠️",
      color: "red",
    },
  ];

  const colorClasses = {
    blue: "from-blue-50 to-blue-100 text-blue-900",
    green: "from-green-50 to-green-100 text-green-900",
    purple: "from-purple-50 to-purple-100 text-purple-900",
    orange: "from-orange-50 to-orange-100 text-orange-900",
    red: "from-red-50 to-red-100 text-red-900",
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`bg-gradient-to-br ${colorClasses[card.color as keyof typeof colorClasses]} rounded-lg shadow p-6`}
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium opacity-80">{card.label}</p>
            <span className="text-2xl">{card.icon}</span>
          </div>
          <p className="text-3xl font-bold">{card.value}</p>
          {card.subValue && (
            <p className="text-xs opacity-70 mt-1">{card.subValue}</p>
          )}
        </div>
      ))}
    </div>
  );
}
