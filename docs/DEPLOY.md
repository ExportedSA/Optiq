# Production Deployment Blueprint

This document provides a comprehensive guide for deploying Optiq to production with a repeatable, scalable architecture.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         PRODUCTION                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐      │
│  │   Vercel     │    │   Vercel     │    │   Vercel     │      │
│  │  (Frontend)  │    │  (API Routes)│    │  (Cron Jobs) │      │
│  └──────┬───────┘    └──────┬───────┘    └──────┬───────┘      │
│         │                   │                   │               │
│         └───────────────────┼───────────────────┘               │
│                             │                                    │
│                    ┌────────▼────────┐                          │
│                    │  Vercel Edge    │                          │
│                    │   Functions     │                          │
│                    └────────┬────────┘                          │
│                             │                                    │
│         ┌───────────────────┼───────────────────┐               │
│         │                   │                   │               │
│  ┌──────▼──────┐    ┌──────▼──────┐    ┌──────▼──────┐        │
│  │   Neon      │    │   Upstash   │    │   Sentry    │        │
│  │  Postgres   │    │   Redis     │    │  (Errors)   │        │
│  └─────────────┘    └─────────────┘    └─────────────┘        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Recommended Stack

| Component | Service | Tier | Notes |
|-----------|---------|------|-------|
| **Web Hosting** | Vercel | Pro | Auto-scaling, edge network |
| **Database** | Neon Postgres | Scale | Serverless, branching |
| **Cache/Queue** | Upstash Redis | Pay-as-you-go | Serverless Redis |
| **Error Tracking** | Sentry | Team | Error monitoring |
| **Logging** | Vercel Logs + Axiom | Pro | Log aggregation |
| **Secrets** | Vercel Environment Variables | - | Encrypted at rest |
| **CDN** | Vercel Edge Network | - | Global distribution |
| **DNS** | Cloudflare | Pro | DDoS protection |

## Environment Separation

### Environment Tiers

| Environment | Purpose | Database | URL |
|-------------|---------|----------|-----|
| **Development** | Local development | Local Postgres / Neon branch | `localhost:3000` |
| **Preview** | PR previews | Neon branch (auto-created) | `*.vercel.app` |
| **Staging** | Pre-production testing | Neon staging branch | `staging.optiq.io` |
| **Production** | Live application | Neon main branch | `app.optiq.io` |

### Environment Variables by Tier

```bash
# ============================================================================
# DEVELOPMENT (.env.local)
# ============================================================================
NODE_ENV=development
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/optiq_dev
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=dev-secret-change-in-production
LOG_LEVEL=debug

# ============================================================================
# STAGING (Vercel Environment Variables - Preview)
# ============================================================================
NODE_ENV=production
DATABASE_URL=postgresql://...@neon.tech/optiq_staging?sslmode=require
NEXTAUTH_URL=https://staging.optiq.io
NEXTAUTH_SECRET=${STAGING_AUTH_SECRET}
SENTRY_DSN=${SENTRY_DSN}
SENTRY_ENVIRONMENT=staging
LOG_LEVEL=info

# ============================================================================
# PRODUCTION (Vercel Environment Variables - Production)
# ============================================================================
NODE_ENV=production
DATABASE_URL=postgresql://...@neon.tech/optiq_prod?sslmode=require
NEXTAUTH_URL=https://app.optiq.io
NEXTAUTH_SECRET=${PROD_AUTH_SECRET}
SENTRY_DSN=${SENTRY_DSN}
SENTRY_ENVIRONMENT=production
LOG_LEVEL=info
STRIPE_SECRET_KEY=${STRIPE_LIVE_SECRET_KEY}
```

## Vercel Configuration

### vercel.json

```json
{
  "framework": "nextjs",
  "buildCommand": "cd apps/frontend && npm run build",
  "outputDirectory": "apps/frontend/.next",
  "installCommand": "npm ci",
  "regions": ["iad1", "sfo1", "cdg1"],
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
    }
  ],
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" }
      ]
    }
  ]
}
```

### Project Settings

