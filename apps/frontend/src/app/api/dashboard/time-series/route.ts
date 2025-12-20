/**
 * Dashboard Time Series API
 * 
 * GET /api/dashboard/time-series - Get time series data
 */

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

/**
 * GET /api/dashboard/time-series
 * Get daily time series data
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

    // Get daily rollups
    const rollups = await prisma.dailyRollup.findMany({
      where: {
        organizationId,
        date: {
          gte: new Date(fromDate),
          lte: new Date(toDate),
        },
        grain: "ORGANIZATION",
        attributionModel: attributionModel as any,
        ...(platformId ? { platformId } : {}),
      },
      orderBy: { date: "asc" },
    });

    // Transform to time series format
    const data = rollups.map(r => ({
      date: r.date.toISOString().split("T")[0],
      spend: Number(r.spendMicros),
      conversions: r.conversions,
      waste: Number(r.wasteSpendMicros),
    }));

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Failed to get time series:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
