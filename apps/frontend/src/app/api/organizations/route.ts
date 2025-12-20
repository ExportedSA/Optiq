/**
 * Organizations API
 * 
 * POST /api/organizations - Create new organization
 */

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export const runtime = "nodejs";

const createOrgSchema = z.object({
  name: z.string().min(1).max(100),
});

/**
 * POST /api/organizations
 * Create a new organization
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
    const validation = createOrgSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid request", details: validation.error.issues },
        { status: 400 }
      );
    }

    const { name } = validation.data;

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      + "-" + Math.random().toString(36).substring(2, 8);

    // Create organization
    const organization = await prisma.organization.create({
      data: {
        name,
        slug,
      },
    });

    // Create membership
    await prisma.membership.create({
      data: {
        userId: session.user.id,
        organizationId: organization.id,
        role: "OWNER",
      },
    });

    // Create settings
    await prisma.organizationSettings.create({
      data: {
        organizationId: organization.id,
        alertSettings: {},
        attributionSettings: {},
        trackingSettings: {},
      },
    });

    // Set as active organization for user
    await prisma.user.update({
      where: { id: session.user.id },
      data: { activeOrgId: organization.id },
    });

    return NextResponse.json({
      success: true,
      organization: {
        id: organization.id,
        name: organization.name,
        slug: organization.slug,
      },
    });
  } catch (error) {
    console.error("Failed to create organization:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
