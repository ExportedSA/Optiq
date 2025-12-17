import { NextResponse } from "next/server";

import { requireActiveOrgId } from "@/lib/tenant";
import { encryptJson } from "@/lib/crypto";
import { MetaAdsService } from "@/lib/metaAds";

export async function GET(req: Request) {
  const orgId = await requireActiveOrgId();

  const url = new URL(req.url);
  const metaAdAccountId = url.searchParams.get("adAccountId");

  if (!metaAdAccountId) {
    return NextResponse.json({ error: "missing_adAccountId" }, { status: 400 });
  }

  const state = encryptJson({
    orgId,
    metaAdAccountId,
    ts: Date.now(),
  });

  const svc = new MetaAdsService();
  const authUrl = svc.buildAuthUrl(state);
  return NextResponse.redirect(authUrl);
}
