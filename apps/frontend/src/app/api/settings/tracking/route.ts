/**
 * Tracking Settings API
 * 
 * PUT /api/settings/tracking - Update tracking settings (CPA/ROAS targets)
 */

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export const runtime = "nodejs";

const updateSettingsSchema = z.object({
  targetCpa: z.number().positive().optional(),
  targetRoas: z.number().positive().optional(),
});

/**
 * PUT /api/settings/tracking
 * Update tracking settings
 */
export async function PUT(request: Request) {
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

    // Parse and validate request
    const body = await request.json();
    const validation = updateSettingsSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid request", details: validation.error.issues },
        { status: 400 }
      );
    }

    const { targetCpa, targetRoas } = validation.data;

    // Get or create settings
    let settings = await prisma.organizationSettings.findUnique({
      where: { organizationId },
    });

    if (!settings) {
      settings = await prisma.organizationSettings.create({
        data: {
          organizationId,
          trackingSettings: {},
        },
      });
    }

    // Update tracking settings
    const currentSettings = (settings.trackingSettings as any) || {};
    const updatedSettings = {
      ...currentSettings,
      ...(targetCpa !== undefined ? { targetCpa } : {}),
      ...(targetRoas !== undefined ? { targetRoas } : {}),
    };

    await prisma.organizationSettings.update({
      where: { organizationId },
      data: {
        trackingSettings: updatedSettings,
      },
    });

    return NextResponse.json({
      success: true,
      settings: updatedSettings,
    });
  } catch (error) {
    console.error("Failed to update tracking settings:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
