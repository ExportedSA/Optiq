# Event Ingestion API Documentation

## Overview

The Event Ingestion API provides a robust, scalable endpoint for collecting tracking events from websites and applications. It supports batch ingestion, automatic deduplication, rate limiting, and comprehensive validation.

---

## Endpoint

### POST /api/events

Ingest a batch of tracking events.

**Authentication:** Site public key (included in request body)

**Rate Limit:** 100 requests per minute per workspace

**Request Body:**

```json
{
  "siteKey": "site_abc123def456",
  "events": [
    {
      "eventId": "evt_unique_id_123",
      "type": "PAGE_VIEW",
      "url": "https://example.com/products",
      "path": "/products",
      "anonymousId": "anon_user_123",
      "sessionId": "sess_abc_123",
      "timestamp": 1703001234567,
      "referrer": "https://google.com",
      "title": "Products - Example Store",
      "utm": {
        "source": "google",
        "medium": "cpc",
        "campaign": "summer_sale",
        "term": "running shoes",
        "content": "ad_variant_a"
      },
      "properties": {
        "category": "shoes",
        "brand": "Nike"
      }
    }
  ]
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "accepted": 10,
  "rejected": 0,
  "duplicates": 2
}
```

**Response (207 Multi-Status):**

```json
{
  "success": false,
  "accepted": 8,
  "rejected": 2,
  "duplicates": 1,
  "errors": [
    {
      "eventId": "evt_123",
      "index": 3,
      "message": "Database constraint violation"
    }
  ]
}
```

---

## Request Schema

### BatchEventRequest

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `siteKey` | string | ✅ | Tracking site public key |
| `events` | Event[] | ✅ | Array of events (1-100) |

### Event

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `eventId` | string | ✅ | Unique event identifier (8-128 chars) |
| `type` | enum | ✅ | Event type: `PAGE_VIEW`, `CONVERSION`, `CUSTOM` |
| `name` | string | ⚠️ | Event name (required for CONVERSION and CUSTOM) |
| `timestamp` | number | ❌ | Unix timestamp in milliseconds (defaults to now) |
| `url` | string | ✅ | Full page URL (max 2048 chars) |
| `path` | string | ✅ | URL path (max 2048 chars) |
| `referrer` | string | ❌ | Referrer URL (max 2048 chars) |
| `title` | string | ❌ | Page title (max 512 chars) |
| `anonymousId` | string | ✅ | Anonymous user ID (8-128 chars) |
| `sessionId` | string | ✅ | Session ID (8-128 chars) |
| `utm` | UTMParameters | ❌ | UTM parameters |
| `value` | number | ❌ | Conversion value (for CONVERSION events) |
| `properties` | object | ❌ | Custom event properties (JSON) |

### UTMParameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `source` | string | ❌ | UTM source (max 200 chars) |
| `medium` | string | ❌ | UTM medium (max 200 chars) |
| `campaign` | string | ❌ | UTM campaign (max 200 chars) |
| `term` | string | ❌ | UTM term (max 200 chars) |
| `content` | string | ❌ | UTM content (max 200 chars) |

---

## Event Types

### PAGE_VIEW

Standard page view event. No additional fields required.

**Example:**
```json
{
  "eventId": "evt_pageview_001",
  "type": "PAGE_VIEW",
  "url": "https://example.com/products",
  "path": "/products",
  "anonymousId": "anon_123",
  "sessionId": "sess_123"
}
```

### CONVERSION

Conversion event (purchase, signup, etc.). **Requires `name` field.**

**Example:**
```json
{
  "eventId": "evt_conversion_001",
  "type": "CONVERSION",
  "name": "Purchase",
  "url": "https://example.com/checkout/success",
  "path": "/checkout/success",
  "anonymousId": "anon_123",
  "sessionId": "sess_123",
  "value": 149.99,
  "properties": {
    "orderId": "ORD-12345",
    "items": 3,
    "currency": "USD"
  }
}
```

