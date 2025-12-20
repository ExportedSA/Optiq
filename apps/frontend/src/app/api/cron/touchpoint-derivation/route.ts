/**
 * TouchPoint Derivation Cron Job
 * 
 * Schedule: 0 */6 * * * (every 6 hours)
 * Derives TouchPoint records from TrackingEvent PAGE_VIEW events
 */

import { NextResponse } from "next/server";
import { verifyCronAuth } from "@/lib/cron-auth";
import { withJobLock } from "@/lib/redis";
import { appLogger } from "@/lib/observability";

export const runtime = "nodejs";
export const maxDuration = 300; // 5 minutes

const JOB_NAME = "touchpoint-derivation";

export async function GET(req: Request) {
  // Verify cron authentication
  const auth = verifyCronAuth(req, JOB_NAME);
  if (!auth.authorized) {
    return auth.response!;
  }

  appLogger.info("Starting TouchPoint derivation cron job");

  // Acquire distributed lock to prevent concurrent execution
  const result = await withJobLock(
    JOB_NAME,
    async () => {
      const { runTouchPointDerivation } = await import("@/lib/jobs/touchpoint-derivation");
      const derivationResult = await runTouchPointDerivation();
      
      appLogger.info("TouchPoint derivation job executed", {
        eventsProcessed: derivationResult.eventsProcessed,
        touchPointsCreated: derivationResult.touchPointsCreated,
        touchPointsSkipped: derivationResult.touchPointsSkipped,
        errors: derivationResult.errors,
      });
      
      return derivationResult;
    },
    { ttlSeconds: maxDuration, bufferSeconds: 60 }
  );

  if (result.skipped) {
    appLogger.info("TouchPoint derivation cron job skipped (already running)");
    return NextResponse.json({
      success: true,
      skipped: true,
      message: "Job already running",
      timestamp: new Date().toISOString(),
    });
  }

  if (!result.executed || !result.result) {
    appLogger.error("TouchPoint derivation cron job failed");
    return NextResponse.json(
      { success: false, error: "Job execution failed" },
      { status: 500 }
    );
  }

  appLogger.info("TouchPoint derivation cron job completed");
  return NextResponse.json({
    success: true,
    skipped: false,
    data: {
      eventsProcessed: result.result.eventsProcessed,
      touchPointsCreated: result.result.touchPointsCreated,
      touchPointsSkipped: result.result.touchPointsSkipped,
      errors: result.result.errors,
    },
    timestamp: new Date().toISOString(),
  });
}
