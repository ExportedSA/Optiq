import crypto from "node:crypto";

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

  // Check if site already exists
  let trackingSite = await prisma.trackingSite.findFirst({
    where: { organizationId },
  });

  if (!trackingSite) {
    // Get organization for domain
    const org = await prisma.organization.findUnique({
      where: { id: organizationId },
      select: { name: true, slug: true },
    });

    // Generate a unique public key
    const publicKey = `site_${crypto.randomBytes(16).toString("hex")}`;

    trackingSite = await prisma.trackingSite.create({
      data: {
        organizationId,
        name: `${org?.name || "Default"} Website`,
        domain: `${org?.slug || "example"}.com`,
        publicKey,
      },
    });
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://app.optiq.io";
  const snippet = `<script src="${baseUrl}/t.js?k=${trackingSite.publicKey}" async></script>`;

  return NextResponse.json({
    siteKey: trackingSite.publicKey,
    snippet,
  });
}
