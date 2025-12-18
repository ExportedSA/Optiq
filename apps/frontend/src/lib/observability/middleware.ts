/**
 * Observability Middleware
 * 
 * Wraps API routes with logging, timing, and error tracking.
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { apiLogger } from "./logger";
import { captureException, setUser, setContext } from "./sentry";
import { createRouteTimer } from "./timing";

export interface ObservabilityContext {
  traceId: string;
  userId?: string;
  organizationId?: string;
}

/**
 * Generate a trace ID for request tracking
 */
function generateTraceId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 11)}`;
}

/**
 * Extract request metadata for logging
 */
function extractRequestMeta(req: NextRequest): Record<string, unknown> {
  return {
    method: req.method,
    path: req.nextUrl.pathname,
    query: Object.fromEntries(req.nextUrl.searchParams),
    userAgent: req.headers.get("user-agent")?.slice(0, 100),
    referer: req.headers.get("referer"),
    ip: req.headers.get("x-forwarded-for")?.split(",")[0] ?? 
        req.headers.get("x-real-ip") ?? 
        "unknown",
  };
}

export type ObservableHandler = (
  req: NextRequest,
  context: ObservabilityContext
) => Promise<NextResponse>;

/**
 * Wrap an API route with observability
 */
export function withObservability(
  handler: ObservableHandler
): (req: NextRequest) => Promise<NextResponse> {
  return async (req: NextRequest) => {
    const traceId = req.headers.get("x-trace-id") ?? generateTraceId();
    const timer = createRouteTimer(req.method, req.nextUrl.pathname, { traceId });
    
    const requestMeta = extractRequestMeta(req);
    
    apiLogger.info("Request started", {
      traceId,
      ...requestMeta,
    });

    const obsContext: ObservabilityContext = { traceId };

    try {
      const response = await handler(req, obsContext);
      
      const statusCode = response.status;
      timer.finish(statusCode);
      
      // Add trace ID to response headers
      response.headers.set("x-trace-id", traceId);
      
      return response;
    } catch (error) {
      timer.finish(500);
      
      // Capture error with context
      captureException(error as Error, {
        tags: {
          traceId,
          method: req.method,
          path: req.nextUrl.pathname,
        },
        extra: requestMeta,
        user: obsContext.userId ? { id: obsContext.userId } : undefined,
      });
      
      apiLogger.error("Request failed", error as Error, {
        traceId,
        ...requestMeta,
      });
      
      return NextResponse.json(
        { 
          error: "Internal server error",
          traceId,
        },
        { 
          status: 500,
          headers: { "x-trace-id": traceId },
        }
      );
    }
  };
}

/**
 * Add user context to observability
 */
export function setObservabilityUser(
  context: ObservabilityContext,
  user: { id: string; email?: string; organizationId?: string }
): void {
  context.userId = user.id;
  context.organizationId = user.organizationId;
  
  setUser({ id: user.id, email: user.email });
  setContext("organization", { id: user.organizationId });
}

/**
 * Combine observability with auth middleware
 */
export function withObservableAuth(
  handler: (
    req: NextRequest,
    authContext: { userId: string; organizationId: string; role: string },
    obsContext: ObservabilityContext
  ) => Promise<NextResponse>,
  options?: { permission?: string; rateLimit?: string }
): (req: NextRequest) => Promise<NextResponse> {
  return withObservability(async (req, obsContext) => {
    // Import auth dynamically to avoid circular deps
    const { getAuthContext, authErrorResponse } = await import("@/lib/auth/authorization");
    
    const authContext = await getAuthContext();
    
    if (!authContext) {
      return authErrorResponse({ authorized: false, error: "Unauthorized", status: 401 });
    }
    
    // Add user context to observability
    setObservabilityUser(obsContext, {
      id: authContext.userId,
      email: authContext.email,
      organizationId: authContext.organizationId,
    });
    
    return handler(req, authContext, obsContext);
  });
}

/**
 * Error boundary wrapper for catching unhandled errors
 */
export function withErrorBoundary<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  context?: { operation: string; metadata?: Record<string, unknown> }
): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await fn(...args);
    } catch (error) {
      captureException(error as Error, {
        tags: { operation: context?.operation ?? "unknown" },
        extra: context?.metadata,
      });
      throw error;
    }
  }) as T;
}
