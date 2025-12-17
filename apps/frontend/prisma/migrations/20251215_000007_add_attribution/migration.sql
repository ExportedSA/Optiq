-- Attribution schema for multi-touch conversion attribution

DO $$ BEGIN
  CREATE TYPE "AttributionModel" AS ENUM ('FIRST_TOUCH', 'LAST_TOUCH', 'LINEAR', 'TIME_DECAY', 'POSITION_BASED');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS "TouchPoint" (
  "id" TEXT PRIMARY KEY,
  "siteId" TEXT NOT NULL,
  "anonId" TEXT NOT NULL,
  "sessionId" TEXT NOT NULL,
  "occurredAt" TIMESTAMPTZ NOT NULL DEFAULT now(),

  "utmSource" TEXT,
  "utmMedium" TEXT,
  "utmCampaign" TEXT,
  "utmTerm" TEXT,
  "utmContent" TEXT,

  "gclid" TEXT,
  "fbclid" TEXT,
  "ttclid" TEXT,
  "msclkid" TEXT,
  "clickId" TEXT,

  "referrer" TEXT,
  "landingUrl" TEXT,

  "platformCode" TEXT,
  "campaignId" TEXT,
  "adAccountId" TEXT,
  "adId" TEXT,

  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT "TouchPoint_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "TrackingSite"("id") ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS "TouchPoint_site_anon_occurred_idx" ON "TouchPoint" ("siteId", "anonId", "occurredAt");
CREATE INDEX IF NOT EXISTS "TouchPoint_site_gclid_idx" ON "TouchPoint" ("siteId", "gclid");
CREATE INDEX IF NOT EXISTS "TouchPoint_site_fbclid_idx" ON "TouchPoint" ("siteId", "fbclid");
CREATE INDEX IF NOT EXISTS "TouchPoint_site_utm_idx" ON "TouchPoint" ("siteId", "utmSource", "utmCampaign");

CREATE TABLE IF NOT EXISTS "AttributionLink" (
  "id" TEXT PRIMARY KEY,
  "siteId" TEXT NOT NULL,
  "conversionId" TEXT NOT NULL,
  "touchPointId" TEXT NOT NULL,
  "model" "AttributionModel" NOT NULL,
  "weight" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
  "position" INT NOT NULL,
  "touchPointCount" INT NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT "AttributionLink_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "TrackingSite"("id") ON DELETE CASCADE,
  CONSTRAINT "AttributionLink_conversionId_fkey" FOREIGN KEY ("conversionId") REFERENCES "TrackingEvent"("id") ON DELETE CASCADE,
  CONSTRAINT "AttributionLink_touchPointId_fkey" FOREIGN KEY ("touchPointId") REFERENCES "TouchPoint"("id") ON DELETE CASCADE,
  CONSTRAINT "AttributionLink_conversion_touchpoint_model_unique" UNIQUE ("conversionId", "touchPointId", "model")
);

CREATE INDEX IF NOT EXISTS "AttributionLink_site_model_created_idx" ON "AttributionLink" ("siteId", "model", "createdAt");
CREATE INDEX IF NOT EXISTS "AttributionLink_touchpoint_idx" ON "AttributionLink" ("touchPointId");
CREATE INDEX IF NOT EXISTS "AttributionLink_conversion_idx" ON "AttributionLink" ("conversionId");
