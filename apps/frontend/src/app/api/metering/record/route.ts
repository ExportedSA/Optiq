import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";

import { authOptions } from "@/lib/auth";
import { recordEvent, recordBatchEvents, type EventType } from "@/lib/metering";

const SingleEventSchema = z.object({
  eventType: z.enum(["page_view", "conversion", "custom_event", "api_request", "webhook_call"]),
  count: z.number().int().positive().optional().default(1),
});

const BatchEventSchema = z.object({
  events: z.array(
    z.object({
      type: z.enum(["page_view", "conversion", "custom_event", "api_request", "webhook_call"]),
      count: z.number().int().positive(),
    })
  ),
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const orgId = session?.user?.activeOrgId;

  if (!orgId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const json = await req.json().catch(() => null);

  // Try batch format first
  const batchParsed = BatchEventSchema.safeParse(json);
  if (batchParsed.success) {
    const result = await recordBatchEvents(
      orgId,
      batchParsed.data.events.map((e) => ({
        type: e.type as EventType,
        count: e.count,
      }))
    );

    if (!result.success) {
      return NextResponse.json(
        {
          error: "throttled",
          message: result.error,
          throttleStatus: result.throttleStatus,
        },
        { status: 429 }
      );
    }

    return NextResponse.json({
      success: true,
      throttleStatus: result.throttleStatus,
    });
  }

  // Try single event format
  const singleParsed = SingleEventSchema.safeParse(json);
  if (singleParsed.success) {
    const result = await recordEvent(
      orgId,
      singleParsed.data.eventType as EventType,
      singleParsed.data.count
    );

    if (!result.success) {
      return NextResponse.json(
        {
          error: "throttled",
          message: result.error,
          throttleStatus: result.throttleStatus,
        },
        { status: 429 }
      );
    }

    return NextResponse.json({
      success: true,
      throttleStatus: result.throttleStatus,
    });
  }

  return NextResponse.json({ error: "invalid_params" }, { status: 400 });
}
