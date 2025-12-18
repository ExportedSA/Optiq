import crypto from "node:crypto";
import { PrismaClient } from "@prisma/client";
import { BatchEventRequestSchema, } from "../schemas/event";
import { createEventIngestionRateLimiter } from "../../middleware/rate-limit";
const prisma = new PrismaClient();
/**
 * SHA-256 hash for IP addresses (GDPR compliance)
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
 * Convert event value to micros (1/1,000,000 of base unit)
 */
function valueToMicros(value) {
    if (value === undefined || value === null) {
        return null;
    }
    return BigInt(Math.round(value * 1_000_000));
}
/**
 * Process a single event and insert into database
 */
async function processEvent(event, siteId, ip, userAgent) {
    try {
        const occurredAt = event.timestamp ? new Date(event.timestamp) : new Date();
        const ipHash = ip ? sha256hex(ip) : null;
        const valueMicros = valueToMicros(event.value);
        // Insert with deduplication via unique constraint on (siteId, eventId)
        const result = await prisma.$executeRaw `
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
        ${crypto.randomUUID()},
        ${siteId},
        ${event.eventId},
        ${event.type}::"TrackingEventType",
        ${event.name ?? null},
        ${occurredAt},
        ${event.url},
        ${event.path},
        ${event.referrer ?? null},
        ${event.title ?? null},
        ${event.utm?.source ?? null},
        ${event.utm?.medium ?? null},
        ${event.utm?.campaign ?? null},
        ${event.utm?.term ?? null},
        ${event.utm?.content ?? null},
        ${event.anonymousId},
        ${event.sessionId},
        ${userAgent},
        ${ipHash},
        ${valueMicros},
        ${event.properties ? JSON.stringify(event.properties) : null}
      )
      ON CONFLICT ("siteId", "eventId") DO NOTHING
    `;
        // Check if row was inserted (result = 1) or duplicate (result = 0)
        const inserted = result === 1;
        return {
            success: true,
            duplicate: !inserted,
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
 * Register event ingestion routes
 */
export async function registerEventRoutes(app) {
    // Apply rate limiting to event ingestion endpoint
    const rateLimitConfig = createEventIngestionRateLimiter();
    /**
     * POST /api/events
     *
     * Batch event ingestion endpoint
     *
     * Authentication: Site public key (siteKey in request body)
     * Rate limit: 100 requests per minute per workspace
     *
     * Request body:
     * {
     *   "siteKey": "site_abc123",
     *   "events": [
     *     {
     *       "eventId": "evt_123",
     *       "type": "PAGE_VIEW",
     *       "url": "https://example.com/page",
     *       "path": "/page",
     *       "anonymousId": "anon_123",
     *       "sessionId": "sess_123",
     *       ...
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
    app.post("/api/events", {
        config: {
            rateLimit: rateLimitConfig,
        },
    }, async (req, reply) => {
        const startTime = Date.now();
        // Extract client info
        const ip = getClientIp(req);
        const userAgent = req.headers["user-agent"] ?? null;
        // Validate request body
        const parseResult = BatchEventRequestSchema.safeParse(req.body);
        if (!parseResult.success) {
            req.log.warn({
                errors: parseResult.error.issues,
                body: req.body,
            }, "Invalid event batch request");
            return reply.status(400).send({
                success: false,
                error: "Invalid request",
                message: "Request validation failed",
                details: parseResult.error.issues,
            });
        }
        const { siteKey, events } = parseResult.data;
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
            eventCount: events.length,
        }, "Processing event batch");
        // Process events in parallel with deduplication
        const results = await Promise.all(events.map((event, index) => processEvent(event, site.id, ip, userAgent)
            .then((result) => ({ ...result, index, eventId: event.eventId }))
            .catch((error) => ({
            success: false,
            duplicate: false,
            error: error instanceof Error ? error.message : "Unknown error",
            index,
            eventId: event.eventId,
        }))));
        // Aggregate results
        const accepted = results.filter((r) => r.success && !r.duplicate).length;
        const duplicates = results.filter((r) => r.duplicate).length;
        const rejected = results.filter((r) => !r.success).length;
        const errors = results
            .filter((r) => !r.success)
            .map((r) => ({
            eventId: r.eventId,
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
        }, "Event batch processed");
        // Return 207 Multi-Status if some events failed
        const statusCode = rejected > 0 ? 207 : 200;
        return reply.status(statusCode).send(response);
    });
    /**
     * GET /api/events/health
     *
     * Health check endpoint for event ingestion service
     */
    app.get("/api/events/health", async (req, reply) => {
        try {
            // Check database connectivity
            await prisma.$queryRaw `SELECT 1`;
            return reply.status(200).send({
                status: "healthy",
                service: "event-ingestion",
                timestamp: new Date().toISOString(),
            });
        }
        catch (error) {
            req.log.error({ err: error }, "Event ingestion health check failed");
            return reply.status(503).send({
                status: "unhealthy",
                service: "event-ingestion",
                error: error instanceof Error ? error.message : "Unknown error",
                timestamp: new Date().toISOString(),
            });
        }
    });
    app.log.info("Event ingestion routes registered");
}
//# sourceMappingURL=events.js.map