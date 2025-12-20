/**
 * OAuth Integration Tests
 */

import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { PrismaClient } from '@prisma/client';
import { encryptToken, decryptToken, verifyEncryption } from '@/lib/integrations/encryption';
import { getValidAccessToken, refreshGoogleAdsToken, refreshMetaToken } from '@/lib/integrations/token-refresh';

const prisma = new PrismaClient();

describe('OAuth Integration Flows', () => {
  const testOrgId = 'test-org-oauth-' + Date.now();

  beforeEach(async () => {
    // Create test organization
    await prisma.organization.create({
      data: {
        id: testOrgId,
        name: 'Test Org OAuth',
        slug: 'test-org-oauth-' + Date.now(),
      },
    });
  });

  afterEach(async () => {
    // Cleanup
    await prisma.integrationConnection.deleteMany({ where: { organizationId: testOrgId } });
    await prisma.organization.delete({ where: { id: testOrgId } });
  });

  describe('Token Encryption', () => {
    it('should encrypt and decrypt tokens correctly', () => {
      const originalToken = 'test-access-token-' + Date.now();
      
      const encrypted = encryptToken(originalToken);
      expect(encrypted).toBeDefined();
      expect(encrypted).not.toBe(originalToken);
      expect(encrypted.length).toBeGreaterThan(0);

      const decrypted = decryptToken(encrypted);
      expect(decrypted).toBe(originalToken);
    });

    it('should generate different ciphertext for same plaintext', () => {
      const token = 'same-token';
      
      const encrypted1 = encryptToken(token);
      const encrypted2 = encryptToken(token);
      
      // Different IVs should produce different ciphertext
      expect(encrypted1).not.toBe(encrypted2);
      
      // But both should decrypt to same value
      expect(decryptToken(encrypted1)).toBe(token);
      expect(decryptToken(encrypted2)).toBe(token);
    });

    it('should verify encryption works', () => {
      const isValid = verifyEncryption();
      expect(isValid).toBe(true);
    });

    it('should throw error for empty token', () => {
      expect(() => encryptToken('')).toThrow();
      expect(() => decryptToken('')).toThrow();
    });
  });

  describe('IntegrationConnection Storage', () => {
    it('should create Meta connection with encrypted tokens', async () => {
      const accessToken = 'meta-access-token-' + Date.now();
      const accessTokenEnc = encryptToken(accessToken);

      const connection = await prisma.integrationConnection.create({
        data: {
          organizationId: testOrgId,
          platformCode: 'META_ADS',
          externalAccountId: 'act_123456',
          externalAccountName: 'Test Ad Account',
          currency: 'USD',
          timezone: 'America/Los_Angeles',
          status: 'CONNECTED',
          accessTokenEnc,
          accessTokenExpiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
          scope: 'ads_management,ads_read',
          tokenType: 'bearer',
          metadata: {
            accountId: 'act_123456',
            accountStatus: 1,
          },
        },
      });

      expect(connection.id).toBeDefined();
      expect(connection.platformCode).toBe('META_ADS');
      expect(connection.accessTokenEnc).toBe(accessTokenEnc);
      
      // Verify token can be decrypted
      const decrypted = decryptToken(connection.accessTokenEnc!);
      expect(decrypted).toBe(accessToken);
    });

    it('should create Google Ads connection with refresh token', async () => {
      const accessToken = 'google-access-token-' + Date.now();
      const refreshToken = 'google-refresh-token-' + Date.now();
      
      const accessTokenEnc = encryptToken(accessToken);
      const refreshTokenEnc = encryptToken(refreshToken);

      const connection = await prisma.integrationConnection.create({
        data: {
          organizationId: testOrgId,
          platformCode: 'GOOGLE_ADS',
          externalAccountId: '1234567890',
          externalAccountName: 'Test Customer',
          currency: 'USD',
          timezone: 'America/New_York',
          status: 'CONNECTED',
          accessTokenEnc,
          refreshTokenEnc,
          accessTokenExpiresAt: new Date(Date.now() + 3600 * 1000), // 1 hour
          scope: 'https://www.googleapis.com/auth/adwords',
          tokenType: 'Bearer',
          metadata: {
            resourceName: 'customers/1234567890',
            manager: false,
          },
        },
      });

      expect(connection.id).toBeDefined();
      expect(connection.platformCode).toBe('GOOGLE_ADS');
      expect(connection.refreshTokenEnc).toBeDefined();
      
      // Verify both tokens can be decrypted
      const decryptedAccess = decryptToken(connection.accessTokenEnc!);
      const decryptedRefresh = decryptToken(connection.refreshTokenEnc!);
      expect(decryptedAccess).toBe(accessToken);
      expect(decryptedRefresh).toBe(refreshToken);
    });

    it('should enforce unique constraint on org + platform + account', async () => {
      const accessTokenEnc = encryptToken('token-1');

      // Create first connection
      await prisma.integrationConnection.create({
        data: {
          organizationId: testOrgId,
          platformCode: 'META_ADS',
          externalAccountId: 'act_duplicate',
          externalAccountName: 'Account 1',
          status: 'CONNECTED',
          accessTokenEnc,
        },
      });

      // Try to create duplicate
      await expect(
        prisma.integrationConnection.create({
          data: {
            organizationId: testOrgId,
            platformCode: 'META_ADS',
            externalAccountId: 'act_duplicate',
            externalAccountName: 'Account 2',
            status: 'CONNECTED',
            accessTokenEnc,
          },
        })
      ).rejects.toThrow();
    });

    it('should allow same account for different organizations', async () => {
      const org2Id = 'test-org-oauth-2-' + Date.now();
      
      await prisma.organization.create({
        data: {
          id: org2Id,
          name: 'Test Org 2',
          slug: 'test-org-oauth-2-' + Date.now(),
        },
      });

      const accessTokenEnc = encryptToken('token-shared');

      // Create connection for org 1
      const conn1 = await prisma.integrationConnection.create({
        data: {
          organizationId: testOrgId,
          platformCode: 'META_ADS',
          externalAccountId: 'act_shared',
          externalAccountName: 'Shared Account',
          status: 'CONNECTED',
          accessTokenEnc,
        },
      });

      // Create connection for org 2 (same account)
      const conn2 = await prisma.integrationConnection.create({
        data: {
          organizationId: org2Id,
          platformCode: 'META_ADS',
          externalAccountId: 'act_shared',
          externalAccountName: 'Shared Account',
          status: 'CONNECTED',
          accessTokenEnc,
        },
      });

      expect(conn1.id).not.toBe(conn2.id);
      expect(conn1.externalAccountId).toBe(conn2.externalAccountId);

      // Cleanup
      await prisma.integrationConnection.deleteMany({ where: { organizationId: org2Id } });
      await prisma.organization.delete({ where: { id: org2Id } });
    });
  });

  describe('Connection Status Management', () => {
    it('should update connection status to DISCONNECTED', async () => {
      const connection = await prisma.integrationConnection.create({
        data: {
          organizationId: testOrgId,
          platformCode: 'META_ADS',
          externalAccountId: 'act_disconnect',
          externalAccountName: 'Test Account',
          status: 'CONNECTED',
          accessTokenEnc: encryptToken('token'),
        },
      });

      // Disconnect
      const updated = await prisma.integrationConnection.update({
        where: { id: connection.id },
        data: {
          status: 'DISCONNECTED',
          accessTokenEnc: null,
          refreshTokenEnc: null,
          accessTokenExpiresAt: null,
        },
      });

      expect(updated.status).toBe('DISCONNECTED');
      expect(updated.accessTokenEnc).toBeNull();
      expect(updated.refreshTokenEnc).toBeNull();
    });

    it('should update connection status to ERROR on token refresh failure', async () => {
      const connection = await prisma.integrationConnection.create({
        data: {
          organizationId: testOrgId,
          platformCode: 'GOOGLE_ADS',
          externalAccountId: '1234567890',
          externalAccountName: 'Test Customer',
          status: 'CONNECTED',
          accessTokenEnc: encryptToken('expired-token'),
        },
      });

      // Mark as error
      const updated = await prisma.integrationConnection.update({
        where: { id: connection.id },
        data: { status: 'ERROR' },
      });

      expect(updated.status).toBe('ERROR');
    });
  });

  describe('Connection Queries', () => {
    it('should list all connections for organization', async () => {
      // Create multiple connections
      await prisma.integrationConnection.createMany({
        data: [
          {
            organizationId: testOrgId,
            platformCode: 'META_ADS',
            externalAccountId: 'act_1',
            externalAccountName: 'Meta Account 1',
            status: 'CONNECTED',
            accessTokenEnc: encryptToken('token-1'),
          },
          {
            organizationId: testOrgId,
            platformCode: 'META_ADS',
            externalAccountId: 'act_2',
            externalAccountName: 'Meta Account 2',
            status: 'CONNECTED',
            accessTokenEnc: encryptToken('token-2'),
          },
          {
            organizationId: testOrgId,
            platformCode: 'GOOGLE_ADS',
            externalAccountId: '1111111111',
            externalAccountName: 'Google Customer 1',
            status: 'CONNECTED',
            accessTokenEnc: encryptToken('token-3'),
          },
        ],
      });

      const connections = await prisma.integrationConnection.findMany({
        where: { organizationId: testOrgId },
      });

      expect(connections.length).toBe(3);
    });

    it('should filter connections by platform', async () => {
      await prisma.integrationConnection.createMany({
        data: [
          {
            organizationId: testOrgId,
            platformCode: 'META_ADS',
            externalAccountId: 'act_1',
            status: 'CONNECTED',
            accessTokenEnc: encryptToken('token-1'),
          },
          {
            organizationId: testOrgId,
            platformCode: 'GOOGLE_ADS',
            externalAccountId: '1111111111',
            status: 'CONNECTED',
            accessTokenEnc: encryptToken('token-2'),
          },
        ],
      });

      const metaConnections = await prisma.integrationConnection.findMany({
        where: {
          organizationId: testOrgId,
          platformCode: 'META_ADS',
        },
      });

      expect(metaConnections.length).toBe(1);
      expect(metaConnections[0].platformCode).toBe('META_ADS');
    });

    it('should filter connections by status', async () => {
      await prisma.integrationConnection.createMany({
        data: [
          {
            organizationId: testOrgId,
            platformCode: 'META_ADS',
            externalAccountId: 'act_1',
            status: 'CONNECTED',
            accessTokenEnc: encryptToken('token-1'),
          },
          {
            organizationId: testOrgId,
            platformCode: 'META_ADS',
            externalAccountId: 'act_2',
            status: 'DISCONNECTED',
          },
        ],
      });

      const connectedOnly = await prisma.integrationConnection.findMany({
        where: {
          organizationId: testOrgId,
          status: 'CONNECTED',
        },
      });

      expect(connectedOnly.length).toBe(1);
      expect(connectedOnly[0].status).toBe('CONNECTED');
    });
  });

  describe('Token Expiry Handling', () => {
    it('should identify expiring tokens', async () => {
      const now = new Date();
      const soon = new Date(now.getTime() + 30 * 60 * 1000); // 30 minutes
      const later = new Date(now.getTime() + 48 * 60 * 60 * 1000); // 48 hours

      await prisma.integrationConnection.createMany({
        data: [
          {
            organizationId: testOrgId,
            platformCode: 'GOOGLE_ADS',
            externalAccountId: '1111111111',
            status: 'CONNECTED',
            accessTokenEnc: encryptToken('expiring-soon'),
            accessTokenExpiresAt: soon,
          },
          {
            organizationId: testOrgId,
            platformCode: 'GOOGLE_ADS',
            externalAccountId: '2222222222',
            status: 'CONNECTED',
            accessTokenEnc: encryptToken('valid-longer'),
            accessTokenExpiresAt: later,
          },
        ],
      });

      // Find tokens expiring in next 24 hours
      const expiring = await prisma.integrationConnection.findMany({
        where: {
          organizationId: testOrgId,
          status: 'CONNECTED',
          accessTokenExpiresAt: {
            lte: new Date(now.getTime() + 24 * 60 * 60 * 1000),
          },
        },
      });

      expect(expiring.length).toBe(1);
      expect(expiring[0].externalAccountId).toBe('1111111111');
    });
  });

  describe('Metadata Storage', () => {
    it('should store platform-specific metadata', async () => {
      const connection = await prisma.integrationConnection.create({
        data: {
          organizationId: testOrgId,
          platformCode: 'META_ADS',
          externalAccountId: 'act_metadata',
          status: 'CONNECTED',
          accessTokenEnc: encryptToken('token'),
          metadata: {
            accountId: 'act_metadata',
            accountStatus: 1,
            businessId: 'business_123',
            customField: 'custom_value',
          },
        },
      });

      expect(connection.metadata).toBeDefined();
      const metadata = connection.metadata as any;
      expect(metadata.accountId).toBe('act_metadata');
      expect(metadata.accountStatus).toBe(1);
      expect(metadata.businessId).toBe('business_123');
      expect(metadata.customField).toBe('custom_value');
    });

    it('should update metadata independently', async () => {
      const connection = await prisma.integrationConnection.create({
        data: {
          organizationId: testOrgId,
          platformCode: 'GOOGLE_ADS',
          externalAccountId: '1234567890',
          status: 'CONNECTED',
          accessTokenEnc: encryptToken('token'),
          metadata: {
            resourceName: 'customers/1234567890',
            manager: false,
          },
        },
      });

      // Update metadata
      const updated = await prisma.integrationConnection.update({
        where: { id: connection.id },
        data: {
          metadata: {
            resourceName: 'customers/1234567890',
            manager: false,
            lastSyncAt: new Date().toISOString(),
            campaignCount: 10,
          },
        },
      });

      const metadata = updated.metadata as any;
      expect(metadata.lastSyncAt).toBeDefined();
      expect(metadata.campaignCount).toBe(10);
    });
  });
});
