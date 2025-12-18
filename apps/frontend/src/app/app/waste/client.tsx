"use client";

import { useEffect, useMemo, useState, useCallback } from "react";

type WasteAlertDto = {
  id: string;
  entityType: string;
  entityId: string;
  entityName: string;
  organizationId: string;
  platformCode: string;
  reason: string;
  level: string;
  spendMicros: string;
  conversions: number;
  cpa: number | null;
  targetCpa: number | null;
  windowStart: string;
  windowEnd: string;
  message: string;
  recommendation: string;
};

type WasteListResponse = {
  window: { start: string; end: string; days: number };
  totals: {
    totalWastedSpendMicros: string;
    byLevel: Record<string, number>;
    byReason: Record<string, number>;
    byEntityType: Record<string, number>;
  };
  alerts: WasteAlertDto[];
};

type WasteDetailResponse = {
  alert: WasteAlertDto;
  explainability: Record<string, unknown>;
  recommendedActions: Array<{
    key: string;
    title: string;
    description: string;
    severity: "low" | "medium" | "high";
  }>;
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

function microsToDollars(micros: string): number {
  return Number(micros) / 1_000_000;
}

const LEVEL_STYLES: Record<string, string> = {
  critical: "bg-red-100 text-red-700",
  high: "bg-orange-100 text-orange-700",
  medium: "bg-yellow-100 text-yellow-700",
  low: "bg-zinc-100 text-zinc-700",
  none: "bg-zinc-100 text-zinc-700",
};

function reasonLabel(reason: string): string {
  return reason.replace(/_/g, " ");
}

export function WasteClient() {
  const [windowDays, setWindowDays] = useState(7);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<WasteListResponse | null>(null);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<WasteDetailResponse | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const selectedAlert = useMemo(() => {
    if (!data || !selectedId) return null;
    return data.alerts.find((a) => a.id === selectedId) ?? null;
  }, [data, selectedId]);

  const totalWastedUsd = data ? microsToDollars(data.totals.totalWastedSpendMicros) : 0;

  const loadList = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/waste/alerts?windowDays=${windowDays}`);
      if (!res.ok) throw new Error("Failed to load waste alerts");
      const json = (await res.json()) as WasteListResponse;
      setData(json);

      if (json.alerts.length > 0 && !selectedId) {
        setSelectedId(json.alerts[0].id);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [windowDays, selectedId]);

  const loadDetail = useCallback(async (id: string) => {
    setDetailLoading(true);
    try {
      const res = await fetch(`/api/waste/alerts/${encodeURIComponent(id)}?windowDays=${windowDays}`);
      if (!res.ok) throw new Error("Failed to load detail");
      const json = (await res.json()) as WasteDetailResponse;
      setDetail(json);
    } finally {
      setDetailLoading(false);
    }
  }, [windowDays]);

  useEffect(() => {
    void loadList();
  }, [loadList]);

  useEffect(() => {
    if (selectedId) {
      void loadDetail(selectedId);
    } else {
      setDetail(null);
    }
  }, [selectedId, loadDetail]);

  const tableRows = useMemo(() => {
    return data?.alerts ?? [];
  }, [data]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Waste Detection</h1>
          <p className="mt-1 text-sm text-zinc-600">
            Flagged spend with evidence and a recommended next step.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-zinc-600">Window</label>
          <select
            value={windowDays}
            onChange={(e) => setWindowDays(Number(e.target.value))}
            className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm"
          >
            <option value={7}>Last 7 days</option>
            <option value={14}>Last 14 days</option>
            <option value={30}>Last 30 days</option>
          </select>
          <button
            onClick={() => void loadList()}
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
          >
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-3 flex items-center justify-between rounded-xl border border-zinc-200 bg-white p-4">
            <div>
              <div className="text-sm text-zinc-600">Total wasted spend</div>
              <div className="mt-1 text-xl font-semibold text-zinc-900">
                {loading ? "…" : formatCurrency(totalWastedUsd)}
              </div>
            </div>
            {data && (
              <div className="text-sm text-zinc-600">
                {formatNumber(data.alerts.length)} flagged item{data.alerts.length === 1 ? "" : "s"}
              </div>
            )}
          </div>

          <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead className="border-b border-zinc-100 bg-zinc-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-zinc-500">Entity</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-zinc-500">Type</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-zinc-500">Channel</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-zinc-500">Reason</th>
                    <th className="px-3 py-2 text-right text-xs font-medium text-zinc-500">Wasted $</th>
                    <th className="px-3 py-2 text-right text-xs font-medium text-zinc-500">Conv.</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-zinc-500">Level</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-sm text-zinc-500">
                        Loading…
                      </td>
                    </tr>
                  ) : tableRows.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-sm text-zinc-500">
                        No waste items found.
                      </td>
                    </tr>
                  ) : (
                    tableRows.map((row) => {
                      const isActive = row.id === selectedId;
                      return (
                        <tr
                          key={row.id}
                          className={`cursor-pointer ${isActive ? "bg-zinc-50" : "hover:bg-zinc-50"}`}
                          onClick={() => setSelectedId(row.id)}
                        >
                          <td className="max-w-[260px] truncate px-4 py-3 text-sm font-medium text-zinc-900">
                            {row.entityName}
                          </td>
                          <td className="px-3 py-3 text-sm text-zinc-700">
                            {row.entityType.replace(/_/g, " ")}
                          </td>
                          <td className="px-3 py-3 text-sm text-zinc-700">{row.platformCode}</td>
                          <td className="px-3 py-3 text-sm text-zinc-700 capitalize">
                            {reasonLabel(row.reason)}
                          </td>
                          <td className="px-3 py-3 text-right text-sm text-zinc-700">
                            {formatCurrency(microsToDollars(row.spendMicros))}
                          </td>
                          <td className="px-3 py-3 text-right text-sm text-zinc-700">
                            {formatNumber(row.conversions)}
                          </td>
                          <td className="px-3 py-3">
                            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${LEVEL_STYLES[row.level] ?? LEVEL_STYLES.low}`}>
                              {row.level}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div>
          <div className="sticky top-4">
            <div className="rounded-xl border border-zinc-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-medium text-zinc-900">Why this is flagged</h2>
                {selectedAlert && (
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${LEVEL_STYLES[selectedAlert.level] ?? LEVEL_STYLES.low}`}>
                    {selectedAlert.level}
                  </span>
                )}
              </div>

              {!selectedId ? (
                <p className="mt-3 text-sm text-zinc-500">Select an item to view details.</p>
              ) : detailLoading ? (
                <p className="mt-3 text-sm text-zinc-500">Loading…</p>
              ) : detail ? (
                <>
                  <div className="mt-3">
                    <div className="text-sm font-medium text-zinc-900">
                      {detail.alert.entityName}
                    </div>
                    <div className="mt-1 text-xs text-zinc-500">
                      {detail.alert.platformCode} · {detail.alert.entityType.replace(/_/g, " ")}
                    </div>
                  </div>

                  <div className="mt-4 rounded-lg border border-zinc-200 bg-zinc-50 p-3">
                    <div className="text-xs font-medium text-zinc-600">Evidence</div>
                    <div className="mt-2 space-y-1 text-sm text-zinc-700">
                      <div><span className="text-zinc-500">Reason:</span> {reasonLabel(detail.alert.reason)}</div>
                      <div><span className="text-zinc-500">Wasted spend:</span> {formatCurrency(microsToDollars(detail.alert.spendMicros))}</div>
                      <div><span className="text-zinc-500">Conversions:</span> {formatNumber(detail.alert.conversions)}</div>
                      <div>
                        <span className="text-zinc-500">CPA:</span> {detail.alert.cpa !== null ? formatCurrency(detail.alert.cpa) : "—"}
                      </div>
                      <div>
                        <span className="text-zinc-500">Target CPA:</span> {detail.alert.targetCpa !== null ? formatCurrency(detail.alert.targetCpa) : "—"}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="text-xs font-medium text-zinc-600">Recommended actions</div>
                    <div className="mt-2 space-y-2">
                      {detail.recommendedActions.map((a) => (
                        <div key={a.key} className="rounded-lg border border-zinc-200 p-3">
                          <div className="flex items-center justify-between">
                            <div className="text-sm font-medium text-zinc-900">{a.title}</div>
                            <span
                              className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                                a.severity === "high"
                                  ? "bg-red-100 text-red-700"
                                  : a.severity === "medium"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-zinc-100 text-zinc-700"
                              }`}
                            >
                              {a.severity}
                            </span>
                          </div>
                          <div className="mt-1 text-sm text-zinc-600">{a.description}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <details className="mt-4">
                    <summary className="cursor-pointer text-sm font-medium text-zinc-700">
                      Explainability JSON
                    </summary>
                    <pre className="mt-2 max-h-[280px] overflow-auto rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-xs text-zinc-700">
                      {JSON.stringify(detail.explainability, null, 2)}
                    </pre>
                  </details>
                </>
              ) : (
                <p className="mt-3 text-sm text-zinc-500">No detail available.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
