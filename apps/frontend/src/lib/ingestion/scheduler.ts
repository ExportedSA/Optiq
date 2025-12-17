import "server-only";

import { prisma } from "@/lib/prisma";
import { buildIdempotencyKey, type DailySyncPayload } from "@/lib/ingestion/types";

export async function enqueueDailySync(params: {
  organizationId: string;
  payload: DailySyncPayload;
  runAt?: Date;
}) {
  const idempotencyKey = buildIdempotencyKey({
    organizationId: params.organizationId,
    platform: params.payload.platform,
    externalAccountId: params.payload.externalAccountId,
    startDate: params.payload.startDate,
    endDate: params.payload.endDate,
    granularity: params.payload.granularity,
  });

  const job = await prisma.ingestionJob.upsert({
    where: { idempotencyKey },
    create: {
      organizationId: params.organizationId,
      platform: params.payload.platform,
      jobType: "DAILY_SYNC",
      status: "QUEUED",
      idempotencyKey,
      payload: params.payload as any,
      runAt: params.runAt ?? new Date(),
      attempts: 0,
      maxAttempts: 8,
    },
    update: {
      runAt: params.runAt ?? new Date(),
      status: "QUEUED",
    },
    select: {
      id: true,
      status: true,
      runAt: true,
      idempotencyKey: true,
    },
  });

  return job;
}

export function computeNextRunAt(attempts: number): Date {
  const jitter = Math.floor(Math.random() * 250);
  const backoffMs = Math.min(30 * 60_000, (2 ** Math.min(attempts, 10)) * 1_000 + jitter);
  return new Date(Date.now() + backoffMs);
}
