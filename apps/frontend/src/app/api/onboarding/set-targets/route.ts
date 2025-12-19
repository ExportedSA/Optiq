import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const organizationId = session.user.activeOrgId;

  if (!organizationId) {
    return NextResponse.json({ error: "No organization" }, { status: 400 });
  }

  const body = await req.json();
  const { targetCpa, targetRoas } = body;

  // Get or create organization settings
  const existingSettings = await prisma.organizationSettings.findUnique({
    where: { organizationId },
  });

  const currentTrackingSettings = (existingSettings?.trackingSettings as Record<string, unknown>) || {};

  // Upsert organization settings with targets
  await prisma.organizationSettings.upsert({
    where: { organizationId },
    create: {
      organizationId,
      trackingSettings: {
        targetCpa: targetCpa || 50,
        targetRoas: targetRoas || 3,
        onboardingCompleted: true,
        onboardingCompletedAt: new Date().toISOString(),
      },
    },
    update: {
      trackingSettings: {
        ...currentTrackingSettings,
        targetCpa: targetCpa || 50,
        targetRoas: targetRoas || 3,
        onboardingCompleted: true,
        onboardingCompletedAt: new Date().toISOString(),
      },
    },
  });

  return NextResponse.json({ success: true });
}
