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
"[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/lib/metrics/types.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "buildCacheKey",
    ()=>buildCacheKey,
    "computeChange",
    ()=>computeChange,
    "computeMetrics",
    ()=>computeMetrics,
    "getPeriodBounds",
    ()=>getPeriodBounds,
    "microsToDollars",
    ()=>microsToDollars
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$server$2d$only$2f$empty$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/node_modules/next/dist/compiled/server-only/empty.js [app-rsc] (ecmascript)");
;
function microsToDollars(micros) {
    return Number(micros) / 1_000_000;
}
function computeMetrics(raw, targetCpaMicros) {
    const impressions = Number(raw.impressions);
    const clicks = Number(raw.clicks);
    const spend = microsToDollars(raw.spendMicros);
    const conversions = Number(raw.conversions);
    const revenue = microsToDollars(raw.revenueMicros);
    const ctr = impressions > 0 ? clicks / impressions * 100 : null;
    const cpc = clicks > 0 ? spend / clicks : null;
    const cpa = conversions > 0 ? spend / conversions : null;
    const roas = spend > 0 ? revenue / spend : null;
    const conversionRate = clicks > 0 ? conversions / clicks * 100 : null;
    let wastedSpend = 0;
    let efficientSpend = spend;
    if (conversions === 0 && spend > 0) {
        wastedSpend = spend;
        efficientSpend = 0;
    } else if (targetCpaMicros && conversions > 0 && cpa !== null) {
        const targetCpa = microsToDollars(targetCpaMicros);
        if (cpa > targetCpa) {
            wastedSpend = spend - targetCpa * conversions;
            efficientSpend = targetCpa * conversions;
        }
    }
    const wastePercent = spend > 0 ? wastedSpend / spend * 100 : 0;
    return {
        impressions,
        clicks,
        spend,
        conversions,
        revenue,
        ctr,
        cpc,
        cpa,
        roas,
        conversionRate,
        wastedSpend,
        wastePercent,
        efficientSpend
    };
}
function computeChange(current, previous) {
    const pctChange = (curr, prev)=>{
        if (prev === 0) return curr > 0 ? 100 : 0;
        return (curr - prev) / prev * 100;
    };
    return {
        impressions: pctChange(current.impressions, previous.impressions),
        clicks: pctChange(current.clicks, previous.clicks),
        spend: pctChange(current.spend, previous.spend),
        conversions: pctChange(current.conversions, previous.conversions),
        revenue: pctChange(current.revenue, previous.revenue),
        cpa: current.cpa !== null && previous.cpa !== null ? pctChange(current.cpa, previous.cpa) : null,
        roas: current.roas !== null && previous.roas !== null ? pctChange(current.roas, previous.roas) : null,
        wastePercent: current.wastePercent - previous.wastePercent
    };
}
function buildCacheKey(params) {
    const dateStr = `${params.dateRange.start.toISOString().split("T")[0]}_${params.dateRange.end.toISOString().split("T")[0]}`;
    return `metrics:${params.organizationId}:${params.entityLevel}:${params.entityId ?? "all"}:${params.granularity}:${dateStr}`;
}
function getPeriodBounds(date, granularity) {
    const d = new Date(date);
    switch(granularity){
        case "day":
            {
                const start = new Date(d.getFullYear(), d.getMonth(), d.getDate());
                const end = new Date(start);
                end.setDate(end.getDate() + 1);
                end.setMilliseconds(-1);
                return {
                    start,
                    end,
                    label: start.toISOString().split("T")[0]
                };
            }
        case "week":
            {
                const day = d.getDay();
                const diff = d.getDate() - day + (day === 0 ? -6 : 1);
                const start = new Date(d.getFullYear(), d.getMonth(), diff);
                const end = new Date(start);
                end.setDate(end.getDate() + 7);
                end.setMilliseconds(-1);
                const weekNum = Math.ceil(((start.getTime() - new Date(start.getFullYear(), 0, 1).getTime()) / 86400000 + 1) / 7);
                return {
                    start,
                    end,
                    label: `${start.getFullYear()}-W${String(weekNum).padStart(2, "0")}`
                };
            }
        case "month":
            {
                const start = new Date(d.getFullYear(), d.getMonth(), 1);
                const end = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
                return {
                    start,
                    end,
                    label: `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, "0")}`
                };
            }
        case "quarter":
            {
                const quarter = Math.floor(d.getMonth() / 3);
                const start = new Date(d.getFullYear(), quarter * 3, 1);
                const end = new Date(d.getFullYear(), quarter * 3 + 3, 0, 23, 59, 59, 999);
                return {
                    start,
                    end,
                    label: `${start.getFullYear()}-Q${quarter + 1}`
                };
            }
        case "year":
            {
                const start = new Date(d.getFullYear(), 0, 1);
                const end = new Date(d.getFullYear(), 11, 31, 23, 59, 59, 999);
                return {
                    start,
                    end,
                    label: String(d.getFullYear())
                };
            }
    }
}
}),
"[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/lib/metrics/cache.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MetricsCache",
    ()=>MetricsCache,
    "metricsCache",
    ()=>metricsCache
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$server$2d$only$2f$empty$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/node_modules/next/dist/compiled/server-only/empty.js [app-rsc] (ecmascript)");
;
const DEFAULT_TTL_MS = 5 * 60 * 1000;
const memoryCache = new Map();
class MetricsCache {
    ttlMs;
    constructor(options = {}){
        this.ttlMs = options.ttlMs ?? DEFAULT_TTL_MS;
    }
    get(key) {
        const cached = memoryCache.get(key);
        if (!cached) return null;
        if (new Date() > cached.expiresAt) {
            memoryCache.delete(key);
            return null;
        }
        return cached.data;
    }
    set(key, data, ttlMs) {
        const now = new Date();
        const expiresAt = new Date(now.getTime() + (ttlMs ?? this.ttlMs));
        memoryCache.set(key, {
            key,
            data,
            computedAt: now,
            expiresAt
        });
    }
    invalidate(key) {
        return memoryCache.delete(key);
    }
    invalidatePattern(pattern) {
        let count = 0;
        const regex = new RegExp(pattern.replace(/\*/g, ".*"));
        for (const key of memoryCache.keys()){
            if (regex.test(key)) {
                memoryCache.delete(key);
                count++;
            }
        }
        return count;
    }
    invalidateOrganization(organizationId) {
        return this.invalidatePattern(`metrics:${organizationId}:.*`);
    }
    clear() {
        memoryCache.clear();
    }
    size() {
        return memoryCache.size;
    }
    prune() {
        const now = new Date();
        let pruned = 0;
        for (const [key, cached] of memoryCache.entries()){
            if (now > cached.expiresAt) {
                memoryCache.delete(key);
                pruned++;
            }
        }
        return pruned;
    }
    getStats() {
        let oldest = null;
        let newest = null;
        for (const cached of memoryCache.values()){
            if (!oldest || cached.computedAt < oldest) oldest = cached.computedAt;
            if (!newest || cached.computedAt > newest) newest = cached.computedAt;
        }
        return {
            size: memoryCache.size,
            keys: Array.from(memoryCache.keys()),
            oldestEntry: oldest,
            newestEntry: newest
        };
    }
}
const metricsCache = new MetricsCache();
}),
"[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/lib/metrics/aggregator.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MetricsAggregator",
    ()=>MetricsAggregator,
    "metricsAggregator",
    ()=>metricsAggregator
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$server$2d$only$2f$empty$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/node_modules/next/dist/compiled/server-only/empty.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/lib/prisma.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$metrics$2f$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/lib/metrics/types.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$metrics$2f$cache$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/lib/metrics/cache.ts [app-rsc] (ecmascript)");
;
;
;
;
const DEFAULT_TARGET_CPA_MICROS = BigInt(25_000_000);
class MetricsAggregator {
    config;
    cache;
    constructor(config = {}){
        this.config = {
            targetCpaMicros: config.targetCpaMicros ?? DEFAULT_TARGET_CPA_MICROS,
            useCache: config.useCache ?? true,
            cacheTtlMs: config.cacheTtlMs ?? 5 * 60 * 1000
        };
        this.cache = __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$metrics$2f$cache$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["metricsCache"];
    }
    async aggregateByPeriod(params) {
        const cacheKey = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$metrics$2f$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["buildCacheKey"])({
            organizationId: params.filter.organizationId,
            entityLevel: params.entityLevel,
            entityId: null,
            granularity: params.granularity,
            dateRange: params.filter.dateRange
        });
        if (this.config.useCache) {
            const cached = this.cache.get(cacheKey);
            if (cached) return cached;
        }
        const rows = await this.queryMetrics(params);
        if (this.config.useCache) {
            this.cache.set(cacheKey, rows, this.config.cacheTtlMs);
        }
        return rows;
    }
    async queryMetrics(params) {
        const { filter, granularity, entityLevel } = params;
        switch(entityLevel){
            case "organization":
                return this.aggregateOrganization(filter, granularity);
            case "platform":
                return this.aggregateByPlatform(filter, granularity);
            case "ad_account":
                return this.aggregateByAdAccount(filter, granularity);
            case "campaign":
                return this.aggregateByCampaign(filter, granularity);
            case "ad":
                return this.aggregateByAd(filter, granularity);
            default:
                return [];
        }
    }
    async aggregateOrganization(filter, granularity) {
        const metrics = await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].dailyAdAccountMetric.findMany({
            where: {
                organizationId: filter.organizationId,
                date: {
                    gte: filter.dateRange.start,
                    lte: filter.dateRange.end
                },
                ...filter.platformCodes?.length ? {
                    platform: {
                        code: {
                            in: filter.platformCodes
                        }
                    }
                } : {}
            },
            select: {
                date: true,
                impressions: true,
                clicks: true,
                spendMicros: true,
                conversions: true,
                revenueMicros: true
            }
        });
        return this.groupByPeriod(metrics, granularity, {
            entityLevel: "organization",
            entityId: filter.organizationId,
            entityName: "Organization Total",
            platformCode: null
        });
    }
    async aggregateByPlatform(filter, granularity) {
        const metrics = await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].dailyAdAccountMetric.findMany({
            where: {
                organizationId: filter.organizationId,
                date: {
                    gte: filter.dateRange.start,
                    lte: filter.dateRange.end
                },
                ...filter.platformCodes?.length ? {
                    platform: {
                        code: {
                            in: filter.platformCodes
                        }
                    }
                } : {}
            },
            select: {
                date: true,
                impressions: true,
                clicks: true,
                spendMicros: true,
                conversions: true,
                revenueMicros: true,
                platform: {
                    select: {
                        code: true,
                        name: true
                    }
                }
            }
        });
        const byPlatform = new Map();
        for (const m of metrics){
            const key = m.platform.code;
            if (!byPlatform.has(key)) byPlatform.set(key, []);
            byPlatform.get(key).push(m);
        }
        const results = [];
        for (const [platformCode, platformMetrics] of byPlatform){
            const platformName = platformMetrics[0]?.platform.name ?? platformCode;
            const rows = this.groupByPeriod(platformMetrics, granularity, {
                entityLevel: "platform",
                entityId: platformCode,
                entityName: platformName,
                platformCode
            });
            results.push(...rows);
        }
        return results.sort((a, b)=>a.periodStart.getTime() - b.periodStart.getTime());
    }
    async aggregateByAdAccount(filter, granularity) {
        const metrics = await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].dailyAdAccountMetric.findMany({
            where: {
                organizationId: filter.organizationId,
                date: {
                    gte: filter.dateRange.start,
                    lte: filter.dateRange.end
                },
                ...filter.adAccountIds?.length ? {
                    adAccountId: {
                        in: filter.adAccountIds
                    }
                } : {},
                ...filter.platformCodes?.length ? {
                    platform: {
                        code: {
                            in: filter.platformCodes
                        }
                    }
                } : {}
            },
            select: {
                date: true,
                adAccountId: true,
                impressions: true,
                clicks: true,
                spendMicros: true,
                conversions: true,
                revenueMicros: true,
                adAccount: {
                    select: {
                        name: true
                    }
                },
                platform: {
                    select: {
                        code: true
                    }
                }
            }
        });
        const byAccount = new Map();
        for (const m of metrics){
            if (!byAccount.has(m.adAccountId)) byAccount.set(m.adAccountId, []);
            byAccount.get(m.adAccountId).push(m);
        }
        const results = [];
        for (const [accountId, accountMetrics] of byAccount){
            const accountName = accountMetrics[0]?.adAccount.name ?? accountId;
            const platformCode = accountMetrics[0]?.platform.code ?? null;
            const rows = this.groupByPeriod(accountMetrics, granularity, {
                entityLevel: "ad_account",
                entityId: accountId,
                entityName: accountName,
                platformCode
            });
            results.push(...rows);
        }
        return results.sort((a, b)=>a.periodStart.getTime() - b.periodStart.getTime());
    }
    async aggregateByCampaign(filter, granularity) {
        const metrics = await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].dailyCampaignMetric.findMany({
            where: {
                organizationId: filter.organizationId,
                date: {
                    gte: filter.dateRange.start,
                    lte: filter.dateRange.end
                },
                ...filter.campaignIds?.length ? {
                    campaignId: {
                        in: filter.campaignIds
                    }
                } : {},
                ...filter.adAccountIds?.length ? {
                    adAccountId: {
                        in: filter.adAccountIds
                    }
                } : {},
                ...filter.platformCodes?.length ? {
                    platform: {
                        code: {
                            in: filter.platformCodes
                        }
                    }
                } : {}
            },
            select: {
                date: true,
                campaignId: true,
                impressions: true,
                clicks: true,
                spendMicros: true,
                conversions: true,
                revenueMicros: true,
                campaign: {
                    select: {
                        name: true
                    }
                },
                platform: {
                    select: {
                        code: true
                    }
                }
            }
        });
        const byCampaign = new Map();
        for (const m of metrics){
            if (!byCampaign.has(m.campaignId)) byCampaign.set(m.campaignId, []);
            byCampaign.get(m.campaignId).push(m);
        }
        const results = [];
        for (const [campaignId, campaignMetrics] of byCampaign){
            const campaignName = campaignMetrics[0]?.campaign.name ?? campaignId;
            const platformCode = campaignMetrics[0]?.platform.code ?? null;
            const rows = this.groupByPeriod(campaignMetrics, granularity, {
                entityLevel: "campaign",
                entityId: campaignId,
                entityName: campaignName,
                platformCode
            });
            results.push(...rows);
        }
        return results.sort((a, b)=>a.periodStart.getTime() - b.periodStart.getTime());
    }
    async aggregateByAd(filter, granularity) {
        const metrics = await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].dailyAdMetric.findMany({
            where: {
                organizationId: filter.organizationId,
                date: {
                    gte: filter.dateRange.start,
                    lte: filter.dateRange.end
                },
                ...filter.adIds?.length ? {
                    adId: {
                        in: filter.adIds
                    }
                } : {},
                ...filter.campaignIds?.length ? {
                    campaignId: {
                        in: filter.campaignIds
                    }
                } : {},
                ...filter.adAccountIds?.length ? {
                    adAccountId: {
                        in: filter.adAccountIds
                    }
                } : {},
                ...filter.platformCodes?.length ? {
                    platform: {
                        code: {
                            in: filter.platformCodes
                        }
                    }
                } : {}
            },
            select: {
                date: true,
                adId: true,
                impressions: true,
                clicks: true,
                spendMicros: true,
                conversions: true,
                revenueMicros: true,
                ad: {
                    select: {
                        name: true
                    }
                },
                platform: {
                    select: {
                        code: true
                    }
                }
            }
        });
        const byAd = new Map();
        for (const m of metrics){
            if (!byAd.has(m.adId)) byAd.set(m.adId, []);
            byAd.get(m.adId).push(m);
        }
        const results = [];
        for (const [adId, adMetrics] of byAd){
            const adName = adMetrics[0]?.ad.name ?? adId;
            const platformCode = adMetrics[0]?.platform.code ?? null;
            const rows = this.groupByPeriod(adMetrics, granularity, {
                entityLevel: "ad",
                entityId: adId,
                entityName: adName,
                platformCode
            });
            results.push(...rows);
        }
        return results.sort((a, b)=>a.periodStart.getTime() - b.periodStart.getTime());
    }
    groupByPeriod(metrics, granularity, entity) {
        const byPeriod = new Map();
        for (const m of metrics){
            const { label } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$metrics$2f$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getPeriodBounds"])(m.date, granularity);
            if (!byPeriod.has(label)) {
                byPeriod.set(label, {
                    impressions: BigInt(0),
                    clicks: BigInt(0),
                    spendMicros: BigInt(0),
                    conversions: BigInt(0),
                    revenueMicros: BigInt(0)
                });
            }
            const agg = byPeriod.get(label);
            agg.impressions += m.impressions;
            agg.clicks += m.clicks;
            agg.spendMicros += m.spendMicros;
            agg.conversions += m.conversions;
            agg.revenueMicros += m.revenueMicros;
        }
        const rows = [];
        for (const [period, raw] of byPeriod){
            const sampleDate = metrics.find((m)=>{
                const { label } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$metrics$2f$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getPeriodBounds"])(m.date, granularity);
                return label === period;
            })?.date;
            if (!sampleDate) continue;
            const { start, end } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$metrics$2f$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getPeriodBounds"])(sampleDate, granularity);
            rows.push({
                period,
                periodStart: start,
                periodEnd: end,
                entityId: entity.entityId,
                entityName: entity.entityName,
                entityLevel: entity.entityLevel,
                platformCode: entity.platformCode,
                metrics: (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$metrics$2f$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["computeMetrics"])(raw, this.config.targetCpaMicros)
            });
        }
        return rows.sort((a, b)=>a.periodStart.getTime() - b.periodStart.getTime());
    }
    async getSummary(params) {
        const currentMetrics = await this.aggregateTotal(params.filter, params.entityLevel);
        if (!params.comparePrevious) {
            return {
                current: currentMetrics,
                previous: null,
                change: null
            };
        }
        const rangeDays = Math.ceil((params.filter.dateRange.end.getTime() - params.filter.dateRange.start.getTime()) / (1000 * 60 * 60 * 24));
        const previousEnd = new Date(params.filter.dateRange.start);
        previousEnd.setDate(previousEnd.getDate() - 1);
        const previousStart = new Date(previousEnd);
        previousStart.setDate(previousStart.getDate() - rangeDays + 1);
        const previousFilter = {
            ...params.filter,
            dateRange: {
                start: previousStart,
                end: previousEnd
            }
        };
        const previousMetrics = await this.aggregateTotal(previousFilter, params.entityLevel);
        return {
            current: currentMetrics,
            previous: previousMetrics,
            change: (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$metrics$2f$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["computeChange"])(currentMetrics, previousMetrics)
        };
    }
    async aggregateTotal(filter, entityLevel) {
        const rows = await this.aggregateByPeriod({
            filter,
            granularity: "day",
            entityLevel
        });
        const totals = {
            impressions: BigInt(0),
            clicks: BigInt(0),
            spendMicros: BigInt(0),
            conversions: BigInt(0),
            revenueMicros: BigInt(0)
        };
        for (const row of rows){
            totals.impressions += BigInt(Math.round(row.metrics.impressions));
            totals.clicks += BigInt(Math.round(row.metrics.clicks));
            totals.spendMicros += BigInt(Math.round(row.metrics.spend * 1_000_000));
            totals.conversions += BigInt(Math.round(row.metrics.conversions));
            totals.revenueMicros += BigInt(Math.round(row.metrics.revenue * 1_000_000));
        }
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$metrics$2f$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["computeMetrics"])(totals, this.config.targetCpaMicros);
    }
    invalidateCache(organizationId) {
        return this.cache.invalidateOrganization(organizationId);
    }
    getConfig() {
        return {
            ...this.config
        };
    }
}
const metricsAggregator = new MetricsAggregator();
}),
"[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/lib/metrics/index.ts [app-rsc] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$metrics$2f$aggregator$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/lib/metrics/aggregator.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$metrics$2f$cache$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/lib/metrics/cache.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$metrics$2f$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/lib/metrics/types.ts [app-rsc] (ecmascript)");
;
;
;
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
"[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/lib/dashboard/queries.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getDashboardKpis",
    ()=>getDashboardKpis,
    "getRecentActivity",
    ()=>getRecentActivity,
    "getTopWasteAlerts",
    ()=>getTopWasteAlerts
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$server$2d$only$2f$empty$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/node_modules/next/dist/compiled/server-only/empty.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/lib/prisma.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$metrics$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/lib/metrics/index.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$metrics$2f$aggregator$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/lib/metrics/aggregator.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$waste$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/lib/waste/index.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$waste$2f$evaluator$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/lib/waste/evaluator.ts [app-rsc] (ecmascript)");
;
;
;
;
const MICROS_PER_UNIT = 1_000_000;
async function getDashboardKpis(params) {
    const days = params.days ?? 30;
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - days + 1);
    startDate.setHours(0, 0, 0, 0);
    // Try to get data from daily_rollups first (fast path)
    const rollupKpis = await getDashboardKpisFromRollups(params.organizationId, startDate, endDate, days);
    if (rollupKpis) {
        return rollupKpis;
    }
    // Fall back to metrics aggregator (slower but works without rollups)
    return getDashboardKpisFromMetrics(params.organizationId, startDate, endDate, days);
}
/**
 * Get KPIs from pre-aggregated daily_rollups
 */ async function getDashboardKpisFromRollups(organizationId, startDate, endDate, days) {
    // Get current period rollups at organization level
    const currentRollups = await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].dailyRollup.findMany({
        where: {
            organizationId,
            grain: "ORGANIZATION",
            date: {
                gte: startDate,
                lte: endDate
            }
        }
    });
    if (currentRollups.length === 0) {
        return null; // No rollups, fall back to metrics
    }
    // Aggregate current period
    const current = aggregateRollups(currentRollups);
    // Get previous period for comparison
    const prevEndDate = new Date(startDate);
    prevEndDate.setDate(prevEndDate.getDate() - 1);
    const prevStartDate = new Date(prevEndDate);
    prevStartDate.setDate(prevStartDate.getDate() - days + 1);
    const previousRollups = await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].dailyRollup.findMany({
        where: {
            organizationId,
            grain: "ORGANIZATION",
            date: {
                gte: prevStartDate,
                lte: prevEndDate
            }
        }
    });
    const previous = previousRollups.length > 0 ? aggregateRollups(previousRollups) : null;
    // Calculate changes
    const changes = previous ? {
        spend: current.spend > 0 && previous.spend > 0 ? (current.spend - previous.spend) / previous.spend * 100 : 0,
        conversions: current.conversions > 0 && previous.conversions > 0 ? (current.conversions - previous.conversions) / previous.conversions * 100 : 0,
        cpa: current.cpa !== null && previous.cpa !== null && previous.cpa > 0 ? (current.cpa - previous.cpa) / previous.cpa * 100 : null,
        wastedSpendPercent: current.wastedSpendPercent - previous.wastedSpendPercent
    } : null;
    return {
        totalSpend: current.spend,
        totalConversions: current.conversions,
        overallCpa: current.cpa,
        wastedSpendPercent: current.wastedSpendPercent,
        roas: current.roas,
        previousPeriod: previous ? {
            totalSpend: previous.spend,
            totalConversions: previous.conversions,
            overallCpa: previous.cpa,
            wastedSpendPercent: previous.wastedSpendPercent
        } : null,
        changes
    };
}
/**
 * Aggregate rollup records into summary metrics
 */ function aggregateRollups(rollups) {
    const totalSpendMicros = rollups.reduce((sum, r)=>sum + Number(r.spendMicros), 0);
    const totalConversions = rollups.reduce((sum, r)=>sum + r.conversions, 0);
    const totalRevenueMicros = rollups.reduce((sum, r)=>sum + Number(r.conversionValue), 0);
    const totalWasteMicros = rollups.reduce((sum, r)=>sum + Number(r.wasteSpendMicros), 0);
    const spend = totalSpendMicros / MICROS_PER_UNIT;
    const revenue = totalRevenueMicros / MICROS_PER_UNIT;
    const cpa = totalConversions > 0 ? spend / totalConversions : null;
    const roas = spend > 0 ? revenue / spend : null;
    const wastedSpendPercent = spend > 0 ? totalWasteMicros / MICROS_PER_UNIT / spend * 100 : 0;
    return {
        spend,
        conversions: totalConversions,
        revenue,
        cpa,
        roas,
        wastedSpendPercent
    };
}
/**
 * Get KPIs from metrics aggregator (fallback)
 */ async function getDashboardKpisFromMetrics(organizationId, startDate, endDate, days) {
    const summary = await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$metrics$2f$aggregator$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["metricsAggregator"].getSummary({
        filter: {
            organizationId,
            dateRange: {
                start: startDate,
                end: endDate
            }
        },
        entityLevel: "organization",
        comparePrevious: true
    });
    const wasteAnalysis = await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$waste$2f$evaluator$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["wasteEvaluator"].evaluateOrganization({
        organizationId,
        windowDays: days,
        endDate
    });
    const totalWastedSpend = wasteAnalysis.alerts.reduce((sum, a)=>sum + Number(a.spendMicros) / MICROS_PER_UNIT, 0);
    const wastedSpendPercent = summary.current.spend > 0 ? totalWastedSpend / summary.current.spend * 100 : 0;
    let previousWastedPercent = 0;
    if (summary.previous && summary.previous.spend > 0) {
        const prevEndDate = new Date(startDate);
        prevEndDate.setDate(prevEndDate.getDate() - 1);
        const prevWasteAnalysis = await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$waste$2f$evaluator$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["wasteEvaluator"].evaluateOrganization({
            organizationId,
            windowDays: days,
            endDate: prevEndDate
        });
        const prevTotalWasted = prevWasteAnalysis.alerts.reduce((sum, a)=>sum + Number(a.spendMicros) / MICROS_PER_UNIT, 0);
        previousWastedPercent = summary.previous.spend > 0 ? prevTotalWasted / summary.previous.spend * 100 : 0;
    }
    return {
        totalSpend: summary.current.spend,
        totalConversions: summary.current.conversions,
        overallCpa: summary.current.cpa,
        wastedSpendPercent,
        roas: summary.current.roas,
        previousPeriod: summary.previous ? {
            totalSpend: summary.previous.spend,
            totalConversions: summary.previous.conversions,
            overallCpa: summary.previous.cpa,
            wastedSpendPercent: previousWastedPercent
        } : null,
        changes: summary.change ? {
            spend: summary.change.spend,
            conversions: summary.change.conversions,
            cpa: summary.change.cpa,
            wastedSpendPercent: wastedSpendPercent - previousWastedPercent
        } : null
    };
}
async function getRecentActivity(params) {
    const jobs = await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].ingestionJob.findMany({
        where: {
            organizationId: params.organizationId,
            status: {
                in: [
                    "SUCCEEDED",
                    "FAILED"
                ]
            }
        },
        orderBy: {
            updatedAt: "desc"
        },
        take: params.limit ?? 5,
        select: {
            id: true,
            platform: true,
            jobType: true,
            status: true,
            updatedAt: true
        }
    });
    return jobs.map((job)=>({
            id: job.id,
            type: job.status === "SUCCEEDED" ? "success" : "error",
            description: `${job.platform} ${job.jobType.toLowerCase().replace("_", " ")} ${job.status.toLowerCase()}`,
            timestamp: job.updatedAt
        }));
}
async function getTopWasteAlerts(params) {
    const analysis = await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$waste$2f$evaluator$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["wasteEvaluator"].evaluateOrganization({
        organizationId: params.organizationId,
        windowDays: 7
    });
    return analysis.alerts.sort((a, b)=>Number(b.spendMicros) - Number(a.spendMicros)).slice(0, params.limit ?? 5).map((alert)=>({
            id: alert.id,
            entityName: alert.entityName,
            entityType: alert.entityType,
            wastedSpend: Number(alert.spendMicros) / 1_000_000,
            reason: alert.reason.replace(/_/g, " "),
            level: alert.level
        }));
}
}),
"[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/lib/dashboard/index.ts [app-rsc] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$dashboard$2f$queries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/lib/dashboard/queries.ts [app-rsc] (ecmascript)");
;
}),
"[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/kpi-card.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

