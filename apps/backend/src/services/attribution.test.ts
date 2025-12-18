/**
 * Attribution Service Tests
 * 
 * Tests for all attribution models ensuring:
 * - Correct weight calculation
 * - Reproducible results
 * - Proper normalization
 * - Credit allocation accuracy
 */

import { describe, it, expect } from "vitest";
import {
  calculateAttributionWeight,
  normalizeWeights,
  calculateAttribution,
  calculateMultiModelAttribution,
  validateAttributionResult,
  compareAttributionModels,
  getAttributionStats,
  type AttributionTouchpoint,
  type AttributionModel,
} from "./attribution";

// Helper to create test touchpoints
function createTouchpoint(id: string, daysAgo: number): AttributionTouchpoint {
  return {
    id,
    occurredAt: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000),
    utmSource: "google",
    utmMedium: "cpc",
    utmCampaign: `campaign_${id}`,
  };
}

describe("Attribution Weight Calculation", () => {
  const conversionDate = new Date();

  describe("FIRST_TOUCH", () => {
    it("should give 100% credit to first touchpoint", () => {
      const weight1 = calculateAttributionWeight("FIRST_TOUCH", 0, 3, new Date(), conversionDate);
      const weight2 = calculateAttributionWeight("FIRST_TOUCH", 1, 3, new Date(), conversionDate);
      const weight3 = calculateAttributionWeight("FIRST_TOUCH", 2, 3, new Date(), conversionDate);

      expect(weight1).toBe(1.0);
      expect(weight2).toBe(0.0);
      expect(weight3).toBe(0.0);
    });

    it("should work with single touchpoint", () => {
      const weight = calculateAttributionWeight("FIRST_TOUCH", 0, 1, new Date(), conversionDate);
      expect(weight).toBe(1.0);
    });
  });

  describe("LAST_TOUCH", () => {
    it("should give 100% credit to last touchpoint", () => {
      const weight1 = calculateAttributionWeight("LAST_TOUCH", 0, 3, new Date(), conversionDate);
      const weight2 = calculateAttributionWeight("LAST_TOUCH", 1, 3, new Date(), conversionDate);
      const weight3 = calculateAttributionWeight("LAST_TOUCH", 2, 3, new Date(), conversionDate);

      expect(weight1).toBe(0.0);
      expect(weight2).toBe(0.0);
      expect(weight3).toBe(1.0);
    });

    it("should work with single touchpoint", () => {
      const weight = calculateAttributionWeight("LAST_TOUCH", 0, 1, new Date(), conversionDate);
      expect(weight).toBe(1.0);
    });
  });

  describe("LINEAR", () => {
    it("should distribute credit equally", () => {
      const weight1 = calculateAttributionWeight("LINEAR", 0, 3, new Date(), conversionDate);
      const weight2 = calculateAttributionWeight("LINEAR", 1, 3, new Date(), conversionDate);
      const weight3 = calculateAttributionWeight("LINEAR", 2, 3, new Date(), conversionDate);

      expect(weight1).toBeCloseTo(0.333, 2);
      expect(weight2).toBeCloseTo(0.333, 2);
      expect(weight3).toBeCloseTo(0.333, 2);
    });

    it("should work with any number of touchpoints", () => {
      const weight5 = calculateAttributionWeight("LINEAR", 0, 5, new Date(), conversionDate);
      expect(weight5).toBeCloseTo(0.2, 2);

      const weight10 = calculateAttributionWeight("LINEAR", 0, 10, new Date(), conversionDate);
      expect(weight10).toBeCloseTo(0.1, 2);
    });
  });

  describe("TIME_DECAY", () => {
    it("should give more credit to recent touchpoints", () => {
      const recentDate = new Date(conversionDate.getTime() - 1 * 24 * 60 * 60 * 1000); // 1 day ago
      const oldDate = new Date(conversionDate.getTime() - 14 * 24 * 60 * 60 * 1000); // 14 days ago

      const recentWeight = calculateAttributionWeight("TIME_DECAY", 0, 2, recentDate, conversionDate);
      const oldWeight = calculateAttributionWeight("TIME_DECAY", 1, 2, oldDate, conversionDate);

      expect(recentWeight).toBeGreaterThan(oldWeight);
    });

    it("should respect configurable half-life", () => {
      const touchDate = new Date(conversionDate.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 days ago

      // Default half-life (7 days)
      const weight7 = calculateAttributionWeight("TIME_DECAY", 0, 1, touchDate, conversionDate);
      expect(weight7).toBeCloseTo(0.5, 2); // Should be ~0.5 at half-life

      // Custom half-life (14 days)
      const weight14 = calculateAttributionWeight(
        "TIME_DECAY",
        0,
        1,
        touchDate,
        conversionDate,
        { timeDecayHalfLife: 14 },
      );
      expect(weight14).toBeGreaterThan(weight7); // Should decay slower
    });

    it("should handle same-day touchpoints", () => {
      const weight = calculateAttributionWeight("TIME_DECAY", 0, 1, conversionDate, conversionDate);
      expect(weight).toBe(1.0); // No decay for same-day
    });
  });

  describe("POSITION_BASED", () => {
    it("should give 40% to first, 40% to last, 20% to middle", () => {
      const weight1 = calculateAttributionWeight("POSITION_BASED", 0, 4, new Date(), conversionDate);
      const weight2 = calculateAttributionWeight("POSITION_BASED", 1, 4, new Date(), conversionDate);
      const weight3 = calculateAttributionWeight("POSITION_BASED", 2, 4, new Date(), conversionDate);
      const weight4 = calculateAttributionWeight("POSITION_BASED", 3, 4, new Date(), conversionDate);

      expect(weight1).toBe(0.4); // First: 40%
      expect(weight2).toBe(0.1); // Middle: 10% each (20% / 2)
      expect(weight3).toBe(0.1); // Middle: 10% each
      expect(weight4).toBe(0.4); // Last: 40%
    });

    it("should handle two touchpoints", () => {
      const weight1 = calculateAttributionWeight("POSITION_BASED", 0, 2, new Date(), conversionDate);
      const weight2 = calculateAttributionWeight("POSITION_BASED", 1, 2, new Date(), conversionDate);

      expect(weight1).toBe(0.4); // First
      expect(weight2).toBe(0.4); // Last
    });

    it("should handle single touchpoint", () => {
      const weight = calculateAttributionWeight("POSITION_BASED", 0, 1, new Date(), conversionDate);
      expect(weight).toBe(1.0);
    });

    it("should respect custom position weights", () => {
      const weight1 = calculateAttributionWeight(
        "POSITION_BASED",
        0,
        3,
        new Date(),
        conversionDate,
        {
          positionBasedWeights: { first: 0.5, middle: 0.1, last: 0.4 },
        },
      );

      expect(weight1).toBe(0.5); // Custom first weight
    });
  });
});

describe("Weight Normalization", () => {
  it("should normalize weights to sum to 1.0", () => {
    const weights = [0.5, 0.3, 0.2];
    const normalized = normalizeWeights(weights);

    const sum = normalized.reduce((acc, w) => acc + w, 0);
    expect(sum).toBeCloseTo(1.0, 10);
  });

  it("should handle unnormalized weights", () => {
    const weights = [2, 1, 1]; // Sum = 4
    const normalized = normalizeWeights(weights);

    expect(normalized[0]).toBeCloseTo(0.5, 2);
    expect(normalized[1]).toBeCloseTo(0.25, 2);
    expect(normalized[2]).toBeCloseTo(0.25, 2);
  });

  it("should handle zero weights", () => {
    const weights = [0, 0, 0];
    const normalized = normalizeWeights(weights);

    // Should distribute equally when all are zero
    expect(normalized[0]).toBeCloseTo(0.333, 2);
    expect(normalized[1]).toBeCloseTo(0.333, 2);
    expect(normalized[2]).toBeCloseTo(0.333, 2);
  });

  it("should preserve relative proportions", () => {
    const weights = [4, 2, 1];
    const normalized = normalizeWeights(weights);

    expect(normalized[0] / normalized[1]).toBeCloseTo(2, 2);
    expect(normalized[1] / normalized[2]).toBeCloseTo(2, 2);
  });
});

describe("Attribution Calculation", () => {
  const conversionId = "conv_123";
  const conversionValue = 100;
  const conversionDate = new Date();

  const touchpoints: AttributionTouchpoint[] = [
    createTouchpoint("touch_1", 7),  // 7 days ago
    createTouchpoint("touch_2", 3),  // 3 days ago
    createTouchpoint("touch_3", 1),  // 1 day ago
  ];

  it("should calculate first-touch attribution", () => {
    const result = calculateAttribution(
      conversionId,
      conversionValue,
      touchpoints,
      conversionDate,
      "FIRST_TOUCH",
    );

    expect(result.totalTouchpoints).toBe(3);
    expect(result.attributions).toHaveLength(3);
    expect(result.attributions[0].credit).toBe(100); // All credit to first
    expect(result.attributions[1].credit).toBe(0);
    expect(result.attributions[2].credit).toBe(0);
  });

  it("should calculate last-touch attribution", () => {
    const result = calculateAttribution(
      conversionId,
      conversionValue,
      touchpoints,
      conversionDate,
      "LAST_TOUCH",
    );

    expect(result.attributions[0].credit).toBe(0);
    expect(result.attributions[1].credit).toBe(0);
    expect(result.attributions[2].credit).toBe(100); // All credit to last
  });

  it("should calculate linear attribution", () => {
    const result = calculateAttribution(
      conversionId,
      conversionValue,
      touchpoints,
      conversionDate,
      "LINEAR",
    );

    // Each touchpoint should get 1/3 of credit
    expect(result.attributions[0].credit).toBeCloseTo(33.33, 1);
    expect(result.attributions[1].credit).toBeCloseTo(33.33, 1);
    expect(result.attributions[2].credit).toBeCloseTo(33.33, 1);
  });

  it("should calculate time-decay attribution", () => {
    const result = calculateAttribution(
      conversionId,
      conversionValue,
      touchpoints,
      conversionDate,
      "TIME_DECAY",
    );

    // More recent touchpoints should get more credit
    expect(result.attributions[2].credit).toBeGreaterThan(result.attributions[1].credit);
    expect(result.attributions[1].credit).toBeGreaterThan(result.attributions[0].credit);

    // Total should equal conversion value
    const totalCredit = result.attributions.reduce((sum, a) => sum + a.credit, 0);
    expect(totalCredit).toBeCloseTo(conversionValue, 1);
  });

  it("should calculate position-based attribution", () => {
    const result = calculateAttribution(
      conversionId,
      conversionValue,
      touchpoints,
      conversionDate,
      "POSITION_BASED",
    );

    // First and last should get 40% each, middle gets 20%
    expect(result.attributions[0].credit).toBeCloseTo(40, 1);
    expect(result.attributions[1].credit).toBeCloseTo(20, 1);
    expect(result.attributions[2].credit).toBeCloseTo(40, 1);
  });

  it("should handle empty touchpoints", () => {
    const result = calculateAttribution(
      conversionId,
      conversionValue,
      [],
      conversionDate,
      "LINEAR",
    );

    expect(result.totalTouchpoints).toBe(0);
    expect(result.attributions).toHaveLength(0);
  });

  it("should include position information", () => {
    const result = calculateAttribution(
      conversionId,
      conversionValue,
      touchpoints,
      conversionDate,
      "LINEAR",
    );

    expect(result.attributions[0].position).toBe(1);
    expect(result.attributions[1].position).toBe(2);
    expect(result.attributions[2].position).toBe(3);
  });
});

describe("Multi-Model Attribution", () => {
  const conversionId = "conv_123";
  const conversionValue = 100;
  const conversionDate = new Date();
  const touchpoints: AttributionTouchpoint[] = [
    createTouchpoint("touch_1", 7),
    createTouchpoint("touch_2", 3),
    createTouchpoint("touch_3", 1),
  ];

  it("should calculate multiple models simultaneously", () => {
    const models: AttributionModel[] = ["FIRST_TOUCH", "LAST_TOUCH", "LINEAR"];
    const results = calculateMultiModelAttribution(
      conversionId,
      conversionValue,
      touchpoints,
      conversionDate,
      models,
    );

    expect(results.size).toBe(3);
    expect(results.has("FIRST_TOUCH")).toBe(true);
    expect(results.has("LAST_TOUCH")).toBe(true);
    expect(results.has("LINEAR")).toBe(true);
  });

  it("should produce consistent results across models", () => {
    const models: AttributionModel[] = ["FIRST_TOUCH", "LAST_TOUCH", "LINEAR"];
    const results = calculateMultiModelAttribution(
      conversionId,
      conversionValue,
      touchpoints,
      conversionDate,
      models,
    );

    // All models should have same total touchpoints
    for (const result of results.values()) {
      expect(result.totalTouchpoints).toBe(3);
    }

    // All models should allocate full conversion value
    for (const result of results.values()) {
      const totalCredit = result.attributions.reduce((sum, a) => sum + a.credit, 0);
      expect(totalCredit).toBeCloseTo(conversionValue, 1);
    }
  });
});

describe("Reproducibility", () => {
  const conversionId = "conv_123";
  const conversionValue = 100;
  const conversionDate = new Date("2024-01-15T12:00:00Z");
  const touchpoints: AttributionTouchpoint[] = [
    {
      id: "touch_1",
      occurredAt: new Date("2024-01-08T12:00:00Z"),
      utmSource: "google",
      utmMedium: "cpc",
      utmCampaign: "campaign_1",
    },
    {
      id: "touch_2",
      occurredAt: new Date("2024-01-12T12:00:00Z"),
      utmSource: "facebook",
      utmMedium: "social",
      utmCampaign: "campaign_2",
    },
    {
      id: "touch_3",
      occurredAt: new Date("2024-01-14T12:00:00Z"),
      utmSource: "twitter",
      utmMedium: "social",
      utmCampaign: "campaign_3",
    },
  ];

  it("should produce identical results for same inputs (FIRST_TOUCH)", () => {
    const result1 = calculateAttribution(
      conversionId,
      conversionValue,
      touchpoints,
      conversionDate,
      "FIRST_TOUCH",
    );

    const result2 = calculateAttribution(
      conversionId,
      conversionValue,
      touchpoints,
      conversionDate,
      "FIRST_TOUCH",
    );

    expect(result1).toEqual(result2);
  });

  it("should produce identical results for same inputs (TIME_DECAY)", () => {
    const result1 = calculateAttribution(
      conversionId,
      conversionValue,
      touchpoints,
      conversionDate,
      "TIME_DECAY",
    );

    const result2 = calculateAttribution(
      conversionId,
      conversionValue,
      touchpoints,
      conversionDate,
      "TIME_DECAY",
    );

    expect(result1.attributions[0].credit).toBeCloseTo(result2.attributions[0].credit, 10);
    expect(result1.attributions[1].credit).toBeCloseTo(result2.attributions[1].credit, 10);
    expect(result1.attributions[2].credit).toBeCloseTo(result2.attributions[2].credit, 10);
  });

  it("should produce identical results across multiple runs", () => {
    const results = [];
    for (let i = 0; i < 10; i++) {
      const result = calculateAttribution(
        conversionId,
        conversionValue,
        touchpoints,
        conversionDate,
        "LINEAR",
      );
      results.push(result);
    }

    // All results should be identical
    for (let i = 1; i < results.length; i++) {
      expect(results[i]).toEqual(results[0]);
    }
  });
});

describe("Attribution Validation", () => {
  it("should validate correct attribution result", () => {
    const result = calculateAttribution(
      "conv_123",
      100,
      [createTouchpoint("t1", 1), createTouchpoint("t2", 2)],
      new Date(),
      "LINEAR",
    );

    const validation = validateAttributionResult(result);
    expect(validation.valid).toBe(true);
    expect(validation.errors).toHaveLength(0);
  });

  it("should detect invalid weight sum", () => {
    const result = {
      conversionId: "conv_123",
      conversionValue: 100,
      totalTouchpoints: 2,
      attributions: [
        { touchpointId: "t1", model: "LINEAR" as AttributionModel, weight: 0.6, credit: 60, position: 1 },
        { touchpointId: "t2", model: "LINEAR" as AttributionModel, weight: 0.6, credit: 60, position: 2 },
      ],
    };

    const validation = validateAttributionResult(result);
    expect(validation.valid).toBe(false);
    expect(validation.errors.length).toBeGreaterThan(0);
  });
});

describe("Attribution Comparison", () => {
  const conversionId = "conv_123";
  const conversionValue = 100;
  const conversionDate = new Date();
  const touchpoints = [
    createTouchpoint("touch_1", 7),
    createTouchpoint("touch_2", 3),
    createTouchpoint("touch_3", 1),
  ];

  it("should compare attribution across models", () => {
    const models: AttributionModel[] = ["FIRST_TOUCH", "LAST_TOUCH", "LINEAR"];
    const results = calculateMultiModelAttribution(
      conversionId,
      conversionValue,
      touchpoints,
      conversionDate,
      models,
    );

    const comparison = compareAttributionModels(results);

    expect(comparison).toHaveLength(3);
    expect(comparison[0].model).toBe("FIRST_TOUCH");
    expect(comparison[0].topTouchpoint).toBe("touch_1");
    expect(comparison[1].model).toBe("LAST_TOUCH");
    expect(comparison[1].topTouchpoint).toBe("touch_3");
  });
});

describe("Attribution Statistics", () => {
  it("should calculate attribution stats", () => {
    const result = calculateAttribution(
      "conv_123",
      100,
      [createTouchpoint("t1", 1), createTouchpoint("t2", 2), createTouchpoint("t3", 3)],
      new Date(),
      "LINEAR",
    );

    const stats = getAttributionStats(result);

    expect(stats.totalCredit).toBeCloseTo(100, 1);
    expect(stats.avgCreditPerTouchpoint).toBeCloseTo(33.33, 1);
    expect(stats.touchpointsWithCredit).toBe(3);
    expect(stats.concentrationRatio).toBeCloseTo(0.333, 2);
  });
});
