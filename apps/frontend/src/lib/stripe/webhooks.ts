import "server-only";

import type Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { getTierFromPriceId } from "./config";
import { PLAN_DEFINITIONS, type PlanTier } from "@optiq/shared";

type WebhookResult = {
  success: boolean;
  message: string;
};

export async function handleSubscriptionCreated(
  subscription: Stripe.Subscription
): Promise<WebhookResult> {
  const organizationId = subscription.metadata?.organizationId;
  const customerId = subscription.customer as string;

  if (!organizationId) {
    return { success: false, message: "Missing organizationId in metadata" };
  }

  const priceId = subscription.items.data[0]?.price.id;
  if (!priceId) {
    return { success: false, message: "No price found in subscription" };
  }

  const tierInfo = getTierFromPriceId(priceId);
  if (!tierInfo) {
    return { success: false, message: `Unknown price ID: ${priceId}` };
  }

  const planDef = PLAN_DEFINITIONS[tierInfo.tier];

  await prisma.subscription.upsert({
    where: { organizationId },
    create: {
      organizationId,
      plan: tierInfo.tier,
      status: subscriptionStatusToDb(subscription.status),
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscription.id,
      stripePriceId: priceId,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      trialStart: subscription.trial_start ? new Date(subscription.trial_start * 1000) : null,
      trialEnd: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      maxWorkspaces: planDef.limits.maxWorkspaces,
      maxConnectors: planDef.limits.maxConnectors,
      monthlyEventLimit: planDef.limits.monthlyEventLimit,
      dataRetentionDays: planDef.limits.dataRetentionDays,
      attributionModels: planDef.limits.attributionModels,
      alertsEnabled: planDef.limits.alertsEnabled,
      ssoEnabled: planDef.limits.ssoEnabled,
      prioritySupport: planDef.limits.prioritySupport,
      overageEventsPer10k: planDef.pricing.overageEventsPer10kCents,
      overageConnectorPrice: planDef.pricing.overageConnectorCents,
    },
    update: {
      plan: tierInfo.tier,
      status: subscriptionStatusToDb(subscription.status),
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscription.id,
      stripePriceId: priceId,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      trialStart: subscription.trial_start ? new Date(subscription.trial_start * 1000) : null,
      trialEnd: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      maxWorkspaces: planDef.limits.maxWorkspaces,
      maxConnectors: planDef.limits.maxConnectors,
      monthlyEventLimit: planDef.limits.monthlyEventLimit,
      dataRetentionDays: planDef.limits.dataRetentionDays,
      attributionModels: planDef.limits.attributionModels,
      alertsEnabled: planDef.limits.alertsEnabled,
      ssoEnabled: planDef.limits.ssoEnabled,
      prioritySupport: planDef.limits.prioritySupport,
      overageEventsPer10k: planDef.pricing.overageEventsPer10kCents,
      overageConnectorPrice: planDef.pricing.overageConnectorCents,
    },
  });

  return { success: true, message: `Subscription created for org ${organizationId}` };
}

export async function handleSubscriptionUpdated(
  subscription: Stripe.Subscription
): Promise<WebhookResult> {
  const stripeSubscriptionId = subscription.id;

  const existing = await prisma.subscription.findFirst({
    where: { stripeSubscriptionId },
    select: { organizationId: true },
  });

  if (!existing) {
    return handleSubscriptionCreated(subscription);
  }

  const priceId = subscription.items.data[0]?.price.id;
  const tierInfo = priceId ? getTierFromPriceId(priceId) : null;
  const planDef = tierInfo ? PLAN_DEFINITIONS[tierInfo.tier] : null;

  await prisma.subscription.update({
    where: { organizationId: existing.organizationId },
    data: {
      status: subscriptionStatusToDb(subscription.status),
      stripePriceId: priceId,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      canceledAt: subscription.canceled_at ? new Date(subscription.canceled_at * 1000) : null,
      ...(tierInfo && planDef
        ? {
            plan: tierInfo.tier,
            maxWorkspaces: planDef.limits.maxWorkspaces,
            maxConnectors: planDef.limits.maxConnectors,
            monthlyEventLimit: planDef.limits.monthlyEventLimit,
            dataRetentionDays: planDef.limits.dataRetentionDays,
            attributionModels: planDef.limits.attributionModels,
            alertsEnabled: planDef.limits.alertsEnabled,
            ssoEnabled: planDef.limits.ssoEnabled,
            prioritySupport: planDef.limits.prioritySupport,
            overageEventsPer10k: planDef.pricing.overageEventsPer10kCents,
            overageConnectorPrice: planDef.pricing.overageConnectorCents,
          }
        : {}),
    },
  });

  return { success: true, message: `Subscription updated for org ${existing.organizationId}` };
}

