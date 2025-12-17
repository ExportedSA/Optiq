import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { decryptJson, encryptString } from "@/lib/crypto";
import { TikTokAdsService } from "@/lib/tiktokAds";

type OAuthState = {
  orgId: string;
  advertiserId: string;
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

  const svc = new TikTokAdsService();
  const tokens = await svc.exchangeCode(code);

  const accessExp = new Date(Date.now() + tokens.expires_in * 1000);
  const refreshExp = new Date(Date.now() + tokens.refresh_expires_in * 1000);

  await prisma.tikTokAdsCredential.upsert({
    where: {
      organizationId_advertiserId: {
        organizationId: parsed.orgId,
        advertiserId: parsed.advertiserId,
      },
    },
    create: {
      organizationId: parsed.orgId,
      advertiserId: parsed.advertiserId,
      accessTokenEnc: encryptString(tokens.access_token),
      refreshTokenEnc: encryptString(tokens.refresh_token),
      accessTokenExpiresAt: accessExp,
      refreshTokenExpiresAt: refreshExp,
      scope: tokens.scope,
    },
    update: {
      accessTokenEnc: encryptString(tokens.access_token),
      refreshTokenEnc: encryptString(tokens.refresh_token),
      accessTokenExpiresAt: accessExp,
      refreshTokenExpiresAt: refreshExp,
      scope: tokens.scope,
    },
    select: { id: true },
  });

  return NextResponse.redirect(new URL("/app", url.origin));
}
