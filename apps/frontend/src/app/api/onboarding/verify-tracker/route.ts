import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const organizationId = session.user.activeOrgId;

  if (!organizationId) {
    return NextResponse.json({ error: "No organization" }, { status: 400 });
  }

  // Check if any events have been received
  const trackingSite = await prisma.trackingSite.findFirst({
    where: { organizationId },
  });

  if (!trackingSite) {
    return NextResponse.json({ verified: false, reason: "No tracking site configured" });
  }

  const eventCount = await prisma.trackingEvent.count({
    where: { siteId: trackingSite.id },
    take: 1,
  });

  return NextResponse.json({
    verified: eventCount > 0,
    reason: eventCount > 0 ? "Events received" : "No events received yet",
  });
}
