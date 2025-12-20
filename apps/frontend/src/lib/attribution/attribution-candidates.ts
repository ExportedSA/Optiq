/**
 * Attribution Link Candidate Creation
 * 
 * Creates attribution link candidates when conversion events are tracked.
 * Does not compute weights yet - just creates the linkage candidates.
 */

import "server-only";
import { prisma } from "@/lib/prisma";
import { appLogger } from "@/lib/observability";

const DEFAULT_LOOKBACK_DAYS = 30;

export interface AttributionCandidateResult {
  conversionId: string;
  touchPointsFound: number;
  linksCreated: number;
}

/**
 * Create attribution link candidates for a conversion event
 * 
 * Finds all touchpoints for the same anonId within the lookback window
 * and creates AttributionLink candidate entries (without weights yet)
 */
export async function createAttributionCandidates(
  conversionEventId: string,
  lookbackDays: number = DEFAULT_LOOKBACK_DAYS
): Promise<AttributionCandidateResult> {
  const logger = appLogger.child({ fn: "createAttributionCandidates" });

  // Get the conversion event
  const conversion = await prisma.trackingEvent.findUnique({
    where: { id: conversionEventId },
    select: {
      id: true,
      siteId: true,
      anonId: true,
      occurredAt: true,
      type: true,
    },
  });

  if (!conversion) {
    throw new Error(`Conversion event not found: ${conversionEventId}`);
  }

  if (conversion.type !== "CONVERSION") {
    throw new Error(`Event ${conversionEventId} is not a CONVERSION event`);
  }

  // Calculate lookback window
  const lookbackStart = new Date(conversion.occurredAt);
  lookbackStart.setDate(lookbackStart.getDate() - lookbackDays);

  logger.debug("Finding touchpoints for conversion", {
    conversionId: conversion.id,
    anonId: conversion.anonId,
    lookbackStart: lookbackStart.toISOString(),
    lookbackEnd: conversion.occurredAt.toISOString(),
  });

  // Find all touchpoints for this anonId within the lookback window
  const touchPoints = await prisma.touchPoint.findMany({
    where: {
      siteId: conversion.siteId,
      anonId: conversion.anonId,
      occurredAt: {
        gte: lookbackStart,
        lte: conversion.occurredAt,
      },
    },
    orderBy: {
      occurredAt: "asc",
    },
    select: {
      id: true,
      occurredAt: true,
      platformCode: true,
      campaignId: true,
    },
  });

  logger.debug(`Found ${touchPoints.length} touchpoints for conversion`, {
    conversionId: conversion.id,
    touchPointCount: touchPoints.length,
  });

  if (touchPoints.length === 0) {
    return {
      conversionId: conversion.id,
      touchPointsFound: 0,
      linksCreated: 0,
    };
  }

  // Create attribution link candidates for each attribution model
  // We'll create candidates for all models, but weights will be computed later
  const models = ["FIRST_TOUCH", "LAST_TOUCH", "LINEAR", "TIME_DECAY", "POSITION_BASED"] as const;
  
  let linksCreated = 0;

  for (const model of models) {
    for (let i = 0; i < touchPoints.length; i++) {
      const touchPoint = touchPoints[i];

      try {
        // Create attribution link candidate
        // Weight will be computed later by the attribution service
        await prisma.attributionLink.create({
          data: {
            siteId: conversion.siteId,
            conversionId: conversion.id,
            touchPointId: touchPoint.id,
            model,
            weight: 0, // Placeholder - will be computed later
            position: i + 1, // 1-indexed position in journey
            touchPointCount: touchPoints.length,
          },
        });

        linksCreated++;
      } catch (error: any) {
        // Check if it's a unique constraint violation (already exists)
        if (error.code === "P2002") {
          logger.debug("Attribution link already exists", {
            conversionId: conversion.id,
            touchPointId: touchPoint.id,
            model,
          });
        } else {
          logger.error("Failed to create attribution link", error, {
            conversionId: conversion.id,
            touchPointId: touchPoint.id,
            model,
          });
        }
      }
    }
  }

  logger.info("Created attribution link candidates", {
    conversionId: conversion.id,
    touchPointsFound: touchPoints.length,
    linksCreated,
  });

  return {
    conversionId: conversion.id,
    touchPointsFound: touchPoints.length,
    linksCreated,
  };
}

/**
 * Batch create attribution candidates for multiple conversions
 */
export async function batchCreateAttributionCandidates(
  conversionEventIds: string[],
  lookbackDays: number = DEFAULT_LOOKBACK_DAYS
): Promise<AttributionCandidateResult[]> {
  const results: AttributionCandidateResult[] = [];

  for (const conversionId of conversionEventIds) {
    try {
      const result = await createAttributionCandidates(conversionId, lookbackDays);
      results.push(result);
    } catch (error) {
      appLogger.error(`Failed to create attribution candidates for ${conversionId}`, error as Error);
    }
  }

  return results;
}

/**
 * Get attribution candidates for a conversion
 */
export async function getAttributionCandidates(conversionId: string) {
  return prisma.attributionLink.findMany({
    where: { conversionId },
    include: {
      touchPoint: {
        select: {
          id: true,
          occurredAt: true,
          platformCode: true,
          campaignId: true,
          utmSource: true,
          utmMedium: true,
          utmCampaign: true,
        },
      },
    },
    orderBy: [
      { model: "asc" },
      { position: "asc" },
    ],
  });
}
