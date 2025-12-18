# Observability Guide

This document describes the observability setup for Optiq, including structured logging, error tracking, performance monitoring, and health checks.

## Overview

The observability stack consists of:

1. **Structured Logging** - JSON-formatted logs for easy parsing
2. **Error Tracking** - Sentry integration for exception monitoring
3. **Performance Timing** - Instrumentation for routes, jobs, and queries
4. **Health Checks** - Endpoints for monitoring and k8s probes

## Environment Variables

```env
# Logging
LOG_LEVEL=info                    # debug | info | warn | error

# Sentry (error tracking)
SENTRY_DSN=https://xxx@sentry.io/xxx
SENTRY_ENVIRONMENT=production     # development | staging | production
SENTRY_RELEASE=1.0.0              # or git commit SHA
SENTRY_SAMPLE_RATE=1.0            # Error sample rate (0.0-1.0)
SENTRY_TRACES_SAMPLE_RATE=0.1     # Performance trace sample rate
SENTRY_DEBUG=false                # Enable in development
```

## Structured Logging

### Basic Usage

```typescript
import { createLogger, appLogger, apiLogger } from "@/lib/observability";

// Use pre-configured loggers
appLogger.info("Application started");
apiLogger.error("Request failed", error, { userId: "123" });

// Create custom logger
const logger = createLogger("my-service", { version: "1.0" });
logger.info("Service initialized");
logger.warn("Deprecated API used", { endpoint: "/old-api" });
```

### Log Levels

| Level | Use Case |
|-------|----------|
| `debug` | Detailed debugging info (disabled in production by default) |
| `info` | Normal operational messages |
| `warn` | Warning conditions that should be reviewed |
| `error` | Error conditions requiring attention |

### Log Format

All logs are JSON-formatted:

```json
{
  "timestamp": "2024-01-15T10:30:00.000Z",
  "level": "info",
  "message": "Request completed",
  "service": "optiq-api",
  "context": {
    "method": "GET",
    "path": "/api/campaigns",
    "statusCode": 200,
    "durationMs": 45
  }
}
```

### Child Loggers

Create loggers with additional context:

```typescript
const logger = apiLogger.child({ requestId: "abc-123" });
logger.info("Processing request"); // Includes requestId in all logs
```

## Error Tracking (Sentry)

### Initialization

Sentry is automatically initialized when `SENTRY_DSN` is set:

```typescript
import { initSentry, isSentryEnabled } from "@/lib/observability";

// Check if enabled
if (isSentryEnabled()) {
  await initSentry();
}
```

### Capturing Errors

```typescript
import { captureException, captureMessage } from "@/lib/observability";

// Capture exception with context
try {
  await riskyOperation();
} catch (error) {
  captureException(error, {
    tags: { feature: "billing" },
    extra: { userId: "123", amount: 100 },
    user: { id: "123", email: "user@example.com" },
    level: "error",
  });
}

// Capture message
captureMessage("User exceeded rate limit", "warning", {
  tags: { endpoint: "/api/ingest" },
  extra: { requestCount: 1000 },
});
```

### User Context

Set user context for all subsequent errors:

```typescript
import { setUser, setTag, setContext } from "@/lib/observability";

setUser({ id: "user-123", email: "user@example.com" });
setTag("plan", "growth");
setContext("organization", { id: "org-456", name: "Acme Inc" });
```

## Performance Timing

### Timing Async Operations

```typescript
import { timeAsync, timeQuery, timeExternalCall } from "@/lib/observability";

// Time any async operation
const { result, durationMs } = await timeAsync(
  "fetchCampaigns",
  () => prisma.campaign.findMany(),
  { organizationId: "org-123" }
);

// Time database queries (warns on slow queries >1s)
const campaigns = await timeQuery("campaign.findMany", () =>
  prisma.campaign.findMany({ where: { status: "ACTIVE" } })
);

// Time external API calls
const data = await timeExternalCall("stripe", "createCustomer", () =>
  stripe.customers.create({ email })
);
```

### Manual Timers

```typescript
import { createTimer } from "@/lib/observability";

const timer = createTimer("complexOperation", { userId: "123" });
timer.start();

// ... do work ...
timer.checkpoint("step1-complete");

// ... more work ...
timer.checkpoint("step2-complete");

const totalMs = timer.end("ok"); // or "error"
```

### Job Timing

```typescript
import { timeJob } from "@/lib/observability";

const { result, durationMs, success } = await timeJob(
  "daily-sync",
  async () => {
    // Job logic
    return { processed: 100 };
  },
  { source: "meta-ads" }
);
```

### Route Timing

