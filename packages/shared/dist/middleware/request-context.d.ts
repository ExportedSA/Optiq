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
export declare function generateTraceId(): string;
/**
 * Create a new request context
 */
export declare function createRequestContext(options?: Partial<RequestContext>): RequestContext;
/**
 * Calculate request duration in milliseconds
 */
export declare function getRequestDuration(ctx: RequestContext): number;
/**
 * Extract trace ID from headers (supports common formats)
 */
export declare function extractTraceId(headers: Record<string, string | string[] | undefined>): string | undefined;
/**
 * Create response headers with trace ID
 */
export declare function createTraceHeaders(traceId: string): Record<string, string>;
//# sourceMappingURL=request-context.d.ts.map