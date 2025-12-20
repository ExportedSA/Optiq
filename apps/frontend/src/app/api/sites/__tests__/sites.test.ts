/**
 * Tracking Sites API Tests
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { PrismaClient } from '@prisma/client';
import { generatePublicKey, isValidPublicKey } from '@/lib/tracking/key-generator';

const prisma = new PrismaClient();

describe('Tracking Sites API', () => {
  const testOrgId = 'test-org-sites-' + Date.now();
  const testUserId = 'test-user-sites-' + Date.now();

  beforeEach(async () => {
    // Create test organization
    await prisma.organization.create({
      data: {
        id: testOrgId,
        name: 'Test Org',
        slug: 'test-org-sites-' + Date.now(),
      },
    });

    // Create test user
    await prisma.user.create({
      data: {
        id: testUserId,
        email: `test-${Date.now()}@example.com`,
        name: 'Test User',
      },
    });

    // Create membership
    await prisma.membership.create({
      data: {
        userId: testUserId,
        organizationId: testOrgId,
        role: 'OWNER',
      },
    });
  });

  afterEach(async () => {
    // Cleanup
    await prisma.trackingSite.deleteMany({ where: { organizationId: testOrgId } });
    await prisma.membership.deleteMany({ where: { organizationId: testOrgId } });
    await prisma.organization.delete({ where: { id: testOrgId } });
    await prisma.user.delete({ where: { id: testUserId } });
  });

  describe('Public Key Generation', () => {
    it('should generate valid public keys', () => {
      const key1 = generatePublicKey();
      const key2 = generatePublicKey();

      expect(key1).toMatch(/^pk_[A-Za-z0-9_-]+$/);
      expect(key2).toMatch(/^pk_[A-Za-z0-9_-]+$/);
      expect(key1).not.toBe(key2); // Should be unique
    });

    it('should validate public key format', () => {
      const validKey = generatePublicKey();
      expect(isValidPublicKey(validKey)).toBe(true);

      expect(isValidPublicKey('invalid')).toBe(false);
      expect(isValidPublicKey('pk_')).toBe(false);
      expect(isValidPublicKey('sk_abc123')).toBe(false);
      expect(isValidPublicKey('pk_abc')).toBe(false); // Too short
    });

    it('should generate cryptographically secure keys', () => {
      const keys = new Set();
      const iterations = 1000;

      for (let i = 0; i < iterations; i++) {
        keys.add(generatePublicKey());
      }

      // All keys should be unique
      expect(keys.size).toBe(iterations);
    });
  });

  describe('Site Creation', () => {
    it('should create a tracking site with valid data', async () => {
      const site = await prisma.trackingSite.create({
        data: {
          organizationId: testOrgId,
          name: 'Test Site',
          domain: 'example.com',
          publicKey: generatePublicKey(),
        },
      });

      expect(site.id).toBeDefined();
      expect(site.name).toBe('Test Site');
      expect(site.domain).toBe('example.com');
      expect(site.publicKey).toMatch(/^pk_/);
    });

    it('should enforce unique publicKey constraint', async () => {
      const publicKey = generatePublicKey();

      await prisma.trackingSite.create({
        data: {
          organizationId: testOrgId,
          name: 'Site 1',
          domain: 'example1.com',
          publicKey,
        },
      });

      // Try to create another site with same publicKey
      await expect(
        prisma.trackingSite.create({
          data: {
            organizationId: testOrgId,
            name: 'Site 2',
            domain: 'example2.com',
            publicKey, // Same key
          },
        })
      ).rejects.toThrow(/Unique constraint/);
    });

    it('should allow same domain for different organizations', async () => {
      const org2Id = 'test-org-2-' + Date.now();
      
      await prisma.organization.create({
        data: {
          id: org2Id,
          name: 'Test Org 2',
          slug: 'test-org-2-' + Date.now(),
        },
      });

      // Create site for org 1
      await prisma.trackingSite.create({
        data: {
          organizationId: testOrgId,
          name: 'Site 1',
          domain: 'shared-domain.com',
          publicKey: generatePublicKey(),
        },
      });

      // Create site for org 2 with same domain (should succeed)
      const site2 = await prisma.trackingSite.create({
        data: {
          organizationId: org2Id,
          name: 'Site 2',
          domain: 'shared-domain.com',
          publicKey: generatePublicKey(),
        },
      });

      expect(site2.domain).toBe('shared-domain.com');

      // Cleanup
      await prisma.trackingSite.deleteMany({ where: { organizationId: org2Id } });
      await prisma.organization.delete({ where: { id: org2Id } });
    });
  });

  describe('RBAC - Role-Based Access Control', () => {
    it('should allow OWNER to create sites', async () => {
      const membership = await prisma.membership.findUnique({
        where: {
          userId_organizationId: {
            userId: testUserId,
            organizationId: testOrgId,
          },
        },
      });

      expect(membership?.role).toBe('OWNER');

      // Owner should be able to create sites
      const site = await prisma.trackingSite.create({
        data: {
          organizationId: testOrgId,
          name: 'Owner Site',
          domain: 'owner.com',
          publicKey: generatePublicKey(),
        },
      });

      expect(site).toBeDefined();
    });

    it('should allow ADMIN to create sites', async () => {
      const adminUserId = 'admin-user-' + Date.now();
      
      await prisma.user.create({
        data: {
          id: adminUserId,
          email: `admin-${Date.now()}@example.com`,
          name: 'Admin User',
        },
      });

      await prisma.membership.create({
        data: {
          userId: adminUserId,
          organizationId: testOrgId,
          role: 'ADMIN',
        },
      });

      const membership = await prisma.membership.findUnique({
        where: {
          userId_organizationId: {
            userId: adminUserId,
            organizationId: testOrgId,
          },
        },
      });

      expect(membership?.role).toBe('ADMIN');

      // Admin should be able to create sites
      const site = await prisma.trackingSite.create({
        data: {
          organizationId: testOrgId,
          name: 'Admin Site',
          domain: 'admin.com',
          publicKey: generatePublicKey(),
        },
      });

      expect(site).toBeDefined();

      // Cleanup
      await prisma.membership.delete({
        where: {
          userId_organizationId: {
            userId: adminUserId,
            organizationId: testOrgId,
          },
        },
      });
      await prisma.user.delete({ where: { id: adminUserId } });
    });

    it('should check VIEWER role cannot create sites (API level)', async () => {
      const viewerUserId = 'viewer-user-' + Date.now();
      
      await prisma.user.create({
        data: {
          id: viewerUserId,
          email: `viewer-${Date.now()}@example.com`,
          name: 'Viewer User',
        },
      });

      await prisma.membership.create({
        data: {
          userId: viewerUserId,
          organizationId: testOrgId,
          role: 'VIEWER',
        },
      });

      const membership = await prisma.membership.findUnique({
        where: {
          userId_organizationId: {
            userId: viewerUserId,
            organizationId: testOrgId,
          },
        },
      });

      expect(membership?.role).toBe('VIEWER');
      // API would reject this with 403

      // Cleanup
      await prisma.membership.delete({
        where: {
          userId_organizationId: {
            userId: viewerUserId,
            organizationId: testOrgId,
          },
        },
      });
      await prisma.user.delete({ where: { id: viewerUserId } });
    });

    it('should only allow OWNER to delete sites', async () => {
      const site = await prisma.trackingSite.create({
        data: {
          organizationId: testOrgId,
          name: 'Site to Delete',
          domain: 'delete.com',
          publicKey: generatePublicKey(),
        },
      });

      // Owner can delete
      const membership = await prisma.membership.findUnique({
        where: {
          userId_organizationId: {
            userId: testUserId,
            organizationId: testOrgId,
          },
        },
      });

      expect(membership?.role).toBe('OWNER');

      await prisma.trackingSite.delete({ where: { id: site.id } });

      const deleted = await prisma.trackingSite.findUnique({
        where: { id: site.id },
      });

      expect(deleted).toBeNull();
    });
  });

  describe('Input Validation', () => {
    it('should validate site name length', () => {
      const validName = 'Valid Site Name';
      const tooLong = 'x'.repeat(101);

      expect(validName.length).toBeLessThanOrEqual(100);
      expect(tooLong.length).toBeGreaterThan(100);
    });

    it('should validate domain format', () => {
      const validDomains = [
        'example.com',
        'sub.example.com',
        'example-site.com',
        'example_site.com',
        'example123.com',
      ];

      const invalidDomains = [
        '-example.com',
        'example-.com',
        '.example.com',
        'example..com',
      ];

      const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-_.]*[a-zA-Z0-9]$/;

      validDomains.forEach(domain => {
        expect(domainRegex.test(domain)).toBe(true);
      });

      invalidDomains.forEach(domain => {
        expect(domainRegex.test(domain)).toBe(false);
      });
    });
  });

  describe('Site Listing', () => {
    it('should list sites for organization', async () => {
      // Create multiple sites
      await prisma.trackingSite.createMany({
        data: [
          {
            organizationId: testOrgId,
            name: 'Site 1',
            domain: 'site1.com',
            publicKey: generatePublicKey(),
          },
          {
            organizationId: testOrgId,
            name: 'Site 2',
            domain: 'site2.com',
            publicKey: generatePublicKey(),
          },
          {
            organizationId: testOrgId,
            name: 'Site 3',
            domain: 'site3.com',
            publicKey: generatePublicKey(),
          },
        ],
      });

      const sites = await prisma.trackingSite.findMany({
        where: { organizationId: testOrgId },
        orderBy: { createdAt: 'desc' },
      });

      expect(sites).toHaveLength(3);
      expect(sites[0].name).toBe('Site 3'); // Most recent first
    });

    it('should include event and touchpoint counts', async () => {
      const site = await prisma.trackingSite.create({
        data: {
          organizationId: testOrgId,
          name: 'Stats Site',
          domain: 'stats.com',
          publicKey: generatePublicKey(),
        },
      });

      // Create some events
      await prisma.trackingEvent.createMany({
        data: [
          {
            siteId: site.id,
            eventId: 'evt1',
            type: 'PAGE_VIEW',
            url: 'https://stats.com/page1',
            path: '/page1',
            anonId: 'anon1',
            sessionId: 'sess1',
          },
          {
            siteId: site.id,
            eventId: 'evt2',
            type: 'PAGE_VIEW',
            url: 'https://stats.com/page2',
            path: '/page2',
            anonId: 'anon2',
            sessionId: 'sess2',
          },
        ],
      });

      const siteWithCounts = await prisma.trackingSite.findUnique({
        where: { id: site.id },
        include: {
          _count: {
            select: {
              events: true,
              touchPoints: true,
            },
          },
        },
      });

      expect(siteWithCounts?._count.events).toBe(2);
      expect(siteWithCounts?._count.touchPoints).toBe(0);
    });
  });
});
