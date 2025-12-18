import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  checkRateLimit,
  rateLimitByIp,
  rateLimitByOrg,
  combinedRateLimit,
  getClientIp,
  RATE_LIMITS,
} from "../rate-limit";

describe("Rate Limiting", () => {
  beforeEach(() => {
    // Reset the rate limit store between tests
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("checkRateLimit", () => {
    it("allows requests under the limit", () => {
      const config = { windowMs: 60000, maxRequests: 10 };

      for (let i = 0; i < 10; i++) {
        const result = checkRateLimit(`test-key-${Date.now()}`, config);
        expect(result.allowed).toBe(true);
      }
    });

    it("blocks requests over the limit", () => {
      const config = { windowMs: 60000, maxRequests: 3 };
      const key = `test-block-${Date.now()}`;

      // First 3 should be allowed
      expect(checkRateLimit(key, config).allowed).toBe(true);
      expect(checkRateLimit(key, config).allowed).toBe(true);
      expect(checkRateLimit(key, config).allowed).toBe(true);

      // 4th should be blocked
      const result = checkRateLimit(key, config);
      expect(result.allowed).toBe(false);
      expect(result.remaining).toBe(0);
      expect(result.retryAfter).toBeGreaterThan(0);
    });

    it("resets after window expires", () => {
      const config = { windowMs: 1000, maxRequests: 2 };
      const key = `test-reset-${Date.now()}`;

      expect(checkRateLimit(key, config).allowed).toBe(true);
      expect(checkRateLimit(key, config).allowed).toBe(true);
      expect(checkRateLimit(key, config).allowed).toBe(false);

      // Advance time past the window
      vi.advanceTimersByTime(1100);

      // Should be allowed again
      expect(checkRateLimit(key, config).allowed).toBe(true);
    });

    it("tracks remaining requests correctly", () => {
      const config = { windowMs: 60000, maxRequests: 5 };
      const key = `test-remaining-${Date.now()}`;

      expect(checkRateLimit(key, config).remaining).toBe(4);
      expect(checkRateLimit(key, config).remaining).toBe(3);
      expect(checkRateLimit(key, config).remaining).toBe(2);
      expect(checkRateLimit(key, config).remaining).toBe(1);
      expect(checkRateLimit(key, config).remaining).toBe(0);
    });
  });

  describe("rateLimitByIp", () => {
    it("creates unique keys per IP and endpoint", () => {
      const config = { windowMs: 60000, maxRequests: 2 };

      // Different IPs should have separate limits
      expect(rateLimitByIp("1.2.3.4", "/api/test", config).allowed).toBe(true);
      expect(rateLimitByIp("1.2.3.4", "/api/test", config).allowed).toBe(true);
      expect(rateLimitByIp("1.2.3.4", "/api/test", config).allowed).toBe(false);

      // Different IP should still be allowed
      expect(rateLimitByIp("5.6.7.8", "/api/test", config).allowed).toBe(true);
    });
  });

  describe("rateLimitByOrg", () => {
    it("creates unique keys per org and endpoint", () => {
      const config = { windowMs: 60000, maxRequests: 2 };

      expect(rateLimitByOrg("org-1", "/api/test", config).allowed).toBe(true);
      expect(rateLimitByOrg("org-1", "/api/test", config).allowed).toBe(true);
      expect(rateLimitByOrg("org-1", "/api/test", config).allowed).toBe(false);

      // Different org should still be allowed
      expect(rateLimitByOrg("org-2", "/api/test", config).allowed).toBe(true);
    });
  });

  describe("combinedRateLimit", () => {
    it("returns most restrictive result", () => {
      const checks = [
        { key: `combined-1-${Date.now()}`, config: { windowMs: 60000, maxRequests: 100 } },
        { key: `combined-2-${Date.now()}`, config: { windowMs: 60000, maxRequests: 5 } },
      ];

      const result = combinedRateLimit(checks);
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(4); // From the more restrictive limit
    });

    it("blocks if any limit is exceeded", () => {
      const key1 = `combined-block-1-${Date.now()}`;
      const key2 = `combined-block-2-${Date.now()}`;

      // Exhaust the first limit
      const config1 = { windowMs: 60000, maxRequests: 1 };
      checkRateLimit(key1, config1);

      const checks = [
        { key: key1, config: config1 },
        { key: key2, config: { windowMs: 60000, maxRequests: 100 } },
      ];

      const result = combinedRateLimit(checks);
      expect(result.allowed).toBe(false);
    });
  });

  describe("getClientIp", () => {
    it("extracts IP from x-forwarded-for", () => {
      const headers = new Headers();
      headers.set("x-forwarded-for", "1.2.3.4, 5.6.7.8");

      expect(getClientIp(headers)).toBe("1.2.3.4");
    });

    it("extracts IP from x-real-ip", () => {
      const headers = new Headers();
      headers.set("x-real-ip", "1.2.3.4");

      expect(getClientIp(headers)).toBe("1.2.3.4");
    });

    it("extracts IP from cf-connecting-ip", () => {
      const headers = new Headers();
      headers.set("cf-connecting-ip", "1.2.3.4");

      expect(getClientIp(headers)).toBe("1.2.3.4");
    });

    it("returns unknown when no IP headers present", () => {
      const headers = new Headers();

      expect(getClientIp(headers)).toBe("unknown");
    });

    it("prefers x-forwarded-for over other headers", () => {
      const headers = new Headers();
      headers.set("x-forwarded-for", "1.1.1.1");
      headers.set("x-real-ip", "2.2.2.2");
      headers.set("cf-connecting-ip", "3.3.3.3");

      expect(getClientIp(headers)).toBe("1.1.1.1");
    });
  });

  describe("RATE_LIMITS presets", () => {
    it("has appropriate limits for different endpoint types", () => {
      expect(RATE_LIMITS.ingest.maxRequests).toBeGreaterThan(RATE_LIMITS.api.maxRequests);
      expect(RATE_LIMITS.tracking.maxRequests).toBeGreaterThan(RATE_LIMITS.ingest.maxRequests);
      expect(RATE_LIMITS.auth.maxRequests).toBeLessThan(RATE_LIMITS.api.maxRequests);
    });
  });
});
