/**
 * Alert Evaluator
 * 
 * Evaluates alert rules and creates AlertEvent records
 */

import "server-only";
import { prisma } from "@/lib/prisma";
import { appLogger } from "@/lib/observability";
import type { AlertSeverity } from "@prisma/client";

export interface AlertEvaluationResult {
  alertsTriggered: number;
  alertsEvaluated: number;
  errors: number;
}

/**
 * Evaluate CPA_SPIKE alerts
 * Triggers when CPA exceeds organization target by X%
 */
export async function evaluateCpaSpike(
  organizationId: string,
  dateRange: { from: Date; to: Date }
): Promise<number> {
  const logger = appLogger.child({ alert: "cpa-spike" });
  let alertsTriggered = 0;

  // Get organization settings
  const settings = await prisma.organizationSettings.findUnique({
    where: { organizationId },
  });

  if (!settings?.trackingSettings) {
    logger.debug("No tracking settings found", { organizationId });
    return 0;
  }

  const trackingSettings = settings.trackingSettings as any;
  const targetCpa = trackingSettings?.targetCpa;

  if (!targetCpa) {
    logger.debug("No target CPA configured", { organizationId });
    return 0;
  }

  // Get recent rollups with CPA data
  const rollups = await prisma.dailyRollup.findMany({
    where: {
      organizationId,
      date: {
        gte: dateRange.from,
        lte: dateRange.to,
      },
      grain: "CAMPAIGN", // Evaluate at campaign level
      cpa: { not: null },
      conversions: { gt: 0 }, // Only campaigns with conversions
    },
    include: {
      campaign: {
        select: { name: true },
      },
      platform: {
        select: { name: true },
      },
    },
  });

  for (const rollup of rollups) {
    if (!rollup.cpa) continue;

    const cpaExceedance = ((rollup.cpa - targetCpa) / targetCpa) * 100;

    // Determine severity based on exceedance
    let severity: AlertSeverity | null = null;
    let thresholdPct = 0;

    if (cpaExceedance > 100) {
      severity = "CRITICAL"; // >100% over target
      thresholdPct = 100;
    } else if (cpaExceedance > 50) {
      severity = "WARNING"; // >50% over target
      thresholdPct = 50;
    } else if (cpaExceedance > 25) {
      severity = "INFO"; // >25% over target
      thresholdPct = 25;
    }

    if (severity) {
      // Create alert event
      const created = await createAlertEvent({
        organizationId,
        type: "CPA_SPIKE",
        severity,
        title: `CPA Spike: ${rollup.campaign?.name || "Unknown Campaign"}`,
        message: `CPA of $${rollup.cpa.toFixed(2)} is ${cpaExceedance.toFixed(0)}% above target of $${targetCpa.toFixed(2)}`,
        context: {
          campaignId: rollup.campaignId,
          campaignName: rollup.campaign?.name,
          platformName: rollup.platform?.name,
          actualCpa: rollup.cpa,
          targetCpa,
          exceedancePct: cpaExceedance,
          thresholdPct,
          date: rollup.date.toISOString(),
          spend: Number(rollup.spendMicros) / 1_000_000,
          conversions: rollup.conversions,
        },
        dedupeKey: `cpa-spike-${rollup.campaignId}-${rollup.date.toISOString().split("T")[0]}`,
      });

      if (created) {
        alertsTriggered++;
        logger.info("CPA spike alert triggered", {
          campaignId: rollup.campaignId,
          cpa: rollup.cpa,
          targetCpa,
          exceedancePct: cpaExceedance,
        });
      }
    }
  }

  return alertsTriggered;
}

/**
 * Evaluate SPEND_THRESHOLD alerts
 * Triggers when spend exceeds threshold with zero conversions
 */
