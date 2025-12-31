(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/waste/client.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "WasteClient",
    ()=>WasteClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
function formatCurrency(value) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);
}
function formatNumber(value) {
    return new Intl.NumberFormat("en-US").format(value);
}
function microsToDollars(micros) {
    return Number(micros) / 1_000_000;
}
const LEVEL_STYLES = {
    critical: "bg-red-100 text-red-700",
    high: "bg-orange-100 text-orange-700",
    medium: "bg-yellow-100 text-yellow-700",
    low: "bg-zinc-100 text-zinc-700",
    none: "bg-zinc-100 text-zinc-700"
};
function reasonLabel(reason) {
    return reason.replace(/_/g, " ");
}
function WasteClient() {
    _s();
    const [windowDays, setWindowDays] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(7);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [data, setData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [selectedId, setSelectedId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [detail, setDetail] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [detailLoading, setDetailLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const selectedAlert = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "WasteClient.useMemo[selectedAlert]": ()=>{
            if (!data || !selectedId) return null;
            return data.alerts.find({
                "WasteClient.useMemo[selectedAlert]": (a)=>a.id === selectedId
            }["WasteClient.useMemo[selectedAlert]"]) ?? null;
        }
    }["WasteClient.useMemo[selectedAlert]"], [
        data,
        selectedId
    ]);
    const totalWastedUsd = data ? microsToDollars(data.totals.totalWastedSpendMicros) : 0;
    const loadList = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "WasteClient.useCallback[loadList]": async ()=>{
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(`/api/waste/alerts?windowDays=${windowDays}`);
                if (!res.ok) throw new Error("Failed to load waste alerts");
                const json = await res.json();
                setData(json);
                if (json.alerts.length > 0 && !selectedId) {
                    setSelectedId(json.alerts[0].id);
                }
            } catch (e) {
                setError(e instanceof Error ? e.message : "Unknown error");
            } finally{
                setLoading(false);
            }
        }
    }["WasteClient.useCallback[loadList]"], [
        windowDays,
        selectedId
    ]);
    const loadDetail = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "WasteClient.useCallback[loadDetail]": async (id)=>{
            setDetailLoading(true);
            try {
                const res = await fetch(`/api/waste/alerts/${encodeURIComponent(id)}?windowDays=${windowDays}`);
                if (!res.ok) throw new Error("Failed to load detail");
                const json = await res.json();
                setDetail(json);
            } finally{
                setDetailLoading(false);
            }
        }
    }["WasteClient.useCallback[loadDetail]"], [
        windowDays
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "WasteClient.useEffect": ()=>{
            void loadList();
        }
    }["WasteClient.useEffect"], [
        loadList
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "WasteClient.useEffect": ()=>{
            if (selectedId) {
                void loadDetail(selectedId);
            } else {
                setDetail(null);
            }
        }
    }["WasteClient.useEffect"], [
        selectedId,
        loadDetail
    ]);
    const tableRows = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "WasteClient.useMemo[tableRows]": ()=>{
            return data?.alerts ?? [];
        }
    }["WasteClient.useMemo[tableRows]"], [
        data
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-wrap items-end justify-between gap-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "text-2xl font-semibold tracking-tight",
                                children: "Waste Detection"
                            }, void 0, false, {
                                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/waste/client.tsx",
                                lineNumber: 127,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-1 text-sm text-zinc-600",
                                children: "Flagged spend with evidence and a recommended next step."
                            }, void 0, false, {
                                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/waste/client.tsx",
                                lineNumber: 128,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/waste/client.tsx",
                        lineNumber: 126,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "text-sm text-zinc-600",
                                children: "Window"
                            }, void 0, false, {
                                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/waste/client.tsx",
                                lineNumber: 134,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                value: windowDays,
                                onChange: (e_0)=>setWindowDays(Number(e_0.target.value)),
                                className: "rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: 7,
                                        children: "Last 7 days"
                                    }, void 0, false, {
                                        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/waste/client.tsx",
                                        lineNumber: 136,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: 14,
                                        children: "Last 14 days"
                                    }, void 0, false, {
                                        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/waste/client.tsx",
                                        lineNumber: 137,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: 30,
                                        children: "Last 30 days"
                                    }, void 0, false, {
                                        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/waste/client.tsx",
                                        lineNumber: 138,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/waste/client.tsx",
                                lineNumber: 135,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>void loadList(),
                                className: "rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800",
                                children: "Refresh"
                            }, void 0, false, {
                                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/waste/client.tsx",
                                lineNumber: 140,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/waste/client.tsx",
                        lineNumber: 133,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/waste/client.tsx",
                lineNumber: 125,
                columnNumber: 7
            }, this),
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700",
                children: error
            }, void 0, false, {
                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/waste/client.tsx",
                lineNumber: 146,
                columnNumber: 17
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid gap-4 lg:grid-cols-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "lg:col-span-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mb-3 flex items-center justify-between rounded-xl border border-zinc-200 bg-white p-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-sm text-zinc-600",
                                                children: "Total wasted spend"
                                            }, void 0, false, {
                                                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/waste/client.tsx",
                                                lineNumber: 154,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "mt-1 text-xl font-semibold text-zinc-900",
                                                children: loading ? "…" : formatCurrency(totalWastedUsd)
                                            }, void 0, false, {
                                                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/waste/client.tsx",
                                                lineNumber: 155,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/waste/client.tsx",
                                        lineNumber: 153,
                                        columnNumber: 13
                                    }, this),
                                    data && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-sm text-zinc-600",
                                        children: [
                                            formatNumber(data.alerts.length),
                                            " flagged item",
                                            data.alerts.length === 1 ? "" : "s"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/waste/client.tsx",
                                        lineNumber: 159,
                                        columnNumber: 22
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/waste/client.tsx",
                                lineNumber: 152,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "overflow-hidden rounded-xl border border-zinc-200 bg-white",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "overflow-x-auto",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                        className: "w-full min-w-[700px]",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                                className: "border-b border-zinc-100 bg-zinc-50",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                            className: "px-4 py-2 text-left text-xs font-medium text-zinc-500",
                                                            children: "Entity"
                                                        }, void 0, false, {
                                                            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/waste/client.tsx",
                                                            lineNumber: 169,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                            className: "px-3 py-2 text-left text-xs font-medium text-zinc-500",
                                                            children: "Type"
                                                        }, void 0, false, {
                                                            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/waste/client.tsx",
                                                            lineNumber: 170,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                            className: "px-3 py-2 text-left text-xs font-medium text-zinc-500",
                                                            children: "Channel"
                                                        }, void 0, false, {
                                                            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/waste/client.tsx",
                                                            lineNumber: 171,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                            className: "px-3 py-2 text-left text-xs font-medium text-zinc-500",
                                                            children: "Reason"
                                                        }, void 0, false, {
                                                            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/waste/client.tsx",
                                                            lineNumber: 172,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                            className: "px-3 py-2 text-right text-xs font-medium text-zinc-500",
                                                            children: "Wasted $"
                                                        }, void 0, false, {
                                                            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/waste/client.tsx",
                                                            lineNumber: 173,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                            className: "px-3 py-2 text-right text-xs font-medium text-zinc-500",
                                                            children: "Conv."
                                                        }, void 0, false, {
                                                            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/waste/client.tsx",
                                                            lineNumber: 174,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                            className: "px-3 py-2 text-left text-xs font-medium text-zinc-500",
                                                            children: "Level"
                                                        }, void 0, false, {
                                                            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/waste/client.tsx",
                                                            lineNumber: 175,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/waste/client.tsx",
                                                    lineNumber: 168,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/waste/client.tsx",
                                                lineNumber: 167,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                                className: "divide-y divide-zinc-100",
                                                children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        colSpan: 7,
                                                        className: "px-4 py-8 text-center text-sm text-zinc-500",
                                                        children: "Loading…"
                                                    }, void 0, false, {
                                                        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/waste/client.tsx",
                                                        lineNumber: 180,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/waste/client.tsx",
                                                    lineNumber: 179,
                                                    columnNumber: 30
                                                }, this) : tableRows.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        colSpan: 7,
                                                        className: "px-4 py-8 text-center text-sm text-zinc-500",
                                                        children: "No waste items found."
                                                    }, void 0, false, {
                                                        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/waste/client.tsx",
                                                        lineNumber: 184,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/waste/client.tsx",
                                                    lineNumber: 183,
                                                    columnNumber: 54
                                                }, this) : tableRows.map((row)=>{
                                                    const isActive = row.id === selectedId;
                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                        className: `cursor-pointer ${isActive ? "bg-zinc-50" : "hover:bg-zinc-50"}`,
                                                        onClick: ()=>setSelectedId(row.id),
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                className: "max-w-[260px] truncate px-4 py-3 text-sm font-medium text-zinc-900",
                                                                children: row.entityName
                                                            }, void 0, false, {
                                                                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/waste/client.tsx",
                                                                lineNumber: 190,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                className: "px-3 py-3 text-sm text-zinc-700",
                                                                children: row.entityType.replace(/_/g, " ")
                                                            }, void 0, false, {
                                                                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/waste/client.tsx",
                                                                lineNumber: 193,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                className: "px-3 py-3 text-sm text-zinc-700",
                                                                children: row.platformCode
                                                            }, void 0, false, {
                                                                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/waste/client.tsx",
                                                                lineNumber: 196,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                className: "px-3 py-3 text-sm text-zinc-700 capitalize",
                                                                children: reasonLabel(row.reason)
                                                            }, void 0, false, {
                                                                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/waste/client.tsx",
                                                                lineNumber: 197,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                className: "px-3 py-3 text-right text-sm text-zinc-700",
                                                                children: formatCurrency(microsToDollars(row.spendMicros))
                                                            }, void 0, false, {
                                                                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/waste/client.tsx",
                                                                lineNumber: 200,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                className: "px-3 py-3 text-right text-sm text-zinc-700",
                                                                children: formatNumber(row.conversions)
                                                            }, void 0, false, {
                                                                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/waste/client.tsx",
                                                                lineNumber: 203,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                className: "px-3 py-3",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: `rounded-full px-2 py-0.5 text-xs font-medium ${LEVEL_STYLES[row.level] ?? LEVEL_STYLES.low}`,
                                                                    children: row.level
                                                                }, void 0, false, {
                                                                    fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/waste/client.tsx",
                                                                    lineNumber: 207,
                                                                    columnNumber: 29
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/waste/client.tsx",
                                                                lineNumber: 206,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, row.id, true, {
                                                        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/waste/client.tsx",
                                                        lineNumber: 189,
                                                        columnNumber: 26
                                                    }, this);
                                                })
                                            }, void 0, false, {
                                                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/waste/client.tsx",
                                                lineNumber: 178,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/waste/client.tsx",
                                        lineNumber: 166,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/waste/client.tsx",
                                    lineNumber: 165,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/waste/client.tsx",
                                lineNumber: 164,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/waste/client.tsx",
                        lineNumber: 151,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "sticky top-4",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "rounded-xl border border-zinc-200 bg-white p-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                className: "text-sm font-medium text-zinc-900",
                                                children: "Why this is flagged"
                                            }, void 0, false, {
                                                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/waste/client.tsx",
                                                lineNumber: 223,
                                                columnNumber: 17
                                            }, this),
                                            selectedAlert && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: `rounded-full px-2 py-0.5 text-xs font-medium ${LEVEL_STYLES[selectedAlert.level] ?? LEVEL_STYLES.low}`,
                                                children: selectedAlert.level
                                            }, void 0, false, {
                                                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/waste/client.tsx",
                                                lineNumber: 224,
                                                columnNumber: 35
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/waste/client.tsx",
                                        lineNumber: 222,
                                        columnNumber: 15
                                    }, this),
                                    !selectedId ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "mt-3 text-sm text-zinc-500",
                                        children: "Select an item to view details."
                                    }, void 0, false, {
                                        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/waste/client.tsx",
                                        lineNumber: 229,
                                        columnNumber: 30
                                    }, this) : detailLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "mt-3 text-sm text-zinc-500",
                                        children: "Loading…"
                                    }, void 0, false, {
                                        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/waste/client.tsx",
                                        lineNumber: 229,
                                        columnNumber: 126
                                    }, this) : detail ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "mt-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-sm font-medium text-zinc-900",
                                                        children: detail.alert.entityName
                                                    }, void 0, false, {
                                                        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/waste/client.tsx",
                                                        lineNumber: 231,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "mt-1 text-xs text-zinc-500",
                                                        children: [
                                                            detail.alert.platformCode,
                                                            " · ",
                                                            detail.alert.entityType.replace(/_/g, " ")
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/waste/client.tsx",
                                                        lineNumber: 234,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/waste/client.tsx",
                                                lineNumber: 230,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "mt-4 rounded-lg border border-zinc-200 bg-zinc-50 p-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-xs font-medium text-zinc-600",
                                                        children: "Evidence"
                                                    }, void 0, false, {
                                                        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/waste/client.tsx",
                                                        lineNumber: 240,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "mt-2 space-y-1 text-sm text-zinc-700",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-zinc-500",
                                                                        children: "Reason:"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/waste/client.tsx",
                                                                        lineNumber: 242,
                                                                        columnNumber: 28
                                                                    }, this),
                                                                    " ",
                                                                    reasonLabel(detail.alert.reason)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/waste/client.tsx",
                                                                lineNumber: 242,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-zinc-500",
                                                                        children: "Wasted spend:"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/waste/client.tsx",
                                                                        lineNumber: 243,
                                                                        columnNumber: 28
                                                                    }, this),
                                                                    " ",
                                                                    formatCurrency(microsToDollars(detail.alert.spendMicros))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/waste/client.tsx",
                                                                lineNumber: 243,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-zinc-500",
                                                                        children: "Conversions:"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/waste/client.tsx",
                                                                        lineNumber: 244,
                                                                        columnNumber: 28
                                                                    }, this),
                                                                    " ",
                                                                    formatNumber(detail.alert.conversions)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/waste/client.tsx",
                                                                lineNumber: 244,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-zinc-500",
                                                                        children: "CPA:"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/waste/client.tsx",
                                                                        lineNumber: 246,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    " ",
                                                                    detail.alert.cpa !== null ? formatCurrency(detail.alert.cpa) : "—"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/waste/client.tsx",
                                                                lineNumber: 245,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-zinc-500",
                                                                        children: "Target CPA:"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/waste/client.tsx",
                                                                        lineNumber: 249,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    " ",
                                                                    detail.alert.targetCpa !== null ? formatCurrency(detail.alert.targetCpa) : "—"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/waste/client.tsx",
                                                                lineNumber: 248,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/waste/client.tsx",
                                                        lineNumber: 241,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/waste/client.tsx",
                                                lineNumber: 239,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "mt-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-xs font-medium text-zinc-600",
                                                        children: "Recommended actions"
                                                    }, void 0, false, {
                                                        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/waste/client.tsx",
                                                        lineNumber: 255,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "mt-2 space-y-2",
                                                        children: detail.recommendedActions.map((a_0)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "rounded-lg border border-zinc-200 p-3",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex items-center justify-between",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "text-sm font-medium text-zinc-900",
                                                                                children: a_0.title
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/waste/client.tsx",
                                                                                lineNumber: 259,
                                                                                columnNumber: 29
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: `rounded-full px-2 py-0.5 text-xs font-medium ${a_0.severity === "high" ? "bg-red-100 text-red-700" : a_0.severity === "medium" ? "bg-yellow-100 text-yellow-700" : "bg-zinc-100 text-zinc-700"}`,
                                                                                children: a_0.severity
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/waste/client.tsx",
                                                                                lineNumber: 260,
                                                                                columnNumber: 29
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/waste/client.tsx",
                                                                        lineNumber: 258,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "mt-1 text-sm text-zinc-600",
                                                                        children: a_0.description
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/waste/client.tsx",
                                                                        lineNumber: 264,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, a_0.key, true, {
                                                                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/waste/client.tsx",
                                                                lineNumber: 257,
                                                                columnNumber: 61
                                                            }, this))
                                                    }, void 0, false, {
                                                        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/waste/client.tsx",
                                                        lineNumber: 256,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/waste/client.tsx",
                                                lineNumber: 254,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("details", {
                                                className: "mt-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("summary", {
                                                        className: "cursor-pointer text-sm font-medium text-zinc-700",
                                                        children: "Explainability JSON"
                                                    }, void 0, false, {
                                                        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/waste/client.tsx",
                                                        lineNumber: 270,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
                                                        className: "mt-2 max-h-[280px] overflow-auto rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-xs text-zinc-700",
                                                        children: JSON.stringify(detail.explainability, null, 2)
                                                    }, void 0, false, {
                                                        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/waste/client.tsx",
                                                        lineNumber: 273,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/waste/client.tsx",
                                                lineNumber: 269,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "mt-3 text-sm text-zinc-500",
                                        children: "No detail available."
                                    }, void 0, false, {
                                        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/waste/client.tsx",
                                        lineNumber: 277,
                                        columnNumber: 23
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/waste/client.tsx",
                                lineNumber: 221,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/waste/client.tsx",
                            lineNumber: 220,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/waste/client.tsx",
                        lineNumber: 219,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/waste/client.tsx",
                lineNumber: 150,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/waste/client.tsx",
        lineNumber: 124,
        columnNumber: 10
    }, this);
}
_s(WasteClient, "mS1LVMH806+QzxRNZd+VTwMl8RA=");
_c = WasteClient;
var _c;
__turbopack_context__.k.register(_c, "WasteClient");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=1c0b7_windsurf-project_apps_frontend_src_app_app_waste_client_tsx_1239260b._.js.map