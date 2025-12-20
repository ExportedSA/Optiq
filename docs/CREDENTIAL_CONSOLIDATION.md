# Credential Consolidation Refactor

## Overview

This refactor consolidates duplicate credential storage from platform-specific tables (`GoogleAdsCredential`, `MetaAdsCredential`, `TikTokAdsCredential`) into a single canonical store: `IntegrationConnection`.

**Benefits:**
- Single source of truth for all platform credentials
- Consistent credential management across platforms
- Easier to add new platforms
- Reduced schema complexity
- Better security with centralized encryption

---

## Schema Changes

### Removed Models

```prisma
// ❌ REMOVED
model GoogleAdsCredential {
  id                   String    @id @default(cuid())
  organizationId       String
  customerId           String
  refreshTokenEnc      String
  accessTokenEnc       String?
  accessTokenExpiresAt DateTime?
  scope                String
  createdAt            DateTime  @default(now())
  updatedAt            DateTime  @updatedAt
  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  @@unique([organizationId, customerId])
  @@index([organizationId])
}

// ❌ REMOVED
model MetaAdsCredential {
  id                   String    @id @default(cuid())
  organizationId       String
  adAccountId          String
  userId               String?
  accessTokenEnc       String
  accessTokenExpiresAt DateTime?
  scope                String
  createdAt            DateTime  @default(now())
  updatedAt            DateTime  @updatedAt
  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  @@unique([organizationId, adAccountId])
  @@index([organizationId])
}

// ❌ REMOVED
model TikTokAdsCredential {
  id                    String    @id @default(cuid())
  organizationId        String
  advertiserId          String
  accessTokenEnc        String
  refreshTokenEnc       String
  accessTokenExpiresAt  DateTime?
  refreshTokenExpiresAt DateTime?
  scope                 String
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt
  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  @@unique([organizationId, advertiserId])
  @@index([organizationId])
}
```

### Updated Organization Model

```prisma
model Organization {
  // ... other fields ...
  
  // ❌ REMOVED
  // googleAdsCredentials GoogleAdsCredential[]
  // metaAdsCredentials   MetaAdsCredential[]
  // tikTokAdsCredentials TikTokAdsCredential[]
  
  // ✅ ADDED (consolidated)
  integrationConnections IntegrationConnection[]
}
```

### Canonical Credential Store (Already Exists)

```prisma
// ✅ This model already exists and now serves as the ONLY credential store
model IntegrationConnection {
  id                String                     @id @default(cuid())
  organizationId    String
  platformCode      PlatformCode
  externalAccountId String

  externalAccountName String?
  currency            String?
  timezone            String?
  status              IntegrationConnectionStatus @default(CONNECTED)

  // Encrypted tokens
  accessTokenEnc        String?
  refreshTokenEnc       String?
  accessTokenExpiresAt  DateTime?
  refreshTokenExpiresAt DateTime?
  scope                String?
  tokenType            String?

  // Platform-specific metadata (JSON)
  metadata Json?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)

  @@unique([organizationId, platformCode, externalAccountId])
  @@index([organizationId])
  @@index([organizationId, platformCode])
}
```

---

## Migration

### SQL Migration

Location: `apps/backend/prisma/migrations/consolidate_credentials/migration.sql`

The migration:
1. Copies all data from `GoogleAdsCredential` → `IntegrationConnection` (platformCode: `GOOGLE_ADS`)
2. Copies all data from `MetaAdsCredential` → `IntegrationConnection` (platformCode: `META_ADS`)
3. Copies all data from `TikTokAdsCredential` → `IntegrationConnection` (platformCode: `TIKTOK_ADS`)
4. Drops the old tables

**Field Mapping:**

| Old Field | New Field | Notes |
|-----------|-----------|-------|
| `customerId` (Google) | `externalAccountId` | Platform account identifier |
| `adAccountId` (Meta) | `externalAccountId` | Platform account identifier |
| `advertiserId` (TikTok) | `externalAccountId` | Platform account identifier |
| `userId` (Meta) | `metadata.userId` | Stored in JSON metadata |
| All token fields | Same names | Encrypted tokens preserved |

---

## Code Updates Required

### 1. Google Ads OAuth Callback

**File:** `apps/backend/src/api/routes/google-ads-oauth.ts`

