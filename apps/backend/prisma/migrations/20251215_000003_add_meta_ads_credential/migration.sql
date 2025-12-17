-- Meta Ads credentials for OAuth integration (multi-tenant)

CREATE TABLE IF NOT EXISTS "MetaAdsCredential" (
  "id" TEXT PRIMARY KEY,
  "organizationId" TEXT NOT NULL,
  "adAccountId" TEXT NOT NULL,
  "userId" TEXT,
  "accessTokenEnc" TEXT NOT NULL,
  "accessTokenExpiresAt" TIMESTAMPTZ,
  "scope" TEXT NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL,

  CONSTRAINT "MetaAdsCredential_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE,
  CONSTRAINT "MetaAdsCredential_org_account_unique" UNIQUE ("organizationId", "adAccountId")
);

CREATE INDEX IF NOT EXISTS "MetaAdsCredential_org_idx" ON "MetaAdsCredential" ("organizationId");
