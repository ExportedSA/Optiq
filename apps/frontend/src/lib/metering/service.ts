import "server-only";

import { prisma } from "@/lib/prisma";
import { PLAN_DEFINITIONS, type PlanTier } from "@optiq/shared";
import {
  type EventType,
  type MeteringResult,
  type ThrottleStatus,
  type UsageLimits,
  calculateThrottleStatus,
} from "./types";

/**
 * Server-side metering service
 * 
 * All event counting happens server-side and cannot be bypassed by client.
 * Events are counted atomically using database transactions.
 */

export async function recordEvent(
  organizationId: string,
  eventType: EventType,
  count: number = 1
): Promise<MeteringResult> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Get current limits
  const limits = await getOrganizationLimits(organizationId);
  
  // Get current period usage
  const currentUsage = await getPeriodEventCount(organizationId);
  
  // Check throttle status before recording
  const throttleStatus = calculateThrottleStatus(currentUsage, limits);

  // If hard throttled, reject the event
  if (throttleStatus.throttleLevel === "hard") {
    await logMeteringEvent(organizationId, "throttle_applied", count, {
      eventType,
      throttleLevel: "hard",
      currentUsage,
      limit: limits.monthlyEventLimit,
    });

    // Still increment throttled counter
    await incrementThrottledCounter(organizationId, today, count);

    return {
      success: false,
      throttled: true,
      throttleStatus,
      error: throttleStatus.message,
    };
  }

  // Record the event
  await incrementDailyCounter(organizationId, today, eventType, count);

  // Log for audit
  await logMeteringEvent(organizationId, "event_ingested", count, {
    eventType,
    dailyTotal: currentUsage + count,
  });

  // Check if we just hit soft limit
  const newUsage = currentUsage + count;
  const newThrottleStatus = calculateThrottleStatus(newUsage, limits);

  if (newThrottleStatus.throttleLevel === "soft" && throttleStatus.throttleLevel === "none") {
    await logMeteringEvent(organizationId, "limit_exceeded", 1, {
      level: "soft",
      usage: newUsage,
      limit: limits.monthlyEventLimit,
      percentUsed: newThrottleStatus.percentUsed,
    });

    await markSoftLimitHit(organizationId, today);
  }

  return {
    success: true,
    throttled: newThrottleStatus.throttleLevel !== "none",
    throttleStatus: newThrottleStatus,
  };
}

