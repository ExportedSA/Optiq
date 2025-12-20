-- Migration: Convert DailyRollup.grain from String to RollupGrain enum
-- This migration creates the RollupGrain enum and updates the grain column

-- Step 1: Create the RollupGrain enum
CREATE TYPE "RollupGrain" AS ENUM ('ORGANIZATION', 'PLATFORM', 'CAMPAIGN', 'ADSET', 'AD');

-- Step 2: Update existing grain values to match enum (if any data exists)
-- Convert lowercase to uppercase enum values
UPDATE "DailyRollup" SET "grain" = 'ORGANIZATION' WHERE "grain" = 'organization';
UPDATE "DailyRollup" SET "grain" = 'PLATFORM' WHERE "grain" = 'platform';
UPDATE "DailyRollup" SET "grain" = 'CAMPAIGN' WHERE "grain" = 'campaign';
UPDATE "DailyRollup" SET "grain" = 'ADSET' WHERE "grain" = 'adset';
UPDATE "DailyRollup" SET "grain" = 'AD' WHERE "grain" = 'ad';

-- Step 3: Alter the grain column to use the enum type
ALTER TABLE "DailyRollup" 
  ALTER COLUMN "grain" TYPE "RollupGrain" 
  USING "grain"::"RollupGrain";

-- Step 4: Set default value using enum
ALTER TABLE "DailyRollup" 
  ALTER COLUMN "grain" SET DEFAULT 'ORGANIZATION'::"RollupGrain";

-- Note: Indexes and unique constraints automatically work with enum types
-- No changes needed to existing indexes
