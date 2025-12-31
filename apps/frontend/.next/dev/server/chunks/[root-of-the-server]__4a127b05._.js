module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[externals]/url [external] (url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}),
"[externals]/http [external] (http, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/assert [external] (assert, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("assert", () => require("assert"));

module.exports = mod;
}),
"[externals]/querystring [external] (querystring, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("querystring", () => require("querystring"));

module.exports = mod;
}),
"[externals]/buffer [external] (buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("buffer", () => require("buffer"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[externals]/https [external] (https, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("https", () => require("https"));

module.exports = mod;
}),
"[externals]/events [external] (events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}),
"[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/packages/shared/dist/types/index.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
;
 //# sourceMappingURL=index.js.map
}),
"[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/packages/shared/dist/utils/index.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
;
 //# sourceMappingURL=index.js.map
}),
"[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/packages/shared/dist/logger-web.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Web Logger Implementation (Console-based)
 *
 * This logger provides a console-based implementation for browser/edge environments.
 * Compatible with Next.js App Router, React Server Components, and client-side code.
 */ __turbopack_context__.s([
    "LogLevel",
    ()=>LogLevel,
    "createChildLogger",
    ()=>createChildLogger,
    "createLogger",
    ()=>createLogger,
    "logger",
    ()=>logger
]);
const LOG_LEVELS = {
    fatal: 60,
    error: 50,
    warn: 40,
    info: 30,
    debug: 20,
    trace: 10,
    silent: Infinity
};
class ConsoleLogger {
    name;
    level;
    bindings;
    constructor(options = {}, bindings = {}){
        this.name = options.name ?? "optiq";
        this.level = LOG_LEVELS[options.level ?? "info"];
        this.bindings = bindings;
    }
    shouldLog(level) {
        return LOG_LEVELS[level] >= this.level;
    }
    formatMessage(level, obj, msg, args) {
        if (!this.shouldLog(level)) return;
        const timestamp = new Date().toISOString();
        const prefix = `[${timestamp}] ${level.toUpperCase()} (${this.name})`;
        // If obj is a string, treat it as the message
        if (typeof obj === "string") {
            const allArgs = msg !== undefined ? [
                msg,
                ...args || []
            ] : args || [];
            console[level](prefix, obj, ...allArgs);
            return;
        }
        // Otherwise, obj is context data
        const contextData = {
            ...this.bindings,
            ...obj
        };
        const hasContext = Object.keys(contextData).length > 0;
        if (hasContext) {
            console[level](prefix, msg || "", contextData, ...args || []);
        } else {
            console[level](prefix, msg || "", ...args || []);
        }
    }
    fatal(obj, msg, ...args) {
        this.formatMessage("error", obj, msg, args);
    }
    error(obj, msg, ...args) {
        this.formatMessage("error", obj, msg, args);
    }
    warn(obj, msg, ...args) {
        this.formatMessage("warn", obj, msg, args);
    }
    info(obj, msg, ...args) {
        this.formatMessage("info", obj, msg, args);
    }
    debug(obj, msg, ...args) {
        this.formatMessage("debug", obj, msg, args);
    }
    trace(obj, msg, ...args) {
        this.formatMessage("debug", obj, msg, args);
    }
    child(bindings) {
        return new ConsoleLogger({
            name: this.name,
            level: Object.keys(LOG_LEVELS).find((k)=>LOG_LEVELS[k] === this.level)
        }, {
            ...this.bindings,
            ...bindings
        });
    }
}
function createLogger(options = {}) {
    return new ConsoleLogger(options);
}
function createChildLogger(parent, bindings) {
    return parent.child(bindings);
}
const logger = createLogger();
const LogLevel = {
    FATAL: "fatal",
    ERROR: "error",
    WARN: "warn",
    INFO: "info",
    DEBUG: "debug",
    TRACE: "trace"
}; //# sourceMappingURL=logger-web.js.map
}),
"[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/packages/shared/dist/normalization/types.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ChannelSchema",
    ()=>ChannelSchema,
    "IsoDateSchema",
    ()=>IsoDateSchema,
    "NormalizedCostRowSchema",
    ()=>NormalizedCostRowSchema
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/node_modules/zod/v4/classic/external.js [app-route] (ecmascript) <export * as z>");
;
const ChannelSchema = __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
    "GOOGLE_ADS",
    "META",
    "TIKTOK",
    "LINKEDIN",
    "X"
]);
const IsoDateSchema = __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().regex(/^\d{4}-\d{2}-\d{2}$/);
const NormalizedCostRowSchema = __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    channel: ChannelSchema,
    date: IsoDateSchema,
    campaign_id: __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1),
    campaign_name: __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1).optional(),
    adset_id: __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1).optional(),
    adset_name: __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1).optional(),
    ad_id: __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1).optional(),
    ad_name: __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1).optional(),
    spend_micros: __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].bigint().nonnegative(),
    clicks: __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].bigint().nonnegative(),
    impressions: __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].bigint().nonnegative(),
    publisher_platform: __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1).optional()
}); //# sourceMappingURL=types.js.map
}),
"[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/packages/shared/dist/normalization/mappers.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "mapGoogleAdsRowToNormalized",
    ()=>mapGoogleAdsRowToNormalized,
    "mapMetaInsightToNormalized",
    ()=>mapMetaInsightToNormalized,
    "mapTikTokRowToNormalized",
    ()=>mapTikTokRowToNormalized
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$packages$2f$shared$2f$dist$2f$normalization$2f$types$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/packages/shared/dist/normalization/types.js [app-route] (ecmascript)");
;
function normalizeName(name) {
    if (!name) return undefined;
    const v = name.trim().replace(/\s+/g, " ");
    return v.length ? v : undefined;
}
function spendToMicros(value) {
    const n = Number(value ?? 0);
    if (!Number.isFinite(n)) return 0n;
    return BigInt(Math.round(n * 1_000_000));
}
function mapMetaInsightToNormalized(row) {
    const out = {
        channel: "META",
        date: row.date_start,
        campaign_id: String(row.campaign_id ?? ""),
        campaign_name: normalizeName(row.campaign_name),
        adset_id: row.adset_id ? String(row.adset_id) : undefined,
        adset_name: normalizeName(row.adset_name),
        ad_id: row.ad_id ? String(row.ad_id) : undefined,
        ad_name: normalizeName(row.ad_name),
        impressions: BigInt(parseInt(row.impressions ?? "0", 10)),
        clicks: BigInt(parseInt(row.clicks ?? "0", 10)),
        spend_micros: spendToMicros(row.spend),
        publisher_platform: normalizeName(row.publisher_platform)
    };
    return __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$packages$2f$shared$2f$dist$2f$normalization$2f$types$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NormalizedCostRowSchema"].parse(out);
}
function mapTikTokRowToNormalized(row) {
    const out = {
        channel: "TIKTOK",
        date: row.date,
        campaign_id: row.campaignId,
        campaign_name: normalizeName(row.campaignName),
        ad_id: row.adId,
        ad_name: normalizeName(row.adName),
        impressions: row.impressions,
        clicks: row.clicks,
        spend_micros: row.spendMicros
    };
    return __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$packages$2f$shared$2f$dist$2f$normalization$2f$types$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NormalizedCostRowSchema"].parse(out);
}
function mapGoogleAdsRowToNormalized(row) {
    const out = {
        channel: "GOOGLE_ADS",
        date: row.date,
        campaign_id: row.campaignId,
        campaign_name: normalizeName(row.campaignName),
        adset_id: row.adGroupId,
        adset_name: normalizeName(row.adGroupName),
        ad_id: row.adId,
        ad_name: normalizeName(row.adName),
        impressions: row.impressions,
        clicks: row.clicks,
        spend_micros: row.spendMicros
    };
    return __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$packages$2f$shared$2f$dist$2f$normalization$2f$types$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NormalizedCostRowSchema"].parse(out);
} //# sourceMappingURL=mappers.js.map
}),
"[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/packages/shared/dist/normalization/index.js [app-route] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$packages$2f$shared$2f$dist$2f$normalization$2f$types$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/packages/shared/dist/normalization/types.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$packages$2f$shared$2f$dist$2f$normalization$2f$mappers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/packages/shared/dist/normalization/mappers.js [app-route] (ecmascript)"); //# sourceMappingURL=index.js.map
;
;
}),
"[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/packages/shared/dist/pricing/types.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Pricing & Plan Types
 *
 * Tiered pricing with usage-based overages:
 * - Starter: 1 workspace, 2 connectors, 10k events/mo, basic attribution, 14-day retention
 * - Growth: 3 workspaces, all connectors, 100k events/mo, all attribution, alerts, 90-day retention
 * - Scale: unlimited workspaces, 1M+ events/mo, custom lookback, SSO, priority support, 365-day retention
 */ __turbopack_context__.s([
    "PLAN_DEFINITIONS",
    ()=>PLAN_DEFINITIONS,
    "calculateOverages",
    ()=>calculateOverages,
    "canDowngrade",
    ()=>canDowngrade,
    "canUpgrade",
    ()=>canUpgrade,
    "checkLimits",
    ()=>checkLimits,
    "getPlanDefinition",
    ()=>getPlanDefinition,
    "getPlanLimits",
    ()=>getPlanLimits,
    "getUpgradePath",
    ()=>getUpgradePath,
    "isUnlimited",
    ()=>isUnlimited
]);
const PLAN_DEFINITIONS = {
    FREE: {
        tier: "FREE",
        name: "Free",
        description: "Get started with basic tracking",
        limits: {
            maxWorkspaces: 1,
            maxConnectors: 1,
            monthlyEventLimit: 1000,
            dataRetentionDays: 7,
            attributionModels: [
                "LAST_TOUCH"
            ],
            alertsEnabled: false,
            ssoEnabled: false,
            prioritySupport: false
        },
        pricing: {
            monthlyPriceCents: 0,
            annualPriceCents: 0,
            overageEventsPer10kCents: 0,
            overageConnectorCents: 0
        },
        features: [
            "1 workspace",
            "1 ad platform connector",
            "1,000 events/month",
            "Last-touch attribution",
            "7-day data retention"
        ]
    },
    STARTER: {
        tier: "STARTER",
        name: "Starter",
        description: "For small teams getting started with attribution",
        limits: {
            maxWorkspaces: 1,
            maxConnectors: 2,
            monthlyEventLimit: 10_000,
            dataRetentionDays: 14,
            attributionModels: [
                "FIRST_TOUCH",
                "LAST_TOUCH",
                "LINEAR"
            ],
            alertsEnabled: false,
            ssoEnabled: false,
            prioritySupport: false
        },
        pricing: {
            monthlyPriceCents: 4900,
            annualPriceCents: 47000,
            overageEventsPer10kCents: 500,
            overageConnectorCents: 1500
        },
        features: [
            "1 workspace",
            "2 ad platform connectors",
            "10,000 events/month",
            "First, last & linear attribution",
            "14-day data retention",
            "Email support"
        ]
    },
    GROWTH: {
        tier: "GROWTH",
        name: "Growth",
        description: "For growing teams who need full attribution insights",
        limits: {
            maxWorkspaces: 3,
            maxConnectors: 10,
            monthlyEventLimit: 100_000,
            dataRetentionDays: 90,
            attributionModels: [
                "FIRST_TOUCH",
                "LAST_TOUCH",
                "LINEAR",
                "TIME_DECAY",
                "POSITION_BASED"
            ],
            alertsEnabled: true,
            ssoEnabled: false,
            prioritySupport: false
        },
        pricing: {
            monthlyPriceCents: 14900,
            annualPriceCents: 143000,
            overageEventsPer10kCents: 400,
            overageConnectorCents: 1000
        },
        features: [
            "3 workspaces",
            "All ad platform connectors",
            "100,000 events/month",
            "All attribution models",
            "90-day data retention",
            "Waste & CPA alerts",
            "Priority email support"
        ],
        recommended: true
    },
    SCALE: {
        tier: "SCALE",
        name: "Scale",
        description: "For enterprises with advanced needs",
        limits: {
            maxWorkspaces: -1,
            maxConnectors: -1,
            monthlyEventLimit: 1_000_000,
            dataRetentionDays: 365,
            attributionModels: [
                "FIRST_TOUCH",
                "LAST_TOUCH",
                "LINEAR",
                "TIME_DECAY",
                "POSITION_BASED",
                "DATA_DRIVEN"
            ],
            alertsEnabled: true,
            ssoEnabled: true,
            prioritySupport: true
        },
        pricing: {
            monthlyPriceCents: 49900,
            annualPriceCents: 479000,
            overageEventsPer10kCents: 300,
            overageConnectorCents: 500
        },
        features: [
            "Unlimited workspaces",
            "Unlimited connectors",
            "1,000,000+ events/month",
            "All attribution models + data-driven",
            "365-day data retention",
            "Custom lookback windows",
            "SSO/SAML (coming soon)",
            "Dedicated support",
            "SLA guarantee"
        ]
    }
};
function getPlanDefinition(tier) {
    return PLAN_DEFINITIONS[tier];
}
function getPlanLimits(tier) {
    return PLAN_DEFINITIONS[tier].limits;
}
function isUnlimited(value) {
    return value === -1;
}
function calculateOverages(usage, limits, pricing) {
    const eventsOverage = Math.max(0, usage.trackedEvents - limits.monthlyEventLimit);
    const connectorsOverage = isUnlimited(limits.maxConnectors) ? 0 : Math.max(0, usage.connectedAccounts - limits.maxConnectors);
    const eventsOverageUnits = Math.ceil(eventsOverage / 10_000);
    const eventsOverageCents = eventsOverageUnits * pricing.overageEventsPer10kCents;
    const connectorsOverageCents = connectorsOverage * pricing.overageConnectorCents;
    return {
        eventsOverage,
        connectorsOverage,
        eventsOverageCents,
        connectorsOverageCents,
        totalOverageCents: eventsOverageCents + connectorsOverageCents
    };
}
function checkLimits(usage, limits) {
    const violations = [];
    if (!isUnlimited(limits.maxWorkspaces) && usage.workspacesUsed > limits.maxWorkspaces) {
        violations.push(`Workspace limit exceeded (${usage.workspacesUsed}/${limits.maxWorkspaces})`);
    }
    if (!isUnlimited(limits.maxConnectors) && usage.connectedAccounts > limits.maxConnectors) {
        violations.push(`Connector limit exceeded (${usage.connectedAccounts}/${limits.maxConnectors})`);
    }
    if (usage.trackedEvents > limits.monthlyEventLimit * 1.5) {
        violations.push(`Event limit significantly exceeded (${usage.trackedEvents}/${limits.monthlyEventLimit})`);
    }
    return {
        withinLimits: violations.length === 0,
        violations
    };
}
function canUpgrade(currentTier, targetTier) {
    const tierOrder = [
        "FREE",
        "STARTER",
        "GROWTH",
        "SCALE"
    ];
    return tierOrder.indexOf(targetTier) > tierOrder.indexOf(currentTier);
}
function canDowngrade(currentTier, targetTier) {
    const tierOrder = [
        "FREE",
        "STARTER",
        "GROWTH",
        "SCALE"
    ];
    return tierOrder.indexOf(targetTier) < tierOrder.indexOf(currentTier);
}
function getUpgradePath(currentTier) {
    const tierOrder = [
        "FREE",
        "STARTER",
        "GROWTH",
        "SCALE"
    ];
    const currentIndex = tierOrder.indexOf(currentTier);
    if (currentIndex < tierOrder.length - 1) {
        return tierOrder[currentIndex + 1];
    }
    return null;
} //# sourceMappingURL=types.js.map
}),
"[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/packages/shared/dist/pricing/index.js [app-route] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$packages$2f$shared$2f$dist$2f$pricing$2f$types$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/packages/shared/dist/pricing/types.js [app-route] (ecmascript)"); //# sourceMappingURL=index.js.map
;
}),
"[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/packages/shared/dist/middleware/request-context.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createRequestContext",
    ()=>createRequestContext,
    "createTraceHeaders",
    ()=>createTraceHeaders,
    "extractTraceId",
    ()=>extractTraceId,
    "generateTraceId",
    ()=>generateTraceId,
    "getRequestDuration",
    ()=>getRequestDuration
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/crypto [external] (crypto, cjs)");
;
function generateTraceId() {
    return (0, __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["randomUUID"])();
}
function createRequestContext(options = {}) {
    return {
        traceId: options.traceId || generateTraceId(),
        startTime: options.startTime || Date.now(),
        method: options.method,
        path: options.path,
        userId: options.userId,
        organizationId: options.organizationId
    };
}
function getRequestDuration(ctx) {
    return Date.now() - ctx.startTime;
}
function extractTraceId(headers) {
    const headerNames = [
        "x-trace-id",
        "x-request-id",
        "x-correlation-id",
        "traceparent"
    ];
    for (const name of headerNames){
        const value = headers[name];
        if (typeof value === "string" && value.length > 0) {
            // For traceparent format (W3C), extract the trace-id portion
            if (name === "traceparent") {
                const parts = value.split("-");
                if (parts.length >= 2) {
                    return parts[1];
                }
            }
            return value;
        }
    }
    return undefined;
}
function createTraceHeaders(traceId) {
    return {
        "x-trace-id": traceId,
        "x-request-id": traceId
    };
} //# sourceMappingURL=request-context.js.map
}),
"[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/packages/shared/dist/middleware/index.js [app-route] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$packages$2f$shared$2f$dist$2f$middleware$2f$request$2d$context$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/packages/shared/dist/middleware/request-context.js [app-route] (ecmascript)"); //# sourceMappingURL=index.js.map
;
}),
"[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/packages/shared/dist/env.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AppEnvSchema",
    ()=>AppEnvSchema,
    "EnvValidationError",
    ()=>EnvValidationError,
    "buildEnvMeta",
    ()=>buildEnvMeta,
    "getRuntimeEnv",
    ()=>getRuntimeEnv,
    "loadEnv",
    ()=>loadEnv
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/node_modules/zod/v4/classic/external.js [app-route] (ecmascript) <export * as z>");
;
const AppEnvSchema = __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
    "development",
    "staging",
    "production"
]);
class EnvValidationError extends Error {
    details;
    constructor(message, details){
        super(message);
        this.name = "EnvValidationError";
        this.details = details;
    }
}
function formatZodError(err) {
    const flat = err.flatten();
    const messages = [];
    // Format field-specific errors
    for (const [field, errors] of Object.entries(flat.fieldErrors)){
        if (Array.isArray(errors) && errors.length > 0) {
            messages.push(`  • ${field}: ${errors.join(", ")}`);
        }
    }
    // Format form-level errors
    if (flat.formErrors.length > 0) {
        messages.push(`  • ${flat.formErrors.join(", ")}`);
    }
    return {
        formErrors: flat.formErrors,
        fieldErrors: flat.fieldErrors,
        readableMessage: messages.length > 0 ? `\n${messages.join("\n")}` : "Unknown validation error"
    };
}
function loadEnv(schema, raw, options = {}) {
    const parsed = schema.safeParse(raw);
    if (parsed.success) return parsed.data;
    const redacted = new Set(options.redactKeys ?? []);
    const snapshot = {};
    for (const [k, v] of Object.entries(raw)){
        snapshot[k] = redacted.has(k) ? "[REDACTED]" : v;
    }
    const formatted = formatZodError(parsed.error);
    const errorMessage = `
╔════════════════════════════════════════════════════════════════════════════╗
║ ENVIRONMENT CONFIGURATION ERROR                                            ║
╚════════════════════════════════════════════════════════════════════════════╝

Your application failed to start due to invalid or missing environment variables.

ERRORS:${formatted.readableMessage}

TROUBLESHOOTING:
  1. Copy .env.example to .env if you haven't already
  2. Fill in all required values in your .env file
  3. Ensure all values match the expected format (URLs, numbers, etc.)
  4. Check that sensitive values meet minimum length requirements

For more details, see .env.example in the project root.
`;
    throw new EnvValidationError(errorMessage, {
        errors: formatted,
        snapshot
    });
}
function getRuntimeEnv(rawAppEnv) {
    const appEnv = rawAppEnv?.toLowerCase();
    if (appEnv === "production") return "production";
    if (appEnv === "staging") return "staging";
    return "development";
}
function buildEnvMeta(appEnv) {
    return {
        appEnv,
        isDevelopment: appEnv === "development",
        isStaging: appEnv === "staging",
        isProduction: appEnv === "production"
    };
} //# sourceMappingURL=env.js.map
}),
"[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/packages/shared/dist/index.js [app-route] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$packages$2f$shared$2f$dist$2f$types$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/packages/shared/dist/types/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$packages$2f$shared$2f$dist$2f$utils$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/packages/shared/dist/utils/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$packages$2f$shared$2f$dist$2f$logger$2d$web$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/packages/shared/dist/logger-web.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$packages$2f$shared$2f$dist$2f$normalization$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/packages/shared/dist/normalization/index.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$packages$2f$shared$2f$dist$2f$pricing$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/packages/shared/dist/pricing/index.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$packages$2f$shared$2f$dist$2f$middleware$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/packages/shared/dist/middleware/index.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$packages$2f$shared$2f$dist$2f$env$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/packages/shared/dist/env.js [app-route] (ecmascript)"); //# sourceMappingURL=index.js.map
;
;
;
;
;
;
;
}),
"[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/lib/env.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "env",
    ()=>env
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/node_modules/zod/v4/classic/external.js [app-route] (ecmascript) <export * as z>");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$packages$2f$shared$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/packages/shared/dist/index.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$packages$2f$shared$2f$dist$2f$env$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/packages/shared/dist/env.js [app-route] (ecmascript)");
;
;
const EnvSchema = __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    // Application
    APP_ENV: __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$packages$2f$shared$2f$dist$2f$env$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AppEnvSchema"].default("development"),
    NODE_ENV: __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        "development",
        "production",
        "test"
    ]).default("development"),
    // Database
    DATABASE_URL: __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().url().describe("PostgreSQL connection string"),
    // NextAuth
    NEXTAUTH_SECRET: __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(32).describe("Secret for NextAuth session encryption (min 32 chars)"),
    NEXTAUTH_URL: __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().url().optional().describe("Canonical URL of your site"),
    // Data Encryption
    DATA_ENCRYPTION_KEY: __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(32).describe("AES-256 key for encrypting sensitive data (32+ chars)"),
    // Google OAuth & Ads
    GOOGLE_OAUTH_CLIENT_ID: __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1).describe("Google OAuth 2.0 Client ID"),
    GOOGLE_OAUTH_CLIENT_SECRET: __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1).describe("Google OAuth 2.0 Client Secret"),
    GOOGLE_OAUTH_REDIRECT_URI: __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().url().describe("OAuth redirect URI for Google"),
    GOOGLE_ADS_DEVELOPER_TOKEN: __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1).describe("Google Ads API Developer Token"),
    GOOGLE_ADS_LOGIN_CUSTOMER_ID: __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1).optional().describe("Google Ads Manager Account ID (optional)"),
    // Meta (Facebook) Ads
    META_APP_ID: __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1).describe("Meta App ID"),
    META_APP_SECRET: __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1).describe("Meta App Secret"),
    META_OAUTH_REDIRECT_URI: __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().url().describe("OAuth redirect URI for Meta"),
    META_API_VERSION: __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1).default("v20.0").describe("Meta Graph API version"),
    // TikTok Ads
    TIKTOK_APP_ID: __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1).describe("TikTok App ID"),
    TIKTOK_APP_SECRET: __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1).describe("TikTok App Secret"),
    TIKTOK_OAUTH_REDIRECT_URI: __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().url().describe("OAuth redirect URI for TikTok"),
    TIKTOK_API_BASE_URL: __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().url().default("https://business-api.tiktok.com").describe("TikTok Business API base URL"),
    // Stripe (Optional)
    STRIPE_SECRET_KEY: __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().startsWith("sk_").optional().describe("Stripe secret key (must start with sk_)"),
    STRIPE_WEBHOOK_SECRET: __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().startsWith("whsec_").optional().describe("Stripe webhook signing secret (must start with whsec_)"),
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().startsWith("pk_").optional().describe("Stripe publishable key (must start with pk_)"),
    // Email Notifications (Optional)
    SMTP_HOST: __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().describe("SMTP server hostname"),
    SMTP_PORT: __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].coerce.number().int().min(1).max(65535).optional().describe("SMTP server port"),
    SMTP_USER: __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().describe("SMTP username"),
    SMTP_PASSWORD: __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().describe("SMTP password"),
    SMTP_FROM_EMAIL: __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().email().optional().describe("From email address for notifications"),
    SMTP_FROM_NAME: __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().describe("From name for notifications")
});
const base = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$packages$2f$shared$2f$dist$2f$env$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["loadEnv"])(EnvSchema, {
    APP_ENV: process.env.APP_ENV,
    NODE_ENV: ("TURBOPACK compile-time value", "development"),
    DATABASE_URL: process.env.DATABASE_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    DATA_ENCRYPTION_KEY: process.env.DATA_ENCRYPTION_KEY,
    GOOGLE_OAUTH_CLIENT_ID: process.env.GOOGLE_OAUTH_CLIENT_ID,
    GOOGLE_OAUTH_CLIENT_SECRET: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    GOOGLE_OAUTH_REDIRECT_URI: process.env.GOOGLE_OAUTH_REDIRECT_URI,
    GOOGLE_ADS_DEVELOPER_TOKEN: process.env.GOOGLE_ADS_DEVELOPER_TOKEN,
    GOOGLE_ADS_LOGIN_CUSTOMER_ID: process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID,
    META_APP_ID: process.env.META_APP_ID,
    META_APP_SECRET: process.env.META_APP_SECRET,
    META_OAUTH_REDIRECT_URI: process.env.META_OAUTH_REDIRECT_URI,
    META_API_VERSION: process.env.META_API_VERSION,
    TIKTOK_APP_ID: process.env.TIKTOK_APP_ID,
    TIKTOK_APP_SECRET: process.env.TIKTOK_APP_SECRET,
    TIKTOK_OAUTH_REDIRECT_URI: process.env.TIKTOK_OAUTH_REDIRECT_URI,
    TIKTOK_API_BASE_URL: process.env.TIKTOK_API_BASE_URL,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASSWORD: process.env.SMTP_PASSWORD,
    SMTP_FROM_EMAIL: process.env.SMTP_FROM_EMAIL,
    SMTP_FROM_NAME: process.env.SMTP_FROM_NAME
}, {
    redactKeys: [
        "DATABASE_URL",
        "NEXTAUTH_SECRET",
        "DATA_ENCRYPTION_KEY",
        "GOOGLE_OAUTH_CLIENT_SECRET",
        "GOOGLE_ADS_DEVELOPER_TOKEN",
        "META_APP_SECRET",
        "TIKTOK_APP_SECRET",
        "STRIPE_SECRET_KEY",
        "STRIPE_WEBHOOK_SECRET",
        "SMTP_PASSWORD"
    ]
});
const env = {
    ...base,
    ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$packages$2f$shared$2f$dist$2f$env$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["buildEnvMeta"])(base.APP_ENV)
};
}),
"[externals]/@prisma/client [external] (@prisma/client, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("@prisma/client", () => require("@prisma/client"));

