import { randomUUID } from "crypto";
/**
 * Generate a new trace ID
 */
export function generateTraceId() {
    return randomUUID();
}
/**
 * Create a new request context
 */
export function createRequestContext(options = {}) {
    return {
        traceId: options.traceId || generateTraceId(),
        startTime: options.startTime || Date.now(),
        method: options.method,
        path: options.path,
        userId: options.userId,
        organizationId: options.organizationId,
    };
}
/**
 * Calculate request duration in milliseconds
 */
export function getRequestDuration(ctx) {
    return Date.now() - ctx.startTime;
}
/**
 * Extract trace ID from headers (supports common formats)
 */
export function extractTraceId(headers) {
    const headerNames = [
        "x-trace-id",
        "x-request-id",
        "x-correlation-id",
        "traceparent",
    ];
    for (const name of headerNames) {
        const value = headers[name];
        if (typeof value === "string" && value.length > 0) {
            // For traceparent format (W3C), extract the trace-id portion
            if (name === "traceparent") {
                const parts = value.split("-");
                if (parts.length >= 2) {
                    return parts[1];
                }
            }
            return value;
        }
    }
    return undefined;
}
/**
 * Create response headers with trace ID
 */
export function createTraceHeaders(traceId) {
    return {
        "x-trace-id": traceId,
        "x-request-id": traceId,
    };
}
//# sourceMappingURL=request-context.js.map