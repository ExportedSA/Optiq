/**
 * Dashboard KPIs API
 * 
 * GET /api/dashboard/kpis - Get KPI metrics
 */

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

/**
 * GET /api/dashboard/kpis
 * Get aggregated KPI metrics
 */
export async function GET(request: Request) {
  try {
    // Authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const organizationId = session.user.activeOrgId;
    if (!organizationId) {
      return NextResponse.json(
        { error: "No active organization" },
        { status: 400 }
      );
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const fromDate = searchParams.get("fromDate");
    const toDate = searchParams.get("toDate");
    const platform = searchParams.get("platform");
    const attributionModel = searchParams.get("attributionModel") || "LAST_TOUCH";

    if (!fromDate || !toDate) {
      return NextResponse.json(
        { error: "fromDate and toDate are required" },
        { status: 400 }
      );
    }

    // Get platform ID if platform filter is specified
    let platformId: string | undefined;
    if (platform) {
      const platformRecord = await prisma.platform.findFirst({
        where: { code: platform as any },
      });
      platformId = platformRecord?.id;
    }

    // Aggregate KPIs from DailyRollup
    const rollups = await prisma.dailyRollup.findMany({
      where: {
        organizationId,
        date: {
          gte: new Date(fromDate),
          lte: new Date(toDate),
        },
        grain: "ORGANIZATION", // Use org-level rollups for KPIs
        attributionModel: attributionModel as any,
        ...(platformId ? { platformId } : {}),
      },
    });

    // Calculate totals
    const totalSpend = rollups.reduce((sum, r) => sum + Number(r.spendMicros), 0);
    const totalConversions = rollups.reduce((sum, r) => sum + r.conversions, 0);
    const totalConversionValue = rollups.reduce((sum, r) => sum + Number(r.conversionValue || 0), 0);
    const totalWaste = rollups.reduce((sum, r) => sum + Number(r.wasteSpendMicros), 0);

    // Calculate averages
    const avgCpa = totalConversions > 0 ? (totalSpend / 1_000_000) / totalConversions : null;
    const avgRoas = totalSpend > 0 ? (totalConversionValue / 1_000_000) / (totalSpend / 1_000_000) : null;
    const wastePct = totalSpend > 0 ? (totalWaste / totalSpend) * 100 : 0;

    return NextResponse.json({
      totalSpend,
      totalConversions,
      avgCpa,
      avgRoas,
      totalWaste,
      wastePct,
    });
  } catch (error) {
    console.error("Failed to get KPIs:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
