/**
 * Alerts Engine Job
 * 
 * Evaluates rollups against workspace targets and creates alert events.
 * 
 * Features:
 * - Evaluates CPA, ROAS, spend thresholds against targets
 * - Detects anomalies (sudden drops, spikes)
 * - Creates AlertEvent records for breaches
 * - Deduplicates alerts (no spam within cooldown period)
 * - Supports multiple alert rule types
 */

import { prisma } from "@/lib/prisma";
import { appLogger } from "@/lib/observability";

export interface AlertsEngineResult {
  startedAt: Date;
  completedAt: Date;
  organizationsProcessed: number;
  rulesEvaluated: number;
  alertsCreated: number;
  alertsSkipped: number;
}

export interface AlertsEngineOptions {
  /** Specific organization to process */
  organizationId?: string;
  /** Number of days to look back for rollups */
  lookbackDays?: number;
  /** Force evaluation even if recently evaluated */
  force?: boolean;
}

const DEFAULT_LOOKBACK_DAYS = 7;
const ALERT_COOLDOWN_HOURS = 24; // Don't create duplicate alerts within this period
const MICROS_PER_UNIT = 1_000_000;

/**
 * Run the alerts engine
 */
export async function runAlertsEngine(options?: AlertsEngineOptions): Promise<AlertsEngineResult> {
  const logger = appLogger.child({ job: "alerts-engine" });
  const startedAt = new Date();

  const lookbackDays = options?.lookbackDays ?? DEFAULT_LOOKBACK_DAYS;

  logger.info("Starting alerts engine", {
    lookbackDays,
    organizationId: options?.organizationId,
  });

  let organizationsProcessed = 0;
  let rulesEvaluated = 0;
  let alertsCreated = 0;
  let alertsSkipped = 0;

  // Get organizations to process
  const organizations = await prisma.organization.findMany({
    where: options?.organizationId ? { id: options.organizationId } : {},
    include: {
      settings: true,
      subscription: true,
    },
  });

  for (const org of organizations) {
    // Check if alerts are enabled for this plan
    const alertsEnabled = org.subscription?.alertsEnabled ?? false;
    if (!alertsEnabled && !options?.force) {
      logger.debug(`Alerts not enabled for org ${org.id}, skipping`);
      continue;
    }

    organizationsProcessed++;

    // Get alert settings from organization settings
    const alertSettings = (org.settings?.alertSettings as AlertSettings) ?? getDefaultAlertSettings();
    const trackingSettings = (org.settings?.trackingSettings as TrackingSettings) ?? {};

    // Get active alert rules for this organization
    const alertRules = await prisma.alertRule.findMany({
      where: {
        organizationId: org.id,
        status: "ACTIVE",
      },
    });

    // If no custom rules, use default rules based on settings
    const rulesToEvaluate = alertRules.length > 0 
      ? alertRules 
      : createDefaultRules(org.id, alertSettings, trackingSettings);

    for (const rule of rulesToEvaluate) {
      rulesEvaluated++;

      try {
        const result = await evaluateRule(org.id, rule, lookbackDays, logger);
        alertsCreated += result.created;
        alertsSkipped += result.skipped;

        // Update last evaluated timestamp
        if ('id' in rule && rule.id) {
          await prisma.alertRule.update({
            where: { id: rule.id },
            data: { lastEvaluatedAt: new Date() },
          });
        }
      } catch (error) {
        logger.error(`Failed to evaluate rule ${rule.type}`, error as Error, {
          organizationId: org.id,
        });
      }
    }
  }

  const completedAt = new Date();

  logger.info("Alerts engine completed", {
    organizationsProcessed,
    rulesEvaluated,
    alertsCreated,
    alertsSkipped,
    durationMs: completedAt.getTime() - startedAt.getTime(),
  });

  return {
    startedAt,
    completedAt,
    organizationsProcessed,
    rulesEvaluated,
    alertsCreated,
    alertsSkipped,
  };
}

