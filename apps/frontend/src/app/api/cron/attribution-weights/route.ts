/**
 * Attribution Weights Cron Job
 * 
 * Calculates attribution weights for conversions
 * Runs hourly to process recent conversions
 */

import { NextResponse } from "next/server";
import { runAttribution } from "@/lib/jobs/run-attribution";
import { appLogger } from "@/lib/observability";
import { verifyCronAuth } from "@/lib/cron/auth";

export const runtime = "nodejs";
export const maxDuration = 300; // 5 minutes

const JOB_NAME = "attribution-weights";

/**
 * POST /api/cron/attribution-weights
 * Calculate attribution weights for recent conversions
 */
export async function POST(request: Request) {
  // Verify cron authentication
  const auth = verifyCronAuth(request, JOB_NAME);
  if (!auth.authorized) {
    return auth.response!;
  }

  const logger = appLogger.child({ cron: JOB_NAME });

  try {
    logger.info("Starting attribution weights calculation");

    // Process yesterday and today to catch any late conversions
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(23, 59, 59, 999);

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
      const result = await runAttribution({
        fromDate: yesterday,
        toDate: today,
        model,
      });

      results.push({
        model,
        conversionsProcessed: result.conversionsProcessed,
        linksUpdated: result.linksUpdated,
      });

      logger.info(`Completed ${model} attribution`, {
        conversionsProcessed: result.conversionsProcessed,
        linksUpdated: result.linksUpdated,
      });
    }

    const totalConversions = results.reduce((sum, r) => sum + r.conversionsProcessed, 0);
    const totalLinks = results.reduce((sum, r) => sum + r.linksUpdated, 0);

    logger.info("Attribution weights calculation completed", {
      totalConversions,
      totalLinks,
      models: results.length,
    });

    return NextResponse.json({
      success: true,
      totalConversions,
      totalLinks,
      results,
    });
  } catch (error) {
    logger.error("Attribution weights calculation failed", error as Error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
