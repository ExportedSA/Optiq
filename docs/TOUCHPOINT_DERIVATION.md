# TouchPoint Derivation

## Overview

This document defines the canonical rule for TrackingEvent vs TouchPoint and describes the derivation process.

---

## Canonical Rule

### TrackingEvent
**Raw inbound events** - All events captured from the tracking script

- **Types:** PAGE_VIEW, CONVERSION, CUSTOM
- **Purpose:** Complete audit trail of all user interactions
- **Scope:** Every event is recorded, regardless of marketing relevance
- **Storage:** Permanent, immutable record

### TouchPoint
**Derived marketing touchpoints** - One per session landing or click ID

- **Types:** Marketing touchpoints only (session landings with UTMs or click IDs)
- **Purpose:** Attribution modeling and journey building
- **Scope:** Only events that represent marketing interactions
- **Storage:** Derived from TrackingEvent, can be rebuilt

---

## Derivation Logic

### When is a TouchPoint Created?

A TouchPoint is created from a PAGE_VIEW event when **any** of the following conditions are met:

1. **UTM Parameters Present:**
   - `utm_source`
   - `utm_medium`
   - `utm_campaign`
   - `utm_term`
   - `utm_content`

2. **Click IDs Present:**
   - `gclid` (Google Ads)
   - `fbclid` (Meta/Facebook)
   - `ttclid` (TikTok)
   - `msclkid` (Microsoft/LinkedIn)
   - `clickid` (Generic)

### What is NOT a TouchPoint?

- Regular page views without marketing parameters
- Conversion events (these link to TouchPoints via attribution)
- Custom events
- Subsequent page views in the same session (only the landing page)

---

## Idempotency

TouchPoints are **idempotent** - running the derivation job multiple times will not create duplicates.

### Unique Constraints

```prisma
model TouchPoint {
  // ...
  @@unique([siteId, sessionId, landingUrl])
  @@unique([siteId, gclid])
  @@unique([siteId, fbclid])
  @@unique([siteId, ttclid])
  @@unique([siteId, clickId])
}
```

**Uniqueness Rules:**

1. **Session + Landing URL:** One TouchPoint per session landing page
2. **Click ID:** One TouchPoint per unique click ID (gclid, fbclid, etc.)

This ensures:
- No duplicate TouchPoints for the same session landing
- No duplicate TouchPoints for the same ad click
- Safe to re-run derivation without creating duplicates

---

## Data Flow

```
┌─────────────────┐
│ TrackingEvent   │ (Raw events from tracking script)
│ - PAGE_VIEW     │
│ - CONVERSION    │
│ - CUSTOM        │
└────────┬────────┘
         │
         │ Derivation Job
         │ (Filters for session landings with marketing params)
         ▼
┌─────────────────┐
│ TouchPoint      │ (Derived marketing touchpoints)
│ - Session lands │
│ - Click IDs     │
│ - UTM params    │
└────────┬────────┘
         │
         │ Attribution Service
         │ (Links TouchPoints to Conversions)
         ▼
┌─────────────────┐
│ AttributionLink │ (Credit allocation)
│ - Model weights │
│ - Journey path  │
└─────────────────┘
```

---

## Schema

### TrackingEvent (Source)

```prisma
model TrackingEvent {
  id         String            @id @default(cuid())
  siteId     String
  eventId    String
  type       TrackingEventType  // PAGE_VIEW, CONVERSION, CUSTOM
  
  url        String
  referrer   String?
  
  utmSource   String?
  utmMedium   String?
  utmCampaign String?
  utmTerm     String?
  utmContent  String?
  
  anonId     String
  sessionId  String
  occurredAt DateTime
  
  @@unique([siteId, eventId])
}
```

### TouchPoint (Derived)

```prisma
model TouchPoint {
  id         String   @id @default(cuid())
  siteId     String
  anonId     String
  sessionId  String
  occurredAt DateTime
  
  // UTM Parameters
  utmSource   String?
  utmMedium   String?
  utmCampaign String?
  utmTerm     String?
  utmContent  String?
  
  // Click IDs
  gclid   String?  // Google Ads
  fbclid  String?  // Meta/Facebook
  ttclid  String?  // TikTok
  msclkid String?  // Microsoft/LinkedIn
  clickId String?  // Generic
  
  // Context
  referrer   String?
  landingUrl String?
  
  // Inferred
  platformCode String?  // GOOGLE_ADS, META, TIKTOK
  campaignId   String?  // Linked campaign
  
  // Unique constraints for idempotency
  @@unique([siteId, sessionId, landingUrl])
  @@unique([siteId, gclid])
  @@unique([siteId, fbclid])
  @@unique([siteId, ttclid])
  @@unique([siteId, clickId])
}
```

