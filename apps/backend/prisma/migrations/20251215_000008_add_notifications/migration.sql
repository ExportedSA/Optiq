-- In-app notifications for alert system

CREATE TABLE IF NOT EXISTS "InAppNotification" (
  "id" TEXT PRIMARY KEY,
  "organizationId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "status" TEXT NOT NULL DEFAULT 'pending',
  "actionUrl" TEXT,
  "metadata" JSONB,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "readAt" TIMESTAMPTZ,

  CONSTRAINT "InAppNotification_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE,
  CONSTRAINT "InAppNotification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS "InAppNotification_user_read_idx" ON "InAppNotification" ("userId", "readAt");
CREATE INDEX IF NOT EXISTS "InAppNotification_org_created_idx" ON "InAppNotification" ("organizationId", "createdAt");
CREATE INDEX IF NOT EXISTS "InAppNotification_user_org_status_idx" ON "InAppNotification" ("userId", "organizationId", "status");