interface AlertSettings {
  wasteDetection?: {
    enabled: boolean;
    thresholdLow: number;
    thresholdMedium: number;
    thresholdHigh: number;
  };
  cpaThreshold?: {
    enabled: boolean;
    targetCpa: number;
    warningPercent: number;
    criticalPercent: number;
  };
  performanceDrop?: {
    enabled: boolean;
    conversionDropThreshold: number;
    comparisonWindow: number;
  };
  frequency?: string;
  channels?: {
    inApp: boolean;
    email: boolean;
  };
}

interface TrackingSettings {
  targetCpa?: number;
  targetRoas?: number;
}

interface RuleConfig {
  type: string;
  severity: "INFO" | "WARNING" | "CRITICAL";
  config: Record<string, unknown>;
}

function getDefaultAlertSettings(): AlertSettings {
  return {
    wasteDetection: {
      enabled: true,
      thresholdLow: 50,
      thresholdMedium: 200,
      thresholdHigh: 500,
    },
    cpaThreshold: {
      enabled: true,
      targetCpa: 50,
      warningPercent: 20,
      criticalPercent: 50,
    },
    performanceDrop: {
      enabled: true,
      conversionDropThreshold: 30,
      comparisonWindow: 7,
    },
    frequency: "daily",
    channels: {
      inApp: true,
      email: false,
    },
  };
}

function createDefaultRules(
  organizationId: string,
  alertSettings: AlertSettings,
  trackingSettings: TrackingSettings
): RuleConfig[] {
  const rules: RuleConfig[] = [];

  // CPA threshold rule
  if (alertSettings.cpaThreshold?.enabled) {
    const targetCpa = trackingSettings.targetCpa ?? alertSettings.cpaThreshold.targetCpa ?? 50;
    rules.push({
      type: "CPA_SPIKE",
      severity: "WARNING",
      config: {
        targetCpa,
        warningThreshold: targetCpa * (1 + (alertSettings.cpaThreshold.warningPercent ?? 20) / 100),
        criticalThreshold: targetCpa * (1 + (alertSettings.cpaThreshold.criticalPercent ?? 50) / 100),
      },
    });
  }

  // ROAS drop rule
  if (trackingSettings.targetRoas) {
    rules.push({
      type: "ROAS_DROP",
      severity: "WARNING",
      config: {
        targetRoas: trackingSettings.targetRoas,
        warningThreshold: trackingSettings.targetRoas * 0.8,
        criticalThreshold: trackingSettings.targetRoas * 0.5,
      },
    });
  }

  // Waste detection rule
  if (alertSettings.wasteDetection?.enabled) {
    rules.push({
      type: "SPEND_THRESHOLD",
      severity: "WARNING",
      config: {
        thresholdLow: alertSettings.wasteDetection.thresholdLow,
        thresholdMedium: alertSettings.wasteDetection.thresholdMedium,
        thresholdHigh: alertSettings.wasteDetection.thresholdHigh,
      },
    });
  }

  // Conversion drop rule
  if (alertSettings.performanceDrop?.enabled) {
    rules.push({
      type: "CONVERSION_DROP",
      severity: "WARNING",
      config: {
        dropThreshold: alertSettings.performanceDrop.conversionDropThreshold,
        comparisonWindow: alertSettings.performanceDrop.comparisonWindow,
      },
    });
  }

  return rules;
}

async function evaluateRule(
  organizationId: string,
  rule: RuleConfig | { id: string; type: string; severity: string; config: unknown },
  lookbackDays: number,
  logger: typeof appLogger
): Promise<{ created: number; skipped: number }> {
  const ruleType = rule.type;
  const config = (typeof rule.config === 'object' ? rule.config : {}) as Record<string, unknown>;

  switch (ruleType) {
    case "CPA_SPIKE":
      return evaluateCpaRule(organizationId, rule, config, lookbackDays, logger);
    case "ROAS_DROP":
      return evaluateRoasRule(organizationId, rule, config, lookbackDays, logger);
    case "SPEND_THRESHOLD":
      return evaluateSpendRule(organizationId, rule, config, lookbackDays, logger);
    case "CONVERSION_DROP":
      return evaluateConversionDropRule(organizationId, rule, config, lookbackDays, logger);
    default:
      logger.warn(`Unknown rule type: ${ruleType}`);
      return { created: 0, skipped: 0 };
  }
}

