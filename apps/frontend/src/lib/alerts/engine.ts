import "server-only";

import { prisma } from "@/lib/prisma";
import { metricsAggregator } from "@/lib/metrics";
import { wasteEvaluator } from "@/lib/waste";
import type {
  AlertRule,
  AlertCondition,
  AlertEvaluationContext,
  RuleEvaluationResult,
  Alert,
  AlertSeverity,
  AlertTriggerType,
  EntityType,
} from "./types";
import { DEFAULT_RULES, wasteLevelToNumber } from "./types";

const DEFAULT_TARGET_CPA = 25;

function evaluateCondition(
  condition: AlertCondition,
  context: AlertEvaluationContext
): boolean {
  let currentValue: number | null = null;
  let previousValue: number | null = null;

  switch (condition.metric) {
    case "waste_level":
      currentValue = wasteLevelToNumber(context.wasteLevel ?? "none");
      break;
    case "wasted_spend":
      currentValue = context.wastedSpend ?? 0;
      break;
    case "cpa":
      currentValue = context.currentMetrics.cpa;
      previousValue = context.previousMetrics?.cpa ?? null;
      break;
    case "cpa_vs_target_pct":
      if (context.currentMetrics.cpa !== null) {
        currentValue = ((context.currentMetrics.cpa - DEFAULT_TARGET_CPA) / DEFAULT_TARGET_CPA) * 100;
      }
      break;
    case "spend":
      currentValue = context.currentMetrics.spend;
      previousValue = context.previousMetrics?.spend ?? null;
      break;
    case "conversions":
      currentValue = context.currentMetrics.conversions;
      previousValue = context.previousMetrics?.conversions ?? null;
      break;
    case "roas":
      currentValue = context.currentMetrics.roas;
      previousValue = context.previousMetrics?.roas ?? null;
      break;
    case "impressions":
      currentValue = context.currentMetrics.impressions;
      previousValue = context.previousMetrics?.impressions ?? null;
      break;
    case "clicks":
      currentValue = context.currentMetrics.clicks;
      previousValue = context.previousMetrics?.clicks ?? null;
      break;
    default:
      return false;
  }

  if (currentValue === null) return false;

  switch (condition.operator) {
    case "gt":
      return currentValue > condition.value;
    case "lt":
      return currentValue < condition.value;
    case "gte":
      return currentValue >= condition.value;
    case "lte":
      return currentValue <= condition.value;
    case "eq":
      return currentValue === condition.value;
    case "pct_change_gt":
    case "pct_change_lt":
      if (previousValue === null || previousValue === 0) return false;
      const pctChange = ((currentValue - previousValue) / previousValue) * 100;
      return condition.operator === "pct_change_gt"
        ? pctChange > condition.value
        : pctChange < condition.value;
    default:
      return false;
  }
}

function evaluateRule(
  rule: AlertRule,
  context: AlertEvaluationContext
): RuleEvaluationResult {
  if (!rule.enabled) {
    return {
      triggered: false,
      rule,
      context,
      message: "",
      metadata: {},
    };
  }

  const allConditionsMet = rule.conditions.every((cond) =>
    evaluateCondition(cond, context)
  );

  if (!allConditionsMet) {
    return {
      triggered: false,
      rule,
      context,
      message: "",
      metadata: {},
    };
  }

  const message = buildAlertMessage(rule, context);
  const metadata = buildAlertMetadata(rule, context);

  return {
    triggered: true,
    rule,
    context,
    message,
    metadata,
  };
}

function buildAlertMessage(
  rule: AlertRule,
  context: AlertEvaluationContext
): string {
  switch (rule.triggerType) {
    case "waste_detected":
      return `${context.entityName} has ${context.wasteLevel} waste level with $${(context.wastedSpend ?? 0).toFixed(2)} wasted spend.`;

    case "cpa_breach":
      const cpa = context.currentMetrics.cpa;
      const pctOver = cpa !== null ? ((cpa - DEFAULT_TARGET_CPA) / DEFAULT_TARGET_CPA) * 100 : 0;
      return `${context.entityName} CPA of $${cpa?.toFixed(2) ?? "N/A"} is ${pctOver.toFixed(0)}% above target ($${DEFAULT_TARGET_CPA}).`;

    case "performance_drop":
      const currentConv = context.currentMetrics.conversions;
      const prevConv = context.previousMetrics?.conversions ?? 0;
      const dropPct = prevConv > 0 ? ((currentConv - prevConv) / prevConv) * 100 : 0;
      return `${context.entityName} conversions dropped ${Math.abs(dropPct).toFixed(0)}% (${prevConv} → ${currentConv}).`;

    default:
      return `Alert triggered for ${context.entityName}: ${rule.name}`;
  }
}

