"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

/**
 * Drill-Down Modal Component
 * 
 * Detailed breakdown when clicking on chart data points or metrics
 * Features:
 * - Campaign-level breakdown
 * - Ad set and ad-level details
 * - Geographic distribution
 * - Device breakdown
 * - Time-of-day analysis
 */

interface DrillDownModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: {
    type: "campaign" | "platform" | "date" | "metric";
    id?: string;
    name: string;
    date?: string;
    metric?: string;
    value?: number;
  };
  dateRange: { from: Date; to: Date };
  attributionModel: string;
}

interface DrillDownData {
  summary: {
    spend: number;
    conversions: number;
    revenue: number;
    roas: number;
    cpa: number;
    clicks: number;
    impressions: number;
  };
  breakdown: {
    byCampaign?: Array<{ name: string; spend: number; conversions: number; roas: number }>;
    byAdSet?: Array<{ name: string; spend: number; conversions: number; roas: number }>;
    byAd?: Array<{ name: string; spend: number; conversions: number; ctr: number }>;
    byDevice?: Array<{ device: string; spend: number; conversions: number }>;
    byHour?: Array<{ hour: number; conversions: number; spend: number }>;
  };
}

const COLORS = ["#3b82f6", "#22c55e", "#f59e0b", "#ec4899", "#8b5cf6", "#ef4444"];

