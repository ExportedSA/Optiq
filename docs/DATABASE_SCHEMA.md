# Optiq Database Schema Design

## Overview

This document describes the core domain model for Optiq, a marketing attribution and analytics platform. The schema is designed to support multi-tenant workspaces, ad platform integrations, event tracking, customer journey analysis, and intelligent alerting.

---

## Design Principles

### 1. **Multi-Tenancy**
- Organizations (workspaces) are the primary tenant boundary
- All data is scoped to an organization for isolation and security
- Users can belong to multiple organizations with different roles

### 2. **Scalability**
- BigInt for high-volume metrics (impressions, clicks, spend)
- Micros for monetary values (avoids floating-point precision issues)
- Efficient indexing for time-series queries
- Partitioning-ready date columns

### 3. **Data Integrity**
- Foreign key constraints with appropriate cascade rules
- Unique constraints to prevent duplicates
- Enum types for controlled vocabularies
- JSON for flexible metadata without schema changes

### 4. **Performance**
- Strategic indexes on common query patterns
- Composite indexes for multi-column queries
- Date-based partitioning for metrics tables
- CUID for distributed ID generation

---

## Core Domain Entities

### 👤 Users & Authentication

#### **User**
Core user entity with NextAuth.js integration.

**Key Fields:**
- `email` - Unique identifier, indexed
- `passwordHash` - Optional (supports OAuth-only users)
- `activeOrgId` - Current workspace context
- `emailVerified` - Email verification status

**Relationships:**
- Has many `Membership` (multi-tenant access)
- Has many `Account` (OAuth providers)
- Has many `Session` (active sessions)
- Belongs to one active `Organization`

**Rationale:** Supports both password and OAuth authentication, multi-workspace switching, and secure session management.

---

#### **Account**
OAuth provider accounts (Google, GitHub, etc.) linked to users.

**Key Fields:**
- `provider` - OAuth provider (google, github, etc.)
- `providerAccountId` - External user ID
- `access_token` - Encrypted OAuth token
- `refresh_token` - Token refresh capability

**Rationale:** NextAuth.js adapter pattern for OAuth integration.

---

#### **Session**
Active user sessions for authentication.

**Key Fields:**
- `sessionToken` - Unique session identifier
- `expires` - Session expiration timestamp

**Rationale:** Stateless session management with database persistence.

---

### 🏢 Workspaces & Membership

#### **Organization**
Multi-tenant workspace entity (referred to as "workspace" in UI).

**Key Fields:**
- `name` - Display name
- `slug` - URL-friendly identifier (unique)
- `settings` - One-to-one configuration

**Relationships:**
- Has many `Membership` (users with roles)
- Has many ad platform entities (AdAccount, Campaign, Ad)
- Has many tracking entities (TrackingSite, Journey)
- Has many alert entities (AlertRule, AlertEvent)
- Has one `Subscription` (billing)

**Rationale:** Central tenant entity for data isolation. Slug enables clean URLs like `/workspace/acme-corp/dashboard`.

---

#### **Membership**
User-to-Organization association with role-based access control.

**Key Fields:**
- `role` - OWNER | ADMIN | MEMBER | VIEWER
- `userId` + `organizationId` - Unique constraint

**Rationale:** Enables users to belong to multiple workspaces with different permission levels. OWNER can manage billing, ADMIN can manage settings, MEMBER can view/edit data, VIEWER is read-only.

---

### 💳 Subscription & Billing

#### **Subscription**
Billing and plan management with Stripe integration.

**Key Fields:**
- `plan` - FREE | STARTER | PROFESSIONAL | ENTERPRISE
- `status` - ACTIVE | TRIALING | PAST_DUE | CANCELED | PAUSED
- `stripeCustomerId` - Stripe customer reference
- `stripeSubscriptionId` - Stripe subscription reference
- `currentPeriodStart/End` - Billing cycle
- `monthlyEventLimit` - Usage quota
- `monthlySpendLimit` - Ad spend tracking limit

**Rationale:** Supports freemium model with usage-based limits. Stripe integration for payment processing. Trial periods for new users. Soft limits with grace periods.

---

### 🔌 Ad Platform Connections

#### **Platform**
Supported advertising platforms (Google Ads, Meta, TikTok, etc.).

**Key Fields:**
- `code` - Enum identifier (GOOGLE_ADS, META, TIKTOK)
- `name` - Display name

