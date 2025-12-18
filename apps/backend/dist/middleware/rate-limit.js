import rateLimit from "@fastify/rate-limit";
/**
 * Register rate limiting middleware
 *
 * Limits:
 * - Global: 1000 requests per minute per IP
 * - Event ingestion: 100 requests per minute per workspace
 */
export async function registerRateLimitMiddleware(app) {
    // Global rate limit
    await app.register(rateLimit, {
        global: true,
        max: 1000,
        timeWindow: "1 minute",
        cache: 10000,
        allowList: ["127.0.0.1", "::1"],
        skipOnError: false,
        errorResponseBuilder: (req, context) => {
            return {
                statusCode: 429,
                error: "Too Many Requests",
                message: `Rate limit exceeded. Try again in ${Math.ceil(context.ttl / 1000)} seconds.`,
                retryAfter: Math.ceil(context.ttl / 1000),
            };
        },
        addHeaders: {
            "x-ratelimit-limit": true,
            "x-ratelimit-remaining": true,
            "x-ratelimit-reset": true,
            "retry-after": true,
        },
    });
    app.log.info("Rate limiting middleware registered");
}
/**
 * Create a custom rate limiter for event ingestion
 * Uses workspace ID as the key for per-workspace limits
 */
export function createEventIngestionRateLimiter() {
    return {
        max: 100, // 100 requests per minute per workspace
        timeWindow: "1 minute",
        cache: 5000,
        skipOnError: false,
        keyGenerator: (req) => {
            // Use workspace ID from request context
            const organizationId = req.organizationId || req.ip;
            return `event-ingestion:${organizationId}`;
        },
        errorResponseBuilder: (req, context) => {
            return {
                statusCode: 429,
                error: "Too Many Requests",
                message: `Event ingestion rate limit exceeded. Try again in ${Math.ceil(context.ttl / 1000)} seconds.`,
                retryAfter: Math.ceil(context.ttl / 1000),
            };
        },
        addHeaders: {
            "x-ratelimit-limit": true,
            "x-ratelimit-remaining": true,
            "x-ratelimit-reset": true,
            "retry-after": true,
        },
    };
}
//# sourceMappingURL=rate-limit.js.map