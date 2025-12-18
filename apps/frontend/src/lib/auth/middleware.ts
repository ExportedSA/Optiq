import "server-only";

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import {
  requireAuth,
  requirePermission,
  requireRole,
  authErrorResponse,
  getAuthContext,
  verifyResourceOwnership,
  scopedWhere,
  type AuthContext,
  type AuthResult,
} from "./authorization";
import {
  checkRateLimit,
  rateLimitByIp,
  rateLimitByOrg,
  getRateLimitHeaders,
  getClientIp,
  RATE_LIMITS,
  type RateLimitConfig,
  type RateLimitResult,
} from "./rate-limit";
import { type Permission, type WorkspaceRole } from "./rbac";

/**
 * API Route Handler with Authorization
 * 
 * Wraps API handlers with authentication, authorization, and rate limiting.
 */

export interface ProtectedRouteOptions {
  permission?: Permission;
  permissions?: Permission[];
  minimumRole?: WorkspaceRole;
  rateLimit?: RateLimitConfig | keyof typeof RATE_LIMITS;
  rateLimitByOrg?: boolean;
}

export type ProtectedHandler = (
  req: NextRequest,
  context: AuthContext
) => Promise<NextResponse>;

/**
 * Create a protected API route handler
 */
export function withAuth(
  handler: ProtectedHandler,
  options: ProtectedRouteOptions = {}
): (req: NextRequest) => Promise<NextResponse> {
  return async (req: NextRequest) => {
    // Rate limiting
    if (options.rateLimit) {
      const config =
        typeof options.rateLimit === "string"
          ? RATE_LIMITS[options.rateLimit]
          : options.rateLimit;

      const ip = getClientIp(req.headers);
      const rateLimitResult = rateLimitByIp(ip, req.nextUrl.pathname, config);

      if (!rateLimitResult.allowed) {
        return NextResponse.json(
          { error: "Too many requests", retryAfter: rateLimitResult.retryAfter },
          {
            status: 429,
            headers: getRateLimitHeaders(rateLimitResult),
          }
        );
      }
    }

    // Authentication
    let authResult: AuthResult;

    if (options.permission) {
      authResult = await requirePermission(options.permission);
    } else if (options.minimumRole) {
      authResult = await requireRole(options.minimumRole);
    } else {
      authResult = await requireAuth();
    }

    if (!authResult.authorized || !authResult.context) {
      return authErrorResponse(authResult);
    }

    // Org-based rate limiting (after auth)
    if (options.rateLimitByOrg && options.rateLimit) {
      const config =
        typeof options.rateLimit === "string"
          ? RATE_LIMITS[options.rateLimit]
          : options.rateLimit;

      const rateLimitResult = rateLimitByOrg(
        authResult.context.organizationId,
        req.nextUrl.pathname,
        config
      );

      if (!rateLimitResult.allowed) {
        return NextResponse.json(
          { error: "Organization rate limit exceeded", retryAfter: rateLimitResult.retryAfter },
          {
            status: 429,
            headers: getRateLimitHeaders(rateLimitResult),
          }
        );
      }
    }

    // Call the handler with auth context
    return handler(req, authResult.context);
  };
}

/**
 * Verify resource ownership before allowing access
 */
export async function withResourceOwnership(
  context: AuthContext,
  resourceType: string,
  resourceId: string
): Promise<{ allowed: boolean; error?: string }> {
  const isOwner = await verifyResourceOwnership(context, resourceType, resourceId);

  if (!isOwner) {
    return {
      allowed: false,
      error: `Resource not found or access denied`,
    };
  }

  return { allowed: true };
}

/**
 * Create a rate-limited handler for public endpoints (no auth required)
 */
export function withRateLimit(
  handler: (req: NextRequest) => Promise<NextResponse>,
  config: RateLimitConfig | keyof typeof RATE_LIMITS = "api"
): (req: NextRequest) => Promise<NextResponse> {
  return async (req: NextRequest) => {
    const rateLimitConfig = typeof config === "string" ? RATE_LIMITS[config] : config;
    const ip = getClientIp(req.headers);
    const result = rateLimitByIp(ip, req.nextUrl.pathname, rateLimitConfig);

    if (!result.allowed) {
      return NextResponse.json(
        { error: "Too many requests", retryAfter: result.retryAfter },
        {
          status: 429,
          headers: getRateLimitHeaders(result),
        }
      );
    }

    const response = await handler(req);

    // Add rate limit headers to successful responses
    const headers = getRateLimitHeaders(result);
    for (const [key, value] of Object.entries(headers)) {
      response.headers.set(key, value);
    }

    return response;
  };
}

/**
 * Ingest endpoint protection
 * - Rate limited by IP and optionally by API key
 * - No session auth required (uses API key or site ID)
 */
export function withIngestProtection(
  handler: (req: NextRequest, siteId: string) => Promise<NextResponse>
): (req: NextRequest) => Promise<NextResponse> {
  return async (req: NextRequest) => {
    const ip = getClientIp(req.headers);

    // IP-based rate limiting
    const ipResult = rateLimitByIp(ip, "ingest", RATE_LIMITS.ingest);
    if (!ipResult.allowed) {
      return NextResponse.json(
        { error: "Rate limit exceeded", retryAfter: ipResult.retryAfter },
        {
          status: 429,
          headers: getRateLimitHeaders(ipResult),
        }
      );
    }

    // Extract site ID from request
    const url = new URL(req.url);
    const siteId = url.searchParams.get("siteId") ?? req.headers.get("x-site-id");

    if (!siteId) {
      return NextResponse.json({ error: "Site ID required" }, { status: 400 });
    }

    // Site-based rate limiting
    const siteResult = checkRateLimit(`site:${siteId}:ingest`, RATE_LIMITS.ingest);
    if (!siteResult.allowed) {
      return NextResponse.json(
        { error: "Site rate limit exceeded", retryAfter: siteResult.retryAfter },
        {
          status: 429,
          headers: getRateLimitHeaders(siteResult),
        }
      );
    }

    return handler(req, siteId);
  };
}

// Re-export for convenience
export {
  getAuthContext,
  requireAuth,
  requirePermission,
  requireRole,
  authErrorResponse,
  verifyResourceOwnership,
  scopedWhere,
  type AuthContext,
  type AuthResult,
};

export {
  checkRateLimit,
  rateLimitByIp,
  rateLimitByOrg,
  getRateLimitHeaders,
  getClientIp,
  RATE_LIMITS,
  type RateLimitConfig,
  type RateLimitResult,
};
