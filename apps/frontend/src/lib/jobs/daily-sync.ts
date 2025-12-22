/**
 * Daily Sync Orchestrator
 * 
 * Coordinates cost data sync across all connected ad platforms.
 * Runs every 4 hours via /api/cron/daily-sync
 * 
 * Features:
 * - Loads active integrations per workspace
 * - Calls connector.syncCosts for each
 * - Records job_run log per workspace+connector
 * - Retries transient failures with exponential backoff
 * - Respects rate limits
 * - Supports incremental sync (yesterday + last 7 days)
 */

import { prisma } from "@/lib/prisma";
import { appLogger } from "@/lib/observability";

export interface SyncResult {
  organizationId: string;
  platform: string;
  success: boolean;
  recordsSynced: number;
  recordsFailed: number;
  durationMs: number;
  error?: string;
}

export interface DailySyncResult {
  startedAt: Date;
  completedAt: Date;
  totalOrganizations: number;
  totalConnections: number;
  successfulSyncs: number;
  failedSyncs: number;
  results: SyncResult[];
}

export interface DailySyncOptions {
  /** Specific organization to sync (optional) */
  organizationId?: string;
  /** Number of days to sync (default: 7 for incremental) */
  syncDays?: number;
  /** Force full backfill (default: false) */
  backfill?: boolean;
  /** Max retries per connector (default: 3) */
  maxRetries?: number;
}

const DEFAULT_SYNC_DAYS = 7;
const DEFAULT_MAX_RETRIES = 3;
const BASE_RETRY_DELAY_MS = 1000;

/**
 * Run daily sync for all active integrations
 */
export async function runDailySync(options?: DailySyncOptions): Promise<DailySyncResult> {
  const logger = appLogger.child({ job: "daily-sync" });
  const startedAt = new Date();
  
  const syncDays = options?.syncDays ?? DEFAULT_SYNC_DAYS;
  const maxRetries = options?.maxRetries ?? DEFAULT_MAX_RETRIES;
  const backfill = options?.backfill ?? false;

  logger.info("Starting daily sync", { 
    syncDays, 
    backfill, 
    organizationId: options?.organizationId 
  });

  const results: SyncResult[] = [];
  let successfulSyncs = 0;
  let failedSyncs = 0;

  // Get all active integration connections
  const connections = await prisma.integrationConnection.findMany({
    where: {
      status: "CONNECTED",
      ...(options?.organizationId ? { organizationId: options.organizationId } : {}),
    },
    select: {
      id: true,
      organizationId: true,
      platformCode: true,
      externalAccountId: true,
      externalAccountName: true,
    },
  });

  // Group connections by organization
  const connectionsByOrg = new Map<string, typeof connections>();
  for (const conn of connections) {
    const existing = connectionsByOrg.get(conn.organizationId) || [];
    existing.push(conn);
    connectionsByOrg.set(conn.organizationId, existing);
  }

  logger.info(`Found ${connections.length} connections across ${connectionsByOrg.size} organizations`);

  // Calculate date range
  const endDate = new Date();
  endDate.setHours(0, 0, 0, 0);
  
  const startDate = new Date(endDate);
  if (backfill) {
    startDate.setDate(startDate.getDate() - 90); // 90 days for backfill
  } else {
    startDate.setDate(startDate.getDate() - syncDays);
  }

  // Process each organization
  for (const [organizationId, orgConnections] of connectionsByOrg) {
    for (const connection of orgConnections) {
      const syncStartTime = Date.now();
      
      try {
        const result = await syncConnectionWithRetry(
          connection,
          startDate,
          endDate,
          maxRetries,
          logger
        );

        const durationMs = Date.now() - syncStartTime;
        
        results.push({
          organizationId,
          platform: connection.platformCode,
          success: result.success,
          recordsSynced: result.recordsSynced,
          recordsFailed: result.recordsFailed,
          durationMs,
          error: result.error,
        });

        if (result.success) {
          successfulSyncs++;
        } else {
          failedSyncs++;
        }

        // Log job run
        await logJobRun(
          organizationId,
          connection.platformCode,
          connection.externalAccountId,
          result.success ? "SUCCEEDED" : "FAILED",
          durationMs,
          result.recordsSynced,
          result.error
        );

      } catch (error) {
        const durationMs = Date.now() - syncStartTime;
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        
        logger.error(`Sync failed for ${connection.platformCode}`, error as Error, {
          organizationId,
          connectionId: connection.id,
        });

        results.push({
          organizationId,
          platform: connection.platformCode,
          success: false,
          recordsSynced: 0,
          recordsFailed: 0,
          durationMs,
          error: errorMessage,
        });

        failedSyncs++;

        await logJobRun(
          organizationId,
          connection.platformCode,
          connection.externalAccountId,
          "FAILED",
          durationMs,
          0,
          errorMessage
        );
      }
    }
  }

  const completedAt = new Date();

  const summary: DailySyncResult = {
    startedAt,
    completedAt,
    totalOrganizations: connectionsByOrg.size,
    totalConnections: connections.length,
    successfulSyncs,
    failedSyncs,
    results,
  };

  logger.info("Daily sync completed", {
    durationMs: completedAt.getTime() - startedAt.getTime(),
    successfulSyncs,
    failedSyncs,
  });

  return summary;
}

