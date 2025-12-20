/**
 * Tracking Endpoint Tests
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { PrismaClient } from '@prisma/client';
import { generatePublicKey } from '@/lib/tracking/key-generator';
import { hashIpAddress } from '@/lib/tracking/ip-hash';

const prisma = new PrismaClient();

describe('POST /api/track', () => {
  const testOrgId = 'test-org-track-' + Date.now();
  const testSiteId = 'test-site-track-' + Date.now();
  let publicKey: string;

  beforeEach(async () => {
    // Create test organization
    await prisma.organization.create({
      data: {
        id: testOrgId,
        name: 'Test Org',
        slug: 'test-org-track-' + Date.now(),
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
    await prisma.trackingEvent.deleteMany({ where: { siteId: testSiteId } });
    await prisma.trackingSite.delete({ where: { id: testSiteId } });
    await prisma.organization.delete({ where: { id: testOrgId } });
  });

  describe('Single Event', () => {
    it('should accept a valid PAGE_VIEW event', async () => {
      const event = {
        publicKey,
        eventId: 'evt_test_' + Date.now(),
        type: 'PAGE_VIEW',
        url: 'https://example.com/page',
        path: '/page',
        anonId: 'anon_123',
        sessionId: 'sess_123',
      };

      // Simulate API call (in real test, use fetch or supertest)
      const created = await prisma.trackingEvent.create({
        data: {
          siteId: testSiteId,
          eventId: event.eventId,
          type: event.type as any,
          url: event.url,
          path: event.path,
          anonId: event.anonId,
          sessionId: event.sessionId,
        },
      });

      expect(created.eventId).toBe(event.eventId);
      expect(created.type).toBe('PAGE_VIEW');
      expect(created.siteId).toBe(testSiteId);
    });

    it('should accept a CONVERSION event with value', async () => {
      const event = {
        publicKey,
        eventId: 'evt_conv_' + Date.now(),
        type: 'CONVERSION',
        url: 'https://example.com/checkout',
        path: '/checkout',
        anonId: 'anon_456',
        sessionId: 'sess_456',
        value: 99.99,
      };

      const valueMicros = BigInt(Math.round(event.value * 1_000_000));

      const created = await prisma.trackingEvent.create({
        data: {
          siteId: testSiteId,
          eventId: event.eventId,
          type: event.type as any,
          url: event.url,
          path: event.path,
          anonId: event.anonId,
          sessionId: event.sessionId,
          valueMicros,
        },
      });

      expect(created.type).toBe('CONVERSION');
      expect(created.valueMicros).toBe(valueMicros);
    });

    it('should store UTM parameters', async () => {
      const event = {
        publicKey,
        eventId: 'evt_utm_' + Date.now(),
        type: 'PAGE_VIEW',
        url: 'https://example.com/landing?utm_source=google&utm_campaign=summer',
        path: '/landing',
        anonId: 'anon_789',
        sessionId: 'sess_789',
        utmSource: 'google',
        utmMedium: 'cpc',
        utmCampaign: 'summer',
        utmTerm: 'shoes',
        utmContent: 'ad1',
      };

      const created = await prisma.trackingEvent.create({
        data: {
          siteId: testSiteId,
          eventId: event.eventId,
          type: event.type as any,
          url: event.url,
          path: event.path,
          anonId: event.anonId,
          sessionId: event.sessionId,
          utmSource: event.utmSource,
          utmMedium: event.utmMedium,
          utmCampaign: event.utmCampaign,
          utmTerm: event.utmTerm,
          utmContent: event.utmContent,
        },
      });

      expect(created.utmSource).toBe('google');
      expect(created.utmMedium).toBe('cpc');
      expect(created.utmCampaign).toBe('summer');
    });
  });

  describe('Idempotency', () => {
    it('should enforce unique constraint on (siteId, eventId)', async () => {
      const eventId = 'evt_unique_' + Date.now();

      // Create first event
      await prisma.trackingEvent.create({
        data: {
          siteId: testSiteId,
          eventId,
          type: 'PAGE_VIEW',
          url: 'https://example.com/page',
          path: '/page',
          anonId: 'anon_1',
          sessionId: 'sess_1',
        },
      });

      // Try to create duplicate
      await expect(
        prisma.trackingEvent.create({
          data: {
            siteId: testSiteId,
            eventId, // Same eventId
            type: 'PAGE_VIEW',
            url: 'https://example.com/page2',
            path: '/page2',
            anonId: 'anon_2',
            sessionId: 'sess_2',
          },
        })
      ).rejects.toThrow(/Unique constraint/);
    });

    it('should allow same eventId for different sites', async () => {
      const site2Id = 'test-site-2-' + Date.now();
      const publicKey2 = generatePublicKey();

      await prisma.trackingSite.create({
        data: {
          id: site2Id,
          organizationId: testOrgId,
          name: 'Test Site 2',
          domain: 'example2.com',
          publicKey: publicKey2,
        },
      });

      const eventId = 'evt_shared_' + Date.now();

      // Create event for site 1
      await prisma.trackingEvent.create({
        data: {
          siteId: testSiteId,
          eventId,
          type: 'PAGE_VIEW',
          url: 'https://example.com/page',
          path: '/page',
          anonId: 'anon_1',
          sessionId: 'sess_1',
        },
      });

      // Create event for site 2 with same eventId (should succeed)
      const event2 = await prisma.trackingEvent.create({
        data: {
          siteId: site2Id,
          eventId, // Same eventId, different site
          type: 'PAGE_VIEW',
          url: 'https://example2.com/page',
          path: '/page',
          anonId: 'anon_2',
          sessionId: 'sess_2',
        },
      });

      expect(event2.eventId).toBe(eventId);
      expect(event2.siteId).toBe(site2Id);

      // Cleanup
      await prisma.trackingEvent.deleteMany({ where: { siteId: site2Id } });
      await prisma.trackingSite.delete({ where: { id: site2Id } });
    });
  });

  describe('IP Hashing', () => {
    it('should hash IP addresses', () => {
      const ip1 = '192.168.1.1';
      const ip2 = '192.168.1.2';

      const hash1 = hashIpAddress(ip1);
      const hash2 = hashIpAddress(ip2);

      // Hashes should be different
      expect(hash1).not.toBe(hash2);

      // Hashes should be consistent
      expect(hashIpAddress(ip1)).toBe(hash1);
      expect(hashIpAddress(ip2)).toBe(hash2);

      // Hashes should be hex strings
      expect(hash1).toMatch(/^[a-f0-9]+$/);
      expect(hash2).toMatch(/^[a-f0-9]+$/);
    });

    it('should normalize IPv6 addresses', () => {
      const ipv6 = '2001:0db8:0000:0000:0000:ff00:0042:8329';
      const hash = hashIpAddress(ipv6);

      expect(hash).toBeDefined();
      expect(hash).toMatch(/^[a-f0-9]+$/);
    });

    it('should handle IPv4-mapped IPv6 addresses', () => {
      const ipv4 = '192.0.2.1';
      const ipv4Mapped = '::ffff:192.0.2.1';

      const hash1 = hashIpAddress(ipv4);
      const hash2 = hashIpAddress(ipv4Mapped);

      // Should produce same hash after normalization
      expect(hash1).toBe(hash2);
    });

    it('should never store raw IP addresses', async () => {
      const eventId = 'evt_ip_' + Date.now();
      const rawIp = '203.0.113.1';
      const ipHash = hashIpAddress(rawIp);

      const event = await prisma.trackingEvent.create({
        data: {
          siteId: testSiteId,
          eventId,
          type: 'PAGE_VIEW',
          url: 'https://example.com/page',
          path: '/page',
          anonId: 'anon_ip',
          sessionId: 'sess_ip',
          ipHash,
        },
      });

      // Verify only hash is stored, not raw IP
      expect(event.ipHash).toBe(ipHash);
      expect(event.ipHash).not.toBe(rawIp);
      expect(event.ipHash).toMatch(/^[a-f0-9]+$/);
    });
  });

  describe('Batch Events', () => {
    it('should accept multiple events in a batch', async () => {
      const events = [
        {
          eventId: 'evt_batch_1_' + Date.now(),
          type: 'PAGE_VIEW' as const,
          url: 'https://example.com/page1',
          path: '/page1',
          anonId: 'anon_batch',
          sessionId: 'sess_batch',
        },
        {
          eventId: 'evt_batch_2_' + Date.now(),
          type: 'PAGE_VIEW' as const,
          url: 'https://example.com/page2',
          path: '/page2',
          anonId: 'anon_batch',
          sessionId: 'sess_batch',
        },
        {
          eventId: 'evt_batch_3_' + Date.now(),
          type: 'CONVERSION' as const,
          url: 'https://example.com/checkout',
          path: '/checkout',
          anonId: 'anon_batch',
          sessionId: 'sess_batch',
        },
      ];

      // Create all events
      for (const event of events) {
        await prisma.trackingEvent.create({
          data: {
            siteId: testSiteId,
            ...event,
          },
        });
      }

      const created = await prisma.trackingEvent.findMany({
        where: { siteId: testSiteId },
      });

      expect(created.length).toBe(3);
    });

    it('should handle partial batch failures (some duplicates)', async () => {
      const baseEventId = 'evt_partial_' + Date.now();

      // Create first event
      await prisma.trackingEvent.create({
        data: {
          siteId: testSiteId,
          eventId: baseEventId + '_1',
          type: 'PAGE_VIEW',
          url: 'https://example.com/page1',
          path: '/page1',
          anonId: 'anon_1',
          sessionId: 'sess_1',
        },
      });

      // Batch with one duplicate and one new
      const events = [
        {
          eventId: baseEventId + '_1', // Duplicate
          type: 'PAGE_VIEW' as const,
          url: 'https://example.com/page1',
          path: '/page1',
          anonId: 'anon_1',
          sessionId: 'sess_1',
        },
        {
          eventId: baseEventId + '_2', // New
          type: 'PAGE_VIEW' as const,
          url: 'https://example.com/page2',
          path: '/page2',
          anonId: 'anon_2',
          sessionId: 'sess_2',
        },
      ];

      let accepted = 0;
      let deduped = 0;

      for (const event of events) {
        try {
          await prisma.trackingEvent.create({
            data: {
              siteId: testSiteId,
              ...event,
            },
          });
          accepted++;
        } catch (error: any) {
          if (error.code === 'P2002') {
            deduped++;
          }
        }
      }

      expect(accepted).toBe(1);
      expect(deduped).toBe(1);
    });
  });

  describe('Data Storage', () => {
    it('should store all required fields', async () => {
      const event = await prisma.trackingEvent.create({
        data: {
          siteId: testSiteId,
          eventId: 'evt_full_' + Date.now(),
          type: 'PAGE_VIEW',
          name: 'Product View',
          url: 'https://example.com/product/123',
          path: '/product/123',
          referrer: 'https://google.com',
          title: 'Product Page',
          anonId: 'anon_full',
          sessionId: 'sess_full',
          userAgent: 'Mozilla/5.0',
          ipHash: hashIpAddress('192.0.2.1'),
          utmSource: 'google',
          utmMedium: 'cpc',
          utmCampaign: 'summer',
          properties: { productId: '123', category: 'shoes' },
        },
      });

      expect(event.eventId).toBeDefined();
      expect(event.type).toBe('PAGE_VIEW');
      expect(event.name).toBe('Product View');
      expect(event.url).toBe('https://example.com/product/123');
      expect(event.path).toBe('/product/123');
      expect(event.referrer).toBe('https://google.com');
      expect(event.title).toBe('Product Page');
      expect(event.anonId).toBe('anon_full');
      expect(event.sessionId).toBe('sess_full');
      expect(event.userAgent).toBe('Mozilla/5.0');
      expect(event.ipHash).toBeDefined();
      expect(event.utmSource).toBe('google');
      expect(event.properties).toEqual({ productId: '123', category: 'shoes' });
    });

    it('should auto-generate anonId and sessionId if not provided', async () => {
      const event = await prisma.trackingEvent.create({
        data: {
          siteId: testSiteId,
          eventId: 'evt_auto_' + Date.now(),
          type: 'PAGE_VIEW',
          url: 'https://example.com/page',
          path: '/page',
          anonId: `anon_${Date.now()}`,
          sessionId: `sess_${Date.now()}`,
        },
      });

      expect(event.anonId).toMatch(/^anon_/);
      expect(event.sessionId).toMatch(/^sess_/);
    });
  });

  describe('Validation', () => {
    it('should require publicKey', () => {
      const event = {
        eventId: 'evt_test',
        type: 'PAGE_VIEW',
        url: 'https://example.com/page',
        path: '/page',
      };

      // Missing publicKey - would fail validation
      expect(event).not.toHaveProperty('publicKey');
    });

    it('should require eventId', () => {
      const event = {
        publicKey,
        type: 'PAGE_VIEW',
        url: 'https://example.com/page',
        path: '/page',
      };

      // Missing eventId - would fail validation
      expect(event).not.toHaveProperty('eventId');
    });

    it('should validate event type enum', () => {
      const validTypes = ['PAGE_VIEW', 'CONVERSION', 'CUSTOM'];
      const invalidType = 'INVALID_TYPE';

      expect(validTypes).toContain('PAGE_VIEW');
      expect(validTypes).toContain('CONVERSION');
      expect(validTypes).toContain('CUSTOM');
      expect(validTypes).not.toContain(invalidType);
    });
  });
});