/**
 * Evaluate CPA threshold rule
 */
async function evaluateCpaRule(
  organizationId: string,
  rule: RuleConfig | { id: string; type: string; severity: string; config: unknown },
  config: Record<string, unknown>,
  lookbackDays: number,
  logger: typeof appLogger
): Promise<{ created: number; skipped: number }> {
  let created = 0;
  let skipped = 0;

  const targetCpa = (config.targetCpa as number) ?? 50;
  const warningThreshold = (config.warningThreshold as number) ?? targetCpa * 1.2;
  const criticalThreshold = (config.criticalThreshold as number) ?? targetCpa * 1.5;

  // Get recent rollups at campaign level
  const endDate = new Date();
  const startDate = new Date(endDate.getTime() - lookbackDays * 24 * 60 * 60 * 1000);

  const rollups = await prisma.dailyRollup.findMany({
    where: {
      organizationId,
      grain: "campaign",
      date: { gte: startDate, lte: endDate },
      conversions: { gt: 0 },
    },
    include: {
      campaign: { select: { id: true, name: true } },
    },
  });

  // Group by campaign and calculate average CPA
  const campaignMetrics = new Map<string, { name: string; totalSpend: number; totalConversions: number }>();

  for (const rollup of rollups) {
    if (!rollup.campaignId) continue;

    const existing = campaignMetrics.get(rollup.campaignId) || {
      name: rollup.campaign?.name ?? "Unknown Campaign",
      totalSpend: 0,
      totalConversions: 0,
    };

    existing.totalSpend += Number(rollup.spendMicros) / MICROS_PER_UNIT;
    existing.totalConversions += rollup.conversions;
    campaignMetrics.set(rollup.campaignId, existing);
  }

  for (const [campaignId, metrics] of campaignMetrics) {
    if (metrics.totalConversions === 0) continue;

    const cpa = metrics.totalSpend / metrics.totalConversions;

    if (cpa > warningThreshold) {
      const severity = cpa > criticalThreshold ? "CRITICAL" : "WARNING";
      const result = await createAlertIfNotDuplicate(
        organizationId,
        rule,
        severity,
        `CPA Alert: ${metrics.name}`,
        `Campaign "${metrics.name}" has CPA of $${cpa.toFixed(2)} which exceeds target of $${targetCpa.toFixed(2)} (${((cpa / targetCpa - 1) * 100).toFixed(0)}% over)`,
        {
          campaignId,
          campaignName: metrics.name,
          cpa,
          targetCpa,
          threshold: cpa > criticalThreshold ? criticalThreshold : warningThreshold,
          spend: metrics.totalSpend,
          conversions: metrics.totalConversions,
        },
        logger
      );

      if (result.created) created++;
      else skipped++;
    }
  }

  return { created, skipped };
}

/**
 * Evaluate ROAS threshold rule
 */
