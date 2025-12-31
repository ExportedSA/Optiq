"use client";

/**
 * Enhanced Dashboard Client Component
 * 
 * Real-time dashboard with:
 * - Auto-refresh capabilities
 * - Trend indicators and period comparison
 * - Interactive charts with multiple visualization types
 * - Export functionality
 * - Better data visualization
 */

import { useState } from "react";
import { EnhancedKPICards } from "./components/enhanced-kpi-cards";
import { EnhancedChart } from "./components/enhanced-chart";
import { CampaignTable } from "./components/campaign-table";
import { DashboardFilters } from "./components/dashboard-filters";

export function EnhancedDashboardClient() {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
    to: new Date(),
  });
  const [platform, setPlatform] = useState<string | null>(null);
  const [attributionModel, setAttributionModel] = useState<string>("LAST_TOUCH");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">Real-time marketing performance analytics</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                Live
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
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

        {/* Enhanced KPI Cards with real-time updates */}
        <div className="mb-6">
          <EnhancedKPICards
            dateRange={dateRange}
            platform={platform}
            attributionModel={attributionModel}
          />
        </div>

        {/* Enhanced Interactive Chart */}
        <div className="mb-6">
          <EnhancedChart
            dateRange={dateRange}
            platform={platform}
            attributionModel={attributionModel}
          />
        </div>

        {/* Campaign Table */}
        <div className="mb-6">
          <CampaignTable
            dateRange={dateRange}
            platform={platform}
            attributionModel={attributionModel}
          />
        </div>

        {/* Quick Stats Footer */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">💡</span>
              <div>
                <p className="font-medium text-gray-900">Real-time Updates</p>
                <p className="text-sm text-gray-600">Dashboard auto-refreshes every 30 seconds to show latest data</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">📊</span>
              <div>
                <p className="font-medium text-gray-900">Interactive Charts</p>
                <p className="text-sm text-gray-600">Click metrics to toggle visibility and switch chart types</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">📥</span>
              <div>
                <p className="font-medium text-gray-900">Export Data</p>
                <p className="text-sm text-gray-600">Download your metrics as CSV for further analysis</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
