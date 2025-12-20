"use client";

import { useState, useEffect } from "react";

interface CampaignTableProps {
  dateRange: { from: Date; to: Date };
  platform: string | null;
  attributionModel: string;
}

interface CampaignRow {
  id: string;
  grain: string;
  name: string;
  platformName: string;
  spend: number;
  conversions: number;
  cpa: number | null;
  roas: number | null;
  waste: number;
  wastePct: number;
}

export function CampaignTable({ dateRange, platform, attributionModel }: CampaignTableProps) {
  const [data, setData] = useState<CampaignRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [grain, setGrain] = useState<"CAMPAIGN" | "ADSET" | "AD">("CAMPAIGN");
  const [sortBy, setSortBy] = useState<"spend" | "waste" | "cpa" | "roas">("waste");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    fetchTableData();
  }, [dateRange, platform, attributionModel, grain]);

  const fetchTableData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        fromDate: dateRange.from.toISOString(),
        toDate: dateRange.to.toISOString(),
        attributionModel,
        grain,
        ...(platform ? { platform } : {}),
      });

      const response = await fetch(`/api/dashboard/campaigns?${params}`);
      if (response.ok) {
        const result = await response.json();
        setData(result.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch campaign data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (column: typeof sortBy) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("desc");
    }
  };

  const sortedData = [...data].sort((a, b) => {
    let aVal = 0, bVal = 0;
    
    switch (sortBy) {
      case "spend":
        aVal = a.spend;
        bVal = b.spend;
        break;
      case "waste":
        aVal = a.waste;
        bVal = b.waste;
        break;
      case "cpa":
        aVal = a.cpa || Infinity;
        bVal = b.cpa || Infinity;
        break;
      case "roas":
        aVal = a.roas || 0;
        bVal = b.roas || 0;
        break;
    }

    return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
  });

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Performance by {grain}</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setGrain("CAMPAIGN")}
              className={`px-3 py-1 text-sm rounded-lg ${
                grain === "CAMPAIGN"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Campaign
            </button>
            <button
              onClick={() => setGrain("ADSET")}
              className={`px-3 py-1 text-sm rounded-lg ${
                grain === "ADSET"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Ad Set
            </button>
            <button
              onClick={() => setGrain("AD")}
              className={`px-3 py-1 text-sm rounded-lg ${
                grain === "AD"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Ad
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Platform
              </th>
              <th
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                onClick={() => handleSort("spend")}
              >
                Spend {sortBy === "spend" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Conversions
              </th>
              <th
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                onClick={() => handleSort("cpa")}
              >
                CPA {sortBy === "cpa" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                onClick={() => handleSort("roas")}
              >
                ROAS {sortBy === "roas" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                onClick={() => handleSort("waste")}
              >
                Waste {sortBy === "waste" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedData.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                  No data available for the selected period
                </td>
              </tr>
            ) : (
              sortedData.map((row) => {
                const wasteLevel = row.wastePct > 75 ? "high" : row.wastePct > 50 ? "medium" : row.wastePct > 25 ? "low" : "none";
                
                return (
                  <tr
                    key={row.id}
                    className={`hover:bg-gray-50 ${
                      wasteLevel === "high" ? "bg-red-50" :
                      wasteLevel === "medium" ? "bg-orange-50" :
                      wasteLevel === "low" ? "bg-yellow-50" :
                      ""
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{row.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{row.platformName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="text-sm text-gray-900">
                        ${(row.spend / 1_000_000).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="text-sm text-gray-900">
                        {row.conversions.toLocaleString(undefined, { maximumFractionDigits: 1 })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="text-sm text-gray-900">
                        {row.cpa ? `$${row.cpa.toFixed(2)}` : "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="text-sm text-gray-900">
                        {row.roas ? `${row.roas.toFixed(2)}x` : "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="text-sm font-medium text-gray-900">
                          ${(row.waste / 1_000_000).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                        {wasteLevel !== "none" && (
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                              wasteLevel === "high" ? "bg-red-100 text-red-800" :
                              wasteLevel === "medium" ? "bg-orange-100 text-orange-800" :
                              "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {row.wastePct.toFixed(0)}%
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
