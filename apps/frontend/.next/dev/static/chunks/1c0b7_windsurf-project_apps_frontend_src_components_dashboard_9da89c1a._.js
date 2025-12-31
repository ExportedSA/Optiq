(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/kpi-card.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "KpiCard",
    ()=>KpiCard,
    "KpiCardGrid",
    ()=>KpiCardGrid
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
"use client";
;
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
function KpiCard(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(27);
    if ($[0] !== "c6b80d3938d1dfcf5d34f8c22a9d522b06cef7347d88c4140ca5acdc4c2a42f7") {
        for(let $i = 0; $i < 27; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "c6b80d3938d1dfcf5d34f8c22a9d522b06cef7347d88c4140ca5acdc4c2a42f7";
    }
    const { title, value, change, changeLabel, trend: t1, icon, loading: t2 } = t0;
    const trend = t1 === undefined ? "neutral" : t1;
    const loading = t2 === undefined ? false : t2;
    if (loading) {
        let t3;
        if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
            t3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "h-4 w-24 animate-pulse rounded bg-zinc-200"
            }, void 0, false, {
                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/kpi-card.tsx",
                lineNumber: 50,
                columnNumber: 12
            }, this);
            $[1] = t3;
        } else {
            t3 = $[1];
        }
        let t4;
        if ($[2] !== icon) {
            t4 = icon && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-zinc-400",
                children: icon
            }, void 0, false, {
                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/kpi-card.tsx",
                lineNumber: 57,
                columnNumber: 20
            }, this);
            $[2] = icon;
            $[3] = t4;
        } else {
            t4 = $[3];
        }
        let t5;
        if ($[4] !== t4) {
            t5 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between",
                children: [
                    t3,
                    t4
                ]
            }, void 0, true, {
                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/kpi-card.tsx",
                lineNumber: 65,
                columnNumber: 12
            }, this);
            $[4] = t4;
            $[5] = t5;
        } else {
            t5 = $[5];
        }
        let t6;
        let t7;
        if ($[6] === Symbol.for("react.memo_cache_sentinel")) {
            t6 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-3 h-8 w-32 animate-pulse rounded bg-zinc-200"
            }, void 0, false, {
                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/kpi-card.tsx",
                lineNumber: 74,
                columnNumber: 12
            }, this);
            t7 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-2 h-4 w-20 animate-pulse rounded bg-zinc-200"
            }, void 0, false, {
                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/kpi-card.tsx",
                lineNumber: 75,
                columnNumber: 12
            }, this);
            $[6] = t6;
            $[7] = t7;
        } else {
            t6 = $[6];
            t7 = $[7];
        }
        let t8;
        if ($[8] !== t5) {
            t8 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-xl border border-zinc-200 bg-white p-6",
                children: [
                    t5,
                    t6,
                    t7
                ]
            }, void 0, true, {
                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/kpi-card.tsx",
                lineNumber: 84,
                columnNumber: 12
            }, this);
            $[8] = t5;
            $[9] = t8;
        } else {
            t8 = $[9];
        }
        return t8;
    }
    let t3;
    if ($[10] !== title) {
        t3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: "text-sm font-medium text-zinc-600",
            children: title
        }, void 0, false, {
            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/kpi-card.tsx",
            lineNumber: 94,
            columnNumber: 10
        }, this);
        $[10] = title;
        $[11] = t3;
    } else {
        t3 = $[11];
    }
    let t4;
    if ($[12] !== icon) {
        t4 = icon && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "text-zinc-400",
            children: icon
        }, void 0, false, {
            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/kpi-card.tsx",
            lineNumber: 102,
            columnNumber: 18
        }, this);
        $[12] = icon;
        $[13] = t4;
    } else {
        t4 = $[13];
    }
    let t5;
    if ($[14] !== t3 || $[15] !== t4) {
        t5 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-between",
            children: [
                t3,
                t4
            ]
        }, void 0, true, {
            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/kpi-card.tsx",
            lineNumber: 110,
            columnNumber: 10
        }, this);
        $[14] = t3;
        $[15] = t4;
        $[16] = t5;
    } else {
        t5 = $[16];
    }
    let t6;
    if ($[17] !== value) {
        t6 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "mt-2 text-2xl font-semibold tracking-tight text-zinc-900",
            children: value
        }, void 0, false, {
            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/kpi-card.tsx",
            lineNumber: 119,
            columnNumber: 10
        }, this);
        $[17] = value;
        $[18] = t6;
    } else {
        t6 = $[18];
    }
    let t7;
    if ($[19] !== change || $[20] !== changeLabel || $[21] !== trend) {
        t7 = change !== undefined && change !== null && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: `mt-1 flex items-center gap-1 text-sm ${getTrendColor(trend)}`,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    children: getTrendIcon(trend)
                }, void 0, false, {
                    fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/kpi-card.tsx",
                    lineNumber: 127,
                    columnNumber: 133
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    children: [
                        change >= 0 ? "+" : "",
                        change.toFixed(1),
                        "%"
                    ]
                }, void 0, true, {
                    fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/kpi-card.tsx",
                    lineNumber: 127,
                    columnNumber: 167
                }, this),
                changeLabel && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "text-zinc-500",
                    children: changeLabel
                }, void 0, false, {
                    fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/kpi-card.tsx",
                    lineNumber: 127,
                    columnNumber: 240
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/kpi-card.tsx",
            lineNumber: 127,
            columnNumber: 53
        }, this);
        $[19] = change;
        $[20] = changeLabel;
        $[21] = trend;
        $[22] = t7;
    } else {
        t7 = $[22];
    }
    let t8;
    if ($[23] !== t5 || $[24] !== t6 || $[25] !== t7) {
        t8 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "rounded-xl border border-zinc-200 bg-white p-6 transition-shadow hover:shadow-sm",
            children: [
                t5,
                t6,
                t7
            ]
        }, void 0, true, {
            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/kpi-card.tsx",
            lineNumber: 137,
            columnNumber: 10
        }, this);
        $[23] = t5;
        $[24] = t6;
        $[25] = t7;
        $[26] = t8;
    } else {
        t8 = $[26];
    }
    return t8;
}
_c = KpiCard;
function KpiCardGrid(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(3);
    if ($[0] !== "c6b80d3938d1dfcf5d34f8c22a9d522b06cef7347d88c4140ca5acdc4c2a42f7") {
        for(let $i = 0; $i < 3; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "c6b80d3938d1dfcf5d34f8c22a9d522b06cef7347d88c4140ca5acdc4c2a42f7";
    }
    const { children } = t0;
    let t1;
    if ($[1] !== children) {
        t1 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
            children: children
        }, void 0, false, {
            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/kpi-card.tsx",
            lineNumber: 160,
            columnNumber: 10
        }, this);
        $[1] = children;
        $[2] = t1;
    } else {
        t1 = $[2];
    }
    return t1;
}
_c1 = KpiCardGrid;
var _c, _c1;
__turbopack_context__.k.register(_c, "KpiCard");
__turbopack_context__.k.register(_c1, "KpiCardGrid");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/timeseries-chart.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TimeseriesChart",
    ()=>TimeseriesChart,
    "TimeseriesChartCard",
    ()=>TimeseriesChartCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
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
function TimeseriesChart(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(81);
    if ($[0] !== "616eabe6cce81368f70fb8c734cc30db4af9362b822274a08799c45b1f071698") {
        for(let $i = 0; $i < 81; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "616eabe6cce81368f70fb8c734cc30db4af9362b822274a08799c45b1f071698";
    }
    const { data, metric, height: t1, showGrid: t2 } = t0;
    const height = t1 === undefined ? 200 : t1;
    const showGrid = t2 === undefined ? true : t2;
    const config = METRIC_CONFIG[metric];
    let t3;
    bb0: {
        if (data.length === 0) {
            let t4;
            if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
                t4 = [];
                $[1] = t4;
            } else {
                t4 = $[1];
            }
            let t5;
            if ($[2] === Symbol.for("react.memo_cache_sentinel")) {
                t5 = {
                    points: t4,
                    minY: 0,
                    maxY: 100,
                    yTicks: [
                        0,
                        50,
                        100
                    ]
                };
                $[2] = t5;
            } else {
                t5 = $[2];
            }
            t3 = t5;
            break bb0;
        }
        let min;
        let t4;
        if ($[3] !== data || $[4] !== metric) {
            let t5;
            if ($[7] !== metric) {
                t5 = ({
                    "TimeseriesChart[data.map()]": (d)=>d[metric] ?? 0
                })["TimeseriesChart[data.map()]"];
                $[7] = metric;
                $[8] = t5;
            } else {
                t5 = $[8];
            }
            const values = data.map(t5);
            min = Math.min(...values);
            t4 = Math.max(...values);
            $[3] = data;
            $[4] = metric;
            $[5] = min;
            $[6] = t4;
        } else {
            min = $[5];
            t4 = $[6];
        }
        const max = t4;
        const range = max - min || 1;
        const padding = range * 0.1;
        const minY = Math.max(0, min - padding);
        const maxY = max + padding;
        const tickStep = (maxY - minY) / 4;
        let t5;
        if ($[9] !== minY || $[10] !== tickStep) {
            t5 = Array.from({
                length: 5
            }, {
                "TimeseriesChart[Array.from()]": (_, i)=>minY + i * tickStep
            }["TimeseriesChart[Array.from()]"]);
            $[9] = minY;
            $[10] = tickStep;
            $[11] = t5;
        } else {
            t5 = $[11];
        }
        const yTicks = t5;
        let t6;
        if ($[12] !== data || $[13] !== maxY || $[14] !== metric || $[15] !== minY) {
            let t7;
            if ($[17] !== data.length || $[18] !== maxY || $[19] !== metric || $[20] !== minY) {
                t7 = ({
                    "TimeseriesChart[data.map()]": (d_0, i_0)=>{
                        const x = data.length === 1 ? 50 : i_0 / (data.length - 1) * 100;
                        const y = maxY === minY ? 50 : 100 - ((d_0[metric] ?? 0) - minY) / (maxY - minY) * 100;
                        return {
                            x,
                            y,
                            value: d_0[metric] ?? 0,
                            date: d_0.date
                        };
                    }
                })["TimeseriesChart[data.map()]"];
                $[17] = data.length;
                $[18] = maxY;
                $[19] = metric;
                $[20] = minY;
                $[21] = t7;
            } else {
                t7 = $[21];
            }
            t6 = data.map(t7);
            $[12] = data;
            $[13] = maxY;
            $[14] = metric;
            $[15] = minY;
            $[16] = t6;
        } else {
            t6 = $[16];
        }
        const pts = t6;
        let t7;
        if ($[22] !== maxY || $[23] !== minY || $[24] !== pts || $[25] !== yTicks) {
            t7 = {
                points: pts,
                minY,
                maxY,
                yTicks
            };
            $[22] = maxY;
            $[23] = minY;
            $[24] = pts;
            $[25] = yTicks;
            $[26] = t7;
        } else {
            t7 = $[26];
        }
        t3 = t7;
    }
    const { points, yTicks: yTicks_0 } = t3;
    if (data.length === 0) {
        let t4;
        if ($[27] !== height) {
            t4 = {
                height
            };
            $[27] = height;
            $[28] = t4;
        } else {
            t4 = $[28];
        }
        let t5;
        if ($[29] === Symbol.for("react.memo_cache_sentinel")) {
            t5 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "text-sm text-zinc-500",
                children: "No data available"
            }, void 0, false, {
                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/timeseries-chart.tsx",
                lineNumber: 207,
                columnNumber: 12
            }, this);
            $[29] = t5;
        } else {
            t5 = $[29];
        }
        let t6;
        if ($[30] !== t4) {
            t6 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50",
                style: t4,
                children: t5
            }, void 0, false, {
                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/timeseries-chart.tsx",
                lineNumber: 214,
                columnNumber: 12
            }, this);
            $[30] = t4;
            $[31] = t6;
        } else {
            t6 = $[31];
        }
        return t6;
    }
    let t4;
    if ($[32] !== points) {
        t4 = points.length > 0 ? `M ${points.map(_TimeseriesChartPointsMap).join(" L ")}` : "";
        $[32] = points;
        $[33] = t4;
    } else {
        t4 = $[33];
    }
    const pathD = t4;
    let t5;
    if ($[34] !== points) {
        t5 = points.length > 0 ? `M ${points[0].x},100 L ${points.map(_TimeseriesChartPointsMap2).join(" L ")} L ${points[points.length - 1].x},100 Z` : "";
        $[34] = points;
        $[35] = t5;
    } else {
        t5 = $[35];
    }
    const areaD = t5;
    let t6;
    if ($[36] !== height) {
        t6 = {
            height
        };
        $[36] = height;
        $[37] = t6;
    } else {
        t6 = $[37];
    }
    let t7;
    if ($[38] !== showGrid || $[39] !== yTicks_0) {
        t7 = showGrid && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
            className: "text-zinc-200",
            children: yTicks_0.map({
                "TimeseriesChart[yTicks_0.map()]": (__0, i_1)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                        x1: "0",
                        y1: 100 - i_1 / (yTicks_0.length - 1) * 100,
                        x2: "100",
                        y2: 100 - i_1 / (yTicks_0.length - 1) * 100,
                        stroke: "currentColor",
                        strokeWidth: "0.2"
                    }, i_1, false, {
                        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/timeseries-chart.tsx",
                        lineNumber: 253,
                        columnNumber: 58
                    }, this)
            }["TimeseriesChart[yTicks_0.map()]"])
        }, void 0, false, {
            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/timeseries-chart.tsx",
            lineNumber: 252,
            columnNumber: 22
        }, this);
        $[38] = showGrid;
        $[39] = yTicks_0;
        $[40] = t7;
    } else {
        t7 = $[40];
    }
    const t8 = `gradient-${metric}`;
    let t10;
    let t9;
    if ($[41] !== config.color) {
        t9 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
            offset: "0%",
            stopColor: config.color,
            stopOpacity: "0.3"
        }, void 0, false, {
            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/timeseries-chart.tsx",
            lineNumber: 265,
            columnNumber: 10
        }, this);
        t10 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
            offset: "100%",
            stopColor: config.color,
            stopOpacity: "0"
        }, void 0, false, {
            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/timeseries-chart.tsx",
            lineNumber: 266,
            columnNumber: 11
        }, this);
        $[41] = config.color;
        $[42] = t10;
        $[43] = t9;
    } else {
        t10 = $[42];
        t9 = $[43];
    }
    let t11;
    if ($[44] !== t10 || $[45] !== t8 || $[46] !== t9) {
        t11 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("defs", {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("linearGradient", {
                id: t8,
                x1: "0",
                y1: "0",
                x2: "0",
                y2: "1",
                children: [
                    t9,
                    t10
                ]
            }, void 0, true, {
                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/timeseries-chart.tsx",
                lineNumber: 276,
                columnNumber: 17
            }, this)
        }, void 0, false, {
            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/timeseries-chart.tsx",
            lineNumber: 276,
            columnNumber: 11
        }, this);
        $[44] = t10;
        $[45] = t8;
        $[46] = t9;
        $[47] = t11;
    } else {
        t11 = $[47];
    }
    const t12 = `url(#gradient-${metric})`;
    let t13;
    if ($[48] !== areaD || $[49] !== t12) {
        t13 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: areaD,
            fill: t12
        }, void 0, false, {
            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/timeseries-chart.tsx",
            lineNumber: 287,
            columnNumber: 11
        }, this);
        $[48] = areaD;
        $[49] = t12;
        $[50] = t13;
    } else {
        t13 = $[50];
    }
    let t14;
    if ($[51] !== config.color || $[52] !== pathD) {
        t14 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: pathD,
            fill: "none",
            stroke: config.color,
            strokeWidth: "0.5",
            vectorEffect: "non-scaling-stroke"
        }, void 0, false, {
            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/timeseries-chart.tsx",
            lineNumber: 296,
            columnNumber: 11
        }, this);
        $[51] = config.color;
        $[52] = pathD;
        $[53] = t14;
    } else {
        t14 = $[53];
    }
    let t15;
    if ($[54] !== config.color || $[55] !== points) {
        let t16;
        if ($[57] !== config.color) {
            t16 = ({
                "TimeseriesChart[points.map()]": (p_1, i_2)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: p_1.x,
                        cy: p_1.y,
                        r: "0.8",
                        fill: config.color,
                        className: "opacity-0 hover:opacity-100 transition-opacity"
                    }, i_2, false, {
                        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/timeseries-chart.tsx",
                        lineNumber: 308,
                        columnNumber: 56
                    }, this)
            })["TimeseriesChart[points.map()]"];
            $[57] = config.color;
            $[58] = t16;
        } else {
            t16 = $[58];
        }
        t15 = points.map(t16);
        $[54] = config.color;
        $[55] = points;
        $[56] = t15;
    } else {
        t15 = $[56];
    }
    let t16;
    if ($[59] !== t11 || $[60] !== t13 || $[61] !== t14 || $[62] !== t15 || $[63] !== t7) {
        t16 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            viewBox: "0 0 100 100",
            preserveAspectRatio: "none",
            className: "h-full w-full",
            children: [
                t7,
                t11,
                t13,
                t14,
                t15
            ]
        }, void 0, true, {
            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/timeseries-chart.tsx",
            lineNumber: 324,
            columnNumber: 11
        }, this);
        $[59] = t11;
        $[60] = t13;
        $[61] = t14;
        $[62] = t15;
        $[63] = t7;
        $[64] = t16;
    } else {
        t16 = $[64];
    }
    let t17;
    if ($[65] !== config || $[66] !== yTicks_0) {
        let t18;
        if ($[68] !== config) {
            t18 = ({
                "TimeseriesChart[(anonymous)()]": (tick, i_3)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: config.format(tick)
                    }, i_3, false, {
                        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/timeseries-chart.tsx",
                        lineNumber: 339,
                        columnNumber: 58
                    }, this)
            })["TimeseriesChart[(anonymous)()]"];
            $[68] = config;
            $[69] = t18;
        } else {
            t18 = $[69];
        }
        t17 = yTicks_0.slice().reverse().map(t18);
        $[65] = config;
        $[66] = yTicks_0;
        $[67] = t17;
    } else {
        t17 = $[67];
    }
    let t18;
    if ($[70] !== t17) {
        t18 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "absolute left-0 top-0 flex h-full flex-col justify-between py-1 text-[10px] text-zinc-500",
            children: t17
        }, void 0, false, {
            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/timeseries-chart.tsx",
            lineNumber: 355,
            columnNumber: 11
        }, this);
        $[70] = t17;
        $[71] = t18;
    } else {
        t18 = $[71];
    }
    let t19;
    if ($[72] !== data) {
        t19 = data.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    children: data[0].date
                }, void 0, false, {
                    fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/timeseries-chart.tsx",
                    lineNumber: 363,
                    columnNumber: 32
                }, this),
                data.length > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    children: data[data.length - 1].date
                }, void 0, false, {
                    fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/timeseries-chart.tsx",
                    lineNumber: 363,
                    columnNumber: 79
                }, this)
            ]
        }, void 0, true);
        $[72] = data;
        $[73] = t19;
    } else {
        t19 = $[73];
    }
    let t20;
    if ($[74] !== t19) {
        t20 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "absolute bottom-0 left-8 right-0 flex justify-between text-[10px] text-zinc-500",
            children: t19
        }, void 0, false, {
            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/timeseries-chart.tsx",
            lineNumber: 371,
            columnNumber: 11
        }, this);
        $[74] = t19;
        $[75] = t20;
    } else {
        t20 = $[75];
    }
    let t21;
    if ($[76] !== t16 || $[77] !== t18 || $[78] !== t20 || $[79] !== t6) {
        t21 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "relative",
            style: t6,
            children: [
                t16,
                t18,
                t20
            ]
        }, void 0, true, {
            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/timeseries-chart.tsx",
            lineNumber: 379,
            columnNumber: 11
        }, this);
        $[76] = t16;
        $[77] = t18;
        $[78] = t20;
        $[79] = t6;
        $[80] = t21;
    } else {
        t21 = $[80];
    }
    return t21;
}
_c = TimeseriesChart;
function _TimeseriesChartPointsMap2(p_0) {
    return `${p_0.x},${p_0.y}`;
}
function _TimeseriesChartPointsMap(p) {
    return `${p.x},${p.y}`;
}
function TimeseriesChartCard(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(24);
    if ($[0] !== "616eabe6cce81368f70fb8c734cc30db4af9362b822274a08799c45b1f071698") {
        for(let $i = 0; $i < 24; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "616eabe6cce81368f70fb8c734cc30db4af9362b822274a08799c45b1f071698";
    }
    const { title, data, metric, currentValue, change } = t0;
    const config = METRIC_CONFIG[metric];
    let t1;
    if ($[1] !== title) {
        t1 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
            className: "text-sm font-medium text-zinc-600",
            children: title
        }, void 0, false, {
            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/timeseries-chart.tsx",
            lineNumber: 414,
            columnNumber: 10
        }, this);
        $[1] = title;
        $[2] = t1;
    } else {
        t1 = $[2];
    }
    let t2;
    if ($[3] !== currentValue) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: "text-xl font-semibold text-zinc-900",
            children: currentValue
        }, void 0, false, {
            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/timeseries-chart.tsx",
            lineNumber: 422,
            columnNumber: 10
        }, this);
        $[3] = currentValue;
        $[4] = t2;
    } else {
        t2 = $[4];
    }
    let t3;
    if ($[5] !== change) {
        t3 = change !== undefined && change !== null && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: `text-sm ${change >= 0 ? "text-green-600" : "text-red-600"}`,
            children: [
                change >= 0 ? "+" : "",
                change.toFixed(1),
                "%"
            ]
        }, void 0, true, {
            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/timeseries-chart.tsx",
            lineNumber: 430,
            columnNumber: 53
        }, this);
        $[5] = change;
        $[6] = t3;
    } else {
        t3 = $[6];
    }
    let t4;
    if ($[7] !== t2 || $[8] !== t3) {
        t4 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "mt-1 flex items-baseline gap-2",
            children: [
                t2,
                t3
            ]
        }, void 0, true, {
            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/timeseries-chart.tsx",
            lineNumber: 438,
            columnNumber: 10
        }, this);
        $[7] = t2;
        $[8] = t3;
        $[9] = t4;
    } else {
        t4 = $[9];
    }
    let t5;
    if ($[10] !== t1 || $[11] !== t4) {
        t5 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: [
                t1,
                t4
            ]
        }, void 0, true, {
            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/timeseries-chart.tsx",
            lineNumber: 447,
            columnNumber: 10
        }, this);
        $[10] = t1;
        $[11] = t4;
        $[12] = t5;
    } else {
        t5 = $[12];
    }
    let t6;
    if ($[13] !== config.color) {
        t6 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "h-3 w-3 rounded-full",
            style: {
                backgroundColor: config.color
            }
        }, void 0, false, {
            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/timeseries-chart.tsx",
            lineNumber: 456,
            columnNumber: 10
        }, this);
        $[13] = config.color;
        $[14] = t6;
    } else {
        t6 = $[14];
    }
    let t7;
    if ($[15] !== t5 || $[16] !== t6) {
        t7 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "mb-3 flex items-center justify-between",
            children: [
                t5,
                t6
            ]
        }, void 0, true, {
            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/timeseries-chart.tsx",
            lineNumber: 466,
            columnNumber: 10
        }, this);
        $[15] = t5;
        $[16] = t6;
        $[17] = t7;
    } else {
        t7 = $[17];
    }
    let t8;
    if ($[18] !== data || $[19] !== metric) {
        t8 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TimeseriesChart, {
            data: data,
            metric: metric,
            height: 120
        }, void 0, false, {
            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/timeseries-chart.tsx",
            lineNumber: 475,
            columnNumber: 10
        }, this);
        $[18] = data;
        $[19] = metric;
        $[20] = t8;
    } else {
        t8 = $[20];
    }
    let t9;
    if ($[21] !== t7 || $[22] !== t8) {
        t9 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "rounded-xl border border-zinc-200 bg-white p-4",
            children: [
                t7,
                t8
            ]
        }, void 0, true, {
            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/timeseries-chart.tsx",
            lineNumber: 484,
            columnNumber: 10
        }, this);
        $[21] = t7;
        $[22] = t8;
        $[23] = t9;
    } else {
        t9 = $[23];
    }
    return t9;
}
_c1 = TimeseriesChartCard;
var _c, _c1;
__turbopack_context__.k.register(_c, "TimeseriesChart");
__turbopack_context__.k.register(_c1, "TimeseriesChartCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/breakdown-table.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BreakdownTable",
    ()=>BreakdownTable
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
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
function BreakdownTable(t0) {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(43);
    if ($[0] !== "906007ea3168ed3941063a4ba025036bad05bc8c3a6fb92821ef80d0369fbb9b") {
        for(let $i = 0; $i < 43; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "906007ea3168ed3941063a4ba025036bad05bc8c3a6fb92821ef80d0369fbb9b";
    }
    const { data, entityLabel: t1 } = t0;
    const entityLabel = t1 === undefined ? "Campaign" : t1;
    const [sortKey, setSortKey] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("spend");
    const [sortDir, setSortDir] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("desc");
    let t2;
    if ($[1] !== data || $[2] !== sortDir || $[3] !== sortKey) {
        let t3;
        if ($[5] !== sortDir || $[6] !== sortKey) {
            t3 = ({
                "BreakdownTable[(anonymous)()]": (a, b)=>{
                    const aVal = a[sortKey] ?? 0;
                    const bVal = b[sortKey] ?? 0;
                    return sortDir === "desc" ? bVal - aVal : aVal - bVal;
                }
            })["BreakdownTable[(anonymous)()]"];
            $[5] = sortDir;
            $[6] = sortKey;
            $[7] = t3;
        } else {
            t3 = $[7];
        }
        t2 = [
            ...data
        ].sort(t3);
        $[1] = data;
        $[2] = sortDir;
        $[3] = sortKey;
        $[4] = t2;
    } else {
        t2 = $[4];
    }
    const sorted = t2;
    let t3;
    if ($[8] !== sortDir || $[9] !== sortKey) {
        t3 = function handleSort(key) {
            if (sortKey === key) {
                setSortDir(sortDir === "desc" ? "asc" : "desc");
            } else {
                setSortKey(key);
                setSortDir("desc");
            }
        };
        $[8] = sortDir;
        $[9] = sortKey;
        $[10] = t3;
    } else {
        t3 = $[10];
    }
    const handleSort = t3;
    let t4;
    if ($[11] !== handleSort || $[12] !== sortDir || $[13] !== sortKey) {
        t4 = function SortHeader(t5) {
            const { label, field } = t5;
            const isActive = sortKey === field;
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                className: "cursor-pointer px-3 py-2 text-right text-xs font-medium text-zinc-500 hover:text-zinc-700",
                onClick: {
                    "BreakdownTable[SortHeader > <th>.onClick]": ()=>handleSort(field)
                }["BreakdownTable[SortHeader > <th>.onClick]"],
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "inline-flex items-center gap-1",
                    children: [
                        label,
                        isActive && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-zinc-400",
                            children: sortDir === "desc" ? "\u2193" : "\u2191"
                        }, void 0, false, {
                            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/breakdown-table.tsx",
                            lineNumber: 108,
                            columnNumber: 124
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/breakdown-table.tsx",
                    lineNumber: 108,
                    columnNumber: 55
                }, this)
            }, void 0, false, {
                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/breakdown-table.tsx",
                lineNumber: 106,
                columnNumber: 14
            }, this);
        };
        $[11] = handleSort;
        $[12] = sortDir;
        $[13] = sortKey;
        $[14] = t4;
    } else {
        t4 = $[14];
    }
    const SortHeader = t4;
    if (data.length === 0) {
        let t5;
        if ($[15] === Symbol.for("react.memo_cache_sentinel")) {
            t5 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-xl border border-zinc-200 bg-white p-6",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-center text-sm text-zinc-500",
                    children: "No data available"
                }, void 0, false, {
                    fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/breakdown-table.tsx",
                    lineNumber: 121,
                    columnNumber: 76
                }, this)
            }, void 0, false, {
                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/breakdown-table.tsx",
                lineNumber: 121,
                columnNumber: 12
            }, this);
            $[15] = t5;
        } else {
            t5 = $[15];
        }
        return t5;
    }
    let t5;
    if ($[16] !== entityLabel) {
        t5 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
            className: "px-4 py-2 text-left text-xs font-medium text-zinc-500",
            children: entityLabel
        }, void 0, false, {
            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/breakdown-table.tsx",
            lineNumber: 130,
            columnNumber: 10
        }, this);
        $[16] = entityLabel;
        $[17] = t5;
    } else {
        t5 = $[17];
    }
    let t6;
    if ($[18] === Symbol.for("react.memo_cache_sentinel")) {
        t6 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
            className: "px-3 py-2 text-left text-xs font-medium text-zinc-500",
            children: "Channel"
        }, void 0, false, {
            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/breakdown-table.tsx",
            lineNumber: 138,
            columnNumber: 10
        }, this);
        $[18] = t6;
    } else {
        t6 = $[18];
    }
    let t10;
    let t11;
    let t12;
    let t13;
    let t7;
    let t8;
    let t9;
    if ($[19] !== SortHeader) {
        t7 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SortHeader, {
            label: "Spend",
            field: "spend"
        }, void 0, false, {
            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/breakdown-table.tsx",
            lineNumber: 151,
            columnNumber: 10
        }, this);
        t8 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SortHeader, {
            label: "Revenue",
            field: "revenue"
        }, void 0, false, {
            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/breakdown-table.tsx",
            lineNumber: 152,
            columnNumber: 10
        }, this);
        t9 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SortHeader, {
            label: "ROAS",
            field: "roas"
        }, void 0, false, {
            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/breakdown-table.tsx",
            lineNumber: 153,
            columnNumber: 10
        }, this);
        t10 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SortHeader, {
            label: "CPA",
            field: "cpa"
        }, void 0, false, {
            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/breakdown-table.tsx",
            lineNumber: 154,
            columnNumber: 11
        }, this);
        t11 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SortHeader, {
            label: "Conv.",
            field: "conversions"
        }, void 0, false, {
            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/breakdown-table.tsx",
            lineNumber: 155,
            columnNumber: 11
        }, this);
        t12 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SortHeader, {
            label: "Clicks",
            field: "clicks"
        }, void 0, false, {
            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/breakdown-table.tsx",
            lineNumber: 156,
            columnNumber: 11
        }, this);
        t13 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SortHeader, {
            label: "Impr.",
            field: "impressions"
        }, void 0, false, {
            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/breakdown-table.tsx",
            lineNumber: 157,
            columnNumber: 11
        }, this);
        $[19] = SortHeader;
        $[20] = t10;
        $[21] = t11;
        $[22] = t12;
        $[23] = t13;
        $[24] = t7;
        $[25] = t8;
        $[26] = t9;
    } else {
        t10 = $[20];
        t11 = $[21];
        t12 = $[22];
        t13 = $[23];
        t7 = $[24];
        t8 = $[25];
        t9 = $[26];
    }
    let t14;
    if ($[27] !== t10 || $[28] !== t11 || $[29] !== t12 || $[30] !== t13 || $[31] !== t5 || $[32] !== t7 || $[33] !== t8 || $[34] !== t9) {
        t14 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
            className: "border-b border-zinc-100 bg-zinc-50",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                children: [
                    t5,
                    t6,
                    t7,
                    t8,
                    t9,
                    t10,
                    t11,
                    t12,
                    t13
                ]
            }, void 0, true, {
                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/breakdown-table.tsx",
                lineNumber: 177,
                columnNumber: 66
            }, this)
        }, void 0, false, {
            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/breakdown-table.tsx",
            lineNumber: 177,
            columnNumber: 11
        }, this);
        $[27] = t10;
        $[28] = t11;
        $[29] = t12;
        $[30] = t13;
        $[31] = t5;
        $[32] = t7;
        $[33] = t8;
        $[34] = t9;
        $[35] = t14;
    } else {
        t14 = $[35];
    }
    let t15;
    if ($[36] !== sorted) {
        t15 = sorted.map(_BreakdownTableSortedMap);
        $[36] = sorted;
        $[37] = t15;
    } else {
        t15 = $[37];
    }
    let t16;
    if ($[38] !== t15) {
        t16 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
            className: "divide-y divide-zinc-100",
            children: t15
        }, void 0, false, {
            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/breakdown-table.tsx",
            lineNumber: 200,
            columnNumber: 11
        }, this);
        $[38] = t15;
        $[39] = t16;
    } else {
        t16 = $[39];
    }
    let t17;
    if ($[40] !== t14 || $[41] !== t16) {
        t17 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "overflow-hidden rounded-xl border border-zinc-200 bg-white",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "overflow-x-auto",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                    className: "w-full min-w-[700px]",
                    children: [
                        t14,
                        t16
                    ]
                }, void 0, true, {
                    fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/breakdown-table.tsx",
                    lineNumber: 208,
                    columnNumber: 120
                }, this)
            }, void 0, false, {
                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/breakdown-table.tsx",
                lineNumber: 208,
                columnNumber: 87
            }, this)
        }, void 0, false, {
            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/breakdown-table.tsx",
            lineNumber: 208,
            columnNumber: 11
        }, this);
        $[40] = t14;
        $[41] = t16;
        $[42] = t17;
    } else {
        t17 = $[42];
    }
    return t17;
}
_s(BreakdownTable, "bmt2sBI5cH8KGWl1+Z24j2tNyqs=");
_c = BreakdownTable;
function _BreakdownTableSortedMap(row) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
        className: "hover:bg-zinc-50",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                className: "max-w-[200px] truncate px-4 py-3 text-sm font-medium text-zinc-900",
                children: row.entityName
            }, void 0, false, {
                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/breakdown-table.tsx",
                lineNumber: 218,
                columnNumber: 62
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                className: "px-3 py-3",
                children: row.platformCode && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "inline-flex rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600",
                    children: PLATFORM_LABELS[row.platformCode] ?? row.platformCode
                }, void 0, false, {
                    fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/breakdown-table.tsx",
                    lineNumber: 218,
                    columnNumber: 213
                }, this)
            }, void 0, false, {
                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/breakdown-table.tsx",
                lineNumber: 218,
                columnNumber: 166
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                className: "px-3 py-3 text-right text-sm text-zinc-700",
                children: formatCurrency(row.spend)
            }, void 0, false, {
                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/breakdown-table.tsx",
                lineNumber: 218,
                columnNumber: 382
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                className: "px-3 py-3 text-right text-sm text-zinc-700",
                children: formatCurrency(row.revenue)
            }, void 0, false, {
                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/breakdown-table.tsx",
                lineNumber: 218,
                columnNumber: 473
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                className: "px-3 py-3 text-right text-sm",
                children: row.roas !== null ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: row.roas >= 1 ? "text-green-600" : "text-red-600",
                    children: [
                        row.roas.toFixed(2),
                        "x"
                    ]
                }, void 0, true, {
                    fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/breakdown-table.tsx",
                    lineNumber: 218,
                    columnNumber: 632
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "text-zinc-400",
                    children: "—"
                }, void 0, false, {
                    fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/breakdown-table.tsx",
                    lineNumber: 218,
                    columnNumber: 732
                }, this)
            }, void 0, false, {
                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/breakdown-table.tsx",
                lineNumber: 218,
                columnNumber: 566
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                className: "px-3 py-3 text-right text-sm text-zinc-700",
                children: row.cpa !== null ? formatCurrency(row.cpa) : "\u2014"
            }, void 0, false, {
                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/breakdown-table.tsx",
                lineNumber: 218,
                columnNumber: 778
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                className: "px-3 py-3 text-right text-sm text-zinc-700",
                children: formatNumber(row.conversions)
            }, void 0, false, {
                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/breakdown-table.tsx",
                lineNumber: 218,
                columnNumber: 897
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                className: "px-3 py-3 text-right text-sm text-zinc-700",
                children: formatNumber(row.clicks)
            }, void 0, false, {
                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/breakdown-table.tsx",
                lineNumber: 218,
                columnNumber: 992
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                className: "px-3 py-3 text-right text-sm text-zinc-700",
                children: formatNumber(row.impressions)
            }, void 0, false, {
                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/breakdown-table.tsx",
                lineNumber: 218,
                columnNumber: 1082
            }, this)
        ]
    }, row.entityId, true, {
        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/breakdown-table.tsx",
        lineNumber: 218,
        columnNumber: 10
    }, this);
}
var _c;
__turbopack_context__.k.register(_c, "BreakdownTable");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/filters.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DashboardFilters",
    ()=>DashboardFilters,
    "getDefaultFilters",
    ()=>getDefaultFilters
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
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
function DashboardFilters(t0) {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(70);
    if ($[0] !== "9f01531fb1a9c4e87cc1fb86a4c1ca14256d82420f64188626b6551581bc99bc") {
        for(let $i = 0; $i < 70; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "9f01531fb1a9c4e87cc1fb86a4c1ca14256d82420f64188626b6551581bc99bc";
    }
    const { value, onChange } = t0;
    const [showChannelDropdown, setShowChannelDropdown] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    let t1;
    if ($[1] !== onChange || $[2] !== value) {
        t1 = ({
            "DashboardFilters[handlePreset]": (days)=>{
                const { start, end } = getPresetDates(days);
                onChange({
                    ...value,
                    startDate: start,
                    endDate: end
                });
            }
        })["DashboardFilters[handlePreset]"];
        $[1] = onChange;
        $[2] = value;
        $[3] = t1;
    } else {
        t1 = $[3];
    }
    const handlePreset = t1;
    let t2;
    if ($[4] !== onChange || $[5] !== value) {
        t2 = ({
            "DashboardFilters[toggleChannel]": (channel)=>{
                const channels = value.channels.includes(channel) ? value.channels.filter({
                    "DashboardFilters[toggleChannel > value.channels.filter()]": (c)=>c !== channel
                }["DashboardFilters[toggleChannel > value.channels.filter()]"]) : [
                    ...value.channels,
                    channel
                ];
                onChange({
                    ...value,
                    channels
                });
            }
        })["DashboardFilters[toggleChannel]"];
        $[4] = onChange;
        $[5] = value;
        $[6] = t2;
    } else {
        t2 = $[6];
    }
    const toggleChannel = t2;
    let t3;
    if ($[7] !== onChange || $[8] !== value) {
        t3 = ({
            "DashboardFilters[clearChannels]": ()=>{
                onChange({
                    ...value,
                    channels: []
                });
            }
        })["DashboardFilters[clearChannels]"];
        $[7] = onChange;
        $[8] = value;
        $[9] = t3;
    } else {
        t3 = $[9];
    }
    const clearChannels = t3;
    let t4;
    if ($[10] !== handlePreset) {
        t4 = DATE_PRESETS.map({
            "DashboardFilters[DATE_PRESETS.map()]": (preset)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: {
                        "DashboardFilters[DATE_PRESETS.map() > <button>.onClick]": ()=>handlePreset(preset.days)
                    }["DashboardFilters[DATE_PRESETS.map() > <button>.onClick]"],
                    className: "rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-700 hover:bg-zinc-50",
                    children: preset.label
                }, preset.days, false, {
                    fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/filters.tsx",
                    lineNumber: 132,
                    columnNumber: 57
                }, this)
        }["DashboardFilters[DATE_PRESETS.map()]"]);
        $[10] = handlePreset;
        $[11] = t4;
    } else {
        t4 = $[11];
    }
    let t5;
    if ($[12] !== t4) {
        t5 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center gap-2",
            children: t4
        }, void 0, false, {
            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/filters.tsx",
            lineNumber: 143,
            columnNumber: 10
        }, this);
        $[12] = t4;
        $[13] = t5;
    } else {
        t5 = $[13];
    }
    let t6;
    if ($[14] !== onChange || $[15] !== value) {
        t6 = ({
            "DashboardFilters[<input>.onChange]": (e)=>onChange({
                    ...value,
                    startDate: e.target.value
                })
        })["DashboardFilters[<input>.onChange]"];
        $[14] = onChange;
        $[15] = value;
        $[16] = t6;
    } else {
        t6 = $[16];
    }
    let t7;
    if ($[17] !== t6 || $[18] !== value.startDate) {
        t7 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
            type: "date",
            value: value.startDate,
            onChange: t6,
            className: "rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-700"
        }, void 0, false, {
            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/filters.tsx",
            lineNumber: 165,
            columnNumber: 10
        }, this);
        $[17] = t6;
        $[18] = value.startDate;
        $[19] = t7;
    } else {
        t7 = $[19];
    }
    let t8;
    if ($[20] === Symbol.for("react.memo_cache_sentinel")) {
        t8 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: "text-zinc-400",
            children: "to"
        }, void 0, false, {
            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/filters.tsx",
            lineNumber: 174,
            columnNumber: 10
        }, this);
        $[20] = t8;
    } else {
        t8 = $[20];
    }
    let t9;
    if ($[21] !== onChange || $[22] !== value) {
        t9 = ({
            "DashboardFilters[<input>.onChange]": (e_0)=>onChange({
                    ...value,
                    endDate: e_0.target.value
                })
        })["DashboardFilters[<input>.onChange]"];
        $[21] = onChange;
        $[22] = value;
        $[23] = t9;
    } else {
        t9 = $[23];
    }
    let t10;
    if ($[24] !== t9 || $[25] !== value.endDate) {
        t10 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
            type: "date",
            value: value.endDate,
            onChange: t9,
            className: "rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-700"
        }, void 0, false, {
            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/filters.tsx",
            lineNumber: 195,
            columnNumber: 11
        }, this);
        $[24] = t9;
        $[25] = value.endDate;
        $[26] = t10;
    } else {
        t10 = $[26];
    }
    let t11;
    if ($[27] !== t10 || $[28] !== t7) {
        t11 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center gap-2",
            children: [
                t7,
                t8,
                t10
            ]
        }, void 0, true, {
            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/filters.tsx",
            lineNumber: 204,
            columnNumber: 11
        }, this);
        $[27] = t10;
        $[28] = t7;
        $[29] = t11;
    } else {
        t11 = $[29];
    }
    let t12;
    if ($[30] !== showChannelDropdown) {
        t12 = ({
            "DashboardFilters[<button>.onClick]": ()=>setShowChannelDropdown(!showChannelDropdown)
        })["DashboardFilters[<button>.onClick]"];
        $[30] = showChannelDropdown;
        $[31] = t12;
    } else {
        t12 = $[31];
    }
    const t13 = value.channels.length === 0 ? "All Channels" : `${value.channels.length} channel${value.channels.length > 1 ? "s" : ""}`;
    let t14;
    if ($[32] !== t13) {
        t14 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            children: t13
        }, void 0, false, {
            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/filters.tsx",
            lineNumber: 224,
            columnNumber: 11
        }, this);
        $[32] = t13;
        $[33] = t14;
    } else {
        t14 = $[33];
    }
    let t15;
    if ($[34] === Symbol.for("react.memo_cache_sentinel")) {
        t15 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            className: "h-4 w-4",
            fill: "none",
            stroke: "currentColor",
            viewBox: "0 0 24 24",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeWidth: 2,
                d: "M19 9l-7 7-7-7"
            }, void 0, false, {
                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/filters.tsx",
                lineNumber: 232,
                columnNumber: 90
            }, this)
        }, void 0, false, {
            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/filters.tsx",
            lineNumber: 232,
            columnNumber: 11
        }, this);
        $[34] = t15;
    } else {
        t15 = $[34];
    }
    let t16;
    if ($[35] !== t12 || $[36] !== t14) {
        t16 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            onClick: t12,
            className: "inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-700 hover:bg-zinc-50",
            children: [
                t14,
                t15
            ]
        }, void 0, true, {
            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/filters.tsx",
            lineNumber: 239,
            columnNumber: 11
        }, this);
        $[35] = t12;
        $[36] = t14;
        $[37] = t16;
    } else {
        t16 = $[37];
    }
    let t17;
    if ($[38] !== clearChannels || $[39] !== showChannelDropdown || $[40] !== toggleChannel || $[41] !== value.channels) {
        t17 = showChannelDropdown && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "absolute left-0 top-full z-10 mt-1 w-48 rounded-lg border border-zinc-200 bg-white py-1 shadow-lg",
            children: [
                value.channels.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: clearChannels,
                    className: "w-full px-3 py-2 text-left text-sm text-zinc-500 hover:bg-zinc-50",
                    children: "Clear all"
                }, void 0, false, {
                    fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/filters.tsx",
                    lineNumber: 248,
                    columnNumber: 179
                }, this),
                CHANNEL_OPTIONS.map({
                    "DashboardFilters[CHANNEL_OPTIONS.map()]": (opt)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            className: "flex cursor-pointer items-center gap-2 px-3 py-2 hover:bg-zinc-50",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "checkbox",
                                    checked: value.channels.includes(opt.value),
                                    onChange: {
                                        "DashboardFilters[CHANNEL_OPTIONS.map() > <input>.onChange]": ()=>toggleChannel(opt.value)
                                    }["DashboardFilters[CHANNEL_OPTIONS.map() > <input>.onChange]"],
                                    className: "h-4 w-4 rounded border-zinc-300"
                                }, void 0, false, {
                                    fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/filters.tsx",
                                    lineNumber: 249,
                                    columnNumber: 160
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-sm text-zinc-700",
                                    children: opt.label
                                }, void 0, false, {
                                    fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/filters.tsx",
                                    lineNumber: 251,
                                    columnNumber: 122
                                }, this)
                            ]
                        }, opt.value, true, {
                            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/filters.tsx",
                            lineNumber: 249,
                            columnNumber: 59
                        }, this)
                }["DashboardFilters[CHANNEL_OPTIONS.map()]"])
            ]
        }, void 0, true, {
            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/filters.tsx",
            lineNumber: 248,
            columnNumber: 34
        }, this);
        $[38] = clearChannels;
        $[39] = showChannelDropdown;
        $[40] = toggleChannel;
        $[41] = value.channels;
        $[42] = t17;
    } else {
        t17 = $[42];
    }
    let t18;
    if ($[43] !== t16 || $[44] !== t17) {
        t18 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "relative",
            children: [
                t16,
                t17
            ]
        }, void 0, true, {
            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/filters.tsx",
            lineNumber: 263,
            columnNumber: 11
        }, this);
        $[43] = t16;
        $[44] = t17;
        $[45] = t18;
    } else {
        t18 = $[45];
    }
    let t19;
    if ($[46] !== onChange || $[47] !== value) {
        t19 = ({
            "DashboardFilters[<select>.onChange]": (e_1)=>onChange({
                    ...value,
                    granularity: e_1.target.value
                })
        })["DashboardFilters[<select>.onChange]"];
        $[46] = onChange;
        $[47] = value;
        $[48] = t19;
    } else {
        t19 = $[48];
    }
    let t20;
    let t21;
    let t22;
    if ($[49] === Symbol.for("react.memo_cache_sentinel")) {
        t20 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
            value: "day",
            children: "Daily"
        }, void 0, false, {
            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/filters.tsx",
            lineNumber: 288,
            columnNumber: 11
        }, this);
        t21 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
            value: "week",
            children: "Weekly"
        }, void 0, false, {
            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/filters.tsx",
            lineNumber: 289,
            columnNumber: 11
        }, this);
        t22 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
            value: "month",
            children: "Monthly"
        }, void 0, false, {
            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/filters.tsx",
            lineNumber: 290,
            columnNumber: 11
        }, this);
        $[49] = t20;
        $[50] = t21;
        $[51] = t22;
    } else {
        t20 = $[49];
        t21 = $[50];
        t22 = $[51];
    }
    let t23;
    if ($[52] !== t19 || $[53] !== value.granularity) {
        t23 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
            value: value.granularity,
            onChange: t19,
            className: "rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-700",
            children: [
                t20,
                t21,
                t22
            ]
        }, void 0, true, {
            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/filters.tsx",
            lineNumber: 301,
            columnNumber: 11
        }, this);
        $[52] = t19;
        $[53] = value.granularity;
        $[54] = t23;
    } else {
        t23 = $[54];
    }
    let t24;
    if ($[55] !== onChange || $[56] !== value) {
        t24 = ({
            "DashboardFilters[<select>.onChange]": (e_2)=>onChange({
                    ...value,
                    breakdown: e_2.target.value
                })
        })["DashboardFilters[<select>.onChange]"];
        $[55] = onChange;
        $[56] = value;
        $[57] = t24;
    } else {
        t24 = $[57];
    }
    let t25;
    let t26;
    let t27;
    if ($[58] === Symbol.for("react.memo_cache_sentinel")) {
        t25 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
            value: "platform",
            children: "By Channel"
        }, void 0, false, {
            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/filters.tsx",
            lineNumber: 326,
            columnNumber: 11
        }, this);
        t26 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
            value: "campaign",
            children: "By Campaign"
        }, void 0, false, {
            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/filters.tsx",
            lineNumber: 327,
            columnNumber: 11
        }, this);
        t27 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
            value: "ad",
            children: "By Ad"
        }, void 0, false, {
            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/filters.tsx",
            lineNumber: 328,
            columnNumber: 11
        }, this);
        $[58] = t25;
        $[59] = t26;
        $[60] = t27;
    } else {
        t25 = $[58];
        t26 = $[59];
        t27 = $[60];
    }
    let t28;
    if ($[61] !== t24 || $[62] !== value.breakdown) {
        t28 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
            value: value.breakdown,
            onChange: t24,
            className: "rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-700",
            children: [
                t25,
                t26,
                t27
            ]
        }, void 0, true, {
            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/filters.tsx",
            lineNumber: 339,
            columnNumber: 11
        }, this);
        $[61] = t24;
        $[62] = value.breakdown;
        $[63] = t28;
    } else {
        t28 = $[63];
    }
    let t29;
    if ($[64] !== t11 || $[65] !== t18 || $[66] !== t23 || $[67] !== t28 || $[68] !== t5) {
        t29 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-wrap items-center gap-3",
            children: [
                t5,
                t11,
                t18,
                t23,
                t28
            ]
        }, void 0, true, {
            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/filters.tsx",
            lineNumber: 348,
            columnNumber: 11
        }, this);
        $[64] = t11;
        $[65] = t18;
        $[66] = t23;
        $[67] = t28;
        $[68] = t5;
        $[69] = t29;
    } else {
        t29 = $[69];
    }
    return t29;
}
_s(DashboardFilters, "OT7hm7Z30DiZ3f+EErNgONGA2eE=");
_c = DashboardFilters;
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
var _c;
__turbopack_context__.k.register(_c, "DashboardFilters");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=1c0b7_windsurf-project_apps_frontend_src_components_dashboard_9da89c1a._.js.map