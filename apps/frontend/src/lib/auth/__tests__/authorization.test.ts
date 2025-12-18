import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock prisma
vi.mock("@/lib/prisma", () => ({
  prisma: {
    membership: {
      findUnique: vi.fn(),
    },
    adAccount: {
      count: vi.fn(),
    },
    campaign: {
      count: vi.fn(),
    },
    trackingSite: {
      count: vi.fn(),
    },
    alertRule: {
      count: vi.fn(),
    },
    journey: {
      count: vi.fn(),
    },
  },
}));

// Mock next-auth
vi.mock("next-auth", () => ({
  getServerSession: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({
  authOptions: {},
}));

import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import {
  getAuthContext,
  requireAuth,
  requirePermission,
  requireRole,
  verifyResourceOwnership,
  scopedWhere,
} from "../authorization";

describe("Authorization", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getAuthContext", () => {
    it("returns null when not authenticated", async () => {
      vi.mocked(getServerSession).mockResolvedValue(null);

      const context = await getAuthContext();

      expect(context).toBeNull();
    });

    it("returns null when no active org", async () => {
      vi.mocked(getServerSession).mockResolvedValue({
        user: { id: "user-1", email: "test@example.com" },
      } as any);

      const context = await getAuthContext();

      expect(context).toBeNull();
    });

    it("returns null when not a member of the org", async () => {
      vi.mocked(getServerSession).mockResolvedValue({
        user: { id: "user-1", email: "test@example.com", activeOrgId: "org-1" },
      } as any);
      vi.mocked(prisma.membership.findUnique).mockResolvedValue(null);

      const context = await getAuthContext();

      expect(context).toBeNull();
    });

    it("returns auth context when authenticated", async () => {
      vi.mocked(getServerSession).mockResolvedValue({
        user: { id: "user-1", email: "test@example.com", activeOrgId: "org-1" },
      } as any);
      vi.mocked(prisma.membership.findUnique).mockResolvedValue({
        role: "ADMIN",
      } as any);

      const context = await getAuthContext();

      expect(context).toEqual({
        userId: "user-1",
        organizationId: "org-1",
        role: "ADMIN",
        email: "test@example.com",
      });
    });
  });

  describe("requireAuth", () => {
    it("returns unauthorized when not authenticated", async () => {
      vi.mocked(getServerSession).mockResolvedValue(null);

      const result = await requireAuth();

      expect(result.authorized).toBe(false);
      expect(result.status).toBe(401);
    });

    it("returns authorized with context when authenticated", async () => {
      vi.mocked(getServerSession).mockResolvedValue({
        user: { id: "user-1", email: "test@example.com", activeOrgId: "org-1" },
      } as any);
      vi.mocked(prisma.membership.findUnique).mockResolvedValue({
        role: "MEMBER",
      } as any);

      const result = await requireAuth();

      expect(result.authorized).toBe(true);
      expect(result.context?.role).toBe("MEMBER");
    });
  });

  describe("requirePermission", () => {
    it("denies when user lacks permission", async () => {
      vi.mocked(getServerSession).mockResolvedValue({
        user: { id: "user-1", email: "test@example.com", activeOrgId: "org-1" },
      } as any);
      vi.mocked(prisma.membership.findUnique).mockResolvedValue({
        role: "VIEWER",
      } as any);

      const result = await requirePermission("campaigns:create");

      expect(result.authorized).toBe(false);
      expect(result.status).toBe(403);
    });

    it("allows when user has permission", async () => {
      vi.mocked(getServerSession).mockResolvedValue({
        user: { id: "user-1", email: "test@example.com", activeOrgId: "org-1" },
      } as any);
      vi.mocked(prisma.membership.findUnique).mockResolvedValue({
        role: "MEMBER",
      } as any);

      const result = await requirePermission("campaigns:create");

      expect(result.authorized).toBe(true);
    });
  });

  describe("requireRole", () => {
    it("denies when role is below minimum", async () => {
      vi.mocked(getServerSession).mockResolvedValue({
        user: { id: "user-1", email: "test@example.com", activeOrgId: "org-1" },
      } as any);
      vi.mocked(prisma.membership.findUnique).mockResolvedValue({
        role: "MEMBER",
      } as any);

      const result = await requireRole("ADMIN");

      expect(result.authorized).toBe(false);
      expect(result.status).toBe(403);
    });

    it("allows when role meets minimum", async () => {
      vi.mocked(getServerSession).mockResolvedValue({
        user: { id: "user-1", email: "test@example.com", activeOrgId: "org-1" },
      } as any);
      vi.mocked(prisma.membership.findUnique).mockResolvedValue({
        role: "ADMIN",
      } as any);

      const result = await requireRole("ADMIN");

      expect(result.authorized).toBe(true);
    });
  });

  describe("verifyResourceOwnership", () => {
    const mockContext = {
      userId: "user-1",
      organizationId: "org-1",
      role: "ADMIN" as const,
      email: "test@example.com",
    };

    it("verifies ad account ownership", async () => {
      vi.mocked(prisma.adAccount.count).mockResolvedValue(1);

      const result = await verifyResourceOwnership(mockContext, "adAccount", "acc-1");

      expect(result).toBe(true);
      expect(prisma.adAccount.count).toHaveBeenCalledWith({
        where: { id: "acc-1", organizationId: "org-1" },
      });
    });

    it("denies when resource not owned", async () => {
      vi.mocked(prisma.adAccount.count).mockResolvedValue(0);

      const result = await verifyResourceOwnership(mockContext, "adAccount", "acc-other");

      expect(result).toBe(false);
    });

    it("verifies campaign ownership", async () => {
      vi.mocked(prisma.campaign.count).mockResolvedValue(1);

      const result = await verifyResourceOwnership(mockContext, "campaign", "camp-1");

      expect(result).toBe(true);
    });

    it("returns false for unknown resource types", async () => {
      const result = await verifyResourceOwnership(mockContext, "unknown", "id-1");

      expect(result).toBe(false);
    });
  });

  describe("scopedWhere", () => {
    it("adds organizationId to where clause", () => {
      const context = {
        userId: "user-1",
        organizationId: "org-1",
        role: "ADMIN" as const,
        email: "test@example.com",
      };

      const where = scopedWhere(context, { status: "ACTIVE" });

      expect(where).toEqual({
        status: "ACTIVE",
        organizationId: "org-1",
      });
    });

    it("works with empty additional where", () => {
      const context = {
        userId: "user-1",
        organizationId: "org-1",
        role: "ADMIN" as const,
        email: "test@example.com",
      };

      const where = scopedWhere(context);

      expect(where).toEqual({
        organizationId: "org-1",
      });
    });
  });
});
