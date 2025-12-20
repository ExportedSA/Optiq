import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { appLogger } from "@/lib/observability";

import {
  constructWebhookEvent,
  handleSubscriptionCreated,
  handleSubscriptionUpdated,
  handleSubscriptionDeleted,
  handleInvoicePaid,
  handleInvoicePaymentFailed,
  isStripeConfigured,
} from "@/lib/stripe";

export async function POST(req: Request) {
  if (!isStripeConfigured()) {
    appLogger.warn("Stripe webhook received but Stripe not configured");
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  // Get raw body for signature verification
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    appLogger.warn("Stripe webhook received without signature header");
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  // Verify webhook signature
  let event;
  try {
    event = constructWebhookEvent(body, signature);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    appLogger.error("Stripe webhook signature verification failed", { error: errorMessage });
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  appLogger.info("Stripe webhook received", { eventType: event.type, eventId: event.id });

  try {
    switch (event.type) {
      case "customer.subscription.created": {
        const subscription = event.data.object;
        const result = await handleSubscriptionCreated(subscription);
        appLogger.info("Subscription created", { subscriptionId: subscription.id, message: result.message });
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object;
        const result = await handleSubscriptionUpdated(subscription);
        appLogger.info("Subscription updated", { subscriptionId: subscription.id, message: result.message });
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        const result = await handleSubscriptionDeleted(subscription);
        appLogger.info("Subscription deleted", { subscriptionId: subscription.id, message: result.message });
        break;
      }

      case "invoice.paid": {
        const invoice = event.data.object;
        const result = await handleInvoicePaid(invoice);
        appLogger.info("Invoice paid", { invoiceId: invoice.id, message: result.message });
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object;
        const result = await handleInvoicePaymentFailed(invoice);
        appLogger.warn("Invoice payment failed", { invoiceId: invoice.id, message: result.message });
        break;
      }

      default:
        appLogger.debug("Unhandled Stripe webhook event type", { eventType: event.type });
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const errorStack = error instanceof Error ? error.stack : undefined;
    appLogger.error("Stripe webhook handler error", { 
      error: errorMessage, 
      stack: errorStack,
      eventType: event.type,
      eventId: event.id 
    });
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
