import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Mock observability
vi.mock("@/lib/observability", () => ({
  appLogger: {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

import { verifyCronAuth, withCronAuth } from "../cron-auth";

describe("Cron Authentication", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe("verifyCronAuth", () => {
    it("returns authorized when CRON_SECRET matches", () => {
      process.env.CRON_SECRET = "test-secret-123";

      const req = new Request("http://localhost/api/cron/test", {
        headers: {
          authorization: "Bearer test-secret-123",
        },
      });

      const result = verifyCronAuth(req, "test-job");

      expect(result.authorized).toBe(true);
      expect(result.response).toBeUndefined();
    });

    it("returns unauthorized when authorization header is missing", () => {
      process.env.CRON_SECRET = "test-secret-123";

      const req = new Request("http://localhost/api/cron/test");

      const result = verifyCronAuth(req, "test-job");

      expect(result.authorized).toBe(false);
      expect(result.response).toBeDefined();
      expect(result.response?.status).toBe(401);
    });

    it("returns unauthorized when authorization header is invalid", () => {
      process.env.CRON_SECRET = "test-secret-123";

      const req = new Request("http://localhost/api/cron/test", {
        headers: {
          authorization: "Bearer wrong-secret",
        },
      });

      const result = verifyCronAuth(req, "test-job");

      expect(result.authorized).toBe(false);
      expect(result.response).toBeDefined();
      expect(result.response?.status).toBe(401);
    });

    it("returns authorized in development when CRON_SECRET is not set", () => {
      delete process.env.CRON_SECRET;
      process.env.NODE_ENV = "development";

      const req = new Request("http://localhost/api/cron/test");

      const result = verifyCronAuth(req, "test-job");

      expect(result.authorized).toBe(true);
    });

    it("returns error in production when CRON_SECRET is not set", () => {
      delete process.env.CRON_SECRET;
      process.env.NODE_ENV = "production";

      const req = new Request("http://localhost/api/cron/test");

      const result = verifyCronAuth(req, "test-job");

      expect(result.authorized).toBe(false);
      expect(result.response?.status).toBe(500);
    });

    it("rejects Bearer token with wrong format", () => {
      process.env.CRON_SECRET = "test-secret-123";

      const req = new Request("http://localhost/api/cron/test", {
        headers: {
          authorization: "Basic test-secret-123",
        },
      });

      const result = verifyCronAuth(req, "test-job");

      expect(result.authorized).toBe(false);
      expect(result.response?.status).toBe(401);
    });
  });

  describe("withCronAuth", () => {
    it("calls handler when authorized", async () => {
      process.env.CRON_SECRET = "test-secret-123";

      const mockHandler = vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ success: true }), { status: 200 })
      );

      const wrappedHandler = withCronAuth("test-job", mockHandler);

      const req = new Request("http://localhost/api/cron/test", {
        headers: {
          authorization: "Bearer test-secret-123",
        },
      });

      const response = await wrappedHandler(req);

      expect(mockHandler).toHaveBeenCalledWith(req);
      expect(response.status).toBe(200);
    });

    it("returns 401 without calling handler when unauthorized", async () => {
      process.env.CRON_SECRET = "test-secret-123";

      const mockHandler = vi.fn();

      const wrappedHandler = withCronAuth("test-job", mockHandler);

      const req = new Request("http://localhost/api/cron/test", {
        headers: {
          authorization: "Bearer wrong-secret",
        },
      });

      const response = await wrappedHandler(req);

      expect(mockHandler).not.toHaveBeenCalled();
      expect(response.status).toBe(401);
    });
  });
});
