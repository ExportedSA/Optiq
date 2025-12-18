import { NextResponse } from "next/server";

import {
  getHealthStatus,
  getLivenessStatus,
  getReadinessStatus,
} from "@/lib/observability";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const type = url.searchParams.get("type");

  switch (type) {
    case "live":
    case "liveness":
      return NextResponse.json(getLivenessStatus());

    case "ready":
    case "readiness":
      const readiness = await getReadinessStatus();
      return NextResponse.json(readiness, {
        status: readiness.ready ? 200 : 503,
      });

    default:
      const health = await getHealthStatus();
      return NextResponse.json(health, {
        status: health.status === "healthy" ? 200 : health.status === "degraded" ? 200 : 503,
      });
  }
}
