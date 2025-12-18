"use server";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  const organizationId = session?.user?.activeOrgId;

  if (!userId || !organizationId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const res = await prisma.inAppNotification.updateMany({
    where: { userId, organizationId, readAt: null },
    data: { status: "read", readAt: new Date() },
  });

  return NextResponse.json({ success: true, updated: res.count });
}
