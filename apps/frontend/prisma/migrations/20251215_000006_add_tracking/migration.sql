-- Tracking schema (sites + events)

DO $$ BEGIN
  CREATE TYPE "TrackingEventType" AS ENUM ('PAGE_VIEW', 'CONVERSION');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS "TrackingSite" (
  "id" TEXT PRIMARY KEY,
  "organizationId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "domain" TEXT NOT NULL,
  "publicKey" TEXT NOT NULL UNIQUE,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL,

  CONSTRAINT "TrackingSite_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE,
  CONSTRAINT "TrackingSite_org_domain_unique" UNIQUE ("organizationId", "domain")
);

CREATE INDEX IF NOT EXISTS "TrackingSite_org_idx" ON "TrackingSite" ("organizationId");

CREATE TABLE IF NOT EXISTS "TrackingEvent" (
  "id" TEXT PRIMARY KEY,
  "siteId" TEXT NOT NULL,
  "eventId" TEXT NOT NULL,
  "type" "TrackingEventType" NOT NULL,
  "name" TEXT,
  "occurredAt" TIMESTAMPTZ NOT NULL DEFAULT now(),

  "url" TEXT NOT NULL,
  "path" TEXT NOT NULL,
  "referrer" TEXT,
  "title" TEXT,

  "utmSource" TEXT,
  "utmMedium" TEXT,
  "utmCampaign" TEXT,
  "utmTerm" TEXT,
  "utmContent" TEXT,

  "anonId" TEXT NOT NULL,
  "sessionId" TEXT NOT NULL,

  "userAgent" TEXT,
  "ipHash" TEXT,

  "properties" JSONB,

  CONSTRAINT "TrackingEvent_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "TrackingSite"("id") ON DELETE CASCADE,
  CONSTRAINT "TrackingEvent_site_event_unique" UNIQUE ("siteId", "eventId")
);

CREATE INDEX IF NOT EXISTS "TrackingEvent_site_occurredAt_idx" ON "TrackingEvent" ("siteId", "occurredAt");
CREATE INDEX IF NOT EXISTS "TrackingEvent_site_type_occurredAt_idx" ON "TrackingEvent" ("siteId", "type", "occurredAt");
CREATE INDEX IF NOT EXISTS "TrackingEvent_site_utmSource_occurredAt_idx" ON "TrackingEvent" ("siteId", "utmSource", "occurredAt");
