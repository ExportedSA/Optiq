import type { FastifyInstance } from "fastify";
/**
 * Normalize email for hashing (lowercase, trim)
 */
export declare function normalizeEmail(email: string): string;
/**
 * Normalize phone for hashing (E.164 format: +[country code][number])
 */
export declare function normalizePhone(phone: string): string;
/**
 * Hash customer email (SHA-256)
 */
export declare function hashEmail(email: string): string;
/**
 * Hash customer phone (SHA-256)
 */
export declare function hashPhone(phone: string): string;
/**
 * Register conversion ingestion routes
 */
export declare function registerConversionRoutes(app: FastifyInstance): Promise<void>;
//# sourceMappingURL=conversions.d.ts.map