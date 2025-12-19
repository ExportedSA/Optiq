import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const organizationId = session.user.activeOrgId;

  if (!organizationId) {
    return NextResponse.json({
      state: {
        currentStep: "workspace",
        workspaceCreated: false,
        adsConnected: false,
        trackerInstalled: false,
        targetsSet: false,
      },
      connections: { google: false, meta: false, tiktok: false },
    });
  }

  // Check connections via AdAccount (which tracks connected accounts)
  const adAccounts = await prisma.adAccount.findMany({
    where: { organizationId, status: "ACTIVE" },
    include: { platform: { select: { code: true } } },
  });

  const connectionStatus = {
    google: adAccounts.some((a) => a.platform?.code === "GOOGLE_ADS"),
    meta: adAccounts.some((a) => a.platform?.code === "META"),
    tiktok: adAccounts.some((a) => a.platform?.code === "TIKTOK"),
  };

  // Check tracker
  const trackingSite = await prisma.trackingSite.findFirst({
    where: { organizationId },
    select: { id: true, publicKey: true, domain: true },
  });

  // Check if any events received
  const hasEvents = trackingSite
    ? (await prisma.trackingEvent.count({
        where: { siteId: trackingSite.id },
        take: 1,
      })) > 0
    : false;

  // Get organization settings for targets
  const orgSettings = await prisma.organizationSettings.findUnique({
    where: { organizationId },
    select: { trackingSettings: true },
  });

  const trackingSettings = (orgSettings?.trackingSettings as Record<string, unknown>) || {};
  const hasTargets = trackingSettings.targetCpa !== undefined || trackingSettings.targetRoas !== undefined;

  // Determine current step
  let currentStep = "workspace";
  const workspaceCreated = true; // Already have org
  const adsConnected = connectionStatus.google || connectionStatus.meta || connectionStatus.tiktok;
  const trackerInstalled = hasEvents;
  const targetsSet = hasTargets;

  if (!adsConnected) {
    currentStep = "connect-ads";
  } else if (!trackerInstalled) {
    currentStep = "install-tracker";
  } else if (!targetsSet) {
    currentStep = "set-targets";
  } else {
    currentStep = "first-insights";
  }

  // Generate tracker info if site exists
  let trackerInfo = null;
  if (trackingSite) {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://app.optiq.io";
    trackerInfo = {
      siteKey: trackingSite.publicKey,
      snippet: `<script src="${baseUrl}/t.js?k=${trackingSite.publicKey}" async></script>`,
    };
  }

  return NextResponse.json({
    state: {
      currentStep,
      workspaceCreated,
      adsConnected,
      trackerInstalled,
      targetsSet,
    },
    connections: connectionStatus,
    trackerInfo,
    targets: {
      targetCpa: (trackingSettings.targetCpa as number) || 50,
      targetRoas: (trackingSettings.targetRoas as number) || 3,
    },
  });
}
