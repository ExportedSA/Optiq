/**
 * Daily Rollups Cron Job
 * 
 * Aggregates cost and attribution data into daily rollups.
 * Runs after daily-sync to ensure fresh cost data.
 * 
 * Schedule: Every 6 hours (after daily-sync)
 */

import { NextResponse } from "next/server";
import { verifyCronAuth } from "@/lib/cron/auth";
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
      // Use new V2 rollup job
      const { runDailyRollupsV2 } = await import("@/lib/jobs/daily-rollups-v2");

      // Process yesterday's data
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(0, 0, 0, 0);

      // Run for all attribution models
      const models: Array<"LAST_TOUCH" | "LINEAR" | "FIRST_TOUCH" | "TIME_DECAY" | "POSITION_BASED"> = [
        "LAST_TOUCH",
        "LINEAR",
        "FIRST_TOUCH",
        "TIME_DECAY",
        "POSITION_BASED",
      ];

      const results = [];

      for (const model of models) {
        const rollupResult = await runDailyRollupsV2({
          fromDate: yesterday,
          toDate: yesterday,
          attributionModel: model,
        });

        results.push({
          model,
          daysProcessed: rollupResult.daysProcessed,
          rollupsCreated: rollupResult.rollupsCreated,
          rollupsUpdated: rollupResult.rollupsUpdated,
        });

        appLogger.info(`Completed ${model} rollups`, {
          daysProcessed: rollupResult.daysProcessed,
          rollupsCreated: rollupResult.rollupsCreated,
          rollupsUpdated: rollupResult.rollupsUpdated,
        });
      }

      const totalRollups = results.reduce((sum, r) => sum + r.rollupsCreated + r.rollupsUpdated, 0);

      return {
        totalRollups,
        results,
      };
    },
    { ttlSeconds: maxDuration, bufferSeconds: 60 }
  );

  if (result.skipped) {
    return NextResponse.json({
      success: true,
      skipped: true,
      message: "Job already running",
    });
  }

  if (result.error) {
    return NextResponse.json(
      { success: false, error: result.error.message },
      { status: 500 }
    );
  }

  if (!result.executed || !result.result) {
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
