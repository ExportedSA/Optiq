import "server-only";

export type WasteLevel = "none" | "low" | "medium" | "high" | "critical";

export type WasteReason =
  | "zero_conversions_high_spend"
  | "cpa_above_target"
  | "low_ctr_high_spend"
  | "declining_performance";

export type EntityType = "ad_account" | "campaign" | "ad";

export interface WasteConfig {
  spendThresholdMicros: bigint;
  targetCpaMicros: bigint;
  cpaTolerancePercent: number;
  minImpressions: number;
  minCtrPercent: number;
  rollingWindowDays: number;
}

export interface WasteAlert {
  id: string;
  entityType: EntityType;
  entityId: string;
  entityName: string;
  organizationId: string;
  platformCode: string;
  reason: WasteReason;
  level: WasteLevel;
  spendMicros: bigint;
  conversions: number;
  cpa: number | null;
  targetCpa: number | null;
  windowStart: Date;
  windowEnd: Date;
  message: string;
  recommendation: string;
}

export interface WasteAnalysis {
  organizationId: string;
  windowStart: Date;
  windowEnd: Date;
  totalWastedSpendMicros: bigint;
  alerts: WasteAlert[];
  byLevel: Record<WasteLevel, number>;
  byReason: Record<WasteReason, number>;
  byEntityType: Record<EntityType, number>;
}

export interface AggregatedMetrics {
  entityId: string;
  entityName: string;
  entityType: EntityType;
  platformCode: string;
  impressions: bigint;
  clicks: bigint;
  spendMicros: bigint;
  conversions: bigint;
  revenueMicros: bigint;
}

export const DEFAULT_WASTE_CONFIG: WasteConfig = {
  spendThresholdMicros: BigInt(50_000_000),
  targetCpaMicros: BigInt(25_000_000),
  cpaTolerancePercent: 50,
  minImpressions: 1000,
  minCtrPercent: 0.5,
  rollingWindowDays: 7,
};

export function microsToDollars(micros: bigint): number {
  return Number(micros) / 1_000_000;
}

export function dollarsToMicros(dollars: number): bigint {
  return BigInt(Math.round(dollars * 1_000_000));
}

export function computeCpa(spendMicros: bigint, conversions: bigint): number | null {
  if (conversions === BigInt(0)) return null;
  return Number(spendMicros) / Number(conversions);
}

export function computeCtr(clicks: bigint, impressions: bigint): number {
  if (impressions === BigInt(0)) return 0;
  return (Number(clicks) / Number(impressions)) * 100;
}

export function determineWasteLevel(
  spendMicros: bigint,
  config: WasteConfig,
  reason: WasteReason
): WasteLevel {
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
