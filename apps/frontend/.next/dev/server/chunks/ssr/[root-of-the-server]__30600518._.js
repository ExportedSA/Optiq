module.exports = [
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
"[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/packages/shared/dist/types/index.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
;
 //# sourceMappingURL=index.js.map
}),
"[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/packages/shared/dist/utils/index.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
;
 //# sourceMappingURL=index.js.map
}),
"[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/packages/shared/dist/logger-web.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/packages/shared/dist/normalization/types.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ChannelSchema",
    ()=>ChannelSchema,
    "IsoDateSchema",
    ()=>IsoDateSchema,
    "NormalizedCostRowSchema",
    ()=>NormalizedCostRowSchema
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/node_modules/zod/v4/classic/external.js [app-rsc] (ecmascript) <export * as z>");
;
const ChannelSchema = __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
    "GOOGLE_ADS",
    "META",
    "TIKTOK",
    "LINKEDIN",
    "X"
]);
const IsoDateSchema = __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().regex(/^\d{4}-\d{2}-\d{2}$/);
const NormalizedCostRowSchema = __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    channel: ChannelSchema,
    date: IsoDateSchema,
    campaign_id: __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1),
    campaign_name: __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1).optional(),
    adset_id: __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1).optional(),
    adset_name: __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1).optional(),
    ad_id: __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1).optional(),
    ad_name: __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1).optional(),
    spend_micros: __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].bigint().nonnegative(),
    clicks: __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].bigint().nonnegative(),
    impressions: __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].bigint().nonnegative(),
    publisher_platform: __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1).optional()
}); //# sourceMappingURL=types.js.map
}),
"[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/packages/shared/dist/normalization/mappers.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "mapGoogleAdsRowToNormalized",
    ()=>mapGoogleAdsRowToNormalized,
    "mapMetaInsightToNormalized",
    ()=>mapMetaInsightToNormalized,
    "mapTikTokRowToNormalized",
    ()=>mapTikTokRowToNormalized
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$packages$2f$shared$2f$dist$2f$normalization$2f$types$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/packages/shared/dist/normalization/types.js [app-rsc] (ecmascript)");
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
    return __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$packages$2f$shared$2f$dist$2f$normalization$2f$types$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["NormalizedCostRowSchema"].parse(out);
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
    return __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$packages$2f$shared$2f$dist$2f$normalization$2f$types$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["NormalizedCostRowSchema"].parse(out);
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
    return __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$packages$2f$shared$2f$dist$2f$normalization$2f$types$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["NormalizedCostRowSchema"].parse(out);
} //# sourceMappingURL=mappers.js.map
}),
"[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/packages/shared/dist/normalization/index.js [app-rsc] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$packages$2f$shared$2f$dist$2f$normalization$2f$types$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/packages/shared/dist/normalization/types.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$packages$2f$shared$2f$dist$2f$normalization$2f$mappers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/packages/shared/dist/normalization/mappers.js [app-rsc] (ecmascript)"); //# sourceMappingURL=index.js.map
;
;
}),
"[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/packages/shared/dist/pricing/types.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/packages/shared/dist/pricing/index.js [app-rsc] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$packages$2f$shared$2f$dist$2f$pricing$2f$types$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/packages/shared/dist/pricing/types.js [app-rsc] (ecmascript)"); //# sourceMappingURL=index.js.map
;
}),
"[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/packages/shared/dist/middleware/request-context.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/packages/shared/dist/middleware/index.js [app-rsc] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$packages$2f$shared$2f$dist$2f$middleware$2f$request$2d$context$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/packages/shared/dist/middleware/request-context.js [app-rsc] (ecmascript)"); //# sourceMappingURL=index.js.map
;
}),
"[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/packages/shared/dist/env.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/node_modules/zod/v4/classic/external.js [app-rsc] (ecmascript) <export * as z>");
;
const AppEnvSchema = __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
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
"[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/packages/shared/dist/index.js [app-rsc] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$packages$2f$shared$2f$dist$2f$types$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/packages/shared/dist/types/index.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$packages$2f$shared$2f$dist$2f$utils$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/packages/shared/dist/utils/index.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$packages$2f$shared$2f$dist$2f$logger$2d$web$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/packages/shared/dist/logger-web.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$packages$2f$shared$2f$dist$2f$normalization$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/packages/shared/dist/normalization/index.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$packages$2f$shared$2f$dist$2f$pricing$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/packages/shared/dist/pricing/index.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$packages$2f$shared$2f$dist$2f$middleware$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/packages/shared/dist/middleware/index.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$packages$2f$shared$2f$dist$2f$env$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/packages/shared/dist/env.js [app-rsc] (ecmascript)"); //# sourceMappingURL=index.js.map
;
;
;
;
;
;
;
}),
"[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/lib/env.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "env",
    ()=>env
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/node_modules/zod/v4/classic/external.js [app-rsc] (ecmascript) <export * as z>");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$packages$2f$shared$2f$dist$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/packages/shared/dist/index.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$packages$2f$shared$2f$dist$2f$env$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/packages/shared/dist/env.js [app-rsc] (ecmascript)");
;
;
const EnvSchema = __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    // Application
    APP_ENV: __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$packages$2f$shared$2f$dist$2f$env$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["AppEnvSchema"].default("development"),
    NODE_ENV: __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        "development",
        "production",
        "test"
    ]).default("development"),
    // Database
    DATABASE_URL: __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().url().describe("PostgreSQL connection string"),
    // NextAuth
    NEXTAUTH_SECRET: __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(32).describe("Secret for NextAuth session encryption (min 32 chars)"),
    NEXTAUTH_URL: __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().url().optional().describe("Canonical URL of your site"),
    // Data Encryption
    DATA_ENCRYPTION_KEY: __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(32).describe("AES-256 key for encrypting sensitive data (32+ chars)"),
    // Google OAuth & Ads
    GOOGLE_OAUTH_CLIENT_ID: __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1).describe("Google OAuth 2.0 Client ID"),
    GOOGLE_OAUTH_CLIENT_SECRET: __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1).describe("Google OAuth 2.0 Client Secret"),
    GOOGLE_OAUTH_REDIRECT_URI: __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().url().describe("OAuth redirect URI for Google"),
    GOOGLE_ADS_DEVELOPER_TOKEN: __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1).describe("Google Ads API Developer Token"),
    GOOGLE_ADS_LOGIN_CUSTOMER_ID: __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1).optional().describe("Google Ads Manager Account ID (optional)"),
    // Meta (Facebook) Ads
    META_APP_ID: __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1).describe("Meta App ID"),
    META_APP_SECRET: __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1).describe("Meta App Secret"),
    META_OAUTH_REDIRECT_URI: __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().url().describe("OAuth redirect URI for Meta"),
    META_API_VERSION: __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1).default("v20.0").describe("Meta Graph API version"),
    // TikTok Ads
    TIKTOK_APP_ID: __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1).describe("TikTok App ID"),
    TIKTOK_APP_SECRET: __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1).describe("TikTok App Secret"),
    TIKTOK_OAUTH_REDIRECT_URI: __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().url().describe("OAuth redirect URI for TikTok"),
    TIKTOK_API_BASE_URL: __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().url().default("https://business-api.tiktok.com").describe("TikTok Business API base URL"),
    // Stripe (Optional)
    STRIPE_SECRET_KEY: __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().startsWith("sk_").optional().describe("Stripe secret key (must start with sk_)"),
    STRIPE_WEBHOOK_SECRET: __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().startsWith("whsec_").optional().describe("Stripe webhook signing secret (must start with whsec_)"),
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().startsWith("pk_").optional().describe("Stripe publishable key (must start with pk_)"),
    // Email Notifications (Optional)
    SMTP_HOST: __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().describe("SMTP server hostname"),
    SMTP_PORT: __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].coerce.number().int().min(1).max(65535).optional().describe("SMTP server port"),
    SMTP_USER: __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().describe("SMTP username"),
    SMTP_PASSWORD: __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().describe("SMTP password"),
    SMTP_FROM_EMAIL: __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().email().optional().describe("From email address for notifications"),
    SMTP_FROM_NAME: __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().describe("From name for notifications")
});
const base = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$packages$2f$shared$2f$dist$2f$env$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["loadEnv"])(EnvSchema, {
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
    ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$packages$2f$shared$2f$dist$2f$env$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["buildEnvMeta"])(base.APP_ENV)
};
}),
"[externals]/@prisma/client [external] (@prisma/client, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("@prisma/client", () => require("@prisma/client"));