function buildAlertMetadata(
  rule: AlertRule,
  context: AlertEvaluationContext
): Record<string, unknown> {
  return {
    entityType: context.entityType,
    entityId: context.entityId,
    currentMetrics: context.currentMetrics,
    previousMetrics: context.previousMetrics,
    wasteLevel: context.wasteLevel,
    wastedSpend: context.wastedSpend,
    triggerType: rule.triggerType,
    conditions: rule.conditions,
  };
}

export class AlertRuleEngine {
  private rules: AlertRule[];

  constructor(customRules?: AlertRule[]) {
    this.rules = customRules ?? DEFAULT_RULES.map((r, i) => ({
      ...r,
      id: `default_rule_${i}`,
    }));
  }

  async evaluateOrganization(params: {
    organizationId: string;
    windowDays?: number;
  }): Promise<RuleEvaluationResult[]> {
    const windowDays = params.windowDays ?? 7;
    const results: RuleEvaluationResult[] = [];

    const endDate = new Date();
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - windowDays);

    const prevEndDate = new Date(startDate);
    prevEndDate.setDate(prevEndDate.getDate() - 1);
    const prevStartDate = new Date(prevEndDate);
    prevStartDate.setDate(prevStartDate.getDate() - windowDays);

    const [currentSummary, previousSummary] = await Promise.all([
      metricsAggregator.getSummary({
        filter: {
          organizationId: params.organizationId,
          dateRange: { start: startDate, end: endDate },
        },
        entityLevel: "organization",
        comparePrevious: false,
      }),
      metricsAggregator.getSummary({
        filter: {
          organizationId: params.organizationId,
          dateRange: { start: prevStartDate, end: prevEndDate },
        },
        entityLevel: "organization",
        comparePrevious: false,
      }),
    ]);

    const wasteAnalysis = await wasteEvaluator.evaluateOrganization({
      organizationId: params.organizationId,
      windowDays,
    });

    const orgContext: AlertEvaluationContext = {
      organizationId: params.organizationId,
      entityType: "organization",
      entityId: params.organizationId,
      entityName: "Organization",
      currentMetrics: {
        spend: currentSummary.current.spend,
        conversions: currentSummary.current.conversions,
        cpa: currentSummary.current.cpa,
        roas: currentSummary.current.roas,
        impressions: currentSummary.current.impressions,
        clicks: currentSummary.current.clicks,
      },
      previousMetrics: {
        spend: previousSummary.current.spend,
        conversions: previousSummary.current.conversions,
        cpa: previousSummary.current.cpa,
        roas: previousSummary.current.roas,
        impressions: previousSummary.current.impressions,
        clicks: previousSummary.current.clicks,
      },
      wasteLevel: wasteAnalysis.alerts.length > 0
        ? wasteAnalysis.alerts.reduce((max, a) =>
            wasteLevelToNumber(a.level) > wasteLevelToNumber(max) ? a.level : max,
            "none"
          )
        : "none",
      wastedSpend: Number(wasteAnalysis.totalWastedSpendMicros) / 1_000_000,
    };

    for (const rule of this.rules) {
      const result = evaluateRule(rule, orgContext);
      if (result.triggered) {
        results.push(result);
      }
    }

    for (const wasteAlert of wasteAnalysis.alerts) {
      if (wasteAlert.entityType === "campaign") {
        const campaignContext: AlertEvaluationContext = {
          organizationId: params.organizationId,
          entityType: "campaign",
          entityId: wasteAlert.entityId,
          entityName: wasteAlert.entityName,
          currentMetrics: {
            spend: Number(wasteAlert.spendMicros) / 1_000_000,
            conversions: wasteAlert.conversions,
            cpa: wasteAlert.cpa,
            roas: null,
            impressions: 0,
            clicks: 0,
          },
          wasteLevel: wasteAlert.level,
          wastedSpend: Number(wasteAlert.spendMicros) / 1_000_000,
        };

        for (const rule of this.rules.filter((r) => r.triggerType === "waste_detected")) {
          const result = evaluateRule(rule, campaignContext);
          if (result.triggered) {
            results.push(result);
          }
        }
      }
    }

