/**
 * Health Endpoint Tests
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "./route";
import * as observability from "@/lib/observability";

// Mock the observability module
vi.mock("@/lib/observability", () => ({
  getLivenessStatus: vi.fn(),
  getReadinessStatus: vi.fn(),
  getHealthStatus: vi.fn(),
}));

describe("Health Endpoint", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Liveness Check (type=live)", () => {
    it("should return alive status", async () => {
      vi.mocked(observability.getLivenessStatus).mockReturnValue({ alive: true });

      const request = new Request("http://localhost/api/health?type=live");
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.alive).toBe(true);
      expect(observability.getLivenessStatus).toHaveBeenCalled();
    });

    it("should work with type=liveness", async () => {
      vi.mocked(observability.getLivenessStatus).mockReturnValue({ alive: true });

      const request = new Request("http://localhost/api/health?type=liveness");
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.alive).toBe(true);
    });

    it("should always return alive=true", async () => {
      vi.mocked(observability.getLivenessStatus).mockReturnValue({ alive: true });

      const request = new Request("http://localhost/api/health?type=live");
      const response = await GET(request);
      const data = await response.json();

      expect(data.alive).toBe(true);
    });
  });

  describe("Readiness Check (type=ready)", () => {
    it("should return 200 when ready", async () => {
      vi.mocked(observability.getReadinessStatus).mockResolvedValue({ ready: true });

      const request = new Request("http://localhost/api/health?type=ready");
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.ready).toBe(true);
      expect(observability.getReadinessStatus).toHaveBeenCalled();
    });

    it("should return 503 when not ready", async () => {
      vi.mocked(observability.getReadinessStatus).mockResolvedValue({
        ready: false,
        reason: "Database not ready",
      });

      const request = new Request("http://localhost/api/health?type=ready");
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(503);
      expect(data.ready).toBe(false);
      expect(data.reason).toBe("Database not ready");
    });

    it("should work with type=readiness", async () => {
      vi.mocked(observability.getReadinessStatus).mockResolvedValue({ ready: true });

      const request = new Request("http://localhost/api/health?type=readiness");
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.ready).toBe(true);
    });
  });

  describe("Full Health Check (type=full or default)", () => {
    const mockHealthyStatus = {
      status: "healthy" as const,
      timestamp: "2024-01-01T00:00:00.000Z",
      version: "1.0.0",
      uptime: 3600,
      runtime: {
        nodeVersion: "v20.0.0",
        platform: "linux",
        arch: "x64",
        environment: "production",
      },
      git: {
        commit: "abc1234",
        branch: "main",
      },
      checks: {
        database: { status: "healthy" as const, latencyMs: 10 },
        memory: { status: "healthy" as const },
        redis: { status: "healthy" as const, latencyMs: 5 },
      },
    };

    it("should return full health status with metadata", async () => {
      vi.mocked(observability.getHealthStatus).mockResolvedValue(mockHealthyStatus);

      const request = new Request("http://localhost/api/health");
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.status).toBe("healthy");
      expect(data.version).toBeDefined();
      expect(data.uptime).toBeGreaterThanOrEqual(0);
      expect(data.runtime).toBeDefined();
      expect(data.runtime.nodeVersion).toBeDefined();
      expect(data.runtime.platform).toBeDefined();
      expect(data.runtime.arch).toBeDefined();
      expect(data.runtime.environment).toBeDefined();
      expect(data.git).toBeDefined();
      expect(data.git.commit).toBeDefined();
      expect(data.checks).toBeDefined();
      expect(data.checks.database).toBeDefined();
      expect(data.checks.memory).toBeDefined();
      expect(data.checks.redis).toBeDefined();
    });

    it("should return 200 for degraded status", async () => {
      const degradedStatus = {
        ...mockHealthyStatus,
        status: "degraded" as const,
        checks: {
          ...mockHealthyStatus.checks,
          redis: { status: "degraded" as const, latencyMs: 600, message: "High latency" },
        },
      };

      vi.mocked(observability.getHealthStatus).mockResolvedValue(degradedStatus);

      const request = new Request("http://localhost/api/health");
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.status).toBe("degraded");
    });

    it("should return 503 for unhealthy status", async () => {
      const unhealthyStatus = {
        ...mockHealthyStatus,
        status: "unhealthy" as const,
        checks: {
          ...mockHealthyStatus.checks,
          database: { status: "unhealthy" as const, message: "Connection failed" },
        },
      };

      vi.mocked(observability.getHealthStatus).mockResolvedValue(unhealthyStatus);

      const request = new Request("http://localhost/api/health");
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(503);
      expect(data.status).toBe("unhealthy");
    });

    it("should work with type=full", async () => {
      vi.mocked(observability.getHealthStatus).mockResolvedValue(mockHealthyStatus);

      const request = new Request("http://localhost/api/health?type=full");
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.status).toBe("healthy");
    });

    it("should not expose secrets in response", async () => {
      vi.mocked(observability.getHealthStatus).mockResolvedValue(mockHealthyStatus);

      const request = new Request("http://localhost/api/health");
      const response = await GET(request);
      const data = await response.json();
      const responseText = JSON.stringify(data);

      // Check that common secret patterns are not in response
      expect(responseText).not.toMatch(/password/i);
      expect(responseText).not.toMatch(/secret/i);
      expect(responseText).not.toMatch(/api[_-]?key/i);
      expect(responseText).not.toMatch(/token/i);
      expect(responseText).not.toMatch(/DATABASE_URL/);
      expect(responseText).not.toMatch(/REDIS_URL/);
      
      // Git commit should be short hash only (7 chars)
      if (data.git?.commit) {
        expect(data.git.commit.length).toBeLessThanOrEqual(7);
      }
    });

    it("should include all required fields", async () => {
      vi.mocked(observability.getHealthStatus).mockResolvedValue(mockHealthyStatus);

      const request = new Request("http://localhost/api/health");
      const response = await GET(request);
      const data = await response.json();

      // Required fields
      expect(data).toHaveProperty("status");
      expect(data).toHaveProperty("timestamp");
      expect(data).toHaveProperty("version");
      expect(data).toHaveProperty("uptime");
      expect(data).toHaveProperty("checks");
      
      // Metadata fields
      expect(data).toHaveProperty("runtime");
      expect(data.runtime).toHaveProperty("nodeVersion");
      expect(data.runtime).toHaveProperty("platform");
      expect(data.runtime).toHaveProperty("arch");
      expect(data.runtime).toHaveProperty("environment");
      
      expect(data).toHaveProperty("git");
      expect(data.git).toHaveProperty("commit");
    });
  });

  describe("Component Health Checks", () => {
    it("should include database health check", async () => {
      const status = {
        status: "healthy" as const,
        timestamp: "2024-01-01T00:00:00.000Z",
        version: "1.0.0",
        uptime: 100,
        runtime: { nodeVersion: "v20", platform: "linux", arch: "x64", environment: "test" },
        git: { commit: "abc1234" },
        checks: {
          database: { status: "healthy" as const, latencyMs: 15 },
          memory: { status: "healthy" as const },
          redis: { status: "healthy" as const },
        },
      };

      vi.mocked(observability.getHealthStatus).mockResolvedValue(status);

      const request = new Request("http://localhost/api/health");
      const response = await GET(request);
      const data = await response.json();

      expect(data.checks.database).toBeDefined();
      expect(data.checks.database.status).toBe("healthy");
      expect(data.checks.database.latencyMs).toBeDefined();
    });

    it("should include memory health check", async () => {
      const status = {
        status: "healthy" as const,
        timestamp: "2024-01-01T00:00:00.000Z",
        version: "1.0.0",
        uptime: 100,
        runtime: { nodeVersion: "v20", platform: "linux", arch: "x64", environment: "test" },
        git: { commit: "abc1234" },
        checks: {
          database: { status: "healthy" as const },
          memory: { 
            status: "healthy" as const,
            details: { heapUsedMB: 100, heapTotalMB: 200, heapPercent: 50 }
          },
          redis: { status: "healthy" as const },
        },
      };

      vi.mocked(observability.getHealthStatus).mockResolvedValue(status);

      const request = new Request("http://localhost/api/health");
      const response = await GET(request);
      const data = await response.json();

      expect(data.checks.memory).toBeDefined();
      expect(data.checks.memory.status).toBe("healthy");
    });

    it("should include redis health check", async () => {
      const status = {
        status: "healthy" as const,
        timestamp: "2024-01-01T00:00:00.000Z",
        version: "1.0.0",
        uptime: 100,
        runtime: { nodeVersion: "v20", platform: "linux", arch: "x64", environment: "test" },
        git: { commit: "abc1234" },
        checks: {
          database: { status: "healthy" as const },
          memory: { status: "healthy" as const },
          redis: { status: "healthy" as const, latencyMs: 8 },
        },
      };

      vi.mocked(observability.getHealthStatus).mockResolvedValue(status);

      const request = new Request("http://localhost/api/health");
      const response = await GET(request);
      const data = await response.json();

      expect(data.checks.redis).toBeDefined();
      expect(data.checks.redis.status).toBe("healthy");
    });
  });
});
