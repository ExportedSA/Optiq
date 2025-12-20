/**
 * Daily Rollups V2 Tests
 * 
 * Tests rollup job with cost and attribution data
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { PrismaClient } from '@prisma/client';
import { generatePublicKey } from '@/lib/tracking/key-generator';
import { runDailyRollupsV2 } from '../daily-rollups-v2';

const prisma = new PrismaClient();

describe('Daily Rollups V2', () => {
  const testOrgId = 'test-org-rollup-' + Date.now();
  const testSiteId = 'test-site-rollup-' + Date.now();
  let publicKey: string;
  let platformId: string;
  let campaignId: string;

  beforeEach(async () => {
    // Create test organization
    await prisma.organization.create({
      data: {
        id: testOrgId,
        name: 'Test Org',
        slug: 'test-org-rollup-' + Date.now(),
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

    // Create platform
    const platform = await prisma.platform.create({
      data: {
        code: 'GOOGLE_ADS',
        name: 'Google Ads',
      },
    });
    platformId = platform.id;

    // Create campaign
    const campaign = await prisma.campaign.create({
      data: {
        organizationId: testOrgId,
        platformId,
        externalId: 'camp_test_' + Date.now(),
        name: 'Test Campaign',
        status: 'ACTIVE',
      },
    });
    campaignId = campaign.id;
  });

  afterEach(async () => {
    // Cleanup
    await prisma.dailyRollup.deleteMany({ where: { organizationId: testOrgId } });
    await prisma.attributionLink.deleteMany({ where: { siteId: testSiteId } });
    await prisma.touchPoint.deleteMany({ where: { siteId: testSiteId } });
    await prisma.trackingEvent.deleteMany({ where: { siteId: testSiteId } });
    await prisma.dailyCampaignMetric.deleteMany({ where: { organizationId: testOrgId } });
    await prisma.campaign.deleteMany({ where: { organizationId: testOrgId } });
    await prisma.platform.delete({ where: { id: platformId } });
    await prisma.trackingSite.delete({ where: { id: testSiteId } });
    await prisma.organization.delete({ where: { id: testOrgId } });
  });

  describe('Cost and Attribution Join', () => {
    it('should join cost data with attributed conversions', async () => {
      const baseDate = new Date('2024-01-01');
      const anonId = 'anon_rollup_' + Date.now();

      // Seed cost data
      await prisma.dailyCampaignMetric.create({
        data: {
          organizationId: testOrgId,
          platformId,
          campaignId,
          date: baseDate,
          impressions: BigInt(10000),
          clicks: BigInt(500),
          spendMicros: BigInt(100_000_000), // $100
        },
      });

      // Seed touchpoint
      const touchPoint = await prisma.touchPoint.create({
        data: {
          siteId: testSiteId,
          anonId,
          sessionId: 'sess_1',
          landingUrl: 'https://example.com/landing',
          platformCode: 'GOOGLE_ADS',
          campaignId,
          occurredAt: new Date(baseDate.getTime() - 1 * 24 * 60 * 60 * 1000),
        },
      });

      // Seed conversion
      const conversion = await prisma.trackingEvent.create({
        data: {
          siteId: testSiteId,
          eventId: 'evt_rollup_' + Date.now(),
          type: 'CONVERSION',
          url: 'https://example.com/checkout',
          path: '/checkout',
          anonId,
          sessionId: 'sess_conv',
          valueMicros: BigInt(200_000_000), // $200
          occurredAt: baseDate,
        },
      });

      // Seed attribution link with weight
      await prisma.attributionLink.create({
        data: {
          siteId: testSiteId,
          conversionId: conversion.id,
          touchPointId: touchPoint.id,
          model: 'LAST_TOUCH',
          weight: 1.0, // 100% attribution
          position: 1,
          touchPointCount: 1,
        },
      });

      // Run rollup job
      const result = await runDailyRollupsV2({
        organizationId: testOrgId,
        fromDate: baseDate,
        toDate: baseDate,
        attributionModel: 'LAST_TOUCH',
      });

      expect(result.daysProcessed).toBe(1);
      expect(result.rollupsCreated).toBeGreaterThan(0);

      // Verify organization-level rollup
      const orgRollup = await prisma.dailyRollup.findFirst({
        where: {
          organizationId: testOrgId,
          date: baseDate,
          grain: 'ORGANIZATION',
          attributionModel: 'LAST_TOUCH',
        },
      });

      expect(orgRollup).toBeDefined();
      expect(orgRollup?.impressions).toBe(BigInt(10000));
      expect(orgRollup?.clicks).toBe(BigInt(500));
      expect(orgRollup?.spendMicros).toBe(BigInt(100_000_000));
      expect(orgRollup?.conversions).toBe(1.0); // Full conversion attributed
      expect(orgRollup?.conversionValue).toBe(BigInt(200_000_000));
    });

    it('should handle fractional conversions from attribution weights', async () => {
      const baseDate = new Date('2024-01-01');
      const anonId = 'anon_frac_' + Date.now();

      // Seed cost data
      await prisma.dailyCampaignMetric.create({
        data: {
          organizationId: testOrgId,
          platformId,
          campaignId,
          date: baseDate,
          impressions: BigInt(5000),
          clicks: BigInt(250),
          spendMicros: BigInt(50_000_000), // $50
        },
      });

      // Seed 2 touchpoints
      const tp1 = await prisma.touchPoint.create({
        data: {
          siteId: testSiteId,
          anonId,
          sessionId: 'sess_1',
          landingUrl: 'https://example.com/landing1',
          platformCode: 'GOOGLE_ADS',
          campaignId,
          occurredAt: new Date(baseDate.getTime() - 2 * 24 * 60 * 60 * 1000),
        },
      });

      const tp2 = await prisma.touchPoint.create({
        data: {
          siteId: testSiteId,
          anonId,
          sessionId: 'sess_2',
          landingUrl: 'https://example.com/landing2',
          platformCode: 'GOOGLE_ADS',
          campaignId,
          occurredAt: new Date(baseDate.getTime() - 1 * 24 * 60 * 60 * 1000),
        },
      });

      // Seed conversion
      const conversion = await prisma.trackingEvent.create({
        data: {
          siteId: testSiteId,
          eventId: 'evt_frac_' + Date.now(),
          type: 'CONVERSION',
          url: 'https://example.com/checkout',
          path: '/checkout',
          anonId,
          sessionId: 'sess_conv',
          valueMicros: BigInt(100_000_000), // $100
          occurredAt: baseDate,
        },
      });

      // Seed attribution links with LINEAR weights (50% each)
      await prisma.attributionLink.createMany({
        data: [
          {
            siteId: testSiteId,
            conversionId: conversion.id,
            touchPointId: tp1.id,
            model: 'LINEAR',
            weight: 0.5,
            position: 1,
            touchPointCount: 2,
          },
          {
            siteId: testSiteId,
            conversionId: conversion.id,
            touchPointId: tp2.id,
            model: 'LINEAR',
            weight: 0.5,
            position: 2,
            touchPointCount: 2,
          },
        ],
      });

      // Run rollup job
      await runDailyRollupsV2({
        organizationId: testOrgId,
        fromDate: baseDate,
        toDate: baseDate,
        attributionModel: 'LINEAR',
      });

      // Verify campaign-level rollup
      const campaignRollup = await prisma.dailyRollup.findFirst({
        where: {
          organizationId: testOrgId,
          date: baseDate,
          grain: 'CAMPAIGN',
          campaignId,
          attributionModel: 'LINEAR',
        },
      });

      expect(campaignRollup).toBeDefined();
      // Should have 1.0 total conversions (0.5 + 0.5 from both touchpoints)
      expect(campaignRollup?.conversions).toBeCloseTo(1.0, 2);
      // Conversion value should be full $100 (0.5 * $100 + 0.5 * $100)
      expect(Number(campaignRollup?.conversionValue)).toBeCloseTo(100_000_000, -5);
    });
  });

  describe('Metric Calculations', () => {
    it('should calculate CPA correctly', async () => {
      const baseDate = new Date('2024-01-01');
      const anonId = 'anon_cpa_' + Date.now();

      // Seed cost: $100 spend
      await prisma.dailyCampaignMetric.create({
        data: {
          organizationId: testOrgId,
          platformId,
          campaignId,
          date: baseDate,
          impressions: BigInt(10000),
          clicks: BigInt(500),
          spendMicros: BigInt(100_000_000),
        },
      });

      // Seed touchpoint and conversion
      const tp = await prisma.touchPoint.create({
        data: {
          siteId: testSiteId,
          anonId,
          sessionId: 'sess_1',
          landingUrl: 'https://example.com/landing',
          platformCode: 'GOOGLE_ADS',
          campaignId,
          occurredAt: new Date(baseDate.getTime() - 1 * 24 * 60 * 60 * 1000),
        },
      });

      const conversion = await prisma.trackingEvent.create({
        data: {
          siteId: testSiteId,
          eventId: 'evt_cpa_' + Date.now(),
          type: 'CONVERSION',
          url: 'https://example.com/checkout',
          path: '/checkout',
          anonId,
          sessionId: 'sess_conv',
          valueMicros: BigInt(50_000_000),
          occurredAt: baseDate,
        },
      });

      await prisma.attributionLink.create({
        data: {
          siteId: testSiteId,
          conversionId: conversion.id,
          touchPointId: tp.id,
          model: 'LAST_TOUCH',
          weight: 1.0,
          position: 1,
          touchPointCount: 1,
        },
      });

      // Run rollup
      await runDailyRollupsV2({
        organizationId: testOrgId,
        fromDate: baseDate,
        toDate: baseDate,
        attributionModel: 'LAST_TOUCH',
      });

      const rollup = await prisma.dailyRollup.findFirst({
        where: {
          organizationId: testOrgId,
          date: baseDate,
          grain: 'ORGANIZATION',
          attributionModel: 'LAST_TOUCH',
        },
      });

      // CPA = $100 / 1 conversion = $100
      expect(rollup?.cpa).toBeCloseTo(100, 2);
    });

    it('should calculate ROAS correctly', async () => {
      const baseDate = new Date('2024-01-01');
      const anonId = 'anon_roas_' + Date.now();

      // Seed cost: $50 spend
      await prisma.dailyCampaignMetric.create({
        data: {
          organizationId: testOrgId,
          platformId,
          campaignId,
          date: baseDate,
          impressions: BigInt(5000),
          clicks: BigInt(250),
          spendMicros: BigInt(50_000_000),
        },
      });

      // Seed touchpoint and conversion with $200 value
      const tp = await prisma.touchPoint.create({
        data: {
          siteId: testSiteId,
          anonId,
          sessionId: 'sess_1',
          landingUrl: 'https://example.com/landing',
          platformCode: 'GOOGLE_ADS',
          campaignId,
          occurredAt: new Date(baseDate.getTime() - 1 * 24 * 60 * 60 * 1000),
        },
      });

      const conversion = await prisma.trackingEvent.create({
        data: {
          siteId: testSiteId,
          eventId: 'evt_roas_' + Date.now(),
          type: 'CONVERSION',
          url: 'https://example.com/checkout',
          path: '/checkout',
          anonId,
          sessionId: 'sess_conv',
          valueMicros: BigInt(200_000_000), // $200
          occurredAt: baseDate,
        },
      });

      await prisma.attributionLink.create({
        data: {
          siteId: testSiteId,
          conversionId: conversion.id,
          touchPointId: tp.id,
          model: 'LAST_TOUCH',
          weight: 1.0,
          position: 1,
          touchPointCount: 1,
        },
      });

      // Run rollup
      await runDailyRollupsV2({
        organizationId: testOrgId,
        fromDate: baseDate,
        toDate: baseDate,
        attributionModel: 'LAST_TOUCH',
      });

      const rollup = await prisma.dailyRollup.findFirst({
        where: {
          organizationId: testOrgId,
          date: baseDate,
          grain: 'ORGANIZATION',
          attributionModel: 'LAST_TOUCH',
        },
      });

      // ROAS = $200 / $50 = 4.0
      expect(rollup?.roas).toBeCloseTo(4.0, 2);
    });

    it('should calculate waste spend correctly', async () => {
      const baseDate = new Date('2024-01-01');

      // Seed cost with NO conversions
      await prisma.dailyCampaignMetric.create({
        data: {
          organizationId: testOrgId,
          platformId,
          campaignId,
          date: baseDate,
          impressions: BigInt(10000),
          clicks: BigInt(500),
          spendMicros: BigInt(100_000_000), // $100 wasted
        },
      });

      // Run rollup (no conversions)
      await runDailyRollupsV2({
        organizationId: testOrgId,
        fromDate: baseDate,
        toDate: baseDate,
        attributionModel: 'LAST_TOUCH',
      });

      const rollup = await prisma.dailyRollup.findFirst({
        where: {
          organizationId: testOrgId,
          date: baseDate,
          grain: 'ORGANIZATION',
          attributionModel: 'LAST_TOUCH',
        },
      });

      expect(rollup?.conversions).toBe(0);
      expect(rollup?.wasteSpendMicros).toBe(BigInt(100_000_000)); // All spend is waste
      expect(rollup?.wastePct).toBe(100); // 100% waste
    });
  });

  describe('Grain Levels', () => {
    it('should create rollups at all grain levels', async () => {
      const baseDate = new Date('2024-01-01');
      const anonId = 'anon_grain_' + Date.now();

      // Seed cost data
      await prisma.dailyCampaignMetric.create({
        data: {
          organizationId: testOrgId,
          platformId,
          campaignId,
          date: baseDate,
          impressions: BigInt(1000),
          clicks: BigInt(50),
          spendMicros: BigInt(10_000_000),
        },
      });

      // Seed touchpoint and conversion
      const tp = await prisma.touchPoint.create({
        data: {
          siteId: testSiteId,
          anonId,
          sessionId: 'sess_1',
          landingUrl: 'https://example.com/landing',
          platformCode: 'GOOGLE_ADS',
          campaignId,
          occurredAt: new Date(baseDate.getTime() - 1 * 24 * 60 * 60 * 1000),
        },
      });

      const conversion = await prisma.trackingEvent.create({
        data: {
          siteId: testSiteId,
          eventId: 'evt_grain_' + Date.now(),
          type: 'CONVERSION',
          url: 'https://example.com/checkout',
          path: '/checkout',
          anonId,
          sessionId: 'sess_conv',
          valueMicros: BigInt(20_000_000),
          occurredAt: baseDate,
        },
      });

      await prisma.attributionLink.create({
        data: {
          siteId: testSiteId,
          conversionId: conversion.id,
          touchPointId: tp.id,
          model: 'LAST_TOUCH',
          weight: 1.0,
          position: 1,
          touchPointCount: 1,
        },
      });

      // Run rollup
      await runDailyRollupsV2({
        organizationId: testOrgId,
        fromDate: baseDate,
        toDate: baseDate,
        attributionModel: 'LAST_TOUCH',
      });

      // Verify rollups at each grain
      const grains = ['ORGANIZATION', 'PLATFORM', 'CAMPAIGN'];
      
      for (const grain of grains) {
        const rollup = await prisma.dailyRollup.findFirst({
          where: {
            organizationId: testOrgId,
            date: baseDate,
            grain: grain as any,
            attributionModel: 'LAST_TOUCH',
          },
        });

        expect(rollup).toBeDefined();
        expect(rollup?.spendMicros).toBe(BigInt(10_000_000));
        expect(rollup?.conversions).toBe(1.0);
      }
    });
  });

  describe('Idempotency', () => {
    it('should skip existing rollups when rebuild=false', async () => {
      const baseDate = new Date('2024-01-01');

      // Seed cost data
      await prisma.dailyCampaignMetric.create({
        data: {
          organizationId: testOrgId,
          platformId,
          campaignId,
          date: baseDate,
          impressions: BigInt(1000),
          clicks: BigInt(50),
          spendMicros: BigInt(10_000_000),
        },
      });

      // Run rollup first time
      const result1 = await runDailyRollupsV2({
        organizationId: testOrgId,
        fromDate: baseDate,
        toDate: baseDate,
        attributionModel: 'LAST_TOUCH',
        rebuild: false,
      });

      expect(result1.rollupsCreated).toBeGreaterThan(0);

      // Run rollup second time (should skip)
      const result2 = await runDailyRollupsV2({
        organizationId: testOrgId,
        fromDate: baseDate,
        toDate: baseDate,
        attributionModel: 'LAST_TOUCH',
        rebuild: false,
      });

      expect(result2.rollupsCreated).toBe(0);
      expect(result2.rollupsUpdated).toBe(0);
    });

    it('should update existing rollups when rebuild=true', async () => {
      const baseDate = new Date('2024-01-01');

      // Seed cost data
      await prisma.dailyCampaignMetric.create({
        data: {
          organizationId: testOrgId,
          platformId,
          campaignId,
          date: baseDate,
          impressions: BigInt(1000),
          clicks: BigInt(50),
          spendMicros: BigInt(10_000_000),
        },
      });

      // Run rollup first time
      await runDailyRollupsV2({
        organizationId: testOrgId,
        fromDate: baseDate,
        toDate: baseDate,
        attributionModel: 'LAST_TOUCH',
        rebuild: false,
      });

      // Run rollup second time with rebuild=true
      const result2 = await runDailyRollupsV2({
        organizationId: testOrgId,
        fromDate: baseDate,
        toDate: baseDate,
        attributionModel: 'LAST_TOUCH',
        rebuild: true,
      });

      expect(result2.rollupsUpdated).toBeGreaterThan(0);
    });
  });
});
