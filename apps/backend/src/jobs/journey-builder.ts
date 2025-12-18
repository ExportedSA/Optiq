import { PrismaClient } from "@prisma/client";
import {
  type JourneyBuilderConfig,
  calculateAttributionWeight,
  normalizeWeights,
  getJourneyConfig,
} from "../config/journey-builder";

const prisma = new PrismaClient();

/**
 * Touchpoint with metadata for journey building
 */
interface JourneyTouchpoint {
  id: string;
  occurredAt: Date;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmTerm: string | null;
  utmContent: string | null;
  gclid: string | null;
  fbclid: string | null;
  ttclid: string | null;
  referrer: string | null;
  landingUrl: string | null;
}

/**
 * Conversion with metadata for journey building
 */
interface ConversionEvent {
  id: string;
  eventId: string;
  siteId: string;
  anonId: string;
  sessionId: string;
  occurredAt: Date;
  valueMicros: bigint | null;
  name: string | null;
}

/**
 * Build a journey for a single conversion
 */
export async function buildJourneyForConversion(
  conversion: ConversionEvent,
  config: JourneyBuilderConfig = getJourneyConfig(),
): Promise<string | null> {
  const lookbackDate = new Date(
    conversion.occurredAt.getTime() - config.lookbackDays * 24 * 60 * 60 * 1000,
  );

  // Find all touchpoints for this user within lookback window
  const touchpoints = await prisma.touchPoint.findMany({
    where: {
      siteId: conversion.siteId,
      anonId: conversion.anonId,
      occurredAt: {
        gte: lookbackDate,
        lte: conversion.occurredAt,
      },
    },
    orderBy: {
      occurredAt: "asc",
    },
    take: config.maxTouchpoints,
  });

  // Check minimum touchpoints requirement
  if (touchpoints.length < config.minTouchpoints) {
    return null;
  }

  // Get organization ID from site
  const site = await prisma.trackingSite.findUnique({
    where: { id: conversion.siteId },
    select: { organizationId: true },
  });

  if (!site) {
    throw new Error(`Site not found: ${conversion.siteId}`);
  }

  // Extract journey metadata
  const firstTouchpoint = touchpoints[0];
  const lastTouchpoint = touchpoints[touchpoints.length - 1];

  // Create or update journey
  const journey = await prisma.journey.upsert({
    where: {
      organizationId_anonId_sessionId: {
        organizationId: site.organizationId,
        anonId: conversion.anonId,
        sessionId: conversion.sessionId,
      },
    },
    create: {
      organizationId: site.organizationId,
      anonId: conversion.anonId,
      sessionId: conversion.sessionId,
      status: "CONVERTED",
      startedAt: firstTouchpoint.occurredAt,
      convertedAt: conversion.occurredAt,
      lastActivityAt: conversion.occurredAt,
      conversionValue: conversion.valueMicros,
      conversionName: conversion.name,
      firstUtmSource: firstTouchpoint.utmSource,
      firstUtmMedium: firstTouchpoint.utmMedium,
      firstUtmCampaign: firstTouchpoint.utmCampaign,
      lastUtmSource: lastTouchpoint.utmSource,
      lastUtmMedium: lastTouchpoint.utmMedium,
      lastUtmCampaign: lastTouchpoint.utmCampaign,
      touchPointCount: touchpoints.length,
      eventCount: touchpoints.length + 1, // touchpoints + conversion
    },
    update: {
      status: "CONVERTED",
      convertedAt: conversion.occurredAt,
      lastActivityAt: conversion.occurredAt,
      conversionValue: conversion.valueMicros,
      conversionName: conversion.name,
      touchPointCount: touchpoints.length,
      eventCount: touchpoints.length + 1,
    },
  });

  // Create journey events (link touchpoints to journey)
  let sequenceNumber = 1;
  for (const touchpoint of touchpoints) {
    // Find or create tracking event for this touchpoint
    // Note: Touchpoints may not have corresponding tracking events
    // We'll create journey events directly from touchpoints
    
    // For now, we'll skip creating journey events since touchpoints
    // don't have a direct trackingEvent relationship
    // This would require refactoring the schema to link touchpoints to events
    sequenceNumber++;
  }

  // Create attribution links for each model
  for (const model of config.attributionModels) {
    // Calculate weights for all touchpoints
    const weights = touchpoints.map((tp, index) =>
      calculateAttributionWeight(
        model,
        index,
        touchpoints.length,
        tp.occurredAt,
        conversion.occurredAt,
      ),
    );

    // Normalize weights
    const normalizedWeights = normalizeWeights(weights);

    // Create attribution links
    for (let i = 0; i < touchpoints.length; i++) {
      const touchpoint = touchpoints[i];
      const weight = normalizedWeights[i];

      await prisma.attributionLink.upsert({
        where: {
          conversionId_touchPointId_model: {
            conversionId: conversion.id,
            touchPointId: touchpoint.id,
            model: model as any,
          },
        },
        create: {
          siteId: conversion.siteId,
          conversionId: conversion.id,
          touchPointId: touchpoint.id,
          model: model as any,
          weight,
          position: i + 1,
          touchPointCount: touchpoints.length,
        },
        update: {
          weight,
          position: i + 1,
          touchPointCount: touchpoints.length,
        },
      });
    }
  }

  return journey.id;
}

/**
 * Build journeys for all conversions without journeys
 */
