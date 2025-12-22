import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { GoogleAdsService } from "@/lib/googleAds";
import { decryptJson, encryptString } from "@/lib/crypto";

type OAuthState = {
  orgId: string;
  customerId: string;
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

  const svc = new GoogleAdsService();
  const tokens = await svc.exchangeCode(code);

  if (!tokens.refresh_token) {
    return NextResponse.json({ error: "missing_refresh_token" }, { status: 400 });
  }

  // Note: Google Ads credentials are stored in IntegrationConnection
  // This legacy endpoint is deprecated - redirect to main callback
  return NextResponse.redirect(new URL("/app", url.origin));
}
