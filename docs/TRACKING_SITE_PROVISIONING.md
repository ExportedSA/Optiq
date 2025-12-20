# Tracking Site Provisioning

## Overview

This document describes the TrackingSite provisioning system, including API endpoints, RBAC, key generation, and installation snippets.

---

## API Endpoints

### POST /api/sites
Create a new tracking site

**Authentication:** Required  
**RBAC:** OWNER or ADMIN only

**Request:**
```json
{
  "name": "My Website",
  "domain": "example.com"
}
```

**Response:**
```json
{
  "success": true,
  "site": {
    "id": "site_abc123",
    "name": "My Website",
    "domain": "example.com",
    "publicKey": "pk_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
    "createdAt": "2024-01-01T00:00:00Z"
  },
  "installation": {
    "html": "## HTML Installation\n...",
    "react": "## React/Next.js Installation\n...",
    "verification": "## Verify Installation\n..."
  }
}
```

**Status Codes:**
- `201` - Site created successfully
- `400` - Validation error or no active organization
- `401` - Not authenticated
- `403` - Insufficient permissions (not OWNER or ADMIN)
- `409` - Domain already exists for this organization
- `500` - Server error

---

### GET /api/sites
List all tracking sites for the current organization

**Authentication:** Required  
**RBAC:** Any organization member (OWNER, ADMIN, VIEWER)

**Response:**
```json
{
  "success": true,
  "sites": [
    {
      "id": "site_abc123",
      "name": "My Website",
      "domain": "example.com",
      "publicKey": "pk_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z",
      "stats": {
        "totalEvents": 1234,
        "totalTouchPoints": 567
      }
    }
  ]
}
```

---

### GET /api/sites/[siteId]
Get tracking site details with installation instructions

**Authentication:** Required  
**RBAC:** Any organization member

**Response:**
```json
{
  "success": true,
  "site": {
    "id": "site_abc123",
    "name": "My Website",
    "domain": "example.com",
    "publicKey": "pk_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z",
    "stats": {
      "totalEvents": 1234,
      "totalTouchPoints": 567
    }
  },
  "installation": {
    "html": "...",
    "react": "...",
    "verification": "..."
  }
}
```

---

### PATCH /api/sites/[siteId]
Update tracking site

**Authentication:** Required  
**RBAC:** OWNER or ADMIN only

**Request:**
```json
{
  "name": "Updated Name",
  "domain": "new-domain.com"
}
```

**Response:**
```json
{
  "success": true,
  "site": {
    "id": "site_abc123",
    "name": "Updated Name",
    "domain": "new-domain.com",
    "publicKey": "pk_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
    "updatedAt": "2024-01-02T00:00:00Z"
  }
}
```

---

### DELETE /api/sites/[siteId]
Delete tracking site

**Authentication:** Required  
**RBAC:** OWNER only

**Response:**
```json
{
  "success": true,
  "message": "Tracking site deleted successfully"
}
```

**Note:** Deletes all associated events and touchpoints (cascade delete)

---

## Public Key Generation

### Format
`pk_<base64url>`

**Example:** `pk_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`

### Security
- **Length:** 32 bytes (256 bits)
- **Encoding:** Base64url (URL-safe)
- **Source:** `crypto.randomBytes()` (cryptographically secure)
- **Uniqueness:** Verified against existing keys (max 5 retry attempts)

### Validation
```typescript
function isValidPublicKey(key: string): boolean {
  // Must start with pk_
  if (!key.startsWith("pk_")) return false;
  
  // Must be 40-50 characters (base64url of 32 bytes)
  const keyPart = key.slice(3);
  if (keyPart.length < 40 || keyPart.length > 50) return false;
  
  // Must contain only base64url characters
  return /^[A-Za-z0-9_-]+$/.test(keyPart);
}
```

---

## RBAC (Role-Based Access Control)

### Permissions Matrix

