-- Migration: Add performance indexes for DailyRollup queries
-- These indexes optimize common query patterns for rollup aggregation and reporting

-- Index for organization + date range queries (most common)
CREATE INDEX IF NOT EXISTS "DailyRollup_organizationId_date_idx" 
  ON "DailyRollup"("organizationId", "date");

-- Index for organization + platform + date queries
CREATE INDEX IF NOT EXISTS "DailyRollup_organizationId_platformId_date_idx" 
  ON "DailyRollup"("organizationId", "platformId", "date");

-- Index for organization + campaign + date queries
CREATE INDEX IF NOT EXISTS "DailyRollup_organizationId_campaignId_date_idx" 
  ON "DailyRollup"("organizationId", "campaignId", "date");

-- Index for date + grain queries (for cross-org aggregations)
CREATE INDEX IF NOT EXISTS "DailyRollup_date_grain_idx" 
  ON "DailyRollup"("date", "grain");

-- Index for attribution model queries
CREATE INDEX IF NOT EXISTS "DailyRollup_attributionModel_date_idx" 
  ON "DailyRollup"("attributionModel", "date");

-- Composite index for common filtering pattern
CREATE INDEX IF NOT EXISTS "DailyRollup_organizationId_grain_attributionModel_date_idx" 
  ON "DailyRollup"("organizationId", "grain", "attributionModel", "date");

-- Note: The unique constraint already provides an index for exact lookups:
-- @@unique([organizationId, date, grain, platformId, campaignId, adsetId, adId, attributionModel])
