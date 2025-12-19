/**
 * Cron Authentication Guard
 * 
 * Provides authentication for cron job endpoints.
 * Requires CRON_SECRET environment variable to be set.
 */

import { NextResponse } from "next/server";
import { appLogger } from "@/lib/observability";

export interface CronAuthResult {
  authorized: boolean;
  response?: NextResponse;
}

/**
 * Verify cron request authorization
 * 
 * @param req - The incoming request
 * @param jobName - Name of the cron job for logging
 * @returns Authorization result with optional error response
 */
export function verifyCronAuth(req: Request, jobName: string): CronAuthResult {
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  // If CRON_SECRET is not set, reject all requests in production
  if (!cronSecret) {
    if (process.env.NODE_ENV === "production") {
      appLogger.error("CRON_SECRET not configured", { job: jobName });
      return {
        authorized: false,
        response: NextResponse.json(
          { error: "Server misconfiguration" },
          { status: 500 }
        ),
      };
    }
    // In development, allow requests without secret for testing
    appLogger.warn("CRON_SECRET not set, allowing request in development", { job: jobName });
    return { authorized: true };
  }

  // Verify the authorization header
  const expectedAuth = `Bearer ${cronSecret}`;
  
  if (!authHeader) {
    appLogger.warn("Missing authorization header on cron request", {
      job: jobName,
      ip: req.headers.get("x-forwarded-for") || "unknown",
    });
    return {
      authorized: false,
      response: NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      ),
    };
  }

  if (authHeader !== expectedAuth) {
    appLogger.warn("Invalid authorization on cron request", {
      job: jobName,
      ip: req.headers.get("x-forwarded-for") || "unknown",
    });
    return {
      authorized: false,
      response: NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      ),
    };
  }

  appLogger.debug("Cron request authorized", { job: jobName });
  return { authorized: true };
}

/**
 * Higher-order function to wrap cron handlers with authentication
 */
export function withCronAuth(
  jobName: string,
  handler: (req: Request) => Promise<NextResponse>
): (req: Request) => Promise<NextResponse> {
  return async (req: Request) => {
    const auth = verifyCronAuth(req, jobName);
    
    if (!auth.authorized) {
      return auth.response!;
    }

    return handler(req);
  };
}
