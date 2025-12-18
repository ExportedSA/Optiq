/**
 * Journey Builder Tests
 * 
 * Tests for journey building, attribution calculation, and job execution
 */

import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import { PrismaClient } from "@prisma/client";
import {
  buildJourneyForConversion,
  buildMissingJourneys,
  rebuildJourneys,
  getJourneyStats,
} from "./journey-builder";
import {
  calculateAttributionWeight,
  normalizeWeights,
  DEFAULT_JOURNEY_CONFIG,
} from "../config/journey-builder";

const prisma = new PrismaClient();
let testOrganizationId: string;
let testSiteId: string;

beforeAll(async () => {
  // Create test organization
  const org = await prisma.organization.create({
    data: {
      name: "Test Organization",
      slug: "test-org-journey-" + Date.now(),
    },
  });
  testOrganizationId = org.id;

  // Create test tracking site
  const site = await prisma.trackingSite.create({
    data: {
      organizationId: testOrganizationId,
      name: "Test Site",
      domain: "example.com",
      publicKey: "test_journey_key_" + Date.now(),
    },
  });
  testSiteId = site.id;
});

afterAll(async () => {
  // Clean up test data
  await prisma.attributionLink.deleteMany({
    where: { siteId: testSiteId },
  });
  await prisma.journey.deleteMany({
    where: { organizationId: testOrganizationId },
  });
  await prisma.touchPoint.deleteMany({
    where: { siteId: testSiteId },
  });
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
});

beforeEach(async () => {
  // Clean up before each test
  await prisma.attributionLink.deleteMany({
    where: { siteId: testSiteId },
  });
  await prisma.journey.deleteMany({
    where: { organizationId: testOrganizationId },
  });
  await prisma.touchPoint.deleteMany({
    where: { siteId: testSiteId },
  });
  await prisma.trackingEvent.deleteMany({
    where: { siteId: testSiteId },
  });
});

describe("Attribution Weight Calculation", () => {
  it("should calculate first touch attribution correctly", () => {
    const weight1 = calculateAttributionWeight("FIRST_TOUCH", 0, 3, new Date(), new Date());
    const weight2 = calculateAttributionWeight("FIRST_TOUCH", 1, 3, new Date(), new Date());
    const weight3 = calculateAttributionWeight("FIRST_TOUCH", 2, 3, new Date(), new Date());

    expect(weight1).toBe(1.0);
    expect(weight2).toBe(0.0);
    expect(weight3).toBe(0.0);
  });

  it("should calculate last touch attribution correctly", () => {
    const weight1 = calculateAttributionWeight("LAST_TOUCH", 0, 3, new Date(), new Date());
    const weight2 = calculateAttributionWeight("LAST_TOUCH", 1, 3, new Date(), new Date());
    const weight3 = calculateAttributionWeight("LAST_TOUCH", 2, 3, new Date(), new Date());

    expect(weight1).toBe(0.0);
    expect(weight2).toBe(0.0);
    expect(weight3).toBe(1.0);
  });

  it("should calculate linear attribution correctly", () => {
    const weight1 = calculateAttributionWeight("LINEAR", 0, 3, new Date(), new Date());
    const weight2 = calculateAttributionWeight("LINEAR", 1, 3, new Date(), new Date());
    const weight3 = calculateAttributionWeight("LINEAR", 2, 3, new Date(), new Date());

    expect(weight1).toBeCloseTo(0.333, 2);
    expect(weight2).toBeCloseTo(0.333, 2);
    expect(weight3).toBeCloseTo(0.333, 2);
  });

  it("should calculate position-based attribution correctly", () => {
    const weight1 = calculateAttributionWeight("POSITION_BASED", 0, 4, new Date(), new Date());
    const weight2 = calculateAttributionWeight("POSITION_BASED", 1, 4, new Date(), new Date());
    const weight3 = calculateAttributionWeight("POSITION_BASED", 2, 4, new Date(), new Date());
    const weight4 = calculateAttributionWeight("POSITION_BASED", 3, 4, new Date(), new Date());

    expect(weight1).toBe(0.4); // First: 40%
    expect(weight2).toBe(0.1); // Middle: 10% each
    expect(weight3).toBe(0.1); // Middle: 10% each
    expect(weight4).toBe(0.4); // Last: 40%
  });

  it("should calculate time decay attribution with recency bias", () => {
    const conversionDate = new Date();
    const recentTouch = new Date(conversionDate.getTime() - 1 * 24 * 60 * 60 * 1000); // 1 day ago
    const oldTouch = new Date(conversionDate.getTime() - 14 * 24 * 60 * 60 * 1000); // 14 days ago

    const recentWeight = calculateAttributionWeight("TIME_DECAY", 0, 2, recentTouch, conversionDate);
    const oldWeight = calculateAttributionWeight("TIME_DECAY", 1, 2, oldTouch, conversionDate);

    // Recent touch should have higher weight
    expect(recentWeight).toBeGreaterThan(oldWeight);
  });
});

