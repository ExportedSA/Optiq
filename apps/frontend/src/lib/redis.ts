/**
 * Redis Client (Upstash)
 * 
 * Provides Redis connectivity for distributed locks, caching, and rate limiting.
 */

import { Redis } from "@upstash/redis";
import { appLogger } from "@/lib/observability";

let redis: Redis | null = null;

/**
 * Get or create Redis client
 */
export function getRedis(): Redis | null {
  if (redis) return redis;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    appLogger.debug("Redis not configured (UPSTASH_REDIS_REST_URL/TOKEN missing)");
    return null;
  }

  try {
    redis = new Redis({ url, token });
    return redis;
  } catch (error) {
    appLogger.error("Failed to create Redis client", error as Error);
    return null;
  }
}

/**
 * Check if Redis is configured
 */
export function isRedisConfigured(): boolean {
  return !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}

/**
 * Check Redis connectivity
 */
export async function checkRedisHealth(): Promise<{
  healthy: boolean;
  latencyMs?: number;
  error?: string;
}> {
  const client = getRedis();
  
  if (!client) {
    return { healthy: false, error: "Redis not configured" };
  }

  const start = performance.now();
  
  try {
    await client.ping();
    const latencyMs = Math.round(performance.now() - start);
    
    return {
      healthy: true,
      latencyMs,
    };
  } catch (error) {
    return {
      healthy: false,
      latencyMs: Math.round(performance.now() - start),
      error: error instanceof Error ? error.message : "Redis connection failed",
    };
  }
}

/**
 * Distributed Lock for Cron Jobs
 * 
 * Prevents concurrent execution of the same job.
 */
export interface LockResult {
  acquired: boolean;
  lockId?: string;
}

export interface LockOptions {
  /** Lock TTL in seconds (default: 300 = 5 minutes) */
  ttlSeconds?: number;
  /** Additional buffer time in seconds (default: 60) */
  bufferSeconds?: number;
}

const DEFAULT_TTL = 300; // 5 minutes
const DEFAULT_BUFFER = 60; // 1 minute

/**
 * Acquire a distributed lock for a job
 * 
 * @param jobName - Unique name for the job
 * @param options - Lock options
 * @returns Lock result with acquired status and lock ID
 */
export async function acquireJobLock(
  jobName: string,
  options: LockOptions = {}
): Promise<LockResult> {
  const client = getRedis();
  
  if (!client) {
    // If Redis is not configured, allow the job to run
    // This enables local development without Redis
    appLogger.warn("Redis not configured, skipping lock acquisition", { job: jobName });
    return { acquired: true, lockId: `local-${Date.now()}` };
  }

  const ttl = (options.ttlSeconds ?? DEFAULT_TTL) + (options.bufferSeconds ?? DEFAULT_BUFFER);
  const lockKey = `cron:lock:${jobName}`;
  const lockId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  try {
    // Try to set the lock with NX (only if not exists) and EX (expiry)
    const result = await client.set(lockKey, lockId, { nx: true, ex: ttl });

    if (result === "OK") {
      appLogger.info("Job lock acquired", { job: jobName, lockId, ttl });
      return { acquired: true, lockId };
    }

    // Lock exists - another instance is running
    const existingLock = await client.get(lockKey);
    appLogger.info("Job lock already held, skipping", {
      job: jobName,
      existingLock,
    });
    return { acquired: false };
  } catch (error) {
    appLogger.error("Failed to acquire job lock", error as Error, { job: jobName });
    // On error, allow the job to run to avoid blocking all executions
    return { acquired: true, lockId: `error-fallback-${Date.now()}` };
  }
}

/**
 * Release a distributed lock
 * 
 * @param jobName - Unique name for the job
 * @param lockId - The lock ID returned from acquireJobLock
 */
export async function releaseJobLock(jobName: string, lockId: string): Promise<void> {
  const client = getRedis();
  
  if (!client || lockId.startsWith("local-") || lockId.startsWith("error-fallback-")) {
    return;
  }

  const lockKey = `cron:lock:${jobName}`;

  try {
    // Only release if we still hold the lock (compare lockId)
    const currentLock = await client.get(lockKey);
    
    if (currentLock === lockId) {
      await client.del(lockKey);
      appLogger.info("Job lock released", { job: jobName, lockId });
    } else {
      appLogger.warn("Lock mismatch on release, not releasing", {
        job: jobName,
        expectedLockId: lockId,
        currentLock,
      });
    }
  } catch (error) {
    appLogger.error("Failed to release job lock", error as Error, { job: jobName });
  }
}

/**
 * Execute a job with distributed locking
 * 
 * @param jobName - Unique name for the job
 * @param fn - The job function to execute
 * @param options - Lock options
 * @returns Job result or null if skipped
 */
export async function withJobLock<T>(
  jobName: string,
  fn: () => Promise<T>,
  options: LockOptions = {}
): Promise<{ executed: boolean; result?: T; skipped?: boolean }> {
  const lock = await acquireJobLock(jobName, options);

  if (!lock.acquired) {
    return { executed: false, skipped: true };
  }

  try {
    const result = await fn();
    return { executed: true, result };
  } finally {
    if (lock.lockId) {
      await releaseJobLock(jobName, lock.lockId);
    }
  }
}
