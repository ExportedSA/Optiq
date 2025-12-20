/**
 * TouchPoint Derivation Job
 * 
 * Derives TouchPoint records from TrackingEvent PAGE_VIEW events.
 * 
 * Canonical Rule:
 * - TrackingEvent = raw inbound events (all types: PAGE_VIEW, CONVERSION, CUSTOM)
 * - TouchPoint = derived marketing touchpoints (one per session landing or click ID)
 * 
 * Derivation Logic:
 * - Creates TouchPoint from PAGE_VIEW events that represent session landings
 * - Idempotent: unique by siteId+sessionId+landingUrl OR clickId
 * - Captures UTM parameters, click IDs, referrer, and inferred platform/campaign
 * 
 * Features:
 * - Processes unprocessed PAGE_VIEW events
 * - Deduplicates based on unique constraints
 * - Infers platform from click IDs (gclid → GOOGLE_ADS, fbclid → META, etc.)
 * - Links to campaigns via UTM parameters or click IDs
 * - Idempotent and rebuildable
 */

import "server-only";
import { prisma } from "@/lib/prisma";
import { appLogger } from "@/lib/observability";
import { extractClickIds, inferPlatformFromClickId } from "@/lib/attribution/types";

export interface TouchPointDerivationResult {
  startedAt: Date;
  completedAt: Date;
  eventsProcessed: number;
  touchPointsCreated: number;
  touchPointsSkipped: number;
  errors: number;
}

export interface TouchPointDerivationOptions {
  /** Specific site to process */
  siteId?: string;
  /** Start date for events to process */
  startDate?: Date;
  /** End date for events to process */
  endDate?: Date;
  /** Batch size for processing */
  batchSize?: number;
  /** Force reprocessing of all events */
  force?: boolean;
}

const DEFAULT_BATCH_SIZE = 1000;
const DEFAULT_LOOKBACK_DAYS = 7;

/**
 * Run the TouchPoint derivation job
 */
export async function runTouchPointDerivation(
  options?: TouchPointDerivationOptions
): Promise<TouchPointDerivationResult> {
  const logger = appLogger.child({ job: "touchpoint-derivation" });
  const startedAt = new Date();

  const batchSize = options?.batchSize ?? DEFAULT_BATCH_SIZE;
  const endDate = options?.endDate ?? new Date();
  const startDate = options?.startDate ?? new Date(endDate.getTime() - DEFAULT_LOOKBACK_DAYS * 24 * 60 * 60 * 1000);

  logger.info("Starting TouchPoint derivation", {
    siteId: options?.siteId,
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    batchSize,
  });

  let eventsProcessed = 0;
  let touchPointsCreated = 0;
  let touchPointsSkipped = 0;
  let errors = 0;

  try {
    // Get sites to process
    const sites = await getSitesToProcess(options?.siteId);

    for (const site of sites) {
      logger.info(`Processing site: ${site.id}`, { siteName: site.name });

      let hasMore = true;
      let lastProcessedAt: Date | null = null;

      while (hasMore) {
        // Get batch of PAGE_VIEW events
        const events = await getPageViewEvents(
          site.id,
          startDate,
          endDate,
          batchSize,
          lastProcessedAt
        );

        if (events.length === 0) {
          hasMore = false;
          break;
        }

        logger.debug(`Processing ${events.length} events for site ${site.id}`);

        // Process each event
        for (const event of events) {
          try {
            const result = await deriveTouchPoint(event);
            eventsProcessed++;

            if (result.created) {
              touchPointsCreated++;
            } else {
              touchPointsSkipped++;
            }

            lastProcessedAt = event.occurredAt;
          } catch (error) {
            errors++;
            logger.error(`Failed to derive TouchPoint from event ${event.id}`, error as Error, {
              siteId: site.id,
              eventId: event.id,
            });
          }
        }

        // If we got fewer events than batch size, we're done
        if (events.length < batchSize) {
          hasMore = false;
        }
      }
    }
  } catch (error) {
    logger.error("TouchPoint derivation job failed", error as Error);
    throw error;
  }

  const completedAt = new Date();

  logger.info("TouchPoint derivation completed", {
    eventsProcessed,
    touchPointsCreated,
    touchPointsSkipped,
    errors,
    durationMs: completedAt.getTime() - startedAt.getTime(),
  });

  return {
    startedAt,
    completedAt,
    eventsProcessed,
    touchPointsCreated,
    touchPointsSkipped,
    errors,
  };
}

/**
 * Get sites to process
 */
async function getSitesToProcess(siteId?: string): Promise<Array<{ id: string; name: string }>> {
  if (siteId) {
    const site = await prisma.trackingSite.findUnique({
      where: { id: siteId },
      select: { id: true, name: true },
    });
    return site ? [site] : [];
  }

  return prisma.trackingSite.findMany({
    select: { id: true, name: true },
  });
}

/**
 * Get PAGE_VIEW events to process
 */
async function getPageViewEvents(
  siteId: string,
  startDate: Date,
  endDate: Date,
  limit: number,
  lastProcessedAt: Date | null
): Promise<Array<{
  id: string;
  siteId: string;
  anonId: string;
  sessionId: string;
  occurredAt: Date;
  url: string;
  referrer: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmTerm: string | null;
  utmContent: string | null;
}>> {
  return prisma.trackingEvent.findMany({
    where: {
      siteId,
      type: "PAGE_VIEW",
      occurredAt: {
        gte: lastProcessedAt ?? startDate,
        lte: endDate,
      },
    },
    select: {
      id: true,
      siteId: true,
      anonId: true,
      sessionId: true,
      occurredAt: true,
      url: true,
      referrer: true,
      utmSource: true,
      utmMedium: true,
      utmCampaign: true,
      utmTerm: true,
      utmContent: true,
    },
    orderBy: { occurredAt: "asc" },
    take: limit,
  });
}

