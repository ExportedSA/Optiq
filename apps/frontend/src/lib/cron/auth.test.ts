/**
 * Cron Auth Helper Tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { verifyCronAuth, constantTimeCompare, withCronAuth } from "./auth";
import { NextResponse } from "next/server";

describe("Cron Auth Helper", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe("constantTimeCompare", () => {
    it("should return true for identical strings", () => {
      expect(constantTimeCompare("secret123", "secret123")).toBe(true);
    });

    it("should return false for different strings", () => {
      expect(constantTimeCompare("secret123", "secret456")).toBe(false);
    });

    it("should return false for strings of different lengths", () => {
      expect(constantTimeCompare("short", "muchlongerstring")).toBe(false);
    });

    it("should return false for empty vs non-empty strings", () => {
      expect(constantTimeCompare("", "nonempty")).toBe(false);
    });

    it("should handle special characters", () => {
      const secret = "s3cr3t!@#$%^&*()_+-=[]{}|;:',.<>?/~`";
      expect(constantTimeCompare(secret, secret)).toBe(true);
    });

    it("should be case-sensitive", () => {
      expect(constantTimeCompare("Secret", "secret")).toBe(false);
    });
  });

  describe("verifyCronAuth", () => {
    it("should return 503 when CRON_SECRET is not configured", () => {
      delete process.env.CRON_SECRET;

      const request = new Request("http://localhost/api/cron/test", {
        headers: { authorization: "Bearer token123" },
      });

      const result = verifyCronAuth(request);

      expect(result.authorized).toBe(false);
      if (!result.authorized) {
        expect(result.response.status).toBe(503);
      }
    });

    it("should return 401 when authorization header is missing", () => {
      process.env.CRON_SECRET = "test-secret";

      const request = new Request("http://localhost/api/cron/test");

      const result = verifyCronAuth(request);

      expect(result.authorized).toBe(false);
      if (!result.authorized) {
        expect(result.response.status).toBe(401);
      }
    });

    it("should return 401 when authorization format is invalid (no Bearer)", () => {
      process.env.CRON_SECRET = "test-secret";

      const request = new Request("http://localhost/api/cron/test", {
        headers: { authorization: "test-secret" },
      });

      const result = verifyCronAuth(request);

      expect(result.authorized).toBe(false);
      if (!result.authorized) {
        expect(result.response.status).toBe(401);
      }
    });

    it("should return 401 when authorization format is invalid (wrong scheme)", () => {
      process.env.CRON_SECRET = "test-secret";

      const request = new Request("http://localhost/api/cron/test", {
        headers: { authorization: "Basic dGVzdDp0ZXN0" },
      });

      const result = verifyCronAuth(request);

      expect(result.authorized).toBe(false);
      if (!result.authorized) {
        expect(result.response.status).toBe(401);
      }
    });

    it("should return 401 when token is incorrect", () => {
      process.env.CRON_SECRET = "correct-secret";

      const request = new Request("http://localhost/api/cron/test", {
        headers: { authorization: "Bearer wrong-secret" },
      });

      const result = verifyCronAuth(request);

      expect(result.authorized).toBe(false);
      if (!result.authorized) {
        expect(result.response.status).toBe(401);
      }
    });

    it("should authorize when token is correct", () => {
      process.env.CRON_SECRET = "correct-secret";

      const request = new Request("http://localhost/api/cron/test", {
        headers: { authorization: "Bearer correct-secret" },
      });

      const result = verifyCronAuth(request);

      expect(result.authorized).toBe(true);
    });

    it("should include job name in logs when provided", () => {
      process.env.CRON_SECRET = "test-secret";
      const consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      const request = new Request("http://localhost/api/cron/test");

      verifyCronAuth(request, "test-job");

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining("test-job")
      );

      consoleWarnSpy.mockRestore();
    });

    it("should handle tokens with special characters", () => {
      const specialSecret = "s3cr3t!@#$%^&*()_+-=[]{}|;:',.<>?/~`";
      process.env.CRON_SECRET = specialSecret;

      const request = new Request("http://localhost/api/cron/test", {
        headers: { authorization: `Bearer ${specialSecret}` },
      });

      const result = verifyCronAuth(request);

      expect(result.authorized).toBe(true);
    });
  });

  describe("withCronAuth", () => {
    it("should call handler when authentication succeeds", async () => {
      process.env.CRON_SECRET = "test-secret";

      const mockHandler = vi.fn().mockResolvedValue(
        NextResponse.json({ success: true })
      );

      const wrappedHandler = withCronAuth(mockHandler, "test-job");

      const request = new Request("http://localhost/api/cron/test", {
        headers: { authorization: "Bearer test-secret" },
      });

      const response = await wrappedHandler(request);

      expect(mockHandler).toHaveBeenCalledWith(request);
      expect(response.status).toBe(200);
    });

    it("should not call handler when authentication fails", async () => {
      process.env.CRON_SECRET = "test-secret";

      const mockHandler = vi.fn().mockResolvedValue(
        NextResponse.json({ success: true })
      );

      const wrappedHandler = withCronAuth(mockHandler, "test-job");

      const request = new Request("http://localhost/api/cron/test", {
        headers: { authorization: "Bearer wrong-secret" },
      });

      const response = await wrappedHandler(request);

      expect(mockHandler).not.toHaveBeenCalled();
      expect(response.status).toBe(401);
    });

    it("should return 401 when no authorization header", async () => {
      process.env.CRON_SECRET = "test-secret";

      const mockHandler = vi.fn().mockResolvedValue(
        NextResponse.json({ success: true })
      );

      const wrappedHandler = withCronAuth(mockHandler);

      const request = new Request("http://localhost/api/cron/test");

      const response = await wrappedHandler(request);

      expect(mockHandler).not.toHaveBeenCalled();
      expect(response.status).toBe(401);
    });
  });

  describe("Timing Attack Prevention", () => {
    it("should take similar time for correct and incorrect tokens of same length", () => {
      process.env.CRON_SECRET = "a".repeat(32);

      const correctToken = "a".repeat(32);
      const incorrectToken = "b".repeat(32);

      // Measure time for correct token
      const startCorrect = performance.now();
      constantTimeCompare(correctToken, process.env.CRON_SECRET);
      const timeCorrect = performance.now() - startCorrect;

      // Measure time for incorrect token
      const startIncorrect = performance.now();
      constantTimeCompare(incorrectToken, process.env.CRON_SECRET);
      const timeIncorrect = performance.now() - startIncorrect;

      // Times should be similar (within reasonable variance)
      // This is a basic check - true timing attack prevention requires more sophisticated testing
      const timeDifference = Math.abs(timeCorrect - timeIncorrect);
      expect(timeDifference).toBeLessThan(5); // 5ms variance tolerance
    });
  });
});
