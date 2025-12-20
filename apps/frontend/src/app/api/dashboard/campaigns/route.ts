/**
 * Dashboard Campaigns API
 * 
 * GET /api/dashboard/campaigns - Get campaign/adset/ad performance data
 */

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

/**
 * GET /api/dashboard/campaigns
 * Get campaign performance data by grain
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
    const grain = searchParams.get("grain") || "CAMPAIGN";

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

    // Get rollups by grain
    const rollups = await prisma.dailyRollup.findMany({
      where: {
        organizationId,
        date: {
          gte: new Date(fromDate),
          lte: new Date(toDate),
        },
        grain: grain as any,
        attributionModel: attributionModel as any,
        ...(platformId ? { platformId } : {}),
      },
      include: {
        platform: {
          select: { name: true },
        },
        campaign: {
          select: { name: true },
        },
      },
    });

    // Group by entity (campaign/adset/ad)
    const grouped = new Map<string, any>();

    for (const rollup of rollups) {
      let key: string;
      let name: string;

      switch (grain) {
        case "CAMPAIGN":
          key = rollup.campaignId || "unknown";
          name = rollup.campaign?.name || "Unknown Campaign";
          break;
        case "ADSET":
          key = rollup.adsetId || "unknown";
          name = `Adset ${rollup.adsetId || "Unknown"}`;
          break;
        case "AD":
          key = rollup.adId || "unknown";
          name = `Ad ${rollup.adId || "Unknown"}`;
          break;
        default:
          continue;
      }

      if (!grouped.has(key)) {
        grouped.set(key, {
          id: key,
          grain,
          name,
          platformName: rollup.platform?.name || "Unknown",
          spend: 0,
          conversions: 0,
          conversionValue: 0,
          waste: 0,
        });
      }

      const group = grouped.get(key)!;
      group.spend += Number(rollup.spendMicros);
      group.conversions += rollup.conversions;
      group.conversionValue += Number(rollup.conversionValue || 0);
      group.waste += Number(rollup.wasteSpendMicros);
    }

    // Calculate derived metrics
    const data = Array.from(grouped.values()).map(row => {
      const spendDollars = row.spend / 1_000_000;
      const revenueDollars = row.conversionValue / 1_000_000;
      
      return {
        ...row,
        cpa: row.conversions > 0 ? spendDollars / row.conversions : null,
        roas: spendDollars > 0 ? revenueDollars / spendDollars : null,
        wastePct: row.spend > 0 ? (row.waste / row.spend) * 100 : 0,
      };
    });

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Failed to get campaign data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
