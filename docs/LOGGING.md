# Logging & Error Handling Guide

## Overview

Optiq uses **Pino** for structured logging with automatic request correlation IDs. Every API request is tracked with a unique trace ID, and all errors include full stack traces in development.

## Features

- ✅ **Structured JSON logging** - Machine-readable logs
- ✅ **Correlation IDs** - Track requests across services
- ✅ **Automatic request/response logging** - Start, end, and error events
- ✅ **Error stack traces** - Full context for debugging
- ✅ **Sensitive data redaction** - Passwords, tokens, etc. automatically removed
- ✅ **Pretty printing in development** - Human-readable colored output
- ✅ **Performance metrics** - Response time tracking

---

## Quick Start

### Using the Logger in Backend

```typescript
import { createLogger } from "@optiq/shared";

const logger = createLogger({ name: "my-service" });

logger.info("Application started");
logger.debug({ userId: 123 }, "User logged in");
logger.error({ err: error }, "Failed to process request");
```

### In Route Handlers

Every request has a logger with correlation ID attached:

```typescript
app.get("/api/users/:id", async (request, reply) => {
  // Logger automatically includes requestId
  request.log.info({ userId: request.params.id }, "Fetching user");
  
  try {
    const user = await getUser(request.params.id);
    request.log.debug({ user }, "User found");
    return user;
  } catch (error) {
    // Error automatically logged with stack trace
    request.log.error({ err: error }, "Failed to fetch user");
    throw error;
  }
});
```

---

## Log Levels

| Level | Usage | Example |
|-------|-------|---------|
| `fatal` | Application crash | Database connection lost |
| `error` | Error that needs attention | API call failed, validation error |
| `warn` | Warning that might need attention | Deprecated API used, rate limit approaching |
| `info` | General information | Request completed, user logged in |
| `debug` | Detailed debugging info | Query parameters, intermediate values |
| `trace` | Very detailed debugging | Function entry/exit, loop iterations |

### Setting Log Level

```bash
# Environment variable
LOG_LEVEL=debug npm run dev

# Or in .env
LOG_LEVEL=debug
```

---

## Correlation IDs

Every request gets a unique correlation ID (UUID) that's:
- Generated automatically if not provided
- Accepted from `x-request-id` or `x-correlation-id` headers
- Returned in response headers as `x-request-id`
- Included in all log entries for that request

### Example Log Output

```json
{
  "level": 30,
  "time": 1703001234567,
  "requestId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "method": "GET",
  "url": "/api/users/123",
  "msg": "Incoming request"
}
```

### Tracing Requests Across Services

```bash
# Client sends request with correlation ID
curl -H "x-request-id: my-trace-id" http://localhost:3001/api/users/123

# All logs for this request will include: "requestId": "my-trace-id"
```

---

## Automatic Request Logging

Every request automatically logs:

### 1. Request Start
```json
{
  "level": 30,
  "requestId": "uuid",
  "req": {
    "method": "POST",
    "url": "/api/track",
    "headers": { ... },
    "remoteAddress": "127.0.0.1"
  },
  "msg": "Incoming request"
}
```

### 2. Request Completion
```json
{
  "level": 30,
  "requestId": "uuid",
  "res": {
    "statusCode": 200
  },
  "responseTime": "45.23ms",
  "msg": "Request completed"
}
```

### 3. Request Error
```json
{
  "level": 50,
  "requestId": "uuid",
  "err": {
    "type": "ValidationError",
    "message": "Invalid email format",
    "stack": "Error: Invalid email format\n    at ...",
    "code": "VALIDATION_ERROR",
    "statusCode": 400
  },
  "msg": "Request error"
}
```

---

## Error Handling

### Automatic Error Logging

All errors are automatically logged with:
- Error type and message
- Full stack trace
- Request context (method, URL, requestId)
- Response status code

### Error Response Format

```json
{
  "error": {
    "message": "Invalid email format",
    "requestId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "stack": "Error: Invalid email format\n..." // Only in development
  }
}
```

### Custom Error Handling

```typescript
app.get("/api/users/:id", async (request, reply) => {
  try {
    const user = await getUser(request.params.id);
    return user;
  } catch (error) {
    // Log with additional context
    request.log.error(
      {
        err: error,
        userId: request.params.id,
        operation: "getUser",
      },
      "Failed to fetch user"
    );
    
    // Throw to let error handler format response
    throw error;
  }
});
```

---

## Sensitive Data Redaction

The following fields are automatically redacted from logs:
- `req.headers.authorization`
- `req.headers.cookie`
- `res.headers['set-cookie']`
- Any field named `password`, `token`, `secret`, or `apiKey`

### Example

```typescript
// This log entry
logger.info({
  user: {
    email: "user@example.com",
    password: "secret123", // Will be redacted
  }
}, "User created");

// Becomes
{
  "user": {
    "email": "user@example.com"
  },
  "msg": "User created"
}
```

