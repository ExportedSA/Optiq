/**
 * Billing Portal Route Smoke Tests
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "./route";

// Mock Stripe
vi.mock("@/lib/stripe", () => ({
  isStripeConfigured: vi.fn(),
  createPortalSession: vi.fn(),
}));

// Mock auth
vi.mock("next-auth", () => ({
  getServerSession: vi.fn(),
}));

// Mock prisma
vi.mock("@/lib/prisma", () => ({
  prisma: {
    organization: {
      findUnique: vi.fn(),
    },
  },
}));

import { getServerSession } from "next-auth";
import * as stripe from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

describe("Billing Portal Route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 401 when not authenticated", async () => {
    vi.mocked(getServerSession).mockResolvedValue(null);

    const request = new Request("http://localhost/api/billing/portal", {
      method: "POST",
    });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe("Unauthorized");
  });

  it("should return 400 when no active organization", async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: { id: "user123", email: "test@example.com" },
      expires: "2024-12-31",
    } as any);

    const request = new Request("http://localhost/api/billing/portal", {
      method: "POST",
    });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain("organization");
  });

  it("should return 503 when Stripe is not configured", async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: { id: "user123", email: "test@example.com", activeOrgId: "org123" },
      expires: "2024-12-31",
    } as any);
    vi.mocked(stripe.isStripeConfigured).mockReturnValue(false);

    const request = new Request("http://localhost/api/billing/portal", {
      method: "POST",
    });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(503);
    expect(data.error).toContain("not configured");
  });

  it("should return 404 when organization not found", async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: { id: "user123", email: "test@example.com", activeOrgId: "org123" },
      expires: "2024-12-31",
    } as any);
    vi.mocked(stripe.isStripeConfigured).mockReturnValue(true);
    vi.mocked(prisma.organization.findUnique).mockResolvedValue(null);

    const request = new Request("http://localhost/api/billing/portal", {
      method: "POST",
    });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toContain("not found");
  });

  it("should return 400 when no Stripe customer ID", async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: { id: "user123", email: "test@example.com", activeOrgId: "org123" },
      expires: "2024-12-31",
    } as any);
    vi.mocked(stripe.isStripeConfigured).mockReturnValue(true);
    vi.mocked(prisma.organization.findUnique).mockResolvedValue({
      id: "org123",
      name: "Test Org",
      stripeCustomerId: null,
    } as any);

    const request = new Request("http://localhost/api/billing/portal", {
      method: "POST",
    });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain("Stripe customer");
  });

  it("should create portal session successfully", async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: { id: "user123", email: "test@example.com", activeOrgId: "org123" },
      expires: "2024-12-31",
    } as any);
    vi.mocked(stripe.isStripeConfigured).mockReturnValue(true);
    vi.mocked(prisma.organization.findUnique).mockResolvedValue({
      id: "org123",
      name: "Test Org",
      stripeCustomerId: "cus_123",
    } as any);
    vi.mocked(stripe.createPortalSession).mockResolvedValue({
      id: "ps_123",
      url: "https://billing.stripe.com/session/test",
    } as any);

    const request = new Request("http://localhost/api/billing/portal", {
      method: "POST",
    });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.url).toBe("https://billing.stripe.com/session/test");
    expect(stripe.createPortalSession).toHaveBeenCalledWith({
      customerId: "cus_123",
      returnUrl: expect.any(String),
    });
  });
});