async function evaluateRoasRule(
  organizationId: string,
  rule: RuleConfig | { id: string; type: string; severity: string; config: unknown },
  config: Record<string, unknown>,
  lookbackDays: number,
  logger: typeof appLogger
): Promise<{ created: number; skipped: number }> {
  let created = 0;
  let skipped = 0;

  const targetRoas = (config.targetRoas as number) ?? 3.0;
  const warningThreshold = (config.warningThreshold as number) ?? targetRoas * 0.8;
  const criticalThreshold = (config.criticalThreshold as number) ?? targetRoas * 0.5;

  const endDate = new Date();
  const startDate = new Date(endDate.getTime() - lookbackDays * 24 * 60 * 60 * 1000);

  const rollups = await prisma.dailyRollup.findMany({
    where: {
      organizationId,
      grain: "campaign",
      date: { gte: startDate, lte: endDate },
      spendMicros: { gt: 0 },
    },
    include: {
      campaign: { select: { id: true, name: true } },
    },
  });

  const campaignMetrics = new Map<string, { name: string; totalSpend: number; totalRevenue: number }>();

  for (const rollup of rollups) {
    if (!rollup.campaignId) continue;

    const existing = campaignMetrics.get(rollup.campaignId) || {
      name: rollup.campaign?.name ?? "Unknown Campaign",
      totalSpend: 0,
      totalRevenue: 0,
    };

    existing.totalSpend += Number(rollup.spendMicros) / MICROS_PER_UNIT;
    existing.totalRevenue += Number(rollup.conversionValue) / MICROS_PER_UNIT;
    campaignMetrics.set(rollup.campaignId, existing);
  }

  for (const [campaignId, metrics] of campaignMetrics) {
    if (metrics.totalSpend === 0) continue;

    const roas = metrics.totalRevenue / metrics.totalSpend;

    if (roas < warningThreshold) {
      const severity = roas < criticalThreshold ? "CRITICAL" : "WARNING";
      const result = await createAlertIfNotDuplicate(
        organizationId,
        rule,
        severity,
        `ROAS Alert: ${metrics.name}`,
        `Campaign "${metrics.name}" has ROAS of ${roas.toFixed(2)}x which is below target of ${targetRoas.toFixed(2)}x`,
        {
          campaignId,
          campaignName: metrics.name,
          roas,
          targetRoas,
          threshold: roas < criticalThreshold ? criticalThreshold : warningThreshold,
          spend: metrics.totalSpend,
          revenue: metrics.totalRevenue,
        },
        logger
      );

      if (result.created) created++;
      else skipped++;
    }
  }

  return { created, skipped };
}

/**
 * Evaluate spend threshold rule (waste detection)
 */
async function evaluateSpendRule(
  organizationId: string,
  rule: RuleConfig | { id: string; type: string; severity: string; config: unknown },
  config: Record<string, unknown>,
  lookbackDays: number,
  logger: typeof appLogger
): Promise<{ created: number; skipped: number }> {
  let created = 0;
  let skipped = 0;

  const thresholdHigh = (config.thresholdHigh as number) ?? 500;

  const endDate = new Date();
  const startDate = new Date(endDate.getTime() - lookbackDays * 24 * 60 * 60 * 1000);

  // Find campaigns with high spend but zero conversions
  const rollups = await prisma.dailyRollup.findMany({
    where: {
      organizationId,
      grain: "campaign",
      date: { gte: startDate, lte: endDate },
      conversions: 0,
    },
    include: {
      campaign: { select: { id: true, name: true } },
    },
  });

  const campaignSpend = new Map<string, { name: string; totalSpend: number }>();

  for (const rollup of rollups) {
    if (!rollup.campaignId) continue;

    const existing = campaignSpend.get(rollup.campaignId) || {
      name: rollup.campaign?.name ?? "Unknown Campaign",
      totalSpend: 0,
    };

    existing.totalSpend += Number(rollup.spendMicros) / MICROS_PER_UNIT;
    campaignSpend.set(rollup.campaignId, existing);
  }

  for (const [campaignId, metrics] of campaignSpend) {
    if (metrics.totalSpend >= thresholdHigh) {
      const result = await createAlertIfNotDuplicate(
        organizationId,
        rule,
        "CRITICAL",
        `Waste Alert: ${metrics.name}`,
        `Campaign "${metrics.name}" spent $${metrics.totalSpend.toFixed(2)} with zero conversions in the last ${lookbackDays} days`,
        {
          campaignId,
          campaignName: metrics.name,
          spend: metrics.totalSpend,
          conversions: 0,
          wasteType: "zero_conversions",
        },
        logger
      );

      if (result.created) created++;
      else skipped++;
    }
  }

  return { created, skipped };
}

