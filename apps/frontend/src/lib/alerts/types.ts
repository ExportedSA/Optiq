import "server-only";

export type AlertSeverity = "info" | "warning" | "critical";

export type AlertTriggerType =
  | "waste_detected"
  | "cpa_breach"
  | "performance_drop"
  | "budget_exceeded"
  | "conversion_drop";

export type AlertStatus = "active" | "acknowledged" | "resolved" | "snoozed";

export type EntityType = "organization" | "ad_account" | "campaign" | "ad";

export interface AlertRule {
  id: string;
  name: string;
  description: string;
  triggerType: AlertTriggerType;
  enabled: boolean;
  severity: AlertSeverity;
  conditions: AlertCondition[];
  cooldownMinutes: number;
  notifyChannels: NotifyChannel[];
}

export interface AlertCondition {
  metric: string;
  operator: "gt" | "lt" | "gte" | "lte" | "eq" | "pct_change_gt" | "pct_change_lt";
  value: number;
  windowDays?: number;
}

export type NotifyChannel = "in_app" | "email" | "webhook";

export interface Alert {
  id: string;
  organizationId: string;
  ruleId: string;
  ruleName: string;
  triggerType: AlertTriggerType;
  severity: AlertSeverity;
  status: AlertStatus;
  entityType: EntityType;
  entityId: string;
  entityName: string;
  title: string;
  message: string;
  metadata: Record<string, unknown>;
  triggeredAt: Date;
  acknowledgedAt: Date | null;
  resolvedAt: Date | null;
  snoozedUntil: Date | null;
}

export interface AlertEvaluationContext {
  organizationId: string;
  entityType: EntityType;
  entityId: string;
  entityName: string;
  currentMetrics: {
    spend: number;
    conversions: number;
    cpa: number | null;
    roas: number | null;
    impressions: number;
    clicks: number;
  };
  previousMetrics?: {
    spend: number;
    conversions: number;
    cpa: number | null;
    roas: number | null;
    impressions: number;
    clicks: number;
  };
  wasteLevel?: string;
  wastedSpend?: number;
}

export interface RuleEvaluationResult {
  triggered: boolean;
  rule: AlertRule;
  context: AlertEvaluationContext;
  message: string;
  metadata: Record<string, unknown>;
}

export const DEFAULT_RULES: Omit<AlertRule, "id">[] = [
  {
    name: "High Waste Detected",
    description: "Triggers when significant ad spend waste is detected",
    triggerType: "waste_detected",
    enabled: true,
    severity: "warning",
    conditions: [
      { metric: "waste_level", operator: "gte", value: 2 },
    ],
    cooldownMinutes: 60,
    notifyChannels: ["in_app"],
  },
  {
    name: "Critical Waste Alert",
    description: "Triggers when critical waste levels are detected",
    triggerType: "waste_detected",
    enabled: true,
    severity: "critical",
    conditions: [
      { metric: "waste_level", operator: "gte", value: 4 },
    ],
    cooldownMinutes: 30,
    notifyChannels: ["in_app", "email"],
  },
  {
    name: "CPA Above Target",
    description: "Triggers when CPA exceeds target by 50%",
    triggerType: "cpa_breach",
    enabled: true,
    severity: "warning",
    conditions: [
      { metric: "cpa_vs_target_pct", operator: "gt", value: 50 },
    ],
    cooldownMinutes: 120,
    notifyChannels: ["in_app"],
  },
  {
    name: "CPA Critical Breach",
    description: "Triggers when CPA exceeds target by 100%",
    triggerType: "cpa_breach",
    enabled: true,
    severity: "critical",
    conditions: [
      { metric: "cpa_vs_target_pct", operator: "gt", value: 100 },
    ],
    cooldownMinutes: 60,
    notifyChannels: ["in_app", "email"],
  },
  {
    name: "Sudden Conversion Drop",
    description: "Triggers when conversions drop by 50% vs previous period",
    triggerType: "performance_drop",
    enabled: true,
    severity: "warning",
    conditions: [
      { metric: "conversions", operator: "pct_change_lt", value: -50, windowDays: 7 },
    ],
    cooldownMinutes: 240,
    notifyChannels: ["in_app"],
  },
  {
    name: "Severe Performance Drop",
    description: "Triggers when conversions drop by 75% vs previous period",
    triggerType: "performance_drop",
    enabled: true,
    severity: "critical",
    conditions: [
      { metric: "conversions", operator: "pct_change_lt", value: -75, windowDays: 7 },
    ],
    cooldownMinutes: 120,
    notifyChannels: ["in_app", "email"],
  },
];

export function wasteLevelToNumber(level: string): number {
  switch (level) {
    case "none": return 0;
    case "low": return 1;
    case "medium": return 2;
    case "high": return 3;
    case "critical": return 4;
    default: return 0;
  }
}

export function severityToNumber(severity: AlertSeverity): number {
  switch (severity) {
    case "info": return 0;
    case "warning": return 1;
    case "critical": return 2;
    default: return 0;
  }
}
