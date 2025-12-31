module.exports = [
"[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/kpi-card.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "KpiCard",
    ()=>KpiCard,
    "KpiCardGrid",
    ()=>KpiCardGrid
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
"use client";
;
function getTrendColor(trend, invertColors = false) {
    if (trend === "neutral") return "text-zinc-500";
    if (invertColors) {
        return trend === "up" ? "text-red-600" : "text-green-600";
    }
    return trend === "up" ? "text-green-600" : "text-red-600";
}
function getTrendIcon(trend) {
    if (trend === "up") return "↑";
    if (trend === "down") return "↓";
    return "→";
}
function KpiCard({ title, value, change, changeLabel, trend = "neutral", icon, loading = false }) {
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "rounded-xl border border-zinc-200 bg-white p-6",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-between",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-4 w-24 animate-pulse rounded bg-zinc-200"
                        }, void 0, false, {
                            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/kpi-card.tsx",
                            lineNumber: 45,
                            columnNumber: 11
                        }, this),
                        icon && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-zinc-400",
                            children: icon
                        }, void 0, false, {
                            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/kpi-card.tsx",
                            lineNumber: 46,
                            columnNumber: 20
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/kpi-card.tsx",
                    lineNumber: 44,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mt-3 h-8 w-32 animate-pulse rounded bg-zinc-200"
                }, void 0, false, {
                    fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/kpi-card.tsx",
                    lineNumber: 48,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mt-2 h-4 w-20 animate-pulse rounded bg-zinc-200"
                }, void 0, false, {
                    fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/kpi-card.tsx",
                    lineNumber: 49,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/kpi-card.tsx",
            lineNumber: 43,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "rounded-xl border border-zinc-200 bg-white p-6 transition-shadow hover:shadow-sm",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-sm font-medium text-zinc-600",
                        children: title
                    }, void 0, false, {
                        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/kpi-card.tsx",
                        lineNumber: 57,
                        columnNumber: 9
                    }, this),
                    icon && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-zinc-400",
                        children: icon
                    }, void 0, false, {
                        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/kpi-card.tsx",
                        lineNumber: 58,
                        columnNumber: 18
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/kpi-card.tsx",
                lineNumber: 56,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-2 text-2xl font-semibold tracking-tight text-zinc-900",
                children: value
            }, void 0, false, {
                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/kpi-card.tsx",
                lineNumber: 61,
                columnNumber: 7
            }, this),
            change !== undefined && change !== null && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `mt-1 flex items-center gap-1 text-sm ${getTrendColor(trend)}`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: getTrendIcon(trend)
                    }, void 0, false, {
                        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/kpi-card.tsx",
                        lineNumber: 67,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: [
                            change >= 0 ? "+" : "",
                            change.toFixed(1),
                            "%"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/kpi-card.tsx",
                        lineNumber: 68,
                        columnNumber: 11
                    }, this),
                    changeLabel && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-zinc-500",
                        children: changeLabel
                    }, void 0, false, {
                        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/kpi-card.tsx",
                        lineNumber: 73,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/kpi-card.tsx",
                lineNumber: 66,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/kpi-card.tsx",
        lineNumber: 55,
        columnNumber: 5
    }, this);
}
function KpiCardGrid({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
        children: children
    }, void 0, false, {
        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/kpi-card.tsx",
        lineNumber: 83,
        columnNumber: 5
    }, this);
}
}),
"[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/timeseries-chart.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TimeseriesChart",
    ()=>TimeseriesChart,
    "TimeseriesChartCard",
    ()=>TimeseriesChartCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
