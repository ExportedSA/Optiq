# Tracking Endpoint (POST /api/track)

## Overview

Public endpoint for ingesting tracking events from websites using TrackingSite.publicKey authentication.

---

## Endpoint

**URL:** `POST /api/track`  
**Authentication:** Public key (no session required)  
**CORS:** Enabled for cross-origin requests  
**Rate Limit:** 10,000 events/minute per site

---

## Request Format

### Single Event

```json
{
  "publicKey": "pk_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
  "eventId": "evt_1234567890_abc123",
  "type": "PAGE_VIEW",
  "url": "https://example.com/page",
  "path": "/page",
  "referrer": "https://google.com",
  "title": "Page Title",
  "occurredAt": "2024-01-01T12:00:00Z",
  "anonId": "anon_abc123",
  "sessionId": "sess_xyz789",
  "utmSource": "google",
  "utmMedium": "cpc",
  "utmCampaign": "summer_sale",
  "utmTerm": "shoes",
  "utmContent": "ad1",
  "properties": {
    "productId": "123",
    "category": "shoes"
  }
}
```

### Batch Events

```json
{
  "publicKey": "pk_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
  "events": [
    {
      "publicKey": "pk_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
      "eventId": "evt_1",
      "type": "PAGE_VIEW",
      "url": "https://example.com/page1",
      "path": "/page1",
      "anonId": "anon_123",
      "sessionId": "sess_123"
    },
    {
      "publicKey": "pk_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
      "eventId": "evt_2",
      "type": "CONVERSION",
      "url": "https://example.com/checkout",
      "path": "/checkout",
      "value": 99.99,
      "anonId": "anon_123",
      "sessionId": "sess_123"
    }
  ]
}
```

**Batch Limits:**
- Min: 1 event
- Max: 100 events per request

---

## Response Format

### Success Response

```json
{
  "success": true,
  "accepted": 2,
  "deduped": 0,
  "total": 2
}
```

**Headers:**
```
X-RateLimit-Limit: 10000
X-RateLimit-Remaining: 9998
X-RateLimit-Reset: 2024-01-01T12:01:00Z
Access-Control-Allow-Origin: https://example.com
```

### Error Responses

**Invalid JSON (400):**
```json
{
  "error": "Invalid JSON"
}
```

**Validation Failed (400):**
```json
{
  "error": "Validation failed",
  "details": [
    {
      "path": ["eventId"],
      "message": "String must contain at least 8 character(s)"
    }
  ]
}
```

**Invalid Public Key (401):**
```json
{
  "error": "Invalid public key"
}
```

**Origin Not Allowed (403):**
```json
{
  "error": "Origin not allowed"
}
```

**Rate Limit Exceeded (429):**
```json
{
  "error": "Rate limit exceeded",
  "limit": 10000,
  "resetAt": "2024-01-01T12:01:00Z"
}
```

**Internal Error (500):**
```json
{
  "error": "Internal server error"
}
```

---

## Field Specifications

### Required Fields

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| `publicKey` | string | Site public key | Min 1 char |
| `eventId` | string | Unique event ID | 8-128 chars |
| `type` | enum | Event type | PAGE_VIEW, CONVERSION, CUSTOM |
| `url` | string | Full URL | Valid URL |
| `path` | string | URL path | 1-2048 chars |

### Optional Fields

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| `name` | string | Event name | 1-200 chars |
| `referrer` | string | Referrer URL | Valid URL or null |
| `title` | string | Page title | Max 512 chars |
| `occurredAt` | string | ISO datetime | ISO 8601 format |
| `anonId` | string | Anonymous ID | 8-128 chars |
| `sessionId` | string | Session ID | 8-128 chars |
| `utmSource` | string | UTM source | Max 200 chars |
| `utmMedium` | string | UTM medium | Max 200 chars |
| `utmCampaign` | string | UTM campaign | Max 200 chars |
| `utmTerm` | string | UTM term | Max 200 chars |
| `utmContent` | string | UTM content | Max 200 chars |
| `properties` | object | Custom properties | JSON object |
| `value` | number | Conversion value | For CONVERSION events |

### Auto-Generated Fields

If not provided, the following fields are auto-generated:

- `anonId`: `anon_<timestamp>_<random>`
- `sessionId`: `sess_<timestamp>_<random>`
- `occurredAt`: Current server time

---

## Event Types

### PAGE_VIEW
Standard page view event

```json
{
  "type": "PAGE_VIEW",
  "url": "https://example.com/product/123",
  "path": "/product/123",
  "title": "Product Page"
}
```

### CONVERSION
Conversion event with optional value

```json
{
  "type": "CONVERSION",
  "url": "https://example.com/checkout/success",
  "path": "/checkout/success",
  "value": 99.99,
  "properties": {
    "orderId": "ORD-123",
    "items": 3
  }
}
```