---

## Derivation Job

### File
`apps/frontend/src/lib/jobs/touchpoint-derivation.ts`

### Functions

#### `runTouchPointDerivation(options?)`
Main derivation job - processes PAGE_VIEW events and creates TouchPoints

```typescript
const result = await runTouchPointDerivation({
  siteId: "site_123",      // Optional: specific site
  startDate: new Date(),   // Optional: start date
  endDate: new Date(),     // Optional: end date
  batchSize: 1000,         // Optional: batch size
});

// Returns:
{
  startedAt: Date,
  completedAt: Date,
  eventsProcessed: 1234,
  touchPointsCreated: 567,
  touchPointsSkipped: 667,  // Already exist
  errors: 0
}
```

#### `rebuildTouchPoints(options)`
Deletes and recreates TouchPoints for a date range

```typescript
await rebuildTouchPoints({
  siteId: "site_123",
  startDate: new Date("2024-01-01"),
  endDate: new Date("2024-01-31"),
});
```

#### `getTouchPointStats(siteId?)`
Get statistics about TouchPoint derivation

```typescript
const stats = await getTouchPointStats("site_123");

// Returns:
{
  totalEvents: 10000,
  totalTouchPoints: 3456,
  touchPointsWithClickIds: 1234,
  touchPointsWithUTMs: 2222,
  touchPointsLinkedToCampaigns: 890,
  platformBreakdown: {
    "GOOGLE_ADS": 1500,
    "META": 1200,
    "TIKTOK": 756
  }
}
```

---

## Cron Schedule

### Endpoint
`/api/cron/touchpoint-derivation`

### Schedule
Every 6 hours: `0 */6 * * *`

### Vercel Configuration

Add to `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/touchpoint-derivation",
      "schedule": "0 */6 * * *"
    }
  ]
}
```

---

## Platform Inference

The derivation job automatically infers the platform from click IDs:

| Click ID | Platform | Code |
|----------|----------|------|
| `gclid` | Google Ads | `GOOGLE_ADS` |
| `fbclid` | Meta/Facebook | `META` |
| `ttclid` | TikTok | `TIKTOK` |
| `msclkid` | Microsoft/LinkedIn | `LINKEDIN` |

**Logic:**
```typescript
function inferPlatformFromClickId(clickIds) {
  if (clickIds.gclid) return "GOOGLE_ADS";
  if (clickIds.fbclid) return "META";
  if (clickIds.ttclid) return "TIKTOK";
  if (clickIds.msclkid) return "LINKEDIN";
  return null;
}
```

---

## Campaign Linking

The derivation job attempts to link TouchPoints to campaigns:

1. **Platform inferred** from click ID
2. **Campaign name** from `utm_campaign`
3. **Fuzzy match** to find campaign in database

```typescript
if (platformCode && event.utmCampaign) {
  const campaign = await prisma.campaign.findFirst({
    where: {
      platform: { code: platformCode },
      name: { contains: event.utmCampaign, mode: "insensitive" },
    },
  });
  campaignId = campaign?.id ?? null;
}
```

---

## Examples

### Example 1: Google Ads Click

**TrackingEvent:**
```json
{
  "type": "PAGE_VIEW",
  "url": "https://example.com/landing?gclid=abc123&utm_source=google&utm_campaign=summer_sale",
  "sessionId": "sess_123",
  "anonId": "anon_456"
}
```

**Derived TouchPoint:**
```json
{
  "siteId": "site_789",
  "sessionId": "sess_123",
  "anonId": "anon_456",
  "landingUrl": "https://example.com/landing?gclid=abc123&utm_source=google&utm_campaign=summer_sale",
  "gclid": "abc123",
  "utmSource": "google",
  "utmCampaign": "summer_sale",
  "platformCode": "GOOGLE_ADS",
  "campaignId": "camp_xyz"  // If matched
}
```

### Example 2: Meta/Facebook Click

**TrackingEvent:**
```json
{
  "type": "PAGE_VIEW",
  "url": "https://example.com/promo?fbclid=meta456",
  "sessionId": "sess_789",
  "anonId": "anon_012"
}
```

**Derived TouchPoint:**
```json
{
  "siteId": "site_789",
  "sessionId": "sess_789",
  "anonId": "anon_012",
  "landingUrl": "https://example.com/promo?fbclid=meta456",
  "fbclid": "meta456",
  "platformCode": "META"
}
```

