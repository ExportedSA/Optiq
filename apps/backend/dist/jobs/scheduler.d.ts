/**
 * Job Scheduler
 *
 * Simple cron-like scheduler for background jobs
 * In production, consider using a proper job queue like BullMQ or Agenda
 */
/**
 * Start the job scheduler
 */
export declare function startScheduler(): NodeJS.Timeout;
/**
 * Stop the job scheduler
 */
export declare function stopScheduler(interval: NodeJS.Timeout): void;
/**
 * Manually trigger a job
 */
export declare function triggerJob(jobName: string): Promise<void>;
/**
 * Get job status
 */
export declare function getJobStatus(): {
    name: string;
    schedule: string;
    enabled: boolean;
    lastRun: Date | null;
    running: boolean;
}[];
//# sourceMappingURL=scheduler.d.ts.map