/**
 * Evaluate conversion drop rule
 */
async function evaluateConversionDropRule(
  organizationId: string,
  rule: RuleConfig | { id: string; type: string; severity: string; config: unknown },
  config: Record<string, unknown>,
  lookbackDays: number,
  logger: typeof appLogger
): Promise<{ created: number; skipped: number }> {
  let created = 0;
  let skipped = 0;

  const dropThreshold = (config.dropThreshold as number) ?? 30; // 30% drop
  const comparisonWindow = (config.comparisonWindow as number) ?? 7;

  const endDate = new Date();
  const currentStart = new Date(endDate.getTime() - comparisonWindow * 24 * 60 * 60 * 1000);
  const previousStart = new Date(currentStart.getTime() - comparisonWindow * 24 * 60 * 60 * 1000);

  // Get current period conversions
  const currentRollups = await prisma.dailyRollup.findMany({
    where: {
      organizationId,
      grain: "organization",
      date: { gte: currentStart, lte: endDate },
    },
  });

  // Get previous period conversions
  const previousRollups = await prisma.dailyRollup.findMany({
    where: {
      organizationId,
      grain: "organization",
      date: { gte: previousStart, lt: currentStart },
    },
  });

  const currentConversions = currentRollups.reduce((sum, r) => sum + r.conversions, 0);
  const previousConversions = previousRollups.reduce((sum, r) => sum + r.conversions, 0);

  if (previousConversions > 0) {
    const dropPercent = ((previousConversions - currentConversions) / previousConversions) * 100;

    if (dropPercent >= dropThreshold) {
      const result = await createAlertIfNotDuplicate(
        organizationId,
        rule,
        dropPercent >= 50 ? "CRITICAL" : "WARNING",
        "Conversion Drop Alert",
        `Conversions dropped ${dropPercent.toFixed(0)}% compared to previous ${comparisonWindow} days (${currentConversions.toFixed(0)} vs ${previousConversions.toFixed(0)})`,
        {
          currentConversions,
          previousConversions,
          dropPercent,
          comparisonWindow,
        },
        logger
      );

      if (result.created) created++;
      else skipped++;
    }
  }

  return { created, skipped };
}

/**
 * Create alert if not a duplicate within cooldown period
 */
async function createAlertIfNotDuplicate(
  organizationId: string,
  rule: RuleConfig | { id: string; type: string; severity: string; config: unknown },
  severity: "INFO" | "WARNING" | "CRITICAL",
  title: string,
  message: string,
  context: Record<string, unknown>,
  logger: typeof appLogger
): Promise<{ created: boolean }> {
  const cooldownStart = new Date(Date.now() - ALERT_COOLDOWN_HOURS * 60 * 60 * 1000);

  // Check for recent duplicate
  const existingAlert = await prisma.alertEvent.findFirst({
    where: {
      organizationId,
      title,
      triggeredAt: { gte: cooldownStart },
      status: { in: ["TRIGGERED", "ACKNOWLEDGED"] },
    },
  });

  if (existingAlert) {
    logger.debug(`Skipping duplicate alert: ${title}`);
    return { created: false };
  }

  // Get or create alert rule
  let alertRuleId: string;

  if ('id' in rule && rule.id) {
    alertRuleId = rule.id;
  } else {
    // Find or create a default rule for this type
    const existingRule = await prisma.alertRule.findFirst({
      where: {
        organizationId,
        type: rule.type as any,
        status: "ACTIVE",
      },
    });

    if (existingRule) {
      alertRuleId = existingRule.id;
    } else {
      const newRule = await prisma.alertRule.create({
        data: {
          organizationId,
          name: `Auto: ${rule.type}`,
          type: rule.type as any,
          severity: severity as any,
          status: "ACTIVE",
          config: rule.config as any,
        },
      });
      alertRuleId = newRule.id;
    }
  }

  // Create the alert event
  await prisma.alertEvent.create({
    data: {
      organizationId,
      alertRuleId,
      status: "TRIGGERED",
      severity: severity as any,
      title,
      message,
      context: context as any,
      triggeredAt: new Date(),
    },
  });

  logger.info(`Created alert: ${title}`, { organizationId, severity });

  // Create in-app notification
  try {
    const members = await prisma.membership.findMany({
      where: { organizationId, role: { in: ["OWNER", "ADMIN"] } },
      select: { userId: true },
    });

    for (const member of members) {
      await prisma.inAppNotification.create({
        data: {
          organizationId,
          userId: member.userId,
          title,
          message,
          priority: severity === "CRITICAL" ? "high" : severity === "WARNING" ? "medium" : "normal",
          status: "pending",
          metadata: context as any,
        },
      });
    }
  } catch (error) {
    logger.warn("Failed to create in-app notifications", { error });
  }

  return { created: true };
}

