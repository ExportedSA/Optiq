import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { hashIpAddress, getClientIp } from "@/lib/tracking/ip-hash";
import { checkTrackingRateLimit } from "@/lib/tracking/rate-limit";
import { createAttributionCandidates } from "@/lib/attribution/attribution-candidates";

// Single event schema
const EventSchema = z.object({
  publicKey: z.string().min(1),
  eventId: z.string().min(8).max(128),
  type: z.enum(["PAGE_VIEW", "CONVERSION", "CUSTOM"]),
  name: z.string().min(1).max(200).optional(),
  url: z.string().url(),
  path: z.string().min(1).max(2048),
  referrer: z.string().url().optional().nullable(),
  title: z.string().max(512).optional().nullable(),
  occurredAt: z.string().datetime().optional(),
  anonId: z.string().min(8).max(128).optional(),
  sessionId: z.string().min(8).max(128).optional(),
  utmSource: z.string().max(200).optional().nullable(),
  utmMedium: z.string().max(200).optional().nullable(),
  utmCampaign: z.string().max(200).optional().nullable(),
  utmTerm: z.string().max(200).optional().nullable(),
  utmContent: z.string().max(200).optional().nullable(),
  properties: z.record(z.string(), z.unknown()).optional(),
  value: z.number().optional(), // For CONVERSION events
});

// Batch payload schema
const BatchPayloadSchema = z.object({
  publicKey: z.string().min(1),
  events: z.array(EventSchema).min(1).max(100), // Max 100 events per batch
});

export async function POST(req: Request) {
  const origin = req.headers.get("origin") ?? undefined;
  const userAgent = req.headers.get("user-agent") ?? undefined;
  const clientIp = getClientIp(req);
  const ipHash = clientIp ? hashIpAddress(clientIp) : undefined;

  try {
    // Parse request body
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { error: "Invalid JSON" },
        { status: 400, headers: getCorsHeaders(origin) }
      );
    }

    // Try to parse as batch first, then fall back to single event
    let events: z.infer<typeof EventSchema>[];
    let publicKey: string;

    const batchParsed = BatchPayloadSchema.safeParse(body);
    if (batchParsed.success) {
      events = batchParsed.data.events;
      publicKey = batchParsed.data.publicKey;
    } else {
      // Try single event
      const singleParsed = EventSchema.safeParse(body);
      if (!singleParsed.success) {
        return NextResponse.json(
          { error: "Validation failed", details: singleParsed.error.issues },
          { status: 400, headers: getCorsHeaders(origin) }
        );
      }
      events = [singleParsed.data];
      publicKey = singleParsed.data.publicKey;
    }

    // Validate publicKey and get site
    const site = await prisma.trackingSite.findUnique({
      where: { publicKey },
      select: { id: true, domain: true, organizationId: true },
    });

    if (!site) {
      return NextResponse.json(
        { error: "Invalid public key" },
        { status: 401, headers: getCorsHeaders(origin) }
      );
    }

    // Validate origin matches site domain
    if (origin) {
      try {
        const originUrl = new URL(origin);
        const host = originUrl.hostname.toLowerCase();
        const allowed = site.domain.toLowerCase();
        if (host !== allowed && !host.endsWith(`.${allowed}`)) {
          return NextResponse.json(
            { error: "Origin not allowed" },
            { status: 403, headers: getCorsHeaders(origin) }
          );
        }
      } catch {
        return NextResponse.json(
          { error: "Invalid origin" },
          { status: 400, headers: getCorsHeaders(origin) }
        );
      }
    }

    // Check rate limit
    const rateLimit = await checkTrackingRateLimit(site.id, events.length);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { 
          error: "Rate limit exceeded",
          limit: rateLimit.limit,
          resetAt: rateLimit.resetAt,
        },
        { 
          status: 429,
          headers: {
            ...getCorsHeaders(origin),
            "X-RateLimit-Limit": rateLimit.limit.toString(),
            "X-RateLimit-Remaining": rateLimit.remaining.toString(),
            "X-RateLimit-Reset": rateLimit.resetAt.toISOString(),
          },
        }
      );
    }

    // Process events
    let accepted = 0;
    let deduped = 0;
    const conversionIds: string[] = [];

    for (const event of events) {
      try {
        const occurredAt = event.occurredAt ? new Date(event.occurredAt) : new Date();
        
        // Generate anonId and sessionId if not provided
        const anonId = event.anonId || `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const sessionId = event.sessionId || `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        // Convert value to micros for CONVERSION events
        const valueMicros = event.type === "CONVERSION" && event.value
          ? BigInt(Math.round(event.value * 1_000_000))
          : undefined;

        const createdEvent = await prisma.trackingEvent.create({
          data: {
            siteId: site.id,
            eventId: event.eventId,
            type: event.type,
            name: event.name,
            occurredAt,
            url: event.url,
            path: event.path,
            referrer: event.referrer,
            title: event.title,
            utmSource: event.utmSource,
            utmMedium: event.utmMedium,
            utmCampaign: event.utmCampaign,
            utmTerm: event.utmTerm,
            utmContent: event.utmContent,
            anonId,
            sessionId,
            userAgent,
            ipHash,
            valueMicros,
            properties: event.properties as any,
          },
        });

        accepted++;

        // If this is a conversion event, track it for attribution candidate creation
        if (event.type === "CONVERSION") {
          conversionIds.push(createdEvent.id);
        }
      } catch (error: any) {
        // Check if it's a unique constraint violation (duplicate eventId)
        if (error.code === "P2002") {
          deduped++;
        } else {
          // Log other errors but continue processing
          console.error("Failed to create tracking event:", error);
        }
      }
    }

    // Create attribution link candidates for conversion events
    // This runs asynchronously after the response to avoid blocking
    if (conversionIds.length > 0) {
      // Fire and forget - don't wait for attribution candidates
      Promise.all(
        conversionIds.map(conversionId => 
          createAttributionCandidates(conversionId).catch(err => 
            console.error(`Failed to create attribution candidates for ${conversionId}:`, err)
          )
        )
      ).catch(err => console.error("Attribution candidate creation failed:", err));
    }

    return NextResponse.json(
      { 
        success: true,
        accepted,
        deduped,
        total: events.length,
      },
      { 
        status: 200,
        headers: {
          ...getCorsHeaders(origin),
          "X-RateLimit-Limit": rateLimit.limit.toString(),
          "X-RateLimit-Remaining": rateLimit.remaining.toString(),
          "X-RateLimit-Reset": rateLimit.resetAt.toISOString(),
        },
      }
    );
  } catch (error) {
    console.error("Tracking endpoint error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers: getCorsHeaders(origin) }
    );
  }
}

function getCorsHeaders(origin?: string): Record<string, string> {
  return {
    "Access-Control-Allow-Origin": origin ?? "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

export async function OPTIONS(req: Request) {
  const origin = req.headers.get("origin") ?? "*";
  return new NextResponse(null, {
    status: 204,
    headers: {
      ...getCorsHeaders(origin),
      "Access-Control-Max-Age": "86400",
    },
  });
}