### CUSTOM

Custom event for tracking specific user actions. **Requires `name` field.**

**Example:**
```json
{
  "eventId": "evt_custom_001",
  "type": "CUSTOM",
  "name": "Video Play",
  "url": "https://example.com/videos/intro",
  "path": "/videos/intro",
  "anonymousId": "anon_123",
  "sessionId": "sess_123",
  "properties": {
    "videoId": "vid_123",
    "duration": 120,
    "quality": "1080p"
  }
}
```

---

## Response Schema

### EventIngestionResponse

| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | `true` if all events accepted, `false` if any rejected |
| `accepted` | number | Number of events successfully ingested |
| `rejected` | number | Number of events rejected due to errors |
| `duplicates` | number | Number of duplicate events (already ingested) |
| `errors` | Error[] | Array of error details (only if rejected > 0) |

### Error

| Field | Type | Description |
|-------|------|-------------|
| `eventId` | string | Event ID that failed (if available) |
| `index` | number | Index of failed event in batch (0-based) |
| `message` | string | Error message |

---

## Features

### ✅ Batch Ingestion

Send up to 100 events in a single request for efficient data collection.

**Benefits:**
- Reduced network overhead
- Improved throughput
- Better performance for high-traffic sites

**Example:**
```javascript
// Collect events in memory
const eventQueue = [];

// Add events as they occur
eventQueue.push({
  eventId: generateEventId(),
  type: 'PAGE_VIEW',
  url: window.location.href,
  path: window.location.pathname,
  anonymousId: getAnonymousId(),
  sessionId: getSessionId(),
});

// Flush queue periodically or when full
if (eventQueue.length >= 10) {
  await fetch('https://api.optiq.com/api/events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      siteKey: 'your_site_key',
      events: eventQueue,
    }),
  });
  eventQueue.length = 0;
}
```

### ✅ Automatic Deduplication

Events are deduplicated using the `eventId` field. Duplicate events return success but are not re-inserted.

**How it works:**
- Unique constraint on `(siteId, eventId)`
- `ON CONFLICT DO NOTHING` in database insert
- Deterministic response for idempotent requests

**Example:**
```javascript
// First request
const response1 = await ingestEvents([
  { eventId: 'evt_123', type: 'PAGE_VIEW', ... }
]);
// Result: { accepted: 1, duplicates: 0 }

// Second request with same eventId
const response2 = await ingestEvents([
  { eventId: 'evt_123', type: 'PAGE_VIEW', ... }
]);
// Result: { accepted: 0, duplicates: 1 }
```

**Best Practices:**
- Use UUIDs or timestamp-based IDs for `eventId`
- Include client-side retry logic
- Handle duplicate responses gracefully

### ✅ Rate Limiting

**Limits:**
- **Global:** 1000 requests per minute per IP
- **Event Ingestion:** 100 requests per minute per workspace

**Response Headers:**
```
x-ratelimit-limit: 100
x-ratelimit-remaining: 95
x-ratelimit-reset: 1703001294
retry-after: 45
```

**Rate Limit Exceeded (429):**
```json
{
  "statusCode": 429,
  "error": "Too Many Requests",
  "message": "Event ingestion rate limit exceeded. Try again in 45 seconds.",
  "retryAfter": 45
}
```

**Handling Rate Limits:**
```javascript
async function ingestWithRetry(events, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    const response = await fetch('/api/events', {
      method: 'POST',
      body: JSON.stringify({ siteKey, events }),
    });

    if (response.status === 429) {
      const retryAfter = response.headers.get('retry-after');
      await sleep(parseInt(retryAfter) * 1000);
      continue;
    }

    return response.json();
  }
  throw new Error('Rate limit exceeded after retries');
}
```

### ✅ Comprehensive Validation

All events are validated against a strict schema before ingestion.

