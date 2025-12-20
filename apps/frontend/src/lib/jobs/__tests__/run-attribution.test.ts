/**
 * Attribution Job Tests
 * 
 * Tests attribution weight calculation with seeded events and touchpoints
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { PrismaClient } from '@prisma/client';
import { generatePublicKey } from '@/lib/tracking/key-generator';
import { runAttribution, rebuildAllAttribution, getAttributionStats } from '../run-attribution';
import { calculateAttributionWeights, validateWeights } from '@/lib/attribution/weight-calculator';

const prisma = new PrismaClient();

describe('Attribution Job', () => {
  const testOrgId = 'test-org-attr-job-' + Date.now();
  const testSiteId = 'test-site-attr-job-' + Date.now();
  let publicKey: string;

  beforeEach(async () => {
    // Create test organization
    await prisma.organization.create({
      data: {
        id: testOrgId,
        name: 'Test Org',
        slug: 'test-org-attr-job-' + Date.now(),
      },
    });

    // Create test tracking site
    publicKey = generatePublicKey();
    await prisma.trackingSite.create({
      data: {
        id: testSiteId,
        organizationId: testOrgId,
        name: 'Test Site',
        domain: 'example.com',
        publicKey,
      },
    });
  });

  afterEach(async () => {
    // Cleanup
    await prisma.attributionLink.deleteMany({ where: { siteId: testSiteId } });
    await prisma.touchPoint.deleteMany({ where: { siteId: testSiteId } });
    await prisma.trackingEvent.deleteMany({ where: { siteId: testSiteId } });
    await prisma.trackingSite.delete({ where: { id: testSiteId } });
    await prisma.organization.delete({ where: { id: testOrgId } });
  });

  describe('LAST_TOUCH Attribution', () => {
    it('should assign 100% weight to last touchpoint', async () => {
      const anonId = 'anon_last_' + Date.now();
      const baseDate = new Date('2024-01-01');

      // Seed touchpoints
      const tp1 = await prisma.touchPoint.create({
        data: {
          siteId: testSiteId,
          anonId,
          sessionId: 'sess_1',
          landingUrl: 'https://example.com/landing1',
          utmSource: 'google',
          platformCode: 'GOOGLE_ADS',
          occurredAt: new Date(baseDate.getTime() + 0 * 24 * 60 * 60 * 1000),
        },
      });

      const tp2 = await prisma.touchPoint.create({
        data: {
          siteId: testSiteId,
          anonId,
          sessionId: 'sess_2',
          landingUrl: 'https://example.com/landing2',
          utmSource: 'facebook',
          platformCode: 'META',
          occurredAt: new Date(baseDate.getTime() + 1 * 24 * 60 * 60 * 1000),
        },
      });

      const tp3 = await prisma.touchPoint.create({
        data: {
          siteId: testSiteId,
          anonId,
          sessionId: 'sess_3',
          landingUrl: 'https://example.com/landing3',
          utmSource: 'twitter',
          platformCode: 'TIKTOK',
          occurredAt: new Date(baseDate.getTime() + 2 * 24 * 60 * 60 * 1000),
        },
      });

      // Seed conversion
      const conversion = await prisma.trackingEvent.create({
        data: {
          siteId: testSiteId,
          eventId: 'evt_last_' + Date.now(),
          type: 'CONVERSION',
          url: 'https://example.com/checkout',
          path: '/checkout',
          anonId,
          sessionId: 'sess_conv',
          valueMicros: BigInt(99990000),
          occurredAt: new Date(baseDate.getTime() + 3 * 24 * 60 * 60 * 1000),
        },
      });

      // Seed attribution link candidates (with weight 0)
      await prisma.attributionLink.createMany({
        data: [
          {
            siteId: testSiteId,
            conversionId: conversion.id,
            touchPointId: tp1.id,
            model: 'LAST_TOUCH',
            weight: 0,
            position: 1,
            touchPointCount: 3,
          },
          {
            siteId: testSiteId,
            conversionId: conversion.id,
            touchPointId: tp2.id,
            model: 'LAST_TOUCH',
            weight: 0,
            position: 2,
            touchPointCount: 3,
          },
          {
            siteId: testSiteId,
            conversionId: conversion.id,
            touchPointId: tp3.id,
            model: 'LAST_TOUCH',
            weight: 0,
            position: 3,
            touchPointCount: 3,
          },
        ],
      });

      // Run attribution job
      const result = await runAttribution({
        siteId: testSiteId,
        fromDate: new Date(baseDate.getTime() - 1 * 24 * 60 * 60 * 1000),
        toDate: new Date(baseDate.getTime() + 4 * 24 * 60 * 60 * 1000),
        model: 'LAST_TOUCH',
      });

      expect(result.conversionsProcessed).toBe(1);
      expect(result.linksUpdated).toBe(3);

      // Verify weights
      const links = await prisma.attributionLink.findMany({
        where: { conversionId: conversion.id, model: 'LAST_TOUCH' },
        orderBy: { position: 'asc' },
      });

      expect(links[0].weight).toBe(0); // First touchpoint
      expect(links[1].weight).toBe(0); // Middle touchpoint
      expect(links[2].weight).toBe(1.0); // Last touchpoint gets 100%
    });
  });

  describe('LINEAR Attribution', () => {
    it('should assign equal weights to all touchpoints', async () => {
      const anonId = 'anon_linear_' + Date.now();
      const baseDate = new Date('2024-01-01');

      // Seed 3 touchpoints
      const tp1 = await prisma.touchPoint.create({
        data: {
          siteId: testSiteId,
          anonId,
          sessionId: 'sess_1',
          landingUrl: 'https://example.com/landing1',
          utmSource: 'google',
          occurredAt: new Date(baseDate.getTime() + 0 * 24 * 60 * 60 * 1000),
        },
      });

      const tp2 = await prisma.touchPoint.create({
        data: {
          siteId: testSiteId,
          anonId,
          sessionId: 'sess_2',
          landingUrl: 'https://example.com/landing2',
          utmSource: 'facebook',
          occurredAt: new Date(baseDate.getTime() + 1 * 24 * 60 * 60 * 1000),
        },
      });

      const tp3 = await prisma.touchPoint.create({
        data: {
          siteId: testSiteId,
          anonId,
          sessionId: 'sess_3',
          landingUrl: 'https://example.com/landing3',
          utmSource: 'twitter',
          occurredAt: new Date(baseDate.getTime() + 2 * 24 * 60 * 60 * 1000),
        },
      });

      // Seed conversion
      const conversion = await prisma.trackingEvent.create({
        data: {
          siteId: testSiteId,
          eventId: 'evt_linear_' + Date.now(),
          type: 'CONVERSION',
          url: 'https://example.com/checkout',
          path: '/checkout',
          anonId,
          sessionId: 'sess_conv',
          valueMicros: BigInt(99990000),
          occurredAt: new Date(baseDate.getTime() + 3 * 24 * 60 * 60 * 1000),
        },
      });

      // Seed attribution link candidates
      await prisma.attributionLink.createMany({
        data: [
          {
            siteId: testSiteId,
            conversionId: conversion.id,
            touchPointId: tp1.id,
            model: 'LINEAR',
            weight: 0,
            position: 1,
            touchPointCount: 3,
          },
          {
            siteId: testSiteId,
            conversionId: conversion.id,
            touchPointId: tp2.id,
            model: 'LINEAR',
            weight: 0,
            position: 2,
            touchPointCount: 3,
          },
          {
            siteId: testSiteId,
            conversionId: conversion.id,
            touchPointId: tp3.id,
            model: 'LINEAR',
            weight: 0,
            position: 3,
            touchPointCount: 3,
          },
        ],
      });

      // Run attribution job
      const result = await runAttribution({
        siteId: testSiteId,
        fromDate: new Date(baseDate.getTime() - 1 * 24 * 60 * 60 * 1000),
        toDate: new Date(baseDate.getTime() + 4 * 24 * 60 * 60 * 1000),
        model: 'LINEAR',
      });

      expect(result.conversionsProcessed).toBe(1);
      expect(result.linksUpdated).toBe(3);

      // Verify weights
      const links = await prisma.attributionLink.findMany({
        where: { conversionId: conversion.id, model: 'LINEAR' },
        orderBy: { position: 'asc' },
      });

      // Each touchpoint should get 1/3 = 0.333...
      const expectedWeight = 1.0 / 3;
      expect(links[0].weight).toBeCloseTo(expectedWeight, 5);
      expect(links[1].weight).toBeCloseTo(expectedWeight, 5);
      expect(links[2].weight).toBeCloseTo(expectedWeight, 5);

      // Verify weights sum to 1.0
      const totalWeight = links.reduce((sum, link) => sum + link.weight, 0);
      expect(totalWeight).toBeCloseTo(1.0, 5);
    });

    it('should handle 2 touchpoints with LINEAR', async () => {
      const anonId = 'anon_linear_2_' + Date.now();
      const baseDate = new Date('2024-01-01');

      // Seed 2 touchpoints
      const tp1 = await prisma.touchPoint.create({
        data: {
          siteId: testSiteId,
          anonId,
          sessionId: 'sess_1',
          landingUrl: 'https://example.com/landing1',
          utmSource: 'google',
          occurredAt: baseDate,
        },
      });

      const tp2 = await prisma.touchPoint.create({
        data: {
          siteId: testSiteId,
          anonId,
          sessionId: 'sess_2',
          landingUrl: 'https://example.com/landing2',
          utmSource: 'facebook',
          occurredAt: new Date(baseDate.getTime() + 1 * 24 * 60 * 60 * 1000),
        },
      });

      // Seed conversion
      const conversion = await prisma.trackingEvent.create({
        data: {
          siteId: testSiteId,
          eventId: 'evt_linear_2_' + Date.now(),
          type: 'CONVERSION',
          url: 'https://example.com/checkout',
          path: '/checkout',
          anonId,
          sessionId: 'sess_conv',
          occurredAt: new Date(baseDate.getTime() + 2 * 24 * 60 * 60 * 1000),
        },
      });

      // Seed attribution link candidates
      await prisma.attributionLink.createMany({
        data: [
          {
            siteId: testSiteId,
            conversionId: conversion.id,
            touchPointId: tp1.id,
            model: 'LINEAR',
            weight: 0,
            position: 1,
            touchPointCount: 2,
          },
          {
            siteId: testSiteId,
            conversionId: conversion.id,
            touchPointId: tp2.id,
            model: 'LINEAR',
            weight: 0,
            position: 2,
            touchPointCount: 2,
          },
        ],
      });

      // Run attribution job
      await runAttribution({
        siteId: testSiteId,
        fromDate: new Date(baseDate.getTime() - 1 * 24 * 60 * 60 * 1000),
        toDate: new Date(baseDate.getTime() + 3 * 24 * 60 * 60 * 1000),
        model: 'LINEAR',
      });

      // Verify weights
      const links = await prisma.attributionLink.findMany({
        where: { conversionId: conversion.id, model: 'LINEAR' },
        orderBy: { position: 'asc' },
      });

      // Each should get 50%
      expect(links[0].weight).toBeCloseTo(0.5, 5);
      expect(links[1].weight).toBeCloseTo(0.5, 5);
    });
  });

  describe('Idempotency', () => {
    it('should skip conversions with existing weights', async () => {
      const anonId = 'anon_idem_' + Date.now();
      const baseDate = new Date('2024-01-01');

      // Seed touchpoint
      const tp = await prisma.touchPoint.create({
        data: {
          siteId: testSiteId,
          anonId,
          sessionId: 'sess_1',
          landingUrl: 'https://example.com/landing',
          utmSource: 'google',
          occurredAt: baseDate,
        },
      });

      // Seed conversion
      const conversion = await prisma.trackingEvent.create({
        data: {
          siteId: testSiteId,
          eventId: 'evt_idem_' + Date.now(),
          type: 'CONVERSION',
          url: 'https://example.com/checkout',
          path: '/checkout',
          anonId,
          sessionId: 'sess_conv',
          occurredAt: new Date(baseDate.getTime() + 1 * 24 * 60 * 60 * 1000),
        },
      });

      // Seed attribution link with weight already set
      await prisma.attributionLink.create({
        data: {
          siteId: testSiteId,
          conversionId: conversion.id,
          touchPointId: tp.id,
          model: 'LAST_TOUCH',
          weight: 1.0, // Already calculated
          position: 1,
          touchPointCount: 1,
        },
      });

      // Run attribution job (should skip)
      const result = await runAttribution({
        siteId: testSiteId,
        fromDate: new Date(baseDate.getTime() - 1 * 24 * 60 * 60 * 1000),
        toDate: new Date(baseDate.getTime() + 2 * 24 * 60 * 60 * 1000),
        model: 'LAST_TOUCH',
        rebuild: false,
      });

      expect(result.conversionsProcessed).toBe(1);
      expect(result.linksUpdated).toBe(0); // Skipped
    });

    it('should recalculate weights when rebuild=true', async () => {
      const anonId = 'anon_rebuild_' + Date.now();
      const baseDate = new Date('2024-01-01');

      // Seed touchpoint
      const tp = await prisma.touchPoint.create({
        data: {
          siteId: testSiteId,
          anonId,
          sessionId: 'sess_1',
          landingUrl: 'https://example.com/landing',
          utmSource: 'google',
          occurredAt: baseDate,
        },
      });

      // Seed conversion
      const conversion = await prisma.trackingEvent.create({
        data: {
          siteId: testSiteId,
          eventId: 'evt_rebuild_' + Date.now(),
          type: 'CONVERSION',
          url: 'https://example.com/checkout',
          path: '/checkout',
          anonId,
          sessionId: 'sess_conv',
          occurredAt: new Date(baseDate.getTime() + 1 * 24 * 60 * 60 * 1000),
        },
      });

      // Seed attribution link with incorrect weight
      await prisma.attributionLink.create({
        data: {
          siteId: testSiteId,
          conversionId: conversion.id,
          touchPointId: tp.id,
          model: 'LAST_TOUCH',
          weight: 0.5, // Incorrect weight
          position: 1,
          touchPointCount: 1,
        },
      });

      // Run attribution job with rebuild=true
      const result = await runAttribution({
        siteId: testSiteId,
        fromDate: new Date(baseDate.getTime() - 1 * 24 * 60 * 60 * 1000),
        toDate: new Date(baseDate.getTime() + 2 * 24 * 60 * 60 * 1000),
        model: 'LAST_TOUCH',
        rebuild: true,
      });

      expect(result.conversionsProcessed).toBe(1);
      expect(result.linksUpdated).toBe(1); // Recalculated

      // Verify weight was corrected
      const link = await prisma.attributionLink.findFirst({
        where: { conversionId: conversion.id },
      });

      expect(link?.weight).toBe(1.0); // Corrected to 100%
    });
  });

  describe('Multiple Conversions', () => {
    it('should process multiple conversions in date range', async () => {
      const baseDate = new Date('2024-01-01');

      // Create 3 conversions with touchpoints
      for (let i = 0; i < 3; i++) {
        const anonId = `anon_multi_${i}_${Date.now()}`;

        // Touchpoint
        const tp = await prisma.touchPoint.create({
          data: {
            siteId: testSiteId,
            anonId,
            sessionId: `sess_${i}`,
            landingUrl: `https://example.com/landing${i}`,
            utmSource: 'google',
            occurredAt: new Date(baseDate.getTime() + i * 24 * 60 * 60 * 1000),
          },
        });

        // Conversion
        const conversion = await prisma.trackingEvent.create({
          data: {
            siteId: testSiteId,
            eventId: `evt_multi_${i}_${Date.now()}`,
            type: 'CONVERSION',
            url: 'https://example.com/checkout',
            path: '/checkout',
            anonId,
            sessionId: `sess_conv_${i}`,
            occurredAt: new Date(baseDate.getTime() + (i + 1) * 24 * 60 * 60 * 1000),
          },
        });

        // Attribution link
        await prisma.attributionLink.create({
          data: {
            siteId: testSiteId,
            conversionId: conversion.id,
            touchPointId: tp.id,
            model: 'LAST_TOUCH',
            weight: 0,
            position: 1,
            touchPointCount: 1,
          },
        });
      }

      // Run attribution job
      const result = await runAttribution({
        siteId: testSiteId,
        fromDate: new Date(baseDate.getTime() - 1 * 24 * 60 * 60 * 1000),
        toDate: new Date(baseDate.getTime() + 10 * 24 * 60 * 60 * 1000),
        model: 'LAST_TOUCH',
      });

      expect(result.conversionsProcessed).toBe(3);
      expect(result.linksUpdated).toBe(3);
    });
  });

  describe('Weight Validation', () => {
    it('should validate weights sum to 1.0', () => {
      const weights = [
        { touchPointId: 'tp1', weight: 0.333333 },
        { touchPointId: 'tp2', weight: 0.333333 },
        { touchPointId: 'tp3', weight: 0.333334 },
      ];

      expect(validateWeights(weights)).toBe(true);
    });

    it('should reject weights that do not sum to 1.0', () => {
      const weights = [
        { touchPointId: 'tp1', weight: 0.5 },
        { touchPointId: 'tp2', weight: 0.3 },
      ];

      expect(validateWeights(weights)).toBe(false);
    });
  });

  describe('Attribution Stats', () => {
    it('should return attribution statistics', async () => {
      const anonId = 'anon_stats_' + Date.now();
      const baseDate = new Date('2024-01-01');

      // Seed touchpoint
      const tp = await prisma.touchPoint.create({
        data: {
          siteId: testSiteId,
          anonId,
          sessionId: 'sess_1',
          landingUrl: 'https://example.com/landing',
          utmSource: 'google',
          occurredAt: baseDate,
        },
      });

      // Seed conversion
      const conversion = await prisma.trackingEvent.create({
        data: {
          siteId: testSiteId,
          eventId: 'evt_stats_' + Date.now(),
          type: 'CONVERSION',
          url: 'https://example.com/checkout',
          path: '/checkout',
          anonId,
          sessionId: 'sess_conv',
          occurredAt: new Date(baseDate.getTime() + 1 * 24 * 60 * 60 * 1000),
        },
      });

      // Seed attribution links (one with weight, one without)
      await prisma.attributionLink.createMany({
        data: [
          {
            siteId: testSiteId,
            conversionId: conversion.id,
            touchPointId: tp.id,
            model: 'LAST_TOUCH',
            weight: 1.0,
            position: 1,
            touchPointCount: 1,
          },
          {
            siteId: testSiteId,
            conversionId: conversion.id,
            touchPointId: tp.id,
            model: 'LINEAR',
            weight: 0,
            position: 1,
            touchPointCount: 1,
          },
        ],
      });

      const stats = await getAttributionStats(testSiteId);

      expect(stats.totalLinks).toBe(2);
      expect(stats.linksWithWeights).toBe(1);
      expect(stats.linksWithoutWeights).toBe(1);
      expect(stats.percentageComplete).toBe(50);
    });
  });
});
