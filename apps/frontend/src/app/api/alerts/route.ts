/**
 * Alerts API Endpoint
 * 
 * GET /api/alerts - Fetch alert inbox for the current organization
 * PATCH /api/alerts - Update alert status (acknowledge, resolve, dismiss)
 */

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

/**
 * GET /api/alerts
 * 
 * Query params:
 * - status: comma-separated list of statuses (TRIGGERED, ACKNOWLEDGED, RESOLVED, DISMISSED)
 * - severity: comma-separated list of severities (INFO, WARNING, CRITICAL)
 * - limit: number of alerts to return (default: 50)
 * - offset: pagination offset (default: 0)
 */
export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const organizationId = session.user.activeOrgId;
  if (!organizationId) {
    return NextResponse.json({ error: "No active organization" }, { status: 400 });
  }

  const { searchParams } = new URL(request.url);
  
  const statusParam = searchParams.get("status");
  const severityParam = searchParams.get("severity");
  const limit = parseInt(searchParams.get("limit") ?? "50", 10);
  const offset = parseInt(searchParams.get("offset") ?? "0", 10);

  const status = statusParam 
    ? statusParam.split(",") as ("TRIGGERED" | "ACKNOWLEDGED" | "RESOLVED" | "DISMISSED")[]
    : undefined;
  
  const severity = severityParam
    ? severityParam.split(",") as ("INFO" | "WARNING" | "CRITICAL")[]
    : undefined;

  try {
    const result = await getAlertInbox({
      organizationId,
      status,
      severity,
      limit,
      offset,
    });

    return NextResponse.json({
      success: true,
      data: result.alerts,
      pagination: {
        total: result.total,
        limit,
        offset,
        hasMore: offset + result.alerts.length < result.total,
      },
    });
  } catch (error) {
    console.error("Failed to fetch alerts:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch alerts" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/alerts
 * 
 * Body:
 * - alertId: string
 * - action: "acknowledge" | "resolve" | "dismiss"
 */
export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const organizationId = session.user.activeOrgId;
  if (!organizationId) {
    return NextResponse.json({ error: "No active organization" }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { alertId, action } = body;

    if (!alertId || !action) {
      return NextResponse.json(
        { error: "Missing alertId or action" },
        { status: 400 }
      );
    }

    const userId = session.user.id;

    // Verify alert belongs to organization
    const alert = await prisma.alertEvent.findFirst({
      where: {
        id: alertId,
        organizationId,
      },
    });

    if (!alert) {
      return NextResponse.json(
        { error: "Alert not found" },
        { status: 404 }
      );
    }

    // Update alert based on action
    switch (action) {
      case "acknowledge":
        await prisma.alertEvent.update({
          where: { id: alertId },
          data: {
            status: "ACKNOWLEDGED",
            acknowledgedAt: new Date(),
            acknowledgedBy: userId,
          },
        });
        break;
      case "resolve":
        await prisma.alertEvent.update({
          where: { id: alertId },
          data: {
            status: "RESOLVED",
            resolvedAt: new Date(),
            resolvedBy: userId,
          },
        });
        break;
      case "dismiss":
        await prisma.alertEvent.update({
          where: { id: alertId },
          data: {
            status: "DISMISSED",
            dismissedAt: new Date(),
            dismissedBy: userId,
          },
        });
        break;
      default:
        return NextResponse.json(
          { error: "Invalid action. Must be acknowledge, resolve, or dismiss" },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      message: `Alert ${action}d successfully`,
    });
  } catch (error) {
    console.error("Failed to update alert:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update alert" },
      { status: 500 }
    );
  }
}