// This file is generated by next-core EcmascriptClientReferenceModule.
__turbopack_context__.s([
    "KpiCard",
    ()=>KpiCard,
    "KpiCardGrid",
    ()=>KpiCardGrid
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const KpiCard = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call KpiCard() from the server but KpiCard is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/kpi-card.tsx <module evaluation>", "KpiCard");
const KpiCardGrid = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call KpiCardGrid() from the server but KpiCardGrid is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/kpi-card.tsx <module evaluation>", "KpiCardGrid");
}),
"[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/kpi-card.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

// This file is generated by next-core EcmascriptClientReferenceModule.
__turbopack_context__.s([
    "KpiCard",
    ()=>KpiCard,
    "KpiCardGrid",
    ()=>KpiCardGrid
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const KpiCard = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call KpiCard() from the server but KpiCard is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/kpi-card.tsx", "KpiCard");
const KpiCardGrid = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call KpiCardGrid() from the server but KpiCardGrid is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/kpi-card.tsx", "KpiCardGrid");
}),
"[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/kpi-card.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$components$2f$dashboard$2f$kpi$2d$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/kpi-card.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$components$2f$dashboard$2f$kpi$2d$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/kpi-card.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$components$2f$dashboard$2f$kpi$2d$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/timeseries-chart.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

