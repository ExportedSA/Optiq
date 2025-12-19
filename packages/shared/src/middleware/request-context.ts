import { randomUUID } from "crypto";

/**
 * Request context for correlation and tracing
 */
export interface RequestContext {
  /** Unique request/trace ID */
  traceId: string;
  /** Request start timestamp */
  startTime: number;
  /** HTTP method */
  method?: string;
  /** Request path */
  path?: string;
  /** User ID if authenticated */
  userId?: string;
  /** Organization ID if in context */
  organizationId?: string;
}

/**
 * Generate a new trace ID
 */
export function generateTraceId(): string {
  return randomUUID();
}

/**
 * Create a new request context
 */
export function createRequestContext(
  options: Partial<RequestContext> = {}
): RequestContext {
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
export function getRequestDuration(ctx: RequestContext): number {
  return Date.now() - ctx.startTime;
}

/**
 * Extract trace ID from headers (supports common formats)
 */
export function extractTraceId(headers: Record<string, string | string[] | undefined>): string | undefined {
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
export function createTraceHeaders(traceId: string): Record<string, string> {
  return {
    "x-trace-id": traceId,
    "x-request-id": traceId,
  };
}