**Validation Rules:**
- `eventId`: 8-128 characters
- `type`: Must be `PAGE_VIEW`, `CONVERSION`, or `CUSTOM`
- `name`: Required for `CONVERSION` and `CUSTOM` events
- `url`: Valid URL, max 2048 characters
- `anonymousId`: 8-128 characters
- `sessionId`: 8-128 characters
- `value`: Non-negative number (for conversions)
- `utm.*`: Max 200 characters each
- `properties`: Valid JSON object

**Validation Errors (400):**
```json
{
  "success": false,
  "error": "Invalid request",
  "message": "Request validation failed",
  "details": [
    {
      "code": "invalid_type",
      "expected": "string",
      "received": "undefined",
      "path": ["events", 0, "url"],
      "message": "Required"
    }
  ]
}
```

### ✅ Privacy & Security

**IP Address Hashing:**
- IP addresses are SHA-256 hashed before storage
- Original IPs never stored (GDPR compliance)
- Enables fraud detection without PII

**Domain Validation:**
- Events validated against registered site domain
- Prevents unauthorized event submission
- CORS headers for browser security

**Encrypted Credentials:**
- Site keys are public (safe for client-side use)
- No sensitive data in event payloads
- TLS encryption for all API requests

---

## Error Responses

### 400 Bad Request

Invalid request body or validation errors.

```json
{
  "success": false,
  "error": "Invalid request",
  "message": "Request validation failed",
  "details": [...]
}
```

### 401 Unauthorized

Invalid or missing site key.

```json
{
  "success": false,
  "error": "Unauthorized",
  "message": "Invalid site key"
}
```

### 429 Too Many Requests

Rate limit exceeded.

```json
{
  "statusCode": 429,
  "error": "Too Many Requests",
  "message": "Event ingestion rate limit exceeded. Try again in 45 seconds.",
  "retryAfter": 45
}
```

### 500 Internal Server Error

Server error during processing.

```json
{
  "success": false,
  "error": "Internal Server Error",
  "message": "An unexpected error occurred"
}
```

### 503 Service Unavailable

Service temporarily unavailable (database down, etc.).

```json
{
  "success": false,
  "error": "Service Unavailable",
  "message": "Event ingestion service is temporarily unavailable"
}
```

---

## Health Check

### GET /api/events/health

Check event ingestion service health.

**Response (200 OK):**
```json
{
  "status": "healthy",
  "service": "event-ingestion",
  "timestamp": "2024-01-15T12:34:56.789Z"
}
```

**Response (503 Service Unavailable):**
```json
{
  "status": "unhealthy",
  "service": "event-ingestion",
  "error": "Database connection failed",
  "timestamp": "2024-01-15T12:34:56.789Z"
}
```

---

## Client Libraries

### JavaScript/TypeScript

```typescript
import { OptiqClient } from '@optiq/client';

const client = new OptiqClient({
  siteKey: 'your_site_key',
  endpoint: 'https://api.optiq.com',
});

// Track page view
await client.trackPageView({
  url: window.location.href,
  path: window.location.pathname,
  title: document.title,
  referrer: document.referrer,
});

// Track conversion
await client.trackConversion({
  name: 'Purchase',
  value: 149.99,
  properties: {
    orderId: 'ORD-12345',
    items: 3,
  },
});

// Track custom event
await client.trackEvent({
  name: 'Video Play',
  properties: {
    videoId: 'vid_123',
    duration: 120,
  },
});
```

### cURL

```bash
curl -X POST https://api.optiq.com/api/events \
  -H "Content-Type: application/json" \
  -d '{
    "siteKey": "your_site_key",
    "events": [
      {
        "eventId": "evt_123",
        "type": "PAGE_VIEW",
        "url": "https://example.com/page",
        "path": "/page",
        "anonymousId": "anon_123",
        "sessionId": "sess_123"
      }
    ]
  }'
```

---

## Best Practices

### Event ID Generation

