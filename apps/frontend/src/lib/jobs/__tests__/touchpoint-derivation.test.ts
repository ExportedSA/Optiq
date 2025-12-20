/**
 * TouchPoint Derivation Tests
 * 
 * Tests for the TouchPoint derivation job
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { PrismaClient } from '@prisma/client';
import { runTouchPointDerivation, getTouchPointStats, rebuildTouchPoints } from '../touchpoint-derivation';

const prisma = new PrismaClient();

describe('TouchPoint Derivation', () => {
  const testOrgId = 'test-org-' + Date.now();
  const testSiteId = 'test-site-' + Date.now();

  beforeEach(async () => {
    // Create test organization
    await prisma.organization.create({
      data: {
        id: testOrgId,
        name: 'Test Org',
        slug: 'test-org-' + Date.now(),
      },
    });

    // Create test tracking site
    await prisma.trackingSite.create({
      data: {
        id: testSiteId,
        organizationId: testOrgId,
        name: 'Test Site',
        domain: 'example.com',
        publicKey: 'pk_test_' + Date.now(),
      },
    });
  });

  afterEach(async () => {
    // Cleanup
    await prisma.touchPoint.deleteMany({ where: { siteId: testSiteId } });
    await prisma.trackingEvent.deleteMany({ where: { siteId: testSiteId } });
    await prisma.trackingSite.delete({ where: { id: testSiteId } });
    await prisma.organization.delete({ where: { id: testOrgId } });
  });

  it('should create TouchPoint from PAGE_VIEW with UTM parameters', async () => {
    // Create PAGE_VIEW event with UTMs
    await prisma.trackingEvent.create({
      data: {
        siteId: testSiteId,
        eventId: 'evt_1',
        type: 'PAGE_VIEW',
        url: 'https://example.com/landing?utm_source=google&utm_medium=cpc&utm_campaign=summer_sale',
        path: '/landing',
        anonId: 'anon_123',
        sessionId: 'sess_123',
        utmSource: 'google',
        utmMedium: 'cpc',
        utmCampaign: 'summer_sale',
      },
    });

    // Run derivation
    const result = await runTouchPointDerivation({ siteId: testSiteId });

    expect(result.eventsProcessed).toBe(1);
    expect(result.touchPointsCreated).toBe(1);
    expect(result.touchPointsSkipped).toBe(0);

    // Verify TouchPoint was created
    const touchPoint = await prisma.touchPoint.findFirst({
      where: { siteId: testSiteId },
    });

    expect(touchPoint).toBeDefined();
    expect(touchPoint?.utmSource).toBe('google');
    expect(touchPoint?.utmMedium).toBe('cpc');
    expect(touchPoint?.utmCampaign).toBe('summer_sale');
    expect(touchPoint?.sessionId).toBe('sess_123');
  });

  it('should create TouchPoint from PAGE_VIEW with Google click ID', async () => {
    await prisma.trackingEvent.create({
      data: {
        siteId: testSiteId,
        eventId: 'evt_2',
        type: 'PAGE_VIEW',
        url: 'https://example.com/landing?gclid=abc123xyz',
        path: '/landing',
        anonId: 'anon_456',
        sessionId: 'sess_456',
      },
    });

    const result = await runTouchPointDerivation({ siteId: testSiteId });

    expect(result.touchPointsCreated).toBe(1);

    const touchPoint = await prisma.touchPoint.findFirst({
      where: { siteId: testSiteId },
    });

    expect(touchPoint?.gclid).toBe('abc123xyz');
    expect(touchPoint?.platformCode).toBe('GOOGLE_ADS');
  });

  it('should create TouchPoint from PAGE_VIEW with Meta click ID', async () => {
    await prisma.trackingEvent.create({
      data: {
        siteId: testSiteId,
        eventId: 'evt_3',
        type: 'PAGE_VIEW',
        url: 'https://example.com/landing?fbclid=meta456',
        path: '/landing',
        anonId: 'anon_789',
        sessionId: 'sess_789',
      },
    });

    const result = await runTouchPointDerivation({ siteId: testSiteId });

    expect(result.touchPointsCreated).toBe(1);

    const touchPoint = await prisma.touchPoint.findFirst({
      where: { siteId: testSiteId },
    });

    expect(touchPoint?.fbclid).toBe('meta456');
    expect(touchPoint?.platformCode).toBe('META');
  });

  it('should skip PAGE_VIEW without UTMs or click IDs', async () => {
    // Regular page view without marketing parameters
    await prisma.trackingEvent.create({
      data: {
        siteId: testSiteId,
        eventId: 'evt_4',
        type: 'PAGE_VIEW',
        url: 'https://example.com/about',
        path: '/about',
        anonId: 'anon_999',
        sessionId: 'sess_999',
      },
    });

    const result = await runTouchPointDerivation({ siteId: testSiteId });

    expect(result.eventsProcessed).toBe(1);
    expect(result.touchPointsCreated).toBe(0);
    expect(result.touchPointsSkipped).toBe(1);

    const touchPointCount = await prisma.touchPoint.count({
      where: { siteId: testSiteId },
    });

    expect(touchPointCount).toBe(0);
  });

  it('should be idempotent - skip duplicate TouchPoints', async () => {
    const eventData = {
      siteId: testSiteId,
      eventId: 'evt_5',
      type: 'PAGE_VIEW' as const,
      url: 'https://example.com/landing?utm_source=google',
      path: '/landing',
      anonId: 'anon_111',
      sessionId: 'sess_111',
      utmSource: 'google',
    };

    await prisma.trackingEvent.create({ data: eventData });

    // Run derivation first time
    const result1 = await runTouchPointDerivation({ siteId: testSiteId });
    expect(result1.touchPointsCreated).toBe(1);

    // Run derivation second time (should skip)
    const result2 = await runTouchPointDerivation({ siteId: testSiteId });
    expect(result2.touchPointsCreated).toBe(0);
    expect(result2.touchPointsSkipped).toBe(1);

    // Verify only one TouchPoint exists
    const touchPointCount = await prisma.touchPoint.count({
      where: { siteId: testSiteId },
    });
    expect(touchPointCount).toBe(1);
  });

  it('should enforce unique constraint on siteId+sessionId+landingUrl', async () => {
    // Create TouchPoint directly
    await prisma.touchPoint.create({
      data: {
        siteId: testSiteId,
        anonId: 'anon_222',
        sessionId: 'sess_222',
        landingUrl: 'https://example.com/landing',
        utmSource: 'google',
      },
    });

    // Try to create duplicate
    await expect(
      prisma.touchPoint.create({
        data: {
          siteId: testSiteId,
          anonId: 'anon_333', // Different anonId
          sessionId: 'sess_222', // Same session
          landingUrl: 'https://example.com/landing', // Same landing URL
          utmSource: 'facebook',
        },
      })
    ).rejects.toThrow(/Unique constraint/);
  });

  it('should enforce unique constraint on siteId+gclid', async () => {
    await prisma.touchPoint.create({
      data: {
        siteId: testSiteId,
        anonId: 'anon_444',
        sessionId: 'sess_444',
        gclid: 'unique_gclid_123',
        platformCode: 'GOOGLE_ADS',
      },
    });

    // Try to create duplicate with same gclid
    await expect(
      prisma.touchPoint.create({
        data: {
          siteId: testSiteId,
          anonId: 'anon_555',
          sessionId: 'sess_555',
          gclid: 'unique_gclid_123', // Same gclid
          platformCode: 'GOOGLE_ADS',
        },
      })
    ).rejects.toThrow(/Unique constraint/);
  });

  it('should get TouchPoint stats correctly', async () => {
    // Create events with different characteristics
    await prisma.trackingEvent.createMany({
      data: [
        {
          siteId: testSiteId,
          eventId: 'evt_stat_1',
          type: 'PAGE_VIEW',
          url: 'https://example.com/1?gclid=g1',
          path: '/1',
          anonId: 'anon_s1',
          sessionId: 'sess_s1',
        },
        {
          siteId: testSiteId,
          eventId: 'evt_stat_2',
          type: 'PAGE_VIEW',
          url: 'https://example.com/2?utm_source=google',
          path: '/2',
          anonId: 'anon_s2',
          sessionId: 'sess_s2',
          utmSource: 'google',
        },
        {
          siteId: testSiteId,
          eventId: 'evt_stat_3',
          type: 'PAGE_VIEW',
          url: 'https://example.com/3',
          path: '/3',
          anonId: 'anon_s3',
          sessionId: 'sess_s3',
        },
      ],
    });

    await runTouchPointDerivation({ siteId: testSiteId });

    const stats = await getTouchPointStats(testSiteId);

    expect(stats.totalEvents).toBe(3);
    expect(stats.totalTouchPoints).toBe(2); // Only 2 have marketing params
    expect(stats.touchPointsWithClickIds).toBe(1);
    expect(stats.touchPointsWithUTMs).toBe(1);
  });

  it('should rebuild TouchPoints for a date range', async () => {
    const startDate = new Date('2024-01-01');
    const endDate = new Date('2024-01-02');

    // Create events
    await prisma.trackingEvent.createMany({
      data: [
        {
          siteId: testSiteId,
          eventId: 'evt_rebuild_1',
          type: 'PAGE_VIEW',
          url: 'https://example.com/1?utm_source=google',
          path: '/1',
          anonId: 'anon_r1',
          sessionId: 'sess_r1',
          utmSource: 'google',
          occurredAt: new Date('2024-01-01T10:00:00Z'),
        },
        {
          siteId: testSiteId,
          eventId: 'evt_rebuild_2',
          type: 'PAGE_VIEW',
          url: 'https://example.com/2?utm_source=facebook',
          path: '/2',
          anonId: 'anon_r2',
          sessionId: 'sess_r2',
          utmSource: 'facebook',
          occurredAt: new Date('2024-01-01T11:00:00Z'),
        },
      ],
    });

    // First derivation
    await runTouchPointDerivation({ siteId: testSiteId, startDate, endDate });
    
    const countBefore = await prisma.touchPoint.count({ where: { siteId: testSiteId } });
    expect(countBefore).toBe(2);

    // Rebuild
    const result = await rebuildTouchPoints({ siteId: testSiteId, startDate, endDate });
    
    expect(result.touchPointsCreated).toBe(2);

    const countAfter = await prisma.touchPoint.count({ where: { siteId: testSiteId } });
    expect(countAfter).toBe(2);
  });

  it('should handle multiple click IDs in same URL', async () => {
    await prisma.trackingEvent.create({
      data: {
        siteId: testSiteId,
        eventId: 'evt_multi',
        type: 'PAGE_VIEW',
        url: 'https://example.com/landing?gclid=g123&fbclid=f456&utm_source=google',
        path: '/landing',
        anonId: 'anon_multi',
        sessionId: 'sess_multi',
        utmSource: 'google',
      },
    });

    const result = await runTouchPointDerivation({ siteId: testSiteId });
    expect(result.touchPointsCreated).toBe(1);

    const touchPoint = await prisma.touchPoint.findFirst({
      where: { siteId: testSiteId },
    });

    // Should capture all click IDs
    expect(touchPoint?.gclid).toBe('g123');
    expect(touchPoint?.fbclid).toBe('f456');
    // Platform should be inferred from first click ID (gclid)
    expect(touchPoint?.platformCode).toBe('GOOGLE_ADS');
  });
});
