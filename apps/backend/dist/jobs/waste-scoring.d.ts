/**
 * Waste Scoring Aggregator
 *
 * Identifies inefficient ad spend by:
 * - Finding spend with zero attributed conversions
 * - Detecting CPA breaches (actual > target)
 * - Detecting ROAS breaches (actual < target)
 * - Computing daily aggregates per workspace/channel
 */
/**
 * Waste scoring configuration
 */
export interface WasteScoringConfig {
    /**
     * Attribution model to use for scoring
     */
    attributionModel: "FIRST_TOUCH" | "LAST_TOUCH" | "LINEAR" | "TIME_DECAY" | "POSITION_BASED";
    /**
     * Target CPA in dollars (optional)
     */
    targetCpa?: number;
    /**
     * Target ROAS (optional)
     */
    targetRoas?: number;
    /**
     * Date to score (defaults to yesterday)
     */
    date?: Date;
}
/**
 * Calculate waste scores for all entities in an organization
 */
export declare function calculateWasteScoresForOrganization(organizationId: string, config?: WasteScoringConfig): Promise<{
    processed: number;
    totalWaste: number;
    cpaBreach: number;
    roasBreach: number;
}>;
/**
 * Get waste score dashboard metrics
 */
export declare function getWasteDashboardMetrics(organizationId: string, startDate: Date, endDate: Date, attributionModel?: string): Promise<{
    totalSpend: number;
    totalWaste: number;
    wastePercent: number;
    cpaBreach: number;
    roasBreach: number;
    topWasteCampaigns: Array<{
        campaignId: string;
        campaignName: string;
        wasteSpend: number;
        wastePercent: number;
    }>;
}>;
/**
 * Run waste scoring job for all organizations
 */
export declare function runWasteScoringJob(config?: WasteScoringConfig): Promise<void>;
//# sourceMappingURL=waste-scoring.d.ts.map