import { NextResponse } from "next/server";
import { z } from "zod";

import { requireActiveOrgId } from "@/lib/tenant";
import { enqueueDailySync } from "@/lib/ingestion/scheduler";

const EnqueueSchema = z.object({
  platform: z.enum(["GOOGLE_ADS", "META", "TIKTOK"]),
  externalAccountId: z.string().min(1),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  granularity: z.enum(["campaign", "ad"]).default("campaign"),
  runAt: z.string().datetime().optional(),
});

export async function POST(req: Request) {
  const organizationId = await requireActiveOrgId();
  const json = await req.json().catch(() => null);
  const parsed = EnqueueSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const job = await enqueueDailySync({
    organizationId,
    payload: {
      platform: parsed.data.platform,
      externalAccountId: parsed.data.externalAccountId,
      startDate: parsed.data.startDate,
      endDate: parsed.data.endDate,
      granularity: parsed.data.granularity,
    },
    runAt: parsed.data.runAt ? new Date(parsed.data.runAt) : undefined,
  });

  return NextResponse.json(job, { status: 201 });
}
