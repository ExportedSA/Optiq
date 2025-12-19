import { NextResponse } from "next/server";

import { appLogger } from "@/lib/observability";
import { verifyCronAuth } from "@/lib/cron-auth";
import { withJobLock } from "@/lib/redis";

export const runtime = "nodejs";
export const maxDuration = 300; // 5 minutes

const JOB_NAME = "alerts-engine";

/**
 * Cron Job: Alerts Engine
 * 
 * Schedule: 0 4 * * * (4am daily)
 * Evaluates alert rules and triggers notifications.
 */
export async function GET(req: Request) {
  // Verify cron authentication
  const auth = verifyCronAuth(req, JOB_NAME);
  if (!auth.authorized) {
    return auth.response!;
  }

  appLogger.info("Starting alerts engine cron job");

  // Acquire distributed lock to prevent concurrent execution
  const result = await withJobLock(
    JOB_NAME,
    async () => {
      const { runAlertsEngine } = await import("@/lib/jobs/alerts-engine");
      const engineResult = await runAlertsEngine();
      appLogger.info("Alerts engine job executed", {
        organizationsProcessed: engineResult.organizationsProcessed,
        rulesEvaluated: engineResult.rulesEvaluated,
        alertsCreated: engineResult.alertsCreated,
        alertsSkipped: engineResult.alertsSkipped,
      });
      return engineResult;
    },
    { ttlSeconds: maxDuration, bufferSeconds: 60 }
  );

  if (result.skipped) {
    appLogger.info("Alerts engine cron job skipped (already running)");
    return NextResponse.json({
      success: true,
      skipped: true,
      message: "Job already running",
      timestamp: new Date().toISOString(),
    });
  }

  if (!result.executed || !result.result) {
    appLogger.error("Alerts engine cron job failed");
    return NextResponse.json(
      { success: false, error: "Job execution failed" },
      { status: 500 }
    );
  }

  appLogger.info("Alerts engine cron job completed");
  return NextResponse.json({
    success: true,
    skipped: false,
    data: {
      organizationsProcessed: result.result.organizationsProcessed,
      rulesEvaluated: result.result.rulesEvaluated,
      alertsCreated: result.result.alertsCreated,
      alertsSkipped: result.result.alertsSkipped,
    },
    timestamp: new Date().toISOString(),
  });
}
