import { type JourneyBuilderConfig } from "../config/journey-builder";
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
export declare function buildJourneyForConversion(conversion: ConversionEvent, config?: JourneyBuilderConfig): Promise<string | null>;
/**
 * Build journeys for all conversions without journeys
 */
export declare function buildMissingJourneys(organizationId?: string, config?: JourneyBuilderConfig): Promise<{
    processed: number;
    created: number;
    skipped: number;
}>;
/**
 * Rebuild journeys for existing conversions
 */
export declare function rebuildJourneys(organizationId?: string, config?: JourneyBuilderConfig): Promise<{
    processed: number;
    rebuilt: number;
    skipped: number;
}>;
/**
 * Build journey for a specific conversion by ID
 */
export declare function buildJourneyById(conversionId: string, config?: JourneyBuilderConfig): Promise<string | null>;
/**
 * Get journey statistics
 */
export declare function getJourneyStats(organizationId?: string): Promise<{
    totalJourneys: number;
    convertedJourneys: number;
    inProgressJourneys: number;
    abandonedJourneys: number;
    conversionsWithoutJourneys: number;
}>;
/**
 * Scheduled job to build journeys
 * Should be run periodically (e.g., every hour)
 */
export declare function runJourneyBuilderJob(config?: JourneyBuilderConfig): Promise<void>;
export {};
//# sourceMappingURL=journey-builder.d.ts.map