const METRIC_CONFIG = {
    spend: {
        label: "Spend",
        color: "#3b82f6",
        format: (v)=>`$${v.toLocaleString(undefined, {
                maximumFractionDigits: 0
            })}`
    },
    revenue: {
        label: "Revenue",
        color: "#10b981",
        format: (v)=>`$${v.toLocaleString(undefined, {
                maximumFractionDigits: 0
            })}`
    },
    conversions: {
        label: "Conversions",
        color: "#8b5cf6",
        format: (v)=>v.toLocaleString(undefined, {
                maximumFractionDigits: 0
            })
    },
    roas: {
        label: "ROAS",
        color: "#f59e0b",
        format: (v)=>`${v.toFixed(2)}x`
    },
    cpa: {
        label: "CPA",
        color: "#ef4444",
        format: (v)=>`$${v.toFixed(2)}`
    }
};
function TimeseriesChart({ data, metric, height = 200, showGrid = true }) {
    const config = METRIC_CONFIG[metric];
    const { points, minY, maxY, yTicks } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        if (data.length === 0) {
            return {
                points: [],
                minY: 0,
                maxY: 100,
                yTicks: [
                    0,
                    50,
                    100
                ]
            };
        }
        const values = data.map((d)=>d[metric] ?? 0);
        const min = Math.min(...values);
        const max = Math.max(...values);
        const range = max - min || 1;
        const padding = range * 0.1;
        const minY = Math.max(0, min - padding);
        const maxY = max + padding;
        const tickCount = 5;
        const tickStep = (maxY - minY) / (tickCount - 1);
        const yTicks = Array.from({
            length: tickCount
        }, (_, i)=>minY + i * tickStep);
        const width = 100;
        const pts = data.map((d, i)=>{
            const x = data.length === 1 ? 50 : i / (data.length - 1) * width;
            const y = maxY === minY ? 50 : 100 - ((d[metric] ?? 0) - minY) / (maxY - minY) * 100;
            return {
                x,
                y,
                value: d[metric] ?? 0,
                date: d.date
            };
        });
        return {
            points: pts,
            minY,
            maxY,
            yTicks
        };
    }, [
        data,
        metric
    ]);
    if (data.length === 0) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50",
            style: {
                height
            },
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "text-sm text-zinc-500",
                children: "No data available"
            }, void 0, false, {
                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/timeseries-chart.tsx",
                lineNumber: 68,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/timeseries-chart.tsx",
            lineNumber: 67,
            columnNumber: 7
        }, this);
    }
    const pathD = points.length > 0 ? `M ${points.map((p)=>`${p.x},${p.y}`).join(" L ")}` : "";
    const areaD = points.length > 0 ? `M ${points[0].x},100 L ${points.map((p)=>`${p.x},${p.y}`).join(" L ")} L ${points[points.length - 1].x},100 Z` : "";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative",
        style: {
            height
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                viewBox: "0 0 100 100",
                preserveAspectRatio: "none",
                className: "h-full w-full",
                children: [
                    showGrid && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                        className: "text-zinc-200",
                        children: yTicks.map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                x1: "0",
                                y1: 100 - i / (yTicks.length - 1) * 100,
                                x2: "100",
                                y2: 100 - i / (yTicks.length - 1) * 100,
                                stroke: "currentColor",
                                strokeWidth: "0.2"
                            }, i, false, {
                                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/timeseries-chart.tsx",
                                lineNumber: 91,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/timeseries-chart.tsx",
                        lineNumber: 89,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("defs", {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("linearGradient", {
                            id: `gradient-${metric}`,
                            x1: "0",
                            y1: "0",
                            x2: "0",
                            y2: "1",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                    offset: "0%",
                                    stopColor: config.color,
                                    stopOpacity: "0.3"
                                }, void 0, false, {
                                    fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/timeseries-chart.tsx",
                                    lineNumber: 106,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                    offset: "100%",
                                    stopColor: config.color,
                                    stopOpacity: "0"
                                }, void 0, false, {
                                    fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/timeseries-chart.tsx",
                                    lineNumber: 107,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/timeseries-chart.tsx",
                            lineNumber: 105,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/timeseries-chart.tsx",
                        lineNumber: 104,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: areaD,
                        fill: `url(#gradient-${metric})`
                    }, void 0, false, {
                        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/timeseries-chart.tsx",
                        lineNumber: 111,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: pathD,
                        fill: "none",
                        stroke: config.color,
                        strokeWidth: "0.5",
                        vectorEffect: "non-scaling-stroke"
                    }, void 0, false, {
                        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/timeseries-chart.tsx",
                        lineNumber: 116,
                        columnNumber: 9
                    }, this),
                    points.map((p, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                            cx: p.x,
                            cy: p.y,
                            r: "0.8",
                            fill: config.color,
                            className: "opacity-0 hover:opacity-100 transition-opacity"
                        }, i, false, {
                            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/timeseries-chart.tsx",
                            lineNumber: 125,
                            columnNumber: 11
                        }, this))
                ]
            }, void 0, true, {
                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/timeseries-chart.tsx",
                lineNumber: 83,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute left-0 top-0 flex h-full flex-col justify-between py-1 text-[10px] text-zinc-500",
                children: yTicks.slice().reverse().map((tick, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: config.format(tick)
                    }, i, false, {
                        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/timeseries-chart.tsx",
                        lineNumber: 138,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/timeseries-chart.tsx",
                lineNumber: 136,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute bottom-0 left-8 right-0 flex justify-between text-[10px] text-zinc-500",
                children: data.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            children: data[0].date
                        }, void 0, false, {
                            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/timeseries-chart.tsx",
                            lineNumber: 145,
                            columnNumber: 13
                        }, this),
                        data.length > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            children: data[data.length - 1].date
                        }, void 0, false, {
                            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/timeseries-chart.tsx",
                            lineNumber: 146,
                            columnNumber: 33
                        }, this)
                    ]
                }, void 0, true)
            }, void 0, false, {
                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/timeseries-chart.tsx",
                lineNumber: 142,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/timeseries-chart.tsx",
        lineNumber: 82,
        columnNumber: 5
    }, this);
}
function TimeseriesChartCard({ title, data, metric, currentValue, change }) {
    const config = METRIC_CONFIG[metric];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "rounded-xl border border-zinc-200 bg-white p-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-3 flex items-center justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-sm font-medium text-zinc-600",
                                children: title
                            }, void 0, false, {
                                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/timeseries-chart.tsx",
                                lineNumber: 173,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-1 flex items-baseline gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xl font-semibold text-zinc-900",
                                        children: currentValue
                                    }, void 0, false, {
                                        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/timeseries-chart.tsx",
                                        lineNumber: 175,
                                        columnNumber: 13
                                    }, this),
                                    change !== undefined && change !== null && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: `text-sm ${change >= 0 ? "text-green-600" : "text-red-600"}`,
                                        children: [
                                            change >= 0 ? "+" : "",
                                            change.toFixed(1),
                                            "%"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/timeseries-chart.tsx",
                                        lineNumber: 177,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/timeseries-chart.tsx",
                                lineNumber: 174,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/timeseries-chart.tsx",
                        lineNumber: 172,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "h-3 w-3 rounded-full",
                        style: {
                            backgroundColor: config.color
                        }
                    }, void 0, false, {
                        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/timeseries-chart.tsx",
                        lineNumber: 183,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/timeseries-chart.tsx",
                lineNumber: 171,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(TimeseriesChart, {
                data: data,
                metric: metric,
                height: 120
            }, void 0, false, {
                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/timeseries-chart.tsx",
                lineNumber: 188,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/timeseries-chart.tsx",
        lineNumber: 170,
        columnNumber: 5
    }, this);
}
}),
"[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/breakdown-table.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BreakdownTable",
    ()=>BreakdownTable
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
const PLATFORM_LABELS = {
    GOOGLE_ADS: "Google",
    META: "Meta",
    TIKTOK: "TikTok",
    LINKEDIN: "LinkedIn"
};
function formatCurrency(value) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);
}
function formatNumber(value) {
    return new Intl.NumberFormat("en-US").format(Math.round(value));
}
function BreakdownTable({ data, entityLabel = "Campaign" }) {
    const [sortKey, setSortKey] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("spend");
    const [sortDir, setSortDir] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("desc");
    const sorted = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        return [
            ...data
        ].sort((a, b)=>{
            const aVal = a[sortKey] ?? 0;
            const bVal = b[sortKey] ?? 0;
            return sortDir === "desc" ? bVal - aVal : aVal - bVal;
        });
    }, [
        data,
        sortKey,
        sortDir
    ]);
    function handleSort(key) {
        if (sortKey === key) {
            setSortDir(sortDir === "desc" ? "asc" : "desc");
        } else {
            setSortKey(key);
            setSortDir("desc");
        }
    }
    function SortHeader({ label, field }) {
        const isActive = sortKey === field;
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
            className: "cursor-pointer px-3 py-2 text-right text-xs font-medium text-zinc-500 hover:text-zinc-700",
            onClick: ()=>handleSort(field),
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "inline-flex items-center gap-1",
                children: [
                    label,
                    isActive && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-zinc-400",
                        children: sortDir === "desc" ? "↓" : "↑"
                    }, void 0, false, {
                        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/breakdown-table.tsx",
                        lineNumber: 77,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/breakdown-table.tsx",
                lineNumber: 74,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/breakdown-table.tsx",
            lineNumber: 70,
            columnNumber: 7
        }, this);
    }
    if (data.length === 0) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "rounded-xl border border-zinc-200 bg-white p-6",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-center text-sm text-zinc-500",
                children: "No data available"
            }, void 0, false, {
                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/breakdown-table.tsx",
                lineNumber: 87,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/breakdown-table.tsx",
            lineNumber: 86,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "overflow-hidden rounded-xl border border-zinc-200 bg-white",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "overflow-x-auto",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                className: "w-full min-w-[700px]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                        className: "border-b border-zinc-100 bg-zinc-50",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                    className: "px-4 py-2 text-left text-xs font-medium text-zinc-500",
                                    children: entityLabel
                                }, void 0, false, {
                                    fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/breakdown-table.tsx",
                                    lineNumber: 98,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                    className: "px-3 py-2 text-left text-xs font-medium text-zinc-500",
                                    children: "Channel"
                                }, void 0, false, {
                                    fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/breakdown-table.tsx",
                                    lineNumber: 101,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(SortHeader, {
                                    label: "Spend",
                                    field: "spend"
                                }, void 0, false, {
                                    fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/breakdown-table.tsx",
                                    lineNumber: 104,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(SortHeader, {
                                    label: "Revenue",
                                    field: "revenue"
                                }, void 0, false, {
                                    fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/breakdown-table.tsx",
                                    lineNumber: 105,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(SortHeader, {
                                    label: "ROAS",
                                    field: "roas"
                                }, void 0, false, {
                                    fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/breakdown-table.tsx",
                                    lineNumber: 106,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(SortHeader, {
                                    label: "CPA",
                                    field: "cpa"
                                }, void 0, false, {
                                    fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/breakdown-table.tsx",
                                    lineNumber: 107,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(SortHeader, {
                                    label: "Conv.",
                                    field: "conversions"
                                }, void 0, false, {
                                    fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/breakdown-table.tsx",
                                    lineNumber: 108,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(SortHeader, {
                                    label: "Clicks",
                                    field: "clicks"
                                }, void 0, false, {
                                    fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/breakdown-table.tsx",
                                    lineNumber: 109,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(SortHeader, {
                                    label: "Impr.",
                                    field: "impressions"
                                }, void 0, false, {
                                    fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/breakdown-table.tsx",
                                    lineNumber: 110,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/breakdown-table.tsx",
                            lineNumber: 97,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/breakdown-table.tsx",
                        lineNumber: 96,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                        className: "divide-y divide-zinc-100",
                        children: sorted.map((row)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                className: "hover:bg-zinc-50",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                        className: "max-w-[200px] truncate px-4 py-3 text-sm font-medium text-zinc-900",
                                        children: row.entityName
                                    }, void 0, false, {
                                        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/breakdown-table.tsx",
                                        lineNumber: 116,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                        className: "px-3 py-3",
                                        children: row.platformCode && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "inline-flex rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600",
                                            children: PLATFORM_LABELS[row.platformCode] ?? row.platformCode
                                        }, void 0, false, {
                                            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/breakdown-table.tsx",
                                            lineNumber: 121,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/breakdown-table.tsx",
                                        lineNumber: 119,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                        className: "px-3 py-3 text-right text-sm text-zinc-700",
                                        children: formatCurrency(row.spend)
                                    }, void 0, false, {
                                        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/breakdown-table.tsx",
                                        lineNumber: 126,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                        className: "px-3 py-3 text-right text-sm text-zinc-700",
                                        children: formatCurrency(row.revenue)
                                    }, void 0, false, {
                                        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/breakdown-table.tsx",
                                        lineNumber: 129,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                        className: "px-3 py-3 text-right text-sm",
                                        children: row.roas !== null ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: row.roas >= 1 ? "text-green-600" : "text-red-600",
                                            children: [
                                                row.roas.toFixed(2),
                                                "x"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/breakdown-table.tsx",
                                            lineNumber: 134,
                                            columnNumber: 21
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-zinc-400",
                                            children: "—"
                                        }, void 0, false, {
                                            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/breakdown-table.tsx",
                                            lineNumber: 138,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/breakdown-table.tsx",
                                        lineNumber: 132,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                        className: "px-3 py-3 text-right text-sm text-zinc-700",
                                        children: row.cpa !== null ? formatCurrency(row.cpa) : "—"
                                    }, void 0, false, {
                                        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/breakdown-table.tsx",
                                        lineNumber: 141,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                        className: "px-3 py-3 text-right text-sm text-zinc-700",
                                        children: formatNumber(row.conversions)
                                    }, void 0, false, {
                                        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/breakdown-table.tsx",
                                        lineNumber: 144,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                        className: "px-3 py-3 text-right text-sm text-zinc-700",
                                        children: formatNumber(row.clicks)
                                    }, void 0, false, {
                                        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/breakdown-table.tsx",
                                        lineNumber: 147,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                        className: "px-3 py-3 text-right text-sm text-zinc-700",
                                        children: formatNumber(row.impressions)
                                    }, void 0, false, {
                                        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/breakdown-table.tsx",
                                        lineNumber: 150,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, row.entityId, true, {
                                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/breakdown-table.tsx",
                                lineNumber: 115,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/breakdown-table.tsx",
                        lineNumber: 113,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/breakdown-table.tsx",
                lineNumber: 95,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/breakdown-table.tsx",
            lineNumber: 94,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/breakdown-table.tsx",
        lineNumber: 93,
        columnNumber: 5
    }, this);
}
}),
"[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/filters.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DashboardFilters",
    ()=>DashboardFilters,
    "getDefaultFilters",
    ()=>getDefaultFilters
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
const CHANNEL_OPTIONS = [
    {
        value: "GOOGLE_ADS",
        label: "Google Ads"
    },
    {
        value: "META",
        label: "Meta"
    },
    {
        value: "TIKTOK",
        label: "TikTok"
    },
    {
        value: "LINKEDIN",
        label: "LinkedIn"
    }
];
const DATE_PRESETS = [
    {
        label: "Last 7 days",
        days: 7
    },
    {
        label: "Last 14 days",
        days: 14
    },
    {
        label: "Last 30 days",
        days: 30
    },
    {
        label: "Last 90 days",
        days: 90
    }
];
function formatDateForInput(date) {
    return date.toISOString().split("T")[0];
}
function getPresetDates(days) {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days + 1);
    return {
        start: formatDateForInput(start),
        end: formatDateForInput(end)
    };
}
function DashboardFilters({ value, onChange }) {
    const [showChannelDropdown, setShowChannelDropdown] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const handlePreset = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((days)=>{
        const { start, end } = getPresetDates(days);
        onChange({
            ...value,
            startDate: start,
            endDate: end
        });
    }, [
        value,
        onChange
    ]);
    const toggleChannel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((channel)=>{
        const channels = value.channels.includes(channel) ? value.channels.filter((c)=>c !== channel) : [
            ...value.channels,
            channel
        ];
        onChange({
            ...value,
            channels
        });
    }, [
        value,
        onChange
    ]);
    const clearChannels = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        onChange({
            ...value,
            channels: []
        });
    }, [
        value,
        onChange
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-wrap items-center gap-3",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-2",
                children: DATE_PRESETS.map((preset)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>handlePreset(preset.days),
                        className: "rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-700 hover:bg-zinc-50",
                        children: preset.label
                    }, preset.days, false, {
                        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/filters.tsx",
                        lineNumber: 69,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/filters.tsx",
                lineNumber: 67,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "date",
                        value: value.startDate,
                        onChange: (e)=>onChange({
                                ...value,
                                startDate: e.target.value
                            }),
                        className: "rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-700"
                    }, void 0, false, {
                        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/filters.tsx",
                        lineNumber: 80,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-zinc-400",
                        children: "to"
                    }, void 0, false, {
                        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/filters.tsx",
                        lineNumber: 86,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "date",
                        value: value.endDate,
                        onChange: (e)=>onChange({
                                ...value,
                                endDate: e.target.value
                            }),
                        className: "rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-700"
                    }, void 0, false, {
                        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/filters.tsx",
                        lineNumber: 87,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/filters.tsx",
                lineNumber: 79,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setShowChannelDropdown(!showChannelDropdown),
                        className: "inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-700 hover:bg-zinc-50",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: value.channels.length === 0 ? "All Channels" : `${value.channels.length} channel${value.channels.length > 1 ? "s" : ""}`
                            }, void 0, false, {
                                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/filters.tsx",
                                lineNumber: 100,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                className: "h-4 w-4",
                                fill: "none",
                                stroke: "currentColor",
                                viewBox: "0 0 24 24",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    strokeLinecap: "round",
                                    strokeLinejoin: "round",
                                    strokeWidth: 2,
                                    d: "M19 9l-7 7-7-7"
                                }, void 0, false, {
                                    fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/filters.tsx",
                                    lineNumber: 106,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/filters.tsx",
                                lineNumber: 105,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/filters.tsx",
                        lineNumber: 96,
                        columnNumber: 9
                    }, this),
                    showChannelDropdown && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute left-0 top-full z-10 mt-1 w-48 rounded-lg border border-zinc-200 bg-white py-1 shadow-lg",
                        children: [
                            value.channels.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: clearChannels,
                                className: "w-full px-3 py-2 text-left text-sm text-zinc-500 hover:bg-zinc-50",
                                children: "Clear all"
                            }, void 0, false, {
                                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/filters.tsx",
                                lineNumber: 113,
                                columnNumber: 15
                            }, this),
                            CHANNEL_OPTIONS.map((opt)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "flex cursor-pointer items-center gap-2 px-3 py-2 hover:bg-zinc-50",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "checkbox",
                                            checked: value.channels.includes(opt.value),
                                            onChange: ()=>toggleChannel(opt.value),
                                            className: "h-4 w-4 rounded border-zinc-300"
                                        }, void 0, false, {
                                            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/filters.tsx",
                                            lineNumber: 125,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-sm text-zinc-700",
                                            children: opt.label
                                        }, void 0, false, {
                                            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/filters.tsx",
                                            lineNumber: 131,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, opt.value, true, {
                                    fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/filters.tsx",
                                    lineNumber: 121,
                                    columnNumber: 15
                                }, this))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/filters.tsx",
                        lineNumber: 111,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/filters.tsx",
                lineNumber: 95,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                value: value.granularity,
                onChange: (e)=>onChange({
                        ...value,
                        granularity: e.target.value
                    }),
                className: "rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-700",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                        value: "day",
                        children: "Daily"
                    }, void 0, false, {
                        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/filters.tsx",
                        lineNumber: 143,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                        value: "week",
                        children: "Weekly"
                    }, void 0, false, {
                        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/filters.tsx",
                        lineNumber: 144,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                        value: "month",
                        children: "Monthly"
                    }, void 0, false, {
                        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/filters.tsx",
                        lineNumber: 145,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/filters.tsx",
                lineNumber: 138,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                value: value.breakdown,
                onChange: (e)=>onChange({
                        ...value,
                        breakdown: e.target.value
                    }),
                className: "rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-700",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                        value: "platform",
                        children: "By Channel"
                    }, void 0, false, {
                        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/filters.tsx",
                        lineNumber: 153,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                        value: "campaign",
                        children: "By Campaign"
                    }, void 0, false, {
                        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/filters.tsx",
                        lineNumber: 154,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                        value: "ad",
                        children: "By Ad"
                    }, void 0, false, {
                        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/filters.tsx",
                        lineNumber: 155,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/filters.tsx",
                lineNumber: 148,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/filters.tsx",
        lineNumber: 66,
        columnNumber: 5
    }, this);
}
function getDefaultFilters() {
    const { start, end } = getPresetDates(30);
    return {
        startDate: start,
        endDate: end,
        channels: [],
        granularity: "day",
        breakdown: "campaign"
    };
}
}),
"[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/index.ts [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$components$2f$dashboard$2f$kpi$2d$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/kpi-card.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$components$2f$dashboard$2f$timeseries$2d$chart$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/timeseries-chart.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$components$2f$dashboard$2f$breakdown$2d$table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/breakdown-table.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$components$2f$dashboard$2f$filters$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/filters.tsx [app-ssr] (ecmascript)");
;
;
;
;
}),
"[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/roi/client.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "RoiDashboardClient",
    ()=>RoiDashboardClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$components$2f$dashboard$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/index.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$components$2f$dashboard$2f$kpi$2d$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/kpi-card.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$components$2f$dashboard$2f$timeseries$2d$chart$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/timeseries-chart.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$components$2f$dashboard$2f$breakdown$2d$table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/breakdown-table.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$components$2f$dashboard$2f$filters$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/filters.tsx [app-ssr] (ecmascript)");
"use client";
;
;
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
    return new Intl.NumberFormat("en-US").format(Math.round(value));
}
function formatPercent(value) {
    return `${value.toFixed(1)}%`;
}
function getTrend(change, invert = false) {
    if (change === null || change === 0) return "neutral";
    const isUp = change > 0;
    if (invert) return isUp ? "down" : "up";
    return isUp ? "up" : "down";
}
function RoiDashboardClient() {
    const [filters, setFilters] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$components$2f$dashboard$2f$filters$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getDefaultFilters"]);
    const [data, setData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const fetchData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        setLoading(true);
        setError(null);
        const params = new URLSearchParams({
            startDate: filters.startDate,
            endDate: filters.endDate,
            granularity: filters.granularity,
            breakdown: filters.breakdown
        });
        if (filters.channels.length > 0) {
            params.set("channels", filters.channels.join(","));
        }
        try {
            const res = await fetch(`/api/dashboard/roi?${params.toString()}`);
            if (!res.ok) {
                throw new Error("Failed to fetch dashboard data");
            }
            const json = await res.json();
            setData(json);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error");
        } finally{
            setLoading(false);
        }
    }, [
        filters
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        fetchData();
    }, [
        fetchData
    ]);
    const breakdownLabel = filters.breakdown === "platform" ? "Channel" : filters.breakdown === "campaign" ? "Campaign" : "Ad";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-2xl font-semibold tracking-tight",
                        children: "ROI Dashboard"
                    }, void 0, false, {
                        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/roi/client.tsx",
                        lineNumber: 113,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-1 text-sm text-zinc-600",
                        children: "Multi-touch attribution ROI, ROAS, CPA, and waste analysis"
                    }, void 0, false, {
                        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/roi/client.tsx",
                        lineNumber: 114,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/roi/client.tsx",
                lineNumber: 112,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$components$2f$dashboard$2f$filters$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DashboardFilters"], {
                value: filters,
                onChange: setFilters
            }, void 0, false, {
                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/roi/client.tsx",
                lineNumber: 119,
                columnNumber: 7
            }, this),
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700",
                children: error
            }, void 0, false, {
                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/roi/client.tsx",
                lineNumber: 122,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$components$2f$dashboard$2f$kpi$2d$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["KpiCardGrid"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$components$2f$dashboard$2f$kpi$2d$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["KpiCard"], {
                        title: "Total Spend",
                        value: data ? formatCurrency(data.kpis.spend) : "$0.00",
                        change: data?.kpis.changes?.spend ?? null,
                        changeLabel: "vs last period",
                        trend: getTrend(data?.kpis.changes?.spend ?? null),
                        loading: loading,
                        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(SpendIcon, {}, void 0, false, {
                            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/roi/client.tsx",
                            lineNumber: 135,
                            columnNumber: 17
                        }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/roi/client.tsx",
                        lineNumber: 128,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$components$2f$dashboard$2f$kpi$2d$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["KpiCard"], {
                        title: "Attributed Revenue",
                        value: data ? formatCurrency(data.kpis.revenue) : "$0.00",
                        change: data?.kpis.changes?.revenue ?? null,
                        changeLabel: "vs last period",
                        trend: getTrend(data?.kpis.changes?.revenue ?? null),
                        loading: loading,
                        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(RevenueIcon, {}, void 0, false, {
                            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/roi/client.tsx",
                            lineNumber: 144,
                            columnNumber: 17
                        }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/roi/client.tsx",
                        lineNumber: 137,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$components$2f$dashboard$2f$kpi$2d$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["KpiCard"], {
                        title: "ROAS",
                        value: data?.kpis.roas ? `${data.kpis.roas.toFixed(2)}x` : "—",
                        change: data?.kpis.changes?.roas ?? null,
                        changeLabel: "vs last period",
                        trend: getTrend(data?.kpis.changes?.roas ?? null),
                        loading: loading,
                        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(RoasIcon, {}, void 0, false, {
                            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/roi/client.tsx",
                            lineNumber: 153,
                            columnNumber: 17
                        }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/roi/client.tsx",
                        lineNumber: 146,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$components$2f$dashboard$2f$kpi$2d$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["KpiCard"], {
                        title: "CPA",
                        value: data?.kpis.cpa ? formatCurrency(data.kpis.cpa) : "—",
                        change: data?.kpis.changes?.cpa ?? null,
                        changeLabel: "vs last period",
                        trend: getTrend(data?.kpis.changes?.cpa ?? null, true),
                        loading: loading,
                        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(CpaIcon, {}, void 0, false, {
                            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/roi/client.tsx",
                            lineNumber: 162,
                            columnNumber: 17
                        }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/roi/client.tsx",
                        lineNumber: 155,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/roi/client.tsx",
                lineNumber: 127,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$components$2f$dashboard$2f$kpi$2d$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["KpiCardGrid"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$components$2f$dashboard$2f$kpi$2d$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["KpiCard"], {
                        title: "Wasted Spend",
                        value: data ? formatCurrency(data.kpis.wasteAmount) : "$0.00",
                        loading: loading,
                        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(WasteIcon, {}, void 0, false, {
                            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/roi/client.tsx",
                            lineNumber: 171,
                            columnNumber: 17
                        }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/roi/client.tsx",
                        lineNumber: 167,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$components$2f$dashboard$2f$kpi$2d$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["KpiCard"], {
                        title: "Waste %",
                        value: data ? formatPercent(data.kpis.wastePercent) : "0.0%",
                        change: data?.kpis.changes?.wastePercent ?? null,
                        changeLabel: "vs last period",
                        trend: getTrend(data?.kpis.changes?.wastePercent ?? null, true),
                        loading: loading,
                        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(WastePercentIcon, {}, void 0, false, {
                            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/roi/client.tsx",
                            lineNumber: 180,
                            columnNumber: 17
                        }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/roi/client.tsx",
                        lineNumber: 173,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$components$2f$dashboard$2f$kpi$2d$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["KpiCard"], {
                        title: "Conversions",
                        value: data ? formatNumber(data.kpis.conversions) : "0",
                        change: data?.kpis.changes?.conversions ?? null,
                        changeLabel: "vs last period",
                        trend: getTrend(data?.kpis.changes?.conversions ?? null),
                        loading: loading,
                        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ConversionIcon, {}, void 0, false, {
                            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/roi/client.tsx",
                            lineNumber: 189,
                            columnNumber: 17
                        }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/roi/client.tsx",
                        lineNumber: 182,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$components$2f$dashboard$2f$kpi$2d$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["KpiCard"], {
                        title: "Clicks",
                        value: data ? formatNumber(data.kpis.clicks) : "0",
                        loading: loading,
                        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ClickIcon, {}, void 0, false, {
                            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/roi/client.tsx",
                            lineNumber: 195,
                            columnNumber: 17
                        }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/roi/client.tsx",
                        lineNumber: 191,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/roi/client.tsx",
                lineNumber: 166,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-xl border border-zinc-200 bg-white p-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "mb-4 text-sm font-medium text-zinc-900",
                        children: "Trendlines"
                    }, void 0, false, {
                        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/roi/client.tsx",
                        lineNumber: 200,
                        columnNumber: 9
                    }, this),
                    loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid gap-4 md:grid-cols-2 lg:grid-cols-3",
                        children: [
                            1,
                            2,
                            3
                        ].map((i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "h-[180px] animate-pulse rounded-lg bg-zinc-100"
                            }, i, false, {
                                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/roi/client.tsx",
                                lineNumber: 204,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/roi/client.tsx",
                        lineNumber: 202,
                        columnNumber: 11
                    }, this) : data ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid gap-4 md:grid-cols-2 lg:grid-cols-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$components$2f$dashboard$2f$timeseries$2d$chart$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TimeseriesChartCard"], {
                                title: "Spend",
                                data: data.timeseries,
                                metric: "spend",
                                currentValue: formatCurrency(data.kpis.spend),
                                change: data.kpis.changes?.spend
                            }, void 0, false, {
                                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/roi/client.tsx",
                                lineNumber: 209,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$components$2f$dashboard$2f$timeseries$2d$chart$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TimeseriesChartCard"], {
                                title: "Revenue",
                                data: data.timeseries,
                                metric: "revenue",
                                currentValue: formatCurrency(data.kpis.revenue),
                                change: data.kpis.changes?.revenue
                            }, void 0, false, {
                                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/roi/client.tsx",
                                lineNumber: 216,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$components$2f$dashboard$2f$timeseries$2d$chart$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TimeseriesChartCard"], {
                                title: "ROAS",
                                data: data.timeseries,
                                metric: "roas",
                                currentValue: data.kpis.roas ? `${data.kpis.roas.toFixed(2)}x` : "—",
                                change: data.kpis.changes?.roas
                            }, void 0, false, {
                                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/roi/client.tsx",
                                lineNumber: 223,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/roi/client.tsx",
                        lineNumber: 208,
                        columnNumber: 11
                    }, this) : null
                ]
            }, void 0, true, {
                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/roi/client.tsx",
                lineNumber: 199,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "mb-4 text-sm font-medium text-zinc-900",
                        children: [
                            "Breakdown by ",
                            breakdownLabel
                        ]
                    }, void 0, true, {
                        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/roi/client.tsx",
                        lineNumber: 235,
                        columnNumber: 9
                    }, this),
                    loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "h-[300px] animate-pulse rounded-xl bg-zinc-100"
                    }, void 0, false, {
                        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/roi/client.tsx",
                        lineNumber: 239,
                        columnNumber: 11
                    }, this) : data ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$components$2f$dashboard$2f$breakdown$2d$table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BreakdownTable"], {
                        data: data.breakdown,
                        entityLabel: breakdownLabel
                    }, void 0, false, {
                        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/roi/client.tsx",
                        lineNumber: 241,
                        columnNumber: 11
                    }, this) : null
                ]
            }, void 0, true, {
                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/roi/client.tsx",
                lineNumber: 234,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/roi/client.tsx",
        lineNumber: 111,
        columnNumber: 5
    }, this);
}
function SpendIcon() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: "h-5 w-5",
        fill: "none",
        stroke: "currentColor",
        viewBox: "0 0 24 24",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeWidth: 1.5,
            d: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        }, void 0, false, {
            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/roi/client.tsx",
            lineNumber: 251,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/roi/client.tsx",
        lineNumber: 250,
        columnNumber: 5
    }, this);
}
function RevenueIcon() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: "h-5 w-5",
        fill: "none",
        stroke: "currentColor",
        viewBox: "0 0 24 24",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeWidth: 1.5,
            d: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
        }, void 0, false, {
            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/roi/client.tsx",
            lineNumber: 259,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/roi/client.tsx",
        lineNumber: 258,
        columnNumber: 5
    }, this);
}
function RoasIcon() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: "h-5 w-5",
        fill: "none",
        stroke: "currentColor",
        viewBox: "0 0 24 24",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeWidth: 1.5,
            d: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        }, void 0, false, {
            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/roi/client.tsx",
            lineNumber: 267,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/roi/client.tsx",
        lineNumber: 266,
        columnNumber: 5
    }, this);
}
function CpaIcon() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: "h-5 w-5",
        fill: "none",
        stroke: "currentColor",
        viewBox: "0 0 24 24",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeWidth: 1.5,
            d: "M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
        }, void 0, false, {
            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/roi/client.tsx",
            lineNumber: 275,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/roi/client.tsx",
        lineNumber: 274,
        columnNumber: 5
    }, this);
}
function WasteIcon() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: "h-5 w-5",
        fill: "none",
        stroke: "currentColor",
        viewBox: "0 0 24 24",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeWidth: 1.5,
            d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        }, void 0, false, {
            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/roi/client.tsx",
            lineNumber: 283,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/roi/client.tsx",
        lineNumber: 282,
        columnNumber: 5
    }, this);
}
function WastePercentIcon() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: "h-5 w-5",
        fill: "none",
        stroke: "currentColor",
        viewBox: "0 0 24 24",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeWidth: 1.5,
            d: "M19 14l-7 7m0 0l-7-7m7 7V3"
        }, void 0, false, {
            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/roi/client.tsx",
            lineNumber: 291,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/roi/client.tsx",
        lineNumber: 290,
        columnNumber: 5
    }, this);
}
function ConversionIcon() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: "h-5 w-5",
        fill: "none",
        stroke: "currentColor",
        viewBox: "0 0 24 24",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeWidth: 1.5,
            d: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        }, void 0, false, {
            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/roi/client.tsx",
            lineNumber: 299,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/roi/client.tsx",
        lineNumber: 298,
        columnNumber: 5
    }, this);
}
function ClickIcon() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: "h-5 w-5",
        fill: "none",
        stroke: "currentColor",
        viewBox: "0 0 24 24",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeWidth: 1.5,
            d: "M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
        }, void 0, false, {
            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/roi/client.tsx",
            lineNumber: 307,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/roi/client.tsx",
        lineNumber: 306,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=13466_Desktop_Optiq_CascadeProjects_windsurf-project_apps_frontend_src_f3820943._.js.map