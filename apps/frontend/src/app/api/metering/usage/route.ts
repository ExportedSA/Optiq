import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import {
  getThrottleStatus,
  getPeriodEventCount,
  getDailyUsage,
  getOrganizationLimits,
} from "@/lib/metering";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  const orgId = session?.user?.activeOrgId;

  if (!orgId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const days = parseInt(url.searchParams.get("days") ?? "30", 10);

  const [throttleStatus, periodEventCount, limits] = await Promise.all([
    getThrottleStatus(orgId),
    getPeriodEventCount(orgId),
    getOrganizationLimits(orgId),
  ]);

  // Get daily breakdown
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const dailyUsage = await getDailyUsage(orgId, startDate, endDate);

  return NextResponse.json({
    throttleStatus,
    periodEventCount,
    limits,
    dailyUsage,
  });
}