/**
 * Get alert inbox for an organization
 */
export async function getAlertInbox(params: {
  organizationId: string;
  status?: ("TRIGGERED" | "ACKNOWLEDGED" | "RESOLVED" | "DISMISSED")[];
  severity?: ("INFO" | "WARNING" | "CRITICAL")[];
  limit?: number;
  offset?: number;
}): Promise<{
  alerts: Array<{
    id: string;
    title: string;
    message: string;
    severity: string;
    status: string;
    triggeredAt: Date;
    acknowledgedAt: Date | null;
    resolvedAt: Date | null;
    context: unknown;
    rule: { id: string; name: string; type: string } | null;
  }>;
  total: number;
}> {
  const where = {
    organizationId: params.organizationId,
    ...(params.status ? { status: { in: params.status } } : {}),
    ...(params.severity ? { severity: { in: params.severity } } : {}),
  };

  const [alerts, total] = await Promise.all([
    prisma.alertEvent.findMany({
      where,
      include: {
        alertRule: {
          select: { id: true, name: true, type: true },
        },
      },
      orderBy: { triggeredAt: "desc" },
      take: params.limit ?? 50,
      skip: params.offset ?? 0,
    }),
    prisma.alertEvent.count({ where }),
  ]);

  return {
    alerts: alerts.map((a) => ({
      id: a.id,
      title: a.title,
      message: a.message,
      severity: a.severity,
      status: a.status,
      triggeredAt: a.triggeredAt,
      acknowledgedAt: a.acknowledgedAt,
      resolvedAt: a.resolvedAt,
      context: a.context,
      rule: a.alertRule ? {
        id: a.alertRule.id,
        name: a.alertRule.name,
        type: a.alertRule.type,
      } : null,
    })),
    total,
  };
}

/**
 * Acknowledge an alert
 */
export async function acknowledgeAlert(params: {
  alertId: string;
  userId: string;
}): Promise<void> {
  await prisma.alertEvent.update({
    where: { id: params.alertId },
    data: {
      status: "ACKNOWLEDGED",
      acknowledgedAt: new Date(),
      acknowledgedBy: params.userId,
    },
  });
}

/**
 * Resolve an alert
 */
export async function resolveAlert(params: {
  alertId: string;
  userId: string;
}): Promise<void> {
  await prisma.alertEvent.update({
    where: { id: params.alertId },
    data: {
      status: "RESOLVED",
      resolvedAt: new Date(),
      resolvedBy: params.userId,
    },
  });
}

/**
 * Dismiss an alert
 */
export async function dismissAlert(params: {
  alertId: string;
  userId: string;
}): Promise<void> {
  await prisma.alertEvent.update({
    where: { id: params.alertId },
    data: {
      status: "DISMISSED",
      dismissedAt: new Date(),
      dismissedBy: params.userId,
    },
  });
}
