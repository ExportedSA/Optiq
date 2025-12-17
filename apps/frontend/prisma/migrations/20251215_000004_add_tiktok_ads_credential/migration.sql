-- TikTok Ads credentials for OAuth integration (multi-tenant)

CREATE TABLE IF NOT EXISTS "TikTokAdsCredential" (
  "id" TEXT PRIMARY KEY,
  "organizationId" TEXT NOT NULL,
  "advertiserId" TEXT NOT NULL,
  "accessTokenEnc" TEXT NOT NULL,
  "refreshTokenEnc" TEXT NOT NULL,
  "accessTokenExpiresAt" TIMESTAMPTZ,
  "refreshTokenExpiresAt" TIMESTAMPTZ,
  "scope" TEXT NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL,

  CONSTRAINT "TikTokAdsCredential_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE,
  CONSTRAINT "TikTokAdsCredential_org_advertiser_unique" UNIQUE ("organizationId", "advertiserId")
);

CREATE INDEX IF NOT EXISTS "TikTokAdsCredential_org_idx" ON "TikTokAdsCredential" ("organizationId");
