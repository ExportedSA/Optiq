"use server";

import { NextResponse } from "next/server";
import { PLAN_DEFINITIONS } from "@optiq/shared";

export async function GET() {
  const plans = Object.values(PLAN_DEFINITIONS).map((plan) => ({
    tier: plan.tier,
    name: plan.name,
    description: plan.description,
    features: plan.features,
    recommended: plan.recommended ?? false,
    pricing: {
      monthly: plan.pricing.monthlyPriceCents / 100,
      annual: plan.pricing.annualPriceCents / 100,
      annualMonthly: Math.round(plan.pricing.annualPriceCents / 12) / 100,
    },
    limits: {
      workspaces: plan.limits.maxWorkspaces === -1 ? "Unlimited" : plan.limits.maxWorkspaces,
      connectors: plan.limits.maxConnectors === -1 ? "Unlimited" : plan.limits.maxConnectors,
      events: plan.limits.monthlyEventLimit.toLocaleString(),
      retention: `${plan.limits.dataRetentionDays} days`,
      attributionModels: plan.limits.attributionModels,
      alerts: plan.limits.alertsEnabled,
      sso: plan.limits.ssoEnabled,
      prioritySupport: plan.limits.prioritySupport,
    },
    overages: {
      eventsPer10k: plan.pricing.overageEventsPer10kCents / 100,
      connector: plan.pricing.overageConnectorCents / 100,
    },
  }));

  return NextResponse.json({ plans });
}
