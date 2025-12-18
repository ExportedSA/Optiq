import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock prisma
vi.mock("@/lib/prisma", () => ({
  prisma: {
    membership: {
      findUnique: vi.fn(),
    },
    adAccount: {
      count: vi.fn(),
      findMany: vi.fn(),
    },
    campaign: {
      count: vi.fn(),
      findMany: vi.fn(),
    },
    trackingSite: {
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
  verifyResourceOwnership,
  scopedWhere,
} from "../authorization";

describe("Tenant Isolation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Multi-tenant query scoping", () => {
    it("scopedWhere always includes organizationId", () => {
      const context = {
        userId: "user-1",
        organizationId: "org-tenant-a",
        role: "ADMIN" as const,
        email: "test@example.com",
      };

      // Even with complex where clauses, organizationId is always added
      const where1 = scopedWhere(context, { status: "ACTIVE", name: { contains: "test" } });
      expect(where1.organizationId).toBe("org-tenant-a");

      const where2 = scopedWhere(context);
      expect(where2.organizationId).toBe("org-tenant-a");

      const where3 = scopedWhere(context, { id: { in: ["a", "b", "c"] } });
      expect(where3.organizationId).toBe("org-tenant-a");
    });

    it("prevents cross-tenant data access via resource ownership check", async () => {
      const tenantAContext = {
        userId: "user-a",
        organizationId: "org-tenant-a",
        role: "OWNER" as const,
        email: "a@example.com",
      };

      // Resource belongs to tenant B
      vi.mocked(prisma.adAccount.count).mockResolvedValue(0);

      const canAccess = await verifyResourceOwnership(
        tenantAContext,
        "adAccount",
        "account-from-tenant-b"
      );

      expect(canAccess).toBe(false);
      expect(prisma.adAccount.count).toHaveBeenCalledWith({
        where: {
          id: "account-from-tenant-b",
          organizationId: "org-tenant-a", // Always scoped to user's org
        },
      });
    });

    it("allows access to own tenant resources", async () => {
      const tenantAContext = {
        userId: "user-a",
        organizationId: "org-tenant-a",
        role: "MEMBER" as const,
        email: "a@example.com",
      };

      // Resource belongs to tenant A
      vi.mocked(prisma.campaign.count).mockResolvedValue(1);

      const canAccess = await verifyResourceOwnership(
        tenantAContext,
        "campaign",
        "campaign-from-tenant-a"
      );

      expect(canAccess).toBe(true);
    });
  });

  describe("Session-based tenant context", () => {
    it("derives organizationId from authenticated session", async () => {
      vi.mocked(getServerSession).mockResolvedValue({
        user: {
          id: "user-1",
          email: "test@example.com",
          activeOrgId: "org-from-session",
        },
      } as any);

      vi.mocked(prisma.membership.findUnique).mockResolvedValue({
        role: "MEMBER",
      } as any);

      const context = await getAuthContext();

      expect(context?.organizationId).toBe("org-from-session");
    });

    it("requires membership to access organization", async () => {
      vi.mocked(getServerSession).mockResolvedValue({
        user: {
          id: "user-1",
          email: "test@example.com",
          activeOrgId: "org-not-member-of",
        },
      } as any);

      // User is not a member
      vi.mocked(prisma.membership.findUnique).mockResolvedValue(null);

      const context = await getAuthContext();

      expect(context).toBeNull();
    });

    it("prevents accessing org without active membership", async () => {
      vi.mocked(getServerSession).mockResolvedValue({
        user: {
          id: "attacker-user",
          email: "attacker@example.com",
          activeOrgId: "victim-org", // Attacker tries to set victim's org
        },
      } as any);

      // Membership check fails - attacker is not a member
      vi.mocked(prisma.membership.findUnique).mockResolvedValue(null);

      const context = await getAuthContext();

      // Access denied - no context returned
      expect(context).toBeNull();
    });
  });

  describe("Resource type isolation", () => {
    const context = {
      userId: "user-1",
      organizationId: "org-1",
      role: "ADMIN" as const,
      email: "test@example.com",
    };

    it("isolates ad accounts by organization", async () => {
      vi.mocked(prisma.adAccount.count).mockResolvedValue(1);

      await verifyResourceOwnership(context, "adAccount", "acc-1");

      expect(prisma.adAccount.count).toHaveBeenCalledWith({
        where: { id: "acc-1", organizationId: "org-1" },
      });
    });

    it("isolates campaigns by organization", async () => {
      vi.mocked(prisma.campaign.count).mockResolvedValue(1);

      await verifyResourceOwnership(context, "campaign", "camp-1");

      expect(prisma.campaign.count).toHaveBeenCalledWith({
        where: { id: "camp-1", organizationId: "org-1" },
      });
    });

    it("isolates tracking sites by organization", async () => {
      vi.mocked(prisma.trackingSite.count).mockResolvedValue(1);

      await verifyResourceOwnership(context, "trackingSite", "site-1");

      expect(prisma.trackingSite.count).toHaveBeenCalledWith({
        where: { id: "site-1", organizationId: "org-1" },
      });
    });

    it("rejects unknown resource types", async () => {
      const result = await verifyResourceOwnership(context, "unknownType", "id-1");

      expect(result).toBe(false);
    });
  });
});
