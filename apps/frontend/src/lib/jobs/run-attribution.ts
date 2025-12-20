/**
 * Attribution Job
 * 
 * Processes conversion events and calculates attribution weights
 * for touchpoints based on selected attribution model.
 * 
 * Features:
 * - Finds conversions in date range
 * - Calculates weights for each attribution model
 * - Updates AttributionLink records
 * - Idempotent and rebuildable
 */

import "server-only";
import { prisma } from "@/lib/prisma";
import { appLogger } from "@/lib/observability";
import type { AttributionModel } from "@prisma/client";
import { calculateAttributionWeights, validateWeights } from "@/lib/attribution/weight-calculator";

export interface AttributionJobOptions {
  /** Specific site to process (optional) */
  siteId?: string;
  /** Start date for conversions to process */
  fromDate: Date;
  /** End date for conversions to process */
  toDate: Date;
  /** Attribution model to calculate weights for */
  model: AttributionModel;
  /** Force recalculation even if weights already exist */
  rebuild?: boolean;
}

export interface AttributionJobResult {
  startedAt: Date;
  completedAt: Date;
  model: AttributionModel;
  conversionsProcessed: number;
  linksUpdated: number;
  errors: number;
}

/**
 * Run attribution weight calculation job
 * 
 * Idempotent: Can be run multiple times safely
 * Rebuildable: Use rebuild=true to recalculate existing weights
 */
export async function runAttribution(
  options: AttributionJobOptions
): Promise<AttributionJobResult> {
  const logger = appLogger.child({ job: "run-attribution" });
  const startedAt = new Date();

  logger.info("Starting attribution job", {
    siteId: options.siteId,
    fromDate: options.fromDate.toISOString(),
    toDate: options.toDate.toISOString(),
    model: options.model,
    rebuild: options.rebuild,
  });

  let conversionsProcessed = 0;
  let linksUpdated = 0;
  let errors = 0;

  try {
    // Find all conversion events in the date range
    const conversions = await prisma.trackingEvent.findMany({
      where: {
        ...(options.siteId ? { siteId: options.siteId } : {}),
        type: "CONVERSION",
        occurredAt: {
          gte: options.fromDate,
          lte: options.toDate,
        },
      },
      select: {
        id: true,
        siteId: true,
        anonId: true,
        occurredAt: true,
      },
      orderBy: {
        occurredAt: "asc",
      },
    });

    logger.info(`Found ${conversions.length} conversions to process`);

    // Process each conversion
    for (const conversion of conversions) {
      try {
        const result = await processConversionAttribution(
          conversion.id,
          options.model,
          options.rebuild || false,
          logger
        );

        conversionsProcessed++;
        linksUpdated += result.linksUpdated;
      } catch (error) {
        errors++;
        logger.error(`Failed to process conversion ${conversion.id}`, error as Error);
      }
    }
  } catch (error) {
    logger.error("Attribution job failed", error as Error);
    throw error;
  }

  const completedAt = new Date();

  logger.info("Attribution job completed", {
    model: options.model,
    conversionsProcessed,
    linksUpdated,
    errors,
    durationMs: completedAt.getTime() - startedAt.getTime(),
  });

  return {
    startedAt,
    completedAt,
    model: options.model,
    conversionsProcessed,
    linksUpdated,
    errors,
  };
}

/**
 * Process attribution for a single conversion
 */
async function processConversionAttribution(
  conversionId: string,
  model: AttributionModel,
  rebuild: boolean,
  logger: typeof appLogger
): Promise<{ linksUpdated: number }> {
  // Get all attribution links for this conversion and model
  const links = await prisma.attributionLink.findMany({
    where: {
      conversionId,
      model,
    },
    include: {
      touchPoint: {
        select: {
          id: true,
          occurredAt: true,
        },
      },
    },
    orderBy: {
      position: "asc",
    },
  });

  if (links.length === 0) {
    logger.debug(`No attribution links found for conversion ${conversionId}`);
    return { linksUpdated: 0 };
  }

  // Check if weights already calculated (skip if not rebuilding)
  if (!rebuild && links.every(link => link.weight > 0)) {
    logger.debug(`Weights already calculated for conversion ${conversionId}, skipping`);
    return { linksUpdated: 0 };
  }

  // Prepare touchpoints for weight calculation
  const touchPoints = links.map((link, index) => ({
    id: link.touchPointId,
    occurredAt: link.touchPoint.occurredAt,
    position: index + 1,
  }));

  // Calculate weights
  const weights = calculateAttributionWeights(touchPoints, model);

  // Validate weights sum to 1.0
  if (!validateWeights(weights)) {
    throw new Error(`Invalid weights for conversion ${conversionId}: weights do not sum to 1.0`);
  }

  // Update attribution links with calculated weights
  let linksUpdated = 0;

  for (const weight of weights) {
    await prisma.attributionLink.updateMany({
      where: {
        conversionId,
        touchPointId: weight.touchPointId,
        model,
      },
      data: {
        weight: weight.weight,
      },
    });

    linksUpdated++;
  }

  logger.debug(`Updated ${linksUpdated} attribution links for conversion ${conversionId}`);

  return { linksUpdated };
}

/**
 * Rebuild attribution weights for all models
 * 
 * Useful for backfilling or recalculating after model changes
 */
export async function rebuildAllAttribution(
  siteId: string,
  fromDate: Date,
  toDate: Date
): Promise<Record<AttributionModel, AttributionJobResult>> {
  const models: AttributionModel[] = [
    "FIRST_TOUCH",
    "LAST_TOUCH",
    "LINEAR",
    "TIME_DECAY",
    "POSITION_BASED",
  ];

  const results: Partial<Record<AttributionModel, AttributionJobResult>> = {};

  for (const model of models) {
    const result = await runAttribution({
      siteId,
      fromDate,
      toDate,
      model,
      rebuild: true,
    });

    results[model] = result;
  }

  return results as Record<AttributionModel, AttributionJobResult>;
}

/**
 * Get attribution statistics for a site
 */
export async function getAttributionStats(siteId?: string) {
  const where = siteId ? { siteId } : {};

  const [
    totalLinks,
    linksWithWeights,
    linksByModel,
  ] = await Promise.all([
    prisma.attributionLink.count({ where }),
    prisma.attributionLink.count({
      where: {
        ...where,
        weight: { gt: 0 },
      },
    }),
    prisma.attributionLink.groupBy({
      by: ["model"],
      where,
      _count: true,
      _avg: {
        weight: true,
      },
    }),
  ]);

  return {
    totalLinks,
    linksWithWeights,
    linksWithoutWeights: totalLinks - linksWithWeights,
    percentageComplete: totalLinks > 0 ? (linksWithWeights / totalLinks) * 100 : 0,
    byModel: linksByModel.map(group => ({
      model: group.model,
      count: group._count,
      avgWeight: group._avg.weight || 0,
    })),
  };
}
