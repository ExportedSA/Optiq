"use client";

import { useState } from "react";
import type { DateRangePreset } from "@/lib/analytics";

interface DateRangeSelectorProps {
  value: DateRangePreset;
  onChange: (preset: DateRangePreset) => void;
  customRange?: { start: Date; end: Date };
  onCustomRangeChange?: (range: { start: Date; end: Date }) => void;
}

const presets: { value: DateRangePreset; label: string }[] = [
  { value: "7d", label: "Last 7 days" },
  { value: "14d", label: "Last 14 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 90 days" },
];

export function DateRangeSelector({
  value,
  onChange,
  customRange,
  onCustomRangeChange,
}: DateRangeSelectorProps) {
  const [showCustom, setShowCustom] = useState(false);
  const [tempStart, setTempStart] = useState(
    customRange?.start.toISOString().split("T")[0] ?? ""
  );
  const [tempEnd, setTempEnd] = useState(
    customRange?.end.toISOString().split("T")[0] ?? ""
  );

  const handlePresetClick = (preset: DateRangePreset) => {
    if (preset === "custom") {
      setShowCustom(true);
    } else {
      setShowCustom(false);
      onChange(preset);
    }
  };

  const handleCustomApply = () => {
    if (tempStart && tempEnd && onCustomRangeChange) {
      const start = new Date(tempStart);
      start.setHours(0, 0, 0, 0);
      const end = new Date(tempEnd);
      end.setHours(23, 59, 59, 999);
      onCustomRangeChange({ start, end });
      onChange("custom");
      setShowCustom(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {presets.map((preset) => (
        <button
          key={preset.value}
          onClick={() => handlePresetClick(preset.value)}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
            value === preset.value && !showCustom
              ? "bg-zinc-900 text-white"
              : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
          }`}
        >
          {preset.label}
        </button>
      ))}

      <div className="relative">
        <button
          onClick={() => setShowCustom(!showCustom)}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
            value === "custom"
              ? "bg-zinc-900 text-white"
              : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
          }`}
        >
          Custom
        </button>

        {showCustom && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setShowCustom(false)}
            />
            <div className="absolute right-0 z-20 mt-2 w-72 rounded-lg border border-zinc-200 bg-white p-4 shadow-lg">
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-600">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={tempStart}
                    onChange={(e) => setTempStart(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-600">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={tempEnd}
                    onChange={(e) => setTempEnd(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-400"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setShowCustom(false)}
                    className="rounded-lg px-3 py-1.5 text-sm font-medium text-zinc-600 hover:bg-zinc-100"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCustomApply}
                    disabled={!tempStart || !tempEnd}
                    className="rounded-lg bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
