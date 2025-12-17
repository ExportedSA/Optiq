import crypto from "node:crypto";

import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

const EventSchema = z.object({
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

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "";

  const ua = req.headers.get("user-agent") ?? undefined;
  const origin = req.headers.get("origin") ?? undefined;

  const body = await req.json().catch(() => null);
  const parsed = EventSchema.safeParse(body);

  if (!parsed.success) {
    return new NextResponse(null, { status: 204 });
  }

  const site = await prisma.trackingSite.findUnique({
    where: { publicKey: parsed.data.k },
    select: { id: true, domain: true },
  });

  if (!site) {
    return new NextResponse(null, { status: 204 });
  }

  if (origin) {
    try {
      const o = new URL(origin);
      const host = o.hostname.toLowerCase();
      const allowed = site.domain.toLowerCase();
      if (host !== allowed && !host.endsWith(`.${allowed}`)) {
        return new NextResponse(null, { status: 204 });
      }
    } catch {
      return new NextResponse(null, { status: 204 });
    }
  }

  const occurredAt = parsed.data.ts ? new Date(parsed.data.ts) : new Date();

  const ipHash = ip ? sha256hex(ip) : undefined;

  try {
    await prisma.trackingEvent.create({
      data: {
        siteId: site.id,
        eventId: parsed.data.eid,
        type: parsed.data.t,
        name: parsed.data.n,
        occurredAt,
        url: parsed.data.u,
        path: parsed.data.p,
        referrer: parsed.data.r,
        title: parsed.data.ti,
        utmSource: parsed.data.utm?.source,
        utmMedium: parsed.data.utm?.medium,
        utmCampaign: parsed.data.utm?.campaign,
        utmTerm: parsed.data.utm?.term,
        utmContent: parsed.data.utm?.content,
        anonId: parsed.data.aid,
        sessionId: parsed.data.sid,
        userAgent: ua,
        ipHash,
        properties: parsed.data.props as any,
      },
      select: { id: true },
    });
  } catch {
    // idempotency via unique(siteId,eventId)
  }

  return new NextResponse(null, {
    status: 204,
    headers: {
      "access-control-allow-origin": origin ?? "*",
      "access-control-allow-methods": "POST, OPTIONS",
      "access-control-allow-headers": "content-type",
    },
  });
}

export async function OPTIONS(req: Request) {
  const origin = req.headers.get("origin") ?? "*";
  return new NextResponse(null, {
    status: 204,
    headers: {
      "access-control-allow-origin": origin,
      "access-control-allow-methods": "POST, OPTIONS",
      "access-control-allow-headers": "content-type",
      "access-control-max-age": "86400",
    },
  });
}
