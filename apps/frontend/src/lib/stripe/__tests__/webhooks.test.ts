import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock prisma
vi.mock("@/lib/prisma", () => ({
  prisma: {
    subscription: {
      upsert: vi.fn(),
      update: vi.fn(),
      findFirst: vi.fn(),
    },
  },
}));

// Mock config
vi.mock("../config", () => ({
  getTierFromPriceId: vi.fn((priceId: string) => {
    if (priceId === "price_starter_monthly") return { tier: "STARTER", interval: "monthly" };
    if (priceId === "price_growth_monthly") return { tier: "GROWTH", interval: "monthly" };
    if (priceId === "price_scale_annual") return { tier: "SCALE", interval: "annual" };
    return null;
  }),
}));

import { prisma } from "@/lib/prisma";
import {
  handleSubscriptionCreated,
  handleSubscriptionUpdated,
  handleSubscriptionDeleted,
  handleInvoicePaid,
  handleInvoicePaymentFailed,
} from "../webhooks";

describe("Stripe Webhooks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("handleSubscriptionCreated", () => {
    it("creates subscription with correct plan from price ID", async () => {
      const subscription = {
        id: "sub_123",
        customer: "cus_123",
        status: "active",
        current_period_start: Math.floor(Date.now() / 1000),
        current_period_end: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60,
        cancel_at_period_end: false,
        trial_start: null,
        trial_end: null,
        metadata: { organizationId: "org_123" },
        items: {
          data: [{ price: { id: "price_starter_monthly" } }],
        },
      } as any;

      vi.mocked(prisma.subscription.upsert).mockResolvedValue({} as any);

      const result = await handleSubscriptionCreated(subscription);

      expect(result.success).toBe(true);
      expect(prisma.subscription.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { organizationId: "org_123" },
          create: expect.objectContaining({
            plan: "STARTER",
            status: "ACTIVE",
            stripeSubscriptionId: "sub_123",
          }),
        })
      );
    });

    it("returns error when organizationId is missing", async () => {
      const subscription = {
        id: "sub_123",
        metadata: {},
        items: { data: [{ price: { id: "price_starter_monthly" } }] },
      } as any;

      const result = await handleSubscriptionCreated(subscription);

      expect(result.success).toBe(false);
      expect(result.message).toContain("organizationId");
    });
  });

  describe("handleSubscriptionUpdated", () => {
    it("updates existing subscription", async () => {
      vi.mocked(prisma.subscription.findFirst).mockResolvedValue({
        organizationId: "org_123",
      } as any);
      vi.mocked(prisma.subscription.update).mockResolvedValue({} as any);

      const subscription = {
        id: "sub_123",
        status: "active",
        current_period_start: Math.floor(Date.now() / 1000),
        current_period_end: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60,
        cancel_at_period_end: false,
        canceled_at: null,
        items: { data: [{ price: { id: "price_growth_monthly" } }] },
      } as any;

      const result = await handleSubscriptionUpdated(subscription);

      expect(result.success).toBe(true);
      expect(prisma.subscription.update).toHaveBeenCalled();
    });

    it("creates subscription if not found", async () => {
      vi.mocked(prisma.subscription.findFirst).mockResolvedValue(null);
      vi.mocked(prisma.subscription.upsert).mockResolvedValue({} as any);

      const subscription = {
        id: "sub_123",
        customer: "cus_123",
        status: "active",
        current_period_start: Math.floor(Date.now() / 1000),
        current_period_end: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60,
        cancel_at_period_end: false,
        trial_start: null,
        trial_end: null,
        metadata: { organizationId: "org_123" },
        items: { data: [{ price: { id: "price_starter_monthly" } }] },
      } as any;

      const result = await handleSubscriptionUpdated(subscription);

      expect(result.success).toBe(true);
    });
  });

  describe("handleSubscriptionDeleted", () => {
    it("downgrades to FREE plan", async () => {
      vi.mocked(prisma.subscription.findFirst).mockResolvedValue({
        organizationId: "org_123",
      } as any);
      vi.mocked(prisma.subscription.update).mockResolvedValue({} as any);

      const subscription = { id: "sub_123" } as any;

      const result = await handleSubscriptionDeleted(subscription);

      expect(result.success).toBe(true);
      expect(prisma.subscription.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            plan: "FREE",
            status: "CANCELED",
          }),
        })
      );
    });

    it("returns error when subscription not found", async () => {
      vi.mocked(prisma.subscription.findFirst).mockResolvedValue(null);

      const subscription = { id: "sub_unknown" } as any;

      const result = await handleSubscriptionDeleted(subscription);

      expect(result.success).toBe(false);
    });
  });

  describe("handleInvoicePaid", () => {
    it("updates subscription status to ACTIVE", async () => {
      vi.mocked(prisma.subscription.findFirst).mockResolvedValue({
        organizationId: "org_123",
      } as any);
      vi.mocked(prisma.subscription.update).mockResolvedValue({} as any);

      const invoice = {
        subscription: "sub_123",
        lines: {
          data: [
            {
              period: {
                start: Math.floor(Date.now() / 1000),
                end: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60,
              },
            },
          ],
        },
      } as any;

      const result = await handleInvoicePaid(invoice);

      expect(result.success).toBe(true);
      expect(prisma.subscription.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            status: "ACTIVE",
          }),
        })
      );
    });
  });

  describe("handleInvoicePaymentFailed", () => {
    it("updates subscription status to PAST_DUE", async () => {
      vi.mocked(prisma.subscription.findFirst).mockResolvedValue({
        organizationId: "org_123",
      } as any);
      vi.mocked(prisma.subscription.update).mockResolvedValue({} as any);

      const invoice = { subscription: "sub_123" } as any;

      const result = await handleInvoicePaymentFailed(invoice);

      expect(result.success).toBe(true);
      expect(prisma.subscription.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: { status: "PAST_DUE" },
        })
      );
    });
  });
});
