-- Unified integration connections (tokens + account metadata)

DO $$ BEGIN
  CREATE TYPE "IntegrationConnectionStatus" AS ENUM ('CONNECTED', 'DISCONNECTED', 'ERROR', 'EXPIRED');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS "IntegrationConnection" (
  "id" TEXT PRIMARY KEY,
  "organizationId" TEXT NOT NULL,
  "platformCode" "PlatformCode" NOT NULL,
  "externalAccountId" TEXT NOT NULL,
  "externalAccountName" TEXT,
  "currency" TEXT,
  "timezone" TEXT,
  "status" "IntegrationConnectionStatus" NOT NULL DEFAULT 'CONNECTED',
  "accessTokenEnc" TEXT,
  "refreshTokenEnc" TEXT,
  "accessTokenExpiresAt" TIMESTAMPTZ,
  "refreshTokenExpiresAt" TIMESTAMPTZ,
  "scope" TEXT,
  "tokenType" TEXT,
  "metadata" JSONB,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL,

  CONSTRAINT "IntegrationConnection_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE,
  CONSTRAINT "IntegrationConnection_org_platform_external_unique" UNIQUE ("organizationId", "platformCode", "externalAccountId")
);

CREATE INDEX IF NOT EXISTS "IntegrationConnection_org_idx" ON "IntegrationConnection" ("organizationId");
CREATE INDEX IF NOT EXISTS "IntegrationConnection_org_platform_idx" ON "IntegrationConnection" ("organizationId", "platformCode");
