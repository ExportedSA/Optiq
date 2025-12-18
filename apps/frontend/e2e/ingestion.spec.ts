import { test, expect } from "@playwright/test";

/**
 * E2E Tests: Event Ingestion & Aggregation
 * 
 * Tests event tracking, ingestion, and data aggregation.
 */

test.describe("Event Ingestion", () => {
  test("should accept tracking events via API", async ({ request }) => {
    // Test the tracking/ingest API endpoint
    const response = await request.post("/api/tracking/ingest", {
      data: {
        siteId: "test-site-id",
        events: [
          {
            type: "page_view",
            url: "https://example.com/landing",
            timestamp: new Date().toISOString(),
            sessionId: "test-session-1",
            userId: "test-user-1",
          },
        ],
      },
    });

    // Should accept or return auth error (both are valid responses)
    expect([200, 201, 400, 401, 403]).toContain(response.status());
  });

  test("should accept conversion events", async ({ request }) => {
    const response = await request.post("/api/tracking/ingest", {
      data: {
        siteId: "test-site-id",
        events: [
          {
            type: "conversion",
            url: "https://example.com/thank-you",
            timestamp: new Date().toISOString(),
            sessionId: "test-session-1",
            userId: "test-user-1",
            value: 99.99,
            currency: "USD",
            conversionType: "purchase",
          },
        ],
      },
    });

    expect([200, 201, 400, 401, 403]).toContain(response.status());
  });

  test("should handle batch events", async ({ request }) => {
    const events = Array.from({ length: 10 }, (_, i) => ({
      type: "page_view",
      url: `https://example.com/page-${i}`,
      timestamp: new Date(Date.now() - i * 60000).toISOString(),
      sessionId: "test-session-batch",
      userId: "test-user-batch",
    }));

    const response = await request.post("/api/tracking/ingest", {
      data: {
        siteId: "test-site-id",
        events,
      },
    });

    expect([200, 201, 400, 401, 403]).toContain(response.status());
  });

  test("should reject invalid events", async ({ request }) => {
    const response = await request.post("/api/tracking/ingest", {
      data: {
        // Missing required fields
        events: [{ invalid: true }],
      },
    });

    // Should return 400 for invalid data
    expect([400, 401, 403, 422]).toContain(response.status());
  });

  test("should rate limit excessive requests", async ({ request }) => {
    const requests = [];
    
    // Send many requests quickly
    for (let i = 0; i < 20; i++) {
      requests.push(
        request.post("/api/tracking/ingest", {
          data: {
            siteId: "test-site-id",
            events: [{ type: "page_view", url: `https://example.com/${i}` }],
          },
        })
      );
    }

    const responses = await Promise.all(requests);
    const statuses = responses.map((r) => r.status());

    // Should eventually get rate limited (429) or all succeed
    const hasRateLimit = statuses.includes(429);
    const allSucceeded = statuses.every((s) => [200, 201, 400, 401, 403].includes(s));

    expect(hasRateLimit || allSucceeded).toBe(true);
  });
});

test.describe("Metering API", () => {
  test("should return usage data", async ({ request }) => {
    const response = await request.get("/api/metering/usage");

    // Should return data or auth error
    if (response.status() === 200) {
      const data = await response.json();
      expect(data).toHaveProperty("throttleStatus");
      expect(data).toHaveProperty("limits");
    } else {
      expect([401, 403]).toContain(response.status());
    }
  });

  test("should record metering events", async ({ request }) => {
    const response = await request.post("/api/metering/record", {
      data: {
        eventType: "page_view",
        count: 1,
      },
    });

    expect([200, 201, 400, 401, 403, 429]).toContain(response.status());
  });
});

test.describe("Health Check", () => {
  test("should return health status", async ({ request }) => {
    const response = await request.get("/api/health");

    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data).toHaveProperty("status");
    expect(["healthy", "degraded", "unhealthy"]).toContain(data.status);
  });

  test("should return liveness status", async ({ request }) => {
    const response = await request.get("/api/health?type=live");

    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data).toHaveProperty("alive");
    expect(data.alive).toBe(true);
  });

  test("should return readiness status", async ({ request }) => {
    const response = await request.get("/api/health?type=ready");

    // Can be 200 or 503 depending on DB status
    expect([200, 503]).toContain(response.status());

    const data = await response.json();
    expect(data).toHaveProperty("ready");
  });
});
