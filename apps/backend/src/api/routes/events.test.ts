/**
 * Event Ingestion API Tests
 * 
 * These tests demonstrate the expected behavior of the /api/events endpoint.
 * To run these tests, you'll need to:
 * 1. Install a test framework (e.g., vitest, jest)
 * 2. Set up test database
 * 3. Configure test environment
 * 
 * Example test setup:
 * ```bash
 * npm install --save-dev vitest @vitest/ui
 * ```
 */

import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import { PrismaClient } from "@prisma/client";
import type { FastifyInstance } from "fastify";
import Fastify from "fastify";

import { registerEventRoutes } from "./events";
import { registerLoggingMiddleware } from "../../middleware/logging";
import { registerRateLimitMiddleware } from "../../middleware/rate-limit";

const prisma = new PrismaClient();
let app: FastifyInstance;
let testSiteKey: string;
let testOrganizationId: string;
let testSiteId: string;

/**
 * Setup test environment
 */
beforeAll(async () => {
  // Create test Fastify app
  app = Fastify({ logger: false });
  await registerLoggingMiddleware(app);
  await registerRateLimitMiddleware(app);
  await registerEventRoutes(app);

  // Create test organization
  const org = await prisma.organization.create({
    data: {
      name: "Test Organization",
      slug: "test-org-" + Date.now(),
    },
  });
  testOrganizationId = org.id;

  // Create test tracking site
  const site = await prisma.trackingSite.create({
    data: {
      organizationId: testOrganizationId,
      name: "Test Site",
      domain: "example.com",
      publicKey: "test_key_" + Date.now(),
    },
  });
  testSiteKey = site.publicKey;
  testSiteId = site.id;
});

/**
 * Cleanup test environment
 */
afterAll(async () => {
  // Clean up test data
  await prisma.trackingEvent.deleteMany({
    where: { siteId: testSiteId },
  });
  await prisma.trackingSite.delete({
    where: { id: testSiteId },
  });
  await prisma.organization.delete({
    where: { id: testOrganizationId },
  });

  await prisma.$disconnect();
  await app.close();
});

/**
 * Clean up events before each test
 */
beforeEach(async () => {
  await prisma.trackingEvent.deleteMany({
    where: { siteId: testSiteId },
  });
});