module.exports = mod;
}),
"[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/lib/prisma.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "prisma",
    ()=>prisma
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$server$2d$only$2f$empty$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/node_modules/next/dist/compiled/server-only/empty.js [app-rsc] (ecmascript)");
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
"[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/lib/password.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "hashPassword",
    ()=>hashPassword,
    "verifyPassword",
    ()=>verifyPassword
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$server$2d$only$2f$empty$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/node_modules/next/dist/compiled/server-only/empty.js [app-rsc] (ecmascript)");
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
"[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/lib/auth.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "authHandler",
    ()=>authHandler,
    "authOptions",
    ()=>authOptions
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$server$2d$only$2f$empty$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/node_modules/next/dist/compiled/server-only/empty.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2d$auth$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/node_modules/next-auth/index.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2d$auth$2f$providers$2f$credentials$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/node_modules/next-auth/providers/credentials.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$env$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/lib/env.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/lib/prisma.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$password$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/lib/password.ts [app-rsc] (ecmascript)");
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
    secret: __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$env$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["env"].NEXTAUTH_SECRET,
    pages: {
        signIn: "/signin"
    },
    providers: [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2d$auth$2f$providers$2f$credentials$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"])({
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
                const user = await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].user.findUnique({
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
                const ok = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$password$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["verifyPassword"])(user.passwordHash, password);
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
const authHandler = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2d$auth$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"])(authOptions);
}),
"[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/layout/app-shell.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

