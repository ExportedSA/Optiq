"use server";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";

import { authOptions } from "@/lib/auth";
import { wasteEvaluator, microsToDollars } from "@/lib/waste";

const QuerySchema = z.object({
  windowDays: z.coerce.number().int().min(1).max(90).default(7),
});

type RecommendedAction = {
  key: "pause" | "reduce_budget" | "creative_refresh" | "landing_page_check" | "targeting_review";
  title: string;
  description: string;
  severity: "low" | "medium" | "high";
};

function recommendedActionsFor(alert: {
  reason: string;
  entityType: string;
  level: string;
}): RecommendedAction[] {
  const severity: RecommendedAction["severity"] =
    alert.level === "critical" ? "high" : alert.level === "high" ? "high" : alert.level === "medium" ? "medium" : "low";

  if (alert.reason === "zero_conversions_high_spend") {
    return [
      {
        key: "pause",
        title: "Pause or stop spend",
        description: `Pause this ${alert.entityType.replace("_", " ")} until conversion tracking and targeting are validated.`,
        severity,
      },
      {
        key: "targeting_review",
        title: "Review targeting",
        description: "Tighten audience/keywords, exclude low-intent placements, and verify geo/device targeting.",
        severity: "medium",
      },
      {
        key: "landing_page_check",
        title: "Check landing page",
        description: "Confirm the landing page loads fast, matches the ad promise, and the conversion event fires.",
        severity: "medium",
      },
    ];
  }

  if (alert.reason === "cpa_above_target") {
    return [
      {
        key: "reduce_budget",
        title: "Reduce budget",
        description: "Reduce budget while you iterate on performance drivers to bring CPA back under target.",
        severity,
      },
      {
        key: "creative_refresh",
        title: "Creative refresh",
        description: "Test new creatives and messages to improve conversion rate.",
        severity: "medium",
      },
      {
        key: "landing_page_check",
        title: "Landing page check",
        description: "Audit the landing page and funnel steps for drop-offs or tracking issues.",
        severity: "medium",
      },
    ];
  }

  if (alert.reason === "low_ctr_high_spend") {
    return [
      {
        key: "creative_refresh",
        title: "Creative refresh",
        description: "Improve hook/headline/thumbnail and test multiple variants.",
        severity,
      },
      {
        key: "targeting_review",
        title: "Targeting review",
        description: "Refine targeting and exclude poor placements to raise CTR.",
        severity: "medium",
      },
    ];
  }

  return [
    {
      key: "targeting_review",
      title: "Investigate",
      description: "Review recent changes and isolate what caused the performance regression.",
      severity,
    },
  ];
}

export async function GET(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  const orgId = session?.user?.activeOrgId;
  if (!orgId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { id } = await ctx.params;
  const url = new URL(req.url);
  const parsed = QuerySchema.safeParse({
    windowDays: url.searchParams.get("windowDays") ?? undefined,
  });

  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_params" }, { status: 400 });
  }

  try {
    const analysis = await wasteEvaluator.evaluateOrganization({
      organizationId: orgId,
      windowDays: parsed.data.windowDays,
    });

    const alert = analysis.alerts.find((a) => a.id === id);
    if (!alert) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }

    const spend = microsToDollars(BigInt(alert.spendMicros));

    const explainability = {
      window: {
        start: alert.windowStart.toISOString(),
        end: alert.windowEnd.toISOString(),
        days: parsed.data.windowDays,
      },
      evidence: {
        reason: alert.reason,
        level: alert.level,
        entityType: alert.entityType,
        entityId: alert.entityId,
        platformCode: alert.platformCode,
        spend_usd: spend,
        conversions: alert.conversions,
        cpa_usd: alert.cpa,
        target_cpa_usd: alert.targetCpa,
      },
      message: alert.message,
      recommendation: alert.recommendation,
      debug: {
        generatedAt: new Date().toISOString(),
      },
    };

    return NextResponse.json({
      alert: {
        ...alert,
        spendMicros: alert.spendMicros.toString(),
        windowStart: alert.windowStart.toISOString(),
        windowEnd: alert.windowEnd.toISOString(),
      },
      explainability,
      recommendedActions: recommendedActionsFor(alert),
    });
  } catch (error) {
    console.error("waste alert detail error", error);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