### CUSTOM
Custom event with properties

```json
{
  "type": "CUSTOM",
  "name": "video_play",
  "url": "https://example.com/videos",
  "path": "/videos",
  "properties": {
    "videoId": "vid-123",
    "duration": 120
  }
}
```

---

## Idempotency

Events are idempotent based on the unique constraint: `(siteId, eventId)`

**Behavior:**
- Same `eventId` for same site → Deduped (counted in response)
- Same `eventId` for different sites → Both accepted
- Duplicate events return in `deduped` count, not as errors

**Example:**
```json
// First request
POST /api/track
{
  "publicKey": "pk_...",
  "eventId": "evt_123",
  "type": "PAGE_VIEW",
  "url": "https://example.com/page",
  "path": "/page"
}
// Response: { "accepted": 1, "deduped": 0 }

// Second request (duplicate)
POST /api/track
{
  "publicKey": "pk_...",
  "eventId": "evt_123",  // Same eventId
  "type": "PAGE_VIEW",
  "url": "https://example.com/page",
  "path": "/page"
}
// Response: { "accepted": 0, "deduped": 1 }
```

---

## IP Address Handling

**Privacy-First Approach:**

1. **Extract IP:** From proxy headers (X-Forwarded-For, X-Real-IP, etc.)
2. **Hash IP:** SHA-256 with salt
3. **Store Hash:** Only the hash is stored, never the raw IP
4. **Use Cases:** Deduplication, fraud detection, rate limiting

**IP Hash Process:**
```
Raw IP: 192.0.2.1
↓
Normalize: 192.0.2.1
↓
Salt + Hash: SHA-256(salt + ip)
↓
Stored: a1b2c3d4e5f6...
```

**Supported Headers (in order of preference):**
1. `X-Forwarded-For` (takes first IP)
2. `X-Real-IP`
3. `CF-Connecting-IP` (Cloudflare)
4. `True-Client-IP` (Akamai, Cloudflare Enterprise)
5. `X-Client-IP`

**IPv6 Support:**
- Normalizes IPv6 addresses
- Converts IPv4-mapped IPv6 to IPv4
- Consistent hashing across formats

---

## Rate Limiting

**Limits:**
- 10,000 events per minute per site
- Sliding window algorithm using Redis
- Batch events count toward limit

**Headers:**
```
X-RateLimit-Limit: 10000
X-RateLimit-Remaining: 9850
X-RateLimit-Reset: 2024-01-01T12:01:00Z
```

**Rate Limit Exceeded:**
```json
{
  "error": "Rate limit exceeded",
  "limit": 10000,
  "resetAt": "2024-01-01T12:01:00Z"
}
```

**Status Code:** 429 Too Many Requests

**Behavior:**
- Fails open if Redis is unavailable (allows requests)
- Per-site limits (not per-organization)
- Resets every minute (sliding window)

---

## CORS Configuration

**Allowed Origins:**
- Matches site domain
- Supports subdomains (e.g., `sub.example.com` allowed for `example.com`)
- Returns specific origin in response (not wildcard for credentials)

**Headers:**
```
Access-Control-Allow-Origin: https://example.com
Access-Control-Allow-Methods: POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
Access-Control-Max-Age: 86400
```

**Preflight (OPTIONS):**
```
OPTIONS /api/track
Origin: https://example.com

Response:
204 No Content
Access-Control-Allow-Origin: https://example.com
Access-Control-Allow-Methods: POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
Access-Control-Max-Age: 86400
```

---

## Validation Schema (Zod)

```typescript
const EventSchema = z.object({
  publicKey: z.string().min(1),
  eventId: z.string().min(8).max(128),
  type: z.enum(["PAGE_VIEW", "CONVERSION", "CUSTOM"]),
  name: z.string().min(1).max(200).optional(),
  url: z.string().url(),
  path: z.string().min(1).max(2048),
  referrer: z.string().url().optional().nullable(),
  title: z.string().max(512).optional().nullable(),
  occurredAt: z.string().datetime().optional(),
  anonId: z.string().min(8).max(128).optional(),
  sessionId: z.string().min(8).max(128).optional(),
  utmSource: z.string().max(200).optional().nullable(),
  utmMedium: z.string().max(200).optional().nullable(),
  utmCampaign: z.string().max(200).optional().nullable(),
  utmTerm: z.string().max(200).optional().nullable(),
  utmContent: z.string().max(200).optional().nullable(),
  properties: z.record(z.string(), z.unknown()).optional(),
  value: z.number().optional(),
});

const BatchPayloadSchema = z.object({
  publicKey: z.string().min(1),
  events: z.array(EventSchema).min(1).max(100),
});
```

---

