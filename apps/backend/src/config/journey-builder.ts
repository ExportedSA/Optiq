/**
 * Journey Builder Configuration
 * 
 * Configures how journeys are built from conversions and touchpoints
 */

export interface JourneyBuilderConfig {
  /**
   * Lookback window in days
   * How far back to look for touchpoints before a conversion
   */
  lookbackDays: number;

  /**
   * Minimum touchpoints required for a journey
   * Journeys with fewer touchpoints may be excluded from attribution
   */
  minTouchpoints: number;

  /**
   * Maximum touchpoints to include in a journey
   * Prevents extremely long journeys from consuming too many resources
   */
  maxTouchpoints: number;

  /**
   * Session timeout in minutes
   * How long before a session is considered ended
   */
  sessionTimeoutMinutes: number;

  /**
   * Whether to include page views in journey
   * If false, only ad touchpoints (with UTM/click IDs) are included
   */
  includePageViews: boolean;

  /**
   * Attribution models to calculate
   * Weights will be calculated for each model
   */
  attributionModels: AttributionModel[];

  /**
   * Whether to rebuild existing journeys
   * If true, existing journeys will be recalculated
   */
  rebuildExisting: boolean;

  /**
   * Batch size for processing conversions
   */
  batchSize: number;
}

export type AttributionModel =
  | "FIRST_TOUCH"
  | "LAST_TOUCH"
  | "LINEAR"
  | "TIME_DECAY"
  | "POSITION_BASED"
  | "DATA_DRIVEN";

/**
 * Default configuration
 */
export const DEFAULT_JOURNEY_CONFIG: JourneyBuilderConfig = {
  lookbackDays: 30,
  minTouchpoints: 1,
  maxTouchpoints: 50,
  sessionTimeoutMinutes: 30,
  includePageViews: false,
  attributionModels: ["FIRST_TOUCH", "LAST_TOUCH", "LINEAR"],
  rebuildExisting: false,
  batchSize: 100,
};

/**
 * Preset configurations for common use cases
 */
export const JOURNEY_PRESETS = {
  /**
   * Short journey (7 days)
   * Good for fast-moving products or short sales cycles
   */
  SHORT: {
    ...DEFAULT_JOURNEY_CONFIG,
    lookbackDays: 7,
    maxTouchpoints: 20,
  } as JourneyBuilderConfig,

  /**
   * Standard journey (30 days)
   * Good for most e-commerce and SaaS products
   */
  STANDARD: {
    ...DEFAULT_JOURNEY_CONFIG,
    lookbackDays: 30,
    maxTouchpoints: 50,
  } as JourneyBuilderConfig,

  /**
   * Long journey (90 days)
   * Good for high-consideration purchases or B2B
   */
  LONG: {
    ...DEFAULT_JOURNEY_CONFIG,
    lookbackDays: 90,
    maxTouchpoints: 100,
  } as JourneyBuilderConfig,

  /**
   * Extended journey (180 days)
   * Good for enterprise sales or complex B2B
   */
  EXTENDED: {
    ...DEFAULT_JOURNEY_CONFIG,
    lookbackDays: 180,
    maxTouchpoints: 150,
  } as JourneyBuilderConfig,
};

/**
 * Calculate attribution weight for a touchpoint based on model
 */
export function calculateAttributionWeight(
  model: AttributionModel,
  touchpointIndex: number,
  totalTouchpoints: number,
  touchpointTimestamp: Date,
  conversionTimestamp: Date,
): number {
  switch (model) {
    case "FIRST_TOUCH":
      // 100% to first touchpoint
      return touchpointIndex === 0 ? 1.0 : 0.0;

    case "LAST_TOUCH":
      // 100% to last touchpoint
      return touchpointIndex === totalTouchpoints - 1 ? 1.0 : 0.0;

    case "LINEAR":
      // Equal weight to all touchpoints
      return 1.0 / totalTouchpoints;

    case "TIME_DECAY":
      // Exponential decay - more recent touchpoints get more credit
      // Half-life of 7 days
      const daysSinceTouch =
        (conversionTimestamp.getTime() - touchpointTimestamp.getTime()) / (1000 * 60 * 60 * 24);
      const halfLife = 7;
      const weight = Math.pow(2, -daysSinceTouch / halfLife);

      // Normalize weights (will be done across all touchpoints)
      return weight;

    case "POSITION_BASED":
      // 40% to first, 40% to last, 20% distributed to middle
      if (totalTouchpoints === 1) {
        return 1.0;
      }
      if (totalTouchpoints === 2) {
        return 0.5;
      }
      if (touchpointIndex === 0) {
        return 0.4;
      }
      if (touchpointIndex === totalTouchpoints - 1) {
        return 0.4;
      }
      // Middle touchpoints share 20%
      const middleTouchpoints = totalTouchpoints - 2;
      return 0.2 / middleTouchpoints;

    case "DATA_DRIVEN":
      // Placeholder for ML-based attribution
      // For now, use linear as fallback
      return 1.0 / totalTouchpoints;

    default:
      return 1.0 / totalTouchpoints;
  }
}

/**
 * Normalize attribution weights so they sum to 1.0
 */
export function normalizeWeights(weights: number[]): number[] {
  const sum = weights.reduce((acc, w) => acc + w, 0);
  if (sum === 0) {
    return weights.map(() => 1.0 / weights.length);
  }
  return weights.map((w) => w / sum);
}

/**
 * Get configuration from environment or use defaults
 */
export function getJourneyConfig(): JourneyBuilderConfig {
  const preset = process.env.JOURNEY_PRESET as keyof typeof JOURNEY_PRESETS | undefined;

  if (preset && JOURNEY_PRESETS[preset]) {
    return JOURNEY_PRESETS[preset];
  }

  return {
    lookbackDays: parseInt(process.env.JOURNEY_LOOKBACK_DAYS || "30", 10),
    minTouchpoints: parseInt(process.env.JOURNEY_MIN_TOUCHPOINTS || "1", 10),
    maxTouchpoints: parseInt(process.env.JOURNEY_MAX_TOUCHPOINTS || "50", 10),
    sessionTimeoutMinutes: parseInt(process.env.JOURNEY_SESSION_TIMEOUT || "30", 10),
    includePageViews: process.env.JOURNEY_INCLUDE_PAGE_VIEWS === "true",
    attributionModels: (process.env.JOURNEY_ATTRIBUTION_MODELS || "FIRST_TOUCH,LAST_TOUCH,LINEAR")
      .split(",")
      .map((m) => m.trim() as AttributionModel),
    rebuildExisting: process.env.JOURNEY_REBUILD_EXISTING === "true",
    batchSize: parseInt(process.env.JOURNEY_BATCH_SIZE || "100", 10),
  };
}
