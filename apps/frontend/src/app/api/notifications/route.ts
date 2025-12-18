"use server";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const QuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(50),
  includeRead: z.coerce.boolean().default(false),
});

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  const organizationId = session?.user?.activeOrgId;

  if (!userId || !organizationId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const parsed = QuerySchema.safeParse({
    limit: url.searchParams.get("limit") ?? undefined,
    includeRead: url.searchParams.get("includeRead") ?? undefined,
  });

  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_params" }, { status: 400 });
  }

  const notifications = await prisma.inAppNotification.findMany({
    where: {
      userId,
      organizationId,
      ...(parsed.data.includeRead ? {} : { readAt: null }),
    },
    orderBy: { createdAt: "desc" },
    take: parsed.data.limit,
  });

  return NextResponse.json({
    notifications: notifications.map((n) => ({
      id: n.id,
      title: n.title,
      message: n.message,
      priority: n.priority,
      status: n.status,
      actionUrl: n.actionUrl,
      metadata: n.metadata,
      createdAt: n.createdAt.toISOString(),
      readAt: n.readAt ? n.readAt.toISOString() : null,
    })),
  });
}
