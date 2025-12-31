module.exports = [
"[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/favicon.ico.mjs { IMAGE => \"[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/favicon.ico (static in ecmascript, tag client)\" } [app-rsc] (structured image object, ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/favicon.ico.mjs { IMAGE => \"[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/favicon.ico (static in ecmascript, tag client)\" } [app-rsc] (structured image object, ecmascript)"));
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/layout.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/layout.tsx [app-rsc] (ecmascript)"));
}),
"[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/layout.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/layout.tsx [app-rsc] (ecmascript)"));
}),
"[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/lib/waste/types.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DEFAULT_WASTE_CONFIG",
    ()=>DEFAULT_WASTE_CONFIG,
    "computeCpa",
    ()=>computeCpa,
    "computeCtr",
    ()=>computeCtr,
    "determineWasteLevel",
    ()=>determineWasteLevel,
    "dollarsToMicros",
    ()=>dollarsToMicros,
    "microsToDollars",
    ()=>microsToDollars
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$server$2d$only$2f$empty$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/node_modules/next/dist/compiled/server-only/empty.js [app-rsc] (ecmascript)");
;
const DEFAULT_WASTE_CONFIG = {
    spendThresholdMicros: BigInt(50_000_000),
    targetCpaMicros: BigInt(25_000_000),
    cpaTolerancePercent: 50,
    minImpressions: 1000,
    minCtrPercent: 0.5,
    rollingWindowDays: 7
};
function microsToDollars(micros) {
    return Number(micros) / 1_000_000;
}
function dollarsToMicros(dollars) {
    return BigInt(Math.round(dollars * 1_000_000));
}
function computeCpa(spendMicros, conversions) {
    if (conversions === BigInt(0)) return null;
    return Number(spendMicros) / Number(conversions);
}
function computeCtr(clicks, impressions) {
    if (impressions === BigInt(0)) return 0;
    return Number(clicks) / Number(impressions) * 100;
}
function determineWasteLevel(spendMicros, config, reason) {
    const spendDollars = microsToDollars(spendMicros);
    const thresholdDollars = microsToDollars(config.spendThresholdMicros);
    if (reason === "zero_conversions_high_spend") {
        if (spendDollars >= thresholdDollars * 5) return "critical";
        if (spendDollars >= thresholdDollars * 2) return "high";
        if (spendDollars >= thresholdDollars) return "medium";
        return "low";
    }
    if (reason === "cpa_above_target") {
        if (spendDollars >= thresholdDollars * 3) return "high";
        if (spendDollars >= thresholdDollars) return "medium";
        return "low";
    }
    return "low";
}
}),
"[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/lib/waste/evaluator.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "WasteEvaluator",
    ()=>WasteEvaluator,
    "wasteEvaluator",
    ()=>wasteEvaluator
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$server$2d$only$2f$empty$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/node_modules/next/dist/compiled/server-only/empty.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/lib/prisma.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$waste$2f$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/lib/waste/types.ts [app-rsc] (ecmascript)");
;
;
;
function createRollingWindow(days, endDate) {
    const end = endDate ?? new Date();
    end.setHours(23, 59, 59, 999);
    const start = new Date(end);
    start.setDate(start.getDate() - days + 1);
    start.setHours(0, 0, 0, 0);
    return {
        start,
        end,
        days
    };
}
function generateAlertId(entityType, entityId, reason, windowEnd) {
    const dateStr = windowEnd.toISOString().split("T")[0];
    return `${entityType}_${entityId}_${reason}_${dateStr}`;
}
function buildRecommendation(reason, metrics) {
    switch(reason){
        case "zero_conversions_high_spend":
            return `Consider pausing this ${metrics.entityType.replace("_", " ")} or reviewing targeting. Spent $${(0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$waste$2f$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["microsToDollars"])(metrics.spendMicros).toFixed(2)} with no conversions.`;
        case "cpa_above_target":
            const cpa = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$waste$2f$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["computeCpa"])(metrics.spendMicros, metrics.conversions);
            return `CPA of $${cpa?.toFixed(2) ?? "N/A"} exceeds target. Review ad creative, landing page, or audience targeting.`;
        case "low_ctr_high_spend":
            const ctr = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$waste$2f$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["computeCtr"])(metrics.clicks, metrics.impressions);
            return `CTR of ${ctr.toFixed(2)}% is below threshold. Consider refreshing creative or adjusting targeting.`;
        case "declining_performance":
            return `Performance has declined over the analysis period. Review recent changes and consider optimization.`;
        default:
            return `Review this ${metrics.entityType.replace("_", " ")} for potential optimization opportunities.`;
    }
}
class WasteEvaluator {
    config;
    constructor(config = {}){
        this.config = {
            ...__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$waste$2f$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DEFAULT_WASTE_CONFIG"],
            ...config
        };
    }
    async evaluateOrganization(params) {
        const window = createRollingWindow(params.windowDays ?? this.config.rollingWindowDays, params.endDate);
        const [accountAlerts, campaignAlerts, adAlerts] = await Promise.all([
            this.evaluateAdAccounts(params.organizationId, window),
            this.evaluateCampaigns(params.organizationId, window),
            this.evaluateAds(params.organizationId, window)
        ]);
        const alerts = [
            ...accountAlerts,
            ...campaignAlerts,
            ...adAlerts
        ];
        const totalWastedSpendMicros = alerts.reduce((sum, a)=>sum + a.spendMicros, BigInt(0));
        const byLevel = {
            none: 0,
            low: 0,
            medium: 0,
            high: 0,
            critical: 0
        };
        const byReason = {
            zero_conversions_high_spend: 0,
            cpa_above_target: 0,
            low_ctr_high_spend: 0,
            declining_performance: 0
        };
        const byEntityType = {
            ad_account: 0,
            campaign: 0,
            ad: 0
        };
        for (const alert of alerts){
            byLevel[alert.level]++;
            byReason[alert.reason]++;
            byEntityType[alert.entityType]++;
        }
        return {
            organizationId: params.organizationId,
            windowStart: window.start,
            windowEnd: window.end,
            totalWastedSpendMicros,
            alerts,
            byLevel,
            byReason,
            byEntityType
        };
    }
    async evaluateAdAccounts(organizationId, window) {
        const metrics = await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].dailyAdAccountMetric.groupBy({
            by: [
                "adAccountId"
            ],
            where: {
                organizationId,
                date: {
                    gte: window.start,
                    lte: window.end
                }
            },
            _sum: {
                impressions: true,
                clicks: true,
                spendMicros: true,
                conversions: true,
                revenueMicros: true
            }
        });
        const alerts = [];
        for (const m of metrics){
            const account = await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].adAccount.findUnique({
                where: {
                    id: m.adAccountId
                },
                select: {
                    id: true,
                    name: true,
                    platform: {
                        select: {
                            code: true
                        }
                    }
                }
            });
            if (!account) continue;
            const aggregated = {
                entityId: m.adAccountId,
                entityName: account.name,
                entityType: "ad_account",
                platformCode: account.platform.code,
                impressions: m._sum.impressions ?? BigInt(0),
                clicks: m._sum.clicks ?? BigInt(0),
                spendMicros: m._sum.spendMicros ?? BigInt(0),
                conversions: m._sum.conversions ?? BigInt(0),
                revenueMicros: m._sum.revenueMicros ?? BigInt(0)
            };
            const accountAlerts = this.detectWaste(aggregated, window, organizationId);
            alerts.push(...accountAlerts);
        }
        return alerts;
    }
    async evaluateCampaigns(organizationId, window) {
        const metrics = await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].dailyCampaignMetric.groupBy({
            by: [
                "campaignId"
            ],
            where: {
                organizationId,
                date: {
                    gte: window.start,
                    lte: window.end
                }
            },
            _sum: {
                impressions: true,
                clicks: true,
                spendMicros: true,
                conversions: true,
                revenueMicros: true
            }
        });
        const alerts = [];
        for (const m of metrics){
            const campaign = await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].campaign.findUnique({
                where: {
                    id: m.campaignId
                },
                select: {
                    id: true,
                    name: true,
                    platform: {
                        select: {
                            code: true
                        }
                    }
                }
            });
            if (!campaign) continue;
            const aggregated = {
                entityId: m.campaignId,
                entityName: campaign.name,
                entityType: "campaign",
                platformCode: campaign.platform.code,
                impressions: m._sum.impressions ?? BigInt(0),
                clicks: m._sum.clicks ?? BigInt(0),
                spendMicros: m._sum.spendMicros ?? BigInt(0),
                conversions: m._sum.conversions ?? BigInt(0),
                revenueMicros: m._sum.revenueMicros ?? BigInt(0)
            };
            const campaignAlerts = this.detectWaste(aggregated, window, organizationId);
            alerts.push(...campaignAlerts);
        }
        return alerts;
    }
    async evaluateAds(organizationId, window) {
        const metrics = await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].dailyAdMetric.groupBy({
            by: [
                "adId"
            ],
            where: {
                organizationId,
                date: {
                    gte: window.start,
                    lte: window.end
                }
            },
            _sum: {
                impressions: true,
                clicks: true,
                spendMicros: true,
                conversions: true,
                revenueMicros: true
            }
        });
        const alerts = [];
        for (const m of metrics){
            const ad = await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].ad.findUnique({
                where: {
                    id: m.adId
                },
                select: {
                    id: true,
                    name: true,
                    platform: {
                        select: {
                            code: true
                        }
                    }
                }
            });
            if (!ad) continue;
            const aggregated = {
                entityId: m.adId,
                entityName: ad.name ?? `Ad ${m.adId}`,
                entityType: "ad",
                platformCode: ad.platform.code,
                impressions: m._sum.impressions ?? BigInt(0),
                clicks: m._sum.clicks ?? BigInt(0),
                spendMicros: m._sum.spendMicros ?? BigInt(0),
                conversions: m._sum.conversions ?? BigInt(0),
                revenueMicros: m._sum.revenueMicros ?? BigInt(0)
            };
            const adAlerts = this.detectWaste(aggregated, window, organizationId);
            alerts.push(...adAlerts);
        }
        return alerts;
    }
    detectWaste(metrics, window, organizationId) {
        const alerts = [];
        if (metrics.spendMicros >= this.config.spendThresholdMicros && metrics.conversions === BigInt(0)) {
            const reason = "zero_conversions_high_spend";
            const level = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$waste$2f$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["determineWasteLevel"])(metrics.spendMicros, this.config, reason);
            alerts.push({
                id: generateAlertId(metrics.entityType, metrics.entityId, reason, window.end),
                entityType: metrics.entityType,
                entityId: metrics.entityId,
                entityName: metrics.entityName,
                organizationId,
                platformCode: metrics.platformCode,
                reason,
                level,
                spendMicros: metrics.spendMicros,
                conversions: 0,
                cpa: null,
                targetCpa: (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$waste$2f$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["microsToDollars"])(this.config.targetCpaMicros),
                windowStart: window.start,
                windowEnd: window.end,
                message: `${metrics.entityName} spent $${(0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$waste$2f$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["microsToDollars"])(metrics.spendMicros).toFixed(2)} with zero conversions in the last ${window.days} days.`,
                recommendation: buildRecommendation(reason, metrics)
            });
        }
        if (metrics.conversions > BigInt(0)) {
            const cpa = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$waste$2f$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["computeCpa"])(metrics.spendMicros, metrics.conversions);
            const targetCpa = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$waste$2f$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["microsToDollars"])(this.config.targetCpaMicros);
            const cpaThreshold = targetCpa * (1 + this.config.cpaTolerancePercent / 100);
            if (cpa !== null && cpa > cpaThreshold * 1_000_000) {
                const reason = "cpa_above_target";
                const level = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$waste$2f$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["determineWasteLevel"])(metrics.spendMicros, this.config, reason);
                const wastedSpend = metrics.spendMicros - BigInt(Math.round(targetCpa * 1_000_000 * Number(metrics.conversions)));
                alerts.push({
                    id: generateAlertId(metrics.entityType, metrics.entityId, reason, window.end),
                    entityType: metrics.entityType,
                    entityId: metrics.entityId,
                    entityName: metrics.entityName,
                    organizationId,
                    platformCode: metrics.platformCode,
                    reason,
                    level,
                    spendMicros: wastedSpend > BigInt(0) ? wastedSpend : metrics.spendMicros,
                    conversions: Number(metrics.conversions),
                    cpa: cpa / 1_000_000,
                    targetCpa,
                    windowStart: window.start,
                    windowEnd: window.end,
                    message: `${metrics.entityName} has CPA of $${(cpa / 1_000_000).toFixed(2)} vs target of $${targetCpa.toFixed(2)} (${((cpa / 1_000_000 / targetCpa - 1) * 100).toFixed(0)}% over).`,
                    recommendation: buildRecommendation(reason, metrics)
                });
            }
        }
        return alerts;
    }
    async evaluateCampaign(params) {
        const window = createRollingWindow(params.windowDays ?? this.config.rollingWindowDays, params.endDate);
        const metrics = await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].dailyCampaignMetric.aggregate({
            where: {
                organizationId: params.organizationId,
                campaignId: params.campaignId,
                date: {
                    gte: window.start,
                    lte: window.end
                }
            },
            _sum: {
                impressions: true,
                clicks: true,
                spendMicros: true,
                conversions: true,
                revenueMicros: true
            }
        });
        const campaign = await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].campaign.findUnique({
            where: {
                id: params.campaignId
            },
            select: {
                id: true,
                name: true,
                platform: {
                    select: {
                        code: true
                    }
                }
            }
        });
        if (!campaign) return [];
        const aggregated = {
            entityId: params.campaignId,
            entityName: campaign.name,
            entityType: "campaign",
            platformCode: campaign.platform.code,
            impressions: metrics._sum.impressions ?? BigInt(0),
            clicks: metrics._sum.clicks ?? BigInt(0),
            spendMicros: metrics._sum.spendMicros ?? BigInt(0),
            conversions: metrics._sum.conversions ?? BigInt(0),
            revenueMicros: metrics._sum.revenueMicros ?? BigInt(0)
        };
        return this.detectWaste(aggregated, window, params.organizationId);
    }
    async evaluateAd(params) {
        const window = createRollingWindow(params.windowDays ?? this.config.rollingWindowDays, params.endDate);
        const metrics = await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].dailyAdMetric.aggregate({
            where: {
                organizationId: params.organizationId,
                adId: params.adId,
                date: {
                    gte: window.start,
                    lte: window.end
                }
            },
            _sum: {
                impressions: true,
                clicks: true,
                spendMicros: true,
                conversions: true,
                revenueMicros: true
            }
        });
        const ad = await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].ad.findUnique({
            where: {
                id: params.adId
            },
            select: {
                id: true,
                name: true,
                platform: {
                    select: {
                        code: true
                    }
                }
            }
        });
        if (!ad) return [];
        const aggregated = {
            entityId: params.adId,
            entityName: ad.name ?? `Ad ${params.adId}`,
            entityType: "ad",
            platformCode: ad.platform.code,
            impressions: metrics._sum.impressions ?? BigInt(0),
            clicks: metrics._sum.clicks ?? BigInt(0),
            spendMicros: metrics._sum.spendMicros ?? BigInt(0),
            conversions: metrics._sum.conversions ?? BigInt(0),
            revenueMicros: metrics._sum.revenueMicros ?? BigInt(0)
        };
        return this.detectWaste(aggregated, window, params.organizationId);
    }
    getConfig() {
        return {
            ...this.config
        };
    }
    withConfig(config) {
        return new WasteEvaluator({
            ...this.config,
            ...config
        });
    }
}
const wasteEvaluator = new WasteEvaluator();
}),
"[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/lib/waste/index.ts [app-rsc] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$waste$2f$evaluator$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/lib/waste/evaluator.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$waste$2f$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/lib/waste/types.ts [app-rsc] (ecmascript)");
;
;
}),
"[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/lib/campaigns/queries.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getCampaignDetails",
    ()=>getCampaignDetails,
    "getCampaignPerformance",
    ()=>getCampaignPerformance
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$server$2d$only$2f$empty$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/node_modules/next/dist/compiled/server-only/empty.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/lib/prisma.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$waste$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/lib/waste/index.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$waste$2f$evaluator$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/lib/waste/evaluator.ts [app-rsc] (ecmascript)");
;
;
;
async function getCampaignPerformance(params) {
    const { filters, sort, page = 1, pageSize = 50 } = params;
    const where = {
        organization: {
            id: filters.organizationId
        }
    };
    if (filters.platformCodes?.length) {
        where.platform = {
            code: {
                in: filters.platformCodes
            }
        };
    }
    if (filters.adAccountIds?.length) {
        where.adAccountId = {
            in: filters.adAccountIds
        };
    }
    if (filters.status?.length) {
        where.status = {
            in: filters.status
        };
    }
    if (filters.search) {
        where.OR = [
            {
                name: {
                    contains: filters.search,
                    mode: "insensitive"
                }
            },
            {
                externalId: {
                    contains: filters.search,
                    mode: "insensitive"
                }
            }
        ];
    }
    const [campaigns, total, platformCounts] = await Promise.all([
        __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].campaign.findMany({
            where,
            include: {
                platform: {
                    select: {
                        code: true,
                        name: true
                    }
                },
                adAccount: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            },
            skip: (page - 1) * pageSize,
            take: pageSize
        }),
        __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].campaign.count({
            where
        }),
        __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].campaign.groupBy({
            by: [
                "platformId"
            ],
            where: {
                organization: {
                    id: filters.organizationId
                }
            },
            _count: {
                id: true
            }
        })
    ]);
    const campaignIds = campaigns.map((c)=>c.id);
    const metrics = await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].dailyCampaignMetric.groupBy({
        by: [
            "campaignId"
        ],
        where: {
            campaignId: {
                in: campaignIds
            },
            date: {
                gte: filters.dateRange.start,
                lte: filters.dateRange.end
            }
        },
        _sum: {
            impressions: true,
            clicks: true,
            spendMicros: true,
            conversions: true,
            revenueMicros: true
        }
    });
    const metricsMap = new Map(metrics.map((m)=>[
            m.campaignId,
            m._sum
        ]));
    const wasteAnalysis = await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$waste$2f$evaluator$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["wasteEvaluator"].evaluateOrganization({
        organizationId: filters.organizationId,
        windowDays: Math.ceil((filters.dateRange.end.getTime() - filters.dateRange.start.getTime()) / (1000 * 60 * 60 * 24)),
        endDate: filters.dateRange.end
    });
    const wasteMap = new Map(wasteAnalysis.alerts.filter((a)=>a.entityType === "campaign").map((a)=>[
            a.entityId,
            a
        ]));
    const rows = campaigns.map((campaign)=>{
        const m = metricsMap.get(campaign.id) ?? {
            impressions: BigInt(0),
            clicks: BigInt(0),
            spendMicros: BigInt(0),
            conversions: BigInt(0),
            revenueMicros: BigInt(0)
        };
        const impressions = Number(m.impressions ?? 0);
        const clicks = Number(m.clicks ?? 0);
        const spend = Number(m.spendMicros ?? 0) / 1_000_000;
        const conversions = Number(m.conversions ?? 0);
        const revenue = Number(m.revenueMicros ?? 0) / 1_000_000;
        const ctr = impressions > 0 ? clicks / impressions * 100 : null;
        const cpc = clicks > 0 ? spend / clicks : null;
        const cpa = conversions > 0 ? spend / conversions : null;
        const roas = spend > 0 ? revenue / spend : null;
        const waste = wasteMap.get(campaign.id);
        return {
            id: campaign.id,
            name: campaign.name,
            externalId: campaign.externalId,
            platformCode: campaign.platform.code,
            platformName: campaign.platform.name,
            adAccountId: campaign.adAccount.id,
            adAccountName: campaign.adAccount.name,
            status: campaign.status,
            impressions,
            clicks,
            spend,
            conversions,
            revenue,
            ctr,
            cpc,
            cpa,
            roas,
            wasteLevel: waste?.level ?? "none",
            wastedSpend: waste ? Number(waste.spendMicros) / 1_000_000 : 0,
            wasteReason: waste?.reason ?? null
        };
    });
    if (sort) {
        rows.sort((a, b)=>{
            let aVal = null;
            let bVal = null;
            switch(sort.field){
                case "name":
                    aVal = a.name.toLowerCase();
                    bVal = b.name.toLowerCase();
                    break;
                case "platform":
                    aVal = a.platformCode;
                    bVal = b.platformCode;
                    break;
                case "spend":
                    aVal = a.spend;
                    bVal = b.spend;
                    break;
                case "conversions":
                    aVal = a.conversions;
                    bVal = b.conversions;
                    break;
                case "cpa":
                    aVal = a.cpa ?? Infinity;
                    bVal = b.cpa ?? Infinity;
                    break;
                case "roas":
                    aVal = a.roas ?? -Infinity;
                    bVal = b.roas ?? -Infinity;
                    break;
                case "impressions":
                    aVal = a.impressions;
                    bVal = b.impressions;
                    break;
                case "clicks":
                    aVal = a.clicks;
                    bVal = b.clicks;
                    break;
                case "ctr":
                    aVal = a.ctr ?? -Infinity;
                    bVal = b.ctr ?? -Infinity;
                    break;
            }
            if (aVal === null || bVal === null) return 0;
            if (aVal < bVal) return sort.direction === "asc" ? -1 : 1;
            if (aVal > bVal) return sort.direction === "asc" ? 1 : -1;
            return 0;
        });
    }
    const platforms = await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].platform.findMany({
        where: {
            id: {
                in: platformCounts.map((p)=>p.platformId)
            }
        },
        select: {
            code: true,
            name: true,
            id: true
        }
    });
    const platformsWithCounts = platforms.map((p)=>({
            code: p.code,
            name: p.name,
            count: platformCounts.find((pc)=>pc.platformId === p.id)?._count?.id ?? 0
        }));
    return {
        campaigns: rows,
        total,
        platforms: platformsWithCounts
    };
}
async function getCampaignDetails(params) {
    const campaign = await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].campaign.findFirst({
        where: {
            id: params.campaignId,
            organization: {
                id: params.organizationId
            }
        },
        include: {
            platform: {
                select: {
                    code: true,
                    name: true
                }
            },
            adAccount: {
                select: {
                    id: true,
                    name: true
                }
            }
        }
    });
    if (!campaign) {
        return {
            campaign: null,
            dailyMetrics: [],
            ads: []
        };
    }
    const [dailyMetrics, adMetrics] = await Promise.all([
        __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].dailyCampaignMetric.findMany({
            where: {
                campaignId: params.campaignId,
                date: {
                    gte: params.dateRange.start,
                    lte: params.dateRange.end
                }
            },
            orderBy: {
                date: "asc"
            },
            select: {
                date: true,
                impressions: true,
                clicks: true,
                spendMicros: true,
                conversions: true
            }
        }),
        __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].dailyAdMetric.groupBy({
            by: [
                "adId"
            ],
            where: {
                campaignId: params.campaignId,
                date: {
                    gte: params.dateRange.start,
                    lte: params.dateRange.end
                }
            },
            _sum: {
                spendMicros: true,
                conversions: true
            }
        })
    ]);
    const adIds = adMetrics.map((a)=>a.adId);
    const ads = await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].ad.findMany({
        where: {
            id: {
                in: adIds
            }
        },
        select: {
            id: true,
            name: true
        }
    });
    const adMap = new Map(ads.map((a)=>[
            a.id,
            a.name
        ]));
    const totals = dailyMetrics.reduce((acc, m)=>({
            impressions: acc.impressions + Number(m.impressions),
            clicks: acc.clicks + Number(m.clicks),
            spend: acc.spend + Number(m.spendMicros) / 1_000_000,
            conversions: acc.conversions + Number(m.conversions),
            revenue: acc.revenue
        }), {
        impressions: 0,
        clicks: 0,
        spend: 0,
        conversions: 0,
        revenue: 0
    });
    const ctr = totals.impressions > 0 ? totals.clicks / totals.impressions * 100 : null;
    const cpc = totals.clicks > 0 ? totals.spend / totals.clicks : null;
    const cpa = totals.conversions > 0 ? totals.spend / totals.conversions : null;
    const roas = totals.spend > 0 ? totals.revenue / totals.spend : null;
    return {
        campaign: {
            id: campaign.id,
            name: campaign.name,
            externalId: campaign.externalId,
            platformCode: campaign.platform.code,
            platformName: campaign.platform.name,
            adAccountId: campaign.adAccount.id,
            adAccountName: campaign.adAccount.name,
            status: campaign.status,
            ...totals,
            ctr,
            cpc,
            cpa,
            roas,
            wasteLevel: "none",
            wastedSpend: 0,
            wasteReason: null
        },
        dailyMetrics: dailyMetrics.map((m)=>({
                date: m.date.toISOString().split("T")[0],
                impressions: Number(m.impressions),
                clicks: Number(m.clicks),
                spend: Number(m.spendMicros) / 1_000_000,
                conversions: Number(m.conversions)
            })),
        ads: adMetrics.map((a)=>{
            const spend = Number(a._sum.spendMicros ?? 0) / 1_000_000;
            const conversions = Number(a._sum.conversions ?? 0);
            return {
                id: a.adId,
                name: adMap.get(a.adId) ?? a.adId,
                spend,
                conversions,
                cpa: conversions > 0 ? spend / conversions : null
            };
        })
    };
}
}),
"[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/lib/campaigns/index.ts [app-rsc] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$campaigns$2f$queries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/lib/campaigns/queries.ts [app-rsc] (ecmascript)");
;
}),
"[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/campaigns/client.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

