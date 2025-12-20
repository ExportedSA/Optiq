/**
 * Tracking Sites API
 * 
 * POST /api/tracking-sites - Create new tracking site
 */

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generatePublicKey } from "@/lib/tracking/key-generator";
import { z } from "zod";

export const runtime = "nodejs";

const createSiteSchema = z.object({
  organizationId: z.string(),
  name: z.string().min(1).max(100),
  domain: z.string().min(1).max(255),
});

/**
 * POST /api/tracking-sites
 * Create a new tracking site
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

    // Parse and validate request
    const body = await request.json();
    const validation = createSiteSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid request", details: validation.error.issues },
        { status: 400 }
      );
    }

    const { organizationId, name, domain } = validation.data;

    // Verify user has access to organization
    const membership = await prisma.membership.findFirst({
      where: {
        userId: session.user.id,
        organizationId,
      },
    });

    if (!membership) {
      return NextResponse.json(
        { error: "Access denied" },
        { status: 403 }
      );
    }

    // Generate public key
    const publicKey = generatePublicKey();

    // Create tracking site
    const site = await prisma.trackingSite.create({
      data: {
        organizationId,
        name,
        domain,
        publicKey,
      },
    });

    return NextResponse.json({
      success: true,
      site: {
        id: site.id,
        name: site.name,
        domain: site.domain,
        publicKey: site.publicKey,
      },
    });
  } catch (error) {
    console.error("Failed to create tracking site:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
