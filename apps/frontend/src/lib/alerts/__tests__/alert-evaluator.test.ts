/**
 * Alert Evaluator Tests
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { PrismaClient } from '@prisma/client';
import { evaluateCpaSpike, evaluateSpendThreshold } from '../alert-evaluator';

const prisma = new PrismaClient();

describe('Alert Evaluator', () => {
  const testOrgId = 'test-org-alerts-' + Date.now();
  let platformId: string;
  let campaignId: string;

  beforeEach(async () => {
    // Create test organization
    await prisma.organization.create({
      data: {
        id: testOrgId,
        name: 'Test Org Alerts',
        slug: 'test-org-alerts-' + Date.now(),
      },
    });

    // Create organization settings with target CPA
    await prisma.organizationSettings.create({
      data: {
        organizationId: testOrgId,
        trackingSettings: {
          targetCpa: 50.0, // $50 target CPA
        },
      },
    });

    // Create platform
    const platform = await prisma.platform.create({
      data: {
        code: 'META_ADS',
        name: 'Meta Ads',
      },
    });
    platformId = platform.id;

    // Create campaign
    const campaign = await prisma.campaign.create({
      data: {
        organizationId: testOrgId,
        platformId,
        externalId: 'camp_alert_' + Date.now(),
        name: 'Test Campaign',
        status: 'ACTIVE',
      },
    });
    campaignId = campaign.id;
  });

  afterEach(async () => {
    // Cleanup
    await prisma.alertEvent.deleteMany({ where: { organizationId: testOrgId } });
    await prisma.alertRule.deleteMany({ where: { organizationId: testOrgId } });
    await prisma.dailyRollup.deleteMany({ where: { organizationId: testOrgId } });
    await prisma.campaign.deleteMany({ where: { organizationId: testOrgId } });
    await prisma.platform.delete({ where: { id: platformId } });
    await prisma.organizationSettings.delete({ where: { organizationId: testOrgId } });
    await prisma.organization.delete({ where: { id: testOrgId } });
  });

  describe('CPA Spike Alerts', () => {
    it('should trigger CRITICAL alert when CPA is >100% above target', async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Create rollup with CPA 2x target ($100 vs $50 target)
      await prisma.dailyRollup.create({
        data: {
          organizationId: testOrgId,
          date: today,
          grain: 'CAMPAIGN',
          campaignId,
          platformId,
          attributionModel: 'LAST_TOUCH',
          impressions: BigInt(10000),
          clicks: BigInt(500),
          spendMicros: BigInt(200_000_000), // $200
          conversions: 2.0,
          conversionValue: BigInt(100_000_000),
          cpa: 100.0, // $100 CPA (100% above $50 target)
          roas: 0.5,
          wasteSpendMicros: BigInt(0),
          wastePct: 0,
        },
      });

      const alertsTriggered = await evaluateCpaSpike(testOrgId, {
        from: today,
        to: today,
      });

      expect(alertsTriggered).toBe(1);

      // Verify alert was created
      const alert = await prisma.alertEvent.findFirst({
        where: {
          organizationId: testOrgId,
        },
      });

      expect(alert).toBeDefined();
      expect(alert?.severity).toBe('CRITICAL');
      expect(alert?.title).toContain('CPA Spike');
      expect(alert?.message).toContain('100%');
    });

    it('should trigger WARNING alert when CPA is >50% above target', async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Create rollup with CPA 1.6x target ($80 vs $50 target)
      await prisma.dailyRollup.create({
        data: {
          organizationId: testOrgId,
          date: today,
          grain: 'CAMPAIGN',
          campaignId,
          platformId,
          attributionModel: 'LAST_TOUCH',
          impressions: BigInt(10000),
          clicks: BigInt(500),
          spendMicros: BigInt(160_000_000), // $160
          conversions: 2.0,
          conversionValue: BigInt(100_000_000),
          cpa: 80.0, // $80 CPA (60% above $50 target)
          roas: 0.625,
          wasteSpendMicros: BigInt(0),
          wastePct: 0,
        },
      });

      const alertsTriggered = await evaluateCpaSpike(testOrgId, {
        from: today,
        to: today,
      });

      expect(alertsTriggered).toBe(1);

      const alert = await prisma.alertEvent.findFirst({
        where: { organizationId: testOrgId },
      });

      expect(alert?.severity).toBe('WARNING');
    });

    it('should trigger INFO alert when CPA is >25% above target', async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Create rollup with CPA 1.3x target ($65 vs $50 target)
      await prisma.dailyRollup.create({
        data: {
          organizationId: testOrgId,
          date: today,
          grain: 'CAMPAIGN',
          campaignId,
          platformId,
          attributionModel: 'LAST_TOUCH',
          impressions: BigInt(10000),
          clicks: BigInt(500),
          spendMicros: BigInt(130_000_000), // $130
          conversions: 2.0,
          conversionValue: BigInt(100_000_000),
          cpa: 65.0, // $65 CPA (30% above $50 target)
          roas: 0.77,
          wasteSpendMicros: BigInt(0),
          wastePct: 0,
        },
      });

      const alertsTriggered = await evaluateCpaSpike(testOrgId, {
        from: today,
        to: today,
      });

      expect(alertsTriggered).toBe(1);

      const alert = await prisma.alertEvent.findFirst({
        where: { organizationId: testOrgId },
      });

      expect(alert?.severity).toBe('INFO');
    });

    it('should not trigger alert when CPA is below threshold', async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Create rollup with CPA within target
      await prisma.dailyRollup.create({
        data: {
          organizationId: testOrgId,
          date: today,
          grain: 'CAMPAIGN',
          campaignId,
          platformId,
          attributionModel: 'LAST_TOUCH',
          impressions: BigInt(10000),
          clicks: BigInt(500),
          spendMicros: BigInt(100_000_000), // $100
          conversions: 2.0,
          conversionValue: BigInt(200_000_000),
          cpa: 50.0, // $50 CPA (at target)
          roas: 2.0,
          wasteSpendMicros: BigInt(0),
          wastePct: 0,
        },
      });

      const alertsTriggered = await evaluateCpaSpike(testOrgId, {
        from: today,
        to: today,
      });

      expect(alertsTriggered).toBe(0);
    });

    it('should deduplicate alerts within 24 hours', async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Create rollup
      await prisma.dailyRollup.create({
        data: {
          organizationId: testOrgId,
          date: today,
          grain: 'CAMPAIGN',
          campaignId,
          platformId,
          attributionModel: 'LAST_TOUCH',
          impressions: BigInt(10000),
          clicks: BigInt(500),
          spendMicros: BigInt(200_000_000),
          conversions: 2.0,
          conversionValue: BigInt(100_000_000),
          cpa: 100.0,
          roas: 0.5,
          wasteSpendMicros: BigInt(0),
          wastePct: 0,
        },
      });

      // First evaluation
      const firstRun = await evaluateCpaSpike(testOrgId, {
        from: today,
        to: today,
      });

      expect(firstRun).toBe(1);

      // Second evaluation (should be deduplicated)
      const secondRun = await evaluateCpaSpike(testOrgId, {
        from: today,
        to: today,
      });

      expect(secondRun).toBe(0);

      // Should only have one alert
      const alertCount = await prisma.alertEvent.count({
        where: { organizationId: testOrgId },
      });

      expect(alertCount).toBe(1);
    });
  });

  describe('Spend Threshold Alerts', () => {
    it('should trigger CRITICAL alert when spend >$1000 with no conversions', async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Create rollup with high spend, no conversions
      await prisma.dailyRollup.create({
        data: {
          organizationId: testOrgId,
          date: today,
          grain: 'CAMPAIGN',
          campaignId,
          platformId,
          attributionModel: 'LAST_TOUCH',
          impressions: BigInt(50000),
          clicks: BigInt(2500),
          spendMicros: BigInt(1500_000_000), // $1500
          conversions: 0,
          conversionValue: BigInt(0),
          cpa: null,
          roas: null,
          wasteSpendMicros: BigInt(1500_000_000),
          wastePct: 100,
        },
      });

      const alertsTriggered = await evaluateSpendThreshold(testOrgId, {
        from: today,
        to: today,
      });

      expect(alertsTriggered).toBe(1);

      const alert = await prisma.alertEvent.findFirst({
        where: { organizationId: testOrgId },
      });

      expect(alert?.severity).toBe('CRITICAL');
      expect(alert?.title).toContain('Wasted Spend');
      expect(alert?.message).toContain('$1500.00');
      expect(alert?.message).toContain('zero conversions');
    });

    it('should trigger WARNING alert when spend >$500 with no conversions', async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      await prisma.dailyRollup.create({
        data: {
          organizationId: testOrgId,
          date: today,
          grain: 'CAMPAIGN',
          campaignId,
          platformId,
          attributionModel: 'LAST_TOUCH',
          impressions: BigInt(25000),
          clicks: BigInt(1250),
          spendMicros: BigInt(750_000_000), // $750
          conversions: 0,
          conversionValue: BigInt(0),
          cpa: null,
          roas: null,
          wasteSpendMicros: BigInt(750_000_000),
          wastePct: 100,
        },
      });

      const alertsTriggered = await evaluateSpendThreshold(testOrgId, {
        from: today,
        to: today,
      });

      expect(alertsTriggered).toBe(1);

      const alert = await prisma.alertEvent.findFirst({
        where: { organizationId: testOrgId },
      });

      expect(alert?.severity).toBe('WARNING');
    });

    it('should trigger INFO alert when spend >$100 with no conversions', async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      await prisma.dailyRollup.create({
        data: {
          organizationId: testOrgId,
          date: today,
          grain: 'CAMPAIGN',
          campaignId,
          platformId,
          attributionModel: 'LAST_TOUCH',
          impressions: BigInt(5000),
          clicks: BigInt(250),
          spendMicros: BigInt(150_000_000), // $150
          conversions: 0,
          conversionValue: BigInt(0),
          cpa: null,
          roas: null,
          wasteSpendMicros: BigInt(150_000_000),
          wastePct: 100,
        },
      });

      const alertsTriggered = await evaluateSpendThreshold(testOrgId, {
        from: today,
        to: today,
      });

      expect(alertsTriggered).toBe(1);

      const alert = await prisma.alertEvent.findFirst({
        where: { organizationId: testOrgId },
      });

      expect(alert?.severity).toBe('INFO');
    });

    it('should not trigger alert when spend is below threshold', async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      await prisma.dailyRollup.create({
        data: {
          organizationId: testOrgId,
          date: today,
          grain: 'CAMPAIGN',
          campaignId,
          platformId,
          attributionModel: 'LAST_TOUCH',
          impressions: BigInt(1000),
          clicks: BigInt(50),
          spendMicros: BigInt(50_000_000), // $50
          conversions: 0,
          conversionValue: BigInt(0),
          cpa: null,
          roas: null,
          wasteSpendMicros: BigInt(50_000_000),
          wastePct: 100,
        },
      });

      const alertsTriggered = await evaluateSpendThreshold(testOrgId, {
        from: today,
        to: today,
      });

      expect(alertsTriggered).toBe(0);
    });

    it('should not trigger alert when there are conversions', async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      await prisma.dailyRollup.create({
        data: {
          organizationId: testOrgId,
          date: today,
          grain: 'CAMPAIGN',
          campaignId,
          platformId,
          attributionModel: 'LAST_TOUCH',
          impressions: BigInt(50000),
          clicks: BigInt(2500),
          spendMicros: BigInt(1500_000_000), // $1500
          conversions: 10,
          conversionValue: BigInt(3000_000_000),
          cpa: 150.0,
          roas: 2.0,
          wasteSpendMicros: BigInt(0),
          wastePct: 0,
        },
      });

      const alertsTriggered = await evaluateSpendThreshold(testOrgId, {
        from: today,
        to: today,
      });

      expect(alertsTriggered).toBe(0);
    });
  });
});
