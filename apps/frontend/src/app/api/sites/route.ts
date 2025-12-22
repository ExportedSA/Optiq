/**
 * Tracking Sites API
 * 
 * POST /api/sites - Create a new tracking site
 * GET /api/sites - List tracking sites for organization
 */

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generatePublicKey } from "@/lib/tracking/key-generator";
import { generateInstallInstructions } from "@/lib/tracking/snippet-generator";

export const runtime = "nodejs";

// Validation schema
const createSiteSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  domain: z.string().min(1, "Domain is required").max(255, "Domain too long")
    .regex(/^[a-zA-Z0-9][a-zA-Z0-9-_.]*[a-zA-Z0-9]$/, "Invalid domain format"),
});

/**
 * POST /api/sites
 * Create a new tracking site
 * 
 * RBAC: Only organization members can create sites
 */
export async function POST(request: Request) {
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

    // RBAC: Verify user is a member of the organization
    const membership = await prisma.membership.findUnique({
      where: {
        userId_organizationId: {
          userId: session.user.id,
          organizationId,
        },
      },
      select: { role: true },
    });

    if (!membership) {
      return NextResponse.json(
        { error: "Not a member of this organization" },
        { status: 403 }
      );
    }

    // Only OWNER and ADMIN can create sites
    if (!["OWNER", "ADMIN"].includes(membership.role)) {
      return NextResponse.json(
        { error: "Insufficient permissions. Only owners and admins can create tracking sites." },
        { status: 403 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validation = createSiteSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { 
          error: "Validation failed",
          details: validation.error.issues 
        },
        { status: 400 }
      );
    }

    const { name, domain } = validation.data;

    // Check if domain already exists for this organization
    const existingSite = await prisma.trackingSite.findFirst({
      where: {
        organizationId,
        domain,
      },
    });

    if (existingSite) {
      return NextResponse.json(
        { error: "A tracking site with this domain already exists" },
        { status: 409 }
      );
    }

    // Generate secure public key
    let publicKey = generatePublicKey();
    
    // Ensure uniqueness (extremely unlikely collision, but be safe)
    let attempts = 0;
    while (attempts < 5) {
      const existing = await prisma.trackingSite.findUnique({
        where: { publicKey },
      });
      
      if (!existing) break;
      
      publicKey = generatePublicKey();
      attempts++;
    }

    if (attempts >= 5) {
      return NextResponse.json(
        { error: "Failed to generate unique key. Please try again." },
        { status: 500 }
      );
    }

    // Create tracking site
    const site = await prisma.trackingSite.create({
      data: {
        organizationId,
        name,
        domain,
        publicKey,
      },
      select: {
        id: true,
        name: true,
        domain: true,
        publicKey: true,
        createdAt: true,
      },
    });

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
      },
      installation: instructions,
    }, { status: 201 });

  } catch (error) {
    console.error("Failed to create tracking site:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/sites
 * List tracking sites for the current organization
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

    // RBAC: Verify user is a member of the organization
    const membership = await prisma.membership.findUnique({
      where: {
        userId_organizationId: {
          userId: session.user.id,
          organizationId,
        },
      },
    });

    if (!membership) {
      return NextResponse.json(
        { error: "Not a member of this organization" },
        { status: 403 }
      );
    }

    // Get all sites for the organization
    const sites = await prisma.trackingSite.findMany({
      where: { organizationId },
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
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      sites: sites.map(site => ({
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
      })),
    });

  } catch (error) {
    console.error("Failed to list tracking sites:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
