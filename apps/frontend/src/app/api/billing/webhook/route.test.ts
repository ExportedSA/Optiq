/**
 * Stripe Webhook Route Tests
 * 
 * Tests signature verification and error handling
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "./route";
import * as stripeModule from "@/lib/stripe";
import * as observabilityModule from "@/lib/observability";

// Mock dependencies
const mockHeadersGet = vi.fn();

vi.mock("next/headers", () => ({
  headers: vi.fn(() => Promise.resolve({
    get: mockHeadersGet,
  })),
}));

vi.mock("@/lib/stripe", () => ({
  isStripeConfigured: vi.fn(),
  constructWebhookEvent: vi.fn(),
  handleSubscriptionCreated: vi.fn(),
  handleSubscriptionUpdated: vi.fn(),
  handleSubscriptionDeleted: vi.fn(),
  handleInvoicePaid: vi.fn(),
  handleInvoicePaymentFailed: vi.fn(),
}));

vi.mock("@/lib/observability", () => ({
  appLogger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  },
}));

describe("Stripe Webhook Route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockHeadersGet.mockReturnValue(null);
  });

  describe("Signature Verification", () => {
    it("should reject webhook without signature header", async () => {
      vi.mocked(stripeModule.isStripeConfigured).mockReturnValue(true);
      
      const req = new Request("http://localhost/api/billing/webhook", {
        method: "POST",
        body: JSON.stringify({ type: "test.event" }),
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Missing signature");
      expect(observabilityModule.appLogger.warn).toHaveBeenCalledWith(
        "Stripe webhook received without signature header"
      );
    });

    it("should reject webhook with invalid signature", async () => {
      vi.mocked(stripeModule.isStripeConfigured).mockReturnValue(true);
      mockHeadersGet.mockReturnValue("invalid_signature");
      
      vi.mocked(stripeModule.constructWebhookEvent).mockImplementation(() => {
        throw new Error("Invalid signature");
      });

      const req = new Request("http://localhost/api/billing/webhook", {
        method: "POST",
        body: JSON.stringify({ type: "test.event" }),
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Invalid signature");
      expect(observabilityModule.appLogger.error).toHaveBeenCalledWith(
        "Stripe webhook signature verification failed",
        { error: "Invalid signature" }
      );
    });

    it("should accept webhook with valid signature", async () => {
      vi.mocked(stripeModule.isStripeConfigured).mockReturnValue(true);
      mockHeadersGet.mockReturnValue("valid_signature");
      
      const mockEvent = {
        id: "evt_test123",
        type: "customer.subscription.created",
        data: {
          object: {
            id: "sub_test123",
            customer: "cus_test123",
          },
        },
      };

      vi.mocked(stripeModule.constructWebhookEvent).mockReturnValue(mockEvent as any);
      vi.mocked(stripeModule.handleSubscriptionCreated).mockResolvedValue({
        success: true,
        message: "Subscription created",
      });

      const req = new Request("http://localhost/api/billing/webhook", {
        method: "POST",
        body: JSON.stringify({ type: "test.event" }),
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.received).toBe(true);
      expect(stripeModule.constructWebhookEvent).toHaveBeenCalled();
      expect(observabilityModule.appLogger.info).toHaveBeenCalledWith(
        "Stripe webhook received",
        { eventType: mockEvent.type, eventId: mockEvent.id }
      );
    });

    it("should use raw body text for signature verification", async () => {
      vi.mocked(stripeModule.isStripeConfigured).mockReturnValue(true);
      mockHeadersGet.mockReturnValue("valid_signature");
      
      const rawBody = '{"type":"test.event","data":{}}';
      const mockEvent = {
        id: "evt_test123",
        type: "test.event",
        data: { object: {} },
      };

      vi.mocked(stripeModule.constructWebhookEvent).mockReturnValue(mockEvent as any);

      const req = new Request("http://localhost/api/billing/webhook", {
        method: "POST",
        body: rawBody,
      });

      await POST(req);

      // Verify constructWebhookEvent was called with raw body string
      expect(stripeModule.constructWebhookEvent).toHaveBeenCalledWith(
        rawBody,
        "valid_signature"
      );
    });
  });

  describe("Configuration Check", () => {
    it("should return 503 when Stripe is not configured", async () => {
      vi.mocked(stripeModule.isStripeConfigured).mockReturnValue(false);

      const req = new Request("http://localhost/api/billing/webhook", {
        method: "POST",
        body: JSON.stringify({ type: "test.event" }),
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(503);
      expect(data.error).toBe("Stripe not configured");
      expect(observabilityModule.appLogger.warn).toHaveBeenCalledWith(
        "Stripe webhook received but Stripe not configured"
      );
    });
  });

  describe("Error Handling", () => {
    it("should handle webhook handler errors gracefully", async () => {
      vi.mocked(stripeModule.isStripeConfigured).mockReturnValue(true);
      mockHeadersGet.mockReturnValue("valid_signature");
      
      const mockEvent = {
        id: "evt_test123",
        type: "customer.subscription.created",
        data: { object: { id: "sub_test123" } },
      };

      vi.mocked(stripeModule.constructWebhookEvent).mockReturnValue(mockEvent as any);
      vi.mocked(stripeModule.handleSubscriptionCreated).mockRejectedValue(
        new Error("Database connection failed")
      );

      const req = new Request("http://localhost/api/billing/webhook", {
        method: "POST",
        body: JSON.stringify({ type: "test.event" }),
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe("Webhook handler failed");
      expect(observabilityModule.appLogger.error).toHaveBeenCalledWith(
        "Stripe webhook handler error",
        expect.objectContaining({
          error: "Database connection failed",
          eventType: mockEvent.type,
          eventId: mockEvent.id,
        })
      );
    });
  });
});
