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
export type AttributionModel = "FIRST_TOUCH" | "LAST_TOUCH" | "LINEAR" | "TIME_DECAY" | "POSITION_BASED" | "DATA_DRIVEN";
/**
 * Default configuration
 */
export declare const DEFAULT_JOURNEY_CONFIG: JourneyBuilderConfig;
/**
 * Preset configurations for common use cases
 */
export declare const JOURNEY_PRESETS: {
    /**
     * Short journey (7 days)
     * Good for fast-moving products or short sales cycles
     */
    SHORT: JourneyBuilderConfig;
    /**
     * Standard journey (30 days)
     * Good for most e-commerce and SaaS products
     */
    STANDARD: JourneyBuilderConfig;
    /**
     * Long journey (90 days)
     * Good for high-consideration purchases or B2B
     */
    LONG: JourneyBuilderConfig;
    /**
     * Extended journey (180 days)
     * Good for enterprise sales or complex B2B
     */
    EXTENDED: JourneyBuilderConfig;
};
/**
 * Calculate attribution weight for a touchpoint based on model
 */
export declare function calculateAttributionWeight(model: AttributionModel, touchpointIndex: number, totalTouchpoints: number, touchpointTimestamp: Date, conversionTimestamp: Date): number;
/**
 * Normalize attribution weights so they sum to 1.0
 */
export declare function normalizeWeights(weights: number[]): number[];
/**
 * Get configuration from environment or use defaults
 */
export declare function getJourneyConfig(): JourneyBuilderConfig;
//# sourceMappingURL=journey-builder.d.ts.map