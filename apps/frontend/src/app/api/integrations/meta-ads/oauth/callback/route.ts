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
  const long = await svc.exchangeForLongLivedToken(short.access_token);

  const expiresAt = long.expires_in ? new Date(Date.now() + long.expires_in * 1000) : null;

  await prisma.metaAdsCredential.upsert({
    where: {
      organizationId_adAccountId: {
        organizationId: parsed.orgId,
        adAccountId: parsed.metaAdAccountId,
      },
    },
    create: {
      organizationId: parsed.orgId,
      adAccountId: parsed.metaAdAccountId,
      accessTokenEnc: encryptString(long.access_token),
      accessTokenExpiresAt: expiresAt,
      scope: "ads_read,read_insights,business_management",
    },
    update: {
      accessTokenEnc: encryptString(long.access_token),
      accessTokenExpiresAt: expiresAt,
      scope: "ads_read,read_insights,business_management",
    },
    select: { id: true },
  });

  return NextResponse.redirect(new URL("/app", url.origin));
}
