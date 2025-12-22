import "server-only";

import Stripe from "stripe";
import { STRIPE_CONFIG } from "./config";

let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeInstance) {
    if (!STRIPE_CONFIG.secretKey) {
      throw new Error("STRIPE_SECRET_KEY is not configured");
    }
    stripeInstance = new Stripe(STRIPE_CONFIG.secretKey, {
      apiVersion: "2025-02-24.acacia",
      typescript: true,
    });
  }
  return stripeInstance;
}

export async function createCustomer(params: {
  email: string;
  name?: string;
  organizationId: string;
  metadata?: Record<string, string>;
}): Promise<Stripe.Customer> {
  const stripe = getStripe();
  
  return stripe.customers.create({
    email: params.email,
    name: params.name,
    metadata: {
      organizationId: params.organizationId,
      ...params.metadata,
    },
  });
}

export async function createCheckoutSession(params: {
  customerId: string;
  priceId: string;
  organizationId: string;
  successUrl?: string;
  cancelUrl?: string;
  trialDays?: number;
}): Promise<Stripe.Checkout.Session> {
  const stripe = getStripe();

  return stripe.checkout.sessions.create({
    customer: params.customerId,
    mode: "subscription",
    line_items: [
      {
        price: params.priceId,
        quantity: 1,
      },
    ],
    success_url: params.successUrl ?? STRIPE_CONFIG.successUrl,
    cancel_url: params.cancelUrl ?? STRIPE_CONFIG.cancelUrl,
    subscription_data: params.trialDays
      ? {
          trial_period_days: params.trialDays,
          metadata: { organizationId: params.organizationId },
        }
      : {
          metadata: { organizationId: params.organizationId },
        },
    metadata: {
      organizationId: params.organizationId,
    },
  });
}

export async function createPortalSession(params: {
  customerId: string;
  returnUrl?: string;
}): Promise<Stripe.BillingPortal.Session> {
  const stripe = getStripe();

  const returnUrl = params.returnUrl ?? STRIPE_CONFIG.successUrl.replace("?success=true", "");

  return stripe.billingPortal.sessions.create({
    customer: params.customerId,
    return_url: returnUrl,
    ...(STRIPE_CONFIG.portalConfigId ? { configuration: STRIPE_CONFIG.portalConfigId } : {}),
  });
}

export async function getSubscription(subscriptionId: string): Promise<Stripe.Subscription | null> {
  const stripe = getStripe();

  try {
    return await stripe.subscriptions.retrieve(subscriptionId);
  } catch {
    return null;
  }
}

export async function cancelSubscription(
  subscriptionId: string,
  cancelAtPeriodEnd = true
): Promise<Stripe.Subscription> {
  const stripe = getStripe();

  if (cancelAtPeriodEnd) {
    return stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    });
  }

  return stripe.subscriptions.cancel(subscriptionId);
}

export async function updateSubscription(
  subscriptionId: string,
  priceId: string
): Promise<Stripe.Subscription> {
  const stripe = getStripe();

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const itemId = subscription.items.data[0]?.id;

  if (!itemId) {
    throw new Error("No subscription item found");
  }

  return stripe.subscriptions.update(subscriptionId, {
    items: [
      {
        id: itemId,
        price: priceId,
      },
    ],
    proration_behavior: "create_prorations",
  });
}

export function constructWebhookEvent(
  payload: string | Buffer,
  signature: string
): Stripe.Event {
  const stripe = getStripe();

  if (!STRIPE_CONFIG.webhookSecret) {
    throw new Error("STRIPE_WEBHOOK_SECRET is not configured");
  }

  return stripe.webhooks.constructEvent(
    payload,
    signature,
    STRIPE_CONFIG.webhookSecret
  );
}
