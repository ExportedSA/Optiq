/**
 * Waste Explainability
 * 
 * Generates explainability JSON for waste flags
 */

import "server-only";
import type { AttributionModel, RollupGrain } from "@prisma/client";

export interface WasteExplanation {
  reason: "no_conversions" | "low_roas" | "high_cpa";
  period: {
    startDate: string;
    endDate: string;
  };
  metrics: {
    spend: number; // In dollars
    conversions: number;
    cpa?: number;
    roas?: number;
    targetCpa?: number;
    targetRoas?: number;
  };
  attribution: {
    model: AttributionModel;
  };
  thresholds: {
    minConversions?: number;
    maxCpa?: number;
    minRoas?: number;
  };
  severity: "low" | "medium" | "high";
  recommendations: string[];
}

export interface WasteEntity {
  id: string;
  type: "organization" | "platform" | "campaign" | "adset" | "ad";
  name: string;
  grain: RollupGrain;
  date: Date;
  wasteSpend: number; // In dollars
  totalSpend: number; // In dollars
  wastePct: number;
  explanation: WasteExplanation;
}

/**
 * Generate waste explanation for a rollup
 */
export function generateWasteExplanation(params: {
  date: Date;
  spendMicros: bigint;
  conversions: number;
  cpa: number | null;
  roas: number | null;
  attributionModel: AttributionModel;
  targetCpa?: number;
  targetRoas?: number;
}): WasteExplanation {
  const {
    date,
    spendMicros,
    conversions,
    cpa,
    roas,
    attributionModel,
    targetCpa,
    targetRoas,
  } = params;

  const spend = Number(spendMicros) / 1_000_000;

  // Determine reason and severity
  let reason: WasteExplanation["reason"];
  let severity: WasteExplanation["severity"];
  const recommendations: string[] = [];

  if (conversions === 0) {
    reason = "no_conversions";
    
    if (spend > 1000) {
      severity = "high";
      recommendations.push("Pause this campaign immediately to stop wasting budget");
      recommendations.push("Review targeting and ad creative");
      recommendations.push("Consider A/B testing different audiences");
    } else if (spend > 100) {
      severity = "medium";
      recommendations.push("Monitor closely - consider pausing if no conversions within 24 hours");
      recommendations.push("Review landing page experience");
    } else {
      severity = "low";
      recommendations.push("Give it more time to gather data");
      recommendations.push("Ensure tracking is properly configured");
    }
  } else if (targetCpa && cpa && cpa > targetCpa) {
    reason = "high_cpa";
    const cpaDiff = ((cpa - targetCpa) / targetCpa) * 100;
    
    if (cpaDiff > 100) {
      severity = "high";
      recommendations.push(`CPA is ${cpaDiff.toFixed(0)}% above target - pause immediately`);
      recommendations.push("Review bid strategy and targeting");
    } else if (cpaDiff > 50) {
      severity = "medium";
      recommendations.push(`CPA is ${cpaDiff.toFixed(0)}% above target`);
      recommendations.push("Lower bids or tighten targeting");
    } else {
      severity = "low";
      recommendations.push(`CPA is ${cpaDiff.toFixed(0)}% above target`);
      recommendations.push("Monitor and optimize gradually");
    }
  } else if (targetRoas && roas && roas < targetRoas) {
    reason = "low_roas";
    const roasDiff = ((targetRoas - roas) / targetRoas) * 100;
    
    if (roasDiff > 50) {
      severity = "high";
      recommendations.push(`ROAS is ${roasDiff.toFixed(0)}% below target`);
      recommendations.push("Pause low-performing ad sets");
      recommendations.push("Focus budget on high-ROAS campaigns");
    } else if (roasDiff > 25) {
      severity = "medium";
      recommendations.push(`ROAS is ${roasDiff.toFixed(0)}% below target`);
      recommendations.push("Optimize for higher-value conversions");
    } else {
      severity = "low";
      recommendations.push(`ROAS is ${roasDiff.toFixed(0)}% below target`);
      recommendations.push("Continue monitoring performance");
    }
  } else {
    // Default to no_conversions if no other reason
    reason = "no_conversions";
    severity = "low";
    recommendations.push("No specific issues detected");
  }

  return {
    reason,
    period: {
      startDate: date.toISOString().split("T")[0],
      endDate: date.toISOString().split("T")[0],
    },
    metrics: {
      spend,
      conversions,
      cpa: cpa || undefined,
      roas: roas || undefined,
      targetCpa,
      targetRoas,
    },
    attribution: {
      model: attributionModel,
    },
    thresholds: {
      minConversions: 1,
      maxCpa: targetCpa,
      minRoas: targetRoas,
    },
    severity,
    recommendations,
  };
}

/**
 * Calculate waste severity score (0-100)
 */
export function calculateWasteSeverity(
  wasteSpend: number,
  totalSpend: number,
  wastePct: number
): number {
  // Factors:
  // 1. Absolute waste amount (0-40 points)
  // 2. Waste percentage (0-40 points)
  // 3. Total spend (0-20 points - higher spend = more severe)

  let score = 0;

  // Absolute waste amount
  if (wasteSpend > 10000) score += 40;
  else if (wasteSpend > 1000) score += 30;
  else if (wasteSpend > 100) score += 20;
  else if (wasteSpend > 10) score += 10;

  // Waste percentage
  if (wastePct > 90) score += 40;
  else if (wastePct > 75) score += 30;
  else if (wastePct > 50) score += 20;
  else if (wastePct > 25) score += 10;

  // Total spend (higher spend = more important to fix)
  if (totalSpend > 10000) score += 20;
  else if (totalSpend > 1000) score += 15;
  else if (totalSpend > 100) score += 10;
  else if (totalSpend > 10) score += 5;

  return Math.min(100, score);
}

/**
 * Get severity level from score
 */
export function getSeverityLevel(score: number): "low" | "medium" | "high" {
  if (score >= 70) return "high";
  if (score >= 40) return "medium";
  return "low";
}