## Usage Examples

### JavaScript (Fetch)

```javascript
// Single event
fetch('https://app.optiq.io/api/track', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    publicKey: 'pk_your_key_here',
    eventId: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type: 'PAGE_VIEW',
    url: window.location.href,
    path: window.location.pathname,
    referrer: document.referrer || null,
    title: document.title,
    anonId: getAnonId(),
    sessionId: getSessionId(),
  }),
  keepalive: true
});

// Batch events
fetch('https://app.optiq.io/api/track', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    publicKey: 'pk_your_key_here',
    events: [
      { eventId: 'evt_1', type: 'PAGE_VIEW', url: '...', path: '...' },
      { eventId: 'evt_2', type: 'CONVERSION', url: '...', path: '...', value: 99.99 },
    ]
  }),
});
```

### cURL

```bash
# Single event
curl -X POST https://app.optiq.io/api/track \
  -H "Content-Type: application/json" \
  -d '{
    "publicKey": "pk_your_key_here",
    "eventId": "evt_test_123",
    "type": "PAGE_VIEW",
    "url": "https://example.com/page",
    "path": "/page",
    "anonId": "anon_123",
    "sessionId": "sess_123"
  }'

# Batch events
curl -X POST https://app.optiq.io/api/track \
  -H "Content-Type: application/json" \
  -d '{
    "publicKey": "pk_your_key_here",
    "events": [
      {
        "publicKey": "pk_your_key_here",
        "eventId": "evt_1",
        "type": "PAGE_VIEW",
        "url": "https://example.com/page1",
        "path": "/page1",
        "anonId": "anon_123",
        "sessionId": "sess_123"
      },
      {
        "publicKey": "pk_your_key_here",
        "eventId": "evt_2",
        "type": "CONVERSION",
        "url": "https://example.com/checkout",
        "path": "/checkout",
        "value": 99.99,
        "anonId": "anon_123",
        "sessionId": "sess_123"
      }
    ]
  }'
```

---

## Testing

### Test File
`apps/frontend/src/app/api/track/__tests__/track.test.ts`

### Test Coverage

1. ✅ Accept valid PAGE_VIEW event
2. ✅ Accept CONVERSION event with value
3. ✅ Store UTM parameters
4. ✅ Enforce unique constraint on (siteId, eventId)
5. ✅ Allow same eventId for different sites
6. ✅ Hash IP addresses
7. ✅ Normalize IPv6 addresses
8. ✅ Handle IPv4-mapped IPv6
9. ✅ Never store raw IP addresses
10. ✅ Accept multiple events in batch
11. ✅ Handle partial batch failures (duplicates)
12. ✅ Store all required fields
13. ✅ Auto-generate anonId and sessionId
14. ✅ Validate required fields
15. ✅ Validate event type enum

### Running Tests

```bash
cd apps/frontend
npm test -- track.test.ts
```

---

## Performance Considerations

### Batch Processing
- Processes events sequentially
- Continues on duplicate errors
- Returns counts for accepted/deduped

### Database
- Unique constraint on (siteId, eventId) for idempotency
- Indexes on siteId, occurredAt, type, anonId, sessionId
- Efficient duplicate detection via Prisma P2002 error

### Rate Limiting
- Redis sorted sets for sliding window
- O(log n) operations
- Auto-cleanup of old entries

---

## Security

### Public Key Validation
- Verified against database
- 256-bit cryptographically secure keys
- No session required (public endpoint)

### Origin Validation
- Checks Origin header against site domain
- Supports subdomains
- Prevents unauthorized domains

### IP Privacy
- Never stores raw IP addresses
- SHA-256 hashing with salt
- One-way hash (cannot reverse)

### Rate Limiting
- Prevents abuse
- Per-site limits
- Sliding window algorithm

---

## Files

| File | Purpose |
|------|---------|
| `app/api/track/route.ts` | Main endpoint implementation |
| `lib/tracking/ip-hash.ts` | IP hashing utilities |
| `lib/tracking/rate-limit.ts` | Rate limiting with Redis |
| `app/api/track/__tests__/track.test.ts` | Test suite (15 tests) |
| `docs/TRACKING_ENDPOINT.md` | This document |

---

## Summary

| Aspect | Details |
|--------|---------|
| **Endpoint** | POST /api/track |
| **Authentication** | Public key (no session) |
| **Batch Support** | 1-100 events per request |
| **Idempotency** | (siteId, eventId) unique constraint |
| **IP Handling** | Hashed with SHA-256, never stored raw |
| **Rate Limit** | 10k events/min per site |
| **CORS** | Enabled, origin validation |
| **Response** | { accepted, deduped, total } |
| **Status Codes** | 200, 400, 401, 403, 429, 500 |
| **Tests** | 15 test cases |
