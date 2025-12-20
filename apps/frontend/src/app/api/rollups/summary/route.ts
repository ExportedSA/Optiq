/**
 * Rollups Summary API
 * 
 * GET /api/rollups/summary - Get summary of rollup data
 */

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

/**
 * GET /api/rollups/summary
 * Get summary statistics from daily rollups
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

    // Get rollup count
    const totalRollups = await prisma.dailyRollup.count({
      where: { organizationId },
    });

    if (totalRollups === 0) {
      return NextResponse.json({
        totalRollups: 0,
        totalSpend: 0,
        totalConversions: 0,
        avgCpa: 0,
        avgRoas: 0,
      });
    }

    // Get aggregated stats
    const stats = await prisma.dailyRollup.aggregate({
      where: {
        organizationId,
        grain: "ORGANIZATION", // Use org-level rollups for summary
      },
      _sum: {
        spendMicros: true,
        conversions: true,
        conversionValue: true,
      },
      _avg: {
        cpa: true,
        roas: true,
      },
    });

    return NextResponse.json({
      totalRollups,
      totalSpend: Number(stats._sum.spendMicros || 0),
      totalConversions: stats._sum.conversions || 0,
      totalRevenue: Number(stats._sum.conversionValue || 0),
      avgCpa: stats._avg.cpa || 0,
      avgRoas: stats._avg.roas || 0,
    });
  } catch (error) {
    console.error("Failed to get rollups summary:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
