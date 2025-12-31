/**
 * Pricing & Plan Types
 *
 * Tiered pricing with usage-based overages:
 * - Starter: 1 workspace, 2 connectors, 10k events/mo, basic attribution, 14-day retention
 * - Growth: 3 workspaces, all connectors, 100k events/mo, all attribution, alerts, 90-day retention
 * - Scale: unlimited workspaces, 1M+ events/mo, custom lookback, SSO, priority support, 365-day retention
 */
export const PLAN_DEFINITIONS = {
    FREE: {
        tier: "FREE",
        name: "Free",
        description: "Perfect for testing and small projects",
        limits: {
            maxWorkspaces: 1,
            maxConnectors: 1,
            monthlyEventLimit: 5_000,
            dataRetentionDays: 14,
            attributionModels: ["LAST_TOUCH"],
            alertsEnabled: false,
            ssoEnabled: false,
            prioritySupport: false,
        },
        pricing: {
            monthlyPriceCents: 0,
            annualPriceCents: 0,
            overageEventsPer10kCents: 0,
            overageConnectorCents: 0,
        },
        features: [
            "1 workspace",
            "1 ad platform connector",
            "5,000 events/month",
            "Last-touch attribution only",
            "14-day data retention",
            "Community support",
            "Basic dashboards",
        ],
    },
    STARTER: {
        tier: "STARTER",
        name: "Starter",
        description: "For small businesses scaling their ad spend",
        limits: {
            maxWorkspaces: 2,
            maxConnectors: 3,
            monthlyEventLimit: 50_000,
            dataRetentionDays: 30,
            attributionModels: ["FIRST_TOUCH", "LAST_TOUCH", "LINEAR"],
            alertsEnabled: true,
            ssoEnabled: false,
            prioritySupport: false,
        },
        pricing: {
            monthlyPriceCents: 19900,
            annualPriceCents: 199000,
            overageEventsPer10kCents: 400,
            overageConnectorCents: 2000,
        },
        features: [
            "2 workspaces",
            "3 ad platform connectors (Google, Meta, TikTok)",
            "50,000 events/month",
            "Multi-touch attribution (First, Last, Linear)",
            "30-day data retention",
            "Waste detection & alerts",
            "Email support (24-48hr response)",
            "Advanced dashboards & reports",
        ],
    },
    GROWTH: {
        tier: "GROWTH",
        name: "Growth",
        description: "For growing teams optimizing ROI across channels",
        limits: {
            maxWorkspaces: 5,
            maxConnectors: -1,
            monthlyEventLimit: 250_000,
            dataRetentionDays: 90,
            attributionModels: [
                "FIRST_TOUCH",
                "LAST_TOUCH",
                "LINEAR",
                "TIME_DECAY",
                "POSITION_BASED",
            ],
            alertsEnabled: true,
            ssoEnabled: false,
            prioritySupport: false,
        },
        pricing: {
            monthlyPriceCents: 39900,
            annualPriceCents: 399000,
            overageEventsPer10kCents: 300,
            overageConnectorCents: 0,
        },
        features: [
            "5 workspaces",
            "Unlimited ad platform connectors",
            "250,000 events/month",
            "All attribution models (5 models)",
            "90-day data retention",
            "Advanced waste detection & CPA alerts",
            "Customer journey tracking",
            "Priority email support (12hr response)",
            "Custom reports & exports",
            "API access",
        ],
        recommended: true,
    },
    SCALE: {
        tier: "SCALE",
        name: "Enterprise",
        description: "For agencies and enterprises with complex needs",
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
                "DATA_DRIVEN",
            ],
            alertsEnabled: true,
            ssoEnabled: true,
            prioritySupport: true,
        },
        pricing: {
            monthlyPriceCents: 99900,
            annualPriceCents: 999000,
            overageEventsPer10kCents: 200,
            overageConnectorCents: 0,
        },
        features: [
            "Unlimited workspaces",
            "Unlimited connectors",
            "1,000,000+ events/month",
            "All attribution models + AI-driven",
            "365-day data retention",
            "Custom lookback windows",
            "Advanced customer journey mapping",
            "SSO/SAML authentication",
            "Dedicated account manager",
            "Priority support (4hr response, phone/Slack)",
            "SLA guarantee (99.9% uptime)",
            "Custom integrations",
            "White-label options",
        ],
    },
};
export function getPlanDefinition(tier) {
    return PLAN_DEFINITIONS[tier];
}
export function getPlanLimits(tier) {
    return PLAN_DEFINITIONS[tier].limits;
}
export function isUnlimited(value) {
    return value === -1;
}
export function calculateOverages(usage, limits, pricing) {
    const eventsOverage = Math.max(0, usage.trackedEvents - limits.monthlyEventLimit);
    const connectorsOverage = isUnlimited(limits.maxConnectors)
        ? 0
        : Math.max(0, usage.connectedAccounts - limits.maxConnectors);
    const eventsOverageUnits = Math.ceil(eventsOverage / 10_000);
    const eventsOverageCents = eventsOverageUnits * pricing.overageEventsPer10kCents;
    const connectorsOverageCents = connectorsOverage * pricing.overageConnectorCents;
    return {
        eventsOverage,
        connectorsOverage,
        eventsOverageCents,
        connectorsOverageCents,
        totalOverageCents: eventsOverageCents + connectorsOverageCents,
    };
}
export function checkLimits(usage, limits) {
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
        violations,
    };
}
export function canUpgrade(currentTier, targetTier) {
    const tierOrder = ["FREE", "STARTER", "GROWTH", "SCALE"];
    return tierOrder.indexOf(targetTier) > tierOrder.indexOf(currentTier);
}
export function canDowngrade(currentTier, targetTier) {
    const tierOrder = ["FREE", "STARTER", "GROWTH", "SCALE"];
    return tierOrder.indexOf(targetTier) < tierOrder.indexOf(currentTier);
}
export function getUpgradePath(currentTier) {
    const tierOrder = ["FREE", "STARTER", "GROWTH", "SCALE"];
    const currentIndex = tierOrder.indexOf(currentTier);
    if (currentIndex < tierOrder.length - 1) {
        return tierOrder[currentIndex + 1];
    }
    return null;
}
//# sourceMappingURL=types.js.map