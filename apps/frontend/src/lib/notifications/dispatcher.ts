import "server-only";

import type {
  NotificationPayload,
  NotificationResult,
  NotificationChannel,
  NotificationChannelHandler,
  NotificationPriority,
} from "./types";
import { severityToPriority } from "./types";
import { emailChannelHandler } from "./email";
import { inAppChannelHandler } from "./in-app";
import type { RuleEvaluationResult } from "@/lib/alerts";

const channelHandlers = new Map<NotificationChannel, NotificationChannelHandler>();
channelHandlers.set("email", emailChannelHandler);
channelHandlers.set("in_app", inAppChannelHandler);

function generateNotificationId(): string {
  return `notif_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

export interface DispatchOptions {
  channels?: NotificationChannel[];
  userId?: string;
  priority?: NotificationPriority;
  actionUrl?: string;
}

export interface DispatchResult {
  notificationId: string;
  results: NotificationResult[];
  allSucceeded: boolean;
  failedChannels: NotificationChannel[];
}

export class AlertDispatcher {
  async dispatch(params: {
    organizationId: string;
    title: string;
    message: string;
    metadata?: Record<string, unknown>;
    options?: DispatchOptions;
  }): Promise<DispatchResult> {
    const notificationId = generateNotificationId();
    const channels = params.options?.channels ?? ["in_app", "email"];

    const payload: NotificationPayload = {
      id: notificationId,
      organizationId: params.organizationId,
      userId: params.options?.userId,
      channel: "in_app",
      priority: params.options?.priority ?? "normal",
      title: params.title,
      message: params.message,
      metadata: params.metadata ?? {},
      actionUrl: params.options?.actionUrl,
      createdAt: new Date(),
    };

    const results: NotificationResult[] = [];
    const failedChannels: NotificationChannel[] = [];

    for (const channel of channels) {
      const handler = channelHandlers.get(channel);

      if (!handler) {
        results.push({
          success: false,
          channel,
          notificationId,
          error: `Unknown channel: ${channel}`,
        });
        failedChannels.push(channel);
        continue;
      }

      const channelPayload: NotificationPayload = { ...payload, channel };
      const result = await handler.send(channelPayload);
      results.push(result);

      if (!result.success) {
        failedChannels.push(channel);
      }
    }

    return {
      notificationId,
      results,
      allSucceeded: failedChannels.length === 0,
      failedChannels,
    };
  }

  async dispatchAlertResult(params: {
    result: RuleEvaluationResult;
    baseUrl?: string;
  }): Promise<DispatchResult> {
    const { result } = params;
    const baseUrl = params.baseUrl ?? process.env.NEXTAUTH_URL ?? "http://localhost:3000";

    let actionUrl: string | undefined;

    if (result.context.entityType === "campaign") {
      actionUrl = `${baseUrl}/app/campaigns/${result.context.entityId}`;
    } else if (result.context.entityType === "organization") {
      actionUrl = `${baseUrl}/app/waste`;
    }

    const channels = result.rule.notifyChannels as NotificationChannel[];

    return this.dispatch({
      organizationId: result.context.organizationId,
      title: result.rule.name,
      message: result.message,
      metadata: result.metadata,
      options: {
        channels,
        priority: severityToPriority(result.rule.severity),
        actionUrl,
      },
    });
  }

  async dispatchMultipleAlerts(params: {
    results: RuleEvaluationResult[];
    baseUrl?: string;
  }): Promise<DispatchResult[]> {
    const dispatchResults: DispatchResult[] = [];

    for (const result of params.results) {
      if (result.triggered) {
        const dispatchResult = await this.dispatchAlertResult({
          result,
          baseUrl: params.baseUrl,
        });
        dispatchResults.push(dispatchResult);
      }
    }

    return dispatchResults;
  }

  registerChannel(handler: NotificationChannelHandler): void {
    channelHandlers.set(handler.channel, handler);
  }

  getAvailableChannels(): NotificationChannel[] {
    return Array.from(channelHandlers.keys());
  }
}

export const alertDispatcher = new AlertDispatcher();