    return results;
  }

  async evaluateCampaign(params: {
    organizationId: string;
    campaignId: string;
    windowDays?: number;
  }): Promise<RuleEvaluationResult[]> {
    const windowDays = params.windowDays ?? 7;
    const results: RuleEvaluationResult[] = [];

    const endDate = new Date();
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - windowDays);

    const prevEndDate = new Date(startDate);
    prevEndDate.setDate(prevEndDate.getDate() - 1);
    const prevStartDate = new Date(prevEndDate);
    prevStartDate.setDate(prevStartDate.getDate() - windowDays);

    const campaign = await prisma.campaign.findUnique({
      where: { id: params.campaignId },
      select: { id: true, name: true },
    });

    if (!campaign) return results;

    const [currentMetrics, previousMetrics] = await Promise.all([
      prisma.dailyCampaignMetric.aggregate({
        where: {
          campaignId: params.campaignId,
          date: { gte: startDate, lte: endDate },
        },
        _sum: {
          impressions: true,
          clicks: true,
          spendMicros: true,
          conversions: true,
          revenueMicros: true,
        },
      }),
      prisma.dailyCampaignMetric.aggregate({
        where: {
          campaignId: params.campaignId,
          date: { gte: prevStartDate, lte: prevEndDate },
        },
        _sum: {
          impressions: true,
          clicks: true,
          spendMicros: true,
          conversions: true,
          revenueMicros: true,
        },
      }),
    ]);

    const wasteAlerts = await wasteEvaluator.evaluateCampaign({
      organizationId: params.organizationId,
      campaignId: params.campaignId,
      windowDays,
    });

    const currentSpend = Number(currentMetrics._sum.spendMicros ?? 0) / 1_000_000;
    const currentConv = Number(currentMetrics._sum.conversions ?? 0);
    const currentRevenue = Number(currentMetrics._sum.revenueMicros ?? 0) / 1_000_000;

    const prevSpend = Number(previousMetrics._sum.spendMicros ?? 0) / 1_000_000;
    const prevConv = Number(previousMetrics._sum.conversions ?? 0);
    const prevRevenue = Number(previousMetrics._sum.revenueMicros ?? 0) / 1_000_000;

    const context: AlertEvaluationContext = {
      organizationId: params.organizationId,
      entityType: "campaign",
      entityId: params.campaignId,
      entityName: campaign.name,
      currentMetrics: {
        spend: currentSpend,
        conversions: currentConv,
        cpa: currentConv > 0 ? currentSpend / currentConv : null,
        roas: currentSpend > 0 ? currentRevenue / currentSpend : null,
        impressions: Number(currentMetrics._sum.impressions ?? 0),
        clicks: Number(currentMetrics._sum.clicks ?? 0),
      },
      previousMetrics: {
        spend: prevSpend,
        conversions: prevConv,
        cpa: prevConv > 0 ? prevSpend / prevConv : null,
        roas: prevSpend > 0 ? prevRevenue / prevSpend : null,
        impressions: Number(previousMetrics._sum.impressions ?? 0),
        clicks: Number(previousMetrics._sum.clicks ?? 0),
      },
      wasteLevel: wasteAlerts.length > 0 ? wasteAlerts[0].level : "none",
      wastedSpend: wasteAlerts.reduce((sum, a) => sum + Number(a.spendMicros) / 1_000_000, 0),
    };

    for (const rule of this.rules) {
      const result = evaluateRule(rule, context);
      if (result.triggered) {
        results.push(result);
      }
    }

    return results;
  }

  getRules(): AlertRule[] {
    return [...this.rules];
  }

  addRule(rule: AlertRule): void {
    this.rules.push(rule);
  }

  updateRule(ruleId: string, updates: Partial<AlertRule>): boolean {
    const index = this.rules.findIndex((r) => r.id === ruleId);
    if (index === -1) return false;
    this.rules[index] = { ...this.rules[index], ...updates };
    return true;
  }

  removeRule(ruleId: string): boolean {
    const index = this.rules.findIndex((r) => r.id === ruleId);
    if (index === -1) return false;
    this.rules.splice(index, 1);
    return true;
  }

  enableRule(ruleId: string): boolean {
    return this.updateRule(ruleId, { enabled: true });
  }

  disableRule(ruleId: string): boolean {
    return this.updateRule(ruleId, { enabled: false });
  }
}

export const alertRuleEngine = new AlertRuleEngine();