**Rationale:** Reference table for platform-specific logic and UI rendering.

---

#### **AdAccount**
Connected advertising accounts from platforms.

**Key Fields:**
- `externalId` - Platform's account ID
- `platformId` - Which platform
- `currency` - Account currency (USD, EUR, etc.)
- `timezone` - Account timezone for date alignment
- `status` - ACTIVE | PAUSED | ARCHIVED | DELETED

**Unique Constraint:** `(organizationId, platformId, externalId)` prevents duplicate connections.

**Rationale:** Represents a connected ad account. Multiple accounts per platform supported (e.g., multiple Google Ads accounts).

---

#### **Campaign**
Ad campaigns from connected platforms.

**Key Fields:**
- `externalId` - Platform's campaign ID
- `objective` - Campaign objective (CONVERSIONS, TRAFFIC, etc.)
- `startDate/endDate` - Campaign flight dates

**Rationale:** Synced from ad platforms daily. Hierarchical relationship: AdAccount → Campaign → Ad.

---

#### **Ad**
Individual ads from campaigns.

**Key Fields:**
- `externalId` - Platform's ad ID
- `name` - Ad name/creative identifier
- `status` - Ad delivery status

**Rationale:** Lowest level of ad hierarchy. Metrics aggregated at this level.

---

### 🔐 Integration Tokens (Credentials)

#### **GoogleAdsCredential**
OAuth credentials for Google Ads API access.

**Key Fields:**
- `customerId` - Google Ads customer ID
- `refreshTokenEnc` - Encrypted refresh token
- `accessTokenEnc` - Encrypted access token
- `accessTokenExpiresAt` - Token expiration

**Rationale:** Encrypted tokens for secure API access. Refresh tokens enable long-term access without re-authentication.

---

#### **MetaAdsCredential**
OAuth credentials for Meta (Facebook) Ads API.

**Key Fields:**
- `adAccountId` - Meta ad account ID
- `accessTokenEnc` - Encrypted long-lived token
- `accessTokenExpiresAt` - Token expiration (60 days)

**Rationale:** Meta tokens expire after 60 days. Requires re-authentication flow.

---

#### **TikTokAdsCredential**
OAuth credentials for TikTok Ads API.

**Key Fields:**
- `advertiserId` - TikTok advertiser ID
- `accessTokenEnc` - Encrypted access token
- `refreshTokenEnc` - Encrypted refresh token
- `accessTokenExpiresAt` - Short-lived token expiration
- `refreshTokenExpiresAt` - Long-lived refresh token expiration

**Rationale:** TikTok uses short-lived access tokens (24 hours) with long-lived refresh tokens (365 days).

---

### 💰 Costs (Ad Spend Metrics)

#### **DailyAdAccountMetric**
Daily aggregated metrics at the ad account level.

**Key Fields:**
- `date` - Metric date (partitionable)
- `impressions` - Total impressions (BigInt for scale)
- `clicks` - Total clicks
- `spendMicros` - Spend in micros (e.g., $10.50 = 10,500,000)
- `conversions` - Platform-reported conversions
- `revenueMicros` - Revenue in micros

**Unique Constraint:** `(organizationId, adAccountId, date)` prevents duplicate metrics.

**Rationale:** Daily grain for efficient aggregation. Micros avoid floating-point precision issues. BigInt supports high-volume campaigns.

---

#### **DailyCampaignMetric**
Daily metrics at the campaign level.

**Rationale:** Same structure as account metrics but scoped to campaign. Enables campaign-level analysis and optimization.

---

#### **DailyAdMetric**
Daily metrics at the individual ad level.

**Rationale:** Most granular metric level. Enables ad-level performance analysis. Aggregates up to campaign and account levels.

---

### 📊 Events (Tracking & Touchpoints)

#### **TrackingSite**
Websites with Optiq tracking installed.

**Key Fields:**
- `domain` - Website domain (e.g., example.com)
- `publicKey` - Public API key for tracking script
- `name` - Display name

**Unique Constraint:** `(organizationId, domain)` one tracking site per domain.

**Rationale:** Isolates tracking data by website. Public key enables client-side tracking without exposing credentials.

---

#### **TrackingEvent**
Individual events tracked on websites (page views, conversions, custom events).

