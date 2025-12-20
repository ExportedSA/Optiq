import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { createLogger } from "@optiq/shared/logger";
import {
  createRequestContext,
  extractTraceId,
  getRequestDuration,
  createTraceHeaders,
  type RequestContext,
} from "@optiq/shared";

const logger = createLogger({ name: "http" });

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
export async function requestLoggerPlugin(fastify: FastifyInstance): Promise<void> {
  // Add request context on every request
  fastify.addHook("onRequest", async (request: FastifyRequest, reply: FastifyReply) => {
    const existingTraceId = extractTraceId(request.headers as Record<string, string | undefined>);
    
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
  fastify.addHook("onResponse", async (request: FastifyRequest, reply: FastifyReply) => {
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
    } else if (statusCode >= 400) {
      logger.warn(logData, "Request client error");
    } else {
      logger.info(logData, "Request completed");
    }
  });

  // Log errors with stack traces
  fastify.addHook("onError", async (request: FastifyRequest, reply: FastifyReply, error: Error) => {
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
export function setRequestUser(
  request: FastifyRequest,
  userId: string,
  organizationId?: string
): void {
  if (request.ctx) {
    request.ctx.userId = userId;
    request.ctx.organizationId = organizationId;
  }
}
