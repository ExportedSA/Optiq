(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/analytics/date-range-selector.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DateRangeSelector",
    ()=>DateRangeSelector
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
const presets = [
    {
        value: "7d",
        label: "Last 7 days"
    },
    {
        value: "14d",
        label: "Last 14 days"
    },
    {
        value: "30d",
        label: "Last 30 days"
    },
    {
        value: "90d",
        label: "Last 90 days"
    }
];
function DateRangeSelector(t0) {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(32);
    if ($[0] !== "168c59b79038f64c5188e22fee02a369e53f6ef80f407266a4da5e39402bc310") {
        for(let $i = 0; $i < 32; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "168c59b79038f64c5188e22fee02a369e53f6ef80f407266a4da5e39402bc310";
    }
    const { value, onChange, customRange, onCustomRangeChange } = t0;
    const [showCustom, setShowCustom] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    let t1;
    if ($[1] !== customRange?.start) {
        t1 = customRange?.start.toISOString().split("T")[0] ?? "";
        $[1] = customRange?.start;
        $[2] = t1;
    } else {
        t1 = $[2];
    }
    const [tempStart, setTempStart] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(t1);
    let t2;
    if ($[3] !== customRange?.end) {
        t2 = customRange?.end.toISOString().split("T")[0] ?? "";
        $[3] = customRange?.end;
        $[4] = t2;
    } else {
        t2 = $[4];
    }
    const [tempEnd, setTempEnd] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(t2);
    let t3;
    if ($[5] !== onChange) {
        t3 = ({
            "DateRangeSelector[handlePresetClick]": (preset)=>{
                if (preset === "custom") {
                    setShowCustom(true);
                } else {
                    setShowCustom(false);
                    onChange(preset);
                }
            }
        })["DateRangeSelector[handlePresetClick]"];
        $[5] = onChange;
        $[6] = t3;
    } else {
        t3 = $[6];
    }
    const handlePresetClick = t3;
    let t4;
    if ($[7] !== onChange || $[8] !== onCustomRangeChange || $[9] !== tempEnd || $[10] !== tempStart) {
        t4 = ({
            "DateRangeSelector[handleCustomApply]": ()=>{
                if (tempStart && tempEnd && onCustomRangeChange) {
                    const start = new Date(tempStart);
                    start.setHours(0, 0, 0, 0);
                    const end = new Date(tempEnd);
                    end.setHours(23, 59, 59, 999);
                    onCustomRangeChange({
                        start,
                        end
                    });
                    onChange("custom");
                    setShowCustom(false);
                }
            }
        })["DateRangeSelector[handleCustomApply]"];
        $[7] = onChange;
        $[8] = onCustomRangeChange;
        $[9] = tempEnd;
        $[10] = tempStart;
        $[11] = t4;
    } else {
        t4 = $[11];
    }
    const handleCustomApply = t4;
    let t5;
    if ($[12] !== handlePresetClick || $[13] !== showCustom || $[14] !== value) {
        t5 = presets.map({
            "DateRangeSelector[presets.map()]": (preset_0)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: {
                        "DateRangeSelector[presets.map() > <button>.onClick]": ()=>handlePresetClick(preset_0.value)
                    }["DateRangeSelector[presets.map() > <button>.onClick]"],
                    className: `rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${value === preset_0.value && !showCustom ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"}`,
                    children: preset_0.label
                }, preset_0.value, false, {
                    fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/analytics/date-range-selector.tsx",
                    lineNumber: 115,
                    columnNumber: 55
                }, this)
        }["DateRangeSelector[presets.map()]"]);
        $[12] = handlePresetClick;
        $[13] = showCustom;
        $[14] = value;
        $[15] = t5;
    } else {
        t5 = $[15];
    }
    let t6;
    if ($[16] !== showCustom) {
        t6 = ({
            "DateRangeSelector[<button>.onClick]": ()=>setShowCustom(!showCustom)
        })["DateRangeSelector[<button>.onClick]"];
        $[16] = showCustom;
        $[17] = t6;
    } else {
        t6 = $[17];
    }
    const t7 = `rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${value === "custom" ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"}`;
    let t8;
    if ($[18] !== t6 || $[19] !== t7) {
        t8 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            onClick: t6,
            className: t7,
            children: "Custom"
        }, void 0, false, {
            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/analytics/date-range-selector.tsx",
            lineNumber: 139,
            columnNumber: 10
        }, this);
        $[18] = t6;
        $[19] = t7;
        $[20] = t8;
    } else {
        t8 = $[20];
    }
    let t9;
    if ($[21] !== handleCustomApply || $[22] !== showCustom || $[23] !== tempEnd || $[24] !== tempStart) {
        t9 = showCustom && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "fixed inset-0 z-10",
                    onClick: {
                        "DateRangeSelector[<div>.onClick]": ()=>setShowCustom(false)
                    }["DateRangeSelector[<div>.onClick]"]
                }, void 0, false, {
                    fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/analytics/date-range-selector.tsx",
                    lineNumber: 148,
                    columnNumber: 26
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "absolute right-0 z-20 mt-2 w-72 rounded-lg border border-zinc-200 bg-white p-4 shadow-lg",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block text-xs font-medium text-zinc-600",
                                        children: "Start Date"
                                    }, void 0, false, {
                                        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/analytics/date-range-selector.tsx",
                                        lineNumber: 150,
                                        columnNumber: 186
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "date",
                                        value: tempStart,
                                        onChange: {
                                            "DateRangeSelector[<input>.onChange]": (e)=>setTempStart(e.target.value)
                                        }["DateRangeSelector[<input>.onChange]"],
                                        className: "mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-400"
                                    }, void 0, false, {
                                        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/analytics/date-range-selector.tsx",
                                        lineNumber: 150,
                                        columnNumber: 263
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/analytics/date-range-selector.tsx",
                                lineNumber: 150,
                                columnNumber: 181
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block text-xs font-medium text-zinc-600",
                                        children: "End Date"
                                    }, void 0, false, {
                                        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/analytics/date-range-selector.tsx",
                                        lineNumber: 152,
                                        columnNumber: 179
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "date",
                                        value: tempEnd,
                                        onChange: {
                                            "DateRangeSelector[<input>.onChange]": (e_0)=>setTempEnd(e_0.target.value)
                                        }["DateRangeSelector[<input>.onChange]"],
                                        className: "mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-400"
                                    }, void 0, false, {
                                        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/analytics/date-range-selector.tsx",
                                        lineNumber: 152,
                                        columnNumber: 254
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/analytics/date-range-selector.tsx",
                                lineNumber: 152,
                                columnNumber: 174
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex justify-end gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: {
                                            "DateRangeSelector[<button>.onClick]": ()=>setShowCustom(false)
                                        }["DateRangeSelector[<button>.onClick]"],
                                        className: "rounded-lg px-3 py-1.5 text-sm font-medium text-zinc-600 hover:bg-zinc-100",
                                        children: "Cancel"
                                    }, void 0, false, {
                                        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/analytics/date-range-selector.tsx",
                                        lineNumber: 154,
                                        columnNumber: 214
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: handleCustomApply,
                                        disabled: !tempStart || !tempEnd,
                                        className: "rounded-lg bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50",
                                        children: "Apply"
                                    }, void 0, false, {
                                        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/analytics/date-range-selector.tsx",
                                        lineNumber: 156,
                                        columnNumber: 157
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/analytics/date-range-selector.tsx",
                                lineNumber: 154,
                                columnNumber: 174
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/analytics/date-range-selector.tsx",
                        lineNumber: 150,
                        columnNumber: 154
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/analytics/date-range-selector.tsx",
                    lineNumber: 150,
                    columnNumber: 48
                }, this)
            ]
        }, void 0, true);
        $[21] = handleCustomApply;
        $[22] = showCustom;
        $[23] = tempEnd;
        $[24] = tempStart;
        $[25] = t9;
    } else {
        t9 = $[25];
    }
    let t10;
    if ($[26] !== t8 || $[27] !== t9) {
        t10 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "relative",
            children: [
                t8,
                t9
            ]
        }, void 0, true, {
            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/analytics/date-range-selector.tsx",
            lineNumber: 167,
            columnNumber: 11
        }, this);
        $[26] = t8;
        $[27] = t9;
        $[28] = t10;
    } else {
        t10 = $[28];
    }
    let t11;
    if ($[29] !== t10 || $[30] !== t5) {
        t11 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-wrap items-center gap-2",
            children: [
                t5,
                t10
            ]
        }, void 0, true, {
            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/analytics/date-range-selector.tsx",
            lineNumber: 176,
            columnNumber: 11
        }, this);
        $[29] = t10;
        $[30] = t5;
        $[31] = t11;
    } else {
        t11 = $[31];
    }
    return t11;
}
_s(DateRangeSelector, "mhx07S6Ow6VP58zsWhA7Ayitv8U=");
_c = DateRangeSelector;
var _c;
__turbopack_context__.k.register(_c, "DateRangeSelector");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/analytics/spend-conversion-chart.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SpendConversionChart",
    ()=>SpendConversionChart
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
"use client";
;
;
const PLATFORM_COLORS = {
    GOOGLE_ADS: "#4285F4",
    META: "#1877F2",
    TIKTOK: "#FF0050",
    LINKEDIN: "#0A66C2"
};
function formatCurrency(value) {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`;
    return `$${value.toFixed(0)}`;
}
function formatNumber(value) {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toFixed(0);
}
function SpendConversionChart(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(93);
    if ($[0] !== "579ba77894d08e88791b9732b110aea715e27ddbc21cd72b5e6ef4b70379220d") {
        for(let $i = 0; $i < 93; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "579ba77894d08e88791b9732b110aea715e27ddbc21cd72b5e6ef4b70379220d";
    }
    const { data, platformData, showPlatformOverlay: t1, height: t2 } = t0;
    const showPlatformOverlay = t1 === undefined ? false : t1;
    const height = t2 === undefined ? 300 : t2;
    let t3;
    bb0: {
        if (data.length === 0) {
            t3 = null;
            break bb0;
        }
        let t4;
        if ($[1] !== data) {
            t4 = Math.max(...data.map(_SpendConversionChartDataMap), 1);
            $[1] = data;
            $[2] = t4;
        } else {
            t4 = $[2];
        }
        const maxSpend = t4;
        let t5;
        if ($[3] !== data) {
            t5 = Math.max(...data.map(_SpendConversionChartDataMap2), 1);
            $[3] = data;
            $[4] = t5;
        } else {
            t5 = $[4];
        }
        const maxConversions = t5;
        const spendPadding = maxSpend * 0.1;
        const convPadding = maxConversions * 0.1;
        let t6;
        if ($[5] !== convPadding || $[6] !== data || $[7] !== maxConversions || $[8] !== maxSpend || $[9] !== spendPadding) {
            let t7;
            if ($[11] !== convPadding || $[12] !== maxConversions || $[13] !== maxSpend || $[14] !== spendPadding) {
                t7 = ({
                    "SpendConversionChart[data.map()]": (d_1)=>({
                            ...d_1,
                            spendNorm: d_1.spend / (maxSpend + spendPadding),
                            convNorm: d_1.conversions / (maxConversions + convPadding)
                        })
                })["SpendConversionChart[data.map()]"];
                $[11] = convPadding;
                $[12] = maxConversions;
                $[13] = maxSpend;
                $[14] = spendPadding;
                $[15] = t7;
            } else {
                t7 = $[15];
            }
            t6 = data.map(t7);
            $[5] = convPadding;
            $[6] = data;
            $[7] = maxConversions;
            $[8] = maxSpend;
            $[9] = spendPadding;
            $[10] = t6;
        } else {
            t6 = $[10];
        }
        const normalizedSpend = t6;
        const t7 = maxSpend + spendPadding;
        const t8 = maxConversions + convPadding;
        let t9;
        if ($[16] !== normalizedSpend || $[17] !== t7 || $[18] !== t8) {
            t9 = {
                points: normalizedSpend,
                maxSpend: t7,
                maxConversions: t8
            };
            $[16] = normalizedSpend;
            $[17] = t7;
            $[18] = t8;
            $[19] = t9;
        } else {
            t9 = $[19];
        }
        t3 = t9;
    }
    const chartData = t3;
    let t4;
    bb1: {
        if (!platformData || !showPlatformOverlay) {
            t4 = null;
            break bb1;
        }
        let t5;
        if ($[20] !== platformData) {
            t5 = Math.max(...platformData.flatMap(_SpendConversionChartPlatformDataFlatMap), 1);
            $[20] = platformData;
            $[21] = t5;
        } else {
            t5 = $[21];
        }
        const maxSpend_0 = t5;
        let t6;
        if ($[22] !== maxSpend_0 || $[23] !== platformData) {
            let t7;
            if ($[25] !== maxSpend_0) {
                t7 = ({
                    "SpendConversionChart[platformData.map()]": (platform)=>({
                            ...platform,
                            normalizedData: platform.data.map({
                                "SpendConversionChart[platformData.map() > platform.data.map()]": (d_3)=>({
                                        ...d_3,
                                        spendNorm: d_3.spend / (maxSpend_0 * 1.1)
                                    })
                            }["SpendConversionChart[platformData.map() > platform.data.map()]"])
                        })
                })["SpendConversionChart[platformData.map()]"];
                $[25] = maxSpend_0;
                $[26] = t7;
            } else {
                t7 = $[26];
            }
            t6 = platformData.map(t7);
            $[22] = maxSpend_0;
            $[23] = platformData;
            $[24] = t6;
        } else {
            t6 = $[24];
        }
        t4 = t6;
    }
    const platformChartData = t4;
    if (!chartData || data.length === 0) {
        let t5;
        if ($[27] !== height) {
            t5 = {
                height
            };
            $[27] = height;
            $[28] = t5;
        } else {
            t5 = $[28];
        }
        let t6;
        if ($[29] === Symbol.for("react.memo_cache_sentinel")) {
            t6 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-sm text-zinc-500",
                children: "No data available"
            }, void 0, false, {
                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/analytics/spend-conversion-chart.tsx",
                lineNumber: 177,
                columnNumber: 12
            }, this);
            $[29] = t6;
        } else {
            t6 = $[29];
        }
        let t7;
        if ($[30] !== t5) {
            t7 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-center rounded-xl border border-zinc-200 bg-white",
                style: t5,
                children: t6
            }, void 0, false, {
                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/analytics/spend-conversion-chart.tsx",
                lineNumber: 184,
                columnNumber: 12
            }, this);
            $[30] = t5;
            $[31] = t7;
        } else {
            t7 = $[31];
        }
        return t7;
    }
    let t5;
    if ($[32] === Symbol.for("react.memo_cache_sentinel")) {
        t5 = {
            top: 10,
            right: 10,
            bottom: 20,
            left: 10
        };
        $[32] = t5;
    } else {
        t5 = $[32];
    }
    const padding = t5;
    const innerWidth = 100 - padding.left - padding.right;
    const innerHeight = 100 - padding.top - padding.bottom;
    const xStep = innerWidth / Math.max(chartData.points.length - 1, 1);
    let t6;
    if ($[33] !== chartData.points || $[34] !== xStep) {
        let t7;
        if ($[36] !== xStep) {
            t7 = ({
                "SpendConversionChart[chartData.points.map()]": (p_0, i)=>{
                    const x = padding.left + i * xStep;
                    const y = padding.top + innerHeight * (1 - p_0.spendNorm);
                    return `${i === 0 ? "M" : "L"} ${x} ${y}`;
                }
            })["SpendConversionChart[chartData.points.map()]"];
            $[36] = xStep;
            $[37] = t7;
        } else {
            t7 = $[37];
        }
        t6 = chartData.points.map(t7).join(" ");
        $[33] = chartData.points;
        $[34] = xStep;
        $[35] = t6;
    } else {
        t6 = $[35];
    }
    const spendPath = t6;
    let t7;
    if ($[38] !== chartData.points || $[39] !== xStep) {
        let t8;
        if ($[41] !== xStep) {
            t8 = ({
                "SpendConversionChart[chartData.points.map()]": (p_1, i_0)=>{
                    const x_0 = padding.left + i_0 * xStep;
                    const y_0 = padding.top + innerHeight * (1 - p_1.convNorm);
                    return `${i_0 === 0 ? "M" : "L"} ${x_0} ${y_0}`;
                }
            })["SpendConversionChart[chartData.points.map()]"];
            $[41] = xStep;
            $[42] = t8;
        } else {
            t8 = $[42];
        }
        t7 = chartData.points.map(t8).join(" ");
        $[38] = chartData.points;
        $[39] = xStep;
        $[40] = t7;
    } else {
        t7 = $[40];
    }
    const convPath = t7;
    const spendAreaPath = spendPath + ` L ${padding.left + (chartData.points.length - 1) * xStep} ${padding.top + innerHeight}` + ` L ${padding.left} ${padding.top + innerHeight} Z`;
    let t8;
    if ($[43] === Symbol.for("react.memo_cache_sentinel")) {
        t8 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center gap-2",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "h-3 w-3 rounded-full bg-blue-500"
                }, void 0, false, {
                    fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/analytics/spend-conversion-chart.tsx",
                    lineNumber: 259,
                    columnNumber: 51
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "text-xs text-zinc-600",
                    children: "Spend"
                }, void 0, false, {
                    fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/analytics/spend-conversion-chart.tsx",
                    lineNumber: 259,
                    columnNumber: 104
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/analytics/spend-conversion-chart.tsx",
            lineNumber: 259,
            columnNumber: 10
        }, this);
        $[43] = t8;
    } else {
        t8 = $[43];
    }
    let t9;
    if ($[44] === Symbol.for("react.memo_cache_sentinel")) {
        t9 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center gap-4",
            children: [
                t8,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "h-3 w-3 rounded-full bg-green-500"
                        }, void 0, false, {
                            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/analytics/spend-conversion-chart.tsx",
                            lineNumber: 266,
                            columnNumber: 96
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-xs text-zinc-600",
                            children: "Conversions"
                        }, void 0, false, {
                            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/analytics/spend-conversion-chart.tsx",
                            lineNumber: 266,
                            columnNumber: 150
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/analytics/spend-conversion-chart.tsx",
                    lineNumber: 266,
                    columnNumber: 55
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/analytics/spend-conversion-chart.tsx",
            lineNumber: 266,
            columnNumber: 10
        }, this);
        $[44] = t9;
    } else {
        t9 = $[44];
    }
    let t10;
    if ($[45] !== chartData.maxSpend) {
        t10 = formatCurrency(chartData.maxSpend);
        $[45] = chartData.maxSpend;
        $[46] = t10;
    } else {
        t10 = $[46];
    }
    let t11;
    if ($[47] !== t10) {
        t11 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            children: [
                "Max: ",
                t10
            ]
        }, void 0, true, {
            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/analytics/spend-conversion-chart.tsx",
            lineNumber: 281,
            columnNumber: 11
        }, this);
        $[47] = t10;
        $[48] = t11;
    } else {
        t11 = $[48];
    }
    let t12;
    if ($[49] !== chartData.maxConversions) {
        t12 = formatNumber(chartData.maxConversions);
        $[49] = chartData.maxConversions;
        $[50] = t12;
    } else {
        t12 = $[50];
    }
    let t13;
    if ($[51] !== t12) {
        t13 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            children: [
                "Max: ",
                t12,
                " conv"
            ]
        }, void 0, true, {
            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/analytics/spend-conversion-chart.tsx",
            lineNumber: 297,
            columnNumber: 11
        }, this);
        $[51] = t12;
        $[52] = t13;
    } else {
        t13 = $[52];
    }
    let t14;
    if ($[53] !== t11 || $[54] !== t13) {
        t14 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "mb-4 flex items-center justify-between",
            children: [
                t9,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-4 text-xs text-zinc-500",
                    children: [
                        t11,
                        t13
                    ]
                }, void 0, true, {
                    fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/analytics/spend-conversion-chart.tsx",
                    lineNumber: 305,
                    columnNumber: 71
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/analytics/spend-conversion-chart.tsx",
            lineNumber: 305,
            columnNumber: 11
        }, this);
        $[53] = t11;
        $[54] = t13;
        $[55] = t14;
    } else {
        t14 = $[55];
    }
    let t15;
    if ($[56] !== height) {
        t15 = {
            height
        };
        $[56] = height;
        $[57] = t15;
    } else {
        t15 = $[57];
    }
    let t16;
    let t17;
    if ($[58] === Symbol.for("react.memo_cache_sentinel")) {
        t16 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("defs", {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("linearGradient", {
                id: "spendGradient",
                x1: "0",
                y1: "0",
                x2: "0",
                y2: "1",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                        offset: "0%",
                        stopColor: "#3B82F6",
                        stopOpacity: "0.3"
                    }, void 0, false, {
                        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/analytics/spend-conversion-chart.tsx",
                        lineNumber: 325,
                        columnNumber: 80
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                        offset: "100%",
                        stopColor: "#3B82F6",
                        stopOpacity: "0.05"
                    }, void 0, false, {
                        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/analytics/spend-conversion-chart.tsx",
                        lineNumber: 325,
                        columnNumber: 138
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/analytics/spend-conversion-chart.tsx",
                lineNumber: 325,
                columnNumber: 17
            }, this)
        }, void 0, false, {
            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/analytics/spend-conversion-chart.tsx",
            lineNumber: 325,
            columnNumber: 11
        }, this);
        t17 = [
            0,
            0.25,
            0.5,
            0.75,
            1
        ].map({
            "SpendConversionChart[(anonymous)()]": (tick)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                    x1: padding.left,
                    y1: padding.top + innerHeight * tick,
                    x2: padding.left + innerWidth,
                    y2: padding.top + innerHeight * tick,
                    stroke: "#e4e4e7",
                    strokeWidth: "0.5"
                }, tick, false, {
                    fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/analytics/spend-conversion-chart.tsx",
                    lineNumber: 327,
                    columnNumber: 54
                }, this)
        }["SpendConversionChart[(anonymous)()]"]);
        $[58] = t16;
        $[59] = t17;
    } else {
        t16 = $[58];
        t17 = $[59];
    }
    let t18;
    if ($[60] !== spendAreaPath) {
        t18 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: spendAreaPath,
            fill: "url(#spendGradient)"
        }, void 0, false, {
            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/analytics/spend-conversion-chart.tsx",
            lineNumber: 337,
            columnNumber: 11
        }, this);
        $[60] = spendAreaPath;
        $[61] = t18;
    } else {
        t18 = $[61];
    }
    let t19;
    if ($[62] !== spendPath) {
        t19 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: spendPath,
            fill: "none",
            stroke: "#3B82F6",
            strokeWidth: "2",
            vectorEffect: "non-scaling-stroke"
        }, void 0, false, {
            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/analytics/spend-conversion-chart.tsx",
            lineNumber: 345,
            columnNumber: 11
        }, this);
        $[62] = spendPath;
        $[63] = t19;
    } else {
        t19 = $[63];
    }
    let t20;
    if ($[64] !== convPath) {
        t20 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: convPath,
            fill: "none",
            stroke: "#22C55E",
            strokeWidth: "2",
            vectorEffect: "non-scaling-stroke"
        }, void 0, false, {
            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/analytics/spend-conversion-chart.tsx",
            lineNumber: 353,
            columnNumber: 11
        }, this);
        $[64] = convPath;
        $[65] = t20;
    } else {
        t20 = $[65];
    }
    let t21;
    if ($[66] !== platformChartData || $[67] !== showPlatformOverlay || $[68] !== xStep) {
        t21 = showPlatformOverlay && platformChartData?.map({
            "SpendConversionChart[(anonymous)()]": (platform_0)=>{
                const platformPath = platform_0.normalizedData.map({
                    "SpendConversionChart[(anonymous)() > platform_0.normalizedData.map()]": (p_2, i_1)=>{
                        const x_1 = padding.left + i_1 * xStep;
                        const y_1 = padding.top + innerHeight * (1 - p_2.spendNorm);
                        return `${i_1 === 0 ? "M" : "L"} ${x_1} ${y_1}`;
                    }
                }["SpendConversionChart[(anonymous)() > platform_0.normalizedData.map()]"]).join(" ");
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: platformPath,
                    fill: "none",
                    stroke: PLATFORM_COLORS[platform_0.platformCode] ?? "#6B7280",
                    strokeWidth: "1.5",
                    strokeDasharray: "4 2",
                    vectorEffect: "non-scaling-stroke",
                    opacity: "0.7"
                }, platform_0.platformCode, false, {
                    fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/analytics/spend-conversion-chart.tsx",
                    lineNumber: 370,
                    columnNumber: 16
                }, this);
            }
        }["SpendConversionChart[(anonymous)()]"]);
        $[66] = platformChartData;
        $[67] = showPlatformOverlay;
        $[68] = xStep;
        $[69] = t21;
    } else {
        t21 = $[69];
    }
    let t22;
    if ($[70] !== chartData.points || $[71] !== xStep) {
        let t23;
        if ($[73] !== xStep) {
            t23 = ({
                "SpendConversionChart[chartData.points.map()]": (p_3, i_2)=>{
                    const x_2 = padding.left + i_2 * xStep;
                    const ySpend = padding.top + innerHeight * (1 - p_3.spendNorm);
                    const yConv = padding.top + innerHeight * (1 - p_3.convNorm);
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                cx: x_2,
                                cy: ySpend,
                                r: "1.5",
                                fill: "#3B82F6",
                                className: "hover:r-3 transition-all"
                            }, void 0, false, {
                                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/analytics/spend-conversion-chart.tsx",
                                lineNumber: 389,
                                columnNumber: 36
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                cx: x_2,
                                cy: yConv,
                                r: "1.5",
                                fill: "#22C55E",
                                className: "hover:r-3 transition-all"
                            }, void 0, false, {
                                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/analytics/spend-conversion-chart.tsx",
                                lineNumber: 389,
                                columnNumber: 127
                            }, this)
                        ]
                    }, p_3.date, true, {
                        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/analytics/spend-conversion-chart.tsx",
                        lineNumber: 389,
                        columnNumber: 18
                    }, this);
                }
            })["SpendConversionChart[chartData.points.map()]"];
            $[73] = xStep;
            $[74] = t23;
        } else {
            t23 = $[74];
        }
        t22 = chartData.points.map(t23);
        $[70] = chartData.points;
        $[71] = xStep;
        $[72] = t22;
    } else {
        t22 = $[72];
    }
    let t23;
    if ($[75] !== chartData.points || $[76] !== xStep) {
        t23 = chartData.points.length <= 31 && chartData.points.filter({
            "SpendConversionChart[chartData.points.filter()]": (_, i_3)=>i_3 % Math.ceil(chartData.points.length / 7) === 0
        }["SpendConversionChart[chartData.points.filter()]"]).map({
            "SpendConversionChart[(anonymous)()]": (p_4, i_4, arr)=>{
                const originalIndex = chartData.points.findIndex({
                    "SpendConversionChart[(anonymous)() > chartData.points.findIndex()]": (pt)=>pt.date === p_4.date
                }["SpendConversionChart[(anonymous)() > chartData.points.findIndex()]"]);
                const x_3 = padding.left + originalIndex * xStep;
                const label = new Date(p_4.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric"
                });
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                    x: x_3,
                    y: 98,
                    textAnchor: i_4 === 0 ? "start" : i_4 === arr.length - 1 ? "end" : "middle",
                    className: "fill-zinc-500",
                    style: {
                        fontSize: "3px"
                    },
                    children: label
                }, p_4.date, false, {
                    fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/analytics/spend-conversion-chart.tsx",
                    lineNumber: 418,
                    columnNumber: 16
                }, this);
            }
        }["SpendConversionChart[(anonymous)()]"]);
        $[75] = chartData.points;
        $[76] = xStep;
        $[77] = t23;
    } else {
        t23 = $[77];
    }
    let t24;
    if ($[78] !== t15 || $[79] !== t18 || $[80] !== t19 || $[81] !== t20 || $[82] !== t21 || $[83] !== t22 || $[84] !== t23) {
        t24 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            viewBox: "0 0 100 100",
            className: "w-full",
            style: t15,
            preserveAspectRatio: "none",
            children: [
                t16,
                t17,
                t18,
                t19,
                t20,
                t21,
                t22,
                t23
            ]
        }, void 0, true, {
            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/analytics/spend-conversion-chart.tsx",
            lineNumber: 431,
            columnNumber: 11
        }, this);
        $[78] = t15;
        $[79] = t18;
        $[80] = t19;
        $[81] = t20;
        $[82] = t21;
        $[83] = t22;
        $[84] = t23;
        $[85] = t24;
    } else {
        t24 = $[85];
    }
    let t25;
    if ($[86] !== platformData || $[87] !== showPlatformOverlay) {
        t25 = showPlatformOverlay && platformData && platformData.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "mt-3 flex flex-wrap items-center gap-3 border-t border-zinc-100 pt-3",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "text-xs text-zinc-500",
                    children: "Platforms:"
                }, void 0, false, {
                    fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/analytics/spend-conversion-chart.tsx",
                    lineNumber: 445,
                    columnNumber: 163
                }, this),
                platformData.map(_SpendConversionChartPlatformDataMap)
            ]
        }, void 0, true, {
            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/analytics/spend-conversion-chart.tsx",
            lineNumber: 445,
            columnNumber: 77
        }, this);
        $[86] = platformData;
        $[87] = showPlatformOverlay;
        $[88] = t25;
    } else {
        t25 = $[88];
    }
    let t26;
    if ($[89] !== t14 || $[90] !== t24 || $[91] !== t25) {
        t26 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "rounded-xl border border-zinc-200 bg-white p-4",
            children: [
                t14,
                t24,
                t25
            ]
        }, void 0, true, {
            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/analytics/spend-conversion-chart.tsx",
            lineNumber: 454,
            columnNumber: 11
        }, this);
        $[89] = t14;
        $[90] = t24;
        $[91] = t25;
        $[92] = t26;
    } else {
        t26 = $[92];
    }
    return t26;
}
_c = SpendConversionChart;
function _SpendConversionChartPlatformDataMap(platform_1) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex items-center gap-1.5",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "h-2 w-4 rounded-sm",
                style: {
                    backgroundColor: PLATFORM_COLORS[platform_1.platformCode] ?? "#6B7280"
                }
            }, void 0, false, {
                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/analytics/spend-conversion-chart.tsx",
                lineNumber: 465,
                columnNumber: 83
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "text-xs text-zinc-600",
                children: platform_1.platformName
            }, void 0, false, {
                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/analytics/spend-conversion-chart.tsx",
                lineNumber: 467,
                columnNumber: 10
            }, this)
        ]
    }, platform_1.platformCode, true, {
        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/analytics/spend-conversion-chart.tsx",
        lineNumber: 465,
        columnNumber: 10
    }, this);
}
function _SpendConversionChartPlatformDataFlatMap(p) {
    return p.data.map(_SpendConversionChartPlatformDataFlatMapPDataMap);
}
function _SpendConversionChartPlatformDataFlatMapPDataMap(d_2) {
    return d_2.spend;
}
function _SpendConversionChartDataMap2(d_0) {
    return d_0.conversions;
}
function _SpendConversionChartDataMap(d) {
    return d.spend;
}
var _c;
__turbopack_context__.k.register(_c, "SpendConversionChart");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/analytics/client.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AnalyticsPageClient",
    ()=>AnalyticsPageClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$components$2f$analytics$2f$date$2d$range$2d$selector$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/analytics/date-range-selector.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$components$2f$analytics$2f$spend$2d$conversion$2d$chart$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/analytics/spend-conversion-chart.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
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
    return new Intl.NumberFormat("en-US").format(value);
}
function AnalyticsPageClient(t0) {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(54);
    if ($[0] !== "0b804fff5c0aa45324f3c91e736478284f8efd9de9d27e32f472e43d8237fe0b") {
        for(let $i = 0; $i < 54; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "0b804fff5c0aa45324f3c91e736478284f8efd9de9d27e32f472e43d8237fe0b";
    }
    const { initialData, initialDateRange } = t0;
    const [datePreset, setDatePreset] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("30d");
    let t1;
    if ($[1] !== initialDateRange.start) {
        t1 = new Date(initialDateRange.start);
        $[1] = initialDateRange.start;
        $[2] = t1;
    } else {
        t1 = $[2];
    }
    let t2;
    if ($[3] !== initialDateRange.end) {
        t2 = new Date(initialDateRange.end);
        $[3] = initialDateRange.end;
        $[4] = t2;
    } else {
        t2 = $[4];
    }
    let t3;
    if ($[5] !== t1 || $[6] !== t2) {
        t3 = {
            start: t1,
            end: t2
        };
        $[5] = t1;
        $[6] = t2;
        $[7] = t3;
    } else {
        t3 = $[7];
    }
    const [customRange, setCustomRange] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(t3);
    const [showPlatformOverlay, setShowPlatformOverlay] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [data] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialData);
    let t4;
    if ($[8] === Symbol.for("react.memo_cache_sentinel")) {
        t4 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-2xl font-semibold tracking-tight",
                        children: "Analytics"
                    }, void 0, false, {
                        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/analytics/client.tsx",
                        lineNumber: 72,
                        columnNumber: 99
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-1 text-sm text-zinc-600",
                        children: "Spend and conversion trends over time"
                    }, void 0, false, {
                        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/analytics/client.tsx",
                        lineNumber: 72,
                        columnNumber: 167
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/analytics/client.tsx",
                lineNumber: 72,
                columnNumber: 94
            }, this)
        }, void 0, false, {
            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/analytics/client.tsx",
            lineNumber: 72,
            columnNumber: 10
        }, this);
        $[8] = t4;
    } else {
        t4 = $[8];
    }
    let t5;
    if ($[9] !== customRange || $[10] !== datePreset) {
        t5 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$components$2f$analytics$2f$date$2d$range$2d$selector$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DateRangeSelector"], {
            value: datePreset,
            onChange: setDatePreset,
            customRange: customRange,
            onCustomRangeChange: setCustomRange
        }, void 0, false, {
            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/analytics/client.tsx",
            lineNumber: 79,
            columnNumber: 10
        }, this);
        $[9] = customRange;
        $[10] = datePreset;
        $[11] = t5;
    } else {
        t5 = $[11];
    }
    let t6;
    if ($[12] === Symbol.for("react.memo_cache_sentinel")) {
        t6 = ({
            "AnalyticsPageClient[<input>.onChange]": (e)=>setShowPlatformOverlay(e.target.checked)
        })["AnalyticsPageClient[<input>.onChange]"];
        $[12] = t6;
    } else {
        t6 = $[12];
    }
    let t7;
    if ($[13] !== showPlatformOverlay) {
        t7 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
            type: "checkbox",
            checked: showPlatformOverlay,
            onChange: t6,
            className: "h-4 w-4 rounded border-zinc-300"
        }, void 0, false, {
            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/analytics/client.tsx",
            lineNumber: 97,
            columnNumber: 10
        }, this);
        $[13] = showPlatformOverlay;
        $[14] = t7;
    } else {
        t7 = $[14];
    }
    let t8;
    if ($[15] === Symbol.for("react.memo_cache_sentinel")) {
        t8 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: "text-sm text-zinc-600",
            children: "Show platform breakdown"
        }, void 0, false, {
            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/analytics/client.tsx",
            lineNumber: 105,
            columnNumber: 10
        }, this);
        $[15] = t8;
    } else {
        t8 = $[15];
    }
    let t9;
    if ($[16] !== t7) {
        t9 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
            className: "flex items-center gap-2",
            children: [
                t7,
                t8
            ]
        }, void 0, true, {
            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/analytics/client.tsx",
            lineNumber: 112,
            columnNumber: 10
        }, this);
        $[16] = t7;
        $[17] = t9;
    } else {
        t9 = $[17];
    }
    let t10;
    if ($[18] !== t5 || $[19] !== t9) {
        t10 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
            children: [
                t5,
                t9
            ]
        }, void 0, true, {
            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/analytics/client.tsx",
            lineNumber: 120,
            columnNumber: 11
        }, this);
        $[18] = t5;
        $[19] = t9;
        $[20] = t10;
    } else {
        t10 = $[20];
    }
    let t11;
    if ($[21] !== data.summary.totalSpend) {
        t11 = formatCurrency(data.summary.totalSpend);
        $[21] = data.summary.totalSpend;
        $[22] = t11;
    } else {
        t11 = $[22];
    }
    let t12;
    if ($[23] !== t11) {
        t12 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SummaryCard, {
            label: "Total Spend",
            value: t11
        }, void 0, false, {
            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/analytics/client.tsx",
            lineNumber: 137,
            columnNumber: 11
        }, this);
        $[23] = t11;
        $[24] = t12;
    } else {
        t12 = $[24];
    }
    let t13;
    if ($[25] !== data.summary.totalConversions) {
        t13 = formatNumber(data.summary.totalConversions);
        $[25] = data.summary.totalConversions;
        $[26] = t13;
    } else {
        t13 = $[26];
    }
    let t14;
    if ($[27] !== t13) {
        t14 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SummaryCard, {
            label: "Total Conversions",
            value: t13
        }, void 0, false, {
            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/analytics/client.tsx",
            lineNumber: 153,
            columnNumber: 11
        }, this);
        $[27] = t13;
        $[28] = t14;
    } else {
        t14 = $[28];
    }
    let t15;
    if ($[29] !== data.summary.avgCpa) {
        t15 = data.summary.avgCpa ? formatCurrency(data.summary.avgCpa) : "\u2014";
        $[29] = data.summary.avgCpa;
        $[30] = t15;
    } else {
        t15 = $[30];
    }
    let t16;
    if ($[31] !== t15) {
        t16 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SummaryCard, {
            label: "Average CPA",
            value: t15
        }, void 0, false, {
            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/analytics/client.tsx",
            lineNumber: 169,
            columnNumber: 11
        }, this);
        $[31] = t15;
        $[32] = t16;
    } else {
        t16 = $[32];
    }
    let t17;
    if ($[33] !== data.summary.totalRevenue) {
        t17 = formatCurrency(data.summary.totalRevenue);
        $[33] = data.summary.totalRevenue;
        $[34] = t17;
    } else {
        t17 = $[34];
    }
    let t18;
    if ($[35] !== t17) {
        t18 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SummaryCard, {
            label: "Total Revenue",
            value: t17
        }, void 0, false, {
            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/analytics/client.tsx",
            lineNumber: 185,
            columnNumber: 11
        }, this);
        $[35] = t17;
        $[36] = t18;
    } else {
        t18 = $[36];
    }
    let t19;
    if ($[37] !== t12 || $[38] !== t14 || $[39] !== t16 || $[40] !== t18) {
        t19 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
            children: [
                t12,
                t14,
                t16,
                t18
            ]
        }, void 0, true, {
            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/analytics/client.tsx",
            lineNumber: 193,
            columnNumber: 11
        }, this);
        $[37] = t12;
        $[38] = t14;
        $[39] = t16;
        $[40] = t18;
        $[41] = t19;
    } else {
        t19 = $[41];
    }
    let t20;
    if ($[42] === Symbol.for("react.memo_cache_sentinel")) {
        t20 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
            className: "mb-3 text-sm font-medium text-zinc-900",
            children: "Spend vs Conversions"
        }, void 0, false, {
            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/analytics/client.tsx",
            lineNumber: 204,
            columnNumber: 11
        }, this);
        $[42] = t20;
    } else {
        t20 = $[42];
    }
    let t21;
    if ($[43] !== data.byPlatform || $[44] !== data.total || $[45] !== showPlatformOverlay) {
        t21 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: [
                t20,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$components$2f$analytics$2f$spend$2d$conversion$2d$chart$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SpendConversionChart"], {
                    data: data.total,
                    platformData: data.byPlatform,
                    showPlatformOverlay: showPlatformOverlay,
                    height: 350
                }, void 0, false, {
                    fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/analytics/client.tsx",
                    lineNumber: 211,
                    columnNumber: 21
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/analytics/client.tsx",
            lineNumber: 211,
            columnNumber: 11
        }, this);
        $[43] = data.byPlatform;
        $[44] = data.total;
        $[45] = showPlatformOverlay;
        $[46] = t21;
    } else {
        t21 = $[46];
    }
    let t22;
    if ($[47] !== data.byPlatform) {
        t22 = data.byPlatform.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                    className: "mb-3 text-sm font-medium text-zinc-900",
                    children: "Platform Breakdown"
                }, void 0, false, {
                    fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/analytics/client.tsx",
                    lineNumber: 221,
                    columnNumber: 46
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid gap-4 lg:grid-cols-2",
                    children: data.byPlatform.map(_AnalyticsPageClientDataByPlatformMap)
                }, void 0, false, {
                    fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/analytics/client.tsx",
                    lineNumber: 221,
                    columnNumber: 124
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/analytics/client.tsx",
            lineNumber: 221,
            columnNumber: 41
        }, this);
        $[47] = data.byPlatform;
        $[48] = t22;
    } else {
        t22 = $[48];
    }
    let t23;
    if ($[49] !== t10 || $[50] !== t19 || $[51] !== t21 || $[52] !== t22) {
        t23 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "space-y-6",
            children: [
                t4,
                t10,
                t19,
                t21,
                t22
            ]
        }, void 0, true, {
            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/analytics/client.tsx",
            lineNumber: 229,
            columnNumber: 11
        }, this);
        $[49] = t10;
        $[50] = t19;
        $[51] = t21;
        $[52] = t22;
        $[53] = t23;
    } else {
        t23 = $[53];
    }
    return t23;
}
_s(AnalyticsPageClient, "HOPKpCSHvLHcsnOks7dKJltB2/Y=");
_c = AnalyticsPageClient;
function _AnalyticsPageClientDataByPlatformMap(platform) {
    const totalSpend = platform.data.reduce(_AnalyticsPageClientDataByPlatformMapPlatformDataReduce, 0);
    const totalConv = platform.data.reduce(_AnalyticsPageClientDataByPlatformMapPlatformDataReduce2, 0);
    const cpa = totalConv > 0 ? totalSpend / totalConv : null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "rounded-xl border border-zinc-200 bg-white p-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-3 flex items-center justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(PlatformBadge, {
                                code: platform.platformCode
                            }, void 0, false, {
                                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/analytics/client.tsx",
                                lineNumber: 244,
                                columnNumber: 199
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "font-medium",
                                children: platform.platformName
                            }, void 0, false, {
                                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/analytics/client.tsx",
                                lineNumber: 244,
                                columnNumber: 245
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/analytics/client.tsx",
                        lineNumber: 244,
                        columnNumber: 158
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-right text-xs text-zinc-500",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    formatCurrency(totalSpend),
                                    " spend"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/analytics/client.tsx",
                                lineNumber: 244,
                                columnNumber: 361
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    formatNumber(totalConv),
                                    " conv"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/analytics/client.tsx",
                                lineNumber: 244,
                                columnNumber: 406
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/analytics/client.tsx",
                        lineNumber: 244,
                        columnNumber: 311
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/analytics/client.tsx",
                lineNumber: 244,
                columnNumber: 102
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$components$2f$analytics$2f$spend$2d$conversion$2d$chart$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SpendConversionChart"], {
                data: platform.data,
                height: 150,
                showPlatformOverlay: false
            }, void 0, false, {
                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/analytics/client.tsx",
                lineNumber: 244,
                columnNumber: 459
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-2 text-center text-xs text-zinc-500",
                children: [
                    "CPA: ",
                    cpa ? formatCurrency(cpa) : "\u2014"
                ]
            }, void 0, true, {
                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/analytics/client.tsx",
                lineNumber: 244,
                columnNumber: 545
            }, this)
        ]
    }, platform.platformCode, true, {
        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/analytics/client.tsx",
        lineNumber: 244,
        columnNumber: 10
    }, this);
}
function _AnalyticsPageClientDataByPlatformMapPlatformDataReduce2(s_0, d_0) {
    return s_0 + d_0.conversions;
}
function _AnalyticsPageClientDataByPlatformMapPlatformDataReduce(s, d) {
    return s + d.spend;
}
function SummaryCard(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(8);
    if ($[0] !== "0b804fff5c0aa45324f3c91e736478284f8efd9de9d27e32f472e43d8237fe0b") {
        for(let $i = 0; $i < 8; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "0b804fff5c0aa45324f3c91e736478284f8efd9de9d27e32f472e43d8237fe0b";
    }
    const { label, value } = t0;
    let t1;
    if ($[1] !== label) {
        t1 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "text-xs font-medium text-zinc-500",
            children: label
        }, void 0, false, {
            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/analytics/client.tsx",
            lineNumber: 266,
            columnNumber: 10
        }, this);
        $[1] = label;
        $[2] = t1;
    } else {
        t1 = $[2];
    }
    let t2;
    if ($[3] !== value) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "mt-1 text-xl font-semibold tracking-tight",
            children: value
        }, void 0, false, {
            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/analytics/client.tsx",
            lineNumber: 274,
            columnNumber: 10
        }, this);
        $[3] = value;
        $[4] = t2;
    } else {
        t2 = $[4];
    }
    let t3;
    if ($[5] !== t1 || $[6] !== t2) {
        t3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "rounded-xl border border-zinc-200 bg-white p-4",
            children: [
                t1,
                t2
            ]
        }, void 0, true, {
            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/analytics/client.tsx",
            lineNumber: 282,
            columnNumber: 10
        }, this);
        $[5] = t1;
        $[6] = t2;
        $[7] = t3;
    } else {
        t3 = $[7];
    }
    return t3;
}
_c1 = SummaryCard;
function PlatformBadge(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(6);
    if ($[0] !== "0b804fff5c0aa45324f3c91e736478284f8efd9de9d27e32f472e43d8237fe0b") {
        for(let $i = 0; $i < 6; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "0b804fff5c0aa45324f3c91e736478284f8efd9de9d27e32f472e43d8237fe0b";
    }
    const { code } = t0;
    let t1;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t1 = {
            GOOGLE_ADS: "bg-blue-500",
            META: "bg-indigo-500",
            TIKTOK: "bg-pink-500",
            LINKEDIN: "bg-sky-600"
        };
        $[1] = t1;
    } else {
        t1 = $[1];
    }
    const colors = t1;
    let t2;
    if ($[2] === Symbol.for("react.memo_cache_sentinel")) {
        t2 = {
            GOOGLE_ADS: "G",
            META: "M",
            TIKTOK: "T",
            LINKEDIN: "L"
        };
        $[2] = t2;
    } else {
        t2 = $[2];
    }
    const labels = t2;
    const t3 = `inline-flex h-6 w-6 items-center justify-center rounded text-xs font-bold text-white ${colors[code] ?? "bg-zinc-500"}`;
    const t4 = labels[code] ?? "?";
    let t5;
    if ($[3] !== t3 || $[4] !== t4) {
        t5 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: t3,
            children: t4
        }, void 0, false, {
            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/analytics/client.tsx",
            lineNumber: 332,
            columnNumber: 10
        }, this);
        $[3] = t3;
        $[4] = t4;
        $[5] = t5;
    } else {
        t5 = $[5];
    }
    return t5;
}
_c2 = PlatformBadge;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "AnalyticsPageClient");
__turbopack_context__.k.register(_c1, "SummaryCard");
__turbopack_context__.k.register(_c2, "PlatformBadge");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=13466_Desktop_Optiq_CascadeProjects_windsurf-project_apps_frontend_src_bf5b7cd3._.js.map