/**
 * Billing Plans Route Smoke Tests
 */

import { describe, it, expect } from "vitest";
import { GET } from "./route";

describe("Billing Plans Route", () => {
  it("should return plans successfully", async () => {
    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.plans).toBeDefined();
    expect(Array.isArray(data.plans)).toBe(true);
    expect(data.plans.length).toBeGreaterThan(0);
  });

  it("should include all plan tiers", async () => {
    const response = await GET();
    const data = await response.json();

    const tiers = data.plans.map((p: any) => p.tier);
    expect(tiers).toContain("FREE");
    expect(tiers).toContain("STARTER");
    expect(tiers).toContain("GROWTH");
    expect(tiers).toContain("SCALE");
  });

  it("should include pricing information", async () => {
    const response = await GET();
    const data = await response.json();

    data.plans.forEach((plan: any) => {
      expect(plan).toHaveProperty("pricing");
      expect(plan.pricing).toHaveProperty("monthly");
      expect(plan.pricing).toHaveProperty("annual");
      expect(plan.pricing).toHaveProperty("annualMonthly");
    });
  });

  it("should include limits information", async () => {
    const response = await GET();
    const data = await response.json();

    data.plans.forEach((plan: any) => {
      expect(plan).toHaveProperty("limits");
      expect(plan.limits).toHaveProperty("workspaces");
      expect(plan.limits).toHaveProperty("connectors");
      expect(plan.limits).toHaveProperty("events");
      expect(plan.limits).toHaveProperty("retention");
    });
  });

  it("should include features list", async () => {
    const response = await GET();
    const data = await response.json();

    data.plans.forEach((plan: any) => {
      expect(plan).toHaveProperty("features");
      expect(Array.isArray(plan.features)).toBe(true);
    });
  });
});
