import crypto from "node:crypto";
import { PrismaClient } from "@prisma/client";
import { BatchConversionRequestSchema, } from "../schemas/conversion";
import { createEventIngestionRateLimiter } from "../../middleware/rate-limit";
const prisma = new PrismaClient();
/**
 * SHA-256 hash for sensitive data
 */
function sha256hex(input) {
    return crypto.createHash("sha256").update(input).digest("hex");
}
/**
 * Extract IP address from request
 */
function getClientIp(req) {
    const forwarded = req.headers["x-forwarded-for"];
    if (forwarded) {
        return forwarded.split(",")[0].trim();
    }
    const realIp = req.headers["x-real-ip"];
    if (realIp) {
        return realIp;
    }
    return req.ip || "";
}
/**
 * Convert value to micros (1/1,000,000 of base unit)
 */
function valueToMicros(value) {
    return BigInt(Math.round(value * 1_000_000));
}
/**
 * Normalize email for hashing (lowercase, trim)
 */
export function normalizeEmail(email) {
    return email.toLowerCase().trim();
}
/**
 * Normalize phone for hashing (E.164 format: +[country code][number])
 */
export function normalizePhone(phone) {
    // Remove all non-digit characters except leading +
    let normalized = phone.replace(/[^\d+]/g, "");
    // Ensure it starts with +
    if (!normalized.startsWith("+")) {
        // Assume US number if no country code
        normalized = "+1" + normalized;
    }
    return normalized;
}
/**
 * Hash customer email (SHA-256)
 */
export function hashEmail(email) {
    return sha256hex(normalizeEmail(email));
}
/**
 * Hash customer phone (SHA-256)
 */
export function hashPhone(phone) {
    return sha256hex(normalizePhone(phone));
}
/**
 * Process a single conversion and insert into database
 */
async function processConversion(conversion, siteId, organizationId, ip, userAgent) {
    try {
        const occurredAt = conversion.timestamp ? new Date(conversion.timestamp) : new Date();
        const ipHash = ip ? sha256hex(ip) : null;
        const valueMicros = valueToMicros(conversion.value);
        // Create tracking event for the conversion
        const trackingEventId = crypto.randomUUID();
        // Insert tracking event with conversion data
        const eventResult = await prisma.$executeRaw `
      INSERT INTO "TrackingEvent" (
        "id",
        "siteId",
        "eventId",
        "type",
        "name",
        "occurredAt",
        "url",
        "path",
        "referrer",
        "title",
        "utmSource",
        "utmMedium",
        "utmCampaign",
        "utmTerm",
        "utmContent",
        "anonId",
        "sessionId",
        "userAgent",
        "ipHash",
        "valueMicros",
        "properties"
      ) VALUES (
        ${trackingEventId},
        ${siteId},
        ${conversion.conversionId},
        'CONVERSION'::"TrackingEventType",
        ${conversion.conversionName},
        ${occurredAt},
        ${conversion.source?.landingPage ?? "https://unknown.com"},
        ${"/conversion"},
        ${conversion.source?.referrer ?? null},
        ${conversion.conversionName},
        ${conversion.source?.utmSource ?? null},
        ${conversion.source?.utmMedium ?? null},
        ${conversion.source?.utmCampaign ?? null},
        ${conversion.source?.utmTerm ?? null},
        ${conversion.source?.utmContent ?? null},
        ${conversion.anonymousId},
        ${conversion.sessionId},
        ${userAgent},
        ${ipHash},
        ${valueMicros},
        ${JSON.stringify({
            orderId: conversion.orderId,
            currency: conversion.currency,
            customer: conversion.customer,
            lineItems: conversion.lineItems,
            source: conversion.source,
            ...conversion.properties,
        })}
      )
      ON CONFLICT ("siteId", "eventId") DO NOTHING
    `;
        // Check if event was inserted
        const eventInserted = eventResult === 1;
        if (!eventInserted) {
            return {
                success: true,
                duplicate: true,
            };
        }
        // If orderId is provided, also check for order-level deduplication
        // This allows multiple conversion events for the same order (e.g., upsells)
        // but tracks them separately
        // Create touchpoint if click IDs are present
        if (conversion.source?.gclid || conversion.source?.fbclid || conversion.source?.ttclid) {
            await prisma.touchPoint.create({
                data: {
                    siteId,
                    anonId: conversion.anonymousId,
                    sessionId: conversion.sessionId,
                    occurredAt,
                    utmSource: conversion.source?.utmSource ?? null,
                    utmMedium: conversion.source?.utmMedium ?? null,
                    utmCampaign: conversion.source?.utmCampaign ?? null,
                    gclid: conversion.source?.gclid ?? null,
                    fbclid: conversion.source?.fbclid ?? null,
                    ttclid: conversion.source?.ttclid ?? null,
                    referrer: conversion.source?.referrer ?? null,
                    landingUrl: conversion.source?.landingPage ?? null,
                },
            });
        }
        return {
            success: true,
            duplicate: false,
        };
    }
    catch (error) {
        return {
            success: false,
            duplicate: false,
            error: error instanceof Error ? error.message : "Unknown error",
        };
    }
}
/**
 * Register conversion ingestion routes
 */