| Action | OWNER | ADMIN | VIEWER |
|--------|-------|-------|--------|
| List sites | ✅ | ✅ | ✅ |
| View site details | ✅ | ✅ | ✅ |
| Create site | ✅ | ✅ | ❌ |
| Update site | ✅ | ✅ | ❌ |
| Delete site | ✅ | ❌ | ❌ |

### Implementation

**Membership Check:**
```typescript
const membership = await prisma.membership.findUnique({
  where: {
    userId_organizationId: {
      userId: session.user.id,
      organizationId,
    },
  },
});

if (!membership) {
  return NextResponse.json({ error: "Not a member" }, { status: 403 });
}
```

**Role Check (Create/Update):**
```typescript
if (!["OWNER", "ADMIN"].includes(membership.role)) {
  return NextResponse.json(
    { error: "Insufficient permissions" },
    { status: 403 }
  );
}
```

**Role Check (Delete):**
```typescript
if (membership.role !== "OWNER") {
  return NextResponse.json(
    { error: "Only owners can delete sites" },
    { status: 403 }
  );
}
```

---

## Input Validation

### Site Name
- **Required:** Yes
- **Min length:** 1 character
- **Max length:** 100 characters
- **Type:** String

### Domain
- **Required:** Yes
- **Min length:** 1 character
- **Max length:** 255 characters
- **Format:** `^[a-zA-Z0-9][a-zA-Z0-9-_.]*[a-zA-Z0-9]$`
- **Valid examples:**
  - `example.com`
  - `sub.example.com`
  - `example-site.com`
  - `example_site.com`
  - `example123.com`
- **Invalid examples:**
  - `-example.com` (starts with hyphen)
  - `example-.com` (ends with hyphen)
  - `.example.com` (starts with dot)
  - `example..com` (consecutive dots)

### Validation Schema (Zod)
```typescript
const createSiteSchema = z.object({
  name: z.string().min(1).max(100),
  domain: z.string().min(1).max(255)
    .regex(/^[a-zA-Z0-9][a-zA-Z0-9-_.]*[a-zA-Z0-9]$/),
});
```

---

## Installation Snippets

### HTML Snippet

```html
<!-- Optiq Tracking Script -->
<script>
  (function() {
    window.optiq = window.optiq || [];
    window.optiq.publicKey = "pk_your_key_here";
    window.optiq.apiUrl = "https://app.optiq.io";
    
    // Track page view
    window.optiq.track = function(eventType, properties) {
      var event = {
        publicKey: window.optiq.publicKey,
        eventId: 'evt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        type: eventType || 'PAGE_VIEW',
        url: window.location.href,
        path: window.location.pathname,
        referrer: document.referrer || null,
        title: document.title || null,
        properties: properties || {},
        occurredAt: new Date().toISOString()
      };
      
      fetch(window.optiq.apiUrl + '/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event),
        keepalive: true
      }).catch(function(err) {
        console.error('Optiq tracking error:', err);
      });
    };
    
    // Auto-track page view
    window.optiq.track('PAGE_VIEW');
    
    // Track conversions
    window.optiq.conversion = function(value, properties) {
      window.optiq.track('CONVERSION', {
        ...properties,
        value: value
      });
    };
  })();
</script>
<!-- End Optiq Tracking Script -->
```

### React/Next.js Snippet

```tsx
// components/OptiqTracking.tsx
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function OptiqTracking() {
  const pathname = usePathname();
  
  useEffect(() => {
    window.optiq = {
      publicKey: "pk_your_key_here",
      apiUrl: "https://app.optiq.io",
      track: (eventType, properties) => {
        const event = {
          publicKey: window.optiq.publicKey,
          eventId: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          type: eventType || 'PAGE_VIEW',
          url: window.location.href,
          path: window.location.pathname,
          referrer: document.referrer || null,
          title: document.title || null,
          properties: properties || {},
          occurredAt: new Date().toISOString()
        };
        
        fetch(window.optiq.apiUrl + '/api/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(event),
          keepalive: true
        }).catch(err => console.error('Optiq tracking error:', err));
      },
      conversion: (value, properties) => {
        window.optiq.track('CONVERSION', { ...properties, value });
      }
    };
  }, []);
  
  useEffect(() => {
    window.optiq?.track('PAGE_VIEW');
  }, [pathname]);
  
  return null;
}
```

