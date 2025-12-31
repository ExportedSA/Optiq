"use client";

import { startOfDay, endOfDay, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subMonths, subWeeks } from "date-fns";

/**
 * Date Range Presets Component
 * 
 * Quick date range selection with common presets
 * Features:
 * - Today, Yesterday, Last 7/30/90 days
 * - This/Last Week, Month, Quarter
 * - Custom date range picker
 * - Comparison period auto-calculation
 */

export interface DateRangePreset {
  label: string;
  getValue: () => { from: Date; to: Date };
  icon?: string;
  category: "quick" | "week" | "month" | "custom";
}

export const dateRangePresets: DateRangePreset[] = [
  // Quick Ranges
  {
    label: "Today",
    getValue: () => ({
      from: startOfDay(new Date()),
      to: endOfDay(new Date()),
    }),
    icon: "📅",
    category: "quick",
  },
  {
    label: "Yesterday",
    getValue: () => ({
      from: startOfDay(subDays(new Date(), 1)),
      to: endOfDay(subDays(new Date(), 1)),
    }),
    icon: "📆",
    category: "quick",
  },
  {
    label: "Last 7 Days",
    getValue: () => ({
      from: startOfDay(subDays(new Date(), 7)),
      to: endOfDay(new Date()),
    }),
    icon: "📊",
    category: "quick",
  },
  {
    label: "Last 30 Days",
    getValue: () => ({
      from: startOfDay(subDays(new Date(), 30)),
      to: endOfDay(new Date()),
    }),
    icon: "📈",
    category: "quick",
  },
  {
    label: "Last 90 Days",
    getValue: () => ({
      from: startOfDay(subDays(new Date(), 90)),
      to: endOfDay(new Date()),
    }),
    icon: "📉",
    category: "quick",
  },
  
  // Week Ranges
  {
    label: "This Week",
    getValue: () => ({
      from: startOfWeek(new Date(), { weekStartsOn: 1 }),
      to: endOfWeek(new Date(), { weekStartsOn: 1 }),
    }),
    icon: "🗓️",
    category: "week",
  },
  {
    label: "Last Week",
    getValue: () => ({
      from: startOfWeek(subWeeks(new Date(), 1), { weekStartsOn: 1 }),
      to: endOfWeek(subWeeks(new Date(), 1), { weekStartsOn: 1 }),
    }),
    icon: "🗓️",
    category: "week",
  },
  
  // Month Ranges
  {
    label: "This Month",
    getValue: () => ({
      from: startOfMonth(new Date()),
      to: endOfMonth(new Date()),
    }),
    icon: "📅",
    category: "month",
  },
  {
    label: "Last Month",
    getValue: () => ({
      from: startOfMonth(subMonths(new Date(), 1)),
      to: endOfMonth(subMonths(new Date(), 1)),
    }),
    icon: "📅",
    category: "month",
  },
  {
    label: "Last 3 Months",
    getValue: () => ({
      from: startOfMonth(subMonths(new Date(), 3)),
      to: endOfMonth(new Date()),
    }),
    icon: "📊",
    category: "month",
  },
];

interface DateRangePresetsProps {
  onSelect: (range: { from: Date; to: Date }) => void;
  currentRange?: { from: Date; to: Date };
}

export function DateRangePresets({ onSelect, currentRange }: DateRangePresetsProps) {
  const categories = [
    { key: "quick", label: "Quick Select" },
    { key: "week", label: "Weekly" },
    { key: "month", label: "Monthly" },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Date Range Presets</h3>
      
      <div className="space-y-6">
        {categories.map((category) => {
          const presets = dateRangePresets.filter(p => p.category === category.key);
          
          return (
            <div key={category.key}>
              <h4 className="text-sm font-medium text-gray-700 mb-3">{category.label}</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                {presets.map((preset) => {
                  const range = preset.getValue();
                  const isActive = currentRange && 
                    range.from.getTime() === currentRange.from.getTime() &&
                    range.to.getTime() === currentRange.to.getTime();
                  
                  return (
                    <button
                      key={preset.label}
                      onClick={() => onSelect(range)}
                      className={`px-3 py-2 text-sm rounded-lg border-2 transition-all ${
                        isActive
                          ? "border-blue-600 bg-blue-50 text-blue-900 font-semibold shadow-sm"
                          : "border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50"
                      }`}
                    >
                      {preset.icon && <span className="mr-1">{preset.icon}</span>}
                      {preset.label}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Custom Range Info */}
      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div className="text-sm">
            <p className="font-medium text-gray-900 mb-1">Pro Tip</p>
            <p className="text-gray-700">
              Use the date picker in the filters above for custom date ranges. 
              Presets automatically calculate comparison periods for trend analysis.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Calculate comparison period for a given date range
 * Returns the previous period of equal length
 */
export function getComparisonPeriod(range: { from: Date; to: Date }): { from: Date; to: Date } {
  const durationMs = range.to.getTime() - range.from.getTime();
  const durationDays = Math.ceil(durationMs / (1000 * 60 * 60 * 24));
  
  return {
    from: startOfDay(subDays(range.from, durationDays)),
    to: endOfDay(subDays(range.to, durationDays)),
  };
}

/**
 * Get preset label for a date range if it matches
 */
export function getPresetLabel(range: { from: Date; to: Date }): string | null {
  for (const preset of dateRangePresets) {
    const presetRange = preset.getValue();
    if (
      presetRange.from.getTime() === range.from.getTime() &&
      presetRange.to.getTime() === range.to.getTime()
    ) {
      return preset.label;
    }
  }
  return null;
}
