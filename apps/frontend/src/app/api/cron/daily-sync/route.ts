import { NextResponse } from "next/server";

import { appLogger } from "@/lib/observability";
import { verifyCronAuth } from "@/lib/cron/auth";
import { withJobLock } from "@/lib/redis";

export const runtime = "nodejs";
export const maxDuration = 300; // 5 minutes

const JOB_NAME = "daily-sync";

/**
 * Cron Job: Daily Ad Data Sync
 * 
 * Schedule: 0 0,4,8,12,16,20 * * * (every 4 hours)
 * Syncs ad spend and performance data from connected platforms.
 */
export async function GET(req: Request) {
  // Verify cron authentication
  const auth = verifyCronAuth(req, JOB_NAME);
  if (!auth.authorized) {
    return auth.response!;
  }

  appLogger.info("Starting daily sync cron job");

  // Acquire distributed lock to prevent concurrent execution
  const result = await withJobLock(
    JOB_NAME,
    async () => {
      const { runDailySync } = await import("@/lib/jobs/run-daily-sync");
      const syncResult = await runDailySync();
      appLogger.info("Daily sync job executed", {
        organizationsProcessed: syncResult.organizationsProcessed,
        connectionsProcessed: syncResult.connectionsProcessed,
        costFactsCreated: syncResult.costFactsCreated,
        costFactsUpdated: syncResult.costFactsUpdated,
        errors: syncResult.errors,
      });
      return syncResult;
    },
    { ttlSeconds: maxDuration, bufferSeconds: 60 }
  );

  if (result.skipped) {
    appLogger.info("Daily sync cron job skipped (already running)");
    return NextResponse.json({
      success: true,
      skipped: true,
      message: "Job already running",
      timestamp: new Date().toISOString(),
    });
  }

  appLogger.info("Daily sync cron job completed");
  return NextResponse.json({
    success: true,
    skipped: false,
    timestamp: new Date().toISOString(),
  });
}
