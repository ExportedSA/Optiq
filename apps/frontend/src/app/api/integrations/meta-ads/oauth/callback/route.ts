import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { decryptJson, encryptString } from "@/lib/crypto";
import { MetaAdsService } from "@/lib/metaAds";

type OAuthState = {
  orgId: string;
  metaAdAccountId: string;
  ts: number;
};

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  if (!code || !state) {
    return NextResponse.json({ error: "missing_code_or_state" }, { status: 400 });
  }

  let parsed: OAuthState;
  try {
    parsed = decryptJson<OAuthState>(state);
  } catch {
    return NextResponse.json({ error: "invalid_state" }, { status: 400 });
  }

  if (Date.now() - parsed.ts > 10 * 60_000) {
    return NextResponse.json({ error: "state_expired" }, { status: 400 });
  }

  const svc = new MetaAdsService();
  const short = await svc.exchangeCode(code);
  // Note: Meta Ads credentials are stored in IntegrationConnection
  // This legacy endpoint is deprecated - redirect to main callback
  return NextResponse.redirect(new URL("/app", url.origin));
}
