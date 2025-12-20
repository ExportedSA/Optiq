/**
 * Attribution Candidate Creation Tests
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { PrismaClient } from '@prisma/client';
import { generatePublicKey } from '@/lib/tracking/key-generator';
import { createAttributionCandidates, getAttributionCandidates } from '../attribution-candidates';

const prisma = new PrismaClient();

describe('Attribution Candidate Creation', () => {
  const testOrgId = 'test-org-attr-' + Date.now();
  const testSiteId = 'test-site-attr-' + Date.now();
  let publicKey: string;

  beforeEach(async () => {
    // Create test organization
    await prisma.organization.create({
      data: {
        id: testOrgId,
        name: 'Test Org',
        slug: 'test-org-attr-' + Date.now(),
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

  describe('Basic Attribution Candidate Creation', () => {
    it('should create attribution candidates for a conversion with touchpoints', async () => {
      const anonId = 'anon_test_' + Date.now();
      const now = new Date();

      // Create touchpoints (session landings)
      const touchPoint1 = await prisma.touchPoint.create({
        data: {
          siteId: testSiteId,
          anonId,
          sessionId: 'sess_1',
          landingUrl: 'https://example.com/landing?utm_source=google',
          utmSource: 'google',
          platformCode: 'GOOGLE_ADS',
          occurredAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        },
      });

      const touchPoint2 = await prisma.touchPoint.create({
        data: {
          siteId: testSiteId,
          anonId,
          sessionId: 'sess_2',
          landingUrl: 'https://example.com/landing?utm_source=facebook',
          utmSource: 'facebook',
          platformCode: 'META',
          occurredAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        },
      });

      // Create conversion event
      const conversion = await prisma.trackingEvent.create({
        data: {
          siteId: testSiteId,
          eventId: 'evt_conv_' + Date.now(),
          type: 'CONVERSION',
          url: 'https://example.com/checkout',
          path: '/checkout',
          anonId,
          sessionId: 'sess_3',
          valueMicros: BigInt(99990000), // $99.99
          occurredAt: now,
        },
      });

      // Create attribution candidates
      const result = await createAttributionCandidates(conversion.id);

      expect(result.conversionId).toBe(conversion.id);
      expect(result.touchPointsFound).toBe(2);
      expect(result.linksCreated).toBeGreaterThan(0);

      // Verify attribution links were created
      const links = await getAttributionCandidates(conversion.id);
      
      // Should have links for each model (5 models) × 2 touchpoints = 10 links
      expect(links.length).toBe(10);

      // Verify all models are represented
      const models = new Set(links.map(l => l.model));
      expect(models.size).toBe(5);
      expect(models.has('FIRST_TOUCH')).toBe(true);
      expect(models.has('LAST_TOUCH')).toBe(true);
      expect(models.has('LINEAR')).toBe(true);
      expect(models.has('TIME_DECAY')).toBe(true);
      expect(models.has('POSITION_BASED')).toBe(true);

      // Verify positions
      const firstTouchLinks = links.filter(l => l.model === 'FIRST_TOUCH');
      expect(firstTouchLinks[0].position).toBe(1);
      expect(firstTouchLinks[1].position).toBe(2);

      // Verify touchpoint count
      expect(firstTouchLinks[0].touchPointCount).toBe(2);
    });

    it('should respect lookback window', async () => {
      const anonId = 'anon_lookback_' + Date.now();
      const now = new Date();

      // Create touchpoint outside lookback window (31 days ago)
      await prisma.touchPoint.create({
        data: {
          siteId: testSiteId,
          anonId,
          sessionId: 'sess_old',
          landingUrl: 'https://example.com/old',
          utmSource: 'old',
          occurredAt: new Date(now.getTime() - 31 * 24 * 60 * 60 * 1000),
        },
      });

      // Create touchpoint inside lookback window (10 days ago)
      await prisma.touchPoint.create({
        data: {
          siteId: testSiteId,
          anonId,
          sessionId: 'sess_recent',
          landingUrl: 'https://example.com/recent',
          utmSource: 'recent',
          occurredAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
        },
      });

      // Create conversion
      const conversion = await prisma.trackingEvent.create({
        data: {
          siteId: testSiteId,
          eventId: 'evt_lookback_' + Date.now(),
          type: 'CONVERSION',
          url: 'https://example.com/checkout',
          path: '/checkout',
          anonId,
          sessionId: 'sess_conv',
          occurredAt: now,
        },
      });

      // Create attribution candidates with default 30-day lookback
      const result = await createAttributionCandidates(conversion.id, 30);

      // Should only find 1 touchpoint (the recent one)
      expect(result.touchPointsFound).toBe(1);
    });

    it('should handle conversion with no touchpoints', async () => {
      const anonId = 'anon_no_touch_' + Date.now();

      // Create conversion without any touchpoints
      const conversion = await prisma.trackingEvent.create({
        data: {
          siteId: testSiteId,
          eventId: 'evt_no_touch_' + Date.now(),
          type: 'CONVERSION',
          url: 'https://example.com/checkout',
          path: '/checkout',
          anonId,
          sessionId: 'sess_direct',
          occurredAt: new Date(),
        },
      });

      // Create attribution candidates
      const result = await createAttributionCandidates(conversion.id);

      expect(result.touchPointsFound).toBe(0);
      expect(result.linksCreated).toBe(0);

      // Verify no links were created
      const links = await getAttributionCandidates(conversion.id);
      expect(links.length).toBe(0);
    });

    it('should only link touchpoints for the same anonId', async () => {
      const anonId1 = 'anon_1_' + Date.now();
      const anonId2 = 'anon_2_' + Date.now();
      const now = new Date();

      // Create touchpoint for anonId1
      await prisma.touchPoint.create({
        data: {
          siteId: testSiteId,
          anonId: anonId1,
          sessionId: 'sess_1',
          landingUrl: 'https://example.com/landing1',
          utmSource: 'google',
          occurredAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
        },
      });

      // Create touchpoint for anonId2
      await prisma.touchPoint.create({
        data: {
          siteId: testSiteId,
          anonId: anonId2,
          sessionId: 'sess_2',
          landingUrl: 'https://example.com/landing2',
          utmSource: 'facebook',
          occurredAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
        },
      });

      // Create conversion for anonId1
      const conversion = await prisma.trackingEvent.create({
        data: {
          siteId: testSiteId,
          eventId: 'evt_anon1_' + Date.now(),
          type: 'CONVERSION',
          url: 'https://example.com/checkout',
          path: '/checkout',
          anonId: anonId1,
          sessionId: 'sess_conv',
          occurredAt: now,
        },
      });

      // Create attribution candidates
      const result = await createAttributionCandidates(conversion.id);

      // Should only find touchpoint for anonId1
      expect(result.touchPointsFound).toBe(1);

      const links = await getAttributionCandidates(conversion.id);
      const touchPointIds = new Set(links.map(l => l.touchPointId));
      expect(touchPointIds.size).toBe(1);
    });

    it('should be idempotent - not create duplicate links', async () => {
      const anonId = 'anon_idem_' + Date.now();
      const now = new Date();

      // Create touchpoint
      await prisma.touchPoint.create({
        data: {
          siteId: testSiteId,
          anonId,
          sessionId: 'sess_1',
          landingUrl: 'https://example.com/landing',
          utmSource: 'google',
          occurredAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
        },
      });

      // Create conversion
      const conversion = await prisma.trackingEvent.create({
        data: {
          siteId: testSiteId,
          eventId: 'evt_idem_' + Date.now(),
          type: 'CONVERSION',
          url: 'https://example.com/checkout',
          path: '/checkout',
          anonId,
          sessionId: 'sess_conv',
          occurredAt: now,
        },
      });

      // Create attribution candidates first time
      const result1 = await createAttributionCandidates(conversion.id);
      expect(result1.linksCreated).toBeGreaterThan(0);

      // Create attribution candidates second time (should be idempotent)
      const result2 = await createAttributionCandidates(conversion.id);
      expect(result2.linksCreated).toBe(0); // No new links created

      // Verify total links didn't change
      const links = await getAttributionCandidates(conversion.id);
      expect(links.length).toBe(5); // 5 models × 1 touchpoint
    });
  });

  describe('Journey Ordering', () => {
    it('should order touchpoints chronologically', async () => {
      const anonId = 'anon_order_' + Date.now();
      const now = new Date();

      // Create touchpoints in non-chronological order
      const touchPoint2 = await prisma.touchPoint.create({
        data: {
          siteId: testSiteId,
          anonId,
          sessionId: 'sess_2',
          landingUrl: 'https://example.com/landing2',
          utmSource: 'facebook',
          occurredAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        },
      });

      const touchPoint1 = await prisma.touchPoint.create({
        data: {
          siteId: testSiteId,
          anonId,
          sessionId: 'sess_1',
          landingUrl: 'https://example.com/landing1',
          utmSource: 'google',
          occurredAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        },
      });

      const touchPoint3 = await prisma.touchPoint.create({
        data: {
          siteId: testSiteId,
          anonId,
          sessionId: 'sess_3',
          landingUrl: 'https://example.com/landing3',
          utmSource: 'twitter',
          occurredAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        },
      });

      // Create conversion
      const conversion = await prisma.trackingEvent.create({
        data: {
          siteId: testSiteId,
          eventId: 'evt_order_' + Date.now(),
          type: 'CONVERSION',
          url: 'https://example.com/checkout',
          path: '/checkout',
          anonId,
          sessionId: 'sess_conv',
          occurredAt: now,
        },
      });

      // Create attribution candidates
      await createAttributionCandidates(conversion.id);

      // Get links for one model to check ordering
      const links = await getAttributionCandidates(conversion.id);
      const firstTouchLinks = links.filter(l => l.model === 'FIRST_TOUCH');

      // Verify chronological ordering
      expect(firstTouchLinks[0].position).toBe(1);
      expect(firstTouchLinks[0].touchPointId).toBe(touchPoint1.id); // Oldest first

      expect(firstTouchLinks[1].position).toBe(2);
      expect(firstTouchLinks[1].touchPointId).toBe(touchPoint3.id); // Middle

      expect(firstTouchLinks[2].position).toBe(3);
      expect(firstTouchLinks[2].touchPointId).toBe(touchPoint2.id); // Most recent
    });
  });

  describe('Weight Placeholder', () => {
    it('should set weight to 0 as placeholder', async () => {
      const anonId = 'anon_weight_' + Date.now();
      const now = new Date();

      // Create touchpoint
      await prisma.touchPoint.create({
        data: {
          siteId: testSiteId,
          anonId,
          sessionId: 'sess_1',
          landingUrl: 'https://example.com/landing',
          utmSource: 'google',
          occurredAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
        },
      });

      // Create conversion
      const conversion = await prisma.trackingEvent.create({
        data: {
          siteId: testSiteId,
          eventId: 'evt_weight_' + Date.now(),
          type: 'CONVERSION',
          url: 'https://example.com/checkout',
          path: '/checkout',
          anonId,
          sessionId: 'sess_conv',
          occurredAt: now,
        },
      });

      // Create attribution candidates
      await createAttributionCandidates(conversion.id);

      // Verify all weights are 0 (placeholder)
      const links = await getAttributionCandidates(conversion.id);
      links.forEach(link => {
        expect(link.weight).toBe(0);
      });
    });
  });

  describe('Error Handling', () => {
    it('should throw error for non-existent conversion', async () => {
      await expect(
        createAttributionCandidates('non-existent-id')
      ).rejects.toThrow('Conversion event not found');
    });

    it('should throw error for non-CONVERSION event', async () => {
      // Create PAGE_VIEW event
      const pageView = await prisma.trackingEvent.create({
        data: {
          siteId: testSiteId,
          eventId: 'evt_page_' + Date.now(),
          type: 'PAGE_VIEW',
          url: 'https://example.com/page',
          path: '/page',
          anonId: 'anon_test',
          sessionId: 'sess_test',
        },
      });

      await expect(
        createAttributionCandidates(pageView.id)
      ).rejects.toThrow('is not a CONVERSION event');
    });
  });
});