/**
 * Derive TouchPoint from TrackingEvent
 */
async function deriveTouchPoint(event: {
  id: string;
  siteId: string;
  anonId: string;
  sessionId: string;
  occurredAt: Date;
  url: string;
  referrer: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmTerm: string | null;
  utmContent: string | null;
}): Promise<{ created: boolean }> {
  // Extract click IDs from URL
  const clickIds = extractClickIds(event.url);
  const hasClickId = !!(clickIds.gclid || clickIds.fbclid || clickIds.ttclid || clickIds.msclkid || clickIds.clickId);

  // Infer platform from click IDs
  const platformCode = inferPlatformFromClickId(clickIds);

  // Determine if this is a session landing (first page view with UTMs or click IDs)
  const isSessionLanding = !!(
    event.utmSource ||
    event.utmMedium ||
    event.utmCampaign ||
    hasClickId
  );

  // Only create TouchPoint for session landings
  if (!isSessionLanding) {
    return { created: false };
  }

  // Try to find matching campaign
  let campaignId: string | null = null;
  if (platformCode && event.utmCampaign) {
    const campaign = await prisma.campaign.findFirst({
      where: {
        platform: { code: platformCode as any },
        name: { contains: event.utmCampaign, mode: "insensitive" },
      },
      select: { id: true },
    });
    campaignId = campaign?.id ?? null;
  }

  // Create TouchPoint (idempotent via unique constraints)
  try {
    await prisma.touchPoint.create({
      data: {
        siteId: event.siteId,
        anonId: event.anonId,
        sessionId: event.sessionId,
        occurredAt: event.occurredAt,
        landingUrl: event.url,
        referrer: event.referrer,
        utmSource: event.utmSource,
        utmMedium: event.utmMedium,
        utmCampaign: event.utmCampaign,
        utmTerm: event.utmTerm,
        utmContent: event.utmContent,
        gclid: clickIds.gclid,
        fbclid: clickIds.fbclid,
        ttclid: clickIds.ttclid,
        msclkid: clickIds.msclkid,
        clickId: clickIds.clickId,
        platformCode,
        campaignId,
      },
    });

    return { created: true };
  } catch (error: any) {
    // Check if it's a unique constraint violation (already exists)
    if (error.code === "P2002") {
      return { created: false }; // Already exists, skip
    }
    throw error; // Re-throw other errors
  }
}

/**
 * Rebuild TouchPoints for a date range
 * Deletes existing TouchPoints and recreates them
 */
export async function rebuildTouchPoints(options: {
  siteId?: string;
  startDate: Date;
  endDate: Date;
}): Promise<TouchPointDerivationResult> {
  const logger = appLogger.child({ job: "touchpoint-rebuild" });

  logger.info("Rebuilding TouchPoints", {
    siteId: options.siteId,
    startDate: options.startDate.toISOString(),
    endDate: options.endDate.toISOString(),
  });

  // Delete existing TouchPoints in the date range
  const deleteResult = await prisma.touchPoint.deleteMany({
    where: {
      ...(options.siteId ? { siteId: options.siteId } : {}),
      occurredAt: {
        gte: options.startDate,
        lte: options.endDate,
      },
    },
  });

  logger.info(`Deleted ${deleteResult.count} existing TouchPoints`);

  // Run derivation
  return runTouchPointDerivation({
    siteId: options.siteId,
    startDate: options.startDate,
    endDate: options.endDate,
    force: true,
  });
}

/**
 * Get TouchPoint derivation stats
 */
export async function getTouchPointStats(siteId?: string): Promise<{
  totalEvents: number;
  totalTouchPoints: number;
  touchPointsWithClickIds: number;
  touchPointsWithUTMs: number;
  touchPointsLinkedToCampaigns: number;
  platformBreakdown: Record<string, number>;
}> {
  const where = siteId ? { siteId } : {};

  const [
    totalEvents,
    totalTouchPoints,
    touchPointsWithClickIds,
    touchPointsWithUTMs,
    touchPointsLinkedToCampaigns,
    platformGroups,
  ] = await Promise.all([
    prisma.trackingEvent.count({ where: { ...where, type: "PAGE_VIEW" } }),
    prisma.touchPoint.count({ where }),
    prisma.touchPoint.count({
      where: {
        ...where,
        OR: [
          { gclid: { not: null } },
          { fbclid: { not: null } },
          { ttclid: { not: null } },
          { msclkid: { not: null } },
          { clickId: { not: null } },
        ],
      },
    }),
    prisma.touchPoint.count({
      where: {
        ...where,
        OR: [
          { utmSource: { not: null } },
          { utmMedium: { not: null } },
          { utmCampaign: { not: null } },
        ],
      },
    }),
    prisma.touchPoint.count({
      where: {
        ...where,
        campaignId: { not: null },
      },
    }),
    prisma.touchPoint.groupBy({
      by: ["platformCode"],
      where,
      _count: true,
    }),
  ]);

  const platformBreakdown: Record<string, number> = {};
  for (const group of platformGroups) {
    if (group.platformCode) {
      platformBreakdown[group.platformCode] = group._count;
    }
  }

  return {
    totalEvents,
    totalTouchPoints,
    touchPointsWithClickIds,
    touchPointsWithUTMs,
    touchPointsLinkedToCampaigns,
    platformBreakdown,
  };
}