**Before:**
```typescript
await prisma.googleAdsCredential.create({
  data: {
    organizationId: validatedState.organizationId,
    customerId: customerInfo.id,
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token,
    accessTokenExpiresAt: expiresAt,
    scope: tokens.scope,
  },
});
```

**After:**
```typescript
import { credentialManager } from "@/integrations/credential-manager";

await credentialManager.upsertCredential({
  organizationId: validatedState.organizationId,
  platformCode: "GOOGLE_ADS",
  externalAccountId: customerInfo.id,
  externalAccountName: customerInfo.descriptiveName,
  credentials: {
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token,
    accessTokenExpiresAt: expiresAt,
    scope: tokens.scope,
  },
  currency: customerInfo.currencyCode,
  timezone: customerInfo.timeZone,
});
```

### 2. Google Ads Sync Service

**File:** `apps/backend/src/services/google-ads-sync.ts`

**Before:**
```typescript
const credential = await prisma.googleAdsCredential.findFirst({
  where: { organizationId },
  orderBy: { createdAt: "desc" },
});

if (!credential) {
  throw new Error("No Google Ads credentials found");
}

const accessToken = decryptString(credential.accessTokenEnc);
```

**After:**
```typescript
import { credentialManager } from "@/integrations/credential-manager";

const credential = await credentialManager.getCredential({
  organizationId,
  platformCode: "GOOGLE_ADS",
});

if (!credential) {
  throw new Error("No Google Ads credentials found");
}

const accessToken = credential.accessToken; // Already decrypted
```

**Token Refresh:**

**Before:**
```typescript
await prisma.googleAdsCredential.update({
  where: { id: credential.id },
  data: {
    accessToken: tokens.access_token,
    accessTokenExpiresAt: newExpiresAt,
  },
});
```

**After:**
```typescript
await credentialManager.updateAccessToken({
  id: credential.id,
  accessToken: tokens.access_token,
  expiresAt: newExpiresAt,
});
```

### 3. Meta Ads Sync Service

**File:** `apps/backend/src/services/meta-ads-sync.ts`

**Before:**
```typescript
const credential = await prisma.metaAdsCredential.findFirst({
  where: { organizationId },
  orderBy: { createdAt: "desc" },
});

const accessToken = decryptString(credential.accessTokenEnc);
const adAccountId = credential.adAccountId;
```

**After:**
```typescript
import { credentialManager } from "@/integrations/credential-manager";

const credential = await credentialManager.getCredential({
  organizationId,
  platformCode: "META_ADS",
});

const accessToken = credential.accessToken;
const adAccountId = credential.externalAccountId;
```

### 4. Daily Sync Orchestrator

**File:** `apps/frontend/src/lib/jobs/daily-sync.ts`

**Before:**
```typescript
const googleCreds = await prisma.googleAdsCredential.findMany({
  distinct: ["organizationId"],
  select: { organizationId: true },
});

const metaCreds = await prisma.metaAdsCredential.findMany({
  distinct: ["organizationId"],
  select: { organizationId: true },
});
```

**After:**
```typescript
import { credentialManager } from "@/integrations/credential-manager";

const googleOrgs = await credentialManager.getOrganizationsWithCredentials("GOOGLE_ADS");
const metaOrgs = await credentialManager.getOrganizationsWithCredentials("META_ADS");
const tiktokOrgs = await credentialManager.getOrganizationsWithCredentials("TIKTOK_ADS");
```

### 5. Integration Status Checks

**File:** `apps/frontend/src/lib/googleAds.ts`, `metaAds.ts`, `tiktokAds.ts`

**Before:**
```typescript
const hasGoogleAds = await prisma.googleAdsCredential.count({
  where: { organizationId },
}) > 0;
```

**After:**
```typescript
import { credentialManager } from "@/integrations/credential-manager";

const hasGoogleAds = await credentialManager.hasCredentials({
  organizationId,
  platformCode: "GOOGLE_ADS",
});
```

---

## New CredentialManager API

### Methods

#### `upsertCredential(params)`
Store or update credentials for a platform.

```typescript
await credentialManager.upsertCredential({
  organizationId: "org_123",
  platformCode: "GOOGLE_ADS",
  externalAccountId: "1234567890",
  externalAccountName: "My Ad Account",
  credentials: {
    accessToken: "ya29.xxx",
    refreshToken: "1//xxx",
    accessTokenExpiresAt: new Date("2024-12-31"),
    scope: "https://www.googleapis.com/auth/adwords",
  },
  currency: "USD",
  timezone: "America/New_York",
});
```