// This file is generated by next-core EcmascriptClientReferenceModule.
__turbopack_context__.s([
    "AppShell",
    ()=>AppShell
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const AppShell = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call AppShell() from the server but AppShell is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/layout/app-shell.tsx <module evaluation>", "AppShell");
}),
"[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/layout/app-shell.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

// This file is generated by next-core EcmascriptClientReferenceModule.
__turbopack_context__.s([
    "AppShell",
    ()=>AppShell
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const AppShell = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call AppShell() from the server but AppShell is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/layout/app-shell.tsx", "AppShell");
}),
"[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/layout/app-shell.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$components$2f$layout$2f$app$2d$shell$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/layout/app-shell.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$components$2f$layout$2f$app$2d$shell$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/layout/app-shell.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$components$2f$layout$2f$app$2d$shell$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/layout/sidebar.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

// This file is generated by next-core EcmascriptClientReferenceModule.
__turbopack_context__.s([
    "Sidebar",
    ()=>Sidebar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const Sidebar = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call Sidebar() from the server but Sidebar is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/layout/sidebar.tsx <module evaluation>", "Sidebar");
}),
"[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/layout/sidebar.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

// This file is generated by next-core EcmascriptClientReferenceModule.
__turbopack_context__.s([
    "Sidebar",
    ()=>Sidebar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const Sidebar = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call Sidebar() from the server but Sidebar is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/layout/sidebar.tsx", "Sidebar");
}),
"[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/layout/sidebar.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$components$2f$layout$2f$sidebar$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/layout/sidebar.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$components$2f$layout$2f$sidebar$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/layout/sidebar.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$components$2f$layout$2f$sidebar$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/layout/header.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

// This file is generated by next-core EcmascriptClientReferenceModule.
__turbopack_context__.s([
    "Header",
    ()=>Header
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const Header = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call Header() from the server but Header is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/layout/header.tsx <module evaluation>", "Header");
}),
"[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/layout/header.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

// This file is generated by next-core EcmascriptClientReferenceModule.
__turbopack_context__.s([
    "Header",
    ()=>Header
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const Header = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call Header() from the server but Header is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/layout/header.tsx", "Header");
}),
"[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/layout/header.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$components$2f$layout$2f$header$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/layout/header.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$components$2f$layout$2f$header$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/layout/header.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$components$2f$layout$2f$header$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/layout/index.ts [app-rsc] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$components$2f$layout$2f$app$2d$shell$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/layout/app-shell.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$components$2f$layout$2f$sidebar$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/layout/sidebar.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$components$2f$layout$2f$header$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/layout/header.tsx [app-rsc] (ecmascript)");
;
;
;
}),
"[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/layout.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AppLayout
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/node_modules/next/dist/api/navigation.react-server.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/node_modules/next/dist/client/components/navigation.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2d$auth$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/node_modules/next-auth/index.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/lib/auth.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$components$2f$layout$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/layout/index.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$components$2f$layout$2f$app$2d$shell$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/layout/app-shell.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$components$2f$providers$2f$index$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/components/providers/index.tsx [app-rsc] (ecmascript)");
;
;
;
;
;
;
async function AppLayout({ children }) {
    const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2d$auth$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getServerSession"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["authOptions"]);
    if (!session?.user) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])("/signin");
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$components$2f$providers$2f$index$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Providers"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Optiq$2f$CascadeProjects$2f$windsurf$2d$project$2f$apps$2f$frontend$2f$src$2f$components$2f$layout$2f$app$2d$shell$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["AppShell"], {
            children: children
        }, void 0, false, {
            fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/layout.tsx",
            lineNumber: 21,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/app/layout.tsx",
        lineNumber: 20,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__30600518._.js.map