export async function recordBatchEvents(
  organizationId: string,
  events: Array<{ type: EventType; count: number }>
): Promise<MeteringResult> {
  const totalCount = events.reduce((sum, e) => sum + e.count, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const limits = await getOrganizationLimits(organizationId);
  const currentUsage = await getPeriodEventCount(organizationId);
  const throttleStatus = calculateThrottleStatus(currentUsage, limits);

  if (throttleStatus.throttleLevel === "hard") {
    await incrementThrottledCounter(organizationId, today, totalCount);
    return {
      success: false,
      throttled: true,
      throttleStatus,
      error: throttleStatus.message,
    };
  }

  // Record all events in a transaction
  await prisma.$transaction(async (tx) => {
    for (const event of events) {
      await incrementDailyCounterTx(tx, organizationId, today, event.type, event.count);
    }
  });

  await logMeteringEvent(organizationId, "event_ingested", totalCount, {
    batchSize: events.length,
    eventTypes: events.map((e) => e.type),
  });

  const newThrottleStatus = calculateThrottleStatus(currentUsage + totalCount, limits);

  return {
    success: true,
    throttled: newThrottleStatus.throttleLevel !== "none",
    throttleStatus: newThrottleStatus,
  };
}

export async function getThrottleStatus(organizationId: string): Promise<ThrottleStatus> {
  const limits = await getOrganizationLimits(organizationId);
  const currentUsage = await getPeriodEventCount(organizationId);
  return calculateThrottleStatus(currentUsage, limits);
}

export async function getPeriodEventCount(organizationId: string): Promise<number> {
  const subscription = await prisma.subscription.findUnique({
    where: { organizationId },
    select: { currentPeriodStart: true, currentPeriodEnd: true },
  });

  if (!subscription) {
    // No subscription - count from start of current month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const result = await prisma.$queryRaw<[{ total: bigint }]>`
      SELECT COALESCE(SUM("totalEvents"), 0) as total
      FROM "DailyUsageCounter"
      WHERE "organizationId" = ${organizationId}
        AND "date" >= ${startOfMonth}
    `;

    return Number(result[0]?.total ?? 0);
  }

  const result = await prisma.$queryRaw<[{ total: bigint }]>`
    SELECT COALESCE(SUM("totalEvents"), 0) as total
    FROM "DailyUsageCounter"
    WHERE "organizationId" = ${organizationId}
      AND "date" >= ${subscription.currentPeriodStart}
      AND "date" <= ${subscription.currentPeriodEnd}
  `;

  return Number(result[0]?.total ?? 0);
}

export async function getDailyUsage(
  organizationId: string,
  startDate: Date,
  endDate: Date
) {
  return prisma.$queryRaw`
    SELECT 
      "date",
      "pageViews",
      "conversions",
      "customEvents",
      "totalEvents",
      "apiRequests",
      "webhookCalls",
      "activeConnectors",
      "activeCampaigns",
      "throttledRequests",
      "softLimitHit",
      "hardLimitHit"
    FROM "DailyUsageCounter"
    WHERE "organizationId" = ${organizationId}
      AND "date" >= ${startDate}
      AND "date" <= ${endDate}
    ORDER BY "date" ASC
  `;
}

export async function getOrganizationLimits(organizationId: string): Promise<UsageLimits> {
  const subscription = await prisma.subscription.findUnique({
    where: { organizationId },
    select: { plan: true, monthlyEventLimit: true },
  });

  if (!subscription) {
    return {
      monthlyEventLimit: PLAN_DEFINITIONS.FREE.limits.monthlyEventLimit,
      softLimitPercent: 80,
      hardLimitPercent: 150,
    };
  }

  const plan = subscription.plan as PlanTier;
  const planDef = PLAN_DEFINITIONS[plan] ?? PLAN_DEFINITIONS.FREE;

  return {
    monthlyEventLimit: subscription.monthlyEventLimit ?? planDef.limits.monthlyEventLimit,
    softLimitPercent: 80,
    hardLimitPercent: 150,
  };
}

async function incrementDailyCounter(
  organizationId: string,
  date: Date,
  eventType: EventType,
  count: number
): Promise<void> {
  const field = eventTypeToField(eventType);

  await prisma.$executeRaw`
    INSERT INTO "DailyUsageCounter" ("id", "organizationId", "date", ${prisma.$queryRawUnsafe(`"${field}"`)}, "totalEvents", "updatedAt")
    VALUES (gen_random_uuid()::text, ${organizationId}, ${date}, ${count}, ${count}, NOW())
    ON CONFLICT ("organizationId", "date")
    DO UPDATE SET 
      ${prisma.$queryRawUnsafe(`"${field}"`)} = "DailyUsageCounter".${prisma.$queryRawUnsafe(`"${field}"`)} + ${count},
      "totalEvents" = "DailyUsageCounter"."totalEvents" + ${count},
      "updatedAt" = NOW()
  `;
}

async function incrementDailyCounterTx(
  tx: any,
  organizationId: string,
  date: Date,
  eventType: EventType,
  count: number
): Promise<void> {
  const field = eventTypeToField(eventType);

  await tx.$executeRaw`
    INSERT INTO "DailyUsageCounter" ("id", "organizationId", "date", ${tx.$queryRawUnsafe(`"${field}"`)}, "totalEvents", "updatedAt")
    VALUES (gen_random_uuid()::text, ${organizationId}, ${date}, ${count}, ${count}, NOW())
    ON CONFLICT ("organizationId", "date")
    DO UPDATE SET 
      ${tx.$queryRawUnsafe(`"${field}"`)} = "DailyUsageCounter".${tx.$queryRawUnsafe(`"${field}"`)} + ${count},
      "totalEvents" = "DailyUsageCounter"."totalEvents" + ${count},
      "updatedAt" = NOW()
  `;
}

async function incrementThrottledCounter(
  organizationId: string,
  date: Date,
  count: number
): Promise<void> {
  await prisma.$executeRaw`
    INSERT INTO "DailyUsageCounter" ("id", "organizationId", "date", "throttledRequests", "hardLimitHit", "updatedAt")
    VALUES (gen_random_uuid()::text, ${organizationId}, ${date}, ${count}, true, NOW())
    ON CONFLICT ("organizationId", "date")
    DO UPDATE SET 
      "throttledRequests" = "DailyUsageCounter"."throttledRequests" + ${count},
      "hardLimitHit" = true,
      "updatedAt" = NOW()
  `;
}

async function markSoftLimitHit(organizationId: string, date: Date): Promise<void> {
  await prisma.$executeRaw`
    UPDATE "DailyUsageCounter"
    SET "softLimitHit" = true, "updatedAt" = NOW()
    WHERE "organizationId" = ${organizationId} AND "date" = ${date}
  `;
}

async function logMeteringEvent(
  organizationId: string,
  eventType: string,
  eventCount: number,
  metadata?: Record<string, unknown>
): Promise<void> {
  await prisma.$executeRaw`
    INSERT INTO "MeteringAuditLog" ("id", "organizationId", "eventType", "eventCount", "metadata", "timestamp")
    VALUES (gen_random_uuid()::text, ${organizationId}, ${eventType}, ${eventCount}, ${JSON.stringify(metadata ?? {})}::jsonb, NOW())
  `;
}

function eventTypeToField(eventType: EventType): string {
  switch (eventType) {
    case "page_view":
      return "pageViews";
    case "conversion":
      return "conversions";
    case "custom_event":
      return "customEvents";
    case "api_request":
      return "apiRequests";
    case "webhook_call":
      return "webhookCalls";
    default:
      return "customEvents";
  }
}
