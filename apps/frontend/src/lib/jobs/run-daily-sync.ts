/**
 * Daily Sync Job
 * 
 * Syncs cost data from all connected ad platforms
 * - Iterates IntegrationConnections
 * - Fetches daily spend/clicks/impressions by grain
 * - Writes CostFact with idempotent upsert
 * - Handles rate limits and retries
 * - Records IngestionJob rows
 */

import "server-only";
import { prisma } from "@/lib/prisma";
import { appLogger } from "@/lib/observability";
import { getValidAccessToken } from "@/lib/integrations/token-refresh";
import { fetchMetaCostData, withRetry as metaRetry } from "@/lib/integrations/meta-ads-client";
import { fetchGoogleAdsCostData, withRetry as googleRetry } from "@/lib/integrations/google-ads-client";
import type { PlatformCode, CostGrain, IngestionJobStatus } from "@prisma/client";

export interface DailySyncOptions {
  /** Specific organization to sync */
  organizationId?: string;
  /** Start date for sync */
  fromDate?: Date;
  /** End date for sync */
  toDate?: Date;
  /** Specific platform to sync */
  platformCode?: PlatformCode;
  /** Cost grain levels to sync */
  grains?: CostGrain[];
}

export interface DailySyncResult {
  startedAt: Date;
  completedAt: Date;
  organizationsProcessed: number;
  connectionsProcessed: number;
  costFactsCreated: number;
  costFactsUpdated: number;
  errors: number;
  jobIds: string[];
}

const DEFAULT_GRAINS: CostGrain[] = ["CAMPAIGN", "ADSET", "AD"];

/**
 * Run daily sync for all or specific organizations
 */
export async function runDailySync(options?: DailySyncOptions): Promise<DailySyncResult> {
  const logger = appLogger.child({ job: "daily-sync" });
  const startedAt = new Date();

  // Default date range: yesterday
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);

  const fromDate = options?.fromDate || yesterday;
  const toDate = options?.toDate || yesterday;
  const grains = options?.grains || DEFAULT_GRAINS;

  logger.info("Starting daily sync", {
    organizationId: options?.organizationId,
    fromDate: fromDate.toISOString(),
    toDate: toDate.toISOString(),
    platformCode: options?.platformCode,
    grains,
  });

  let organizationsProcessed = 0;
  let connectionsProcessed = 0;
  let costFactsCreated = 0;
  let costFactsUpdated = 0;
  let errors = 0;
  const jobIds: string[] = [];

  try {
    // Get organizations to process
    const organizations = await prisma.organization.findMany({
      where: options?.organizationId ? { id: options.organizationId } : {},
      select: { id: true, name: true },
    });

    for (const org of organizations) {
      logger.info("Processing organization", { organizationId: org.id, name: org.name });

      // Get active connections for this org
      const connections = await prisma.integrationConnection.findMany({
        where: {
          organizationId: org.id,
          status: "CONNECTED",
          ...(options?.platformCode ? { platformCode: options.platformCode } : {}),
        },
        include: {
          organization: {
            select: { id: true, name: true },
          },
        },
      });

      logger.info("Found connections", {
        organizationId: org.id,
        count: connections.length,
      });

      for (const connection of connections) {
        try {
          // Create ingestion job record
          const job = await createIngestionJob(
            connection.organizationId,
            connection.platformCode,
            fromDate,
            toDate,
            grains
          );
          jobIds.push(job.id);

          logger.info("Processing connection", {
            connectionId: connection.id,
            platform: connection.platformCode,
            accountId: connection.externalAccountId,
            jobId: job.id,
          });

          // Update job status to running
          await updateIngestionJob(job.id, "RUNNING");

          // Sync data for this connection
          const result = await syncConnection(
            connection.id,
            connection.platformCode,
            connection.externalAccountId,
            fromDate,
            toDate,
            grains
          );

          costFactsCreated += result.created;
          costFactsUpdated += result.updated;
          connectionsProcessed++;

          // Update job status to completed
          await updateIngestionJob(job.id, "COMPLETED", {
            costFactsCreated: result.created,
            costFactsUpdated: result.updated,
          });

          logger.info("Connection synced successfully", {
            connectionId: connection.id,
            created: result.created,
            updated: result.updated,
          });
        } catch (error) {
          errors++;
          logger.error("Failed to sync connection", {
            connectionId: connection.id,
            platform: connection.platformCode,
            error: error as Error,
          });

          // Update job status to failed
          const job = jobIds[jobIds.length - 1];
          if (job) {
            await updateIngestionJob(job, "FAILED", undefined, (error as Error).message);
          }
        }
      }

      organizationsProcessed++;
    }
  } catch (error) {
    logger.error("Daily sync failed", error as Error);
    throw error;
  }

  const completedAt = new Date();

  logger.info("Daily sync completed", {
    organizationsProcessed,
    connectionsProcessed,
    costFactsCreated,
    costFactsUpdated,
    errors,
    durationMs: completedAt.getTime() - startedAt.getTime(),
  });

  return {
    startedAt,
    completedAt,
    organizationsProcessed,
    connectionsProcessed,
    costFactsCreated,
    costFactsUpdated,
    errors,
    jobIds,
  };
}

/**
 * Sync a single connection
 */
