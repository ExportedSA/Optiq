"use client";

import { useState, useCallback } from "react";

export interface FilterState {
  startDate: string;
  endDate: string;
  channels: string[];
  granularity: "day" | "week" | "month";
  breakdown: "platform" | "campaign" | "ad";
}

interface FiltersProps {
  value: FilterState;
  onChange: (filters: FilterState) => void;
}

const CHANNEL_OPTIONS = [
  { value: "GOOGLE_ADS", label: "Google Ads" },
  { value: "META", label: "Meta" },
  { value: "TIKTOK", label: "TikTok" },
  { value: "LINKEDIN", label: "LinkedIn" },
];

const DATE_PRESETS = [
  { label: "Last 7 days", days: 7 },
  { label: "Last 14 days", days: 14 },
  { label: "Last 30 days", days: 30 },
  { label: "Last 90 days", days: 90 },
];

function formatDateForInput(date: Date): string {
  return date.toISOString().split("T")[0];
}

function getPresetDates(days: number): { start: string; end: string } {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - days + 1);
  return {
    start: formatDateForInput(start),
    end: formatDateForInput(end),
  };
}

export function DashboardFilters({ value, onChange }: FiltersProps) {
  const [showChannelDropdown, setShowChannelDropdown] = useState(false);

  const handlePreset = useCallback((days: number) => {
    const { start, end } = getPresetDates(days);
    onChange({ ...value, startDate: start, endDate: end });
  }, [value, onChange]);

  const toggleChannel = useCallback((channel: string) => {
    const channels = value.channels.includes(channel)
      ? value.channels.filter((c) => c !== channel)
      : [...value.channels, channel];
    onChange({ ...value, channels });
  }, [value, onChange]);

  const clearChannels = useCallback(() => {
    onChange({ ...value, channels: [] });
  }, [value, onChange]);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2">
        {DATE_PRESETS.map((preset) => (
          <button
            key={preset.days}
            onClick={() => handlePreset(preset.days)}
            className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-700 hover:bg-zinc-50"
          >
            {preset.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <input
          type="date"
          value={value.startDate}
          onChange={(e) => onChange({ ...value, startDate: e.target.value })}
          className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-700"
        />
        <span className="text-zinc-400">to</span>
        <input
          type="date"
          value={value.endDate}
          onChange={(e) => onChange({ ...value, endDate: e.target.value })}
          className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-700"
        />
      </div>

      <div className="relative">
        <button
          onClick={() => setShowChannelDropdown(!showChannelDropdown)}
          className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-700 hover:bg-zinc-50"
        >
          <span>
            {value.channels.length === 0
              ? "All Channels"
              : `${value.channels.length} channel${value.channels.length > 1 ? "s" : ""}`}
          </span>
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showChannelDropdown && (
          <div className="absolute left-0 top-full z-10 mt-1 w-48 rounded-lg border border-zinc-200 bg-white py-1 shadow-lg">
            {value.channels.length > 0 && (
              <button
                onClick={clearChannels}
                className="w-full px-3 py-2 text-left text-sm text-zinc-500 hover:bg-zinc-50"
              >
                Clear all
              </button>
            )}
            {CHANNEL_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                className="flex cursor-pointer items-center gap-2 px-3 py-2 hover:bg-zinc-50"
              >
                <input
                  type="checkbox"
                  checked={value.channels.includes(opt.value)}
                  onChange={() => toggleChannel(opt.value)}
                  className="h-4 w-4 rounded border-zinc-300"
                />
                <span className="text-sm text-zinc-700">{opt.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      <select
        value={value.granularity}
        onChange={(e) => onChange({ ...value, granularity: e.target.value as FilterState["granularity"] })}
        className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-700"
      >
        <option value="day">Daily</option>
        <option value="week">Weekly</option>
        <option value="month">Monthly</option>
      </select>

      <select
        value={value.breakdown}
        onChange={(e) => onChange({ ...value, breakdown: e.target.value as FilterState["breakdown"] })}
        className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-700"
      >
        <option value="platform">By Channel</option>
        <option value="campaign">By Campaign</option>
        <option value="ad">By Ad</option>
      </select>
    </div>
  );
}

export function getDefaultFilters(): FilterState {
  const { start, end } = getPresetDates(30);
  return {
    startDate: start,
    endDate: end,
    channels: [],
    granularity: "day",
    breakdown: "campaign",
  };
}
