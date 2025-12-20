import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { randomUUID } from "node:crypto";

import { createLogger } from "@optiq/shared/logger";

/**
 * Register logging middleware with correlation IDs
 */
export async function registerLoggingMiddleware(app: FastifyInstance) {
  const logger = createLogger({ name: "optiq-backend" });

  // Replace Fastify's default logger with our Pino logger
  app.log = logger as any;

  // Add request ID hook (correlation ID)
  app.addHook("onRequest", async (request, reply) => {
    // Use existing request ID from header or generate new one
    const requestId =
      (request.headers["x-request-id"] as string) ||
      (request.headers["x-correlation-id"] as string) ||
      randomUUID();

    // Store request ID for use in handlers
    request.id = requestId;

    // Add to response headers for tracing
    reply.header("x-request-id", requestId);

    // Create child logger with request context
    request.log = logger.child({
      requestId,
      method: request.method,
      url: request.url,
    }) as any;
  });

  // Log request start
  app.addHook("onRequest", async (request) => {
    request.log.info(
      {
        req: {
          method: request.method,
          url: request.url,
          headers: request.headers,
          remoteAddress: request.ip,
          remotePort: request.socket.remotePort,
        },
      },
      "Incoming request",
    );
  });

  // Log request completion
  app.addHook("onResponse", async (request, reply) => {
    const responseTime = reply.elapsedTime;

    request.log.info(
      {
        res: {
          statusCode: reply.statusCode,
        },
        responseTime: `${responseTime.toFixed(2)}ms`,
      },
      "Request completed",
    );
  });

  // Log errors
  app.addHook("onError", async (request, reply, error) => {
    request.log.error(
      {
        err: error,
        req: {
          method: request.method,
          url: request.url,
        },
        res: {
          statusCode: reply.statusCode,
        },
      },
      "Request error",
    );
  });

  // Set custom error handler with structured logging
  app.setErrorHandler((error: Error, request, reply) => {
    // Log the error with full context
    request.log.error(
      {
        err: {
          type: error.name,
          message: error.message,
          stack: error.stack,
          code: (error as any).code,
          statusCode: (error as any).statusCode,
        },
        requestId: request.id,
      },
      "Unhandled error",
    );

    // Determine status code
    const statusCode = (error as any).statusCode || (error as any).status || 500;

    // Send error response
    void reply.status(statusCode).send({
      error: {
        message: error.message || "Internal Server Error",
        requestId: request.id,
        ...(process.env.NODE_ENV === "development" && {
          stack: error.stack,
        }),
      },
    });
  });

  logger.info("Logging middleware registered");
}
