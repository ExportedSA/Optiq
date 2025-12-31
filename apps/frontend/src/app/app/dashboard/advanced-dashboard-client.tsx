"use client";

/**
 * Advanced Dashboard Client Component
 * 
 * Complete dashboard with all advanced features:
 * - Real-time updates with WebSocket support
 * - Period comparison mode
 * - Drill-down capabilities
 * - Date range presets
 * - Enhanced visualizations
 * - Export functionality
 */

import { useState } from "react";
import { EnhancedKPICards } from "./components/enhanced-kpi-cards";
import { EnhancedChart } from "./components/enhanced-chart";
import { CampaignTable } from "./components/campaign-table";
import { DashboardFilters } from "./components/dashboard-filters";
import { ComparisonMode } from "./components/comparison-mode";
import { DrillDownModal } from "./components/drill-down-modal";
import { DateRangePresets } from "./components/date-range-presets";
import { subDays, startOfDay, endOfDay } from "date-fns";

type ViewMode = "overview" | "comparison" | "presets";

export function AdvancedDashboardClient() {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: startOfDay(subDays(new Date(), 30)),
    to: endOfDay(new Date()),
  });
  const [platform, setPlatform] = useState<string | null>(null);
  const [attributionModel, setAttributionModel] = useState<string>("LAST_TOUCH");
  const [viewMode, setViewMode] = useState<ViewMode>("overview");
  
  // Drill-down state
  const [drillDownData, setDrillDownData] = useState<{
    isOpen: boolean;
    data: any;
  }>({
    isOpen: false,
    data: null,
  });

  const handleDrillDown = (data: any) => {
    setDrillDownData({
      isOpen: true,
      data,
    });
  };

  const closeDrillDown = () => {
    setDrillDownData({
      isOpen: false,
      data: null,
    });
  };

  return (
    <div>
      {/* Page Header with View Mode Switcher */}
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-gray-600 mt-1">Real-time marketing performance analytics</p>
        </div>
        
        {/* View Mode Switcher */}
        <div className="flex gap-1 bg-white rounded-xl p-1 shadow-md">
          {[
            { key: "overview", label: "Overview", icon: "📊" },
            { key: "comparison", label: "Compare", icon: "⚖️" },
            { key: "presets", label: "Presets", icon: "⚡" },
          ].map((mode) => (
            <button
              key={mode.key}
              onClick={() => setViewMode(mode.key as ViewMode)}
              className={`px-4 py-2 text-sm rounded-lg transition-all ${
                viewMode === mode.key
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <span className="mr-1">{mode.icon}</span>
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div>
        {/* Filters - Always visible */}
        <div className="mb-6">
          <DashboardFilters
            dateRange={dateRange}
            platform={platform}
            attributionModel={attributionModel}
            onDateRangeChange={setDateRange}
            onPlatformChange={setPlatform}
            onAttributionModelChange={setAttributionModel}
          />
        </div>

        {/* View-specific content */}
        {viewMode === "overview" && (
          <div className="space-y-6">
            {/* Enhanced KPI Cards with real-time updates */}
            <EnhancedKPICards
              dateRange={dateRange}
              platform={platform}
              attributionModel={attributionModel}
            />

            {/* Enhanced Interactive Chart */}
            <EnhancedChart
              dateRange={dateRange}
              platform={platform}
              attributionModel={attributionModel}
            />

            {/* Campaign Table */}
            <CampaignTable
              dateRange={dateRange}
              platform={platform}
              attributionModel={attributionModel}
            />

            {/* Quick Stats Footer */}
            <div className="glass backdrop-blur-xl bg-white/70 rounded-2xl shadow-xl p-6 border border-white/20">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">🚀 Advanced Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl hover:shadow-md transition-shadow">
                  <span className="text-2xl">🔄</span>
                  <div>
                    <p className="font-semibold text-blue-900">Real-time Updates</p>
                    <p className="text-sm text-blue-700">Auto-refresh every 30s</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl hover:shadow-md transition-shadow">
                  <span className="text-2xl">⚖️</span>
                  <div>
                    <p className="font-semibold text-purple-900">Period Comparison</p>
                    <p className="text-sm text-purple-700">Side-by-side analysis</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl hover:shadow-md transition-shadow">
                  <span className="text-2xl">🔍</span>
                  <div>
                    <p className="font-semibold text-green-900">Drill-Down</p>
                    <p className="text-sm text-green-700">Click for details</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl hover:shadow-md transition-shadow">
                  <span className="text-2xl">⚡</span>
                  <div>
                    <p className="font-semibold text-orange-900">Quick Presets</p>
                    <p className="text-sm text-orange-700">Fast date selection</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {viewMode === "comparison" && (
          <div className="space-y-6">
            <ComparisonMode
              attributionModel={attributionModel}
              platform={platform}
            />
            
            {/* Additional comparison insights */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 Comparison Tips</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                <div className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <p>Compare equal-length periods for accurate trend analysis</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <p>Look for consistent improvements across multiple metrics</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <p>Consider seasonality when comparing different months</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <p>Use attribution models to understand customer journey changes</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {viewMode === "presets" && (
          <div className="space-y-6">
            <DateRangePresets
              onSelect={(range) => {
                setDateRange(range);
                setViewMode("overview");
              }}
              currentRange={dateRange}
            />
            
            {/* Preset usage guide */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">📚 Preset Guide</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <span className="text-xl">📅</span>
                  <div>
                    <p className="font-medium text-blue-900">Quick Select</p>
                    <p className="text-blue-700">Best for daily monitoring and recent performance checks</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                  <span className="text-xl">🗓️</span>
                  <div>
                    <p className="font-medium text-purple-900">Weekly Ranges</p>
                    <p className="text-purple-700">Ideal for week-over-week trend analysis</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                  <span className="text-xl">📊</span>
                  <div>
                    <p className="font-medium text-green-900">Monthly Ranges</p>
                    <p className="text-green-700">Perfect for strategic planning and budget reviews</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Drill-Down Modal */}
      {drillDownData.isOpen && drillDownData.data && (
        <DrillDownModal
          isOpen={drillDownData.isOpen}
          onClose={closeDrillDown}
          data={drillDownData.data}
          dateRange={dateRange}
          attributionModel={attributionModel}
        />
      )}
    </div>
  );
}
