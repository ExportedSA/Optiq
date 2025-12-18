import { NextResponse } from "next/server";

import { appLogger } from "@/lib/observability";

export const runtime = "nodejs";
export const maxDuration = 300; // 5 minutes

/**
 * Cron Job: Usage Aggregation
 * 
 * Schedule: 0 1 * * * (1am daily)
 * Aggregates daily usage counters and updates billing period records.
 */
export async function GET(req: Request) {
  // Verify cron secret (Vercel adds this header for cron jobs)
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    appLogger.warn("Unauthorized cron request", {
      job: "usage-aggregation",
      hasAuth: !!authHeader,
    });
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  appLogger.info("Starting usage aggregation cron job");

  try {
    // Dynamic import to avoid loading job code on every request
    const { runUsageAggregation } = await import("@/lib/jobs/usage-aggregation");
    await runUsageAggregation();

    appLogger.info("Usage aggregation cron job completed");
    return NextResponse.json({ success: true, timestamp: new Date().toISOString() });
  } catch (error) {
    appLogger.error("Usage aggregation cron job failed", error as Error);
    return NextResponse.json(
      { error: "Job failed", message: (error as Error).message },
      { status: 500 }
    );
  }
}
