import { NextResponse } from "next/server";
import { headers } from "next/headers";

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
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event;
  try {
    event = constructWebhookEvent(body, signature);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  console.log(`Stripe webhook received: ${event.type}`);

  try {
    switch (event.type) {
      case "customer.subscription.created": {
        const subscription = event.data.object;
        const result = await handleSubscriptionCreated(subscription);
        console.log("subscription.created:", result.message);
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object;
        const result = await handleSubscriptionUpdated(subscription);
        console.log("subscription.updated:", result.message);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        const result = await handleSubscriptionDeleted(subscription);
        console.log("subscription.deleted:", result.message);
        break;
      }

      case "invoice.paid": {
        const invoice = event.data.object;
        const result = await handleInvoicePaid(invoice);
        console.log("invoice.paid:", result.message);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object;
        const result = await handleInvoicePaymentFailed(invoice);
        console.log("invoice.payment_failed:", result.message);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook handler error:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
