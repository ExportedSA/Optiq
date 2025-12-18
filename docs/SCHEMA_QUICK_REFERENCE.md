# Optiq Schema Quick Reference

## Entity Relationship Overview

```
User ──< Membership >── Organization ──< Subscription
                              │
                              ├──< AdAccount ──< Campaign ──< Ad
                              │         │           │          │
                              │         └───────────┴──────────┴──< DailyMetrics
                              │
                              ├──< GoogleAdsCredential
                              ├──< MetaAdsCredential
                              ├──< TikTokAdsCredential
                              │
                              ├──< TrackingSite ──< TrackingEvent
                              │         │              │
                              │         └──< TouchPoint ┴──< AttributionLink
                              │
                              ├──< Journey ──< JourneyEvent
                              │
                              ├──< AlertRule ──< AlertEvent
                              │
                              └──< IngestionJob
```

---

## Core Entities Summary

### 👤 **Users & Auth**
| Entity | Purpose | Key Fields |
|--------|---------|------------|
| `User` | User accounts | email, name, activeOrgId |
| `Account` | OAuth providers | provider, providerAccountId, access_token |
| `Session` | Active sessions | sessionToken, expires |
| `Membership` | Org membership | userId, organizationId, role |

### 🏢 **Workspaces**
| Entity | Purpose | Key Fields |
|--------|---------|------------|
| `Organization` | Tenant workspace | name, slug |
| `Subscription` | Billing & plans | plan, status, stripeCustomerId |
| `OrganizationSettings` | Org config | alertSettings, attributionSettings |

### 🔌 **Ad Platforms**
| Entity | Purpose | Key Fields |
|--------|---------|------------|
| `Platform` | Platform reference | code (GOOGLE_ADS, META, TIKTOK) |
| `AdAccount` | Connected accounts | externalId, platformId, currency |
| `Campaign` | Ad campaigns | externalId, name, objective |
| `Ad` | Individual ads | externalId, name, status |

### 💰 **Costs (Metrics)**
| Entity | Purpose | Grain | Key Metrics |
|--------|---------|-------|-------------|
| `DailyAdAccountMetric` | Account-level | Daily | impressions, clicks, spendMicros |
| `DailyCampaignMetric` | Campaign-level | Daily | impressions, clicks, spendMicros |
| `DailyAdMetric` | Ad-level | Daily | impressions, clicks, spendMicros |

### 🔐 **Integration Tokens**
| Entity | Purpose | Key Fields |
|--------|---------|------------|
| `GoogleAdsCredential` | Google Ads OAuth | customerId, refreshTokenEnc |
| `MetaAdsCredential` | Meta Ads OAuth | adAccountId, accessTokenEnc |
| `TikTokAdsCredential` | TikTok Ads OAuth | advertiserId, refreshTokenEnc |

### 📊 **Events & Tracking**
| Entity | Purpose | Key Fields |
|--------|---------|------------|
| `TrackingSite` | Tracked websites | domain, publicKey |
| `TrackingEvent` | Page views, conversions | type, anonId, sessionId, utmSource |
| `TouchPoint` | Ad touchpoints | gclid, fbclid, ttclid, utmCampaign |
| `AttributionLink` | Attribution weights | conversionId, touchPointId, model, weight |

### 🛤️ **Journeys**
| Entity | Purpose | Key Fields |
|--------|---------|------------|
| `Journey` | Customer journeys | anonId, status, conversionValue |
| `JourneyEvent` | Events in journey | journeyId, trackingEventId, sequenceNumber |

### 🚨 **Alerts**
| Entity | Purpose | Key Fields |
|--------|---------|------------|
| `AlertRule` | Alert definitions | type, severity, config, evaluationInterval |
| `AlertEvent` | Triggered alerts | alertRuleId, status, context |

---

## Common Query Patterns