// This file is generated by next-core EcmascriptClientReferenceModule.
__turbopack_context__.s([
    "TimeseriesChart",
    ()=>TimeseriesChart,
    "TimeseriesChartCard",
    ()=>TimeseriesChartCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const TimeseriesChart = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call TimeseriesChart() from the server but TimeseriesChart is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/timeseries-chart.tsx <module evaluation>", "TimeseriesChart");
const TimeseriesChartCard = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call TimeseriesChartCard() from the server but TimeseriesChartCard is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/timeseries-chart.tsx <module evaluation>", "TimeseriesChartCard");
}),
"[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/timeseries-chart.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

// This file is generated by next-core EcmascriptClientReferenceModule.
__turbopack_context__.s([
    "TimeseriesChart",
    ()=>TimeseriesChart,
    "TimeseriesChartCard",
    ()=>TimeseriesChartCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const TimeseriesChart = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call TimeseriesChart() from the server but TimeseriesChart is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/timeseries-chart.tsx", "TimeseriesChart");
const TimeseriesChartCard = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call TimeseriesChartCard() from the server but TimeseriesChartCard is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/timeseries-chart.tsx", "TimeseriesChartCard");
}),
"[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/timeseries-chart.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$components$2f$dashboard$2f$timeseries$2d$chart$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/timeseries-chart.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$components$2f$dashboard$2f$timeseries$2d$chart$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/timeseries-chart.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$components$2f$dashboard$2f$timeseries$2d$chart$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/breakdown-table.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

