/**
 * Waste Explainability Service
 *
 * Generates detailed explanations for waste flags with full traceability
 * to rules, data, and attribution models.
 */
/**
 * Waste explanation structure
 */
export interface WasteExplanation {
    ruleType: "ZERO_CONVERSIONS" | "CPA_BREACH" | "ROAS_BREACH";
    ruleName: string;
    ruleDescription: string;
    spendWindow: {
        start: Date;
        end: Date;
        totalSpend: number;
    };
    attribution: {
        model: string;
        lookbackDays: number;
    };
    conversions: {
        expected?: number;
        actual: number;
        gap?: number;
        reason: string;
    };
    performance?: {
        actualCpa?: number;
        targetCpa?: number;
        cpaDeviation?: number;
        actualRoas?: number;
        targetRoas?: number;
        roasDeviation?: number;
    };
    supportingData: {
        touchpoints: number;
        impressions: number;
        clicks: number;
        clickThroughRate?: number;
    };
    recommendations: Array<{
        action: string;
        reason: string;
        priority: "high" | "medium" | "low";
    }>;
    generatedAt: Date;
}
/**
 * Generate and store explanation for a waste score
 */
export declare function generateWasteExplanation(wasteScoreId: string): Promise<WasteExplanation>;
/**
 * Get explanation for a waste score
 */
export declare function getWasteExplanation(wasteScoreId: string): Promise<WasteExplanation | null>;
/**
 * Batch generate explanations for all waste scores without explanations
 */
export declare function generateMissingExplanations(organizationId?: string): Promise<{
    generated: number;
    failed: number;
}>;
//# sourceMappingURL=waste-explainability.d.ts.map