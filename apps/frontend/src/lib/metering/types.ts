/**
 * Metering Types
 * 
 * Server-side metering for tracking usage per workspace/organization.
 * Cannot be bypassed by client - all counting happens server-side.
 */

export type EventType = "page_view" | "conversion" | "custom_event" | "api_request" | "webhook_call";

export interface MeteringEvent {
  organizationId: string;
  eventType: EventType;
  count?: number;
  metadata?: Record<string, unknown>;
}

export interface DailyUsage {
  date: Date;
  pageViews: number;
  conversions: number;
  customEvents: number;
  totalEvents: number;
  apiRequests: number;
  webhookCalls: number;
  activeConnectors: number;
  activeCampaigns: number;
  throttledRequests: number;
  softLimitHit: boolean;
  hardLimitHit: boolean;
}

export interface PeriodUsage {
  periodStart: Date;
  periodEnd: Date;
  totalEvents: number;
  pageViews: number;
  conversions: number;
  customEvents: number;
  apiRequests: number;
  webhookCalls: number;
  dailyBreakdown: DailyUsage[];
}

export interface UsageLimits {
  monthlyEventLimit: number;
  softLimitPercent: number; // e.g., 80% - warn user
  hardLimitPercent: number; // e.g., 150% - block new events
}

export interface ThrottleStatus {
  isThrottled: boolean;
  throttleLevel: "none" | "soft" | "hard";
  currentUsage: number;
  limit: number;
  percentUsed: number;
  remainingEvents: number;
  message?: string;
}

export interface MeteringResult {
  success: boolean;
  throttled: boolean;
  throttleStatus?: ThrottleStatus;
  error?: string;
}

export const DEFAULT_LIMITS: UsageLimits = {
  monthlyEventLimit: 10000,
  softLimitPercent: 80,
  hardLimitPercent: 150,
};

export function calculateThrottleStatus(
  currentUsage: number,
  limits: UsageLimits
): ThrottleStatus {
  const percentUsed = (currentUsage / limits.monthlyEventLimit) * 100;
  const remainingEvents = Math.max(0, limits.monthlyEventLimit - currentUsage);

  let throttleLevel: ThrottleStatus["throttleLevel"] = "none";
  let isThrottled = false;
  let message: string | undefined;

  if (percentUsed >= limits.hardLimitPercent) {
    throttleLevel = "hard";
    isThrottled = true;
    message = "You have significantly exceeded your event limit. New events are being blocked. Please upgrade your plan.";
  } else if (percentUsed >= limits.softLimitPercent) {
    throttleLevel = "soft";
    isThrottled = false;
    message = `You've used ${Math.round(percentUsed)}% of your monthly event limit. Consider upgrading to avoid interruptions.`;
  }

  return {
    isThrottled,
    throttleLevel,
    currentUsage,
    limit: limits.monthlyEventLimit,
    percentUsed,
    remainingEvents,
    message,
  };
}
