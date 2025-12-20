/**
 * Daily Usage Aggregation Job
 *
 * Runs daily to:
 * 1. Aggregate daily event counts from tracking events
 * 2. Snapshot resource counts (connectors, campaigns)
 * 3. Update UsageRecord for billing period
 * 4. Calculate overages for invoicing
 */
export declare function runUsageAggregation(): Promise<void>;
export declare function getUsageHistory(organizationId: string, days?: number): Promise<any[]>;
export declare function getAuditLog(organizationId: string, limit?: number): Promise<any[]>;
//# sourceMappingURL=usage-aggregation.d.ts.map