describe("Weight Normalization", () => {
  it("should normalize weights to sum to 1.0", () => {
    const weights = [0.5, 0.3, 0.2];
    const normalized = normalizeWeights(weights);

    const sum = normalized.reduce((acc, w) => acc + w, 0);
    expect(sum).toBeCloseTo(1.0, 10);
  });

  it("should handle zero weights", () => {
    const weights = [0, 0, 0];
    const normalized = normalizeWeights(weights);

    expect(normalized).toEqual([0.333, 0.333, 0.333].map((w) => expect.closeTo(w, 2)));
  });

  it("should preserve relative proportions", () => {
    const weights = [2, 1, 1];
    const normalized = normalizeWeights(weights);

    expect(normalized[0]).toBeCloseTo(0.5, 2);
    expect(normalized[1]).toBeCloseTo(0.25, 2);
    expect(normalized[2]).toBeCloseTo(0.25, 2);
  });
});

describe("Journey Building", () => {
  it("should build journey with single touchpoint", async () => {
    const anonId = "anon_single_" + Date.now();
    const sessionId = "sess_single_" + Date.now();

    // Create touchpoint
    const touchpoint = await prisma.touchPoint.create({
      data: {
        siteId: testSiteId,
        anonId,
        sessionId,
        occurredAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        utmSource: "google",
        utmMedium: "cpc",
        utmCampaign: "test_campaign",
        gclid: "test_gclid",
      },
    });

    // Create conversion
    const conversion = await prisma.trackingEvent.create({
      data: {
        siteId: testSiteId,
        eventId: "conv_single_" + Date.now(),
        type: "CONVERSION",
        name: "Purchase",
        anonId,
        sessionId,
        occurredAt: new Date(),
        url: "https://example.com/checkout",
        path: "/checkout",
        valueMicros: BigInt(99_990_000), // $99.99
      },
    });

    // Build journey
    const journeyId = await buildJourneyForConversion(conversion, DEFAULT_JOURNEY_CONFIG);

    expect(journeyId).toBeDefined();

    // Verify journey was created
    const journey = await prisma.journey.findUnique({
      where: { id: journeyId! },
    });

    expect(journey).not.toBeNull();
    expect(journey?.status).toBe("CONVERTED");
    expect(journey?.touchPointCount).toBe(1);
    expect(journey?.firstUtmSource).toBe("google");
    expect(journey?.conversionValue).toBe(BigInt(99_990_000));

    // Verify attribution links were created
    const attributionLinks = await prisma.attributionLink.findMany({
      where: { conversionId: conversion.id },
    });

    expect(attributionLinks.length).toBeGreaterThan(0);

    // Check first touch attribution
    const firstTouch = attributionLinks.find((link) => link.model === "FIRST_TOUCH");
    expect(firstTouch?.weight).toBe(1.0);
  });

  it("should build journey with multiple touchpoints", async () => {
    const anonId = "anon_multi_" + Date.now();
    const sessionId = "sess_multi_" + Date.now();

    // Create multiple touchpoints
    const touchpoints = [];
    for (let i = 0; i < 3; i++) {
      const touchpoint = await prisma.touchPoint.create({
        data: {
          siteId: testSiteId,
          anonId,
          sessionId,
          occurredAt: new Date(Date.now() - (3 - i) * 24 * 60 * 60 * 1000), // 3, 2, 1 days ago
          utmSource: i === 0 ? "google" : i === 1 ? "facebook" : "twitter",
          utmMedium: "cpc",
          utmCampaign: `campaign_${i}`,
        },
      });
      touchpoints.push(touchpoint);
    }

    // Create conversion
    const conversion = await prisma.trackingEvent.create({
      data: {
        siteId: testSiteId,
        eventId: "conv_multi_" + Date.now(),
        type: "CONVERSION",
        name: "Purchase",
        anonId,
        sessionId,
        occurredAt: new Date(),
        url: "https://example.com/checkout",
        path: "/checkout",
        valueMicros: BigInt(149_990_000), // $149.99
      },
    });

    // Build journey
    const journeyId = await buildJourneyForConversion(conversion, DEFAULT_JOURNEY_CONFIG);

    expect(journeyId).toBeDefined();

    // Verify journey
    const journey = await prisma.journey.findUnique({
      where: { id: journeyId! },
    });

    expect(journey?.touchPointCount).toBe(3);
    expect(journey?.firstUtmSource).toBe("google");
    expect(journey?.lastUtmSource).toBe("twitter");

    // Verify attribution links
    const attributionLinks = await prisma.attributionLink.findMany({
      where: { conversionId: conversion.id },
      orderBy: { position: "asc" },
    });

    expect(attributionLinks.length).toBeGreaterThan(0);

    // Check linear attribution (should be equal)
    const linearLinks = attributionLinks.filter((link) => link.model === "LINEAR");
    expect(linearLinks.length).toBe(3);
    linearLinks.forEach((link) => {
      expect(link.weight).toBeCloseTo(0.333, 2);
    });
  });

  it("should respect lookback window", async () => {
    const anonId = "anon_lookback_" + Date.now();
    const sessionId = "sess_lookback_" + Date.now();

    // Create touchpoint outside lookback window
    await prisma.touchPoint.create({
      data: {
        siteId: testSiteId,
        anonId,
        sessionId,
        occurredAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000), // 35 days ago (outside 30-day window)
        utmSource: "old_source",
        utmMedium: "cpc",
      },
    });

    // Create touchpoint inside lookback window
    await prisma.touchPoint.create({
      data: {
        siteId: testSiteId,
        anonId,
        sessionId,
        occurredAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        utmSource: "recent_source",
        utmMedium: "cpc",
      },
    });

    // Create conversion
    const conversion = await prisma.trackingEvent.create({
      data: {
        siteId: testSiteId,
        eventId: "conv_lookback_" + Date.now(),
        type: "CONVERSION",
        name: "Purchase",
        anonId,
        sessionId,
        occurredAt: new Date(),
        url: "https://example.com/checkout",
        path: "/checkout",
      },
    });

    // Build journey
    const journeyId = await buildJourneyForConversion(conversion, DEFAULT_JOURNEY_CONFIG);

    // Verify only recent touchpoint was included
    const journey = await prisma.journey.findUnique({
      where: { id: journeyId! },
    });

    expect(journey?.touchPointCount).toBe(1);
    expect(journey?.firstUtmSource).toBe("recent_source");
  });

  it("should skip conversion with no touchpoints", async () => {
    const anonId = "anon_no_touch_" + Date.now();
    const sessionId = "sess_no_touch_" + Date.now();

    // Create conversion without touchpoints
    const conversion = await prisma.trackingEvent.create({
      data: {
        siteId: testSiteId,
        eventId: "conv_no_touch_" + Date.now(),
        type: "CONVERSION",
        name: "Purchase",
        anonId,
        sessionId,
        occurredAt: new Date(),
        url: "https://example.com/checkout",
        path: "/checkout",
      },
    });

    // Build journey
    const journeyId = await buildJourneyForConversion(conversion, DEFAULT_JOURNEY_CONFIG);

    expect(journeyId).toBeNull();
  });
});

