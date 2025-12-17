-- Google Ads credentials for OAuth integration (multi-tenant)

CREATE TABLE IF NOT EXISTS "GoogleAdsCredential" (
  "id" TEXT PRIMARY KEY,
  "organizationId" TEXT NOT NULL,
  "customerId" TEXT NOT NULL,
  "refreshTokenEnc" TEXT NOT NULL,
  "accessTokenEnc" TEXT,
  "accessTokenExpiresAt" TIMESTAMPTZ,
  "scope" TEXT NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL,

  CONSTRAINT "GoogleAdsCredential_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE,
  CONSTRAINT "GoogleAdsCredential_org_customer_unique" UNIQUE ("organizationId", "customerId")
);

CREATE INDEX IF NOT EXISTS "GoogleAdsCredential_org_idx" ON "GoogleAdsCredential" ("organizationId");