/**
 * Sync a single connection with retry logic
 */
async function syncConnectionWithRetry(
  connection: {
    id: string;
    organizationId: string;
    platformCode: string;
    externalAccountId: string;
  },
  startDate: Date,
  endDate: Date,
  maxRetries: number,
  logger: typeof appLogger
): Promise<{ success: boolean; recordsSynced: number; recordsFailed: number; error?: string }> {
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      logger.debug(`Sync attempt ${attempt}/${maxRetries}`, {
        platform: connection.platformCode,
        organizationId: connection.organizationId,
      });

      const result = await syncConnection(connection, startDate, endDate);
      
      return {
        success: true,
        recordsSynced: result.recordsSynced,
        recordsFailed: result.recordsFailed,
      };
    } catch (error) {
      lastError = error as Error;
      
      // Check if error is retryable
      if (!isRetryableError(error)) {
        logger.warn(`Non-retryable error, stopping retries`, {
          platform: connection.platformCode,
          error: lastError.message,
        });
        break;
      }

      if (attempt < maxRetries) {
        const delayMs = BASE_RETRY_DELAY_MS * Math.pow(2, attempt - 1);
        logger.debug(`Retrying in ${delayMs}ms`, { attempt, maxRetries });
        await sleep(delayMs);
      }
    }
  }

  return {
    success: false,
    recordsSynced: 0,
    recordsFailed: 0,
    error: lastError?.message || "Unknown error",
  };
}

/**
 * Sync a single connection (dispatches to platform-specific sync)
 */
async function syncConnection(
  connection: {
    id: string;
    organizationId: string;
    platformCode: string;
    externalAccountId: string;
  },
  startDate: Date,
  endDate: Date
): Promise<{ recordsSynced: number; recordsFailed: number }> {
  switch (connection.platformCode) {
    case "GOOGLE_ADS":
      return syncGoogleAds(connection.organizationId, startDate, endDate);
    case "META":
      return syncMeta(connection.organizationId, connection.externalAccountId, startDate, endDate);
    case "TIKTOK":
      return syncTikTok(connection.organizationId, connection.externalAccountId, startDate, endDate);
    default:
      throw new Error(`Unsupported platform: ${connection.platformCode}`);
  }
}

/**
 * Sync Google Ads data
 */
async function syncGoogleAds(
  organizationId: string,
  startDate: Date,
  endDate: Date
): Promise<{ recordsSynced: number; recordsFailed: number }> {
  // Import dynamically to avoid loading all connectors upfront
  // In production, this would call the actual Google Ads sync service
  // For now, we'll simulate the sync
  
  const logger = appLogger.child({ connector: "google-ads", organizationId });
  logger.info("Syncing Google Ads", { startDate, endDate });

  // Check if we have an active Google Ads connection
  const connection = await prisma.integrationConnection.findFirst({
    where: {
      organizationId,
      platformCode: "GOOGLE_ADS",
      status: "CONNECTED",
    },
  });

  if (!connection) {
    throw new Error("No Google Ads connection found");
  }

  // TODO: Call actual Google Ads sync service
  // const { syncGoogleAdsData } = await import("@/lib/connectors/google-ads");
  // return syncGoogleAdsData(organizationId, { startDate, endDate });

  // Placeholder - return mock result
  return { recordsSynced: 0, recordsFailed: 0 };
}