### Example 3: Organic Traffic (No TouchPoint)

**TrackingEvent:**
```json
{
  "type": "PAGE_VIEW",
  "url": "https://example.com/blog/post",
  "sessionId": "sess_999",
  "anonId": "anon_888"
}
```

**Result:** No TouchPoint created (no marketing parameters)

---

## Testing

### Test File
`apps/frontend/src/lib/jobs/__tests__/touchpoint-derivation.test.ts`

### Test Coverage

1. ✅ Create TouchPoint from PAGE_VIEW with UTM parameters
2. ✅ Create TouchPoint from PAGE_VIEW with Google click ID
3. ✅ Create TouchPoint from PAGE_VIEW with Meta click ID
4. ✅ Skip PAGE_VIEW without UTMs or click IDs
5. ✅ Idempotent - skip duplicate TouchPoints
6. ✅ Enforce unique constraint on siteId+sessionId+landingUrl
7. ✅ Enforce unique constraint on siteId+gclid
8. ✅ Get TouchPoint stats correctly
9. ✅ Rebuild TouchPoints for a date range
10. ✅ Handle multiple click IDs in same URL

### Running Tests

```bash
cd apps/frontend
npm test -- touchpoint-derivation.test.ts
```

---

## Migration

### Add Unique Constraints

```sql
-- Add unique constraints for idempotency
ALTER TABLE "TouchPoint" ADD CONSTRAINT "TouchPoint_siteId_sessionId_landingUrl_key" 
  UNIQUE ("siteId", "sessionId", "landingUrl");

ALTER TABLE "TouchPoint" ADD CONSTRAINT "TouchPoint_siteId_gclid_key" 
  UNIQUE ("siteId", "gclid");

ALTER TABLE "TouchPoint" ADD CONSTRAINT "TouchPoint_siteId_fbclid_key" 
  UNIQUE ("siteId", "fbclid");

ALTER TABLE "TouchPoint" ADD CONSTRAINT "TouchPoint_siteId_ttclid_key" 
  UNIQUE ("siteId", "ttclid");

ALTER TABLE "TouchPoint" ADD CONSTRAINT "TouchPoint_siteId_clickId_key" 
  UNIQUE ("siteId", "clickId");
```

---

## Performance Considerations

### Batch Processing
- Default batch size: 1000 events
- Processes events in chronological order
- Resumes from last processed timestamp

### Indexes
Existing indexes support efficient queries:
- `@@index([siteId, anonId, occurredAt])`
- `@@index([siteId, sessionId, occurredAt])`
- `@@index([siteId, utmSource, utmCampaign])`

### Unique Constraint Performance
- Unique constraints on click IDs enable fast duplicate detection
- PostgreSQL uses B-tree indexes for unique constraints
- O(log n) lookup time for duplicate checks

---

## Monitoring

### Key Metrics

1. **Derivation Rate:** TouchPoints created / Events processed
2. **Skip Rate:** TouchPoints skipped / Events processed
3. **Error Rate:** Errors / Events processed
4. **Platform Distribution:** TouchPoints by platform
5. **Campaign Link Rate:** TouchPoints with campaignId / Total TouchPoints

### Alerts

Set up alerts for:
- Error rate > 5%
- Derivation rate < 10% (too few marketing events)
- Job duration > 5 minutes
- Job failures

---

## Best Practices

1. **Run regularly:** Every 6 hours to keep TouchPoints up-to-date
2. **Monitor stats:** Use `getTouchPointStats()` to track derivation health
3. **Rebuild cautiously:** Only rebuild when necessary (schema changes, bug fixes)
4. **Test thoroughly:** Verify unique constraints work as expected
5. **Index properly:** Ensure indexes support efficient queries

---

## Summary

| Aspect | Details |
|--------|---------|
| **Source** | TrackingEvent (PAGE_VIEW type) |
| **Destination** | TouchPoint |
| **Trigger** | UTM parameters OR click IDs present |
| **Frequency** | Every 6 hours |
| **Idempotency** | 5 unique constraints (session+URL, gclid, fbclid, ttclid, clickId) |
| **Platform Inference** | Automatic from click IDs |
| **Campaign Linking** | Fuzzy match on utm_campaign |
| **Batch Size** | 1000 events |
| **Rebuildable** | Yes, via `rebuildTouchPoints()` |
| **Tests** | 10 test cases |
