-- Migration: Convert DailyRollup.attributionModel from String to AttributionModel enum
-- The AttributionModel enum already exists in the schema, so we just need to update the column

-- Step 1: Update existing attributionModel values to match enum (if any data exists)
-- The values should already be uppercase, but ensure consistency
UPDATE "DailyRollup" SET "attributionModel" = 'FIRST_TOUCH' WHERE "attributionModel" = 'first_touch';
UPDATE "DailyRollup" SET "attributionModel" = 'LAST_TOUCH' WHERE "attributionModel" = 'last_touch';
UPDATE "DailyRollup" SET "attributionModel" = 'LINEAR' WHERE "attributionModel" = 'linear';
UPDATE "DailyRollup" SET "attributionModel" = 'TIME_DECAY' WHERE "attributionModel" = 'time_decay';
UPDATE "DailyRollup" SET "attributionModel" = 'POSITION_BASED' WHERE "attributionModel" = 'position_based';
UPDATE "DailyRollup" SET "attributionModel" = 'DATA_DRIVEN' WHERE "attributionModel" = 'data_driven';

-- Step 2: Alter the attributionModel column to use the enum type
ALTER TABLE "DailyRollup" 
  ALTER COLUMN "attributionModel" TYPE "AttributionModel" 
  USING "attributionModel"::"AttributionModel";

-- Step 3: Set default value using enum
ALTER TABLE "DailyRollup" 
  ALTER COLUMN "attributionModel" SET DEFAULT 'LAST_TOUCH'::"AttributionModel";

-- Note: The unique constraint already includes attributionModel and will work with the enum
-- @@unique([organizationId, date, grain, platformId, campaignId, adsetId, adId, attributionModel])
