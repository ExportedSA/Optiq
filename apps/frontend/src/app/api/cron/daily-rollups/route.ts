/**
 * Daily Rollups Cron Job
 * 
 * Aggregates cost and attribution data into daily rollups.
 * Runs after daily-sync to ensure fresh cost data.
 * 
 * Schedule: Every 6 hours (after daily-sync)
 */

import { NextResponse } from "next/server";
import { verifyCronAuth } from "@/lib/cron-auth";
import { withJobLock } from "@/lib/redis";
import { appLogger } from "@/lib/observability";

export const runtime = "nodejs";
export const maxDuration = 300; // 5 minutes

const JOB_NAME = "daily-rollups";

export async function GET(request: Request) {
  // Verify cron authentication
  const auth = verifyCronAuth(request, JOB_NAME);
  if (!auth.authorized) {
    return auth.response!;
  }

  appLogger.info("Starting daily rollups cron job");

  // Acquire distributed lock to prevent concurrent execution
  const result = await withJobLock(
    JOB_NAME,
    async () => {
      // First, run attribution for any unattributed conversions
      const { runAttributionForConversions, buildJourneys, runDailyRollups } = 
        await import("@/lib/jobs/daily-rollups");

      // Build journeys for recent conversions
      const journeyResult = await buildJourneys();
      appLogger.info("Journeys built", { ...journeyResult });

      // Run attribution for unattributed conversions
      const attributionResult = await runAttributionForConversions({
        models: ["LAST_TOUCH", "LINEAR"],
      });
      appLogger.info("Attribution completed", { ...attributionResult });

      // Generate daily rollups
      const rollupResult = await runDailyRollups({
        days: 7,
        attributionModel: "LAST_TOUCH",
      });
      appLogger.info("Daily rollups completed", {
        daysProcessed: rollupResult.daysProcessed,
        totalRollups: rollupResult.totalRollups,
      });

      return {
        journeys: journeyResult,
        attribution: attributionResult,
        rollups: {
          daysProcessed: rollupResult.daysProcessed,
          totalRollups: rollupResult.totalRollups,
        },
      };
    },
    { ttlSeconds: maxDuration, bufferSeconds: 60 }
  );

  if (result.skipped) {
    appLogger.info("Daily rollups cron job skipped (already running)");
    return NextResponse.json({
      success: true,
      skipped: true,
      message: "Job already running",
    });
  }

  if (!result.executed || !result.result) {
    appLogger.error("Daily rollups cron job failed");
    return NextResponse.json(
      { success: false, error: "Job execution failed" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    data: result.result,
  });
}
