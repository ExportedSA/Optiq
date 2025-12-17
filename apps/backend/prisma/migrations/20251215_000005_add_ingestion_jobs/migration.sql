-- Durable ingestion job table for background execution

DO $$ BEGIN
  CREATE TYPE "IngestionJobStatus" AS ENUM ('QUEUED', 'RUNNING', 'SUCCEEDED', 'FAILED', 'CANCELLED');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "IngestionJobType" AS ENUM ('DAILY_SYNC');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS "IngestionJob" (
  "id" TEXT PRIMARY KEY,
  "organizationId" TEXT NOT NULL,
  "platform" "PlatformCode" NOT NULL,
  "jobType" "IngestionJobType" NOT NULL,
  "status" "IngestionJobStatus" NOT NULL DEFAULT 'QUEUED',
  "idempotencyKey" TEXT NOT NULL UNIQUE,
  "payload" JSONB NOT NULL,
  "runAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "attempts" INT NOT NULL DEFAULT 0,
  "maxAttempts" INT NOT NULL DEFAULT 8,
  "lockedAt" TIMESTAMPTZ,
  "lockedBy" TEXT,
  "lastError" TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL,

  CONSTRAINT "IngestionJob_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS "IngestionJob_status_runAt_idx" ON "IngestionJob" ("status", "runAt");
CREATE INDEX IF NOT EXISTS "IngestionJob_org_platform_type_idx" ON "IngestionJob" ("organizationId", "platform", "jobType");
