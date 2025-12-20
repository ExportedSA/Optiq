import type { FastifyInstance, FastifyRequest } from "fastify";
import { type RequestContext } from "@optiq/shared";
declare module "fastify" {
    interface FastifyRequest {
        ctx: RequestContext;
    }
}
/**
 * Request logging and correlation middleware for Fastify
 *
 * Adds:
 * - Unique trace ID to every request
 * - Structured logging with route, method, status, latency
 * - Error logging with stack traces
 */
export declare function requestLoggerPlugin(fastify: FastifyInstance): Promise<void>;
/**
 * Set user context on request (call after authentication)
 */
export declare function setRequestUser(request: FastifyRequest, userId: string, organizationId?: string): void;
//# sourceMappingURL=request-logger.d.ts.map