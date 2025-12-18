import "server-only";

import { prisma } from "@/lib/prisma";
import { PLAN_DEFINITIONS, type PlanTier, type AttributionModel } from "@optiq/shared";

export interface Entitlements {
  plan: PlanTier;
  maxWorkspaces: number;
  maxConnectors: number;
  monthlyEventLimit: number;
  dataRetentionDays: number;
  attributionModels: AttributionModel[];
  alertsEnabled: boolean;
  ssoEnabled: boolean;
  prioritySupport: boolean;
  isActive: boolean;
}

export async function getEntitlements(organizationId: string): Promise<Entitlements> {
  const subscription = await prisma.subscription.findUnique({
    where: { organizationId },
  });

  if (!subscription) {
    const freePlan = PLAN_DEFINITIONS.FREE;
    return {
      plan: "FREE",
      maxWorkspaces: freePlan.limits.maxWorkspaces,
      maxConnectors: freePlan.limits.maxConnectors,
      monthlyEventLimit: freePlan.limits.monthlyEventLimit,
      dataRetentionDays: freePlan.limits.dataRetentionDays,
      attributionModels: freePlan.limits.attributionModels,
      alertsEnabled: freePlan.limits.alertsEnabled,
      ssoEnabled: freePlan.limits.ssoEnabled,
      prioritySupport: freePlan.limits.prioritySupport,
      isActive: true,
    };
  }

  const plan = subscription.plan as PlanTier;
  const planDef = PLAN_DEFINITIONS[plan] ?? PLAN_DEFINITIONS.FREE;
  const isActive = subscription.status === "ACTIVE" || subscription.status === "TRIALING";

  return {
    plan,
    maxWorkspaces: (subscription as any).maxWorkspaces ?? planDef.limits.maxWorkspaces,
    maxConnectors: (subscription as any).maxConnectors ?? planDef.limits.maxConnectors,
    monthlyEventLimit: subscription.monthlyEventLimit ?? planDef.limits.monthlyEventLimit,
    dataRetentionDays: (subscription as any).dataRetentionDays ?? planDef.limits.dataRetentionDays,
    attributionModels:
      ((subscription as any).attributionModels?.length > 0
        ? (subscription as any).attributionModels
        : planDef.limits.attributionModels) as AttributionModel[],
    alertsEnabled: (subscription as any).alertsEnabled ?? planDef.limits.alertsEnabled,
    ssoEnabled: (subscription as any).ssoEnabled ?? planDef.limits.ssoEnabled,
    prioritySupport: (subscription as any).prioritySupport ?? planDef.limits.prioritySupport,
    isActive,
  };
}

export type EntitlementCheck =
  | { allowed: true }
  | { allowed: false; reason: string; upgradeRequired: boolean };

export async function checkConnectorLimit(organizationId: string): Promise<EntitlementCheck> {
  const entitlements = await getEntitlements(organizationId);

  if (!entitlements.isActive) {
    return {
      allowed: false,
      reason: "Your subscription is not active. Please update your payment method.",
      upgradeRequired: false,
    };
  }

  if (entitlements.maxConnectors === -1) {
    return { allowed: true };
  }

  const connectorCount = await prisma.adAccount.count({
    where: { organizationId, status: "ACTIVE" },
  });

  if (connectorCount >= entitlements.maxConnectors) {
    return {
      allowed: false,
      reason: `You've reached your plan's limit of ${entitlements.maxConnectors} connected ad accounts. Upgrade to add more.`,
      upgradeRequired: true,
    };
  }

  return { allowed: true };
}

export async function checkWorkspaceLimit(organizationId: string): Promise<EntitlementCheck> {
  const entitlements = await getEntitlements(organizationId);

  if (!entitlements.isActive) {
    return {
      allowed: false,
      reason: "Your subscription is not active. Please update your payment method.",
      upgradeRequired: false,
    };
  }

  if (entitlements.maxWorkspaces === -1) {
    return { allowed: true };
  }

  // Currently 1 org = 1 workspace
  const workspaceCount = 1;

  if (workspaceCount >= entitlements.maxWorkspaces) {
    return {
      allowed: false,
      reason: `You've reached your plan's limit of ${entitlements.maxWorkspaces} workspace(s). Upgrade to add more.`,
      upgradeRequired: true,
    };
  }

  return { allowed: true };
}

export async function checkEventLimit(organizationId: string): Promise<EntitlementCheck> {
  const entitlements = await getEntitlements(organizationId);

  if (!entitlements.isActive) {
    return {
      allowed: false,
      reason: "Your subscription is not active. Please update your payment method.",
      upgradeRequired: false,
    };
  }

  const subscription = await prisma.subscription.findUnique({
    where: { organizationId },
    select: { currentPeriodStart: true, currentPeriodEnd: true },
  });

  if (!subscription) {
    return { allowed: true };
  }

  const sites = await prisma.trackingSite.findMany({
    where: { organizationId },
    select: { id: true },
  });

  if (sites.length === 0) {
    return { allowed: true };
  }

  const eventCount = await prisma.trackingEvent.count({
    where: {
      siteId: { in: sites.map((s) => s.id) },
      occurredAt: {
        gte: subscription.currentPeriodStart,
        lte: subscription.currentPeriodEnd,
      },
    },
  });

  // Allow up to 150% of limit before hard blocking (overages are billed)
  const hardLimit = Math.floor(entitlements.monthlyEventLimit * 1.5);

  if (eventCount >= hardLimit) {
    return {
      allowed: false,
      reason: `You've significantly exceeded your plan's event limit. Please upgrade to continue tracking.`,
      upgradeRequired: true,
    };
  }

  return { allowed: true };
}

export async function checkAttributionModel(
  organizationId: string,
  model: AttributionModel
): Promise<EntitlementCheck> {
  const entitlements = await getEntitlements(organizationId);

  if (!entitlements.isActive) {
    return {
      allowed: false,
      reason: "Your subscription is not active.",
      upgradeRequired: false,
    };
  }

  if (!entitlements.attributionModels.includes(model)) {
    return {
      allowed: false,
      reason: `The ${model.replace("_", " ").toLowerCase()} attribution model is not available on your plan. Upgrade to access it.`,
      upgradeRequired: true,
    };
  }

  return { allowed: true };
}

export async function checkAlertsEnabled(organizationId: string): Promise<EntitlementCheck> {
  const entitlements = await getEntitlements(organizationId);

  if (!entitlements.isActive) {
    return {
      allowed: false,
      reason: "Your subscription is not active.",
      upgradeRequired: false,
    };
  }

  if (!entitlements.alertsEnabled) {
    return {
      allowed: false,
      reason: "Alerts are not available on your current plan. Upgrade to Growth or Scale to enable alerts.",
      upgradeRequired: true,
    };
  }

  return { allowed: true };
}

export async function checkSsoEnabled(organizationId: string): Promise<EntitlementCheck> {
  const entitlements = await getEntitlements(organizationId);

  if (!entitlements.ssoEnabled) {
    return {
      allowed: false,
      reason: "SSO is only available on the Scale plan.",
      upgradeRequired: true,
    };
  }

  return { allowed: true };
}
