/**
 * Waste API
 * 
 * GET /api/waste - Get waste entities with explainability
 */

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateWasteExplanation, calculateWasteSeverity, getSeverityLevel } from "@/lib/waste/explainability";
import type { WasteEntity } from "@/lib/waste/explainability";

export const runtime = "nodejs";

// Query parameters schema
const querySchema = z.object({
  dateRange: z.string().optional(), // Format: "2024-01-01,2024-01-31"
  grain: z.enum(["ORGANIZATION", "PLATFORM", "CAMPAIGN", "ADSET", "AD"]).optional(),
  attributionModel: z.enum(["FIRST_TOUCH", "LAST_TOUCH", "LINEAR", "TIME_DECAY", "POSITION_BASED"]).optional(),
  minWasteSpend: z.string().optional(), // Minimum waste spend in dollars
  severity: z.enum(["low", "medium", "high"]).optional(),
  limit: z.string().optional(),
});

/**
 * GET /api/waste
 * Get waste entities with explainability
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
    const params = {
      dateRange: searchParams.get("dateRange") || undefined,
      grain: searchParams.get("grain") || undefined,
      attributionModel: searchParams.get("attributionModel") || undefined,
      minWasteSpend: searchParams.get("minWasteSpend") || undefined,
      severity: searchParams.get("severity") || undefined,
      limit: searchParams.get("limit") || undefined,
    };

    const validation = querySchema.safeParse(params);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid query parameters", details: validation.error.issues },
        { status: 400 }
      );
    }

    const { dateRange, grain, attributionModel, minWasteSpend, severity, limit } = validation.data;

    // Parse date range
    let startDate: Date | undefined;
    let endDate: Date | undefined;

    if (dateRange) {
      const [start, end] = dateRange.split(",");
      if (start && end) {
        startDate = new Date(start);
        endDate = new Date(end);
      }
    } else {
      // Default to last 30 days
      endDate = new Date();
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);
    }

    // Get organization settings for targets
    const orgSettings = await prisma.organizationSettings.findUnique({
      where: { organizationId },
      select: { trackingSettings: true },
    });

    const trackingSettings = orgSettings?.trackingSettings as any;
    const targetCpa = trackingSettings?.targetCpa;
    const targetRoas = trackingSettings?.targetRoas;

    // Query waste rollups
    const minWasteSpendMicros = minWasteSpend 
      ? BigInt(Math.round(parseFloat(minWasteSpend) * 1_000_000))
      : BigInt(0);

    const rollups = await prisma.dailyRollup.findMany({
      where: {
        organizationId,
        date: {
          gte: startDate,
          lte: endDate,
        },
        wasteSpendMicros: {
          gt: minWasteSpendMicros,
        },
        ...(grain ? { grain } : {}),
        ...(attributionModel ? { attributionModel } : {}),
      },
      include: {
        platform: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        campaign: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: [
        { wasteSpendMicros: "desc" },
        { date: "desc" },
      ],
      take: limit ? parseInt(limit) : 100,
    });

    // Transform to waste entities with explainability
    const wasteEntities: WasteEntity[] = [];

    for (const rollup of rollups) {
      const wasteSpend = Number(rollup.wasteSpendMicros) / 1_000_000;
      const totalSpend = Number(rollup.spendMicros) / 1_000_000;

      // Generate explanation
      const explanation = generateWasteExplanation({
        date: rollup.date,
        spendMicros: rollup.spendMicros,
        conversions: rollup.conversions,
        cpa: rollup.cpa,
        roas: rollup.roas,
        attributionModel: rollup.attributionModel,
        targetCpa,
        targetRoas,
      });

      // Calculate severity score
      const severityScore = calculateWasteSeverity(
        wasteSpend,
        totalSpend,
        rollup.wastePct
      );
      const severityLevel = getSeverityLevel(severityScore);

      // Skip if severity filter doesn't match
      if (severity && severityLevel !== severity) {
        continue;
      }

      // Update explanation severity
      explanation.severity = severityLevel;

      // Determine entity type and name
      let entityType: WasteEntity["type"];
      let entityName: string;

      switch (rollup.grain) {
        case "ORGANIZATION":
          entityType = "organization";
          entityName = "Organization Total";
          break;
        case "PLATFORM":
          entityType = "platform";
          entityName = rollup.platform?.name || "Unknown Platform";
          break;
        case "CAMPAIGN":
          entityType = "campaign";
          entityName = rollup.campaign?.name || "Unknown Campaign";
          break;
        case "ADSET":
          entityType = "adset";
          entityName = `Adset ${rollup.adsetId || "Unknown"}`;
          break;
        case "AD":
          entityType = "ad";
          entityName = `Ad ${rollup.adId || "Unknown"}`;
          break;
        default:
          entityType = "organization";
          entityName = "Unknown";
      }

      wasteEntities.push({
        id: rollup.id,
        type: entityType,
        name: entityName,
        grain: rollup.grain,
        date: rollup.date,
        wasteSpend,
        totalSpend,
        wastePct: rollup.wastePct,
        explanation,
      });
    }

    // Calculate summary statistics
    const summary = {
      totalWasteEntities: wasteEntities.length,
      totalWasteSpend: wasteEntities.reduce((sum, e) => sum + e.wasteSpend, 0),
      averageWastePct: wasteEntities.length > 0
        ? wasteEntities.reduce((sum, e) => sum + e.wastePct, 0) / wasteEntities.length
        : 0,
      bySeverity: {
        high: wasteEntities.filter(e => e.explanation.severity === "high").length,
        medium: wasteEntities.filter(e => e.explanation.severity === "medium").length,
        low: wasteEntities.filter(e => e.explanation.severity === "low").length,
      },
      byReason: {
        no_conversions: wasteEntities.filter(e => e.explanation.reason === "no_conversions").length,
        high_cpa: wasteEntities.filter(e => e.explanation.reason === "high_cpa").length,
        low_roas: wasteEntities.filter(e => e.explanation.reason === "low_roas").length,
      },
    };

    return NextResponse.json({
      success: true,
      dateRange: {
        startDate: startDate?.toISOString().split("T")[0],
        endDate: endDate?.toISOString().split("T")[0],
      },
      summary,
      entities: wasteEntities,
    });

  } catch (error) {
    console.error("Failed to get waste entities:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
