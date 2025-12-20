"use client";

/**
 * Dashboard Client Component
 * 
 * Interactive dashboard with filters, KPIs, charts, and tables
 */

import { useState, useEffect } from "react";
import { KPICards } from "./components/kpi-cards";
import { TimeSeriesChart } from "./components/time-series-chart";
import { CampaignTable } from "./components/campaign-table";
import { DashboardFilters } from "./components/dashboard-filters";

export function DashboardClient() {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
    to: new Date(),
  });
  const [platform, setPlatform] = useState<string | null>(null);
  const [attributionModel, setAttributionModel] = useState<string>("LAST_TOUCH");
  const [loading, setLoading] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Track your marketing performance</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <DashboardFilters
          dateRange={dateRange}
          platform={platform}
          attributionModel={attributionModel}
          onDateRangeChange={setDateRange}
          onPlatformChange={setPlatform}
          onAttributionModelChange={setAttributionModel}
        />

        {/* KPI Cards */}
        <div className="mt-6">
          <KPICards
            dateRange={dateRange}
            platform={platform}
            attributionModel={attributionModel}
          />
        </div>

        {/* Time Series Chart */}
        <div className="mt-6">
          <TimeSeriesChart
            dateRange={dateRange}
            platform={platform}
            attributionModel={attributionModel}
          />
        </div>

        {/* Campaign Table */}
        <div className="mt-6">
          <CampaignTable
            dateRange={dateRange}
            platform={platform}
            attributionModel={attributionModel}
          />
        </div>
      </div>
    </div>
  );
}