### Get User's Organizations
```typescript
const orgs = await prisma.organization.findMany({
  where: {
    members: {
      some: { userId: user.id }
    }
  },
  include: {
    members: {
      where: { userId: user.id },
      select: { role: true }
    }
  }
});
```

### Get Daily Spend by Campaign
```typescript
const metrics = await prisma.dailyCampaignMetric.findMany({
  where: {
    organizationId: orgId,
    date: {
      gte: startDate,
      lte: endDate
    }
  },
  include: {
    campaign: {
      select: { name: true }
    }
  }
});
```

### Get Conversion Journey
```typescript
const journey = await prisma.journey.findUnique({
  where: { id: journeyId },
  include: {
    events: {
      include: {
        trackingEvent: true
      },
      orderBy: { sequenceNumber: 'asc' }
    }
  }
});
```

### Get Attribution for Conversion
```typescript
const attribution = await prisma.attributionLink.findMany({
  where: {
    conversionId: conversionId,
    model: 'LINEAR'
  },
  include: {
    touchPoint: true
  },
  orderBy: { position: 'asc' }
});
```

### Get Active Alerts
```typescript
const alerts = await prisma.alertEvent.findMany({
  where: {
    organizationId: orgId,
    status: 'TRIGGERED',
    severity: { in: ['WARNING', 'CRITICAL'] }
  },
  include: {
    alertRule: {
      select: { name: true, type: true }
    }
  },
  orderBy: { triggeredAt: 'desc' }
});
```

---

## Enum Reference

### MembershipRole
- `OWNER` - Full access, billing management
- `ADMIN` - Manage settings, users
- `MEMBER` - View and edit data
- `VIEWER` - Read-only access

### SubscriptionPlan
- `FREE` - Limited features
- `STARTER` - Small teams
- `PROFESSIONAL` - Growing businesses
- `ENTERPRISE` - Large organizations

### SubscriptionStatus
- `ACTIVE` - Paid and active
- `TRIALING` - In trial period
- `PAST_DUE` - Payment failed
- `CANCELED` - Subscription canceled
- `PAUSED` - Temporarily paused

### PlatformCode
- `GOOGLE_ADS` - Google Ads
- `META` - Facebook/Instagram Ads
- `TIKTOK` - TikTok Ads
- `LINKEDIN` - LinkedIn Ads
- `X` - X (Twitter) Ads

### TrackingEventType
- `PAGE_VIEW` - Page view event
- `CONVERSION` - Conversion event
- `CUSTOM` - Custom event

### AttributionModel
- `FIRST_TOUCH` - 100% to first touchpoint
- `LAST_TOUCH` - 100% to last touchpoint
- `LINEAR` - Equal weight to all touchpoints
- `TIME_DECAY` - More weight to recent touchpoints
- `POSITION_BASED` - 40% first, 40% last, 20% middle
- `DATA_DRIVEN` - ML-based attribution

### JourneyStatus
- `IN_PROGRESS` - Active journey
- `CONVERTED` - Journey ended with conversion
- `ABANDONED` - Journey abandoned (no activity)

### AlertRuleType
- `SPEND_THRESHOLD` - Spend exceeds limit
- `CONVERSION_DROP` - Conversions dropped
- `CPA_SPIKE` - Cost per acquisition increased
- `ROAS_DROP` - Return on ad spend decreased
- `CLICK_ANOMALY` - Unusual click patterns
- `IMPRESSION_ANOMALY` - Unusual impression patterns
- `CUSTOM` - Custom rule logic

### AlertSeverity
- `INFO` - Informational
- `WARNING` - Needs attention
- `CRITICAL` - Urgent action required

### AlertEventStatus
- `TRIGGERED` - Alert fired
- `ACKNOWLEDGED` - User acknowledged
- `RESOLVED` - Issue resolved
- `DISMISSED` - Alert dismissed

---

## Data Type Conventions

### Monetary Values (Micros)
```typescript
// Store: $10.50 = 10,500,000 micros
const spendMicros = 10_500_000n;

// Display: Convert to dollars
const dollars = Number(spendMicros) / 1_000_000;
// Result: 10.50
```