```typescript
import { createRouteTimer } from "@/lib/observability";

export async function GET(req: Request) {
  const timer = createRouteTimer("GET", "/api/campaigns");
  
  try {
    const data = await fetchData();
    timer.finish(200);
    return Response.json(data);
  } catch (error) {
    timer.finish(500);
    throw error;
  }
}
```

## Observability Middleware

### Automatic Route Instrumentation

```typescript
import { withObservability } from "@/lib/observability";

export const GET = withObservability(async (req, obsContext) => {
  // obsContext.traceId is available for correlation
  console.log("Trace ID:", obsContext.traceId);
  
  return NextResponse.json({ data: "..." });
});
```

### Combined Auth + Observability

```typescript
import { withObservableAuth } from "@/lib/observability";

export const GET = withObservableAuth(async (req, authContext, obsContext) => {
  // authContext has userId, organizationId, role
  // obsContext has traceId, automatically sets user in Sentry
  
  return NextResponse.json({ data: "..." });
});
```

### Error Boundary

```typescript
import { withErrorBoundary } from "@/lib/observability";

const riskyFunction = withErrorBoundary(
  async (input: string) => {
    // Function that might throw
  },
  { operation: "processInput", metadata: { source: "api" } }
);
```

## Health Checks

### Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/health` | Full health status |
| `GET /api/health?type=live` | Liveness probe (k8s) |
| `GET /api/health?type=ready` | Readiness probe (k8s) |

### Response Format

```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "version": "1.0.0",
  "uptime": 3600,
  "checks": {
    "database": {
      "status": "healthy",
      "latencyMs": 5
    },
    "memory": {
      "status": "healthy",
      "details": {
        "heapUsedMB": 150,
        "heapTotalMB": 512,
        "heapPercent": 29
      }
    }
  }
}
```

### Status Codes

| Status | HTTP Code | Meaning |
|--------|-----------|---------|
| `healthy` | 200 | All systems operational |
| `degraded` | 200 | Some issues but functional |
| `unhealthy` | 503 | Critical issues |

### Kubernetes Configuration

```yaml
livenessProbe:
  httpGet:
    path: /api/health?type=live
    port: 3000
  initialDelaySeconds: 10
  periodSeconds: 10

readinessProbe:
  httpGet:
    path: /api/health?type=ready
    port: 3000
  initialDelaySeconds: 5
  periodSeconds: 5
```

## Best Practices

### 1. Always Include Context

```typescript
// Bad
logger.error("Failed");

// Good
logger.error("Payment processing failed", error, {
  userId: "123",
  amount: 100,
  currency: "USD",
});
```

### 2. Use Appropriate Log Levels

```typescript
// Debug: Detailed info for debugging
logger.debug("Cache miss", { key: "user:123" });

// Info: Normal operations
logger.info("User signed in", { userId: "123" });

// Warn: Unusual but handled
logger.warn("Rate limit approaching", { current: 90, limit: 100 });

// Error: Requires attention
logger.error("Database connection failed", error);
```

### 3. Correlate with Trace IDs

```typescript
const traceId = req.headers.get("x-trace-id") ?? generateTraceId();
const logger = apiLogger.withTraceId(traceId);

// All logs from this request will have the same traceId
logger.info("Request started");
logger.info("Request completed");
```

### 4. Time Critical Operations

```typescript
// Time database queries
const users = await timeQuery("user.findMany", () => 
  prisma.user.findMany()
);

// Time external calls
const result = await timeExternalCall("stripe", "charge", () =>
  stripe.charges.create(params)
);
```

### 5. Set User Context Early

```typescript
// In auth middleware
setUser({ id: user.id, email: user.email });
setContext("organization", { id: org.id, plan: org.plan });
```

## Troubleshooting

### Logs Not Appearing

1. Check `LOG_LEVEL` environment variable
2. Ensure logger is imported correctly
3. Verify console output is not filtered

### Sentry Not Receiving Events

1. Verify `SENTRY_DSN` is set correctly
2. Check `SENTRY_ENABLED` is not false
3. In development, set `SENTRY_DEBUG=true`
4. Check Sentry dashboard for rate limiting

### High Memory Usage in Health Check

1. Review `heapPercent` in health response
2. Check for memory leaks in long-running processes
3. Consider increasing container memory limits

## Files Reference

| File | Purpose |
|------|---------|
| `src/lib/observability/logger.ts` | Structured logging |
| `src/lib/observability/sentry.ts` | Error tracking |
| `src/lib/observability/timing.ts` | Performance timing |
| `src/lib/observability/middleware.ts` | Route instrumentation |
| `src/lib/observability/health.ts` | Health checks |
| `src/lib/observability/index.ts` | Module exports |
| `src/app/api/health/route.ts` | Health endpoint |