1. **Framework Preset**: Next.js
2. **Root Directory**: `apps/frontend`
3. **Build Command**: `npm run build`
4. **Output Directory**: `.next`
5. **Install Command**: `npm ci`
6. **Node.js Version**: 20.x

## Database Setup (Neon)

### Initial Setup

1. Create Neon project at [neon.tech](https://neon.tech)
2. Create branches:
   - `main` → Production
   - `staging` → Staging
   - `dev` → Development (optional)

3. Enable connection pooling (PgBouncer)
4. Copy connection strings to Vercel

### Connection String Format

```
postgresql://[user]:[password]@[endpoint].neon.tech/[database]?sslmode=require
```

### Database Branching Strategy

```
main (production)
├── staging (pre-production)
│   └── feature-branches (PR previews)
└── dev (development)
```

### Migration Strategy

```bash
# Generate migration
npx prisma migrate dev --name <migration_name>

# Deploy to staging
DATABASE_URL=$STAGING_DB_URL npx prisma migrate deploy

# Deploy to production (after staging verification)
DATABASE_URL=$PROD_DB_URL npx prisma migrate deploy
```

## Background Jobs Strategy

### Option 1: Vercel Cron Jobs (Recommended for Start)

Vercel supports cron jobs for Pro/Enterprise plans.

```typescript
// apps/frontend/src/app/api/cron/usage-aggregation/route.ts
import { NextResponse } from "next/server";
import { runUsageAggregation } from "@/lib/jobs/usage-aggregation";

export const runtime = "nodejs";
export const maxDuration = 300; // 5 minutes

export async function GET(req: Request) {
  // Verify cron secret
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await runUsageAggregation();
  return NextResponse.json({ success: true });
}
```

### Option 2: Upstash QStash (Scalable)

For more complex job scheduling:

```typescript
import { Client } from "@upstash/qstash";

const qstash = new Client({ token: process.env.QSTASH_TOKEN! });

// Schedule a job
await qstash.publishJSON({
  url: "https://app.optiq.io/api/jobs/sync",
  body: { accountId: "acc_123" },
  delay: 60, // seconds
  retries: 3,
});
```

### Option 3: Dedicated Worker (High Volume)

For high-volume processing, deploy a separate worker:

```yaml
# docker-compose.worker.yml
services:
  worker:
    build: ./apps/backend
    command: npm run worker
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
    deploy:
      replicas: 2
```

### Job Schedule Reference

| Job | Schedule | Duration | Priority |
|-----|----------|----------|----------|
| Usage Aggregation | `0 1 * * *` (1am daily) | ~5 min | High |
| Ad Data Sync | `0 */4 * * *` (every 4h) | ~30 min | Medium |
| Alerts Engine | `0 4 * * *` (4am daily) | ~10 min | Medium |
| Journey Builder | `0 * * * *` (hourly) | ~15 min | Low |
| Data Cleanup | `0 3 * * 0` (3am Sunday) | ~30 min | Low |

## Deployment Process

### Automated Deployment (CI/CD)

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Run E2E tests
        run: |
          cd apps/frontend
          npx playwright install --with-deps chromium
          npm run test:e2e
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: ${{ github.ref == 'refs/heads/main' && '--prod' || '' }}
```

### Manual Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### Deployment Checklist

- [ ] All tests passing (unit, integration, E2E)
- [ ] Database migrations applied to staging
- [ ] Staging environment tested
- [ ] Environment variables verified
- [ ] Sentry release created
- [ ] Database backup taken (for major changes)
- [ ] Rollback plan documented

## Rollback Process

### Instant Rollback (Vercel)

Vercel maintains deployment history. To rollback:

1. **Via Dashboard**:
   - Go to Vercel Dashboard → Project → Deployments
   - Find the previous working deployment
   - Click "..." → "Promote to Production"

2. **Via CLI**:
   ```bash
   # List deployments
   vercel ls
   
   # Rollback to specific deployment
   vercel rollback [deployment-url]
   ```

### Database Rollback

For database changes:

1. **Minor Changes** (additive):
   - Usually no rollback needed
   - New columns/tables are backward compatible

2. **Major Changes** (breaking):
   ```bash
   # Before deployment, create backup
   pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql
   
   # If rollback needed
   psql $DATABASE_URL < backup_20240115.sql
   ```

3. **Neon Point-in-Time Recovery**:
   - Neon supports branching from any point in time
   - Create a branch from before the migration
   - Switch connection string to recovery branch

### Rollback Runbook

```markdown
## Rollback Procedure

### 1. Identify the Issue
- Check Sentry for errors
- Review Vercel logs
- Identify the problematic deployment

### 2. Rollback Application
vercel rollback [last-good-deployment-url]

### 3. Rollback Database (if needed)
# Option A: Restore from backup
psql $DATABASE_URL < backup_YYYYMMDD.sql

# Option B: Neon branch restore
neon branches create --name recovery --parent main --point-in-time "2024-01-15T10:00:00Z"

### 4. Verify
- Check health endpoint: curl https://app.optiq.io/api/health
- Verify critical flows work
- Monitor error rates in Sentry

### 5. Post-Mortem
- Document what went wrong
- Update deployment checklist
- Create fix PR
```

## Monitoring & Alerts

### Health Checks

```bash
# Liveness (is the app running?)
GET /api/health?type=live

# Readiness (is the app ready to serve traffic?)
GET /api/health?type=ready

# Full health (detailed status)
GET /api/health
```

### Uptime Monitoring

Configure external monitoring (e.g., Better Uptime, Pingdom):

| Check | URL | Interval | Alert |
|-------|-----|----------|-------|
| App Health | `https://app.optiq.io/api/health` | 1 min | Slack, PagerDuty |
| API Response | `https://app.optiq.io/api/health?type=ready` | 1 min | Slack |
| SSL Certificate | `https://app.optiq.io` | 1 day | Email |

### Sentry Alerts

Configure alerts for:
- Error rate > 1% of requests
- New error types
- Performance degradation (p95 > 2s)

## Security Checklist

### Pre-Deployment

- [ ] All secrets in environment variables (not in code)
- [ ] NEXTAUTH_SECRET is unique per environment
- [ ] Database connections use SSL
- [ ] API rate limiting enabled
- [ ] CORS configured correctly
- [ ] CSP headers set

### Post-Deployment

- [ ] SSL certificate valid
- [ ] Security headers present (check with securityheaders.com)
- [ ] No sensitive data in logs
- [ ] Error messages don't leak internal details

## Cost Estimation

### Starter (< 10k MAU)

| Service | Tier | Monthly Cost |
|---------|------|--------------|
| Vercel | Pro | $20 |
| Neon | Free | $0 |
| Upstash | Free | $0 |
| Sentry | Free | $0 |
| **Total** | | **~$20/mo** |

### Growth (10k-100k MAU)

| Service | Tier | Monthly Cost |
|---------|------|--------------|
| Vercel | Pro | $20 + usage |
| Neon | Scale | $69 |
| Upstash | Pay-as-you-go | ~$20 |
| Sentry | Team | $26 |
| **Total** | | **~$150/mo** |

### Scale (100k+ MAU)

| Service | Tier | Monthly Cost |
|---------|------|--------------|
| Vercel | Enterprise | Custom |
| Neon | Scale | $69+ |
| Upstash | Pro | $100+ |
| Sentry | Business | $80+ |
| **Total** | | **$500+/mo** |

## Quick Reference

### Useful Commands

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod

# View logs
vercel logs [deployment-url]

# List deployments
vercel ls

# Rollback
vercel rollback [deployment-url]

# Run migrations
DATABASE_URL=$PROD_DB_URL npx prisma migrate deploy

# Check health
curl https://app.optiq.io/api/health | jq
```

### Important URLs

| Resource | URL |
|----------|-----|
| Vercel Dashboard | `https://vercel.com/[team]/optiq` |
| Neon Console | `https://console.neon.tech` |
| Sentry Dashboard | `https://sentry.io/organizations/[org]/projects/optiq` |
| GitHub Actions | `https://github.com/[org]/optiq/actions` |

### Emergency Contacts

| Role | Contact | Escalation |
|------|---------|------------|
| On-Call Engineer | PagerDuty | Immediate |
| Platform Lead | Slack #platform | 15 min |
| Database Admin | Slack #database | 30 min |
