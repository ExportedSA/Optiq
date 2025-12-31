module.exports = [
"[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/notifications/client.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "NotificationsClient",
    ()=>NotificationsClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
function NotificationsClient() {
    const [items, setItems] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const load = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/notifications?limit=50&includeRead=true");
            if (!res.ok) throw new Error("Failed to load notifications");
            const json = await res.json();
            setItems(json.notifications ?? []);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Unknown error");
        } finally{
            setLoading(false);
        }
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        void load();
    }, [
        load
    ]);
    async function markRead(id) {
        await fetch("/api/notifications/read", {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                notificationId: id
            })
        });
        void load();
    }
    async function markAllRead() {
        await fetch("/api/notifications/read-all", {
            method: "POST"
        });
        void load();
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-end justify-between gap-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "text-2xl font-semibold tracking-tight",
                                children: "Notifications"
                            }, void 0, false, {
                                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/notifications/client.tsx",
                                lineNumber: 60,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-1 text-sm text-zinc-600",
                                children: "Alerts and system messages for your workspace."
                            }, void 0, false, {
                                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/notifications/client.tsx",
                                lineNumber: 61,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/notifications/client.tsx",
                        lineNumber: 59,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>void markAllRead(),
                        className: "rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50",
                        children: "Mark all read"
                    }, void 0, false, {
                        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/notifications/client.tsx",
                        lineNumber: 64,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/notifications/client.tsx",
                lineNumber: 58,
                columnNumber: 7
            }, this),
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700",
                children: error
            }, void 0, false, {
                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/notifications/client.tsx",
                lineNumber: 73,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "overflow-hidden rounded-xl border border-zinc-200 bg-white",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "divide-y divide-zinc-100",
                    children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-6 text-sm text-zinc-500",
                        children: "Loading…"
                    }, void 0, false, {
                        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/notifications/client.tsx",
                        lineNumber: 79,
                        columnNumber: 13
                    }, this) : items.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-6 text-sm text-zinc-500",
                        children: "No notifications."
                    }, void 0, false, {
                        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/notifications/client.tsx",
                        lineNumber: 81,
                        columnNumber: 13
                    }, this) : items.map((n)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-start justify-between gap-4 p-4 hover:bg-zinc-50",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: `text-xs font-medium ${n.readAt ? "text-zinc-400" : "text-zinc-900"}`,
                                                    children: n.title
                                                }, void 0, false, {
                                                    fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/notifications/client.tsx",
                                                    lineNumber: 87,
                                                    columnNumber: 21
                                                }, this),
                                                !n.readAt && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700",
                                                    children: "new"
                                                }, void 0, false, {
                                                    fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/notifications/client.tsx",
                                                    lineNumber: 91,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600",
                                                    children: n.priority
                                                }, void 0, false, {
                                                    fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/notifications/client.tsx",
                                                    lineNumber: 93,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/notifications/client.tsx",
                                            lineNumber: 86,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "mt-1 text-sm text-zinc-600",
                                            children: n.message
                                        }, void 0, false, {
                                            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/notifications/client.tsx",
                                            lineNumber: 97,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mt-2 text-xs text-zinc-500",
                                            children: new Date(n.createdAt).toLocaleString()
                                        }, void 0, false, {
                                            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/notifications/client.tsx",
                                            lineNumber: 98,
                                            columnNumber: 19
                                        }, this),
                                        n.actionUrl ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                            className: "mt-2 inline-block text-sm underline",
                                            href: n.actionUrl,
                                            children: "View"
                                        }, void 0, false, {
                                            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/notifications/client.tsx",
                                            lineNumber: 103,
                                            columnNumber: 21
                                        }, this) : null
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/notifications/client.tsx",
                                    lineNumber: 85,
                                    columnNumber: 17
                                }, this),
                                !n.readAt ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>void markRead(n.id),
                                    className: "rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50",
                                    children: "Mark read"
                                }, void 0, false, {
                                    fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/notifications/client.tsx",
                                    lineNumber: 110,
                                    columnNumber: 19
                                }, this) : null
                            ]
                        }, n.id, true, {
                            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/notifications/client.tsx",
                            lineNumber: 84,
                            columnNumber: 15
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/notifications/client.tsx",
                    lineNumber: 77,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/notifications/client.tsx",
                lineNumber: 76,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/notifications/client.tsx",
        lineNumber: 57,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=1c0b7_windsurf-project_apps_frontend_src_app_app_notifications_client_tsx_a0465b67._.js.map