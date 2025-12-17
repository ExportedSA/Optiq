import { NextResponse } from "next/server";

import { requireActiveOrgId } from "@/lib/tenant";
import { encryptJson } from "@/lib/crypto";
import { TikTokAdsService } from "@/lib/tiktokAds";

export async function GET(req: Request) {
  const orgId = await requireActiveOrgId();

  const url = new URL(req.url);
  const advertiserId = url.searchParams.get("advertiserId");

  if (!advertiserId) {
    return NextResponse.json({ error: "missing_advertiserId" }, { status: 400 });
  }

  const state = encryptJson({
    orgId,
    advertiserId,
    ts: Date.now(),
  });

  const svc = new TikTokAdsService();
  const authUrl = svc.buildAuthUrl({ state });
  return NextResponse.redirect(authUrl);
}
