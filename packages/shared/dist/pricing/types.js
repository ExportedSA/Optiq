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
        description: "Get started with basic tracking",
        limits: {
            maxWorkspaces: 1,
            maxConnectors: 1,
            monthlyEventLimit: 1000,
            dataRetentionDays: 7,
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
            "1,000 events/month",
            "Last-touch attribution",
            "7-day data retention",
        ],
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
            attributionModels: ["FIRST_TOUCH", "LAST_TOUCH", "LINEAR"],
            alertsEnabled: false,
            ssoEnabled: false,
            prioritySupport: false,
        },
        pricing: {
            monthlyPriceCents: 4900,
            annualPriceCents: 47000,
            overageEventsPer10kCents: 500,
            overageConnectorCents: 1500,
        },
        features: [
            "1 workspace",
            "2 ad platform connectors",
            "10,000 events/month",
            "First, last & linear attribution",
            "14-day data retention",
            "Email support",
        ],
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
                "POSITION_BASED",
            ],
            alertsEnabled: true,
            ssoEnabled: false,
            prioritySupport: false,
        },
        pricing: {
            monthlyPriceCents: 14900,
            annualPriceCents: 143000,
            overageEventsPer10kCents: 400,
            overageConnectorCents: 1000,
        },
        features: [
            "3 workspaces",
            "All ad platform connectors",
            "100,000 events/month",
            "All attribution models",
            "90-day data retention",
            "Waste & CPA alerts",
            "Priority email support",
        ],
        recommended: true,
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
                "DATA_DRIVEN",
            ],
            alertsEnabled: true,
            ssoEnabled: true,
            prioritySupport: true,
        },
        pricing: {
            monthlyPriceCents: 49900,
            annualPriceCents: 479000,
            overageEventsPer10kCents: 300,
            overageConnectorCents: 500,
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
            "SLA guarantee",
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