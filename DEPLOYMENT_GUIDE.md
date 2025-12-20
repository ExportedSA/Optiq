# Deployment Guide - Optiq Attribution System

This guide covers deploying the Optiq application with the new attribution and tracking system.

---

## Deployment Options

### Option 1: Vercel (Recommended for Frontend)
### Option 2: Docker (Full Stack)
### Option 3: Manual Deployment

---

## Pre-Deployment Checklist

### 1. Environment Variables

Create `.env.production` or set in your deployment platform:

```bash
# Database
DATABASE_URL="postgresql://user:pass@host:5432/optiq?schema=public&connection_limit=10"

# Redis (for rate limiting)
REDIS_URL="redis://host:6379"
UPSTASH_REDIS_REST_URL="https://..."
UPSTASH_REDIS_REST_TOKEN="..."

# NextAuth
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-nextauth-secret"  # Generate: openssl rand -base64 32

# IP Hashing (for tracking)
IP_HASH_SALT="your-secret-salt"  # Generate: openssl rand -hex 32

# Google OAuth (if using)
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."

# Platform API Keys
GOOGLE_ADS_DEVELOPER_TOKEN="..."
META_APP_ID="..."
META_APP_SECRET="..."
TIKTOK_APP_ID="..."
TIKTOK_APP_SECRET="..."
```

### 2. Database Migrations

Ensure all migrations are applied:

```bash
cd apps/backend
npx prisma migrate deploy
```

### 3. Build Test

Test the build locally:

```bash
npm run build
```

---

## Option 1: Vercel Deployment

### Setup

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login:**
   ```bash
   vercel login
   ```

3. **Link Project:**
   ```bash
   cd apps/frontend
   vercel link
   ```

4. **Set Environment Variables:**
   ```bash
   vercel env add DATABASE_URL production
   vercel env add REDIS_URL production
   vercel env add NEXTAUTH_URL production
   vercel env add NEXTAUTH_SECRET production
   vercel env add IP_HASH_SALT production
   # ... add all other env vars
   ```

5. **Deploy:**
   ```bash
   vercel --prod
   ```

### Update Vercel Configuration

The `vercel.json` needs to be updated with new cron jobs:

```json
{
  "crons": [
    {
      "path": "/api/cron/usage-aggregation",
      "schedule": "0 1 * * *"
    },
    {
      "path": "/api/cron/daily-sync",
      "schedule": "0 */4 * * *"
    },
    {
      "path": "/api/cron/alerts-engine",
      "schedule": "0 4 * * *"
    },
    {
      "path": "/api/cron/touchpoint-derivation",
      "schedule": "*/15 * * * *"
    },
    {
      "path": "/api/cron/attribution-weights",
      "schedule": "0 * * * *"
    },
    {
      "path": "/api/cron/daily-rollups",
      "schedule": "0 3 * * *"
    }
  ]
}
```

---

## Option 2: Docker Deployment

### Build Images

```bash
# Build backend
docker build -f docker/Dockerfile.backend -t optiq-backend .

# Build frontend
docker build -f docker/Dockerfile.frontend -t optiq-frontend .
```

### Docker Compose

Create `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: optiq
      POSTGRES_USER: optiq
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  backend:
    image: optiq-backend
    environment:
      DATABASE_URL: postgresql://optiq:${POSTGRES_PASSWORD}@postgres:5432/optiq
      REDIS_URL: redis://redis:6379
    depends_on:
      - postgres
      - redis
    ports:
      - "3001:3001"

  frontend:
    image: optiq-frontend
    environment:
      DATABASE_URL: postgresql://optiq:${POSTGRES_PASSWORD}@postgres:5432/optiq
      REDIS_URL: redis://redis:6379
      NEXTAUTH_URL: ${NEXTAUTH_URL}
      NEXTAUTH_SECRET: ${NEXTAUTH_SECRET}
      IP_HASH_SALT: ${IP_HASH_SALT}
    depends_on:
      - backend
      - postgres
      - redis
    ports:
      - "3000:3000"

volumes:
  postgres_data:
  redis_data:
```

### Deploy