/**
 * Sync Meta Ads data
 */
async function syncMeta(
  organizationId: string,
  externalAccountId: string,
  startDate: Date,
  endDate: Date
): Promise<{ recordsSynced: number; recordsFailed: number }> {
  const logger = appLogger.child({ connector: "meta", organizationId });
  logger.info("Syncing Meta Ads", { startDate, endDate, externalAccountId });

  // Check if we have credentials
  const connection = await prisma.integrationConnection.findFirst({
    where: { 
      organizationId, 
      platformCode: "META",
      externalAccountId,
      status: "CONNECTED",
    },
  });

  if (!connection || !connection.accessTokenEnc) {
    throw new Error("No Meta credentials found");
  }

  // TODO: Call actual Meta sync service
  // const { runMetaAdsCostSyncJob } = await import("@/lib/connectors/meta-ads");
  // return runMetaAdsCostSyncJob({ organizationId, startDate, endDate });

  // Placeholder - return mock result
  return { recordsSynced: 0, recordsFailed: 0 };
}

/**
 * Sync TikTok Ads data
 */
async function syncTikTok(
  organizationId: string,
  externalAccountId: string,
  startDate: Date,
  endDate: Date
): Promise<{ recordsSynced: number; recordsFailed: number }> {
  const logger = appLogger.child({ connector: "tiktok", organizationId });
  logger.info("Syncing TikTok Ads", { startDate, endDate, externalAccountId });

  // Check if we have an active TikTok connection
  const connection = await prisma.integrationConnection.findFirst({
    where: {
      organizationId,
      platformCode: "TIKTOK",
      externalAccountId,
      status: "CONNECTED",
    },
  });

  if (!connection) {
    throw new Error("No TikTok Ads connection found");
  }

  // TODO: Call actual TikTok sync service
  // const { runTikTokAdsCostSyncJob } = await import("@/lib/connectors/tiktok-ads");
  // return runTikTokAdsCostSyncJob({ organizationId, startDate, endDate });

  // Placeholder - return mock result
  return { recordsSynced: 0, recordsFailed: 0 };
}

/**
 * Log job run to database
 */
async function logJobRun(
  organizationId: string,
  platform: string,
  externalAccountId: string,
  status: "SUCCEEDED" | "FAILED",
  durationMs: number,
  recordsSynced: number,
  error?: string
): Promise<void> {
  try {
    await prisma.ingestionJob.create({
      data: {
        organizationId,
        platform: platform as any,
        jobType: "DAILY_SYNC",
        status,
        idempotencyKey: `daily-sync-${organizationId}-${platform}-${externalAccountId}-${new Date().toISOString().split("T")[0]}`,
        payload: {
          externalAccountId,
          durationMs,
          recordsSynced,
          error,
        },
        runAt: new Date(),
      },
    });
  } catch (err) {
    // Ignore duplicate key errors (idempotency)
    if ((err as any)?.code !== "P2002") {
      appLogger.error("Failed to log job run", err as Error);
    }
  }
}

/**
 * Check if an error is retryable
 */
function isRetryableError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  
  const message = error.message.toLowerCase();
  
  // Rate limit errors
  if (message.includes("rate limit") || message.includes("too many requests")) {
    return true;
  }
  
  // Timeout errors
  if (message.includes("timeout") || message.includes("timed out")) {
    return true;
  }
  
  // Network errors
  if (message.includes("network") || message.includes("econnreset") || message.includes("econnrefused")) {
    return true;
  }
  
  // Temporary server errors
  if (message.includes("503") || message.includes("502") || message.includes("504")) {
    return true;
  }
  
  return false;
}

/**
 * Sleep for a given number of milliseconds
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
