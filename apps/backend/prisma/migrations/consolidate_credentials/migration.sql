-- Migration: Consolidate credential storage to IntegrationConnection
-- This migration moves data from GoogleAdsCredential, MetaAdsCredential, and TikTokAdsCredential
-- into IntegrationConnection and then drops the old tables.

-- Step 1: Migrate GoogleAdsCredential to IntegrationConnection
INSERT INTO "IntegrationConnection" (
  "id",
  "organizationId",
  "platformCode",
  "externalAccountId",
  "externalAccountName",
  "accessTokenEnc",
  "refreshTokenEnc",
  "accessTokenExpiresAt",
  "scope",
  "status",
  "createdAt",
  "updatedAt"
)
SELECT 
  "id",
  "organizationId",
  'GOOGLE_ADS' as "platformCode",
  "customerId" as "externalAccountId",
  NULL as "externalAccountName",
  "accessTokenEnc",
  "refreshTokenEnc",
  "accessTokenExpiresAt",
  "scope",
  'CONNECTED' as "status",
  "createdAt",
  "updatedAt"
FROM "GoogleAdsCredential"
ON CONFLICT ("organizationId", "platformCode", "externalAccountId") 
DO UPDATE SET
  "accessTokenEnc" = EXCLUDED."accessTokenEnc",
  "refreshTokenEnc" = EXCLUDED."refreshTokenEnc",
  "accessTokenExpiresAt" = EXCLUDED."accessTokenExpiresAt",
  "scope" = EXCLUDED."scope",
  "updatedAt" = EXCLUDED."updatedAt";

-- Step 2: Migrate MetaAdsCredential to IntegrationConnection
INSERT INTO "IntegrationConnection" (
  "id",
  "organizationId",
  "platformCode",
  "externalAccountId",
  "externalAccountName",
  "accessTokenEnc",
  "accessTokenExpiresAt",
  "scope",
  "status",
  "metadata",
  "createdAt",
  "updatedAt"
)
SELECT 
  "id",
  "organizationId",
  'META_ADS' as "platformCode",
  "adAccountId" as "externalAccountId",
  NULL as "externalAccountName",
  "accessTokenEnc",
  "accessTokenExpiresAt",
  "scope",
  'CONNECTED' as "status",
  json_build_object('userId', "userId") as "metadata",
  "createdAt",
  "updatedAt"
FROM "MetaAdsCredential"
ON CONFLICT ("organizationId", "platformCode", "externalAccountId") 
DO UPDATE SET
  "accessTokenEnc" = EXCLUDED."accessTokenEnc",
  "accessTokenExpiresAt" = EXCLUDED."accessTokenExpiresAt",
  "scope" = EXCLUDED."scope",
  "metadata" = EXCLUDED."metadata",
  "updatedAt" = EXCLUDED."updatedAt";

-- Step 3: Migrate TikTokAdsCredential to IntegrationConnection
INSERT INTO "IntegrationConnection" (
  "id",
  "organizationId",
  "platformCode",
  "externalAccountId",
  "externalAccountName",
  "accessTokenEnc",
  "refreshTokenEnc",
  "accessTokenExpiresAt",
  "refreshTokenExpiresAt",
  "scope",
  "status",
  "createdAt",
  "updatedAt"
)
SELECT 
  "id",
  "organizationId",
  'TIKTOK_ADS' as "platformCode",
  "advertiserId" as "externalAccountId",
  NULL as "externalAccountName",
  "accessTokenEnc",
  "refreshTokenEnc",
  "accessTokenExpiresAt",
  "refreshTokenExpiresAt",
  "scope",
  'CONNECTED' as "status",
  "createdAt",
  "updatedAt"
FROM "TikTokAdsCredential"
ON CONFLICT ("organizationId", "platformCode", "externalAccountId") 
DO UPDATE SET
  "accessTokenEnc" = EXCLUDED."accessTokenEnc",
  "refreshTokenEnc" = EXCLUDED."refreshTokenEnc",
  "accessTokenExpiresAt" = EXCLUDED."accessTokenExpiresAt",
  "refreshTokenExpiresAt" = EXCLUDED."refreshTokenExpiresAt",
  "scope" = EXCLUDED."scope",
  "updatedAt" = EXCLUDED."updatedAt";

-- Step 4: Drop old credential tables
DROP TABLE IF EXISTS "GoogleAdsCredential";
DROP TABLE IF EXISTS "MetaAdsCredential";
DROP TABLE IF EXISTS "TikTokAdsCredential";
