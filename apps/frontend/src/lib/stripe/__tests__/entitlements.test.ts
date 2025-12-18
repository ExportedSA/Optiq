import { describe, it, expect, vi, beforeEach } from "vitest";
import { PLAN_DEFINITIONS } from "@optiq/shared";

// Mock prisma
vi.mock("@/lib/prisma", () => ({
  prisma: {
    subscription: {
      findUnique: vi.fn(),
    },
    adAccount: {
      count: vi.fn(),
    },
    trackingSite: {
      findMany: vi.fn(),
    },
    trackingEvent: {
      count: vi.fn(),
    },
  },
}));

import { prisma } from "@/lib/prisma";
import {
  getEntitlements,
  checkConnectorLimit,
  checkWorkspaceLimit,
  checkEventLimit,
  checkAttributionModel,
  checkAlertsEnabled,
} from "../entitlements";

describe("Entitlements", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getEntitlements", () => {
    it("returns FREE plan limits when no subscription exists", async () => {
      vi.mocked(prisma.subscription.findUnique).mockResolvedValue(null);

      const entitlements = await getEntitlements("org-123");

      expect(entitlements.plan).toBe("FREE");
      expect(entitlements.maxWorkspaces).toBe(PLAN_DEFINITIONS.FREE.limits.maxWorkspaces);
      expect(entitlements.maxConnectors).toBe(PLAN_DEFINITIONS.FREE.limits.maxConnectors);
      expect(entitlements.monthlyEventLimit).toBe(PLAN_DEFINITIONS.FREE.limits.monthlyEventLimit);
      expect(entitlements.isActive).toBe(true);
    });

    it("returns subscription limits when subscription exists", async () => {
      vi.mocked(prisma.subscription.findUnique).mockResolvedValue({
        id: "sub-123",
        organizationId: "org-123",
        plan: "GROWTH",
        status: "ACTIVE",
        monthlyEventLimit: 100000,
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(),
      } as any);

      const entitlements = await getEntitlements("org-123");

      expect(entitlements.plan).toBe("GROWTH");
      expect(entitlements.monthlyEventLimit).toBe(100000);
      expect(entitlements.isActive).toBe(true);
    });

    it("returns isActive=false for canceled subscriptions", async () => {
      vi.mocked(prisma.subscription.findUnique).mockResolvedValue({
        id: "sub-123",
        organizationId: "org-123",
        plan: "STARTER",
        status: "CANCELED",
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(),
      } as any);

      const entitlements = await getEntitlements("org-123");

      expect(entitlements.isActive).toBe(false);
    });
  });

  describe("checkConnectorLimit", () => {
    it("allows when under limit", async () => {
      vi.mocked(prisma.subscription.findUnique).mockResolvedValue({
        plan: "STARTER",
        status: "ACTIVE",
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(),
      } as any);
      vi.mocked(prisma.adAccount.count).mockResolvedValue(1);

      const result = await checkConnectorLimit("org-123");

      expect(result.allowed).toBe(true);
    });

    it("blocks when at limit", async () => {
      vi.mocked(prisma.subscription.findUnique).mockResolvedValue({
        plan: "STARTER",
        status: "ACTIVE",
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(),
      } as any);
      vi.mocked(prisma.adAccount.count).mockResolvedValue(2); // STARTER limit is 2

      const result = await checkConnectorLimit("org-123");

      expect(result.allowed).toBe(false);
      expect(result).toHaveProperty("upgradeRequired", true);
    });

    it("allows unlimited for SCALE plan", async () => {
      vi.mocked(prisma.subscription.findUnique).mockResolvedValue({
        plan: "SCALE",
        status: "ACTIVE",
        maxConnectors: -1,
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(),
      } as any);
      vi.mocked(prisma.adAccount.count).mockResolvedValue(100);

      const result = await checkConnectorLimit("org-123");

      expect(result.allowed).toBe(true);
    });
  });

  describe("checkEventLimit", () => {
    it("allows when under limit", async () => {
      vi.mocked(prisma.subscription.findUnique).mockResolvedValue({
        plan: "STARTER",
        status: "ACTIVE",
        monthlyEventLimit: 10000,
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(),
      } as any);
      vi.mocked(prisma.trackingSite.findMany).mockResolvedValue([{ id: "site-1" }] as any);
      vi.mocked(prisma.trackingEvent.count).mockResolvedValue(5000);

      const result = await checkEventLimit("org-123");

      expect(result.allowed).toBe(true);
    });

    it("blocks when significantly over limit (>150%)", async () => {
      vi.mocked(prisma.subscription.findUnique).mockResolvedValue({
        plan: "STARTER",
        status: "ACTIVE",
        monthlyEventLimit: 10000,
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(),
      } as any);
      vi.mocked(prisma.trackingSite.findMany).mockResolvedValue([{ id: "site-1" }] as any);
      vi.mocked(prisma.trackingEvent.count).mockResolvedValue(16000); // >150% of 10000

      const result = await checkEventLimit("org-123");

      expect(result.allowed).toBe(false);
      expect(result).toHaveProperty("upgradeRequired", true);
    });
  });

  describe("checkAttributionModel", () => {
    it("allows models included in plan", async () => {
      vi.mocked(prisma.subscription.findUnique).mockResolvedValue({
        plan: "GROWTH",
        status: "ACTIVE",
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(),
      } as any);

      const result = await checkAttributionModel("org-123", "TIME_DECAY");

      expect(result.allowed).toBe(true);
    });

    it("blocks models not in plan", async () => {
      vi.mocked(prisma.subscription.findUnique).mockResolvedValue({
        plan: "STARTER",
        status: "ACTIVE",
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(),
      } as any);

      const result = await checkAttributionModel("org-123", "DATA_DRIVEN");

      expect(result.allowed).toBe(false);
      expect(result).toHaveProperty("upgradeRequired", true);
    });
  });

  describe("checkAlertsEnabled", () => {
    it("allows alerts for GROWTH plan", async () => {
      vi.mocked(prisma.subscription.findUnique).mockResolvedValue({
        plan: "GROWTH",
        status: "ACTIVE",
        alertsEnabled: true,
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(),
      } as any);

      const result = await checkAlertsEnabled("org-123");

      expect(result.allowed).toBe(true);
    });

    it("blocks alerts for STARTER plan", async () => {
      vi.mocked(prisma.subscription.findUnique).mockResolvedValue({
        plan: "STARTER",
        status: "ACTIVE",
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(),
      } as any);

      const result = await checkAlertsEnabled("org-123");

      expect(result.allowed).toBe(false);
      expect(result).toHaveProperty("upgradeRequired", true);
    });
  });
});