module.exports = mod;
}),
"[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/lib/prisma.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "prisma",
    ()=>prisma
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$server$2d$only$2f$empty$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/node_modules/next/dist/compiled/server-only/empty.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/@prisma/client [external] (@prisma/client, cjs)");
;
;
const globalForPrisma = globalThis;
const prisma = globalForPrisma.prisma ?? new __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__["PrismaClient"]({
    log: [
        "error",
        "warn"
    ]
});
if ("TURBOPACK compile-time truthy", 1) globalForPrisma.prisma = prisma;
}),
"[externals]/argon2 [external] (argon2, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("argon2", () => require("argon2"));

module.exports = mod;
}),
"[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/lib/password.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "hashPassword",
    ()=>hashPassword,
    "verifyPassword",
    ()=>verifyPassword
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$server$2d$only$2f$empty$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/node_modules/next/dist/compiled/server-only/empty.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$argon2__$5b$external$5d$__$28$argon2$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/argon2 [external] (argon2, cjs)");
;
;
async function hashPassword(password) {
    return __TURBOPACK__imported__module__$5b$externals$5d2f$argon2__$5b$external$5d$__$28$argon2$2c$__cjs$29$__["default"].hash(password, {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$argon2__$5b$external$5d$__$28$argon2$2c$__cjs$29$__["default"].argon2id
    });
}
async function verifyPassword(hash, password) {
    return __TURBOPACK__imported__module__$5b$externals$5d2f$argon2__$5b$external$5d$__$28$argon2$2c$__cjs$29$__["default"].verify(hash, password);
}
}),
"[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/lib/auth.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "authHandler",
    ()=>authHandler,
    "authOptions",
    ()=>authOptions
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$server$2d$only$2f$empty$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/node_modules/next/dist/compiled/server-only/empty.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2d$auth$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/node_modules/next-auth/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2d$auth$2f$providers$2f$credentials$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/node_modules/next-auth/providers/credentials.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$env$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/lib/env.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/lib/prisma.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$password$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/lib/password.ts [app-route] (ecmascript)");
;
;
;
;
;
;
const authOptions = {
    session: {
        strategy: "jwt"
    },
    secret: __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$env$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["env"].NEXTAUTH_SECRET,
    pages: {
        signIn: "/signin"
    },
    providers: [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2d$auth$2f$providers$2f$credentials$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])({
            name: "Email and Password",
            credentials: {
                email: {
                    label: "Email",
                    type: "email"
                },
                password: {
                    label: "Password",
                    type: "password"
                }
            },
            authorize: async (credentials)=>{
                const email = credentials?.email?.trim().toLowerCase();
                const password = credentials?.password;
                if (!email || !password) return null;
                const user = await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].user.findUnique({
                    where: {
                        email
                    },
                    select: {
                        id: true,
                        email: true,
                        name: true,
                        passwordHash: true,
                        activeOrgId: true
                    }
                });
                if (!user?.passwordHash) return null;
                const ok = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$password$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["verifyPassword"])(user.passwordHash, password);
                if (!ok) return null;
                return {
                    id: user.id,
                    email: user.email,
                    name: user.name ?? undefined,
                    activeOrgId: user.activeOrgId ?? undefined
                };
            }
        })
    ],
    callbacks: {
        jwt: async ({ token, user })=>{
            if (user) {
                token.id = user.id;
                token.activeOrgId = user.activeOrgId;
            }
            return token;
        },
        session: async ({ session, token })=>{
            if (session.user) {
                session.user.id = token.id;
                session.user.activeOrgId = token.activeOrgId;
            }
            return session;
        }
    }
};
const authHandler = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2d$auth$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])(authOptions);
}),
"[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/lib/metrics/types.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$server$2d$only$2f$empty$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/node_modules/next/dist/compiled/server-only/empty.js [app-route] (ecmascript)");
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
"[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/lib/metrics/cache.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MetricsCache",
    ()=>MetricsCache,
    "metricsCache",
    ()=>metricsCache
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$server$2d$only$2f$empty$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/node_modules/next/dist/compiled/server-only/empty.js [app-route] (ecmascript)");
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
"[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/lib/metrics/aggregator.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MetricsAggregator",
    ()=>MetricsAggregator,
    "metricsAggregator",
    ()=>metricsAggregator
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$server$2d$only$2f$empty$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/node_modules/next/dist/compiled/server-only/empty.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/lib/prisma.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$metrics$2f$types$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/lib/metrics/types.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$metrics$2f$cache$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/lib/metrics/cache.ts [app-route] (ecmascript)");
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
        this.cache = __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$metrics$2f$cache$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["metricsCache"];
    }
    async aggregateByPeriod(params) {
        const cacheKey = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$metrics$2f$types$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["buildCacheKey"])({
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
        const metrics = await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].dailyAdAccountMetric.findMany({
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
        const metrics = await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].dailyAdAccountMetric.findMany({
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
        const metrics = await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].dailyAdAccountMetric.findMany({
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
        const metrics = await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].dailyCampaignMetric.findMany({
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
        const metrics = await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].dailyAdMetric.findMany({
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
            const { label } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$metrics$2f$types$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getPeriodBounds"])(m.date, granularity);
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
                const { label } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$metrics$2f$types$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getPeriodBounds"])(m.date, granularity);
                return label === period;
            })?.date;
            if (!sampleDate) continue;
            const { start, end } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$metrics$2f$types$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getPeriodBounds"])(sampleDate, granularity);
            rows.push({
                period,
                periodStart: start,
                periodEnd: end,
                entityId: entity.entityId,
                entityName: entity.entityName,
                entityLevel: entity.entityLevel,
                platformCode: entity.platformCode,
                metrics: (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$metrics$2f$types$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["computeMetrics"])(raw, this.config.targetCpaMicros)
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
            change: (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$metrics$2f$types$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["computeChange"])(currentMetrics, previousMetrics)
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
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$metrics$2f$types$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["computeMetrics"])(totals, this.config.targetCpaMicros);
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
"[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/lib/metrics/index.ts [app-route] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$metrics$2f$aggregator$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/lib/metrics/aggregator.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$metrics$2f$cache$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/lib/metrics/cache.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$metrics$2f$types$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/lib/metrics/types.ts [app-route] (ecmascript)");
;
;
;
}),
"[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/lib/waste/types.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$server$2d$only$2f$empty$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/node_modules/next/dist/compiled/server-only/empty.js [app-route] (ecmascript)");
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
"[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/lib/waste/evaluator.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "WasteEvaluator",
    ()=>WasteEvaluator,
    "wasteEvaluator",
    ()=>wasteEvaluator
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$server$2d$only$2f$empty$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/node_modules/next/dist/compiled/server-only/empty.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/lib/prisma.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$waste$2f$types$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/lib/waste/types.ts [app-route] (ecmascript)");
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
            return `Consider pausing this ${metrics.entityType.replace("_", " ")} or reviewing targeting. Spent $${(0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$waste$2f$types$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["microsToDollars"])(metrics.spendMicros).toFixed(2)} with no conversions.`;
        case "cpa_above_target":
            const cpa = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$waste$2f$types$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["computeCpa"])(metrics.spendMicros, metrics.conversions);
            return `CPA of $${cpa?.toFixed(2) ?? "N/A"} exceeds target. Review ad creative, landing page, or audience targeting.`;
        case "low_ctr_high_spend":
            const ctr = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$waste$2f$types$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["computeCtr"])(metrics.clicks, metrics.impressions);
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
            ...__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$waste$2f$types$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DEFAULT_WASTE_CONFIG"],
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
        const metrics = await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].dailyAdAccountMetric.groupBy({
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
            const account = await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].adAccount.findUnique({
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
        const metrics = await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].dailyCampaignMetric.groupBy({
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
            const campaign = await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].campaign.findUnique({
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
        const metrics = await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].dailyAdMetric.groupBy({
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
            const ad = await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].ad.findUnique({
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
            const level = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$waste$2f$types$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["determineWasteLevel"])(metrics.spendMicros, this.config, reason);
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
                targetCpa: (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$waste$2f$types$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["microsToDollars"])(this.config.targetCpaMicros),
                windowStart: window.start,
                windowEnd: window.end,
                message: `${metrics.entityName} spent $${(0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$waste$2f$types$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["microsToDollars"])(metrics.spendMicros).toFixed(2)} with zero conversions in the last ${window.days} days.`,
                recommendation: buildRecommendation(reason, metrics)
            });
        }
        if (metrics.conversions > BigInt(0)) {
            const cpa = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$waste$2f$types$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["computeCpa"])(metrics.spendMicros, metrics.conversions);
            const targetCpa = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$waste$2f$types$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["microsToDollars"])(this.config.targetCpaMicros);
            const cpaThreshold = targetCpa * (1 + this.config.cpaTolerancePercent / 100);
            if (cpa !== null && cpa > cpaThreshold * 1_000_000) {
                const reason = "cpa_above_target";
                const level = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$waste$2f$types$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["determineWasteLevel"])(metrics.spendMicros, this.config, reason);
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
        const metrics = await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].dailyCampaignMetric.aggregate({
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
        const campaign = await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].campaign.findUnique({
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
        const metrics = await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].dailyAdMetric.aggregate({
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
        const ad = await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].ad.findUnique({
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
"[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/lib/waste/index.ts [app-route] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$waste$2f$evaluator$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/lib/waste/evaluator.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$waste$2f$types$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/lib/waste/types.ts [app-route] (ecmascript)");
;
;
}),
"[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/api/dashboard/roi/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"40e2a4c1cc891d1074e4bbe610b3844ed6b0ca159b":"GET"},"",""] */ __turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2d$auth$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/node_modules/next-auth/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/node_modules/zod/v4/classic/external.js [app-route] (ecmascript) <export * as z>");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/lib/auth.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$metrics$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/lib/metrics/index.ts [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$metrics$2f$aggregator$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/lib/metrics/aggregator.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$waste$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/lib/waste/index.ts [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$waste$2f$evaluator$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/lib/waste/evaluator.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-route] (ecmascript)");
;
;
;
;
;
;
;
const QuerySchema = __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    startDate: __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().regex(/^\d{4}-\d{2}-\d{2}$/),
    endDate: __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().regex(/^\d{4}-\d{2}-\d{2}$/),
    channels: __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    granularity: __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        "day",
        "week",
        "month"
    ]).default("day"),
    breakdown: __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        "platform",
        "campaign",
        "ad"
    ]).default("campaign")
});
async function GET(req) {
    const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2d$auth$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getServerSession"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["authOptions"]);
    if (!session?.user?.activeOrgId) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "unauthorized"
        }, {
            status: 401
        });
    }
    const orgId = session.user.activeOrgId;
    const url = new URL(req.url);
    const params = QuerySchema.safeParse({
        startDate: url.searchParams.get("startDate"),
        endDate: url.searchParams.get("endDate"),
        channels: url.searchParams.get("channels"),
        granularity: url.searchParams.get("granularity") ?? "day",
        breakdown: url.searchParams.get("breakdown") ?? "campaign"
    });
    if (!params.success) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "invalid_params"
        }, {
            status: 400
        });
    }
    const { startDate, endDate, channels, granularity, breakdown } = params.data;
    const dateRange = {
        start: new Date(startDate + "T00:00:00"),
        end: new Date(endDate + "T23:59:59.999")
    };
    const platformCodes = channels ? channels.split(",").filter(Boolean) : undefined;
    const filter = {
        organizationId: orgId,
        dateRange,
        platformCodes
    };
    try {
        const [summary, timeseries, breakdownData, wasteAnalysis] = await Promise.all([
            __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$metrics$2f$aggregator$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["metricsAggregator"].getSummary({
                filter,
                entityLevel: "organization",
                comparePrevious: true
            }),
            __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$metrics$2f$aggregator$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["metricsAggregator"].aggregateByPeriod({
                filter,
                granularity: granularity,
                entityLevel: "organization"
            }),
            __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$metrics$2f$aggregator$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["metricsAggregator"].aggregateByPeriod({
                filter,
                granularity: "day",
                entityLevel: breakdown
            }),
            __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$waste$2f$evaluator$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["wasteEvaluator"].evaluateOrganization({
                organizationId: orgId,
                windowDays: Math.ceil((dateRange.end.getTime() - dateRange.start.getTime()) / 86400000),
                endDate: dateRange.end
            })
        ]);
        const totalWaste = wasteAnalysis.alerts.reduce((sum, a)=>sum + Number(a.spendMicros) / 1_000_000, 0);
        const wastePercent = summary.current.spend > 0 ? totalWaste / summary.current.spend * 100 : 0;
        const kpis = {
            spend: summary.current.spend,
            revenue: summary.current.revenue,
            roas: summary.current.roas,
            cpa: summary.current.cpa,
            conversions: summary.current.conversions,
            impressions: summary.current.impressions,
            clicks: summary.current.clicks,
            wasteAmount: totalWaste,
            wastePercent,
            changes: summary.change
        };
        const timeseriesData = timeseries.map((row)=>({
                date: row.period,
                spend: row.metrics.spend,
                revenue: row.metrics.revenue,
                conversions: row.metrics.conversions,
                roas: row.metrics.roas,
                cpa: row.metrics.cpa
            }));
        const entityTotals = new Map();
        for (const row of breakdownData){
            const key = row.entityId ?? "unknown";
            const existing = entityTotals.get(key);
            if (existing) {
                existing.spend += row.metrics.spend;
                existing.revenue += row.metrics.revenue;
                existing.conversions += row.metrics.conversions;
                existing.impressions += row.metrics.impressions;
                existing.clicks += row.metrics.clicks;
            } else {
                entityTotals.set(key, {
                    entityId: row.entityId ?? "unknown",
                    entityName: row.entityName ?? "Unknown",
                    platformCode: row.platformCode,
                    spend: row.metrics.spend,
                    revenue: row.metrics.revenue,
                    conversions: row.metrics.conversions,
                    impressions: row.metrics.impressions,
                    clicks: row.metrics.clicks,
                    roas: null,
                    cpa: null
                });
            }
        }
        const breakdownRows = Array.from(entityTotals.values()).map((e)=>({
                ...e,
                roas: e.spend > 0 ? e.revenue / e.spend : null,
                cpa: e.conversions > 0 ? e.spend / e.conversions : null
            }));
        breakdownRows.sort((a, b)=>b.spend - a.spend);
        return __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            kpis,
            timeseries: timeseriesData,
            breakdown: breakdownRows.slice(0, 50)
        });
    } catch (error) {
        console.error("ROI dashboard error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "server_error"
        }, {
            status: 500
        });
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    GET
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["registerServerReference"])(GET, "40e2a4c1cc891d1074e4bbe610b3844ed6b0ca159b", null);
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__4a127b05._.js.map