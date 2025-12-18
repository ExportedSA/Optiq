import type { FastifyInstance } from "fastify";
/**
 * Register rate limiting middleware
 *
 * Limits:
 * - Global: 1000 requests per minute per IP
 * - Event ingestion: 100 requests per minute per workspace
 */
export declare function registerRateLimitMiddleware(app: FastifyInstance): Promise<void>;
/**
 * Create a custom rate limiter for event ingestion
 * Uses workspace ID as the key for per-workspace limits
 */
export declare function createEventIngestionRateLimiter(): {
    max: number;
    timeWindow: string;
    cache: number;
    skipOnError: boolean;
    keyGenerator: (req: any) => string;
    errorResponseBuilder: (req: any, context: any) => {
        statusCode: number;
        error: string;
        message: string;
        retryAfter: number;
    };
    addHeaders: {
        "x-ratelimit-limit": boolean;
        "x-ratelimit-remaining": boolean;
        "x-ratelimit-reset": boolean;
        "retry-after": boolean;
    };
};
//# sourceMappingURL=rate-limit.d.ts.map