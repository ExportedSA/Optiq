"use client";

import { useState } from "react";

interface DashboardFiltersProps {
  dateRange: { from: Date; to: Date };
  platform: string | null;
  attributionModel: string;
  onDateRangeChange: (range: { from: Date; to: Date }) => void;
  onPlatformChange: (platform: string | null) => void;
  onAttributionModelChange: (model: string) => void;
}

const PLATFORMS = [
  { value: null, label: "All Platforms" },
  { value: "META_ADS", label: "Meta Ads" },
  { value: "GOOGLE_ADS", label: "Google Ads" },
  { value: "TIKTOK_ADS", label: "TikTok Ads" },
];

const ATTRIBUTION_MODELS = [
  { value: "LAST_TOUCH", label: "Last Touch" },
  { value: "FIRST_TOUCH", label: "First Touch" },
  { value: "LINEAR", label: "Linear" },
  { value: "TIME_DECAY", label: "Time Decay" },
  { value: "POSITION_BASED", label: "Position Based" },
];

const QUICK_RANGES = [
  { label: "Last 7 days", days: 7 },
  { label: "Last 30 days", days: 30 },
  { label: "Last 90 days", days: 90 },
];

export function DashboardFilters({
  dateRange,
  platform,
  attributionModel,
  onDateRangeChange,
  onPlatformChange,
  onAttributionModelChange,
}: DashboardFiltersProps) {
  const [showCustomRange, setShowCustomRange] = useState(false);

  const handleQuickRange = (days: number) => {
    const to = new Date();
    const from = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    onDateRangeChange({ from, to });
    setShowCustomRange(false);
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex flex-wrap items-center gap-4">
        {/* Date Range */}
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date Range
          </label>
          <div className="flex gap-2">
            {QUICK_RANGES.map((range) => (
              <button
                key={range.days}
                onClick={() => handleQuickRange(range.days)}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                {range.label}
              </button>
            ))}
            <button
              onClick={() => setShowCustomRange(!showCustomRange)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Custom
            </button>
          </div>
          {showCustomRange && (
            <div className="mt-2 flex gap-2">
              <input
                type="date"
                value={formatDate(dateRange.from)}
                onChange={(e) =>
                  onDateRangeChange({
                    from: new Date(e.target.value),
                    to: dateRange.to,
                  })
                }
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg"
              />
              <span className="self-center text-gray-500">to</span>
              <input
                type="date"
                value={formatDate(dateRange.to)}
                onChange={(e) =>
                  onDateRangeChange({
                    from: dateRange.from,
                    to: new Date(e.target.value),
                  })
                }
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg"
              />
            </div>
          )}
        </div>

        {/* Platform Filter */}
        <div className="w-48">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Platform
          </label>
          <select
            value={platform || ""}
            onChange={(e) => onPlatformChange(e.target.value || null)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {PLATFORMS.map((p) => (
              <option key={p.value || "all"} value={p.value || ""}>
                {p.label}
              </option>
            ))}
          </select>
        </div>

        {/* Attribution Model */}
        <div className="w-48">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Attribution Model
          </label>
          <select
            value={attributionModel}
            onChange={(e) => onAttributionModelChange(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {ATTRIBUTION_MODELS.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