describe("POST /api/events", () => {
  it("should accept a valid single event", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/events",
      payload: {
        siteKey: testSiteKey,
        events: [
          {
            eventId: "evt_test_001",
            type: "PAGE_VIEW",
            url: "https://example.com/page",
            path: "/page",
            anonymousId: "anon_123",
            sessionId: "sess_123",
          },
        ],
      },
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.success).toBe(true);
    expect(body.accepted).toBe(1);
    expect(body.rejected).toBe(0);
    expect(body.duplicates).toBe(0);
  });

  it("should accept a batch of events", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/events",
      payload: {
        siteKey: testSiteKey,
        events: [
          {
            eventId: "evt_batch_001",
            type: "PAGE_VIEW",
            url: "https://example.com/page1",
            path: "/page1",
            anonymousId: "anon_123",
            sessionId: "sess_123",
          },
          {
            eventId: "evt_batch_002",
            type: "PAGE_VIEW",
            url: "https://example.com/page2",
            path: "/page2",
            anonymousId: "anon_123",
            sessionId: "sess_123",
          },
          {
            eventId: "evt_batch_003",
            type: "CONVERSION",
            name: "Purchase",
            url: "https://example.com/checkout",
            path: "/checkout",
            anonymousId: "anon_123",
            sessionId: "sess_123",
            value: 99.99,
          },
        ],
      },
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.success).toBe(true);
    expect(body.accepted).toBe(3);
    expect(body.rejected).toBe(0);
    expect(body.duplicates).toBe(0);
  });

  it("should deduplicate events by eventId", async () => {
    // First request
    const response1 = await app.inject({
      method: "POST",
      url: "/api/events",
      payload: {
        siteKey: testSiteKey,
        events: [
          {
            eventId: "evt_dedupe_001",
            type: "PAGE_VIEW",
            url: "https://example.com/page",
            path: "/page",
            anonymousId: "anon_123",
            sessionId: "sess_123",
          },
        ],
      },
    });

    expect(response1.statusCode).toBe(200);
    const body1 = JSON.parse(response1.body);
    expect(body1.accepted).toBe(1);
    expect(body1.duplicates).toBe(0);

    // Second request with same eventId
    const response2 = await app.inject({
      method: "POST",
      url: "/api/events",
      payload: {
        siteKey: testSiteKey,
        events: [
          {
            eventId: "evt_dedupe_001", // Same eventId
            type: "PAGE_VIEW",
            url: "https://example.com/page",
            path: "/page",
            anonymousId: "anon_123",
            sessionId: "sess_123",
          },
        ],
      },
    });

    expect(response2.statusCode).toBe(200);
    const body2 = JSON.parse(response2.body);
    expect(body2.accepted).toBe(0);
    expect(body2.duplicates).toBe(1);
  });

  it("should handle mixed success and duplicate events", async () => {
    // Insert first event
    await app.inject({
      method: "POST",
      url: "/api/events",
      payload: {
        siteKey: testSiteKey,
        events: [
          {
            eventId: "evt_mixed_001",
            type: "PAGE_VIEW",
            url: "https://example.com/page",
            path: "/page",
            anonymousId: "anon_123",
            sessionId: "sess_123",
          },
        ],
      },
    });

    // Send batch with duplicate and new events
    const response = await app.inject({
      method: "POST",
      url: "/api/events",
      payload: {
        siteKey: testSiteKey,
        events: [
          {
            eventId: "evt_mixed_001", // Duplicate
            type: "PAGE_VIEW",
            url: "https://example.com/page",
            path: "/page",
            anonymousId: "anon_123",
            sessionId: "sess_123",
          },
          {
            eventId: "evt_mixed_002", // New
            type: "PAGE_VIEW",
            url: "https://example.com/page2",
            path: "/page2",
            anonymousId: "anon_123",
            sessionId: "sess_123",
          },
        ],
      },
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.accepted).toBe(1);
    expect(body.duplicates).toBe(1);
  });

  it("should reject invalid site key", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/events",
      payload: {
        siteKey: "invalid_key",
        events: [
          {
            eventId: "evt_test_001",
            type: "PAGE_VIEW",
            url: "https://example.com/page",
            path: "/page",
            anonymousId: "anon_123",
            sessionId: "sess_123",
          },
        ],
      },
    });

    expect(response.statusCode).toBe(401);
    const body = JSON.parse(response.body);
    expect(body.success).toBe(false);
    expect(body.error).toBe("Unauthorized");
  });

  it("should validate event schema", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/events",
      payload: {
        siteKey: testSiteKey,
        events: [
          {
            eventId: "evt_test_001",
            type: "PAGE_VIEW",
            // Missing required fields: url, path, anonymousId, sessionId
          },
        ],
      },
    });

    expect(response.statusCode).toBe(400);
    const body = JSON.parse(response.body);
    expect(body.success).toBe(false);
    expect(body.error).toBe("Invalid request");
  });

  it("should require name for CONVERSION events", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/events",
      payload: {
        siteKey: testSiteKey,
        events: [
          {
            eventId: "evt_test_001",
            type: "CONVERSION",
            // Missing name field
            url: "https://example.com/checkout",
            path: "/checkout",
            anonymousId: "anon_123",
            sessionId: "sess_123",
          },
        ],
      },
    });

    expect(response.statusCode).toBe(400);
    const body = JSON.parse(response.body);
    expect(body.success).toBe(false);
  });

  it("should accept conversion with value", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/events",
      payload: {
        siteKey: testSiteKey,
        events: [
          {
            eventId: "evt_conversion_001",
            type: "CONVERSION",
            name: "Purchase",
            url: "https://example.com/checkout",
            path: "/checkout",
            anonymousId: "anon_123",
            sessionId: "sess_123",
            value: 149.99,
          },
        ],
      },
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.success).toBe(true);
    expect(body.accepted).toBe(1);

    // Verify value was stored correctly
    const event = await prisma.trackingEvent.findFirst({
      where: {
        siteId: testSiteId,
        eventId: "evt_conversion_001",
      },
    });

    expect(event).not.toBeNull();
    expect(event?.valueMicros).toBe(BigInt(149_990_000)); // 149.99 * 1,000,000
  });

  it("should accept UTM parameters", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/events",
      payload: {
        siteKey: testSiteKey,
        events: [
          {
            eventId: "evt_utm_001",
            type: "PAGE_VIEW",
            url: "https://example.com/page?utm_source=google",
            path: "/page",
            anonymousId: "anon_123",
            sessionId: "sess_123",
            utm: {
              source: "google",
              medium: "cpc",
              campaign: "summer_sale",
              term: "shoes",
              content: "ad_variant_a",
            },
          },
        ],
      },
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.success).toBe(true);

    // Verify UTM parameters were stored
    const event = await prisma.trackingEvent.findFirst({
      where: {
        siteId: testSiteId,
        eventId: "evt_utm_001",
      },
    });

    expect(event?.utmSource).toBe("google");
    expect(event?.utmMedium).toBe("cpc");
    expect(event?.utmCampaign).toBe("summer_sale");
  });

  it("should accept custom properties", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/events",
      payload: {
        siteKey: testSiteKey,
        events: [
          {
            eventId: "evt_props_001",
            type: "CUSTOM",
            name: "Button Click",
            url: "https://example.com/page",
            path: "/page",
            anonymousId: "anon_123",
            sessionId: "sess_123",
            properties: {
              buttonId: "cta-primary",
              buttonText: "Get Started",
              section: "hero",
            },
          },
        ],
      },
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.success).toBe(true);

    // Verify properties were stored
    const event = await prisma.trackingEvent.findFirst({
      where: {
        siteId: testSiteId,
        eventId: "evt_props_001",
      },
    });

    expect(event?.properties).toEqual({
      buttonId: "cta-primary",
      buttonText: "Get Started",
      section: "hero",
    });
  });

  it("should enforce batch size limit", async () => {
    const events = Array.from({ length: 101 }, (_, i) => ({
      eventId: `evt_batch_${i}`,
      type: "PAGE_VIEW" as const,
      url: "https://example.com/page",
      path: "/page",
      anonymousId: "anon_123",
      sessionId: "sess_123",
    }));

    const response = await app.inject({
      method: "POST",
      url: "/api/events",
      payload: {
        siteKey: testSiteKey,
        events,
      },
    });

    expect(response.statusCode).toBe(400);
    const body = JSON.parse(response.body);
    expect(body.success).toBe(false);
  });

  it("should return deterministic response for idempotent requests", async () => {
    const payload = {
      siteKey: testSiteKey,
      events: [
        {
          eventId: "evt_idempotent_001",
          type: "PAGE_VIEW",
          url: "https://example.com/page",
          path: "/page",
          anonymousId: "anon_123",
          sessionId: "sess_123",
        },
      ],
    };

    // First request
    const response1 = await app.inject({
      method: "POST",
      url: "/api/events",
      payload,
    });

    // Second identical request
    const response2 = await app.inject({
      method: "POST",
      url: "/api/events",
      payload,
    });

    // Both should return 200 (deterministic)
    expect(response1.statusCode).toBe(200);
    expect(response2.statusCode).toBe(200);

    const body1 = JSON.parse(response1.body);
    const body2 = JSON.parse(response2.body);

    // First should accept, second should dedupe
    expect(body1.accepted).toBe(1);
    expect(body1.duplicates).toBe(0);
    expect(body2.accepted).toBe(0);
    expect(body2.duplicates).toBe(1);
  });
});

describe("GET /api/events/health", () => {
  it("should return healthy status", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/api/events/health",
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.status).toBe("healthy");
    expect(body.service).toBe("event-ingestion");
  });
});
