/**
 * Attribution Service
 *
 * Implements multiple attribution models for marketing attribution:
 * - Last-Click (LAST_TOUCH)
 * - First-Click (FIRST_TOUCH)
 * - Linear
 * - Time-Decay (configurable half-life)
 * - Position-Based (40/20/40)
 */
/**
 * Attribution model types
 */
export type AttributionModel = "FIRST_TOUCH" | "LAST_TOUCH" | "LINEAR" | "TIME_DECAY" | "POSITION_BASED" | "DATA_DRIVEN";
/**
 * Touchpoint for attribution calculation
 */
export interface AttributionTouchpoint {
    id: string;
    occurredAt: Date;
    utmSource?: string | null;
    utmMedium?: string | null;
    utmCampaign?: string | null;
    platformCode?: string | null;
    campaignId?: string | null;
    adId?: string | null;
}
/**
 * Attribution result for a single touchpoint
 */
export interface TouchpointAttribution {
    touchpointId: string;
    model: AttributionModel;
    weight: number;
    credit: number;
    position: number;
}
/**
 * Complete attribution result for a conversion
 */
export interface AttributionResult {
    conversionId: string;
    conversionValue: number;
    totalTouchpoints: number;
    attributions: TouchpointAttribution[];
}
/**
 * Attribution configuration
 */
export interface AttributionConfig {
    /**
     * Half-life for time-decay model in days
     * Default: 7 days
     */
    timeDecayHalfLife?: number;
    /**
     * Position-based model weights
     * Default: { first: 0.4, middle: 0.2, last: 0.4 }
     */
    positionBasedWeights?: {
        first: number;
        middle: number;
        last: number;
    };
}
/**
 * Calculate attribution weight for a touchpoint based on model
 */
export declare function calculateAttributionWeight(model: AttributionModel, touchpointIndex: number, totalTouchpoints: number, touchpointTimestamp: Date, conversionTimestamp: Date, config?: AttributionConfig): number;
/**
 * Normalize attribution weights so they sum to 1.0
 */
export declare function normalizeWeights(weights: number[]): number[];
/**
 * Calculate attribution for a conversion across all touchpoints
 */
export declare function calculateAttribution(conversionId: string, conversionValue: number, touchpoints: AttributionTouchpoint[], conversionTimestamp: Date, model: AttributionModel, config?: AttributionConfig): AttributionResult;
/**
 * Calculate attribution for multiple models simultaneously
 */
export declare function calculateMultiModelAttribution(conversionId: string, conversionValue: number, touchpoints: AttributionTouchpoint[], conversionTimestamp: Date, models: AttributionModel[], config?: AttributionConfig): Map<AttributionModel, AttributionResult>;
/**
 * Persist attribution results to database
 */
export declare function persistAttributionResults(siteId: string, conversionId: string, results: Map<AttributionModel, AttributionResult>): Promise<void>;
/**
 * Get attribution results for a conversion from database
 */
export declare function getAttributionResults(conversionId: string, model?: AttributionModel): Promise<TouchpointAttribution[]>;
/**
 * Compare attribution results across models
 */
export declare function compareAttributionModels(results: Map<AttributionModel, AttributionResult>): {
    model: AttributionModel;
    topTouchpoint: string;
    topTouchpointCredit: number;
    creditDistribution: {
        min: number;
        max: number;
        avg: number;
    };
}[];
/**
 * Validate attribution results
 * Ensures weights sum to 1.0 and credits sum to conversion value
 */
export declare function validateAttributionResult(result: AttributionResult): {
    valid: boolean;
    errors: string[];
};
/**
 * Get attribution summary statistics
 */
export declare function getAttributionStats(result: AttributionResult): {
    model: AttributionModel;
    totalCredit: number;
    avgCreditPerTouchpoint: number;
    maxCredit: number;
    minCredit: number;
    touchpointsWithCredit: number;
    concentrationRatio: number;
};
//# sourceMappingURL=attribution.d.ts.map