// This file is generated by next-core EcmascriptClientReferenceModule.
__turbopack_context__.s([
    "CampaignsPageClient",
    ()=>CampaignsPageClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const CampaignsPageClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call CampaignsPageClient() from the server but CampaignsPageClient is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/campaigns/client.tsx <module evaluation>", "CampaignsPageClient");
}),
"[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/campaigns/client.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

// This file is generated by next-core EcmascriptClientReferenceModule.
__turbopack_context__.s([
    "CampaignsPageClient",
    ()=>CampaignsPageClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const CampaignsPageClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call CampaignsPageClient() from the server but CampaignsPageClient is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/campaigns/client.tsx", "CampaignsPageClient");
}),
"[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/campaigns/client.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$app$2f$app$2f$campaigns$2f$client$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/campaigns/client.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$app$2f$app$2f$campaigns$2f$client$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/campaigns/client.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$app$2f$app$2f$campaigns$2f$client$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/campaigns/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CampaignsPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2d$auth$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/node_modules/next-auth/index.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/node_modules/next/dist/api/navigation.react-server.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/node_modules/next/dist/client/components/navigation.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/lib/auth.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$campaigns$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/lib/campaigns/index.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$campaigns$2f$queries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/lib/campaigns/queries.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$app$2f$app$2f$campaigns$2f$client$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/campaigns/client.tsx [app-rsc] (ecmascript)");
;
;
;
;
;
;
async function CampaignsPage() {
    const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2d$auth$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getServerSession"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["authOptions"]);
    const orgId = session?.user?.activeOrgId;
    if (!orgId) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])("/app");
    }
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - 30);
    startDate.setHours(0, 0, 0, 0);
    const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$campaigns$2f$queries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCampaignPerformance"])({
        filters: {
            organizationId: orgId,
            dateRange: {
                start: startDate,
                end: endDate
            }
        },
        sort: {
            field: "spend",
            direction: "desc"
        }
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$app$2f$app$2f$campaigns$2f$client$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CampaignsPageClient"], {
        initialData: result.campaigns,
        platforms: result.platforms,
        total: result.total
    }, void 0, false, {
        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/campaigns/page.tsx",
        lineNumber: 31,
        columnNumber: 5
    }, this);
}
}),
"[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/campaigns/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/campaigns/page.tsx [app-rsc] (ecmascript)"));
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__3db9a5fa._.js.map