#### `getCredential(params)`
Get credentials for a specific platform account.

```typescript
const cred = await credentialManager.getCredential({
  organizationId: "org_123",
  platformCode: "GOOGLE_ADS",
  externalAccountId: "1234567890", // Optional - gets most recent if omitted
});

// Returns decrypted credentials
console.log(cred.accessToken); // Already decrypted
console.log(cred.refreshToken);
```

#### `getAllCredentials(params)`
Get all credentials for a platform.

```typescript
const allCreds = await credentialManager.getAllCredentials({
  organizationId: "org_123",
  platformCode: "META_ADS",
});

// Returns array of decrypted credentials
allCreds.forEach(cred => {
  console.log(cred.externalAccountId, cred.accessToken);
});
```

#### `updateAccessToken(params)`
Update access token after refresh.

```typescript
await credentialManager.updateAccessToken({
  id: "cred_123",
  accessToken: "new_token",
  expiresAt: new Date("2024-12-31"),
});
```

#### `deleteCredential(params)`
Delete credentials.

```typescript
await credentialManager.deleteCredential({
  organizationId: "org_123",
  platformCode: "GOOGLE_ADS",
  externalAccountId: "1234567890",
});
```

#### `hasCredentials(params)`
Check if credentials exist.

```typescript
const hasGoogle = await credentialManager.hasCredentials({
  organizationId: "org_123",
  platformCode: "GOOGLE_ADS",
});
```

#### `getOrganizationsWithCredentials(platformCode)`
List all organizations with credentials for a platform.

```typescript
const orgs = await credentialManager.getOrganizationsWithCredentials("GOOGLE_ADS");
// Returns: ["org_123", "org_456", ...]
```

---

## Files to Update

### Backend (`apps/backend/src`)

1. ✅ **`integrations/credential-manager.ts`** - New centralized credential manager
2. **`api/routes/google-ads-oauth.ts`** - Update OAuth callback
3. **`api/routes/meta-ads-oauth.ts`** - Update OAuth callback
4. **`api/routes/tiktok-ads-oauth.ts`** - Update OAuth callback
5. **`services/google-ads-sync.ts`** - Update credential retrieval
6. **`services/meta-ads-sync.ts`** - Update credential retrieval
7. **`jobs/meta-ads-cost-sync.ts`** - Update credential retrieval

### Frontend (`apps/frontend/src`)

1. **`lib/jobs/daily-sync.ts`** - Update organization lookup
2. **`lib/googleAds.ts`** - Update status checks
3. **`lib/metaAds.ts`** - Update status checks
4. **`lib/tiktokAds.ts`** - Update status checks
5. **`app/api/integrations/google-ads/oauth/callback/route.ts`** - Update OAuth
6. **`app/api/integrations/meta-ads/oauth/callback/route.ts`** - Update OAuth
7. **`app/api/integrations/tiktok-ads/oauth/callback/route.ts`** - Update OAuth

---

## Migration Steps

1. **Run Prisma migration:**
   ```bash
   cd apps/backend
   npx prisma migrate dev --name consolidate_credentials
   ```

2. **Generate Prisma client:**
   ```bash
   npx prisma generate
   ```

3. **Update all code references** (see files list above)

4. **Test credential operations:**
   - OAuth flows for each platform
   - Token refresh logic
   - Sync jobs

5. **Verify data migration:**
   ```sql
   -- Check all credentials migrated
   SELECT platformCode, COUNT(*) 
   FROM "IntegrationConnection" 
   GROUP BY platformCode;
   ```

---

## Rollback Plan

If issues arise, the migration can be rolled back:

1. Restore old tables from backup
2. Revert schema changes
3. Revert code changes

**Note:** Keep the migration SQL for at least 30 days before removing old table backups.

---

## Testing Checklist

- [ ] Google Ads OAuth flow works
- [ ] Meta Ads OAuth flow works
- [ ] TikTok Ads OAuth flow works
- [ ] Token refresh works for all platforms
- [ ] Daily sync job finds all organizations
- [ ] Credential deletion works
- [ ] Multiple accounts per platform work
- [ ] Encryption/decryption works correctly
- [ ] All existing credentials migrated successfully