---

## Development vs Production

### Development
- **Pretty printing** - Colored, human-readable output
- **Log level** - `debug` by default
- **Stack traces** - Included in error responses

```
[12:34:56] INFO (optiq-backend/12345): Incoming request
    requestId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
    method: "GET"
    url: "/api/users/123"
```

### Production
- **JSON output** - Machine-readable for log aggregation
- **Log level** - `info` by default
- **Stack traces** - Not included in error responses (logged only)

```json
{"level":30,"time":1703001234567,"requestId":"uuid","method":"GET","url":"/api/users/123","msg":"Incoming request"}
```

---

## Advanced Usage

### Creating Child Loggers

```typescript
import { createChildLogger } from "@optiq/shared";

const logger = createLogger({ name: "my-service" });

// Create child logger with additional context
const userLogger = createChildLogger(logger, {
  userId: 123,
  tenantId: "acme-corp",
});

// All logs from userLogger include userId and tenantId
userLogger.info("Processing user action");
```

### Custom Logger Configuration

```typescript
import { createLogger } from "@optiq/shared";

const logger = createLogger({
  name: "custom-service",
  level: "trace",
  prettyPrint: true, // Force pretty printing even in production
});
```

### Logging Performance Metrics

```typescript
app.get("/api/expensive-operation", async (request, reply) => {
  const start = Date.now();
  
  try {
    const result = await expensiveOperation();
    
    const duration = Date.now() - start;
    request.log.info(
      { duration, resultSize: result.length },
      "Operation completed"
    );
    
    return result;
  } catch (error) {
    request.log.error({ err: error }, "Operation failed");
    throw error;
  }
});
```

---

## Searching Logs

### By Request ID

```bash
# Find all logs for a specific request
grep "a1b2c3d4-e5f6-7890-abcd-ef1234567890" logs/app.log

# Or with jq for JSON logs
cat logs/app.log | jq 'select(.requestId == "a1b2c3d4-e5f6-7890-abcd-ef1234567890")'
```

### By Error Type

```bash
# Find all validation errors
cat logs/app.log | jq 'select(.err.type == "ValidationError")'
```

### By Response Time

```bash
# Find slow requests (>1000ms)
cat logs/app.log | jq 'select(.responseTime and (.responseTime | tonumber > 1000))'
```

---

## Integration with Log Aggregation

### Datadog

```typescript
// Logs are already in JSON format
// Configure Datadog agent to read from stdout
```

### CloudWatch

```typescript
// Use AWS CloudWatch Logs agent
// JSON logs are automatically parsed
```

### ELK Stack

```typescript
// Logstash can parse JSON logs directly
// Use requestId as correlation field
```

---

## Best Practices

### ✅ DO

```typescript
// Include relevant context
request.log.info({ userId, action: "login" }, "User logged in");

// Log errors with full context
request.log.error({ err: error, orderId }, "Failed to process order");

// Use appropriate log levels
request.log.debug({ queryParams }, "Received query parameters");
request.log.error({ err: error }, "Database connection failed");
```

### ❌ DON'T

```typescript
// Don't log sensitive data explicitly
request.log.info({ password: user.password }, "User data"); // BAD

// Don't use console.log
console.log("User logged in"); // BAD - use request.log.info()

// Don't log in loops without rate limiting
for (const item of items) {
  request.log.info({ item }, "Processing item"); // BAD - too verbose
}
```

---

## Troubleshooting

### Logs not appearing

1. Check `LOG_LEVEL` environment variable
2. Ensure logger is initialized before use
3. Verify `NODE_ENV` is set correctly

### Pretty printing not working

```bash
# Force pretty printing
LOG_LEVEL=debug npm run dev

# Or set in code
const logger = createLogger({ prettyPrint: true });
```

### Request ID not showing

1. Ensure logging middleware is registered first
2. Check that `x-request-id` header is being set
3. Verify middleware is awaited: `await registerLoggingMiddleware(app)`

---

## Examples

See `apps/backend/src/middleware/logging.ts` for the full implementation.

### Example: API Route with Logging

```typescript
import type { FastifyInstance } from "fastify";

export async function registerUserRoutes(app: FastifyInstance) {
  app.get("/api/users/:id", async (request, reply) => {
    const { id } = request.params;
    
    request.log.info({ userId: id }, "Fetching user");
    
    try {
      const user = await db.user.findUnique({ where: { id } });
      
      if (!user) {
        request.log.warn({ userId: id }, "User not found");
        return reply.status(404).send({ error: "User not found" });
      }
      
      request.log.debug({ user }, "User retrieved");
      return user;
    } catch (error) {
      request.log.error({ err: error, userId: id }, "Failed to fetch user");
      throw error;
    }
  });
}
```