// This file is generated by next-core EcmascriptClientReferenceModule.
__turbopack_context__.s([
    "BreakdownTable",
    ()=>BreakdownTable
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const BreakdownTable = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call BreakdownTable() from the server but BreakdownTable is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/breakdown-table.tsx <module evaluation>", "BreakdownTable");
}),
"[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/breakdown-table.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

// This file is generated by next-core EcmascriptClientReferenceModule.
__turbopack_context__.s([
    "BreakdownTable",
    ()=>BreakdownTable
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const BreakdownTable = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call BreakdownTable() from the server but BreakdownTable is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/breakdown-table.tsx", "BreakdownTable");
}),
"[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/breakdown-table.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$components$2f$dashboard$2f$breakdown$2d$table$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/breakdown-table.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$components$2f$dashboard$2f$breakdown$2d$table$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/breakdown-table.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$components$2f$dashboard$2f$breakdown$2d$table$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/filters.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

// This file is generated by next-core EcmascriptClientReferenceModule.
__turbopack_context__.s([
    "DashboardFilters",
    ()=>DashboardFilters,
    "getDefaultFilters",
    ()=>getDefaultFilters
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const DashboardFilters = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call DashboardFilters() from the server but DashboardFilters is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/filters.tsx <module evaluation>", "DashboardFilters");
const getDefaultFilters = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call getDefaultFilters() from the server but getDefaultFilters is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/filters.tsx <module evaluation>", "getDefaultFilters");
}),
"[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/filters.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