```bash
# Set environment variables
export POSTGRES_PASSWORD="your-secure-password"
export NEXTAUTH_URL="https://your-domain.com"
export NEXTAUTH_SECRET="your-nextauth-secret"
export IP_HASH_SALT="your-ip-hash-salt"

# Start services
docker-compose -f docker-compose.prod.yml up -d

# Run migrations
docker-compose -f docker-compose.prod.yml exec frontend npx prisma migrate deploy
```

---

## Option 3: Manual Deployment

### On Your Server

1. **Install Dependencies:**
   ```bash
   npm ci
   ```

2. **Build:**
   ```bash
   npm run build
   ```

3. **Run Migrations:**
   ```bash
   cd apps/backend
   npx prisma migrate deploy
   ```

4. **Start Services:**
   ```bash
   # Backend
   cd apps/backend
   npm start

   # Frontend
   cd apps/frontend
   npm start
   ```

5. **Setup Process Manager (PM2):**
   ```bash
   npm install -g pm2

   # Start backend
   pm2 start apps/backend/dist/index.js --name optiq-backend

   # Start frontend
   pm2 start npm --name optiq-frontend -- start --prefix apps/frontend

   # Save PM2 config
   pm2 save
   pm2 startup
   ```

---

## Post-Deployment Steps

### 1. Verify Database Connection

```bash
# Test database connection
npx prisma db pull
```

### 2. Run Migrations

```bash
cd apps/backend
npx prisma migrate deploy
```

### 3. Create Indexes

The rollup indexes should be created automatically via migration. Verify:

```sql
-- Check indexes exist
SELECT indexname FROM pg_indexes 
WHERE tablename = 'DailyRollup';
```

### 4. Test Endpoints

```bash
# Test tracking endpoint
curl -X POST https://your-domain.com/api/track \
  -H "Content-Type: application/json" \
  -d '{
    "publicKey": "pk_test",
    "eventId": "evt_test",
    "type": "PAGE_VIEW",
    "url": "https://example.com",
    "path": "/",
    "anonId": "anon_test",
    "sessionId": "sess_test"
  }'

# Test waste endpoint (requires auth)
curl https://your-domain.com/api/waste
```

### 5. Setup Cron Jobs

If not using Vercel cron, set up cron jobs manually:

```bash
# Edit crontab
crontab -e

# Add jobs
*/15 * * * * curl -X POST https://your-domain.com/api/cron/touchpoint-derivation
0 * * * * curl -X POST https://your-domain.com/api/cron/attribution-weights
0 3 * * * curl -X POST https://your-domain.com/api/cron/daily-rollups
0 1 * * * curl -X POST https://your-domain.com/api/cron/usage-aggregation
0 */4 * * * curl -X POST https://your-domain.com/api/cron/daily-sync
0 4 * * * curl -X POST https://your-domain.com/api/cron/alerts-engine
```

### 6. Monitor Logs

```bash
# Vercel
vercel logs --follow

# Docker
docker-compose logs -f

# PM2
pm2 logs
```

---

## Cron Job Endpoints to Create

You need to create these cron endpoints:

### 1. TouchPoint Derivation
**File:** `apps/frontend/src/app/api/cron/touchpoint-derivation/route.ts`

