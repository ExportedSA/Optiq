import "server-only";

/**
 * Rate Limiting
 * 
 * In-memory rate limiter for API endpoints.
 * For production, use Redis-backed rate limiting.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetAt < now) {
      rateLimitStore.delete(key);
    }
  }
}, 60000); // Every minute

/**
 * Default rate limit configurations by endpoint type
 */
export const RATE_LIMITS: Record<string, RateLimitConfig> = {
  // Ingest endpoints - high volume but needs protection
  ingest: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 1000,
  },
  // Tracking pixel/script
  tracking: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 5000,
  },
  // API endpoints - standard
  api: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 100,
  },
  // Auth endpoints - strict
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 10,
  },
  // Webhook endpoints
  webhook: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 500,
  },
};

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
  retryAfter?: number;
}

/**
 * Check rate limit for a given key
 */
export function checkRateLimit(
  key: string,
  config: RateLimitConfig = RATE_LIMITS.api
): RateLimitResult {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  // No existing entry or window expired
  if (!entry || entry.resetAt < now) {
    const newEntry: RateLimitEntry = {
      count: 1,
      resetAt: now + config.windowMs,
    };
    rateLimitStore.set(key, newEntry);

    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetAt: newEntry.resetAt,
    };
  }

  // Within window
  if (entry.count >= config.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: entry.resetAt,
      retryAfter: Math.ceil((entry.resetAt - now) / 1000),
    };
  }

  // Increment counter
  entry.count++;
  rateLimitStore.set(key, entry);

  return {
    allowed: true,
    remaining: config.maxRequests - entry.count,
    resetAt: entry.resetAt,
  };
}

/**
 * Rate limit by IP address
 */
export function rateLimitByIp(
  ip: string,
  endpoint: string,
  config?: RateLimitConfig
): RateLimitResult {
  const key = `ip:${ip}:${endpoint}`;
  return checkRateLimit(key, config);
}

/**
 * Rate limit by organization
 */
export function rateLimitByOrg(
  organizationId: string,
  endpoint: string,
  config?: RateLimitConfig
): RateLimitResult {
  const key = `org:${organizationId}:${endpoint}`;
  return checkRateLimit(key, config);
}

/**
 * Rate limit by user
 */
export function rateLimitByUser(
  userId: string,
  endpoint: string,
  config?: RateLimitConfig
): RateLimitResult {
  const key = `user:${userId}:${endpoint}`;
  return checkRateLimit(key, config);
}

/**
 * Rate limit by API key
 */
export function rateLimitByApiKey(
  apiKey: string,
  endpoint: string,
  config?: RateLimitConfig
): RateLimitResult {
  const key = `apikey:${apiKey}:${endpoint}`;
  return checkRateLimit(key, config);
}

/**
 * Combined rate limiting - checks multiple limits
 * Returns the most restrictive result
 */
export function combinedRateLimit(
  checks: Array<{ key: string; config: RateLimitConfig }>
): RateLimitResult {
  let mostRestrictive: RateLimitResult = {
    allowed: true,
    remaining: Infinity,
    resetAt: 0,
  };

  for (const { key, config } of checks) {
    const result = checkRateLimit(key, config);

    if (!result.allowed) {
      return result;
    }

    if (result.remaining < mostRestrictive.remaining) {
      mostRestrictive = result;
    }
  }

  return mostRestrictive;
}

/**
 * Get rate limit headers for response
 */
export function getRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  const headers: Record<string, string> = {
    "X-RateLimit-Remaining": String(result.remaining),
    "X-RateLimit-Reset": String(Math.ceil(result.resetAt / 1000)),
  };

  if (!result.allowed && result.retryAfter) {
    headers["Retry-After"] = String(result.retryAfter);
  }

  return headers;
}

/**
 * Extract IP from request headers
 */
export function getClientIp(headers: Headers): string {
  // Check common proxy headers
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  const realIp = headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }

  // Cloudflare
  const cfConnectingIp = headers.get("cf-connecting-ip");
  if (cfConnectingIp) {
    return cfConnectingIp;
  }

  return "unknown";
}