describe("Batch Journey Building", () => {
  it("should build missing journeys in batch", async () => {
    // Create multiple conversions with touchpoints
    for (let i = 0; i < 3; i++) {
      const anonId = `anon_batch_${i}_${Date.now()}`;
      const sessionId = `sess_batch_${i}_${Date.now()}`;

      // Create touchpoint
      await prisma.touchPoint.create({
        data: {
          siteId: testSiteId,
          anonId,
          sessionId,
          occurredAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          utmSource: "google",
          utmMedium: "cpc",
        },
      });

      // Create conversion
      await prisma.trackingEvent.create({
        data: {
          siteId: testSiteId,
          eventId: `conv_batch_${i}_${Date.now()}`,
          type: "CONVERSION",
          name: "Purchase",
          anonId,
          sessionId,
          occurredAt: new Date(),
          url: "https://example.com/checkout",
          path: "/checkout",
        },
      });
    }

    // Build missing journeys
    const result = await buildMissingJourneys(testOrganizationId, DEFAULT_JOURNEY_CONFIG);

    expect(result.processed).toBe(3);
    expect(result.created).toBe(3);
    expect(result.skipped).toBe(0);
  });

  it("should rebuild existing journeys", async () => {
    const anonId = "anon_rebuild_" + Date.now();
    const sessionId = "sess_rebuild_" + Date.now();

    // Create touchpoint
    await prisma.touchPoint.create({
      data: {
        siteId: testSiteId,
        anonId,
        sessionId,
        occurredAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        utmSource: "google",
        utmMedium: "cpc",
      },
    });

    // Create conversion
    const conversion = await prisma.trackingEvent.create({
      data: {
        siteId: testSiteId,
        eventId: "conv_rebuild_" + Date.now(),
        type: "CONVERSION",
        name: "Purchase",
        anonId,
        sessionId,
        occurredAt: new Date(),
        url: "https://example.com/checkout",
        path: "/checkout",
      },
    });

    // Build journey first time
    await buildJourneyForConversion(conversion, DEFAULT_JOURNEY_CONFIG);

    // Rebuild
    const result = await rebuildJourneys(testOrganizationId, DEFAULT_JOURNEY_CONFIG);

    expect(result.processed).toBe(1);
    expect(result.rebuilt).toBe(1);
  });
});

describe("Journey Statistics", () => {
  it("should return accurate journey stats", async () => {
    const anonId = "anon_stats_" + Date.now();
    const sessionId = "sess_stats_" + Date.now();

    // Create touchpoint and conversion
    await prisma.touchPoint.create({
      data: {
        siteId: testSiteId,
        anonId,
        sessionId,
        occurredAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        utmSource: "google",
        utmMedium: "cpc",
      },
    });

    const conversion = await prisma.trackingEvent.create({
      data: {
        siteId: testSiteId,
        eventId: "conv_stats_" + Date.now(),
        type: "CONVERSION",
        name: "Purchase",
        anonId,
        sessionId,
        occurredAt: new Date(),
        url: "https://example.com/checkout",
        path: "/checkout",
      },
    });

    // Build journey
    await buildJourneyForConversion(conversion, DEFAULT_JOURNEY_CONFIG);

    // Get stats
    const stats = await getJourneyStats(testOrganizationId);

    expect(stats.totalJourneys).toBeGreaterThan(0);
    expect(stats.convertedJourneys).toBeGreaterThan(0);
  });
});
