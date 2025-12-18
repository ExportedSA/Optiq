"use client";

import { useCallback, useEffect, useState } from "react";

interface ThrottleStatus {
  isThrottled: boolean;
  throttleLevel: "none" | "soft" | "hard";
  currentUsage: number;
  limit: number;
  percentUsed: number;
  remainingEvents: number;
  message?: string;
}

interface DailyUsage {
  date: string;
  totalEvents: number;
  pageViews: number;
  conversions: number;
  customEvents: number;
}

interface UsageData {
  throttleStatus: ThrottleStatus;
  periodEventCount: number;
  limits: {
    monthlyEventLimit: number;
    softLimitPercent: number;
    hardLimitPercent: number;
  };
  dailyUsage: DailyUsage[];
}

function formatNumber(n: number): string {
  return new Intl.NumberFormat("en-US").format(n);
}

export function UsageMeterWidget() {
  const [data, setData] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/metering/usage?days=30");
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white p-6">
        <div className="h-32 animate-pulse rounded-lg bg-zinc-100" />
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const { throttleStatus, limits } = data;
  const softThreshold = (limits.softLimitPercent / 100) * limits.monthlyEventLimit;
  const hardThreshold = (limits.hardLimitPercent / 100) * limits.monthlyEventLimit;

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-zinc-900">Event Usage</h3>
        {throttleStatus.throttleLevel !== "none" && (
          <span
            className={`rounded-full px-2 py-1 text-xs font-medium ${
              throttleStatus.throttleLevel === "hard"
                ? "bg-red-100 text-red-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {throttleStatus.throttleLevel === "hard" ? "Limit Exceeded" : "Approaching Limit"}
          </span>
        )}
      </div>

      <div className="mt-4">
        <div className="flex items-baseline justify-between">
          <span className="text-3xl font-bold text-zinc-900">
            {formatNumber(throttleStatus.currentUsage)}
          </span>
          <span className="text-sm text-zinc-500">
            of {formatNumber(throttleStatus.limit)} events
          </span>
        </div>

        <div className="mt-3 h-3 overflow-hidden rounded-full bg-zinc-100">
          <div className="relative h-full">
            {/* Soft limit marker */}
            <div
              className="absolute top-0 h-full w-0.5 bg-yellow-400"
              style={{ left: `${limits.softLimitPercent}%` }}
            />
            {/* Hard limit marker */}
            <div
              className="absolute top-0 h-full w-0.5 bg-red-400"
              style={{ left: `${Math.min(100, limits.hardLimitPercent)}%` }}
            />
            {/* Usage bar */}
            <div
              className={`h-full rounded-full transition-all ${
                throttleStatus.throttleLevel === "hard"
                  ? "bg-red-500"
                  : throttleStatus.throttleLevel === "soft"
                  ? "bg-yellow-500"
                  : "bg-green-500"
              }`}
              style={{ width: `${Math.min(100, throttleStatus.percentUsed)}%` }}
            />
          </div>
        </div>

        <div className="mt-2 flex justify-between text-xs text-zinc-500">
          <span>{Math.round(throttleStatus.percentUsed)}% used</span>
          <span>{formatNumber(throttleStatus.remainingEvents)} remaining</span>
        </div>
      </div>

      {throttleStatus.message && (
        <div
          className={`mt-4 rounded-lg p-3 text-sm ${
            throttleStatus.throttleLevel === "hard"
              ? "bg-red-50 text-red-700"
              : "bg-yellow-50 text-yellow-700"
          }`}
        >
          {throttleStatus.message}
          {throttleStatus.throttleLevel !== "none" && (
            <a
              href="/app/settings/billing"
              className="ml-2 font-medium underline hover:no-underline"
            >
              Upgrade now →
            </a>
          )}
        </div>
      )}

      {data.dailyUsage && data.dailyUsage.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-medium text-zinc-700">Daily Breakdown (Last 7 Days)</h4>
          <div className="mt-3 space-y-2">
            {data.dailyUsage.slice(0, 7).map((day) => (
              <div key={day.date} className="flex items-center justify-between text-sm">
                <span className="text-zinc-600">
                  {new Date(day.date).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                <div className="flex items-center gap-4">
                  <span className="text-zinc-500">{formatNumber(day.totalEvents)} events</span>
                  <div className="h-2 w-24 overflow-hidden rounded-full bg-zinc-100">
                    <div
                      className="h-full rounded-full bg-blue-500"
                      style={{
                        width: `${Math.min(100, (day.totalEvents / (limits.monthlyEventLimit / 30)) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function UsageAlert() {
  const [throttleStatus, setThrottleStatus] = useState<ThrottleStatus | null>(null);

  useEffect(() => {
    async function check() {
      try {
        const res = await fetch("/api/metering/usage");
        if (res.ok) {
          const data = await res.json();
          setThrottleStatus(data.throttleStatus);
        }
      } catch {
        // Ignore errors
      }
    }
    void check();
  }, []);

  if (!throttleStatus || throttleStatus.throttleLevel === "none") {
    return null;
  }

  return (
    <div
      className={`fixed bottom-4 left-4 right-4 z-50 rounded-lg p-4 shadow-lg md:left-auto md:right-4 md:w-96 ${
        throttleStatus.throttleLevel === "hard"
          ? "border border-red-200 bg-red-50"
          : "border border-yellow-200 bg-yellow-50"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${
            throttleStatus.throttleLevel === "hard" ? "bg-red-100" : "bg-yellow-100"
          }`}
        >
          {throttleStatus.throttleLevel === "hard" ? (
            <span className="text-red-600">⚠</span>
          ) : (
            <span className="text-yellow-600">!</span>
          )}
        </div>
        <div className="flex-1">
          <h4
            className={`font-medium ${
              throttleStatus.throttleLevel === "hard" ? "text-red-800" : "text-yellow-800"
            }`}
          >
            {throttleStatus.throttleLevel === "hard"
              ? "Event Limit Exceeded"
              : "Approaching Event Limit"}
          </h4>
          <p
            className={`mt-1 text-sm ${
              throttleStatus.throttleLevel === "hard" ? "text-red-700" : "text-yellow-700"
            }`}
          >
            {throttleStatus.message}
          </p>
          <a
            href="/app/settings/billing"
            className={`mt-2 inline-block text-sm font-medium ${
              throttleStatus.throttleLevel === "hard"
                ? "text-red-700 hover:text-red-800"
                : "text-yellow-700 hover:text-yellow-800"
            }`}
          >
            Upgrade your plan →
          </a>
        </div>
      </div>
    </div>
  );
}