async function syncConnection(
  connectionId: string,
  platformCode: PlatformCode,
  externalAccountId: string,
  fromDate: Date,
  toDate: Date,
  grains: CostGrain[]
): Promise<{ created: number; updated: number }> {
  const logger = appLogger.child({ connectionId, platform: platformCode });

  let created = 0;
  let updated = 0;

  // Get valid access token (auto-refreshes if needed)
  const accessToken = await getValidAccessToken(connectionId);

  // Get connection details
  const connection = await prisma.integrationConnection.findUnique({
    where: { id: connectionId },
  });

  if (!connection) {
    throw new Error("Connection not found");
  }

  // Get platform and ad account
  const platform = await prisma.platform.findFirst({
    where: { code: platformCode },
  });

  if (!platform) {
    throw new Error(`Platform not found: ${platformCode}`);
  }

  const adAccount = await prisma.adAccount.findFirst({
    where: {
      organizationId: connection.organizationId,
      platformId: platform.id,
      externalId: externalAccountId,
    },
  });

  if (!adAccount) {
    throw new Error(`Ad account not found: ${externalAccountId}`);
  }

  // Fetch and upsert data for each grain
  for (const grain of grains) {
    logger.debug("Syncing grain", { grain });

    let costData: any[] = [];

    // Fetch data based on platform
    if (platformCode === "META_ADS") {
      costData = await metaRetry(() =>
        fetchMetaCostData(accessToken, externalAccountId, fromDate, toDate, grain)
      );
    } else if (platformCode === "GOOGLE_ADS") {
      const developerToken = process.env.GOOGLE_ADS_DEVELOPER_TOKEN;
      if (!developerToken) {
        throw new Error("GOOGLE_ADS_DEVELOPER_TOKEN not configured");
      }
      costData = await googleRetry(() =>
        fetchGoogleAdsCostData(
          accessToken,
          developerToken,
          externalAccountId,
          fromDate,
          toDate,
          grain
        )
      );
    } else {
      logger.warn("Unsupported platform", { platformCode });
      continue;
    }

    // Upsert CostFacts
    for (const data of costData) {
      const result = await upsertCostFact(
        connection.organizationId,
        platform.id,
        adAccount.id,
        grain,
        data
      );

      if (result.created) created++;
      else updated++;
    }

    logger.info("Grain synced", { grain, records: costData.length });
  }

  return { created, updated };
}

/**
 * Upsert a CostFact record (idempotent)
 */
async function upsertCostFact(
  organizationId: string,
  platformId: string,
  adAccountId: string,
  grain: CostGrain,
  data: any
): Promise<{ created: boolean }> {
  const date = new Date(data.date);
  date.setHours(0, 0, 0, 0);

  // Check if exists
  const existing = await prisma.costFact.findFirst({
    where: {
      organizationId,
      platformId,
      adAccountId,
      date,
      grain,
      entityExternalId: data.entityExternalId,
      publisherPlatform: null, // For now, we don't track publisher platform
    },
  });

  const costFactData = {
    organizationId,
    platformId,
    adAccountId,
    date,
    grain,
    entityExternalId: data.entityExternalId,
    entityName: data.entityName,
    campaignExternalId: data.campaignExternalId,
    campaignName: data.campaignName,
    adsetExternalId: data.adsetExternalId || data.adGroupExternalId,
    adsetName: data.adsetName || data.adGroupName,
    adExternalId: data.adExternalId,
    adName: data.adName,
    publisherPlatform: null,
    impressions: BigInt(data.impressions),
    clicks: BigInt(data.clicks),
    spendMicros: BigInt(data.spendMicros),
    conversions: BigInt(0), // Will be filled by attribution
    revenueMicros: BigInt(0), // Will be filled by attribution
  };

  if (existing) {
    // Update existing
    await prisma.costFact.update({
      where: { id: existing.id },
      data: {
        ...costFactData,
        updatedAt: new Date(),
      },
    });
    return { created: false };
  } else {
    // Create new
    await prisma.costFact.create({
      data: costFactData,
    });
    return { created: true };
  }
}

/**
 * Create an ingestion job record
 */
async function createIngestionJob(
  organizationId: string,
  platformCode: PlatformCode,
  fromDate: Date,
  toDate: Date,
  grains: CostGrain[]
): Promise<{ id: string }> {
  const idempotencyKey = `daily-sync-${organizationId}-${platformCode}-${fromDate.toISOString().split("T")[0]}-${toDate.toISOString().split("T")[0]}`;

  const job = await prisma.ingestionJob.create({
    data: {
      organizationId,
      platform: platformCode,
      jobType: "COST_SYNC",
      status: "QUEUED",
      idempotencyKey,
      payload: {
        fromDate: fromDate.toISOString(),
        toDate: toDate.toISOString(),
        grains,
      },
    },
  });

  return { id: job.id };
}

/**
 * Update ingestion job status
 */
async function updateIngestionJob(
  jobId: string,
  status: IngestionJobStatus,
  result?: any,
  error?: string
): Promise<void> {
  await prisma.ingestionJob.update({
    where: { id: jobId },
    data: {
      status,
      ...(result ? { payload: result } : {}),
      ...(error ? { lastError: error } : {}),
      attempts: { increment: 1 },
      updatedAt: new Date(),
    },
  });
}
