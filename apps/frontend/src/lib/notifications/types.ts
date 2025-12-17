import "server-only";

export type NotificationChannel = "email" | "in_app" | "webhook";

export type NotificationStatus = "pending" | "sent" | "failed" | "read";

export type NotificationPriority = "low" | "normal" | "high" | "urgent";

export interface NotificationPayload {
  id: string;
  organizationId: string;
  userId?: string;
  channel: NotificationChannel;
  priority: NotificationPriority;
  title: string;
  message: string;
  metadata: Record<string, unknown>;
  actionUrl?: string;
  createdAt: Date;
}

export interface InAppNotification {
  id: string;
  organizationId: string;
  userId: string;
  title: string;
  message: string;
  priority: NotificationPriority;
  status: NotificationStatus;
  actionUrl?: string;
  metadata: Record<string, unknown>;
  createdAt: Date;
  readAt: Date | null;
}

export interface EmailNotification {
  to: string;
  subject: string;
  htmlBody: string;
  textBody: string;
  priority: NotificationPriority;
  metadata: Record<string, unknown>;
}

export interface NotificationResult {
  success: boolean;
  channel: NotificationChannel;
  notificationId: string;
  error?: string;
  sentAt?: Date;
}

export interface NotificationChannelHandler {
  channel: NotificationChannel;
  send(payload: NotificationPayload): Promise<NotificationResult>;
}

export function priorityToNumber(priority: NotificationPriority): number {
  switch (priority) {
    case "low": return 0;
    case "normal": return 1;
    case "high": return 2;
    case "urgent": return 3;
    default: return 1;
  }
}

export function severityToPriority(severity: string): NotificationPriority {
  switch (severity) {
    case "info": return "low";
    case "warning": return "high";
    case "critical": return "urgent";
    default: return "normal";
  }
}
