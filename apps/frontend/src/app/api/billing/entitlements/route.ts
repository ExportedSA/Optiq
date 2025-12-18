import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { getEntitlements } from "@/lib/stripe";

export async function GET() {
  const session = await getServerSession(authOptions);
  const orgId = session?.user?.activeOrgId;

  if (!orgId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const entitlements = await getEntitlements(orgId);

  return NextResponse.json(entitlements);
}
