/**
 * Pricing & Plan Types
 *
 * Tiered pricing with usage-based overages:
 * - Starter: 1 workspace, 2 connectors, 10k events/mo, basic attribution, 14-day retention
 * - Growth: 3 workspaces, all connectors, 100k events/mo, all attribution, alerts, 90-day retention
 * - Scale: unlimited workspaces, 1M+ events/mo, custom lookback, SSO, priority support, 365-day retention
 */
export type PlanTier = "FREE" | "STARTER" | "GROWTH" | "SCALE";
export type AttributionModel = "FIRST_TOUCH" | "LAST_TOUCH" | "LINEAR" | "TIME_DECAY" | "POSITION_BASED" | "DATA_DRIVEN";
export interface PlanLimits {
    maxWorkspaces: number;
    maxConnectors: number;
    monthlyEventLimit: number;
    dataRetentionDays: number;
    attributionModels: AttributionModel[];
    alertsEnabled: boolean;
    ssoEnabled: boolean;
    prioritySupport: boolean;
}
export interface PlanPricing {
    monthlyPriceCents: number;
    annualPriceCents: number;
    overageEventsPer10kCents: number;
    overageConnectorCents: number;
}
export interface PlanDefinition {
    tier: PlanTier;
    name: string;
    description: string;
    limits: PlanLimits;
    pricing: PlanPricing;
    features: string[];
    recommended?: boolean;
}
export declare const PLAN_DEFINITIONS: Record<PlanTier, PlanDefinition>;
export declare function getPlanDefinition(tier: PlanTier): PlanDefinition;
export declare function getPlanLimits(tier: PlanTier): PlanLimits;
export declare function isUnlimited(value: number): boolean;
export interface UsageSummary {
    trackedEvents: number;
    connectedAccounts: number;
    workspacesUsed: number;
}
export interface OverageCalculation {
    eventsOverage: number;
    connectorsOverage: number;
    eventsOverageCents: number;
    connectorsOverageCents: number;
    totalOverageCents: number;
}
export declare function calculateOverages(usage: UsageSummary, limits: PlanLimits, pricing: PlanPricing): OverageCalculation;
export interface LimitCheckResult {
    withinLimits: boolean;
    violations: string[];
}
export declare function checkLimits(usage: UsageSummary, limits: PlanLimits): LimitCheckResult;
export declare function canUpgrade(currentTier: PlanTier, targetTier: PlanTier): boolean;
export declare function canDowngrade(currentTier: PlanTier, targetTier: PlanTier): boolean;
export declare function getUpgradePath(currentTier: PlanTier): PlanTier | null;
//# sourceMappingURL=types.d.ts.map