import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  createCustomer,
  createCheckoutSession,
  getPriceId,
  isStripeConfigured,
} from "@/lib/stripe";
import type { PlanTier } from "@optiq/shared";

const BodySchema = z.object({
  tier: z.enum(["STARTER", "GROWTH", "SCALE"]),
  interval: z.enum(["monthly", "annual"]).default("monthly"),
});

export async function POST(req: Request) {
  if (!isStripeConfigured()) {
    return NextResponse.json(
      { error: "Stripe is not configured" },
      { status: 503 }
    );
  }

  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  const orgId = session?.user?.activeOrgId;

  if (!userId || !orgId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const json = await req.json().catch(() => null);
  const parsed = BodySchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_params" }, { status: 400 });
  }

  const { tier, interval } = parsed.data;
  const priceId = getPriceId(tier as PlanTier, interval);

  if (!priceId) {
    return NextResponse.json({ error: "invalid_plan" }, { status: 400 });
  }

  try {
    // Get or create Stripe customer
    let subscription = await prisma.subscription.findUnique({
      where: { organizationId: orgId },
      select: { stripeCustomerId: true },
    });

    let customerId = subscription?.stripeCustomerId;

    if (!customerId) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { email: true, name: true },
      });

      if (!user?.email) {
        return NextResponse.json({ error: "user_email_required" }, { status: 400 });
      }

      const customer = await createCustomer({
        email: user.email,
        name: user.name ?? undefined,
        organizationId: orgId,
      });

      customerId = customer.id;

      // Store customer ID
      await prisma.subscription.upsert({
        where: { organizationId: orgId },
        create: {
          organizationId: orgId,
          plan: "FREE",
          status: "ACTIVE",
          stripeCustomerId: customerId,
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
        update: {
          stripeCustomerId: customerId,
        },
      });
    }

    // Create checkout session
    const checkoutSession = await createCheckoutSession({
      customerId: customerId!,
      priceId,
      organizationId: orgId,
      trialDays: tier === "STARTER" ? 14 : undefined,
    });

    return NextResponse.json({
      checkoutUrl: checkoutSession.url,
      sessionId: checkoutSession.id,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: "checkout_failed" }, { status: 500 });
  }
}