**Key Fields:**
- `eventId` - Client-generated unique ID (idempotency)
- `type` - PAGE_VIEW | CONVERSION | CUSTOM
- `occurredAt` - Event timestamp
- `anonId` - Anonymous user identifier (cookie)
- `sessionId` - Session identifier
- `utmSource/Medium/Campaign/Term/Content` - UTM parameters
- `valueMicros` - Conversion value (for CONVERSION events)
- `properties` - Custom event properties (JSON)

**Unique Constraint:** `(siteId, eventId)` prevents duplicate events.

**Indexes:**
- `(siteId, occurredAt)` - Time-series queries
- `(siteId, type, occurredAt)` - Event type filtering
- `(siteId, anonId, occurredAt)` - User journey queries
- `(siteId, utmSource, occurredAt)` - Attribution queries

**Rationale:** Flexible event model supporting page views, conversions, and custom events. UTM parameters enable attribution. Anonymous ID enables cross-session tracking without PII.

---

#### **TouchPoint**
Marketing touchpoints (ad clicks) extracted from tracking events.

**Key Fields:**
- `anonId` - Links to user journey
- `sessionId` - Session context
- `occurredAt` - Touchpoint timestamp
- `gclid/fbclid/ttclid` - Platform click IDs
- `utmSource/Medium/Campaign` - UTM parameters
- `platformCode/campaignId/adId` - Resolved ad entity references

**Indexes:**
- `(siteId, anonId, occurredAt)` - Journey reconstruction
- `(siteId, gclid)` - Google Ads click matching
- `(siteId, fbclid)` - Meta Ads click matching
- `(siteId, ttclid)` - TikTok Ads click matching

**Rationale:** Separates ad touchpoints from general events for efficient attribution. Click IDs enable deterministic matching to ad platforms. UTM parameters provide fallback attribution.

---

#### **AttributionLink**
Links conversions to touchpoints with attribution weights.

**Key Fields:**
- `conversionId` - References TrackingEvent (type=CONVERSION)
- `touchPointId` - References TouchPoint
- `model` - Attribution model used (FIRST_TOUCH, LAST_TOUCH, LINEAR, etc.)
- `weight` - Attribution weight (0.0 to 1.0)
- `position` - Touchpoint position in journey (1-indexed)
- `touchPointCount` - Total touchpoints in journey

**Unique Constraint:** `(conversionId, touchPointId, model)` one link per model.

**Rationale:** Supports multiple attribution models simultaneously. Weights enable fractional attribution (e.g., LINEAR gives equal weight to all touchpoints). Position enables position-based models.

---

### 🛤️ Journeys (Customer Journey Tracking)

#### **Journey**
Customer journey from first touch to conversion (or abandonment).

**Key Fields:**
- `anonId` - Anonymous user identifier
- `sessionId` - Session context
- `status` - IN_PROGRESS | CONVERTED | ABANDONED
- `startedAt` - Journey start timestamp
- `convertedAt` - Conversion timestamp (if converted)
- `lastActivityAt` - Last event timestamp
- `conversionValue` - Total conversion value (micros)
- `conversionName` - Conversion event name
- `firstUtmSource/Medium/Campaign` - First touch attribution
- `lastUtmSource/Medium/Campaign` - Last touch attribution
- `touchPointCount` - Number of ad touchpoints
- `eventCount` - Total events in journey

**Indexes:**
- `(organizationId, status, lastActivityAt)` - Active journey queries
- `(organizationId, anonId)` - User journey lookup
- `(organizationId, convertedAt)` - Conversion analysis

**Rationale:** Aggregates user behavior into cohesive journeys. Enables journey-level analysis and optimization. Tracks conversion attribution at journey level. Supports abandonment detection and re-engagement.

---

#### **JourneyEvent**
Links tracking events to journeys in sequence.

**Key Fields:**
- `journeyId` - Parent journey
- `trackingEventId` - Event in journey
- `sequenceNumber` - Event order (1, 2, 3, ...)
- `occurredAt` - Event timestamp

**Unique Constraint:** `(journeyId, trackingEventId)` prevents duplicate events.

**Rationale:** Maintains event sequence for journey reconstruction. Enables funnel analysis and drop-off detection.

---

### 🚨 Alerts

#### **AlertRule**
Configurable alert rules for monitoring metrics and anomalies.

