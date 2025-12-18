/**
 * Conversion Ingestion API Tests
 * 
 * These tests demonstrate the expected behavior of the /api/conversions endpoint.
 * To run these tests, you'll need to:
 * 1. Install a test framework (e.g., vitest, jest)
 * 2. Set up test database
 * 3. Configure test environment
 */

import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import { PrismaClient } from "@prisma/client";
import type { FastifyInstance } from "fastify";
import Fastify from "fastify";

import { registerConversionRoutes, hashEmail, hashPhone, normalizeEmail, normalizePhone } from "./conversions";
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
  await registerConversionRoutes(app);

  // Create test organization
  const org = await prisma.organization.create({
    data: {
      name: "Test Organization",
      slug: "test-org-conv-" + Date.now(),
    },
  });
  testOrganizationId = org.id;

  // Create test tracking site
  const site = await prisma.trackingSite.create({
    data: {
      organizationId: testOrganizationId,
      name: "Test Site",
      domain: "example.com",
      publicKey: "test_conv_key_" + Date.now(),
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
  await prisma.touchPoint.deleteMany({
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
 * Clean up conversions before each test
 */
beforeEach(async () => {
  await prisma.trackingEvent.deleteMany({
    where: { siteId: testSiteId },
  });
  await prisma.touchPoint.deleteMany({
    where: { siteId: testSiteId },
  });
});

describe("Customer Identifier Hashing", () => {
  it("should normalize and hash email correctly", () => {
    const email1 = "User@Example.com";
    const email2 = "user@example.com";
    const email3 = "  user@example.com  ";

    expect(normalizeEmail(email1)).toBe("user@example.com");
    expect(normalizeEmail(email2)).toBe("user@example.com");
    expect(normalizeEmail(email3)).toBe("user@example.com");

    // All should produce same hash
    expect(hashEmail(email1)).toBe(hashEmail(email2));
    expect(hashEmail(email2)).toBe(hashEmail(email3));

    // Hash should be 64 characters (SHA-256)
    expect(hashEmail(email1)).toHaveLength(64);
  });

  it("should normalize and hash phone correctly", () => {
    const phone1 = "+1-234-567-8900";
    const phone2 = "(234) 567-8900";
    const phone3 = "2345678900";

    // All should normalize to E.164 format
    expect(normalizePhone(phone1)).toBe("+12345678900");
    expect(normalizePhone(phone2)).toBe("+12345678900");
    expect(normalizePhone(phone3)).toBe("+12345678900");

    // All should produce same hash
    expect(hashPhone(phone1)).toBe(hashPhone(phone2));
    expect(hashPhone(phone2)).toBe(hashPhone(phone3));

    // Hash should be 64 characters (SHA-256)
    expect(hashPhone(phone1)).toHaveLength(64);
  });
});

describe("POST /api/conversions", () => {
  it("should accept a valid conversion", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/conversions",
      payload: {
        siteKey: testSiteKey,
        conversions: [
          {
            conversionId: "conv_test_001",
            conversionName: "Purchase",
            value: 149.99,
            currency: "USD",
            customer: {
              emailHash: hashEmail("user@example.com"),
              customerId: "cust_123",
            },
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

  it("should accept conversion with order ID", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/conversions",
      payload: {
        siteKey: testSiteKey,
        conversions: [
          {
            conversionId: "conv_order_001",
            orderId: "ORD-12345",
            conversionName: "Purchase",
            value: 299.99,
            currency: "USD",
            customer: {
              emailHash: hashEmail("customer@example.com"),
            },
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

    // Verify order ID was stored
    const event = await prisma.trackingEvent.findFirst({
      where: {
        siteId: testSiteId,
        eventId: "conv_order_001",
      },
    });

    expect(event).not.toBeNull();
    expect((event?.properties as any).orderId).toBe("ORD-12345");
  });

  it("should deduplicate conversions by conversionId", async () => {
    // First request
    const response1 = await app.inject({
      method: "POST",
      url: "/api/conversions",
      payload: {
        siteKey: testSiteKey,
        conversions: [
          {
            conversionId: "conv_dedupe_001",
            conversionName: "Purchase",
            value: 99.99,
            currency: "USD",
            customer: {
              customerId: "cust_123",
            },
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

    // Second request with same conversionId
    const response2 = await app.inject({
      method: "POST",
      url: "/api/conversions",
      payload: {
        siteKey: testSiteKey,
        conversions: [
          {
            conversionId: "conv_dedupe_001", // Same ID
            conversionName: "Purchase",
            value: 99.99,
            currency: "USD",
            customer: {
              customerId: "cust_123",
            },
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

  it("should accept conversion with multiple customer identifiers", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/conversions",
      payload: {
        siteKey: testSiteKey,
        conversions: [
          {
            conversionId: "conv_multi_id_001",
            conversionName: "Lead",
            value: 0,
            currency: "USD",
            customer: {
              emailHash: hashEmail("lead@example.com"),
              phoneHash: hashPhone("+1234567890"),
              customerId: "cust_456",
              externalId: "ext_789",
            },
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
  });

  it("should require at least one customer identifier", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/conversions",
      payload: {
        siteKey: testSiteKey,
        conversions: [
          {
            conversionId: "conv_no_customer_001",
            conversionName: "Purchase",
            value: 99.99,
            currency: "USD",
            customer: {}, // No identifiers
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

  it("should accept conversion with source metadata", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/conversions",
      payload: {
        siteKey: testSiteKey,
        conversions: [
          {
            conversionId: "conv_source_001",
            conversionName: "Purchase",
            value: 199.99,
            currency: "USD",
            customer: {
              customerId: "cust_123",
            },
            anonymousId: "anon_123",
            sessionId: "sess_123",
            source: {
              utmSource: "google",
              utmMedium: "cpc",
              utmCampaign: "summer_sale",
              gclid: "abc123xyz",
              referrer: "https://google.com",
              landingPage: "https://example.com/products",
            },
          },
        ],
      },
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.success).toBe(true);

    // Verify source metadata was stored
    const event = await prisma.trackingEvent.findFirst({
      where: {
        siteId: testSiteId,
        eventId: "conv_source_001",
      },
    });

    expect(event?.utmSource).toBe("google");
    expect(event?.utmMedium).toBe("cpc");
    expect(event?.utmCampaign).toBe("summer_sale");

    // Verify touchpoint was created with gclid
    const touchpoint = await prisma.touchPoint.findFirst({
      where: {
        siteId: testSiteId,
        gclid: "abc123xyz",
      },
    });

    expect(touchpoint).not.toBeNull();
    expect(touchpoint?.utmSource).toBe("google");
  });

  it("should accept conversion with line items", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/conversions",
      payload: {
        siteKey: testSiteKey,
        conversions: [
          {
            conversionId: "conv_items_001",
            orderId: "ORD-67890",
            conversionName: "Purchase",
            value: 299.97,
            currency: "USD",
            customer: {
              emailHash: hashEmail("shopper@example.com"),
            },
            anonymousId: "anon_123",
            sessionId: "sess_123",
            lineItems: [
              {
                productId: "PROD-001",
                productName: "Running Shoes",
                quantity: 1,
                unitPrice: 99.99,
                totalPrice: 99.99,
                category: "Footwear",
                brand: "Nike",
              },
              {
                productId: "PROD-002",
                productName: "Sports Socks",
                quantity: 2,
                unitPrice: 9.99,
                totalPrice: 19.98,
                category: "Accessories",
              },
              {
                productId: "PROD-003",
                productName: "Water Bottle",
                quantity: 1,
                unitPrice: 180.00,
                totalPrice: 180.00,
                category: "Accessories",
              },
            ],
          },
        ],
      },
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.success).toBe(true);

    // Verify line items were stored
    const event = await prisma.trackingEvent.findFirst({
      where: {
        siteId: testSiteId,
        eventId: "conv_items_001",
      },
    });

    expect(event).not.toBeNull();
    const lineItems = (event?.properties as any).lineItems;
    expect(lineItems).toHaveLength(3);
    expect(lineItems[0].productId).toBe("PROD-001");
    expect(lineItems[0].quantity).toBe(1);
  });

  it("should accept batch of conversions", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/conversions",
      payload: {
        siteKey: testSiteKey,
        conversions: [
          {
            conversionId: "conv_batch_001",
            conversionName: "Purchase",
            value: 49.99,
            currency: "USD",
            customer: { customerId: "cust_1" },
            anonymousId: "anon_1",
            sessionId: "sess_1",
          },
          {
            conversionId: "conv_batch_002",
            conversionName: "Lead",
            value: 0,
            currency: "USD",
            customer: { emailHash: hashEmail("lead@example.com") },
            anonymousId: "anon_2",
            sessionId: "sess_2",
          },
          {
            conversionId: "conv_batch_003",
            conversionName: "Signup",
            value: 0,
            currency: "USD",
            customer: { phoneHash: hashPhone("+1234567890") },
            anonymousId: "anon_3",
            sessionId: "sess_3",
          },
        ],
      },
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.success).toBe(true);
    expect(body.accepted).toBe(3);
    expect(body.rejected).toBe(0);
  });

  it("should support different currencies", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/conversions",
      payload: {
        siteKey: testSiteKey,
        conversions: [
          {
            conversionId: "conv_eur_001",
            conversionName: "Purchase",
            value: 99.99,
            currency: "EUR",
            customer: { customerId: "cust_eur" },
            anonymousId: "anon_123",
            sessionId: "sess_123",
          },
          {
            conversionId: "conv_gbp_001",
            conversionName: "Purchase",
            value: 79.99,
            currency: "GBP",
            customer: { customerId: "cust_gbp" },
            anonymousId: "anon_456",
            sessionId: "sess_456",
          },
        ],
      },
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.success).toBe(true);
    expect(body.accepted).toBe(2);

    // Verify currencies were stored
    const events = await prisma.trackingEvent.findMany({
      where: {
        siteId: testSiteId,
        eventId: { in: ["conv_eur_001", "conv_gbp_001"] },
      },
    });

    expect(events).toHaveLength(2);
    expect((events[0].properties as any).currency).toBe("EUR");
    expect((events[1].properties as any).currency).toBe("GBP");
  });

  it("should store value in micros", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/conversions",
      payload: {
        siteKey: testSiteKey,
        conversions: [
          {
            conversionId: "conv_micros_001",
            conversionName: "Purchase",
            value: 149.99,
            currency: "USD",
            customer: { customerId: "cust_123" },
            anonymousId: "anon_123",
            sessionId: "sess_123",
          },
        ],
      },
    });

    expect(response.statusCode).toBe(200);

    // Verify value was stored in micros
    const event = await prisma.trackingEvent.findFirst({
      where: {
        siteId: testSiteId,
        eventId: "conv_micros_001",
      },
    });

    expect(event).not.toBeNull();
    expect(event?.valueMicros).toBe(BigInt(149_990_000)); // 149.99 * 1,000,000
  });

  it("should accept zero-value conversions (leads)", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/conversions",
      payload: {
        siteKey: testSiteKey,
        conversions: [
          {
            conversionId: "conv_lead_001",
            conversionName: "Lead",
            value: 0,
            currency: "USD",
            customer: {
              emailHash: hashEmail("lead@example.com"),
            },
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
  });

  it("should reject invalid site key", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/conversions",
      payload: {
        siteKey: "invalid_key",
        conversions: [
          {
            conversionId: "conv_test_001",
            conversionName: "Purchase",
            value: 99.99,
            currency: "USD",
            customer: { customerId: "cust_123" },
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

  it("should validate currency code format", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/conversions",
      payload: {
        siteKey: testSiteKey,
        conversions: [
          {
            conversionId: "conv_invalid_curr_001",
            conversionName: "Purchase",
            value: 99.99,
            currency: "US", // Invalid - must be 3 characters
            customer: { customerId: "cust_123" },
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

  it("should accept custom properties", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/conversions",
      payload: {
        siteKey: testSiteKey,
        conversions: [
          {
            conversionId: "conv_props_001",
            conversionName: "Purchase",
            value: 99.99,
            currency: "USD",
            customer: { customerId: "cust_123" },
            anonymousId: "anon_123",
            sessionId: "sess_123",
            properties: {
              paymentMethod: "credit_card",
              shippingMethod: "express",
              couponCode: "SUMMER20",
              isFirstPurchase: true,
            },
          },
        ],
      },
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.success).toBe(true);

    // Verify custom properties were stored
    const event = await prisma.trackingEvent.findFirst({
      where: {
        siteId: testSiteId,
        eventId: "conv_props_001",
      },
    });

    expect((event?.properties as any).paymentMethod).toBe("credit_card");
    expect((event?.properties as any).couponCode).toBe("SUMMER20");
  });
});

describe("POST /api/conversions/hash", () => {
  it("should hash email", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/conversions/hash",
      payload: {
        email: "user@example.com",
      },
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.emailHash).toBeDefined();
    expect(body.emailHash).toHaveLength(64);
  });

  it("should hash phone", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/conversions/hash",
      payload: {
        phone: "+1234567890",
      },
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.phoneHash).toBeDefined();
    expect(body.phoneHash).toHaveLength(64);
  });

  it("should hash both email and phone", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/conversions/hash",
      payload: {
        email: "user@example.com",
        phone: "+1234567890",
      },
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.emailHash).toBeDefined();
    expect(body.phoneHash).toBeDefined();
  });

  it("should require at least one identifier", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/conversions/hash",
      payload: {},
    });

    expect(response.statusCode).toBe(400);
  });
});

describe("GET /api/conversions/health", () => {
  it("should return healthy status", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/api/conversions/health",
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.status).toBe("healthy");
    expect(body.service).toBe("conversion-ingestion");
  });
});
