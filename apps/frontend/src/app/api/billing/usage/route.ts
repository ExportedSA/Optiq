"use server";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PLAN_DEFINITIONS, calculateOverages, type PlanTier } from "@optiq/shared";

export async function GET() {
  const session = await getServerSession(authOptions);
  const orgId = session?.user?.activeOrgId;

  if (!orgId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const subscription = await prisma.subscription.findUnique({
    where: { organizationId: orgId },
  });

  if (!subscription) {
    return NextResponse.json({
      plan: "FREE",
      periodStart: new Date().toISOString(),
      periodEnd: new Date().toISOString(),
      usage: { trackedEvents: 0, connectedAccounts: 0, workspacesUsed: 1 },
      limits: PLAN_DEFINITIONS.FREE.limits,
      overages: { eventsOverage: 0, connectorsOverage: 0, totalOverageCents: 0 },
    });
  }

  const plan = subscription.plan as PlanTier;
  const planDef = PLAN_DEFINITIONS[plan] ?? PLAN_DEFINITIONS.FREE;

  // Count tracked events in current period
  const sites = await prisma.trackingSite.findMany({
    where: { organizationId: orgId },
    select: { id: true },
  });

  const trackedEvents = sites.length > 0
    ? await prisma.trackingEvent.count({
        where: {
          siteId: { in: sites.map((s) => s.id) },
          occurredAt: {
            gte: subscription.currentPeriodStart,
            lte: subscription.currentPeriodEnd,
          },
        },
      })
    : 0;

  // Count connected accounts
  const connectedAccounts = await prisma.adAccount.count({
    where: { organizationId: orgId, status: "ACTIVE" },
  });

  const usage = {
    trackedEvents,
    connectedAccounts,
    workspacesUsed: 1,
  };

  const overages = calculateOverages(usage, planDef.limits, planDef.pricing);

  return NextResponse.json({
    plan,
    periodStart: subscription.currentPeriodStart.toISOString(),
    periodEnd: subscription.currentPeriodEnd.toISOString(),
    usage,
    limits: planDef.limits,
    overages: {
      eventsOverage: overages.eventsOverage,
      connectorsOverage: overages.connectorsOverage,
      eventsOverageCents: overages.eventsOverageCents,
      connectorsOverageCents: overages.connectorsOverageCents,
      totalOverageCents: overages.totalOverageCents,
    },
  });
}