### BigInt Handling
```typescript
// Prisma returns BigInt for large numbers
const metrics = await prisma.dailyAdMetric.findUnique({
  where: { id }
});

// Convert to number for calculations
const impressions = Number(metrics.impressions);
const clicks = Number(metrics.clicks);
const ctr = (clicks / impressions) * 100;
```

### Date Handling
```typescript
// Date-only fields (no time)
const date = new Date('2024-01-15');

// DateTime fields (with time)
const timestamp = new Date();

// Query date ranges
const metrics = await prisma.dailyAdMetric.findMany({
  where: {
    date: {
      gte: new Date('2024-01-01'),
      lte: new Date('2024-01-31')
    }
  }
});
```

---

## Index Usage Tips

### Use Composite Indexes
```typescript
// ✅ Good - Uses index (organizationId, date)
const metrics = await prisma.dailyAdMetric.findMany({
  where: {
    organizationId: orgId,
    date: { gte: startDate }
  }
});

// ❌ Bad - Can't use composite index efficiently
const metrics = await prisma.dailyAdMetric.findMany({
  where: {
    date: { gte: startDate }
    // Missing organizationId
  }
});
```

### Avoid N+1 Queries
```typescript
// ❌ Bad - N+1 queries
const campaigns = await prisma.campaign.findMany({
  where: { organizationId: orgId }
});
for (const campaign of campaigns) {
  const metrics = await prisma.dailyCampaignMetric.findMany({
    where: { campaignId: campaign.id }
  });
}

// ✅ Good - Single query with include
const campaigns = await prisma.campaign.findMany({
  where: { organizationId: orgId },
  include: {
    dailyCampaignMetrics: {
      where: {
        date: { gte: startDate }
      }
    }
  }
});
```

---

## Migration Commands

### Generate Prisma Client
```bash
npm run prisma:generate -w @optiq/backend
```

### Create Migration
```bash
npm run prisma:migrate:dev -w @optiq/backend -- --name migration_name
```

### Apply Migrations (Production)
```bash
npm run prisma:migrate -w @optiq/backend
```

### Reset Database (Development)
```bash
npx prisma migrate reset
```

### View Database
```bash
npm run prisma:studio -w @optiq/backend
```

---

## Type Generation

Prisma automatically generates TypeScript types:

```typescript
import { PrismaClient, User, Organization, Campaign } from '@prisma/client';

// Generated types
type UserWithMemberships = User & {
  memberships: (Membership & {
    organization: Organization;
  })[];
};

// Use Prisma.validator for complex types
import { Prisma } from '@prisma/client';

const userWithOrgs = Prisma.validator<Prisma.UserArgs>()({
  include: {
    memberships: {
      include: {
        organization: true
      }
    }
  }
});

type UserWithOrgs = Prisma.UserGetPayload<typeof userWithOrgs>;
```

---

## Best Practices

### ✅ DO
- Always filter by `organizationId` for tenant isolation
- Use transactions for multi-step operations
- Use `select` to limit returned fields
- Use `include` for related data (avoid N+1)
- Use BigInt for large numbers (impressions, clicks)
- Use micros for monetary values
- Index frequently queried fields
- Use enums for controlled vocabularies

### ❌ DON'T
- Don't expose raw database errors to users
- Don't use floating-point for money
- Don't forget to encrypt sensitive data
- Don't hard-delete data (use soft deletes)
- Don't skip migrations in production
- Don't query without tenant filtering
- Don't use `findMany` without limits
- Don't store PII without encryption

---

## Useful Resources

- **Prisma Docs**: https://www.prisma.io/docs
- **Schema Reference**: `apps/backend/prisma/schema.prisma`
- **Full Documentation**: `docs/DATABASE_SCHEMA.md`
- **Migrations**: `apps/backend/prisma/migrations/`
