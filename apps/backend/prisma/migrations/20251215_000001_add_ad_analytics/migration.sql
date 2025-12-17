-- Multi-tenant ad analytics schema
-- Generated to align with prisma/schema.prisma models added for platforms/ad-entities and daily metrics.

-- Enums
DO $$ BEGIN
  CREATE TYPE "PlatformCode" AS ENUM ('META', 'GOOGLE_ADS', 'TIKTOK', 'LINKEDIN', 'X');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "EntityStatus" AS ENUM ('ACTIVE', 'PAUSED', 'ARCHIVED', 'DELETED');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Platform (global reference table)
CREATE TABLE IF NOT EXISTS "Platform" (
  "id" TEXT PRIMARY KEY,
  "code" "PlatformCode" NOT NULL UNIQUE,
  "name" TEXT NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL
);

-- AdAccount (tenant owned)
CREATE TABLE IF NOT EXISTS "AdAccount" (
  "id" TEXT PRIMARY KEY,
  "organizationId" TEXT NOT NULL,
  "platformId" TEXT NOT NULL,
  "externalId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "currency" TEXT NOT NULL,
  "timezone" TEXT NOT NULL,
  "status" "EntityStatus" NOT NULL DEFAULT 'ACTIVE',
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL,

  CONSTRAINT "AdAccount_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE,
  CONSTRAINT "AdAccount_platformId_fkey" FOREIGN KEY ("platformId") REFERENCES "Platform"("id") ON DELETE RESTRICT,
  CONSTRAINT "AdAccount_org_platform_external_unique" UNIQUE ("organizationId", "platformId", "externalId")
);

-- Campaign (tenant owned)
CREATE TABLE IF NOT EXISTS "Campaign" (
  "id" TEXT PRIMARY KEY,
  "organizationId" TEXT NOT NULL,
  "platformId" TEXT NOT NULL,
  "adAccountId" TEXT NOT NULL,
  "externalId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "status" "EntityStatus" NOT NULL DEFAULT 'ACTIVE',
  "objective" TEXT,
  "startDate" DATE,
  "endDate" DATE,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL,

  CONSTRAINT "Campaign_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE,
  CONSTRAINT "Campaign_platformId_fkey" FOREIGN KEY ("platformId") REFERENCES "Platform"("id") ON DELETE RESTRICT,
  CONSTRAINT "Campaign_adAccountId_fkey" FOREIGN KEY ("adAccountId") REFERENCES "AdAccount"("id") ON DELETE CASCADE,
  CONSTRAINT "Campaign_org_platform_external_unique" UNIQUE ("organizationId", "platformId", "externalId")
);

-- Ad (tenant owned)
CREATE TABLE IF NOT EXISTS "Ad" (
  "id" TEXT PRIMARY KEY,
  "organizationId" TEXT NOT NULL,
  "platformId" TEXT NOT NULL,
  "adAccountId" TEXT NOT NULL,
  "campaignId" TEXT NOT NULL,
  "externalId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "status" "EntityStatus" NOT NULL DEFAULT 'ACTIVE',
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL,

  CONSTRAINT "Ad_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE,
  CONSTRAINT "Ad_platformId_fkey" FOREIGN KEY ("platformId") REFERENCES "Platform"("id") ON DELETE RESTRICT,
  CONSTRAINT "Ad_adAccountId_fkey" FOREIGN KEY ("adAccountId") REFERENCES "AdAccount"("id") ON DELETE CASCADE,
  CONSTRAINT "Ad_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE CASCADE,
  CONSTRAINT "Ad_org_platform_external_unique" UNIQUE ("organizationId", "platformId", "externalId")
);

-- DailyAdAccountMetric (time-series, tenant owned)
CREATE TABLE IF NOT EXISTS "DailyAdAccountMetric" (
  "id" TEXT PRIMARY KEY,
  "organizationId" TEXT NOT NULL,
  "platformId" TEXT NOT NULL,
  "adAccountId" TEXT NOT NULL,
  "date" DATE NOT NULL,

  "impressions" BIGINT NOT NULL DEFAULT 0,
  "clicks" BIGINT NOT NULL DEFAULT 0,
  "spendMicros" BIGINT NOT NULL DEFAULT 0,
  "conversions" BIGINT NOT NULL DEFAULT 0,
  "revenueMicros" BIGINT NOT NULL DEFAULT 0,

  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL,

  CONSTRAINT "DailyAdAccountMetric_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE,
  CONSTRAINT "DailyAdAccountMetric_platformId_fkey" FOREIGN KEY ("platformId") REFERENCES "Platform"("id") ON DELETE RESTRICT,
  CONSTRAINT "DailyAdAccountMetric_adAccountId_fkey" FOREIGN KEY ("adAccountId") REFERENCES "AdAccount"("id") ON DELETE CASCADE,
  CONSTRAINT "DailyAdAccountMetric_org_account_date_unique" UNIQUE ("organizationId", "adAccountId", "date")
);

