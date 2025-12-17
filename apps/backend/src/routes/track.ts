import crypto from "node:crypto";

import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

import { pool } from "../db";

const TrackSchema = z.object({
  k: z.string().min(1),
  eid: z.string().min(8).max(128),
  t: z.enum(["PAGE_VIEW", "CONVERSION"]),
  n: z.string().min(1).max(200).optional(),
  u: z.string().url(),
  p: z.string().min(1).max(2048),
  r: z.string().url().optional(),
  ti: z.string().max(512).optional(),
  ts: z.number().int().optional(),
  aid: z.string().min(8).max(128),
  sid: z.string().min(8).max(128),
  utm: z
    .object({
      source: z.string().max(200).optional(),
      medium: z.string().max(200).optional(),
      campaign: z.string().max(200).optional(),
      term: z.string().max(200).optional(),
      content: z.string().max(200).optional(),
    })
    .optional(),
  props: z.record(z.string(), z.unknown()).optional(),
});

function sha256hex(input: string): string {
  return crypto.createHash("sha256").update(input).digest("hex");
}

function corsHeaders(origin: string | undefined) {
  return {
    "access-control-allow-origin": origin ?? "*",
    "access-control-allow-methods": "POST, OPTIONS",
    "access-control-allow-headers": "content-type",
  } as const;
}

export async function registerTrackRoutes(app: FastifyInstance) {
  app.options("/track", async (req: FastifyRequest, reply: FastifyReply) => {
    const origin = req.headers.origin as string | undefined;
    reply.headers({
      ...corsHeaders(origin),
      "access-control-max-age": "86400",
    });
    return reply.status(204).send();
  });

  app.post("/track", async (req: FastifyRequest, reply: FastifyReply) => {
    const origin = req.headers.origin as string | undefined;

    const ip =
      (req.headers["x-forwarded-for"] as string | undefined)?.split(",")[0]?.trim() ??
      (req.headers["x-real-ip"] as string | undefined) ??
      (req.ip as string | undefined) ??
      "";

    const ua = (req.headers["user-agent"] as string | undefined) ?? null;

    const parsed = TrackSchema.safeParse(req.body);
    if (!parsed.success) {
      reply.headers(corsHeaders(origin));
      return reply.status(204).send();
    }

    // Lookup site by public key
    const siteRes = await pool.query(
      'SELECT "id", "domain" FROM "TrackingSite" WHERE "publicKey" = $1 LIMIT 1',
      [parsed.data.k],
    );

    if (siteRes.rowCount !== 1) {
      reply.headers(corsHeaders(origin));
      return reply.status(204).send();
    }

    const site = siteRes.rows[0] as { id: string; domain: string };

    // Origin allowlisting (domain or subdomain)
    if (origin) {
      try {
        const o = new URL(origin);
        const host = o.hostname.toLowerCase();
        const allowed = String(site.domain).toLowerCase();
        if (host !== allowed && !host.endsWith(`.${allowed}`)) {
          reply.headers(corsHeaders(origin));
          return reply.status(204).send();
        }
      } catch {
        reply.headers(corsHeaders(origin));
        return reply.status(204).send();
      }
    }

    const occurredAt = parsed.data.ts ? new Date(parsed.data.ts) : new Date();
    const ipHash = ip ? sha256hex(ip) : null;

    // High-throughput insert with idempotency
    await pool.query(
      `INSERT INTO "TrackingEvent" (
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
        "properties"
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20
      )
      ON CONFLICT ("siteId", "eventId") DO NOTHING`,
      [
        crypto.randomUUID(),
        site.id,
        parsed.data.eid,
        parsed.data.t,
        parsed.data.n ?? null,
        occurredAt,
        parsed.data.u,
        parsed.data.p,
        parsed.data.r ?? null,
        parsed.data.ti ?? null,
        parsed.data.utm?.source ?? null,
        parsed.data.utm?.medium ?? null,
        parsed.data.utm?.campaign ?? null,
        parsed.data.utm?.term ?? null,
        parsed.data.utm?.content ?? null,
        parsed.data.aid,
        parsed.data.sid,
        ua,
        ipHash,
        parsed.data.props ? JSON.stringify(parsed.data.props) : null,
      ],
    );

    reply.headers(corsHeaders(origin));
    return reply.status(204).send();
  });
}