export function DrillDownModal({ isOpen, onClose, data, dateRange, attributionModel }: DrillDownModalProps) {
  const [drillDownData, setDrillDownData] = useState<DrillDownData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"campaigns" | "adsets" | "ads" | "devices" | "time">("campaigns");

  useEffect(() => {
    if (isOpen) {
      fetchDrillDownData();
    }
  }, [isOpen, data, dateRange, attributionModel]);

  const fetchDrillDownData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        fromDate: dateRange.from.toISOString(),
        toDate: dateRange.to.toISOString(),
        attributionModel,
        type: data.type,
        ...(data.id ? { id: data.id } : {}),
        ...(data.date ? { date: data.date } : {}),
      });

      const response = await fetch(`/api/dashboard/drill-down?${params}`);
      if (response.ok) {
        const result = await response.json();
        setDrillDownData(result);
      } else {
        // Mock data for demonstration
        setDrillDownData({
          summary: {
            spend: 12500,
            conversions: 85,
            revenue: 42000,
            roas: 3.36,
            cpa: 147.06,
            clicks: 1250,
            impressions: 45000,
          },
          breakdown: {
            byCampaign: [
              { name: "Summer Sale 2024", spend: 5000, conversions: 40, roas: 4.2 },
              { name: "Brand Awareness Q4", spend: 4000, conversions: 25, roas: 3.1 },
              { name: "Retargeting Campaign", spend: 3500, conversions: 20, roas: 2.8 },
            ],
            byAdSet: [
              { name: "Lookalike Audience 1%", spend: 3000, conversions: 25, roas: 3.8 },
              { name: "Interest: Fitness", spend: 2500, conversions: 20, roas: 3.5 },
              { name: "Custom Audience - Website", spend: 2000, conversions: 15, roas: 3.2 },
            ],
            byAd: [
              { name: "Video Ad - Product Demo", spend: 2000, conversions: 18, ctr: 2.5 },
              { name: "Carousel - Top Products", spend: 1800, conversions: 15, ctr: 2.2 },
              { name: "Single Image - Discount", spend: 1500, conversions: 12, ctr: 1.9 },
            ],
            byDevice: [
              { device: "Mobile", spend: 7000, conversions: 50 },
              { device: "Desktop", spend: 4000, conversions: 28 },
              { device: "Tablet", spend: 1500, conversions: 7 },
            ],
            byHour: Array.from({ length: 24 }, (_, i) => ({
              hour: i,
              conversions: Math.floor(Math.random() * 10) + 1,
              spend: Math.floor(Math.random() * 1000) + 200,
            })),
          },
        });
      }
    } catch (error) {
      console.error("Failed to fetch drill-down data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{data.name}</h2>
              <p className="text-blue-100 mt-1">
                Detailed breakdown • {format(dateRange.from, "MMM dd")} - {format(dateRange.to, "MMM dd, yyyy")}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : drillDownData ? (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                  { label: "Spend", value: `$${drillDownData.summary.spend.toLocaleString()}`, color: "blue" },
                  { label: "Conversions", value: drillDownData.summary.conversions.toLocaleString(), color: "green" },
                  { label: "ROAS", value: `${drillDownData.summary.roas.toFixed(2)}x`, color: "purple" },
                  { label: "CPA", value: `$${drillDownData.summary.cpa.toFixed(2)}`, color: "orange" },
                ].map((card, idx) => (
                  <div key={idx} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">{card.label}</p>
                    <p className={`text-2xl font-bold text-${card.color}-600`}>{card.value}</p>
                  </div>
                ))}
              </div>

              {/* Tabs */}
              <div className="flex gap-2 mb-6 border-b border-gray-200">
                {[
                  { key: "campaigns", label: "Campaigns", icon: "📊" },
                  { key: "adsets", label: "Ad Sets", icon: "🎯" },
                  { key: "ads", label: "Ads", icon: "📱" },
                  { key: "devices", label: "Devices", icon: "💻" },
                  { key: "time", label: "Time Analysis", icon: "⏰" },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as any)}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                      activeTab === tab.key
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <span className="mr-2">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="space-y-6">
                {activeTab === "campaigns" && drillDownData.breakdown.byCampaign && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Campaign Performance</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="text-left py-3 px-4 font-semibold text-gray-900">Campaign</th>
                            <th className="text-right py-3 px-4 font-semibold text-gray-900">Spend</th>
                            <th className="text-right py-3 px-4 font-semibold text-gray-900">Conversions</th>
                            <th className="text-right py-3 px-4 font-semibold text-gray-900">ROAS</th>
                          </tr>
                        </thead>
                        <tbody>
                          {drillDownData.breakdown.byCampaign.map((campaign, idx) => (
                            <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                              <td className="py-3 px-4 font-medium text-gray-900">{campaign.name}</td>
                              <td className="py-3 px-4 text-right text-gray-900">${campaign.spend.toLocaleString()}</td>
                              <td className="py-3 px-4 text-right text-gray-900">{campaign.conversions}</td>
                              <td className="py-3 px-4 text-right">
                                <span className={`font-semibold ${campaign.roas >= 3 ? "text-green-600" : "text-orange-600"}`}>
                                  {campaign.roas.toFixed(2)}x
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {activeTab === "devices" && drillDownData.breakdown.byDevice && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Device Breakdown</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={drillDownData.breakdown.byDevice}
                              dataKey="spend"
                              nameKey="device"
                              cx="50%"
                              cy="50%"
                              outerRadius={80}
                              label={(entry: any) => `${entry.device}: $${entry.spend.toLocaleString()}`}
                            >
                              {drillDownData.breakdown.byDevice.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="space-y-3">
                        {drillDownData.breakdown.byDevice.map((device, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                              <span className="font-medium text-gray-900">{device.device}</span>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-gray-900">{device.conversions} conversions</p>
                              <p className="text-sm text-gray-600">${device.spend.toLocaleString()} spend</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "time" && drillDownData.breakdown.byHour && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance by Hour of Day</h3>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={drillDownData.breakdown.byHour}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="hour" 
                            tickFormatter={(hour) => `${hour}:00`}
                          />
                          <YAxis yAxisId="left" />
                          <YAxis yAxisId="right" orientation="right" />
                          <Tooltip 
                            labelFormatter={(hour) => `${hour}:00 - ${hour}:59`}
                            formatter={(value: any, name?: string) => [
                              name === "conversions" ? value : `$${value}`,
                              name === "conversions" ? "Conversions" : "Spend"
                            ]}
                          />
                          <Bar yAxisId="left" dataKey="conversions" fill="#22c55e" name="Conversions" />
                          <Bar yAxisId="right" dataKey="spend" fill="#3b82f6" name="Spend" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <p className="text-sm text-gray-600 mt-4 text-center">
                      💡 Peak conversion hours: {drillDownData.breakdown.byHour
                        .sort((a, b) => b.conversions - a.conversions)
                        .slice(0, 3)
                        .map(h => `${h.hour}:00`)
                        .join(", ")}
                    </p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-gray-500">
              No detailed data available
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
