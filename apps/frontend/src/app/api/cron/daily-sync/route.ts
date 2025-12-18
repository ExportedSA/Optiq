import { NextResponse } from "next/server";

import { appLogger } from "@/lib/observability";

export const runtime = "nodejs";
export const maxDuration = 300; // 5 minutes

/**
 * Cron Job: Daily Ad Data Sync
 * 
 * Schedule: 0 0,4,8,12,16,20 * * * (every 4 hours)
 * Syncs ad spend and performance data from connected platforms.
 */
export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    appLogger.warn("Unauthorized cron request", { job: "daily-sync" });
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  appLogger.info("Starting daily sync cron job");

  try {
    // This would call the actual sync jobs
    // For now, return success as a placeholder
    appLogger.info("Daily sync cron job completed");
    return NextResponse.json({ success: true, timestamp: new Date().toISOString() });
  } catch (error) {
    appLogger.error("Daily sync cron job failed", error as Error);
    return NextResponse.json(
      { error: "Job failed", message: (error as Error).message },
      { status: 500 }
    );
  }
}
