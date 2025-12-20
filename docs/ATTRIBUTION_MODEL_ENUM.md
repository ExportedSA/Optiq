# AttributionModel Enum Refactor

## Overview

This refactor converts `DailyRollup.attributionModel` from a `String` type to the existing `AttributionModel` enum, ensuring type safety and consistency with the attribution system.

**Benefits:**
- Type-safe attribution model values at compile time
- Database-level validation via PostgreSQL enum
- Consistent with existing `AttributionModel` enum used throughout the codebase
- Prevents invalid attribution model values
- Better IDE autocomplete and refactoring support

---

## Schema Changes

### Existing Enum (No Change)

The `AttributionModel` enum already exists in the schema:

```prisma
enum AttributionModel {
  FIRST_TOUCH
  LAST_TOUCH
  LINEAR
  TIME_DECAY
  POSITION_BASED
  DATA_DRIVEN
}
```

### Updated DailyRollup Model

**Before:**
```prisma
model DailyRollup {
  // ...
  attributionModel String   @default("LAST_TOUCH")
  // ...
}
```

**After:**
```prisma
model DailyRollup {
  // ...
  attributionModel AttributionModel   @default(LAST_TOUCH)
  // ...
}
```

### Unique Constraint (Already Includes attributionModel)

The unique constraint already includes `attributionModel` and continues to work with the enum:

```prisma
@@unique([organizationId, date, grain, platformId, campaignId, adsetId, adId, attributionModel])
```

This ensures that:
- Each combination of org/date/grain/entities can have **multiple rollups** (one per attribution model)
- Different attribution models can coexist for the same data
- Enables A/B testing of attribution models

---

## Migration

### SQL Migration

Location: `apps/backend/prisma/migrations/attribution_model_enum/migration.sql`

The migration:
1. Updates existing data to uppercase enum values (if needed)
2. Alters the `attributionModel` column to use the enum type
3. Sets the default value to `LAST_TOUCH`

**Data Transformation:**
- Values should already be uppercase (`LAST_TOUCH`, etc.)
- Migration handles any lowercase variants as a safety measure

---

## Code Updates

### 1. Attribution Types

**File:** `apps/frontend/src/lib/attribution/types.ts`

**Before:**
```typescript
export type AttributionModel =
  | "FIRST_TOUCH"
  | "LAST_TOUCH"
  | "LINEAR"
  | "TIME_DECAY"
  | "POSITION_BASED";
```

**After:**
```typescript
import type { AttributionModel as PrismaAttributionModel } from "@prisma/client";

// Re-export Prisma's AttributionModel enum
export type AttributionModel = PrismaAttributionModel;
```

**Impact:**
- All existing code using `AttributionModel` type continues to work
- Now backed by Prisma's generated enum type
- Ensures consistency between database and application layer

### 2. Daily Rollups Job

**File:** `apps/frontend/src/lib/jobs/daily-rollups.ts`

**No changes needed** - Already uses `AttributionModel` type from `@/lib/attribution/types`

The job already:
- Accepts `attributionModel?: AttributionModel` parameter
- Defaults to `"LAST_TOUCH"`
- Passes the model through to all rollup creation functions
- Uses it in SQL queries (already uppercase)

### 3. Attribution Settings (New)

**File:** `apps/frontend/src/lib/settings/attribution-settings.ts`

**New module** to manage default attribution model in `OrganizationSettings`:

```typescript
export interface AttributionSettings {
  defaultModel: AttributionModel;
  lookbackDays: number;
  enabledModels: AttributionModel[];
}

export const DEFAULT_ATTRIBUTION_SETTINGS: AttributionSettings = {
  defaultModel: "LAST_TOUCH",
  lookbackDays: 30,
  enabledModels: ["FIRST_TOUCH", "LAST_TOUCH", "LINEAR", "TIME_DECAY", "POSITION_BASED"],
};
```

**Functions:**
- `getAttributionSettings(organizationId)` - Get settings with defaults
- `updateAttributionSettings(organizationId, settings)` - Update settings
- `getDefaultAttributionModel(organizationId)` - Get just the default model
- `isAttributionModelEnabled(organizationId, model)` - Check if model is enabled

---

## OrganizationSettings.attributionSettings

The `attributionSettings` JSON field now stores:

```json
{
  "defaultModel": "LAST_TOUCH",
  "lookbackDays": 30,
  "enabledModels": ["FIRST_TOUCH", "LAST_TOUCH", "LINEAR", "TIME_DECAY", "POSITION_BASED"]
}
```

### Usage Example

```typescript
import { getDefaultAttributionModel, updateAttributionSettings } from "@/lib/settings";

// Get default model for an organization
const defaultModel = await getDefaultAttributionModel("org_123");
// Returns: "LAST_TOUCH"

// Update attribution settings
await updateAttributionSettings("org_123", {
  defaultModel: "LINEAR",
  lookbackDays: 60,
  enabledModels: ["LAST_TOUCH", "LINEAR"],
});
```

### Integration with Daily Rollups

The daily rollups job can now use the organization's default model:

```typescript
import { getDefaultAttributionModel } from "@/lib/settings";
import { runDailyRollups } from "@/lib/jobs/daily-rollups";

const defaultModel = await getDefaultAttributionModel(organizationId);

await runDailyRollups({
  organizationId,
  attributionModel: defaultModel, // Uses org's default
});
```

---

## Type Safety Improvements

### Before (String)