-- DailyCampaignMetric (time-series, tenant owned)
CREATE TABLE IF NOT EXISTS "DailyCampaignMetric" (
  "id" TEXT PRIMARY KEY,
  "organizationId" TEXT NOT NULL,
  "platformId" TEXT NOT NULL,
  "adAccountId" TEXT NOT NULL,
  "campaignId" TEXT NOT NULL,
  "date" DATE NOT NULL,

  "impressions" BIGINT NOT NULL DEFAULT 0,
  "clicks" BIGINT NOT NULL DEFAULT 0,
  "spendMicros" BIGINT NOT NULL DEFAULT 0,
  "conversions" BIGINT NOT NULL DEFAULT 0,
  "revenueMicros" BIGINT NOT NULL DEFAULT 0,

  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL,

  CONSTRAINT "DailyCampaignMetric_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE,
  CONSTRAINT "DailyCampaignMetric_platformId_fkey" FOREIGN KEY ("platformId") REFERENCES "Platform"("id") ON DELETE RESTRICT,
  CONSTRAINT "DailyCampaignMetric_adAccountId_fkey" FOREIGN KEY ("adAccountId") REFERENCES "AdAccount"("id") ON DELETE CASCADE,
  CONSTRAINT "DailyCampaignMetric_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE CASCADE,
  CONSTRAINT "DailyCampaignMetric_org_campaign_date_unique" UNIQUE ("organizationId", "campaignId", "date")
);

-- DailyAdMetric (time-series, tenant owned)
CREATE TABLE IF NOT EXISTS "DailyAdMetric" (
  "id" TEXT PRIMARY KEY,
  "organizationId" TEXT NOT NULL,
  "platformId" TEXT NOT NULL,
  "adAccountId" TEXT NOT NULL,
  "campaignId" TEXT NOT NULL,
  "adId" TEXT NOT NULL,
  "date" DATE NOT NULL,

  "impressions" BIGINT NOT NULL DEFAULT 0,
  "clicks" BIGINT NOT NULL DEFAULT 0,
  "spendMicros" BIGINT NOT NULL DEFAULT 0,
  "conversions" BIGINT NOT NULL DEFAULT 0,
  "revenueMicros" BIGINT NOT NULL DEFAULT 0,

  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL,

  CONSTRAINT "DailyAdMetric_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE,
  CONSTRAINT "DailyAdMetric_platformId_fkey" FOREIGN KEY ("platformId") REFERENCES "Platform"("id") ON DELETE RESTRICT,
  CONSTRAINT "DailyAdMetric_adAccountId_fkey" FOREIGN KEY ("adAccountId") REFERENCES "AdAccount"("id") ON DELETE CASCADE,
  CONSTRAINT "DailyAdMetric_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE CASCADE,
  CONSTRAINT "DailyAdMetric_adId_fkey" FOREIGN KEY ("adId") REFERENCES "Ad"("id") ON DELETE CASCADE,
  CONSTRAINT "DailyAdMetric_org_ad_date_unique" UNIQUE ("organizationId", "adId", "date")
);

-- Indexes for analytics queries (org scoped, date range friendly)
CREATE INDEX IF NOT EXISTS "AdAccount_org_platform_idx" ON "AdAccount" ("organizationId", "platformId");
CREATE INDEX IF NOT EXISTS "AdAccount_platform_idx" ON "AdAccount" ("platformId");

CREATE INDEX IF NOT EXISTS "Campaign_org_account_idx" ON "Campaign" ("organizationId", "adAccountId");
CREATE INDEX IF NOT EXISTS "Campaign_org_platform_idx" ON "Campaign" ("organizationId", "platformId");
CREATE INDEX IF NOT EXISTS "Campaign_account_idx" ON "Campaign" ("adAccountId");

CREATE INDEX IF NOT EXISTS "Ad_org_campaign_idx" ON "Ad" ("organizationId", "campaignId");
CREATE INDEX IF NOT EXISTS "Ad_org_account_idx" ON "Ad" ("organizationId", "adAccountId");
CREATE INDEX IF NOT EXISTS "Ad_campaign_idx" ON "Ad" ("campaignId");

CREATE INDEX IF NOT EXISTS "DailyAdAccountMetric_org_date_idx" ON "DailyAdAccountMetric" ("organizationId", "date");
CREATE INDEX IF NOT EXISTS "DailyAdAccountMetric_org_platform_date_idx" ON "DailyAdAccountMetric" ("organizationId", "platformId", "date");
CREATE INDEX IF NOT EXISTS "DailyAdAccountMetric_account_date_idx" ON "DailyAdAccountMetric" ("adAccountId", "date");

CREATE INDEX IF NOT EXISTS "DailyCampaignMetric_org_date_idx" ON "DailyCampaignMetric" ("organizationId", "date");
CREATE INDEX IF NOT EXISTS "DailyCampaignMetric_org_platform_date_idx" ON "DailyCampaignMetric" ("organizationId", "platformId", "date");
CREATE INDEX IF NOT EXISTS "DailyCampaignMetric_campaign_date_idx" ON "DailyCampaignMetric" ("campaignId", "date");
CREATE INDEX IF NOT EXISTS "DailyCampaignMetric_account_date_idx" ON "DailyCampaignMetric" ("adAccountId", "date");

CREATE INDEX IF NOT EXISTS "DailyAdMetric_org_date_idx" ON "DailyAdMetric" ("organizationId", "date");
CREATE INDEX IF NOT EXISTS "DailyAdMetric_org_platform_date_idx" ON "DailyAdMetric" ("organizationId", "platformId", "date");
CREATE INDEX IF NOT EXISTS "DailyAdMetric_campaign_date_idx" ON "DailyAdMetric" ("campaignId", "date");
CREATE INDEX IF NOT EXISTS "DailyAdMetric_account_date_idx" ON "DailyAdMetric" ("adAccountId", "date");
CREATE INDEX IF NOT EXISTS "DailyAdMetric_ad_date_idx" ON "DailyAdMetric" ("adId", "date");
