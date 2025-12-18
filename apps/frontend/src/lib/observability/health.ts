/**
 * Health Check Utilities
 * 
 * Provides system health status for monitoring and alerting.
 */

import { prisma } from "@/lib/prisma";
import { appLogger } from "./logger";

export interface HealthStatus {
  status: "healthy" | "degraded" | "unhealthy";
  timestamp: string;
  version: string;
  uptime: number;
  checks: {
    database: ComponentHealth;
    memory: ComponentHealth;
    [key: string]: ComponentHealth;
  };
}

export interface ComponentHealth {
  status: "healthy" | "degraded" | "unhealthy";
  latencyMs?: number;
  message?: string;
  details?: Record<string, unknown>;
}

const startTime = Date.now();
const APP_VERSION = process.env.npm_package_version ?? process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? "unknown";

/**
 * Check database connectivity
 */
async function checkDatabase(): Promise<ComponentHealth> {
  const start = performance.now();
  
  try {
    await prisma.$queryRaw`SELECT 1`;
    const latencyMs = Math.round(performance.now() - start);
    
    return {
      status: latencyMs > 1000 ? "degraded" : "healthy",
      latencyMs,
      message: latencyMs > 1000 ? "High latency" : undefined,
    };
  } catch (error) {
    return {
      status: "unhealthy",
      latencyMs: Math.round(performance.now() - start),
      message: error instanceof Error ? error.message : "Database connection failed",
    };
  }
}

/**
 * Check memory usage
 */
function checkMemory(): ComponentHealth {
  if (typeof process === "undefined" || !process.memoryUsage) {
    return { status: "healthy", message: "Memory check not available" };
  }

  const usage = process.memoryUsage();
  const heapUsedMB = Math.round(usage.heapUsed / 1024 / 1024);
  const heapTotalMB = Math.round(usage.heapTotal / 1024 / 1024);
  const heapPercent = Math.round((usage.heapUsed / usage.heapTotal) * 100);

  let status: ComponentHealth["status"] = "healthy";
  let message: string | undefined;

  if (heapPercent > 90) {
    status = "unhealthy";
    message = "Critical memory pressure";
  } else if (heapPercent > 75) {
    status = "degraded";
    message = "High memory usage";
  }

  return {
    status,
    message,
    details: {
      heapUsedMB,
      heapTotalMB,
      heapPercent,
      rssMB: Math.round(usage.rss / 1024 / 1024),
    },
  };
}

/**
 * Get full health status
 */
export async function getHealthStatus(): Promise<HealthStatus> {
  const [database, memory] = await Promise.all([
    checkDatabase(),
    Promise.resolve(checkMemory()),
  ]);

  const checks = { database, memory };

  // Determine overall status
  const statuses = Object.values(checks).map((c) => c.status);
  let overallStatus: HealthStatus["status"] = "healthy";

  if (statuses.includes("unhealthy")) {
    overallStatus = "unhealthy";
  } else if (statuses.includes("degraded")) {
    overallStatus = "degraded";
  }

  const status: HealthStatus = {
    status: overallStatus,
    timestamp: new Date().toISOString(),
    version: APP_VERSION,
    uptime: Math.round((Date.now() - startTime) / 1000),
    checks,
  };

  // Log if not healthy
  if (overallStatus !== "healthy") {
    appLogger.warn("Health check degraded", {
      status: overallStatus,
      checks,
    });
  }

  return status;
}

/**
 * Simple liveness check (for k8s probes)
 */
export function getLivenessStatus(): { alive: boolean } {
  return { alive: true };
}

/**
 * Readiness check (for k8s probes)
 */
export async function getReadinessStatus(): Promise<{ ready: boolean; reason?: string }> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { ready: true };
  } catch (error) {
    return {
      ready: false,
      reason: error instanceof Error ? error.message : "Database not ready",
    };
  }
}
