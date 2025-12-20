/**
 * Daily Sync Job Tests
 */

import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { PrismaClient } from '@prisma/client';
import { encryptToken } from '@/lib/integrations/encryption';
import { runDailySync } from '../run-daily-sync';

const prisma = new PrismaClient();

// Mock API clients
jest.mock('@/lib/integrations/meta-ads-client', () => ({
  fetchMetaCostData: jest.fn(),
  withRetry: jest.fn((fn) => fn()),
}));

jest.mock('@/lib/integrations/google-ads-client', () => ({
  fetchGoogleAdsCostData: jest.fn(),
  withRetry: jest.fn((fn) => fn()),
}));

jest.mock('@/lib/integrations/token-refresh', () => ({
  getValidAccessToken: jest.fn(() => Promise.resolve('mock-access-token')),
}));

import { fetchMetaCostData } from '@/lib/integrations/meta-ads-client';
import { fetchGoogleAdsCostData } from '@/lib/integrations/google-ads-client';

const mockFetchMetaCostData = fetchMetaCostData as jest.MockedFunction<typeof fetchMetaCostData>;
const mockFetchGoogleAdsCostData = fetchGoogleAdsCostData as jest.MockedFunction<typeof fetchGoogleAdsCostData>;

describe('Daily Sync Job', () => {
  const testOrgId = 'test-org-sync-' + Date.now();
  let platformId: string;
  let adAccountId: string;

  beforeEach(async () => {
    // Create test organization
    await prisma.organization.create({
      data: {
        id: testOrgId,
        name: 'Test Org Sync',
        slug: 'test-org-sync-' + Date.now(),
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

    // Create ad account
    const adAccount = await prisma.adAccount.create({
      data: {
        organizationId: testOrgId,
        platformId,
        externalId: 'act_test_' + Date.now(),
        name: 'Test Ad Account',
        currency: 'USD',
        timezone: 'America/Los_Angeles',
        status: 'ACTIVE',
      },
    });
    adAccountId = adAccount.id;

    // Reset mocks
    jest.clearAllMocks();
  });

  afterEach(async () => {
    // Cleanup
    await prisma.ingestionJob.deleteMany({ where: { organizationId: testOrgId } });
    await prisma.costFact.deleteMany({ where: { organizationId: testOrgId } });
    await prisma.integrationConnection.deleteMany({ where: { organizationId: testOrgId } });
    await prisma.adAccount.deleteMany({ where: { organizationId: testOrgId } });
    await prisma.platform.delete({ where: { id: platformId } });
    await prisma.organization.delete({ where: { id: testOrgId } });
  });

  describe('Integration Connection Iteration', () => {
    it('should iterate all connected integrations', async () => {
      // Create integration connections
      await prisma.integrationConnection.createMany({
        data: [
          {
            organizationId: testOrgId,
            platformCode: 'META_ADS',
            externalAccountId: 'act_123',
            externalAccountName: 'Meta Account 1',
            status: 'CONNECTED',
            accessTokenEnc: encryptToken('token-1'),
          },
          {
            organizationId: testOrgId,
            platformCode: 'META_ADS',
            externalAccountId: 'act_456',
            externalAccountName: 'Meta Account 2',
            status: 'CONNECTED',
            accessTokenEnc: encryptToken('token-2'),
          },
          {
            organizationId: testOrgId,
            platformCode: 'META_ADS',
            externalAccountId: 'act_789',
            externalAccountName: 'Meta Account 3',
            status: 'DISCONNECTED', // Should be skipped
          },
        ],
      });

      // Mock API responses
      mockFetchMetaCostData.mockResolvedValue([]);

      const result = await runDailySync({
        organizationId: testOrgId,
        platformCode: 'META_ADS',
      });

      expect(result.connectionsProcessed).toBe(2); // Only CONNECTED ones
      expect(result.organizationsProcessed).toBe(1);
    });

    it('should skip disconnected integrations', async () => {
      await prisma.integrationConnection.create({
        data: {
          organizationId: testOrgId,
          platformCode: 'META_ADS',
          externalAccountId: 'act_disconnected',
          status: 'DISCONNECTED',
        },
      });

      const result = await runDailySync({
        organizationId: testOrgId,
      });

      expect(result.connectionsProcessed).toBe(0);
    });
  });

  describe('CostFact Upsert', () => {
    it('should create new CostFact records', async () => {
      const connection = await prisma.integrationConnection.create({
        data: {
          organizationId: testOrgId,
          platformCode: 'META_ADS',
          externalAccountId: 'act_test_' + Date.now(),
          status: 'CONNECTED',
          accessTokenEnc: encryptToken('token'),
        },
      });

      // Mock API response
      mockFetchMetaCostData.mockResolvedValue([
        {
          date: '2024-01-01',
          grain: 'CAMPAIGN',
          entityExternalId: 'camp_123',
          entityName: 'Test Campaign',
          campaignExternalId: 'camp_123',
          campaignName: 'Test Campaign',
          impressions: 10000,
          clicks: 500,
          spendMicros: 50_000_000, // $50
        },
      ]);

      const result = await runDailySync({
        organizationId: testOrgId,
        fromDate: new Date('2024-01-01'),
        toDate: new Date('2024-01-01'),
        grains: ['CAMPAIGN'],
      });

      expect(result.costFactsCreated).toBe(1);
      expect(result.costFactsUpdated).toBe(0);

      // Verify CostFact was created
      const costFact = await prisma.costFact.findFirst({
        where: {
          organizationId: testOrgId,
          entityExternalId: 'camp_123',
        },
      });

      expect(costFact).toBeDefined();
      expect(costFact?.grain).toBe('CAMPAIGN');
      expect(costFact?.impressions).toBe(BigInt(10000));
      expect(costFact?.clicks).toBe(BigInt(500));
      expect(costFact?.spendMicros).toBe(BigInt(50_000_000));
    });

    it('should update existing CostFact records (idempotent)', async () => {
      const connection = await prisma.integrationConnection.create({
        data: {
          organizationId: testOrgId,
          platformCode: 'META_ADS',
          externalAccountId: 'act_test_' + Date.now(),
          status: 'CONNECTED',
          accessTokenEnc: encryptToken('token'),
        },
      });

      // Create existing CostFact
      await prisma.costFact.create({
        data: {
          organizationId: testOrgId,
          platformId,
          adAccountId,
          date: new Date('2024-01-01'),
          grain: 'CAMPAIGN',
          entityExternalId: 'camp_123',
          entityName: 'Old Name',
          impressions: BigInt(5000),
          clicks: BigInt(250),
          spendMicros: BigInt(25_000_000),
        },
      });

      // Mock API response with updated data
      mockFetchMetaCostData.mockResolvedValue([
        {
          date: '2024-01-01',
          grain: 'CAMPAIGN',
          entityExternalId: 'camp_123',
          entityName: 'Updated Campaign',
          campaignExternalId: 'camp_123',
          campaignName: 'Updated Campaign',
          impressions: 10000,
          clicks: 500,
          spendMicros: 50_000_000,
        },
      ]);

      const result = await runDailySync({
        organizationId: testOrgId,
        fromDate: new Date('2024-01-01'),
        toDate: new Date('2024-01-01'),
        grains: ['CAMPAIGN'],
      });

      expect(result.costFactsCreated).toBe(0);
      expect(result.costFactsUpdated).toBe(1);

      // Verify CostFact was updated
      const costFact = await prisma.costFact.findFirst({
        where: {
          organizationId: testOrgId,
          entityExternalId: 'camp_123',
        },
      });

      expect(costFact?.entityName).toBe('Updated Campaign');
      expect(costFact?.impressions).toBe(BigInt(10000));
      expect(costFact?.clicks).toBe(BigInt(500));
      expect(costFact?.spendMicros).toBe(BigInt(50_000_000));
    });

    it('should handle multiple grains', async () => {
      const connection = await prisma.integrationConnection.create({
        data: {
          organizationId: testOrgId,
          platformCode: 'META_ADS',
          externalAccountId: 'act_test_' + Date.now(),
          status: 'CONNECTED',
          accessTokenEnc: encryptToken('token'),
        },
      });

      // Mock API responses for different grains
      mockFetchMetaCostData
        .mockResolvedValueOnce([
          {
            date: '2024-01-01',
            grain: 'CAMPAIGN',
            entityExternalId: 'camp_123',
            entityName: 'Campaign',
            campaignExternalId: 'camp_123',
            campaignName: 'Campaign',
            impressions: 10000,
            clicks: 500,
            spendMicros: 50_000_000,
          },
        ])
        .mockResolvedValueOnce([
          {
            date: '2024-01-01',
            grain: 'ADSET',
            entityExternalId: 'adset_456',
            entityName: 'Adset',
            campaignExternalId: 'camp_123',
            campaignName: 'Campaign',
            adsetExternalId: 'adset_456',
            adsetName: 'Adset',
            impressions: 5000,
            clicks: 250,
            spendMicros: 25_000_000,
          },
        ]);

      const result = await runDailySync({
        organizationId: testOrgId,
        fromDate: new Date('2024-01-01'),
        toDate: new Date('2024-01-01'),
        grains: ['CAMPAIGN', 'ADSET'],
      });

      expect(result.costFactsCreated).toBe(2);

      // Verify both grains were created
      const costFacts = await prisma.costFact.findMany({
        where: { organizationId: testOrgId },
      });

      expect(costFacts.length).toBe(2);
      expect(costFacts.some(cf => cf.grain === 'CAMPAIGN')).toBe(true);
      expect(costFacts.some(cf => cf.grain === 'ADSET')).toBe(true);
    });
  });

  describe('IngestionJob Tracking', () => {
    it('should create IngestionJob records', async () => {
      await prisma.integrationConnection.create({
        data: {
          organizationId: testOrgId,
          platformCode: 'META_ADS',
          externalAccountId: 'act_test_' + Date.now(),
          status: 'CONNECTED',
          accessTokenEnc: encryptToken('token'),
        },
      });

      mockFetchMetaCostData.mockResolvedValue([]);

      const result = await runDailySync({
        organizationId: testOrgId,
      });

      expect(result.jobIds.length).toBeGreaterThan(0);

      // Verify job was created
      const jobs = await prisma.ingestionJob.findMany({
        where: { organizationId: testOrgId },
      });

      expect(jobs.length).toBeGreaterThan(0);
      expect(jobs[0].platform).toBe('META_ADS');
      expect(jobs[0].jobType).toBe('COST_SYNC');
      expect(jobs[0].status).toBe('COMPLETED');
    });

    it('should mark job as FAILED on error', async () => {
      await prisma.integrationConnection.create({
        data: {
          organizationId: testOrgId,
          platformCode: 'META_ADS',
          externalAccountId: 'act_test_' + Date.now(),
          status: 'CONNECTED',
          accessTokenEnc: encryptToken('token'),
        },
      });

      // Mock API error
      mockFetchMetaCostData.mockRejectedValue(new Error('API Error'));

      const result = await runDailySync({
        organizationId: testOrgId,
      });

      expect(result.errors).toBe(1);

      // Verify job was marked as failed
      const jobs = await prisma.ingestionJob.findMany({
        where: {
          organizationId: testOrgId,
          status: 'FAILED',
        },
      });

      expect(jobs.length).toBe(1);
      expect(jobs[0].lastError).toContain('API Error');
    });

    it('should use idempotent key for jobs', async () => {
      await prisma.integrationConnection.create({
        data: {
          organizationId: testOrgId,
          platformCode: 'META_ADS',
          externalAccountId: 'act_test_' + Date.now(),
          status: 'CONNECTED',
          accessTokenEnc: encryptToken('token'),
        },
      });

      mockFetchMetaCostData.mockResolvedValue([]);

      // Run sync twice
      await runDailySync({
        organizationId: testOrgId,
        fromDate: new Date('2024-01-01'),
        toDate: new Date('2024-01-01'),
      });

      // Second run should create new job (different execution)
      await runDailySync({
        organizationId: testOrgId,
        fromDate: new Date('2024-01-01'),
        toDate: new Date('2024-01-01'),
      });

      const jobs = await prisma.ingestionJob.findMany({
        where: { organizationId: testOrgId },
      });

      // Should have 2 jobs (one per execution)
      expect(jobs.length).toBe(2);
    });
  });

  describe('Error Handling', () => {
    it('should continue processing other connections on error', async () => {
      // Create 2 connections
      await prisma.integrationConnection.createMany({
        data: [
          {
            organizationId: testOrgId,
            platformCode: 'META_ADS',
            externalAccountId: 'act_fail',
            status: 'CONNECTED',
            accessTokenEnc: encryptToken('token-1'),
          },
          {
            organizationId: testOrgId,
            platformCode: 'META_ADS',
            externalAccountId: 'act_success',
            status: 'CONNECTED',
            accessTokenEnc: encryptToken('token-2'),
          },
        ],
      });

      // First call fails, second succeeds
      mockFetchMetaCostData
        .mockRejectedValueOnce(new Error('API Error'))
        .mockResolvedValueOnce([
          {
            date: '2024-01-01',
            grain: 'CAMPAIGN',
            entityExternalId: 'camp_123',
            entityName: 'Campaign',
            campaignExternalId: 'camp_123',
            campaignName: 'Campaign',
            impressions: 10000,
            clicks: 500,
            spendMicros: 50_000_000,
          },
        ]);

      const result = await runDailySync({
        organizationId: testOrgId,
        grains: ['CAMPAIGN'],
      });

      expect(result.errors).toBe(1);
      expect(result.connectionsProcessed).toBe(1); // One succeeded
      expect(result.costFactsCreated).toBe(1);
    });
  });

  describe('Date Range Handling', () => {
    it('should default to yesterday', async () => {
      await prisma.integrationConnection.create({
        data: {
          organizationId: testOrgId,
          platformCode: 'META_ADS',
          externalAccountId: 'act_test_' + Date.now(),
          status: 'CONNECTED',
          accessTokenEnc: encryptToken('token'),
        },
      });

      mockFetchMetaCostData.mockResolvedValue([]);

      await runDailySync({
        organizationId: testOrgId,
      });

      // Verify API was called with yesterday's date
      expect(mockFetchMetaCostData).toHaveBeenCalled();
      const callArgs = mockFetchMetaCostData.mock.calls[0];
      const fromDate = callArgs[2] as Date;
      const toDate = callArgs[3] as Date;

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(0, 0, 0, 0);

      expect(fromDate.toDateString()).toBe(yesterday.toDateString());
      expect(toDate.toDateString()).toBe(yesterday.toDateString());
    });

    it('should respect custom date range', async () => {
      await prisma.integrationConnection.create({
        data: {
          organizationId: testOrgId,
          platformCode: 'META_ADS',
          externalAccountId: 'act_test_' + Date.now(),
          status: 'CONNECTED',
          accessTokenEnc: encryptToken('token'),
        },
      });

      mockFetchMetaCostData.mockResolvedValue([]);

      const fromDate = new Date('2024-01-01');
      const toDate = new Date('2024-01-07');

      await runDailySync({
        organizationId: testOrgId,
        fromDate,
        toDate,
      });

      // Verify API was called with custom dates
      const callArgs = mockFetchMetaCostData.mock.calls[0];
      expect((callArgs[2] as Date).toDateString()).toBe(fromDate.toDateString());
      expect((callArgs[3] as Date).toDateString()).toBe(toDate.toDateString());
    });
  });
});