**Key Fields:**
- `name` - Rule name
- `type` - SPEND_THRESHOLD | CONVERSION_DROP | CPA_SPIKE | ROAS_DROP | CLICK_ANOMALY | CUSTOM
- `severity` - INFO | WARNING | CRITICAL
- `status` - ACTIVE | PAUSED | ARCHIVED
- `config` - Rule-specific configuration (JSON)
  - Example for SPEND_THRESHOLD: `{ "threshold": 10000000, "period": "daily", "adAccountId": "..." }`
  - Example for CONVERSION_DROP: `{ "dropPercentage": 30, "comparisonPeriod": "7d", "campaignId": "..." }`
- `evaluationInterval` - How often to evaluate (seconds)
- `lastEvaluatedAt` - Last evaluation timestamp
- `notifyEmail/InApp/Slack` - Notification channels

**Indexes:**
- `(organizationId, status)` - Active rule queries
- `(status, lastEvaluatedAt)` - Evaluation scheduling

**Rationale:** Flexible rule engine supporting multiple alert types. JSON config enables type-specific parameters without schema changes. Multiple notification channels. Evaluation interval prevents alert fatigue.

---

#### **AlertEvent**
Triggered alert instances.

**Key Fields:**
- `alertRuleId` - Parent rule
- `status` - TRIGGERED | ACKNOWLEDGED | RESOLVED | DISMISSED
- `severity` - Inherited from rule (can be escalated)
- `title` - Alert title
- `message` - Detailed alert message
- `context` - Alert context data (JSON)
  - Example: `{ "currentSpend": 15000000, "threshold": 10000000, "adAccountName": "Acme Corp" }`
- `triggeredAt` - When alert fired
- `acknowledgedAt/By` - Acknowledgment tracking
- `resolvedAt/By` - Resolution tracking
- `dismissedAt/By` - Dismissal tracking

**Indexes:**
- `(organizationId, status, triggeredAt)` - Active alert queries
- `(organizationId, severity, triggeredAt)` - Severity filtering
- `(alertRuleId, triggeredAt)` - Rule history

**Rationale:** Tracks alert lifecycle from trigger to resolution. Context data enables rich alert details. Acknowledgment prevents duplicate notifications. Resolution tracking for alert effectiveness analysis.

---

### ⚙️ System & Background Jobs

#### **IngestionJob**
Background jobs for syncing data from ad platforms.

**Key Fields:**
- `platform` - Which platform to sync
- `jobType` - DAILY_SYNC | BACKFILL | MANUAL
- `status` - QUEUED | RUNNING | SUCCEEDED | FAILED | CANCELLED
- `idempotencyKey` - Prevents duplicate jobs
- `payload` - Job-specific data (JSON)
- `runAt` - Scheduled execution time
- `attempts` - Retry count
- `maxAttempts` - Retry limit
- `lockedAt/By` - Distributed lock for job processing

**Indexes:**
- `(status, runAt)` - Job queue queries
- `(organizationId, platform, jobType)` - Job history

**Rationale:** Reliable background job processing with retries. Distributed locking prevents duplicate execution. Idempotency key prevents duplicate jobs. Flexible payload supports different job types.

---

#### **InAppNotification**
In-app notifications for users.

**Key Fields:**
- `title` - Notification title
- `message` - Notification body
- `priority` - normal | high | urgent
- `status` - pending | sent | read
- `actionUrl` - Optional action link
- `metadata` - Additional context (JSON)
- `readAt` - Read timestamp

**Rationale:** Supports in-app notification center. Priority enables urgent notifications. Action URL enables deep linking.

---

#### **OrganizationSettings**
Organization-level configuration.

**Key Fields:**
- `alertSettings` - Alert preferences (JSON)
- `attributionSettings` - Attribution model preferences (JSON)
- `trackingSettings` - Tracking configuration (JSON)

**Rationale:** Flexible settings without schema changes. JSON enables nested configuration. One-to-one relationship with Organization.

---

## Indexing Strategy

### Time-Series Queries
All metric tables have indexes on `(organizationId, date)` for efficient time-range queries.

### Attribution Queries
- `TrackingEvent`: `(siteId, anonId, occurredAt)` for journey reconstruction
- `TouchPoint`: `(siteId, gclid)`, `(siteId, fbclid)`, `(siteId, ttclid)` for click matching

