"use server";

import { prisma } from "@/lib/prisma";
import {
  PLAN_DEFINITIONS,
  calculateOverages,
  checkLimits,
  getPlanLimits,
  type PlanTier,
  type UsageSummary,
  type OverageCalculation,
  type LimitCheckResult,
} from "@optiq/shared";

export interface BillingUsage {
  organizationId: string;
  plan: PlanTier;
  periodStart: Date;
  periodEnd: Date;
  usage: UsageSummary;
  limits: ReturnType<typeof getPlanLimits>;
  overages: OverageCalculation;
  limitCheck: LimitCheckResult;
}

export async function getOrganizationUsage(organizationId: string): Promise<BillingUsage | null> {
  const subscription = await prisma.subscription.findUnique({
    where: { organizationId },
    select: {
      plan: true,
      currentPeriodStart: true,
      currentPeriodEnd: true,
      maxWorkspaces: true,
      maxConnectors: true,
      monthlyEventLimit: true,
      dataRetentionDays: true,
      attributionModels: true,
      alertsEnabled: true,
      overageEventsPer10k: true,
      overageConnectorPrice: true,
    },
  });

  if (!subscription) {
    return null;
  }

  const plan = subscription.plan as PlanTier;
  const planDef = PLAN_DEFINITIONS[plan];

  const limits = {
    maxWorkspaces: subscription.maxWorkspaces ?? planDef.limits.maxWorkspaces,
    maxConnectors: subscription.maxConnectors ?? planDef.limits.maxConnectors,
    monthlyEventLimit: subscription.monthlyEventLimit ?? planDef.limits.monthlyEventLimit,
    dataRetentionDays: subscription.dataRetentionDays ?? planDef.limits.dataRetentionDays,
    attributionModels:
      subscription.attributionModels.length > 0
        ? (subscription.attributionModels as typeof planDef.limits.attributionModels)
        : planDef.limits.attributionModels,
    alertsEnabled: subscription.alertsEnabled ?? planDef.limits.alertsEnabled,
    ssoEnabled: planDef.limits.ssoEnabled,
    prioritySupport: planDef.limits.prioritySupport,
  };

  const pricing = {
    ...planDef.pricing,
    overageEventsPer10kCents: subscription.overageEventsPer10k ?? planDef.pricing.overageEventsPer10kCents,
    overageConnectorCents: subscription.overageConnectorPrice ?? planDef.pricing.overageConnectorCents,
  };

  const [eventsCount, connectorsCount, workspacesCount] = await Promise.all([
    countTrackedEvents(organizationId, subscription.currentPeriodStart, subscription.currentPeriodEnd),
    countConnectedAccounts(organizationId),
    countWorkspaces(organizationId),
  ]);

  const usage: UsageSummary = {
    trackedEvents: eventsCount,
    connectedAccounts: connectorsCount,
    workspacesUsed: workspacesCount,
  };

  const overages = calculateOverages(usage, limits, pricing);
  const limitCheck = checkLimits(usage, limits);

  return {
    organizationId,
    plan,
    periodStart: subscription.currentPeriodStart,
    periodEnd: subscription.currentPeriodEnd,
    usage,
    limits,
    overages,
    limitCheck,
  };
}

async function countTrackedEvents(
  organizationId: string,
  periodStart: Date,
  periodEnd: Date
): Promise<number> {
  const sites = await prisma.trackingSite.findMany({
    where: { organizationId },
    select: { id: true },
  });

  if (sites.length === 0) return 0;

  const count = await prisma.trackingEvent.count({
    where: {
      siteId: { in: sites.map((s) => s.id) },
      occurredAt: { gte: periodStart, lte: periodEnd },
    },
  });

  return count;
}

async function countConnectedAccounts(organizationId: string): Promise<number> {
  const count = await prisma.integrationConnection.count({
    where: {
      organizationId,
      status: "CONNECTED",
    },
  });

  return count;
}

async function countWorkspaces(organizationId: string): Promise<number> {
  // Currently 1 org = 1 workspace; in future this could be separate
  return 1;
}

export async function recordUsageSnapshot(organizationId: string): Promise<void> {
  const subscription = await prisma.subscription.findUnique({
    where: { organizationId },
    select: {
      id: true,
      currentPeriodStart: true,
      currentPeriodEnd: true,
    },
  });

  if (!subscription) return;

  const usage = await getOrganizationUsage(organizationId);
  if (!usage) return;

  await prisma.usageRecord.upsert({
    where: {
      subscriptionId_periodStart: {
        subscriptionId: subscription.id,
        periodStart: subscription.currentPeriodStart,
      },
    },
    create: {
      subscriptionId: subscription.id,
      organizationId,
      periodStart: subscription.currentPeriodStart,
      periodEnd: subscription.currentPeriodEnd,
      trackedEvents: usage.usage.trackedEvents,
      connectedAccounts: usage.usage.connectedAccounts,
      workspacesUsed: usage.usage.workspacesUsed,
      eventsOverage: usage.overages.eventsOverage,
      connectorsOverage: usage.overages.connectorsOverage,
      overageAmountCents: usage.overages.totalOverageCents,
    },
    update: {
      trackedEvents: usage.usage.trackedEvents,
      connectedAccounts: usage.usage.connectedAccounts,
      workspacesUsed: usage.usage.workspacesUsed,
      eventsOverage: usage.overages.eventsOverage,
      connectorsOverage: usage.overages.connectorsOverage,
      overageAmountCents: usage.overages.totalOverageCents,
    },
  });
}

export async function enforceConnectorLimit(organizationId: string): Promise<{
  allowed: boolean;
  reason?: string;
  currentCount: number;
  limit: number;
}> {
  const usage = await getOrganizationUsage(organizationId);

  if (!usage) {
    return { allowed: true, currentCount: 0, limit: 1 };
  }

  const { maxConnectors } = usage.limits;

  if (maxConnectors === -1) {
    return { allowed: true, currentCount: usage.usage.connectedAccounts, limit: -1 };
  }

  if (usage.usage.connectedAccounts >= maxConnectors) {
    return {
      allowed: false,
      reason: `You've reached your plan's connector limit (${maxConnectors}). Upgrade to add more.`,
      currentCount: usage.usage.connectedAccounts,
      limit: maxConnectors,
    };
  }

  return {
    allowed: true,
    currentCount: usage.usage.connectedAccounts,
    limit: maxConnectors,
  };
}

export async function enforceWorkspaceLimit(organizationId: string): Promise<{
  allowed: boolean;
  reason?: string;
  currentCount: number;
  limit: number;
}> {
  const usage = await getOrganizationUsage(organizationId);

  if (!usage) {
    return { allowed: true, currentCount: 0, limit: 1 };
  }

  const { maxWorkspaces } = usage.limits;

  if (maxWorkspaces === -1) {
    return { allowed: true, currentCount: usage.usage.workspacesUsed, limit: -1 };
  }

  if (usage.usage.workspacesUsed >= maxWorkspaces) {
    return {
      allowed: false,
      reason: `You've reached your plan's workspace limit (${maxWorkspaces}). Upgrade to add more.`,
      currentCount: usage.usage.workspacesUsed,
      limit: maxWorkspaces,
    };
  }

  return {
    allowed: true,
    currentCount: usage.usage.workspacesUsed,
    limit: maxWorkspaces,
  };
}
