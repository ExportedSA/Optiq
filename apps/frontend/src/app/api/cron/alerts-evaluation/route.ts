/**
 * Alerts Evaluation Cron Job
 * 
 * Evaluates alert rules and creates AlertEvent records
 * Schedule: Every hour
 */

import { NextResponse } from "next/server";
import { verifyCronAuth } from "@/lib/cron-auth";
import { withJobLock } from "@/lib/redis";
import { appLogger } from "@/lib/observability";
import { runAlertEvaluation } from "@/lib/alerts/alert-evaluator";

export const runtime = "nodejs";
export const maxDuration = 300; // 5 minutes

const JOB_NAME = "alerts-evaluation";

/**
 * GET /api/cron/alerts-evaluation
 * Evaluate alert rules and create alert events
 */
export async function GET(request: Request) {
  // Verify cron authentication
  const auth = verifyCronAuth(request, JOB_NAME);
  if (!auth.authorized) {
    return auth.response!;
  }

  appLogger.info("Starting alerts evaluation cron job");

  // Acquire distributed lock to prevent concurrent execution
  const result = await withJobLock(
    JOB_NAME,
    async () => {
      const evaluationResult = await runAlertEvaluation();
      
      appLogger.info("Alerts evaluation completed", {
        alertsTriggered: evaluationResult.alertsTriggered,
        alertsEvaluated: evaluationResult.alertsEvaluated,
        errors: evaluationResult.errors,
      });

      return evaluationResult;
    },
    { ttlSeconds: maxDuration, bufferSeconds: 60 }
  );

  if (result.skipped) {
    appLogger.info("Alerts evaluation cron job skipped (already running)");
    return NextResponse.json({
      success: true,
      skipped: true,
      message: "Job already running",
    });
  }

  if (!result.executed || !result.result) {
    appLogger.error("Alerts evaluation cron job failed");
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
