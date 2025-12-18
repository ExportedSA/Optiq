-- Unified cost facts (campaign/adset/ad/adgroup) for multi-platform spend sync

DO $$ BEGIN
  CREATE TYPE "CostGrain" AS ENUM ('CAMPAIGN', 'ADSET', 'AD', 'ADGROUP');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS "CostFact" (
  "id" TEXT PRIMARY KEY,
  "organizationId" TEXT NOT NULL,
  "platformId" TEXT NOT NULL,
  "adAccountId" TEXT NOT NULL,
  "date" DATE NOT NULL,

  "grain" "CostGrain" NOT NULL,
  "entityExternalId" TEXT NOT NULL,
  "entityName" TEXT,

  "campaignExternalId" TEXT,
  "campaignName" TEXT,
  "adsetExternalId" TEXT,
  "adsetName" TEXT,
  "adExternalId" TEXT,
  "adName" TEXT,

  "publisherPlatform" TEXT,

  "impressions" BIGINT NOT NULL DEFAULT 0,
  "clicks" BIGINT NOT NULL DEFAULT 0,
  "spendMicros" BIGINT NOT NULL DEFAULT 0,
  "conversions" BIGINT NOT NULL DEFAULT 0,
  "revenueMicros" BIGINT NOT NULL DEFAULT 0,

  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL,

  CONSTRAINT "CostFact_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE,
  CONSTRAINT "CostFact_platformId_fkey" FOREIGN KEY ("platformId") REFERENCES "Platform"("id") ON DELETE RESTRICT,
  CONSTRAINT "CostFact_adAccountId_fkey" FOREIGN KEY ("adAccountId") REFERENCES "AdAccount"("id") ON DELETE CASCADE,

  CONSTRAINT "CostFact_unique" UNIQUE ("organizationId", "platformId", "adAccountId", "date", "grain", "entityExternalId", "publisherPlatform")
);

CREATE INDEX IF NOT EXISTS "CostFact_org_date_idx" ON "CostFact" ("organizationId", "date");
CREATE INDEX IF NOT EXISTS "CostFact_org_platform_date_idx" ON "CostFact" ("organizationId", "platformId", "date");
CREATE INDEX IF NOT EXISTS "CostFact_account_date_idx" ON "CostFact" ("adAccountId", "date");
