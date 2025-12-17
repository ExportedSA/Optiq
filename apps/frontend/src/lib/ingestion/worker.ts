import "server-only";

import { prisma } from "@/lib/prisma";
import { runDailySyncJob } from "@/lib/ingestion/orchestrator";
import { computeNextRunAt } from "@/lib/ingestion/scheduler";

export async function runDueJobs(params: {
  limit: number;
  workerId: string;
}) {
  const now = new Date();

  const jobs = await prisma.ingestionJob.findMany({
    where: {
      status: "QUEUED",
      runAt: { lte: now },
      OR: [{ lockedAt: null }, { lockedAt: { lt: new Date(Date.now() - 10 * 60_000) } }],
    },
    orderBy: { runAt: "asc" },
    take: params.limit,
    select: {
      id: true,
      organizationId: true,
      platform: true,
      jobType: true,
      payload: true,
      attempts: true,
      maxAttempts: true,
    },
  });

  let processed = 0;
  let succeeded = 0;
  let failed = 0;

  for (const job of jobs) {
    const locked = await prisma.ingestionJob.updateMany({
      where: {
        id: job.id,
        status: "QUEUED",
        OR: [{ lockedAt: null }, { lockedAt: { lt: new Date(Date.now() - 10 * 60_000) } }],
      },
      data: {
        status: "RUNNING",
        lockedAt: new Date(),
        lockedBy: params.workerId,
      },
    });

    if (locked.count !== 1) continue;

    processed += 1;

    try {
      if (job.jobType === "DAILY_SYNC") {
        await runDailySyncJob({ organizationId: job.organizationId, payload: job.payload });
      } else {
        throw new Error("UNSUPPORTED_JOB_TYPE");
      }

      await prisma.ingestionJob.update({
        where: { id: job.id },
        data: {
          status: "SUCCEEDED",
          lockedAt: null,
          lockedBy: null,
          lastError: null,
        },
        select: { id: true },
      });

      succeeded += 1;
    } catch (e) {
      const nextAttempts = job.attempts + 1;
      const terminal = nextAttempts >= job.maxAttempts;

      await prisma.ingestionJob.update({
        where: { id: job.id },
        data: {
          status: terminal ? "FAILED" : "QUEUED",
          attempts: nextAttempts,
          runAt: terminal ? new Date() : computeNextRunAt(nextAttempts),
          lockedAt: null,
          lockedBy: null,
          lastError: e instanceof Error ? e.message : "UNKNOWN_ERROR",
        },
        select: { id: true },
      });

      failed += 1;
    }
  }

  return { processed, succeeded, failed };
}