export async function evaluateSpendThreshold(
  organizationId: string,
  dateRange: { from: Date; to: Date }
): Promise<number> {
  const logger = appLogger.child({ alert: "spend-threshold" });
  let alertsTriggered = 0;

  // Get recent rollups with spend but no conversions
  const rollups = await prisma.dailyRollup.findMany({
    where: {
      organizationId,
      date: {
        gte: dateRange.from,
        lte: dateRange.to,
      },
      grain: "CAMPAIGN",
      conversions: 0,
      spendMicros: { gt: 0 },
    },
    include: {
      campaign: {
        select: { name: true },
      },
      platform: {
        select: { name: true },
      },
    },
  });

  for (const rollup of rollups) {
    const spendDollars = Number(rollup.spendMicros) / 1_000_000;

    // Determine severity based on spend amount
    let severity: AlertSeverity | null = null;
    let threshold = 0;

    if (spendDollars > 1000) {
      severity = "CRITICAL"; // >$1000 with no conversions
      threshold = 1000;
    } else if (spendDollars > 500) {
      severity = "WARNING"; // >$500 with no conversions
      threshold = 500;
    } else if (spendDollars > 100) {
      severity = "INFO"; // >$100 with no conversions
      threshold = 100;
    }

    if (severity) {
      // Create alert event
      const created = await createAlertEvent({
        organizationId,
        type: "SPEND_THRESHOLD",
        severity,
        title: `Wasted Spend: ${rollup.campaign?.name || "Unknown Campaign"}`,
        message: `Spent $${spendDollars.toFixed(2)} with zero conversions`,
        context: {
          campaignId: rollup.campaignId,
          campaignName: rollup.campaign?.name,
          platformName: rollup.platform?.name,
          spend: spendDollars,
          threshold,
          conversions: 0,
          date: rollup.date.toISOString(),
        },
        dedupeKey: `spend-threshold-${rollup.campaignId}-${rollup.date.toISOString().split("T")[0]}`,
      });

      if (created) {
        alertsTriggered++;
        logger.info("Spend threshold alert triggered", {
          campaignId: rollup.campaignId,
          spend: spendDollars,
          threshold,
        });
      }
    }
  }

  return alertsTriggered;
}

/**
 * Create alert event with deduplication
 */
async function createAlertEvent(params: {
  organizationId: string;
  type: string;
  severity: AlertSeverity;
  title: string;
  message: string;
  context: any;
  dedupeKey: string;
}): Promise<boolean> {
  const { organizationId, type, severity, title, message, context, dedupeKey } = params;

  // Check if alert already exists (within last 24 hours)
  const existingAlert = await prisma.alertEvent.findFirst({
    where: {
      organizationId,
      title,
      status: { in: ["TRIGGERED", "ACKNOWLEDGED"] },
      triggeredAt: {
        gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
      },
    },
  });

  if (existingAlert) {
    // Alert already exists, skip
    return false;
  }

  // Get or create alert rule
  let alertRule = await prisma.alertRule.findFirst({
    where: {
      organizationId,
      type: type as any,
      status: "ACTIVE",
    },
  });

  if (!alertRule) {
    // Create default alert rule
    alertRule = await prisma.alertRule.create({
      data: {
        organizationId,
        name: `${type} Alert`,
        type: type as any,
        severity,
        status: "ACTIVE",
        config: {},
      },
    });
  }

  // Create alert event
  await prisma.alertEvent.create({
    data: {
      organizationId,
      alertRuleId: alertRule.id,
      severity,
      title,
      message,
      context,
      status: "TRIGGERED",
    },
  });

  return true;
}

/**
 * Run all alert evaluations
 */
export async function runAlertEvaluation(
  organizationId?: string
): Promise<AlertEvaluationResult> {
  const logger = appLogger.child({ job: "alert-evaluation" });
  
  let alertsTriggered = 0;
  let alertsEvaluated = 0;
  let errors = 0;

  // Date range: last 7 days
  const toDate = new Date();
  const fromDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  try {
    // Get organizations to evaluate
    const organizations = await prisma.organization.findMany({
      where: organizationId ? { id: organizationId } : {},
      select: { id: true },
    });

    for (const org of organizations) {
      try {
        // Evaluate CPA spike alerts
        const cpaAlerts = await evaluateCpaSpike(org.id, { from: fromDate, to: toDate });
        alertsTriggered += cpaAlerts;
        alertsEvaluated++;

        // Evaluate spend threshold alerts
        const spendAlerts = await evaluateSpendThreshold(org.id, { from: fromDate, to: toDate });
        alertsTriggered += spendAlerts;
        alertsEvaluated++;
      } catch (error) {
        errors++;
        logger.error("Failed to evaluate alerts for organization", {
          organizationId: org.id,
          error: error as Error,
        });
      }
    }

    logger.info("Alert evaluation completed", {
      alertsTriggered,
      alertsEvaluated,
      errors,
    });
  } catch (error) {
    logger.error("Alert evaluation failed", error as Error);
    throw error;
  }

  return {
    alertsTriggered,
    alertsEvaluated,
    errors,
  };
}
