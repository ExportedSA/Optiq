-- Create DailyUsageCounter table for storing daily event counts per workspace
CREATE TABLE IF NOT EXISTS "DailyUsageCounter" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "date" DATE NOT NULL,

    -- Event counters
    "pageViews" INTEGER NOT NULL DEFAULT 0,
    "conversions" INTEGER NOT NULL DEFAULT 0,
    "customEvents" INTEGER NOT NULL DEFAULT 0,
    "totalEvents" INTEGER NOT NULL DEFAULT 0,

    -- API request counters
    "apiRequests" INTEGER NOT NULL DEFAULT 0,
    "webhookCalls" INTEGER NOT NULL DEFAULT 0,

    -- Resource counters (snapshot at end of day)
    "activeConnectors" INTEGER NOT NULL DEFAULT 0,
    "activeCampaigns" INTEGER NOT NULL DEFAULT 0,

    -- Throttle tracking
    "throttledRequests" INTEGER NOT NULL DEFAULT 0,
    "softLimitHit" BOOLEAN NOT NULL DEFAULT false,
    "hardLimitHit" BOOLEAN NOT NULL DEFAULT false,

    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DailyUsageCounter_pkey" PRIMARY KEY ("id")
);

-- Create unique constraint
CREATE UNIQUE INDEX IF NOT EXISTS "DailyUsageCounter_organizationId_date_key" ON "DailyUsageCounter"("organizationId", "date");

-- Create indexes
CREATE INDEX IF NOT EXISTS "DailyUsageCounter_organizationId_date_idx" ON "DailyUsageCounter"("organizationId", "date");
CREATE INDEX IF NOT EXISTS "DailyUsageCounter_date_idx" ON "DailyUsageCounter"("date");

-- Create MeteringAuditLog table for audit-ready metering events
CREATE TABLE IF NOT EXISTS "MeteringAuditLog" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "eventCount" INTEGER NOT NULL DEFAULT 1,
    "metadata" JSONB,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MeteringAuditLog_pkey" PRIMARY KEY ("id")
);

-- Create indexes for audit log
CREATE INDEX IF NOT EXISTS "MeteringAuditLog_organizationId_timestamp_idx" ON "MeteringAuditLog"("organizationId", "timestamp");
CREATE INDEX IF NOT EXISTS "MeteringAuditLog_eventType_timestamp_idx" ON "MeteringAuditLog"("eventType", "timestamp");
