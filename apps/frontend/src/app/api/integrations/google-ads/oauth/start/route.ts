import { NextResponse } from "next/server";

import { requireActiveOrgId } from "@/lib/tenant";
import { GoogleAdsService } from "@/lib/googleAds";
import { encryptJson } from "@/lib/crypto";

export async function GET(req: Request) {
  const orgId = await requireActiveOrgId();

  const url = new URL(req.url);
  const customerId = url.searchParams.get("customerId");

  if (!customerId) {
    return NextResponse.json({ error: "missing_customerId" }, { status: 400 });
  }

  const state = encryptJson({
    orgId,
    customerId,
    ts: Date.now(),
  });

  const svc = new GoogleAdsService();
  const authUrl = svc.buildAuthUrl(state);

  return NextResponse.redirect(authUrl);
}
