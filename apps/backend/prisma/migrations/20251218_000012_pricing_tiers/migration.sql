-- AlterEnum: Update SubscriptionPlan values
-- Note: Postgres doesn't support direct enum value rename, so we handle via application logic
-- The enum already has FREE, STARTER; we add GROWTH, SCALE and deprecate PROFESSIONAL, ENTERPRISE

-- Add new enum values
ALTER TYPE "SubscriptionPlan" ADD VALUE IF NOT EXISTS 'GROWTH';
ALTER TYPE "SubscriptionPlan" ADD VALUE IF NOT EXISTS 'SCALE';

-- Add new columns to Subscription table for plan limits
ALTER TABLE "Subscription" ADD COLUMN IF NOT EXISTS "maxWorkspaces" INTEGER;
ALTER TABLE "Subscription" ADD COLUMN IF NOT EXISTS "maxConnectors" INTEGER;
ALTER TABLE "Subscription" ADD COLUMN IF NOT EXISTS "dataRetentionDays" INTEGER;
ALTER TABLE "Subscription" ADD COLUMN IF NOT EXISTS "attributionModels" TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "Subscription" ADD COLUMN IF NOT EXISTS "alertsEnabled" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Subscription" ADD COLUMN IF NOT EXISTS "ssoEnabled" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Subscription" ADD COLUMN IF NOT EXISTS "prioritySupport" BOOLEAN NOT NULL DEFAULT false;

-- Add overage pricing columns
ALTER TABLE "Subscription" ADD COLUMN IF NOT EXISTS "overageEventsPer10k" INTEGER;
ALTER TABLE "Subscription" ADD COLUMN IF NOT EXISTS "overageConnectorPrice" INTEGER;

-- Create UsageRecord table for tracking usage per billing period
CREATE TABLE IF NOT EXISTS "UsageRecord" (
    "id" TEXT NOT NULL,
    "subscriptionId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "trackedEvents" INTEGER NOT NULL DEFAULT 0,
    "connectedAccounts" INTEGER NOT NULL DEFAULT 0,
    "workspacesUsed" INTEGER NOT NULL DEFAULT 0,
    "eventsOverage" INTEGER NOT NULL DEFAULT 0,
    "connectorsOverage" INTEGER NOT NULL DEFAULT 0,
    "overageAmountCents" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UsageRecord_pkey" PRIMARY KEY ("id")
);

-- Create unique constraint
CREATE UNIQUE INDEX IF NOT EXISTS "UsageRecord_subscriptionId_periodStart_key" ON "UsageRecord"("subscriptionId", "periodStart");

-- Create indexes
CREATE INDEX IF NOT EXISTS "UsageRecord_organizationId_periodStart_idx" ON "UsageRecord"("organizationId", "periodStart");
CREATE INDEX IF NOT EXISTS "UsageRecord_subscriptionId_periodEnd_idx" ON "UsageRecord"("subscriptionId", "periodEnd");

-- Add foreign key
ALTER TABLE "UsageRecord" ADD CONSTRAINT "UsageRecord_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE CASCADE ON UPDATE CASCADE;
