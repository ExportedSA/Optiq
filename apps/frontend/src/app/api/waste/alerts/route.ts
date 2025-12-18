"use server";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";

import { authOptions } from "@/lib/auth";
import { wasteEvaluator } from "@/lib/waste";

const QuerySchema = z.object({
  windowDays: z.coerce.number().int().min(1).max(90).default(7),
  level: z.string().optional(),
  reason: z.string().optional(),
  entityType: z.string().optional(),
  platformCode: z.string().optional(),
  sortBy: z.enum(["spend", "level", "reason", "entityName"]).default("spend"),
  sortDir: z.enum(["asc", "desc"]).default("desc"),
});

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  const orgId = session?.user?.activeOrgId;
  if (!orgId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const parsed = QuerySchema.safeParse({
    windowDays: url.searchParams.get("windowDays") ?? undefined,
    level: url.searchParams.get("level") ?? undefined,
    reason: url.searchParams.get("reason") ?? undefined,
    entityType: url.searchParams.get("entityType") ?? undefined,
    platformCode: url.searchParams.get("platformCode") ?? undefined,
    sortBy: url.searchParams.get("sortBy") ?? "spend",
    sortDir: url.searchParams.get("sortDir") ?? "desc",
  });

  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_params" }, { status: 400 });
  }

  const { windowDays, level, reason, entityType, platformCode, sortBy, sortDir } = parsed.data;

  try {
    const analysis = await wasteEvaluator.evaluateOrganization({
      organizationId: orgId,
      windowDays,
    });

    let alerts = analysis.alerts;

    if (level) alerts = alerts.filter((a) => a.level === level);
    if (reason) alerts = alerts.filter((a) => a.reason === reason);
    if (entityType) alerts = alerts.filter((a) => a.entityType === entityType);
    if (platformCode) alerts = alerts.filter((a) => a.platformCode === platformCode);

    const levelRank: Record<string, number> = {
      none: 0,
      low: 1,
      medium: 2,
      high: 3,
      critical: 4,
    };

    alerts = [...alerts].sort((a, b) => {
      let cmp = 0;
      if (sortBy === "spend") cmp = Number(a.spendMicros - b.spendMicros);
      if (sortBy === "level") cmp = (levelRank[a.level] ?? 0) - (levelRank[b.level] ?? 0);
      if (sortBy === "reason") cmp = a.reason.localeCompare(b.reason);
      if (sortBy === "entityName") cmp = a.entityName.localeCompare(b.entityName);
      return sortDir === "asc" ? cmp : -cmp;
    });

    return NextResponse.json({
      window: {
        start: analysis.windowStart.toISOString(),
        end: analysis.windowEnd.toISOString(),
        days: windowDays,
      },
      totals: {
        totalWastedSpendMicros: analysis.totalWastedSpendMicros.toString(),
        byLevel: analysis.byLevel,
        byReason: analysis.byReason,
        byEntityType: analysis.byEntityType,
      },
      alerts: alerts.map((a) => ({
        ...a,
        spendMicros: a.spendMicros.toString(),
        windowStart: a.windowStart.toISOString(),
        windowEnd: a.windowEnd.toISOString(),
      })),
    });
  } catch (error) {
    console.error("waste alerts list error", error);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