```typescript
// No compile-time validation
const model: string = "invalid_model"; // ❌ Compiles but fails at runtime

await prisma.dailyRollup.create({
  data: {
    attributionModel: "typo_last_touch", // ❌ Compiles but fails at runtime
    // ...
  },
});
```

### After (Enum)

```typescript
import { AttributionModel } from "@prisma/client";

// Compile-time validation
const model: AttributionModel = "LAST_TOUCH"; // ✅ Type-safe
const invalid: AttributionModel = "invalid"; // ❌ TypeScript error

await prisma.dailyRollup.create({
  data: {
    attributionModel: "LAST_TOUCH", // ✅ Type-safe
    // attributionModel: "typo", // ❌ TypeScript error
    // ...
  },
});

// IDE autocomplete for enum values
const model: AttributionModel = // IDE suggests: FIRST_TOUCH, LAST_TOUCH, LINEAR, TIME_DECAY, POSITION_BASED, DATA_DRIVEN
```

---

## Attribution Model Reference

| Enum Value | Description | Credit Distribution |
|------------|-------------|---------------------|
| `FIRST_TOUCH` | First touchpoint gets 100% credit | 100% to first |
| `LAST_TOUCH` | Last touchpoint gets 100% credit | 100% to last |
| `LINEAR` | Equal credit across all touchpoints | Evenly distributed |
| `TIME_DECAY` | More credit to recent touchpoints | Exponential decay (7-day half-life) |
| `POSITION_BASED` | U-shaped distribution | 40% first, 20% middle, 40% last |
| `DATA_DRIVEN` | ML-based credit distribution | Algorithm-determined |

---

## Multiple Attribution Models

The unique constraint allows multiple rollups for the same data with different attribution models:

```sql
-- Same org, date, grain, campaign - different attribution models
INSERT INTO "DailyRollup" (organizationId, date, grain, campaignId, attributionModel, ...)
VALUES 
  ('org_123', '2024-01-01', 'CAMPAIGN', 'camp_456', 'LAST_TOUCH', ...),
  ('org_123', '2024-01-01', 'CAMPAIGN', 'camp_456', 'LINEAR', ...),
  ('org_123', '2024-01-01', 'CAMPAIGN', 'camp_456', 'TIME_DECAY', ...);
```

This enables:
- **A/B testing** of attribution models
- **Comparison** of different attribution approaches
- **Flexibility** in reporting and analysis

---

## Migration Steps

1. **Update schema:**
   ```bash
   cd apps/backend
   # Schema already updated in schema.prisma
   ```

2. **Run migration:**
   ```bash
   npx prisma migrate dev --name attribution_model_enum
   ```

3. **Generate Prisma client:**
   ```bash
   npx prisma generate
   ```

4. **Verify migration:**
   ```sql
   -- Check column type
   SELECT column_name, data_type, udt_name 
   FROM information_schema.columns 
   WHERE table_name = 'DailyRollup' AND column_name = 'attributionModel';
   
   -- Should show: data_type = 'USER-DEFINED', udt_name = 'AttributionModel'
   ```

5. **Test attribution settings:**
   ```typescript
   import { getAttributionSettings, updateAttributionSettings } from "@/lib/settings";
   
   // Get settings
   const settings = await getAttributionSettings("org_123");
   console.log(settings.defaultModel); // "LAST_TOUCH"
   
   // Update settings
   await updateAttributionSettings("org_123", {
     defaultModel: "LINEAR",
   });
   ```

---

## Rollback Plan

If issues arise, the migration can be rolled back:

```sql
-- Revert to String type
ALTER TABLE "DailyRollup" 
  ALTER COLUMN "attributionModel" TYPE TEXT 
  USING "attributionModel"::TEXT;

-- Note: AttributionModel enum is used elsewhere, so don't drop it
```

Then revert code changes and regenerate Prisma client.

---

## Files Changed

### Schema
- ✅ `apps/backend/prisma/schema.prisma` - Updated DailyRollup.attributionModel to use enum

### Migration
- ✅ `apps/backend/prisma/migrations/attribution_model_enum/migration.sql` - SQL migration

### Code
- ✅ `apps/frontend/src/lib/attribution/types.ts` - Re-export Prisma's AttributionModel enum
- ✅ `apps/frontend/src/lib/settings/attribution-settings.ts` - New attribution settings module
- ✅ `apps/frontend/src/lib/settings/index.ts` - Export attribution settings

### Documentation
- ✅ `docs/ATTRIBUTION_MODEL_ENUM.md` - This document

---

## Existing Code Compatibility

**No breaking changes** - All existing code continues to work:

| Code Pattern | Status |
|--------------|--------|
| `attributionModel: "LAST_TOUCH"` | ✅ Works (string literal) |
| `const model: AttributionModel = "LINEAR"` | ✅ Works (type-safe) |
| SQL queries with model | ✅ Works (already uppercase) |
| Attribution service | ✅ Works (uses same type) |
| Daily rollups job | ✅ Works (already typed) |

---

## Summary

| Metric | Value |
|--------|-------|
| Enum values | 6 (FIRST_TOUCH, LAST_TOUCH, LINEAR, TIME_DECAY, POSITION_BASED, DATA_DRIVEN) |
| Files updated | 3 code files + 1 schema + 1 migration |
| New modules | 1 (attribution-settings.ts) |
| Type safety | ✅ Compile-time validation |
| Database validation | ✅ PostgreSQL enum constraint |
| Breaking changes | None (backward compatible) |
| Default model | LAST_TOUCH |
| Unique constraint | ✅ Includes attributionModel |
