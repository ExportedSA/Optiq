import { createLogger } from "@optiq/shared/logger";
import { createRequestContext, extractTraceId, getRequestDuration, createTraceHeaders, } from "@optiq/shared";
const logger = createLogger({ name: "http" });
/**
 * Request logging and correlation middleware for Fastify
 *
 * Adds:
 * - Unique trace ID to every request
 * - Structured logging with route, method, status, latency
 * - Error logging with stack traces
 */
export async function requestLoggerPlugin(fastify) {
    // Add request context on every request
    fastify.addHook("onRequest", async (request, reply) => {
        const existingTraceId = extractTraceId(request.headers);
        request.ctx = createRequestContext({
            traceId: existingTraceId,
            method: request.method,
            path: request.url,
        });
        // Add trace ID to response headers
        const traceHeaders = createTraceHeaders(request.ctx.traceId);
        for (const [key, value] of Object.entries(traceHeaders)) {
            reply.header(key, value);
        }
        logger.debug({
            traceId: request.ctx.traceId,
            method: request.method,
            path: request.url,
            userAgent: request.headers["user-agent"],
        }, "Request started");
    });
    // Log response on completion
    fastify.addHook("onResponse", async (request, reply) => {
        const duration = getRequestDuration(request.ctx);
        const statusCode = reply.statusCode;
        const logData = {
            traceId: request.ctx.traceId,
            method: request.method,
            path: request.url,
            statusCode,
            durationMs: duration,
            userId: request.ctx.userId,
            organizationId: request.ctx.organizationId,
        };
        if (statusCode >= 500) {
            logger.error(logData, "Request failed");
        }
        else if (statusCode >= 400) {
            logger.warn(logData, "Request client error");
        }
        else {
            logger.info(logData, "Request completed");
        }
    });
    // Log errors with stack traces
    fastify.addHook("onError", async (request, reply, error) => {
        const duration = getRequestDuration(request.ctx);
        logger.error({
            traceId: request.ctx.traceId,
            method: request.method,
            path: request.url,
            statusCode: reply.statusCode,
            durationMs: duration,
            error: {
                name: error.name,
                message: error.message,
                stack: error.stack,
            },
            userId: request.ctx.userId,
            organizationId: request.ctx.organizationId,
        }, "Request error");
    });
}
/**
 * Set user context on request (call after authentication)
 */
export function setRequestUser(request, userId, organizationId) {
    if (request.ctx) {
        request.ctx.userId = userId;
        request.ctx.organizationId = organizationId;
    }
}
//# sourceMappingURL=request-logger.js.map