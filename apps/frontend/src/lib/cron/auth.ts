/**
 * Cron Job Authentication Helper
 * 
 * Provides secure authentication for cron job endpoints using:
 * - Bearer token authentication
 * - Constant-time comparison to prevent timing attacks
 * - Structured error responses
 */

import { NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";

/**
 * Verify cron job authentication
 * 
 * Checks for valid Authorization header with Bearer token matching CRON_SECRET.
 * Uses constant-time comparison to prevent timing attacks.
 * 
 * @param request - The incoming request
 * @param jobName - Optional job name for logging
 * @returns Object with authorized status and optional error response
 */
export function verifyCronAuth(
  request: Request,
  jobName?: string
): { authorized: true } | { authorized: false; response: NextResponse } {
  const cronSecret = process.env.CRON_SECRET;

  // Check if CRON_SECRET is configured
  if (!cronSecret) {
    console.error("CRON_SECRET environment variable is not configured");
    return {
      authorized: false,
      response: NextResponse.json(
        { error: "Cron authentication not configured" },
        { status: 503 }
      ),
    };
  }

  // Extract Authorization header
  const authHeader = request.headers.get("authorization");

  if (!authHeader) {
    console.warn(`Cron job unauthorized: missing auth header${jobName ? ` (${jobName})` : ""}`);
    return {
      authorized: false,
      response: NextResponse.json(
        { error: "Unauthorized: Missing authorization header" },
        { status: 401 }
      ),
    };
  }

  // Check Bearer token format
  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    console.warn(`Cron job unauthorized: invalid auth format${jobName ? ` (${jobName})` : ""}`);
    return {
      authorized: false,
      response: NextResponse.json(
        { error: "Unauthorized: Invalid authorization format" },
        { status: 401 }
      ),
    };
  }

  // Constant-time comparison to prevent timing attacks
  if (!constantTimeCompare(token, cronSecret)) {
    console.warn(`Cron job unauthorized: invalid token${jobName ? ` (${jobName})` : ""}`);
    return {
      authorized: false,
      response: NextResponse.json(
        { error: "Unauthorized: Invalid credentials" },
        { status: 401 }
      ),
    };
  }

  // Authentication successful
  return { authorized: true };
}

/**
 * Constant-time string comparison
 * 
 * Compares two strings in constant time to prevent timing attacks.
 * Both strings are converted to buffers and compared using crypto.timingSafeEqual.
 * 
 * @param a - First string
 * @param b - Second string
 * @returns true if strings are equal, false otherwise
 */
export function constantTimeCompare(a: string, b: string): boolean {
  try {
    // Convert strings to buffers
    const bufferA = Buffer.from(a, "utf8");
    const bufferB = Buffer.from(b, "utf8");

    // If lengths differ, still do a comparison to maintain constant time
    // Compare against a dummy buffer of the same length as bufferA
    if (bufferA.length !== bufferB.length) {
      // Create a dummy buffer with same length as bufferA
      const dummyBuffer = Buffer.alloc(bufferA.length);
      timingSafeEqual(bufferA, dummyBuffer);
      return false;
    }

    // Perform constant-time comparison
    return timingSafeEqual(bufferA, bufferB);
  } catch (error) {
    // If any error occurs during comparison, return false
    console.error("Error during constant-time comparison:", error);
    return false;
  }
}

/**
 * Middleware wrapper for cron routes
 * 
 * Wraps a cron route handler with authentication.
 * 
 * @param handler - The route handler function
 * @param jobName - Optional job name for logging
 * @returns Wrapped handler with authentication
 */
export function withCronAuth(
  handler: (request: Request) => Promise<NextResponse>,
  jobName?: string
) {
  return async (request: Request): Promise<NextResponse> => {
    const auth = verifyCronAuth(request, jobName);
    
    if (!auth.authorized) {
      return auth.response;
    }

    return handler(request);
  };
}