Use UUIDs or timestamp-based IDs for uniqueness:

```javascript
// UUID v4
import { v4 as uuidv4 } from 'uuid';
const eventId = `evt_${uuidv4()}`;

// Timestamp + random
const eventId = `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
```

### Batch Size Optimization

Balance between latency and throughput:

```javascript
const BATCH_SIZE = 10;
const FLUSH_INTERVAL = 5000; // 5 seconds

let eventQueue = [];
let flushTimer = null;

function queueEvent(event) {
  eventQueue.push(event);
  
  if (eventQueue.length >= BATCH_SIZE) {
    flushEvents();
  } else if (!flushTimer) {
    flushTimer = setTimeout(flushEvents, FLUSH_INTERVAL);
  }
}

async function flushEvents() {
  if (eventQueue.length === 0) return;
  
  const batch = eventQueue.splice(0, BATCH_SIZE);
  clearTimeout(flushTimer);
  flushTimer = null;
  
  await ingestEvents(batch);
}
```

### Error Handling

Implement retry logic with exponential backoff:

```javascript
async function ingestWithRetry(events, maxRetries = 3) {
  let lastError;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ siteKey, events }),
      });
      
      if (response.ok || response.status === 207) {
        return await response.json();
      }
      
      if (response.status === 429) {
        const retryAfter = parseInt(response.headers.get('retry-after') || '60');
        await sleep(retryAfter * 1000);
        continue;
      }
      
      if (response.status >= 500) {
        // Server error - retry with backoff
        await sleep(Math.pow(2, attempt) * 1000);
        continue;
      }
      
      // Client error - don't retry
      throw new Error(`HTTP ${response.status}: ${await response.text()}`);
      
    } catch (error) {
      lastError = error;
      if (attempt < maxRetries - 1) {
        await sleep(Math.pow(2, attempt) * 1000);
      }
    }
  }
  
  throw lastError;
}
```

### Anonymous ID Management

Persist anonymous ID across sessions:

```javascript
function getAnonymousId() {
  let anonId = localStorage.getItem('optiq_anon_id');
  
  if (!anonId) {
    anonId = `anon_${uuidv4()}`;
    localStorage.setItem('optiq_anon_id', anonId);
  }
  
  return anonId;
}
```

### Session ID Management

Generate new session ID on each visit:

```javascript
function getSessionId() {
  let sessionId = sessionStorage.getItem('optiq_session_id');
  
  if (!sessionId) {
    sessionId = `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('optiq_session_id', sessionId);
  }
  
  return sessionId;
}
```

---

## Performance Considerations

### Database Indexing

Events are indexed for efficient querying:
- `(siteId, eventId)` - Unique constraint for deduplication
- `(siteId, occurredAt)` - Time-series queries
- `(siteId, type, occurredAt)` - Event type filtering
- `(siteId, anonId, occurredAt)` - User journey queries
- `(siteId, sessionId, occurredAt)` - Session analysis

### Throughput

Expected throughput per workspace:
- **100 requests/minute** = ~1.67 requests/second
- **100 events/request** = ~167 events/second
- **10,000 events/minute** sustained

### Latency

Typical response times:
- **p50:** 50-100ms
- **p95:** 200-300ms
- **p99:** 500-1000ms

---

## Monitoring & Observability

All requests are logged with structured logging:

```json
{
  "level": "info",
  "requestId": "req_abc123",
  "siteId": "site_123",
  "organizationId": "org_123",
  "eventCount": 10,
  "accepted": 10,
  "rejected": 0,
  "duplicates": 2,
  "duration": 45,
  "msg": "Event batch processed"
}
```

**Key Metrics:**
- Request rate per workspace
- Event acceptance rate
- Duplicate rate
- Error rate
- Response time (p50, p95, p99)

---

## Support

For questions or issues:
- **Documentation:** https://docs.optiq.com
- **API Status:** https://status.optiq.com
- **Support:** support@optiq.com