### Verification

```javascript
// Open browser console and type:
window.optiq

// Should see:
{
  publicKey: "pk_your_key_here",
  apiUrl: "https://app.optiq.io",
  track: function,
  conversion: function
}

// Track a test conversion:
window.optiq.conversion(99.99, { productId: '123' });
```

---

## Usage Examples

### Create Site (cURL)

```bash
curl -X POST https://app.optiq.io/api/sites \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=..." \
  -d '{
    "name": "My Website",
    "domain": "example.com"
  }'
```

### List Sites (cURL)

```bash
curl https://app.optiq.io/api/sites \
  -H "Cookie: next-auth.session-token=..."
```

### Update Site (cURL)

```bash
curl -X PATCH https://app.optiq.io/api/sites/site_abc123 \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=..." \
  -d '{
    "name": "Updated Name"
  }'
```

### Delete Site (cURL)

```bash
curl -X DELETE https://app.optiq.io/api/sites/site_abc123 \
  -H "Cookie: next-auth.session-token=..."
```

---

## Testing

### Test File
`apps/frontend/src/app/api/sites/__tests__/sites.test.ts`

### Test Coverage

1. ✅ Public key generation (uniqueness, format, security)
2. ✅ Public key validation
3. ✅ Site creation with valid data
4. ✅ Unique publicKey constraint enforcement
5. ✅ Same domain for different organizations allowed
6. ✅ RBAC - OWNER can create sites
7. ✅ RBAC - ADMIN can create sites
8. ✅ RBAC - VIEWER cannot create sites
9. ✅ RBAC - Only OWNER can delete sites
10. ✅ Input validation (name length, domain format)
11. ✅ Site listing for organization
12. ✅ Event and touchpoint counts

### Running Tests

```bash
cd apps/frontend
npm test -- sites.test.ts
```

---

## Security Considerations

### Public Key Security
- **Non-guessable:** 256-bit random keys
- **Unique:** Verified against database
- **Public:** Safe to expose in client-side code
- **Revocable:** Delete site to invalidate key

### RBAC Enforcement
- **Authentication:** Required for all endpoints
- **Authorization:** Role-based permissions checked
- **Organization isolation:** Users can only access their org's sites

### Input Validation
- **Zod schemas:** Type-safe validation
- **Domain format:** Regex validation
- **Length limits:** Prevent abuse

### Rate Limiting
- Consider adding rate limits to prevent abuse
- Recommended: 10 sites per organization
- Recommended: 100 requests/minute per user

---

## Files Created

| File | Purpose |
|------|---------|
| `apps/frontend/src/lib/tracking/key-generator.ts` | Public key generation and validation |
| `apps/frontend/src/lib/tracking/snippet-generator.ts` | Installation snippet generation |
| `apps/frontend/src/app/api/sites/route.ts` | POST (create) and GET (list) endpoints |
| `apps/frontend/src/app/api/sites/[siteId]/route.ts` | GET, PATCH, DELETE for specific site |
| `apps/frontend/src/app/api/sites/__tests__/sites.test.ts` | Test suite (12 tests) |
| `docs/TRACKING_SITE_PROVISIONING.md` | This document |

---

## Summary

| Aspect | Details |
|--------|---------|
| **Endpoints** | POST, GET, PATCH, DELETE /api/sites |
| **Authentication** | Required (NextAuth session) |
| **RBAC** | OWNER/ADMIN create/update, OWNER delete, all view |
| **Key Format** | `pk_<base64url>` (256-bit) |
| **Key Security** | Cryptographically secure, non-guessable |
| **Validation** | Zod schemas for name and domain |
| **Snippets** | HTML and React/Next.js |
| **Tests** | 12 test cases |
| **Cascade Delete** | Yes (events and touchpoints) |
