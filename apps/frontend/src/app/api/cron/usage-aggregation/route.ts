import { NextResponse } from "next/server";

import { appLogger } from "@/lib/observability";
import { verifyCronAuth } from "@/lib/cron-auth";
import { withJobLock } from "@/lib/redis";

export const runtime = "nodejs";
export const maxDuration = 300; // 5 minutes

const JOB_NAME = "usage-aggregation";

/**
 * Cron Job: Usage Aggregation
 * 
 * Schedule: 0 1 * * * (1am daily)
 * Aggregates daily usage counters and updates billing period records.
 */
export async function GET(req: Request) {
  // Verify cron authentication
  const auth = verifyCronAuth(req, JOB_NAME);
  if (!auth.authorized) {
    return auth.response!;
  }

  appLogger.info("Starting usage aggregation cron job");

  // Acquire distributed lock to prevent concurrent execution
  const result = await withJobLock(
    JOB_NAME,
    async () => {
      const { runUsageAggregation } = await import("@/lib/jobs/usage-aggregation");
      await runUsageAggregation();
    },
    { ttlSeconds: maxDuration, bufferSeconds: 60 }
  );

  if (result.skipped) {
    appLogger.info("Usage aggregation cron job skipped (already running)");
    return NextResponse.json({
      success: true,
      skipped: true,
      message: "Job already running",
      timestamp: new Date().toISOString(),
    });
  }

  appLogger.info("Usage aggregation cron job completed");
  return NextResponse.json({
    success: true,
    skipped: false,
    timestamp: new Date().toISOString(),
  });
}