### Hierarchical Queries
- Campaign metrics: `(campaignId, date)` for campaign-level aggregation
- Ad metrics: `(adId, date)` for ad-level aggregation

### Multi-Tenant Isolation
All tenant-scoped tables have indexes starting with `organizationId` for efficient data isolation.

---

## Data Types & Conventions

### IDs
- **CUID** - Collision-resistant unique identifiers for distributed systems
- Format: `cl9x0y0z0000009l6h8h8h8h8`
- Benefits: Sortable, URL-safe, no coordination required

### Monetary Values
- **Micros** - All monetary values stored as `BigInt` in micros (1/1,000,000 of base unit)
- Example: $10.50 = 10,500,000 micros
- Benefits: No floating-point precision issues, efficient storage

### Timestamps
- **DateTime** - All timestamps use PostgreSQL `TIMESTAMP WITH TIME ZONE`
- **Date** - Date-only fields use PostgreSQL `DATE` type
- Convention: `createdAt`, `updatedAt` for audit trails

### Enums
- **Uppercase** - All enum values use SCREAMING_SNAKE_CASE
- Benefits: Type safety, controlled vocabulary, efficient storage

### JSON Fields
- **Flexible Metadata** - Use JSON for configuration and context data
- Convention: Validate JSON structure in application code
- Benefits: Schema flexibility without migrations

---

## Migration Strategy

### Initial Migration
The schema is designed to be applied as a single initial migration for new deployments.

### Future Migrations
- **Additive Changes** - Add new tables/columns without breaking existing code
- **Backward Compatible** - Maintain old columns during deprecation period
- **Data Migrations** - Use Prisma migrations for data transformations
- **Rollback Plan** - Always test migrations with rollback procedures

### Production Deployment
1. Backup database before migration
2. Run migration in transaction (where possible)
3. Verify data integrity after migration
4. Monitor application logs for errors
5. Rollback if issues detected

---

## Performance Considerations

### Partitioning
Metric tables (`DailyAdAccountMetric`, `DailyCampaignMetric`, `DailyAdMetric`) should be partitioned by date for optimal performance:

```sql
-- Example: Partition by month
CREATE TABLE DailyAdMetric_2024_01 PARTITION OF DailyAdMetric
FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');
```

### Archival
- Archive old metrics to cold storage after 2 years
- Archive old tracking events after 1 year
- Maintain aggregated summaries for historical analysis

### Query Optimization
- Use materialized views for complex aggregations
- Cache frequently accessed data in Redis
- Use connection pooling for database connections
- Monitor slow queries and add indexes as needed

---

## Security Considerations

### Encryption
- **Credentials** - All OAuth tokens encrypted at rest using `DATA_ENCRYPTION_KEY`
- **PII** - Email addresses hashed for privacy
- **IP Addresses** - Hashed before storage (GDPR compliance)

### Access Control
- **Row-Level Security** - All queries filtered by `organizationId`
- **Role-Based Access** - Membership roles control data access
- **API Keys** - Public keys for tracking, private keys for API access

### Audit Trails
- **Created/Updated** - All entities track creation and update timestamps
- **Soft Deletes** - Use `status=DELETED` instead of hard deletes where appropriate
- **Change Logs** - Consider adding audit log table for sensitive changes

---

## Future Enhancements

### Planned Features
1. **Multi-Touch Attribution Models** - Data-driven attribution using machine learning
2. **Predictive Analytics** - Forecast conversions and spend
3. **Anomaly Detection** - Automated anomaly detection for alerts
4. **Custom Dimensions** - User-defined dimensions for segmentation
5. **Data Warehouse Integration** - Export to BigQuery, Snowflake, etc.

### Schema Evolution
- **Versioning** - Track schema version in database
- **Feature Flags** - Use feature flags for gradual rollout
- **A/B Testing** - Support for experimentation framework
- **Multi-Region** - Prepare for multi-region deployment

---

## Conclusion

This schema provides a solid foundation for Optiq's core functionality:
- ✅ Multi-tenant workspaces with role-based access
- ✅ Ad platform integrations with secure credential storage
- ✅ Event tracking and attribution
- ✅ Customer journey analysis
- ✅ Intelligent alerting
- ✅ Subscription and billing management

The design prioritizes scalability, performance, and data integrity while maintaining flexibility for future enhancements.