export async function handleSubscriptionDeleted(
  subscription: Stripe.Subscription
): Promise<WebhookResult> {
  const stripeSubscriptionId = subscription.id;

  const existing = await prisma.subscription.findFirst({
    where: { stripeSubscriptionId },
    select: { organizationId: true },
  });

  if (!existing) {
    return { success: false, message: "Subscription not found" };
  }

  const freePlan = PLAN_DEFINITIONS.FREE;

  await prisma.subscription.update({
    where: { organizationId: existing.organizationId },
    data: {
      plan: "FREE",
      status: "CANCELED",
      canceledAt: new Date(),
      stripeSubscriptionId: null,
      stripePriceId: null,
      maxWorkspaces: freePlan.limits.maxWorkspaces,
      maxConnectors: freePlan.limits.maxConnectors,
      monthlyEventLimit: freePlan.limits.monthlyEventLimit,
      dataRetentionDays: freePlan.limits.dataRetentionDays,
      attributionModels: freePlan.limits.attributionModels,
      alertsEnabled: freePlan.limits.alertsEnabled,
      ssoEnabled: freePlan.limits.ssoEnabled,
      prioritySupport: freePlan.limits.prioritySupport,
      overageEventsPer10k: null,
      overageConnectorPrice: null,
    },
  });

  return { success: true, message: `Subscription canceled for org ${existing.organizationId}` };
}

export async function handleInvoicePaid(invoice: Stripe.Invoice): Promise<WebhookResult> {
  const subscriptionId = invoice.subscription as string | null;
  if (!subscriptionId) {
    return { success: true, message: "No subscription on invoice" };
  }

  const existing = await prisma.subscription.findFirst({
    where: { stripeSubscriptionId: subscriptionId },
    select: { organizationId: true },
  });

  if (!existing) {
    return { success: false, message: "Subscription not found for invoice" };
  }

  // Update period dates from invoice
  if (invoice.lines.data[0]) {
    const line = invoice.lines.data[0];
    await prisma.subscription.update({
      where: { organizationId: existing.organizationId },
      data: {
        status: "ACTIVE",
        currentPeriodStart: new Date((line.period?.start ?? 0) * 1000),
        currentPeriodEnd: new Date((line.period?.end ?? 0) * 1000),
      },
    });
  }

  return { success: true, message: `Invoice paid for org ${existing.organizationId}` };
}

export async function handleInvoicePaymentFailed(invoice: Stripe.Invoice): Promise<WebhookResult> {
  const subscriptionId = invoice.subscription as string | null;
  if (!subscriptionId) {
    return { success: true, message: "No subscription on invoice" };
  }

  const existing = await prisma.subscription.findFirst({
    where: { stripeSubscriptionId: subscriptionId },
    select: { organizationId: true },
  });

  if (!existing) {
    return { success: false, message: "Subscription not found for invoice" };
  }

  await prisma.subscription.update({
    where: { organizationId: existing.organizationId },
    data: { status: "PAST_DUE" },
  });

  return { success: true, message: `Payment failed for org ${existing.organizationId}` };
}

function subscriptionStatusToDb(
  status: Stripe.Subscription.Status
): "ACTIVE" | "TRIALING" | "PAST_DUE" | "CANCELED" | "PAUSED" {
  switch (status) {
    case "active":
      return "ACTIVE";
    case "trialing":
      return "TRIALING";
    case "past_due":
      return "PAST_DUE";
    case "canceled":
    case "unpaid":
    case "incomplete_expired":
      return "CANCELED";
    case "paused":
      return "PAUSED";
    default:
      return "ACTIVE";
  }
}