export async function registerConversionRoutes(app) {
    // Apply rate limiting to conversion ingestion endpoint
    const rateLimitConfig = createEventIngestionRateLimiter();
    /**
     * POST /api/conversions
     *
     * Batch conversion ingestion endpoint
     *
     * Authentication: Site public key (siteKey in request body)
     * Rate limit: 100 requests per minute per workspace
     *
     * Request body:
     * {
     *   "siteKey": "site_abc123",
     *   "conversions": [
     *     {
     *       "conversionId": "conv_123",
     *       "orderId": "ORD-12345",
     *       "conversionName": "Purchase",
     *       "value": 149.99,
     *       "currency": "USD",
     *       "customer": {
     *         "emailHash": "abc123...",
     *         "customerId": "cust_123"
     *       },
     *       "anonymousId": "anon_123",
     *       "sessionId": "sess_123",
     *       "source": {
     *         "utmSource": "google",
     *         "utmCampaign": "summer_sale",
     *         "gclid": "abc123"
     *       },
     *       "lineItems": [
     *         {
     *           "productId": "PROD-001",
     *           "quantity": 2,
     *           "unitPrice": 74.99,
     *           "totalPrice": 149.98
     *         }
     *       ]
     *     }
     *   ]
     * }
     *
     * Response:
     * {
     *   "success": true,
     *   "accepted": 10,
     *   "rejected": 0,
     *   "duplicates": 2
     * }
     */
    app.post("/api/conversions", {
        config: {
            rateLimit: rateLimitConfig,
        },
    }, async (req, reply) => {
        const startTime = Date.now();
        // Extract client info
        const ip = getClientIp(req);
        const userAgent = req.headers["user-agent"] ?? null;
        // Validate request body
        const parseResult = BatchConversionRequestSchema.safeParse(req.body);
        if (!parseResult.success) {
            req.log.warn({
                errors: parseResult.error.issues,
                body: req.body,
            }, "Invalid conversion batch request");
            return reply.status(400).send({
                success: false,
                error: "Invalid request",
                message: "Request validation failed",
                details: parseResult.error.issues,
            });
        }
        const { siteKey, conversions } = parseResult.data;
        // Lookup tracking site by public key
        const site = await prisma.trackingSite.findUnique({
            where: { publicKey: siteKey },
            select: {
                id: true,
                organizationId: true,
                domain: true,
            },
        });
        if (!site) {
            req.log.warn({ siteKey }, "Invalid site key");
            return reply.status(401).send({
                success: false,
                error: "Unauthorized",
                message: "Invalid site key",
            });
        }
        // Attach organizationId to request for rate limiting
        req.organizationId = site.organizationId;
        req.log.info({
            siteId: site.id,
            organizationId: site.organizationId,
            conversionCount: conversions.length,
            totalValue: conversions.reduce((sum, c) => sum + c.value, 0),
            currencies: [...new Set(conversions.map((c) => c.currency))],
        }, "Processing conversion batch");
        // Process conversions in parallel with deduplication
        const results = await Promise.all(conversions.map((conversion, index) => processConversion(conversion, site.id, site.organizationId, ip, userAgent)
            .then((result) => ({
            ...result,
            index,
            conversionId: conversion.conversionId,
            orderId: conversion.orderId,
        }))
            .catch((error) => ({
            success: false,
            duplicate: false,
            error: error instanceof Error ? error.message : "Unknown error",
            index,
            conversionId: conversion.conversionId,
            orderId: conversion.orderId,
        }))));
        // Aggregate results
        const accepted = results.filter((r) => r.success && !r.duplicate).length;
        const duplicates = results.filter((r) => r.duplicate).length;
        const rejected = results.filter((r) => !r.success).length;
        const errors = results
            .filter((r) => !r.success)
            .map((r) => ({
            conversionId: r.conversionId,
            orderId: r.orderId,
            index: r.index,
            message: r.error || "Unknown error",
        }));
        const response = {
            success: rejected === 0,
            accepted,
            rejected,
            duplicates,
            ...(errors.length > 0 && { errors }),
        };
        const duration = Date.now() - startTime;
        req.log.info({
            siteId: site.id,
            organizationId: site.organizationId,
            accepted,
            rejected,
            duplicates,
            duration,
        }, "Conversion batch processed");
        // Return 207 Multi-Status if some conversions failed
        const statusCode = rejected > 0 ? 207 : 200;
        return reply.status(statusCode).send(response);
    });
    /**
     * POST /api/conversions/hash
     *
     * Utility endpoint to hash customer identifiers client-side
     *
     * Request body:
     * {
     *   "email": "user@example.com",
     *   "phone": "+1234567890"
     * }
     *
     * Response:
     * {
     *   "emailHash": "abc123...",
     *   "phoneHash": "def456..."
     * }
     */
    app.post("/api/conversions/hash", async (req, reply) => {
        const body = req.body;
        if (!body.email && !body.phone) {
            return reply.status(400).send({
                error: "Bad Request",
                message: "At least one of email or phone is required",
            });
        }
        const result = {};
        if (body.email) {
            result.emailHash = hashEmail(body.email);
        }
        if (body.phone) {
            result.phoneHash = hashPhone(body.phone);
        }
        return reply.status(200).send(result);
    });
    /**
     * GET /api/conversions/health
     *
     * Health check endpoint for conversion ingestion service
     */
    app.get("/api/conversions/health", async (req, reply) => {
        try {
            // Check database connectivity
            await prisma.$queryRaw `SELECT 1`;
            return reply.status(200).send({
                status: "healthy",
                service: "conversion-ingestion",
                timestamp: new Date().toISOString(),
            });
        }
        catch (error) {
            req.log.error({ err: error }, "Conversion ingestion health check failed");
            return reply.status(503).send({
                status: "unhealthy",
                service: "conversion-ingestion",
                error: error instanceof Error ? error.message : "Unknown error",
                timestamp: new Date().toISOString(),
            });
        }
    });
    app.log.info("Conversion ingestion routes registered");
}
//# sourceMappingURL=conversions.js.map