/**
 * Integrations API
 * 
 * GET /api/integrations - List all integration connections for organization
 */

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

/**
 * GET /api/integrations
 * List all integration connections for the current organization
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

    // Query parameters
    const { searchParams } = new URL(request.url);
    const platformCode = searchParams.get("platform");
    const status = searchParams.get("status");

    // Fetch connections
    const connections = await prisma.integrationConnection.findMany({
      where: {
        organizationId,
        ...(platformCode ? { platformCode: platformCode as any } : {}),
        ...(status ? { status: status as any } : {}),
      },
      select: {
        id: true,
        platformCode: true,
        externalAccountId: true,
        externalAccountName: true,
        currency: true,
        timezone: true,
        status: true,
        accessTokenExpiresAt: true,
        scope: true,
        metadata: true,
        createdAt: true,
        updatedAt: true,
        // Don't expose encrypted tokens
      },
      orderBy: [
        { platformCode: "asc" },
        { externalAccountName: "asc" },
      ],
    });

    // Group by platform
    const grouped = connections.reduce((acc, conn) => {
      if (!acc[conn.platformCode]) {
        acc[conn.platformCode] = [];
      }
      acc[conn.platformCode].push(conn);
      return acc;
    }, {} as Record<string, typeof connections>);

    // Calculate summary
    const summary = {
      total: connections.length,
      byPlatform: Object.entries(grouped).map(([platform, conns]) => ({
        platform,
        count: conns.length,
        connected: conns.filter(c => c.status === "CONNECTED").length,
        disconnected: conns.filter(c => c.status === "DISCONNECTED").length,
        error: conns.filter(c => c.status === "ERROR").length,
      })),
      byStatus: {
        connected: connections.filter(c => c.status === "CONNECTED").length,
        disconnected: connections.filter(c => c.status === "DISCONNECTED").length,
        error: connections.filter(c => c.status === "ERROR").length,
      },
    };

    return NextResponse.json({
      success: true,
      summary,
      connections,
      grouped,
    });
  } catch (error) {
    console.error("Failed to fetch integrations:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
