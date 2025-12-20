/**
 * Tracking Site Detail API
 * 
 * GET /api/sites/[siteId] - Get site details
 * PATCH /api/sites/[siteId] - Update site
 * DELETE /api/sites/[siteId] - Delete site
 */

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateInstallInstructions } from "@/lib/tracking/snippet-generator";

export const runtime = "nodejs";

const updateSiteSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  domain: z.string().min(1).max(255)
    .regex(/^[a-zA-Z0-9][a-zA-Z0-9-_.]*[a-zA-Z0-9]$/)
    .optional(),
});

/**
 * GET /api/sites/[siteId]
 * Get tracking site details with installation instructions
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ siteId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const organizationId = session.user.activeOrgId;
    if (!organizationId) {
      return NextResponse.json({ error: "No active organization" }, { status: 400 });
    }

    const { siteId } = await params;

    // Get site and verify ownership
    const site = await prisma.trackingSite.findFirst({
      where: {
        id: siteId,
        organizationId,
      },
      select: {
        id: true,
        name: true,
        domain: true,
        publicKey: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            events: true,
            touchPoints: true,
          },
        },
      },
    });

    if (!site) {
      return NextResponse.json({ error: "Site not found" }, { status: 404 });
    }

    // Generate installation instructions
    const instructions = generateInstallInstructions({
      publicKey: site.publicKey,
      domain: site.domain,
    });

    return NextResponse.json({
      success: true,
      site: {
        id: site.id,
        name: site.name,
        domain: site.domain,
        publicKey: site.publicKey,
        createdAt: site.createdAt,
        updatedAt: site.updatedAt,
        stats: {
          totalEvents: site._count.events,
          totalTouchPoints: site._count.touchPoints,
        },
      },
      installation: instructions,
    });
  } catch (error) {
    console.error("Failed to get tracking site:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * PATCH /api/sites/[siteId]
 * Update tracking site
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ siteId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const organizationId = session.user.activeOrgId;
    if (!organizationId) {
      return NextResponse.json({ error: "No active organization" }, { status: 400 });
    }

    const { siteId } = await params;

    // RBAC: Check permissions
    const membership = await prisma.membership.findUnique({
      where: {
        userId_organizationId: {
          userId: session.user.id,
          organizationId,
        },
      },
    });

    if (!membership || !["OWNER", "ADMIN"].includes(membership.role)) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    // Verify site exists and belongs to organization
    const existingSite = await prisma.trackingSite.findFirst({
      where: {
        id: siteId,
        organizationId,
      },
    });

    if (!existingSite) {
      return NextResponse.json({ error: "Site not found" }, { status: 404 });
    }

    // Validate request body
    const body = await request.json();
    const validation = updateSiteSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.error.errors },
        { status: 400 }
      );
    }

    // Update site
    const updatedSite = await prisma.trackingSite.update({
      where: { id: siteId },
      data: validation.data,
      select: {
        id: true,
        name: true,
        domain: true,
        publicKey: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      site: updatedSite,
    });
  } catch (error) {
    console.error("Failed to update tracking site:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * DELETE /api/sites/[siteId]
 * Delete tracking site
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ siteId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const organizationId = session.user.activeOrgId;
    if (!organizationId) {
      return NextResponse.json({ error: "No active organization" }, { status: 400 });
    }

    const { siteId } = await params;

    // RBAC: Only OWNER can delete sites
    const membership = await prisma.membership.findUnique({
      where: {
        userId_organizationId: {
          userId: session.user.id,
          organizationId,
        },
      },
    });

    if (!membership || membership.role !== "OWNER") {
      return NextResponse.json(
        { error: "Only organization owners can delete tracking sites" },
        { status: 403 }
      );
    }

    // Verify site exists and belongs to organization
    const site = await prisma.trackingSite.findFirst({
      where: {
        id: siteId,
        organizationId,
      },
    });

    if (!site) {
      return NextResponse.json({ error: "Site not found" }, { status: 404 });
    }

    // Delete site (cascade will delete related events and touchpoints)
    await prisma.trackingSite.delete({
      where: { id: siteId },
    });

    return NextResponse.json({
      success: true,
      message: "Tracking site deleted successfully",
    });
  } catch (error) {
    console.error("Failed to delete tracking site:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
