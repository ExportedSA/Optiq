/**
 * Daily Rollups Job Tests
 * 
 * Tests for the daily rollups aggregation job, including grain validation
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { PrismaClient, RollupGrain } from '@prisma/client';

const prisma = new PrismaClient();

describe('Daily Rollups - Grain Validation', () => {
  const testOrgId = 'test-org-' + Date.now();
  const testDate = new Date('2024-01-01');

  beforeEach(async () => {
    // Create test organization
    await prisma.organization.create({
      data: {
        id: testOrgId,
        name: 'Test Org',
        slug: 'test-org-' + Date.now(),
      },
    });
  });

  afterEach(async () => {
    // Cleanup
    await prisma.dailyRollup.deleteMany({ where: { organizationId: testOrgId } });
    await prisma.organization.delete({ where: { id: testOrgId } });
  });

  it('should accept valid RollupGrain enum values', async () => {
    const validGrains: RollupGrain[] = [
      'ORGANIZATION',
      'PLATFORM',
      'CAMPAIGN',
      'ADSET',
      'AD',
    ];

    for (const grain of validGrains) {
      const rollup = await prisma.dailyRollup.create({
        data: {
          organizationId: testOrgId,
          date: testDate,
          grain,
          attributionModel: 'LAST_TOUCH',
          impressions: BigInt(1000),
          clicks: BigInt(100),
          spendMicros: BigInt(50000000),
          conversions: 10,
          conversionValue: BigInt(100000000),
        },
      });

      expect(rollup.grain).toBe(grain);
    }
  });

  it('should reject invalid grain values at type level', () => {
    // This test validates TypeScript type checking
    // @ts-expect-error - Invalid grain value should not compile
    const invalidGrain: RollupGrain = 'invalid_grain';

    // If TypeScript allows this, the test fails
    expect(invalidGrain).toBeDefined();
  });

  it('should enforce grain uniqueness in composite unique constraint', async () => {
    // Create first rollup
    await prisma.dailyRollup.create({
      data: {
        organizationId: testOrgId,
        date: testDate,
        grain: 'ORGANIZATION',
        attributionModel: 'LAST_TOUCH',
        impressions: BigInt(1000),
        clicks: BigInt(100),
        spendMicros: BigInt(50000000),
      },
    });

    // Attempt to create duplicate with same grain
    await expect(
      prisma.dailyRollup.create({
        data: {
          organizationId: testOrgId,
          date: testDate,
          grain: 'ORGANIZATION',
          attributionModel: 'LAST_TOUCH',
          impressions: BigInt(2000),
          clicks: BigInt(200),
          spendMicros: BigInt(100000000),
        },
      })
    ).rejects.toThrow(/Unique constraint/);
  });

  it('should allow different grains for same org/date', async () => {
    const grains: RollupGrain[] = ['ORGANIZATION', 'PLATFORM', 'CAMPAIGN'];

    for (const grain of grains) {
      const rollup = await prisma.dailyRollup.create({
        data: {
          organizationId: testOrgId,
          date: testDate,
          grain,
          attributionModel: 'LAST_TOUCH',
          impressions: BigInt(1000),
          clicks: BigInt(100),
          spendMicros: BigInt(50000000),
        },
      });

      expect(rollup.grain).toBe(grain);
    }

    // Verify all three were created
    const rollups = await prisma.dailyRollup.findMany({
      where: { organizationId: testOrgId, date: testDate },
    });

    expect(rollups).toHaveLength(3);
    expect(rollups.map(r => r.grain).sort()).toEqual(['CAMPAIGN', 'ORGANIZATION', 'PLATFORM']);
  });

  it('should query rollups by grain efficiently', async () => {
    // Create rollups at different grains
    await prisma.dailyRollup.createMany({
      data: [
        {
          organizationId: testOrgId,
          date: testDate,
          grain: 'ORGANIZATION',
          attributionModel: 'LAST_TOUCH',
          impressions: BigInt(5000),
          clicks: BigInt(500),
          spendMicros: BigInt(250000000),
        },
        {
          organizationId: testOrgId,
          date: testDate,
          grain: 'CAMPAIGN',
          attributionModel: 'LAST_TOUCH',
          impressions: BigInt(3000),
          clicks: BigInt(300),
          spendMicros: BigInt(150000000),
        },
        {
          organizationId: testOrgId,
          date: testDate,
          grain: 'PLATFORM',
          attributionModel: 'LAST_TOUCH',
          impressions: BigInt(4000),
          clicks: BigInt(400),
          spendMicros: BigInt(200000000),
        },
      ],
    });

    // Query only organization-level rollups
    const orgRollups = await prisma.dailyRollup.findMany({
      where: {
        organizationId: testOrgId,
        grain: 'ORGANIZATION',
      },
    });

    expect(orgRollups).toHaveLength(1);
    expect(orgRollups[0].grain).toBe('ORGANIZATION');
    expect(Number(orgRollups[0].impressions)).toBe(5000);

    // Query only campaign-level rollups
    const campaignRollups = await prisma.dailyRollup.findMany({
      where: {
        organizationId: testOrgId,
        grain: 'CAMPAIGN',
      },
    });

    expect(campaignRollups).toHaveLength(1);
    expect(campaignRollups[0].grain).toBe('CAMPAIGN');
  });

  it('should use grain in index for efficient queries', async () => {
    // Create multiple rollups across different dates and grains
    const dates = [
      new Date('2024-01-01'),
      new Date('2024-01-02'),
      new Date('2024-01-03'),
    ];

    for (const date of dates) {
      await prisma.dailyRollup.createMany({
        data: [
          {
            organizationId: testOrgId,
            date,
            grain: 'ORGANIZATION',
            attributionModel: 'LAST_TOUCH',
            impressions: BigInt(1000),
            clicks: BigInt(100),
            spendMicros: BigInt(50000000),
          },
          {
            organizationId: testOrgId,
            date,
            grain: 'CAMPAIGN',
            attributionModel: 'LAST_TOUCH',
            impressions: BigInt(500),
            clicks: BigInt(50),
            spendMicros: BigInt(25000000),
          },
        ],
      });
    }

    // Query using indexed fields (date + grain)
    const result = await prisma.dailyRollup.findMany({
      where: {
        date: { gte: new Date('2024-01-01'), lte: new Date('2024-01-03') },
        grain: 'ORGANIZATION',
      },
    });

    expect(result).toHaveLength(3);
    expect(result.every(r => r.grain === 'ORGANIZATION')).toBe(true);
  });
});

describe('Daily Rollups - Grain-Specific Logic', () => {
  it('should validate ORGANIZATION grain has no platform/campaign IDs', async () => {
    const testOrgId = 'test-org-grain-' + Date.now();
    
    await prisma.organization.create({
      data: {
        id: testOrgId,
        name: 'Test Org',
        slug: 'test-org-grain-' + Date.now(),
      },
    });

    // ORGANIZATION grain should have null platform/campaign IDs
    const orgRollup = await prisma.dailyRollup.create({
      data: {
        organizationId: testOrgId,
        date: new Date('2024-01-01'),
        grain: 'ORGANIZATION',
        platformId: null,
        campaignId: null,
        attributionModel: 'LAST_TOUCH',
        impressions: BigInt(1000),
        clicks: BigInt(100),
        spendMicros: BigInt(50000000),
      },
    });

    expect(orgRollup.grain).toBe('ORGANIZATION');
    expect(orgRollup.platformId).toBeNull();
    expect(orgRollup.campaignId).toBeNull();

    // Cleanup
    await prisma.dailyRollup.delete({ where: { id: orgRollup.id } });
    await prisma.organization.delete({ where: { id: testOrgId } });
  });

  it('should validate CAMPAIGN grain has campaign ID', async () => {
    const testOrgId = 'test-org-campaign-' + Date.now();
    
    await prisma.organization.create({
      data: {
        id: testOrgId,
        name: 'Test Org',
        slug: 'test-org-campaign-' + Date.now(),
      },
    });

    const platform = await prisma.platform.create({
      data: {
        code: 'GOOGLE_ADS',
        name: 'Google Ads',
      },
    });

    const campaign = await prisma.campaign.create({
      data: {
        organizationId: testOrgId,
        platformId: platform.id,
        externalId: 'camp-123',
        name: 'Test Campaign',
        status: 'ACTIVE',
      },
    });

    // CAMPAIGN grain should have campaign ID
    const campaignRollup = await prisma.dailyRollup.create({
      data: {
        organizationId: testOrgId,
        date: new Date('2024-01-01'),
        grain: 'CAMPAIGN',
        platformId: platform.id,
        campaignId: campaign.id,
        attributionModel: 'LAST_TOUCH',
        impressions: BigInt(1000),
        clicks: BigInt(100),
        spendMicros: BigInt(50000000),
      },
    });

    expect(campaignRollup.grain).toBe('CAMPAIGN');
    expect(campaignRollup.campaignId).toBe(campaign.id);

    // Cleanup
    await prisma.dailyRollup.delete({ where: { id: campaignRollup.id } });
    await prisma.campaign.delete({ where: { id: campaign.id } });
    await prisma.platform.delete({ where: { id: platform.id } });
    await prisma.organization.delete({ where: { id: testOrgId } });
  });
});
