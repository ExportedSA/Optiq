/**
 * Waste API Tests
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { PrismaClient } from '@prisma/client';
import { generatePublicKey } from '@/lib/tracking/key-generator';
import { generateWasteExplanation, calculateWasteSeverity, getSeverityLevel } from '@/lib/waste/explainability';

const prisma = new PrismaClient();

describe('Waste API', () => {
  const testOrgId = 'test-org-waste-' + Date.now();
  const testSiteId = 'test-site-waste-' + Date.now();
  let publicKey: string;
  let platformId: string;
  let campaignId: string;

  beforeEach(async () => {
    // Create test organization
    await prisma.organization.create({
      data: {
        id: testOrgId,
        name: 'Test Org',
        slug: 'test-org-waste-' + Date.now(),
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
        externalId: 'camp_waste_' + Date.now(),
        name: 'Test Campaign',
        status: 'ACTIVE',
      },
    });
    campaignId = campaign.id;
  });

  afterEach(async () => {
    // Cleanup
    await prisma.dailyRollup.deleteMany({ where: { organizationId: testOrgId } });
    await prisma.campaign.deleteMany({ where: { organizationId: testOrgId } });
    await prisma.platform.delete({ where: { id: platformId } });
    await prisma.trackingSite.delete({ where: { id: testSiteId } });
    await prisma.organization.delete({ where: { id: testOrgId } });
  });

  describe('Waste Explainability', () => {
    it('should generate explanation for no conversions', () => {
      const explanation = generateWasteExplanation({
        date: new Date('2024-01-01'),
        spendMicros: BigInt(100_000_000), // $100
        conversions: 0,
        cpa: null,
        roas: null,
        attributionModel: 'LAST_TOUCH',
      });

      expect(explanation.reason).toBe('no_conversions');
      expect(explanation.metrics.spend).toBe(100);
      expect(explanation.metrics.conversions).toBe(0);
      expect(explanation.severity).toBe('medium'); // $100 spend
      expect(explanation.recommendations.length).toBeGreaterThan(0);
    });

    it('should generate explanation for high CPA', () => {
      const explanation = generateWasteExplanation({
        date: new Date('2024-01-01'),
        spendMicros: BigInt(100_000_000), // $100
        conversions: 2,
        cpa: 100, // $100 CPA
        roas: 1.0,
        attributionModel: 'LAST_TOUCH',
        targetCpa: 50, // Target $50
      });

      expect(explanation.reason).toBe('high_cpa');
      expect(explanation.metrics.cpa).toBe(100);
      expect(explanation.metrics.targetCpa).toBe(50);
      expect(explanation.severity).toBe('medium'); // 100% above target
      expect(explanation.recommendations.some(r => r.includes('50%'))).toBe(true);
    });

    it('should generate explanation for low ROAS', () => {
      const explanation = generateWasteExplanation({
        date: new Date('2024-01-01'),
        spendMicros: BigInt(100_000_000), // $100
        conversions: 2,
        cpa: 50,
        roas: 1.5, // 1.5x ROAS
        attributionModel: 'LAST_TOUCH',
        targetRoas: 3.0, // Target 3x
      });

      expect(explanation.reason).toBe('low_roas');
      expect(explanation.metrics.roas).toBe(1.5);
      expect(explanation.metrics.targetRoas).toBe(3.0);
      expect(explanation.severity).toBe('medium'); // 50% below target
      expect(explanation.recommendations.length).toBeGreaterThan(0);
    });

    it('should adjust severity based on spend amount', () => {
      // High spend, no conversions
      const highSpend = generateWasteExplanation({
        date: new Date('2024-01-01'),
        spendMicros: BigInt(5000_000_000), // $5000
        conversions: 0,
        cpa: null,
        roas: null,
        attributionModel: 'LAST_TOUCH',
      });

      expect(highSpend.severity).toBe('high');
      expect(highSpend.recommendations.some(r => r.toLowerCase().includes('pause'))).toBe(true);

      // Low spend, no conversions
      const lowSpend = generateWasteExplanation({
        date: new Date('2024-01-01'),
        spendMicros: BigInt(10_000_000), // $10
        conversions: 0,
        cpa: null,
        roas: null,
        attributionModel: 'LAST_TOUCH',
      });

      expect(lowSpend.severity).toBe('low');
      expect(lowSpend.recommendations.some(r => r.toLowerCase().includes('time'))).toBe(true);
    });
  });

  describe('Severity Calculation', () => {
    it('should calculate high severity for large waste', () => {
      const score = calculateWasteSeverity(
        5000, // $5000 waste
        5000, // $5000 total
        100   // 100% waste
      );

      expect(score).toBeGreaterThan(70);
      expect(getSeverityLevel(score)).toBe('high');
    });

    it('should calculate medium severity for moderate waste', () => {
      const score = calculateWasteSeverity(
        500,  // $500 waste
        1000, // $1000 total
        50    // 50% waste
      );

      expect(score).toBeGreaterThanOrEqual(40);
      expect(score).toBeLessThan(70);
      expect(getSeverityLevel(score)).toBe('medium');
    });

    it('should calculate low severity for small waste', () => {
      const score = calculateWasteSeverity(
        10,   // $10 waste
        100,  // $100 total
        10    // 10% waste
      );

      expect(score).toBeLessThan(40);
      expect(getSeverityLevel(score)).toBe('low');
    });

    it('should cap severity score at 100', () => {
      const score = calculateWasteSeverity(
        100000, // Very high waste
        100000, // Very high total
        100     // 100% waste
      );

      expect(score).toBeLessThanOrEqual(100);
    });
  });

  describe('Waste Rollup Queries', () => {
    it('should find rollups with waste spend', async () => {
      const baseDate = new Date('2024-01-01');

      // Create rollup with waste
      await prisma.dailyRollup.create({
        data: {
          organizationId: testOrgId,
          date: baseDate,
          grain: 'CAMPAIGN',
          platformId,
          campaignId,
          attributionModel: 'LAST_TOUCH',
          impressions: BigInt(10000),
          clicks: BigInt(500),
          spendMicros: BigInt(100_000_000), // $100
          conversions: 0,
          conversionValue: BigInt(0),
          attributedConversions: 0,
          wasteSpendMicros: BigInt(100_000_000), // $100 waste
          wastePct: 100,
        },
      });

      // Query waste rollups
      const wasteRollups = await prisma.dailyRollup.findMany({
        where: {
          organizationId: testOrgId,
          wasteSpendMicros: { gt: BigInt(0) },
        },
      });

      expect(wasteRollups.length).toBe(1);
      expect(wasteRollups[0].wasteSpendMicros).toBe(BigInt(100_000_000));
      expect(wasteRollups[0].wastePct).toBe(100);
    });

    it('should filter by date range', async () => {
      const date1 = new Date('2024-01-01');
      const date2 = new Date('2024-01-15');
      const date3 = new Date('2024-02-01');

      // Create rollups on different dates
      await prisma.dailyRollup.createMany({
        data: [
          {
            organizationId: testOrgId,
            date: date1,
            grain: 'ORGANIZATION',
            attributionModel: 'LAST_TOUCH',
            impressions: BigInt(1000),
            clicks: BigInt(50),
            spendMicros: BigInt(10_000_000),
            conversions: 0,
            conversionValue: BigInt(0),
            attributedConversions: 0,
            wasteSpendMicros: BigInt(10_000_000),
            wastePct: 100,
          },
          {
            organizationId: testOrgId,
            date: date2,
            grain: 'ORGANIZATION',
            attributionModel: 'LAST_TOUCH',
            impressions: BigInt(1000),
            clicks: BigInt(50),
            spendMicros: BigInt(20_000_000),
            conversions: 0,
            conversionValue: BigInt(0),
            attributedConversions: 0,
            wasteSpendMicros: BigInt(20_000_000),
            wastePct: 100,
          },
          {
            organizationId: testOrgId,
            date: date3,
            grain: 'ORGANIZATION',
            attributionModel: 'LAST_TOUCH',
            impressions: BigInt(1000),
            clicks: BigInt(50),
            spendMicros: BigInt(30_000_000),
            conversions: 0,
            conversionValue: BigInt(0),
            attributedConversions: 0,
            wasteSpendMicros: BigInt(30_000_000),
            wastePct: 100,
          },
        ],
      });

      // Query January only
      const januaryWaste = await prisma.dailyRollup.findMany({
        where: {
          organizationId: testOrgId,
          date: {
            gte: new Date('2024-01-01'),
            lte: new Date('2024-01-31'),
          },
          wasteSpendMicros: { gt: BigInt(0) },
        },
      });

      expect(januaryWaste.length).toBe(2);
    });

    it('should filter by grain', async () => {
      const baseDate = new Date('2024-01-01');

      // Create rollups at different grains
      await prisma.dailyRollup.createMany({
        data: [
          {
            organizationId: testOrgId,
            date: baseDate,
            grain: 'ORGANIZATION',
            attributionModel: 'LAST_TOUCH',
            impressions: BigInt(1000),
            clicks: BigInt(50),
            spendMicros: BigInt(10_000_000),
            conversions: 0,
            conversionValue: BigInt(0),
            attributedConversions: 0,
            wasteSpendMicros: BigInt(10_000_000),
            wastePct: 100,
          },
          {
            organizationId: testOrgId,
            date: baseDate,
            grain: 'CAMPAIGN',
            platformId,
            campaignId,
            attributionModel: 'LAST_TOUCH',
            impressions: BigInt(1000),
            clicks: BigInt(50),
            spendMicros: BigInt(20_000_000),
            conversions: 0,
            conversionValue: BigInt(0),
            attributedConversions: 0,
            wasteSpendMicros: BigInt(20_000_000),
            wastePct: 100,
          },
        ],
      });

      // Query campaign grain only
      const campaignWaste = await prisma.dailyRollup.findMany({
        where: {
          organizationId: testOrgId,
          grain: 'CAMPAIGN',
          wasteSpendMicros: { gt: BigInt(0) },
        },
      });

      expect(campaignWaste.length).toBe(1);
      expect(campaignWaste[0].grain).toBe('CAMPAIGN');
    });

    it('should filter by minimum waste spend', async () => {
      const baseDate = new Date('2024-01-01');

      // Create rollups with different waste amounts
      await prisma.dailyRollup.createMany({
        data: [
          {
            organizationId: testOrgId,
            date: baseDate,
            grain: 'ORGANIZATION',
            attributionModel: 'LAST_TOUCH',
            impressions: BigInt(1000),
            clicks: BigInt(50),
            spendMicros: BigInt(5_000_000), // $5
            conversions: 0,
            conversionValue: BigInt(0),
            attributedConversions: 0,
            wasteSpendMicros: BigInt(5_000_000),
            wastePct: 100,
          },
          {
            organizationId: testOrgId,
            date: new Date('2024-01-02'),
            grain: 'ORGANIZATION',
            attributionModel: 'LAST_TOUCH',
            impressions: BigInt(1000),
            clicks: BigInt(50),
            spendMicros: BigInt(500_000_000), // $500
            conversions: 0,
            conversionValue: BigInt(0),
            attributedConversions: 0,
            wasteSpendMicros: BigInt(500_000_000),
            wastePct: 100,
          },
        ],
      });

      // Query waste >= $100
      const significantWaste = await prisma.dailyRollup.findMany({
        where: {
          organizationId: testOrgId,
          wasteSpendMicros: { gte: BigInt(100_000_000) }, // >= $100
        },
      });

      expect(significantWaste.length).toBe(1);
      expect(Number(significantWaste[0].wasteSpendMicros)).toBeGreaterThanOrEqual(100_000_000);
    });
  });

  describe('Waste Summary Statistics', () => {
    it('should calculate summary statistics', async () => {
      const baseDate = new Date('2024-01-01');

      // Create multiple waste rollups
      await prisma.dailyRollup.createMany({
        data: [
          {
            organizationId: testOrgId,
            date: baseDate,
            grain: 'ORGANIZATION',
            attributionModel: 'LAST_TOUCH',
            impressions: BigInt(1000),
            clicks: BigInt(50),
            spendMicros: BigInt(100_000_000), // $100
            conversions: 0,
            conversionValue: BigInt(0),
            attributedConversions: 0,
            wasteSpendMicros: BigInt(100_000_000),
            wastePct: 100,
          },
          {
            organizationId: testOrgId,
            date: new Date('2024-01-02'),
            grain: 'ORGANIZATION',
            attributionModel: 'LAST_TOUCH',
            impressions: BigInt(1000),
            clicks: BigInt(50),
            spendMicros: BigInt(200_000_000), // $200
            conversions: 1,
            conversionValue: BigInt(50_000_000),
            attributedConversions: 1,
            wasteSpendMicros: BigInt(0), // No waste (has conversion)
            wastePct: 0,
          },
          {
            organizationId: testOrgId,
            date: new Date('2024-01-03'),
            grain: 'ORGANIZATION',
            attributionModel: 'LAST_TOUCH',
            impressions: BigInt(1000),
            clicks: BigInt(50),
            spendMicros: BigInt(300_000_000), // $300
            conversions: 0,
            conversionValue: BigInt(0),
            attributedConversions: 0,
            wasteSpendMicros: BigInt(300_000_000),
            wastePct: 100,
          },
        ],
      });

      const wasteRollups = await prisma.dailyRollup.findMany({
        where: {
          organizationId: testOrgId,
          wasteSpendMicros: { gt: BigInt(0) },
        },
      });

      const totalWaste = wasteRollups.reduce(
        (sum, r) => sum + Number(r.wasteSpendMicros),
        0
      ) / 1_000_000;

      const avgWastePct = wasteRollups.reduce(
        (sum, r) => sum + r.wastePct,
        0
      ) / wasteRollups.length;

      expect(wasteRollups.length).toBe(2);
      expect(totalWaste).toBe(400); // $100 + $300
      expect(avgWastePct).toBe(100); // Both are 100% waste
    });
  });
});
