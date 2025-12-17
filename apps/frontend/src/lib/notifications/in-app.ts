import "server-only";

import { prisma } from "@/lib/prisma";
import type {
  NotificationPayload,
  NotificationResult,
  NotificationChannelHandler,
  InAppNotification,
  NotificationStatus,
} from "./types";

export class InAppChannelHandler implements NotificationChannelHandler {
  readonly channel = "in_app" as const;

  async send(payload: NotificationPayload): Promise<NotificationResult> {
    try {
      const userIds = await this.getRecipientUserIds(payload);

      if (userIds.length === 0) {
        return {
          success: false,
          channel: this.channel,
          notificationId: payload.id,
          error: "No recipient users found",
        };
      }

      await prisma.inAppNotification.createMany({
        data: userIds.map((userId) => ({
          id: `${payload.id}_${userId}`,
          organizationId: payload.organizationId,
          userId,
          title: payload.title,
          message: payload.message,
          priority: payload.priority,
          status: "pending" as NotificationStatus,
          actionUrl: payload.actionUrl,
          metadata: payload.metadata,
        })),
        skipDuplicates: true,
      });

      return {
        success: true,
        channel: this.channel,
        notificationId: payload.id,
        sentAt: new Date(),
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      console.error("[InAppChannel] Failed to create notification:", message);
      return {
        success: false,
        channel: this.channel,
        notificationId: payload.id,
        error: message,
      };
    }
  }

  private async getRecipientUserIds(payload: NotificationPayload): Promise<string[]> {
    if (payload.userId) {
      return [payload.userId];
    }

    const memberships = await prisma.membership.findMany({
      where: { organizationId: payload.organizationId },
      select: { userId: true },
    });

    return memberships.map((m: { userId: string }) => m.userId);
  }
}

export const inAppChannelHandler = new InAppChannelHandler();

export async function getUnreadNotifications(params: {
  userId: string;
  organizationId?: string;
  limit?: number;
}): Promise<InAppNotification[]> {
  const notifications = await prisma.inAppNotification.findMany({
    where: {
      userId: params.userId,
      ...(params.organizationId ? { organizationId: params.organizationId } : {}),
      status: { in: ["pending", "sent"] },
      readAt: null,
    },
    orderBy: { createdAt: "desc" },
    take: params.limit ?? 20,
  });

  return notifications.map((n: typeof notifications[number]) => ({
    id: n.id,
    organizationId: n.organizationId,
    userId: n.userId,
    title: n.title,
    message: n.message,
    priority: n.priority as InAppNotification["priority"],
    status: n.status as NotificationStatus,
    actionUrl: n.actionUrl ?? undefined,
    metadata: (n.metadata as Record<string, unknown>) ?? {},
    createdAt: n.createdAt,
    readAt: n.readAt,
  }));
}

export async function markNotificationRead(params: {
  notificationId: string;
  userId: string;
}): Promise<boolean> {
  try {
    await prisma.inAppNotification.update({
      where: {
        id: params.notificationId,
        userId: params.userId,
      },
      data: {
        status: "read",
        readAt: new Date(),
      },
    });
    return true;
  } catch {
    return false;
  }
}

export async function markAllNotificationsRead(params: {
  userId: string;
  organizationId?: string;
}): Promise<number> {
  const result = await prisma.inAppNotification.updateMany({
    where: {
      userId: params.userId,
      ...(params.organizationId ? { organizationId: params.organizationId } : {}),
      readAt: null,
    },
    data: {
      status: "read",
      readAt: new Date(),
    },
  });

  return result.count;
}

export async function getNotificationCount(params: {
  userId: string;
  organizationId?: string;
}): Promise<number> {
  return prisma.inAppNotification.count({
    where: {
      userId: params.userId,
      ...(params.organizationId ? { organizationId: params.organizationId } : {}),
      readAt: null,
    },
  });
}