```typescript
import { NextResponse } from "next/server";
import { deriveTouchPoints } from "@/lib/jobs/touchpoint-derivation";

export const runtime = "nodejs";

export async function POST(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await deriveTouchPoints({
      lookbackHours: 24,
    });

    return NextResponse.json({
      success: true,
      touchPointsCreated: result.touchPointsCreated,
    });
  } catch (error) {
    console.error("TouchPoint derivation failed:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

### 2. Attribution Weights
**File:** `apps/frontend/src/app/api/cron/attribution-weights/route.ts`

```typescript
import { NextResponse } from "next/server";
import { runAttribution } from "@/lib/jobs/run-attribution";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const result = await runAttribution({
      fromDate: yesterday,
      toDate: today,
      model: "LAST_TOUCH",
    });

    return NextResponse.json({
      success: true,
      conversionsProcessed: result.conversionsProcessed,
      linksUpdated: result.linksUpdated,
    });
  } catch (error) {
    console.error("Attribution weights calculation failed:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

### 3. Daily Rollups
**File:** `apps/frontend/src/app/api/cron/daily-rollups/route.ts`

```typescript
import { NextResponse } from "next/server";
import { runDailyRollupsV2 } from "@/lib/jobs/daily-rollups-v2";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    const result = await runDailyRollupsV2({
      fromDate: yesterday,
      toDate: yesterday,
      attributionModel: "LAST_TOUCH",
    });

    return NextResponse.json({
      success: true,
      daysProcessed: result.daysProcessed,
      rollupsCreated: result.rollupsCreated,
      rollupsUpdated: result.rollupsUpdated,
    });
  } catch (error) {
    console.error("Daily rollups failed:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

---

## Environment-Specific Configuration

### Production

```bash
NODE_ENV=production
DATABASE_URL="postgresql://..."
REDIS_URL="redis://..."
NEXTAUTH_URL="https://app.optiq.com"
```

### Staging

```bash
NODE_ENV=staging
DATABASE_URL="postgresql://..."
REDIS_URL="redis://..."
NEXTAUTH_URL="https://staging.optiq.com"
```

---

## Monitoring & Alerts

### Key Metrics to Monitor

1. **API Response Times:**
   - `/api/track` < 200ms
   - `/api/waste` < 500ms

2. **Job Execution:**
   - TouchPoint derivation success rate
   - Attribution calculation success rate
   - Rollup generation success rate

3. **Database:**
   - Connection pool usage
   - Query performance
   - Index usage

4. **Rate Limiting:**
   - Rate limit hits per site
   - Blocked requests

### Setup Monitoring

Use Vercel Analytics or your preferred monitoring solution:

```typescript
// Add to middleware or API routes
import { track } from "@vercel/analytics";

track("api_request", {
  endpoint: "/api/track",
  duration: responseTime,
  status: response.status,
});
```

---

## Rollback Plan

If deployment fails:

1. **Vercel:**
   ```bash
   vercel rollback
   ```

2. **Docker:**
   ```bash
   docker-compose down
   docker-compose -f docker-compose.prod.yml up -d --force-recreate
   ```

3. **Database:**
   ```bash
   # Rollback last migration
   npx prisma migrate resolve --rolled-back <migration-name>
   ```

---

## Security Checklist

- [ ] All environment variables set securely
- [ ] Database connection uses SSL
- [ ] CRON_SECRET set for cron endpoints
- [ ] Rate limiting configured
- [ ] IP hashing salt is unique and secure
- [ ] CORS configured for tracking endpoint
- [ ] Security headers configured
- [ ] API authentication working

---

## Performance Optimization

### Database

1. **Connection Pooling:**
   ```
   DATABASE_URL="...?connection_limit=10"
   ```

2. **Indexes Created:**
   - DailyRollup indexes (6 total)
   - TrackingEvent indexes
   - TouchPoint indexes
   - AttributionLink indexes

### Redis

1. **Configure for Rate Limiting:**
   ```
   maxmemory 256mb
   maxmemory-policy allkeys-lru
   ```

### Next.js

1. **Enable Caching:**
   ```typescript
   export const revalidate = 3600; // 1 hour
   ```

2. **Optimize Images:**
   ```typescript
   import Image from "next/image";
   ```

---

## Troubleshooting

### Common Issues

**1. Database Connection Fails:**
- Check DATABASE_URL format
- Verify network connectivity
- Check firewall rules

**2. Migrations Fail:**
- Ensure database user has CREATE permissions
- Check for conflicting migrations
- Verify schema is clean

**3. Cron Jobs Not Running:**
- Verify CRON_SECRET is set
- Check cron job authorization
- Review logs for errors

**4. Rate Limiting Not Working:**
- Verify REDIS_URL is set
- Check Redis connection
- Review rate limit configuration

---

## Support

For deployment issues:
1. Check logs first
2. Review documentation
3. Contact support with:
   - Error messages
   - Deployment method
   - Environment details

---

## Summary

Deployment checklist:
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] Indexes created
- [ ] Build successful
- [ ] Cron endpoints created
- [ ] Cron jobs scheduled
- [ ] Endpoints tested
- [ ] Monitoring configured
- [ ] Security verified
- [ ] Performance optimized
