/**
 * Job Scheduler
 * 
 * Simple cron-like scheduler for background jobs
 * In production, consider using a proper job queue like BullMQ or Agenda
 */

import { createLogger } from "@optiq/shared";
import { runAlertsEngineJob } from "./alerts-engine";

const logger = createLogger({ name: "job-scheduler" });

interface ScheduledJob {
  name: string;
  schedule: string; // Cron-like: "*/5 * * * *" = every 5 minutes
  handler: () => Promise<void>;
  enabled: boolean;
}

/**
 * Parse simple cron schedule
 * Format: "minutes hours * * *"
 * Examples:
 *   "0 * * * *" = every hour at minute 0
 *   "STAR/5 * * * *" = every 5 minutes (replace STAR with *)
 *   "0 0 * * *" = every day at midnight
 */
function parseSchedule(schedule: string): { minutes: number; hours: number | null } | null {
  const parts = schedule.split(" ");
  if (parts.length < 2) return null;

  const [minutePart, hourPart] = parts;

  // Parse minutes
  let minutes: number;
  if (minutePart.startsWith("*/")) {
    minutes = parseInt(minutePart.slice(2), 10);
  } else {
    minutes = parseInt(minutePart, 10);
  }

  // Parse hours
  let hours: number | null = null;
  if (hourPart !== "*") {
    hours = parseInt(hourPart, 10);
  }

  return { minutes, hours };
}

/**
 * Check if job should run now
 */
function shouldRunNow(schedule: string, lastRun: Date | null): boolean {
  const parsed = parseSchedule(schedule);
  if (!parsed) return false;

  const now = new Date();
  const currentMinute = now.getMinutes();
  const currentHour = now.getHours();

  // Check if we're at the right hour (if specified)
  if (parsed.hours !== null && currentHour !== parsed.hours) {
    return false;
  }

  // Check if we're at the right minute interval
  if (schedule.includes("*/")) {
    // Interval-based (e.g., every 5 minutes)
    if (currentMinute % parsed.minutes !== 0) {
      return false;
    }
  } else {
    // Exact minute (e.g., minute 0)
    if (currentMinute !== parsed.minutes) {
      return false;
    }
  }

  // Check if we already ran in this minute
  if (lastRun) {
    const lastRunMinute = lastRun.getMinutes();
    const lastRunHour = lastRun.getHours();
    if (lastRunMinute === currentMinute && lastRunHour === currentHour) {
      return false;
    }
  }

  return true;
}

/**
 * Registered jobs
 */
const jobs: ScheduledJob[] = [
  {
    name: "alerts-engine",
    schedule: process.env.ALERTS_ENGINE_SCHEDULE || "0 4 * * *", // daily 4am by default
    handler: () => runAlertsEngineJob(),
    enabled: process.env.ALERTS_ENGINE_ENABLED === "true",
  },
];

/**
 * Job execution tracking
 */
const jobState = new Map<string, { lastRun: Date | null; running: boolean }>();

/**
 * Run a job
 */
async function runJob(job: ScheduledJob): Promise<void> {
  const state = jobState.get(job.name) || { lastRun: null, running: false };

  if (state.running) {
    logger.warn({ job: job.name }, "Job already running, skipping");
    return;
  }

  state.running = true;
  jobState.set(job.name, state);

  logger.info({ job: job.name }, "Starting job");
  const startTime = Date.now();

  try {
    await job.handler();
    const duration = Date.now() - startTime;
    logger.info({ job: job.name, duration }, "Job completed successfully");
  } catch (error) {
    const duration = Date.now() - startTime;
    logger.error({ job: job.name, duration, err: error }, "Job failed");
  } finally {
    state.running = false;
    state.lastRun = new Date();
    jobState.set(job.name, state);
  }
}

/**
 * Check and run scheduled jobs
 */
async function tick(): Promise<void> {
  for (const job of jobs) {
    if (!job.enabled) continue;

    const state = jobState.get(job.name) || { lastRun: null, running: false };

    if (shouldRunNow(job.schedule, state.lastRun)) {
      // Run job in background (don't await)
      runJob(job).catch((error) => {
        logger.error({ job: job.name, err: error }, "Job execution error");
      });
    }
  }
}

/**
 * Start the job scheduler
 */
export function startScheduler(): NodeJS.Timeout {
  logger.info("Starting job scheduler");
  logger.info({ jobs: jobs.map((j) => ({ name: j.name, schedule: j.schedule, enabled: j.enabled })) }, "Registered jobs");

  // Check every minute
  const interval = setInterval(() => {
    tick().catch((error) => {
      logger.error({ err: error }, "Scheduler tick error");
    });
  }, 60 * 1000); // 1 minute

  // Run initial tick
  tick().catch((error) => {
    logger.error({ err: error }, "Initial scheduler tick error");
  });

  return interval;
}

/**
 * Stop the job scheduler
 */
export function stopScheduler(interval: NodeJS.Timeout): void {
  logger.info("Stopping job scheduler");
  clearInterval(interval);
}

/**
 * Manually trigger a job
 */
export async function triggerJob(jobName: string): Promise<void> {
  const job = jobs.find((j) => j.name === jobName);
  if (!job) {
    throw new Error(`Job not found: ${jobName}`);
  }

  logger.info({ job: jobName }, "Manually triggering job");
  await runJob(job);
}

/**
 * Get job status
 */
export function getJobStatus() {
  return jobs.map((job) => {
    const state = jobState.get(job.name) || { lastRun: null, running: false };
    return {
      name: job.name,
      schedule: job.schedule,
      enabled: job.enabled,
      lastRun: state.lastRun,
      running: state.running,
    };
  });
}
