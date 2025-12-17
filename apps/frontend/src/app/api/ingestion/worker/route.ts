import { NextResponse } from "next/server";
import { z } from "zod";

import { runDueJobs } from "@/lib/ingestion/worker";

const WorkerSchema = z.object({
  limit: z.number().int().min(1).max(50).default(10),
  workerId: z.string().min(1),
});

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = WorkerSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const result = await runDueJobs({
    limit: parsed.data.limit,
    workerId: parsed.data.workerId,
  });

  return NextResponse.json(result, { status: 200 });
}
