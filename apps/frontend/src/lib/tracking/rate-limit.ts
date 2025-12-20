/**
 * Rate Limiting for Tracking Endpoint
 * 
 * Implements per-site rate limiting using Redis
 */

import "server-only";
import { getRedis } from "@/lib/redis";

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetAt: Date;
}

const DEFAULT_LIMIT = 10000; // 10k events per minute per site
const WINDOW_SECONDS = 60;

/**
 * Check rate limit for a tracking site
 * 
 * Uses Redis simple counter with expiry
 */
export async function checkTrackingRateLimit(
  siteId: string,
  count: number = 1
): Promise<RateLimitResult> {
  const redis = getRedis();
  const key = `ratelimit:track:${siteId}`;
  const now = Date.now();

  try {
    if (!redis) {
      // Redis not available, fail open
      return {
        allowed: true,
        limit: DEFAULT_LIMIT,
        remaining: DEFAULT_LIMIT,
        resetAt: new Date(now + (WINDOW_SECONDS * 1000)),
      };
    }

    // Increment counter
    const currentCount = await redis.incrby(key, count);
    
    // Set expiry on first increment
    if (currentCount === count) {
      await redis.expire(key, WINDOW_SECONDS);
    }

    const remaining = Math.max(0, DEFAULT_LIMIT - currentCount);
    const resetAt = new Date(now + (WINDOW_SECONDS * 1000));

    return {
      allowed: currentCount <= DEFAULT_LIMIT,
      limit: DEFAULT_LIMIT,
      remaining,
      resetAt,
    };
  } catch (error) {
    console.error("Rate limit check failed:", error);
    // Fail open - allow request if Redis is down
    return {
      allowed: true,
      limit: DEFAULT_LIMIT,
      remaining: DEFAULT_LIMIT,
      resetAt: new Date(now + (WINDOW_SECONDS * 1000)),
    };
  }
}

/**
 * Get current rate limit status without incrementing
 */
export async function getTrackingRateLimitStatus(
  siteId: string
): Promise<RateLimitResult> {
  const redis = getRedis();
  const key = `ratelimit:track:${siteId}`;
  const now = Date.now();

  try {
    if (!redis) {
      return {
        allowed: true,
        limit: DEFAULT_LIMIT,
        remaining: DEFAULT_LIMIT,
        resetAt: new Date(now + (WINDOW_SECONDS * 1000)),
      };
    }

    const currentCount = await redis.get(key);
    const count = currentCount ? parseInt(currentCount, 10) : 0;

    const remaining = Math.max(0, DEFAULT_LIMIT - count);
    const resetAt = new Date(now + (WINDOW_SECONDS * 1000));

    return {
      allowed: count < DEFAULT_LIMIT,
      limit: DEFAULT_LIMIT,
      remaining,
      resetAt,
    };
  } catch (error) {
    console.error("Rate limit status check failed:", error);
    return {
      allowed: true,
      limit: DEFAULT_LIMIT,
      remaining: DEFAULT_LIMIT,
      resetAt: new Date(now + (WINDOW_SECONDS * 1000)),
    };
  }
}