// This file is generated by next-core EcmascriptClientReferenceModule.
__turbopack_context__.s([
    "DashboardFilters",
    ()=>DashboardFilters,
    "getDefaultFilters",
    ()=>getDefaultFilters
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const DashboardFilters = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call DashboardFilters() from the server but DashboardFilters is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/filters.tsx", "DashboardFilters");
const getDefaultFilters = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call getDefaultFilters() from the server but getDefaultFilters is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/filters.tsx", "getDefaultFilters");
}),
"[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/filters.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$components$2f$dashboard$2f$filters$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/filters.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$components$2f$dashboard$2f$filters$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/filters.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$components$2f$dashboard$2f$filters$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/index.ts [app-rsc] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$components$2f$dashboard$2f$kpi$2d$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/kpi-card.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$components$2f$dashboard$2f$timeseries$2d$chart$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/timeseries-chart.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$components$2f$dashboard$2f$breakdown$2d$table$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/breakdown-table.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$components$2f$dashboard$2f$filters$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/filters.tsx [app-rsc] (ecmascript)");
;
;
;
;
}),
"[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DashboardPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2d$auth$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/node_modules/next-auth/index.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/lib/auth.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$dashboard$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/lib/dashboard/index.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$dashboard$2f$queries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/lib/dashboard/queries.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$components$2f$dashboard$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/index.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$components$2f$dashboard$2f$kpi$2d$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/dashboard/kpi-card.tsx [app-rsc] (ecmascript)");
;
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
function formatPercent(value) {
    return `${value.toFixed(1)}%`;
}
function getTrend(change, invert = false) {
    if (change === null || change === 0) return "neutral";
    const isUp = change > 0;
    if (invert) return isUp ? "down" : "up";
    return isUp ? "up" : "down";
}
async function DashboardPage() {
    const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2d$auth$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getServerSession"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["authOptions"]);
    const orgId = session?.user?.activeOrgId;
    let kpis = null;
    let recentActivity = [];
    let wasteAlerts = [];
    if (orgId) {
        try {
            [kpis, recentActivity, wasteAlerts] = await Promise.all([
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$dashboard$2f$queries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getDashboardKpis"])({
                    organizationId: orgId,
                    days: 30
                }),
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$dashboard$2f$queries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getRecentActivity"])({
                    organizationId: orgId,
                    limit: 5
                }),
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$dashboard$2f$queries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getTopWasteAlerts"])({
                    organizationId: orgId,
                    limit: 5
                })
            ]);
        } catch (error) {
            console.error("Failed to load dashboard data:", error);
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-2xl font-semibold tracking-tight",
                        children: "Dashboard"
                    }, void 0, false, {
                        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/page.tsx",
                        lineNumber: 55,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-1 text-sm text-zinc-600",
                        children: [
                            "Welcome back, ",
                            session?.user?.name ?? session?.user?.email
                        ]
                    }, void 0, true, {
                        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/page.tsx",
                        lineNumber: 56,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/page.tsx",
                lineNumber: 54,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$components$2f$dashboard$2f$kpi$2d$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["KpiCardGrid"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$components$2f$dashboard$2f$kpi$2d$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["KpiCard"], {
                        title: "Total Spend",
                        value: kpis ? formatCurrency(kpis.totalSpend) : "$0.00",
                        change: kpis?.changes?.spend ?? null,
                        changeLabel: "vs last period",
                        trend: getTrend(kpis?.changes?.spend ?? null),
                        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(SpendIcon, {}, void 0, false, {
                            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/page.tsx",
                            lineNumber: 68,
                            columnNumber: 17
                        }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/page.tsx",
                        lineNumber: 62,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$components$2f$dashboard$2f$kpi$2d$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["KpiCard"], {
                        title: "Conversions",
                        value: kpis ? formatNumber(kpis.totalConversions) : "0",
                        change: kpis?.changes?.conversions ?? null,
                        changeLabel: "vs last period",
                        trend: getTrend(kpis?.changes?.conversions ?? null),
                        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(ConversionIcon, {}, void 0, false, {
                            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/page.tsx",
                            lineNumber: 76,
                            columnNumber: 17
                        }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/page.tsx",
                        lineNumber: 70,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$components$2f$dashboard$2f$kpi$2d$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["KpiCard"], {
                        title: "CPA",
                        value: kpis?.overallCpa ? formatCurrency(kpis.overallCpa) : "—",
                        change: kpis?.changes?.cpa ?? null,
                        changeLabel: "vs last period",
                        trend: getTrend(kpis?.changes?.cpa ?? null, true),
                        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(CpaIcon, {}, void 0, false, {
                            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/page.tsx",
                            lineNumber: 84,
                            columnNumber: 17
                        }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/page.tsx",
                        lineNumber: 78,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$components$2f$dashboard$2f$kpi$2d$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["KpiCard"], {
                        title: "Wasted Spend",
                        value: kpis ? formatPercent(kpis.wastedSpendPercent) : "0.0%",
                        change: kpis?.changes?.wastedSpendPercent ?? null,
                        changeLabel: "vs last period",
                        trend: getTrend(kpis?.changes?.wastedSpendPercent ?? null, true),
                        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(WasteIcon, {}, void 0, false, {
                            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/page.tsx",
                            lineNumber: 92,
                            columnNumber: 17
                        }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/page.tsx",
                        lineNumber: 86,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/page.tsx",
                lineNumber: 61,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid gap-4 lg:grid-cols-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-xl border border-zinc-200 bg-white p-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-sm font-medium text-zinc-900",
                                children: "Recent Activity"
                            }, void 0, false, {
                                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/page.tsx",
                                lineNumber: 98,
                                columnNumber: 11
                            }, this),
                            recentActivity.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                className: "mt-4 space-y-3",
                                children: recentActivity.map((activity)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        className: "flex items-start gap-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: `mt-0.5 h-2 w-2 rounded-full ${activity.type === "success" ? "bg-green-500" : "bg-red-500"}`
                                            }, void 0, false, {
                                                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/page.tsx",
                                                lineNumber: 103,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-sm text-zinc-700",
                                                        children: activity.description
                                                    }, void 0, false, {
                                                        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/page.tsx",
                                                        lineNumber: 109,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-xs text-zinc-500",
                                                        children: activity.timestamp.toLocaleString()
                                                    }, void 0, false, {
                                                        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/page.tsx",
                                                        lineNumber: 110,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/page.tsx",
                                                lineNumber: 108,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, activity.id, true, {
                                        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/page.tsx",
                                        lineNumber: 102,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/page.tsx",
                                lineNumber: 100,
                                columnNumber: 13
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-4 text-sm text-zinc-500",
                                children: "No recent activity"
                            }, void 0, false, {
                                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/page.tsx",
                                lineNumber: 118,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/page.tsx",
                        lineNumber: 97,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-xl border border-zinc-200 bg-white p-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-sm font-medium text-zinc-900",
                                children: "Waste Alerts"
                            }, void 0, false, {
                                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/page.tsx",
                                lineNumber: 123,
                                columnNumber: 11
                            }, this),
                            wasteAlerts.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                className: "mt-4 space-y-3",
                                children: wasteAlerts.map((alert)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        className: "flex items-start justify-between gap-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-sm font-medium text-zinc-700",
                                                        children: alert.entityName
                                                    }, void 0, false, {
                                                        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/page.tsx",
                                                        lineNumber: 129,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-xs text-zinc-500 capitalize",
                                                        children: alert.reason
                                                    }, void 0, false, {
                                                        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/page.tsx",
                                                        lineNumber: 130,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/page.tsx",
                                                lineNumber: 128,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: `rounded-full px-2 py-0.5 text-xs font-medium ${alert.level === "critical" ? "bg-red-100 text-red-700" : alert.level === "high" ? "bg-orange-100 text-orange-700" : "bg-yellow-100 text-yellow-700"}`,
                                                children: formatCurrency(alert.wastedSpend)
                                            }, void 0, false, {
                                                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/page.tsx",
                                                lineNumber: 132,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, alert.id, true, {
                                        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/page.tsx",
                                        lineNumber: 127,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/page.tsx",
                                lineNumber: 125,
                                columnNumber: 13
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-4 text-sm text-zinc-500",
                                children: "No waste alerts"
                            }, void 0, false, {
                                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/page.tsx",
                                lineNumber: 147,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/page.tsx",
                        lineNumber: 122,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/page.tsx",
                lineNumber: 96,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-xl border border-zinc-200 bg-white p-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-sm font-medium text-zinc-900",
                        children: "Quick Actions"
                    }, void 0, false, {
                        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/page.tsx",
                        lineNumber: 153,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-4 flex flex-wrap gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                href: "/app/integrations",
                                className: "inline-flex items-center gap-2 rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "🔌"
                                    }, void 0, false, {
                                        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/page.tsx",
                                        lineNumber: 159,
                                        columnNumber: 13
                                    }, this),
                                    " Connect Ad Platform"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/page.tsx",
                                lineNumber: 155,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                href: "/app/campaigns",
                                className: "inline-flex items-center gap-2 rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "📢"
                                    }, void 0, false, {
                                        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/page.tsx",
                                        lineNumber: 165,
                                        columnNumber: 13
                                    }, this),
                                    " View Campaigns"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/page.tsx",
                                lineNumber: 161,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                href: "/app/waste",
                                className: "inline-flex items-center gap-2 rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "💸"
                                    }, void 0, false, {
                                        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/page.tsx",
                                        lineNumber: 171,
                                        columnNumber: 13
                                    }, this),
                                    " Check Waste"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/page.tsx",
                                lineNumber: 167,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/page.tsx",
                        lineNumber: 154,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/page.tsx",
                lineNumber: 152,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/page.tsx",
        lineNumber: 53,
        columnNumber: 5
    }, this);
}
function SpendIcon() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: "h-5 w-5",
        fill: "none",
        stroke: "currentColor",
        viewBox: "0 0 24 24",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeWidth: 1.5,
            d: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        }, void 0, false, {
            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/page.tsx",
            lineNumber: 182,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/page.tsx",
        lineNumber: 181,
        columnNumber: 5
    }, this);
}
function ConversionIcon() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: "h-5 w-5",
        fill: "none",
        stroke: "currentColor",
        viewBox: "0 0 24 24",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeWidth: 1.5,
            d: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        }, void 0, false, {
            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/page.tsx",
            lineNumber: 190,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/page.tsx",
        lineNumber: 189,
        columnNumber: 5
    }, this);
}
function CpaIcon() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: "h-5 w-5",
        fill: "none",
        stroke: "currentColor",
        viewBox: "0 0 24 24",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeWidth: 1.5,
            d: "M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
        }, void 0, false, {
            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/page.tsx",
            lineNumber: 198,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/page.tsx",
        lineNumber: 197,
        columnNumber: 5
    }, this);
}
function WasteIcon() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: "h-5 w-5",
        fill: "none",
        stroke: "currentColor",
        viewBox: "0 0 24 24",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeWidth: 1.5,
            d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        }, void 0, false, {
            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/page.tsx",
            lineNumber: 206,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/page.tsx",
        lineNumber: 205,
        columnNumber: 5
    }, this);
}
}),
"[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/page.tsx [app-rsc] (ecmascript)"));
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__968257f3._.js.map