export async function buildMissingJourneys(
  organizationId?: string,
  config: JourneyBuilderConfig = getJourneyConfig(),
): Promise<{ processed: number; created: number; skipped: number }> {
  let processed = 0;
  let created = 0;
  let skipped = 0;

  // Find conversions without journeys
  const conversions = await prisma.trackingEvent.findMany({
    where: {
      type: "CONVERSION",
      ...(organizationId && {
        site: {
          organizationId,
        },
      }),
      // Only process conversions that don't have attribution links yet
      attributionLinks: {
        none: {},
      },
    },
    select: {
      id: true,
      eventId: true,
      siteId: true,
      anonId: true,
      sessionId: true,
      occurredAt: true,
      valueMicros: true,
      name: true,
    },
    take: config.batchSize,
    orderBy: {
      occurredAt: "desc",
    },
  });

  for (const conversion of conversions) {
    try {
      const journeyId = await buildJourneyForConversion(conversion, config);
      
      if (journeyId) {
        created++;
      } else {
        skipped++;
      }
      
      processed++;
    } catch (error) {
      console.error(`Error building journey for conversion ${conversion.id}:`, error);
      skipped++;
      processed++;
    }
  }

  return { processed, created, skipped };
}

/**
 * Rebuild journeys for existing conversions
 */
export async function rebuildJourneys(
  organizationId?: string,
  config: JourneyBuilderConfig = getJourneyConfig(),
): Promise<{ processed: number; rebuilt: number; skipped: number }> {
  let processed = 0;
  let rebuilt = 0;
  let skipped = 0;

  // Find all conversions
  const conversions = await prisma.trackingEvent.findMany({
    where: {
      type: "CONVERSION",
      ...(organizationId && {
        site: {
          organizationId,
        },
      }),
    },
    select: {
      id: true,
      eventId: true,
      siteId: true,
      anonId: true,
      sessionId: true,
      occurredAt: true,
      valueMicros: true,
      name: true,
    },
    take: config.batchSize,
    orderBy: {
      occurredAt: "desc",
    },
  });

  for (const conversion of conversions) {
    try {
      // Delete existing attribution links
      await prisma.attributionLink.deleteMany({
        where: {
          conversionId: conversion.id,
        },
      });

      // Rebuild journey
      const journeyId = await buildJourneyForConversion(conversion, config);
      
      if (journeyId) {
        rebuilt++;
      } else {
        skipped++;
      }
      
      processed++;
    } catch (error) {
      console.error(`Error rebuilding journey for conversion ${conversion.id}:`, error);
      skipped++;
      processed++;
    }
  }

  return { processed, rebuilt, skipped };
}

/**
 * Build journey for a specific conversion by ID
 */
export async function buildJourneyById(
  conversionId: string,
  config: JourneyBuilderConfig = getJourneyConfig(),
): Promise<string | null> {
  const conversion = await prisma.trackingEvent.findUnique({
    where: {
      id: conversionId,
      type: "CONVERSION",
    },
    select: {
      id: true,
      eventId: true,
      siteId: true,
      anonId: true,
      sessionId: true,
      occurredAt: true,
      valueMicros: true,
      name: true,
    },
  });

  if (!conversion) {
    throw new Error(`Conversion not found: ${conversionId}`);
  }

  return buildJourneyForConversion(conversion, config);
}

/**
 * Get journey statistics
 */
export async function getJourneyStats(organizationId?: string) {
  const where = organizationId ? { organizationId } : {};

  const [
    totalJourneys,
    convertedJourneys,
    inProgressJourneys,
    abandonedJourneys,
    conversionsWithoutJourneys,
  ] = await Promise.all([
    prisma.journey.count({ where }),
    prisma.journey.count({ where: { ...where, status: "CONVERTED" } }),
    prisma.journey.count({ where: { ...where, status: "IN_PROGRESS" } }),
    prisma.journey.count({ where: { ...where, status: "ABANDONED" } }),
    prisma.trackingEvent.count({
      where: {
        type: "CONVERSION",
        attributionLinks: { none: {} },
        ...(organizationId && {
          site: { organizationId },
        }),
      },
    }),
  ]);

  return {
    totalJourneys,
    convertedJourneys,
    inProgressJourneys,
    abandonedJourneys,
    conversionsWithoutJourneys,
  };
}

/**
 * Scheduled job to build journeys
 * Should be run periodically (e.g., every hour)
 */
export async function runJourneyBuilderJob(
  config: JourneyBuilderConfig = getJourneyConfig(),
): Promise<void> {
  console.log("Starting journey builder job...");
  console.log("Config:", config);

  try {
    const result = config.rebuildExisting
      ? await rebuildJourneys(undefined, config)
      : await buildMissingJourneys(undefined, config);

    console.log("Journey builder job completed:");
    console.log(`  Processed: ${result.processed}`);
    console.log(`  Created/Rebuilt: ${"created" in result ? result.created : result.rebuilt}`);
    console.log(`  Skipped: ${result.skipped}`);

    const stats = await getJourneyStats();
    console.log("Journey statistics:");
    console.log(`  Total journeys: ${stats.totalJourneys}`);
    console.log(`  Converted: ${stats.convertedJourneys}`);
    console.log(`  In progress: ${stats.inProgressJourneys}`);
    console.log(`  Abandoned: ${stats.abandonedJourneys}`);
    console.log(`  Conversions without journeys: ${stats.conversionsWithoutJourneys}`);
  } catch (error) {
    console.error("Journey builder job failed:", error);
    throw error;
  }
}
