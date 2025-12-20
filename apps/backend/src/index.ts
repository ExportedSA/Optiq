import Fastify from "fastify";

import type { HealthResponse } from "@optiq/shared";
import { env } from "./env";
import { pool } from "./db/pool";
import { registerTrackRoutes } from "./api/routes/track";
import { registerEventRoutes } from "./api/routes/events";
import { registerConversionRoutes } from "./api/routes/conversions";
import { registerLoggingMiddleware } from "./middleware/logging";
import { registerRateLimitMiddleware } from "./middleware/rate-limit";
import { startScheduler } from "./jobs/scheduler";

const app = Fastify({
  logger: false, // We'll use our custom logger
  requestIdHeader: "x-request-id",
  requestIdLogLabel: "requestId",
  genReqId: () => "", // We generate IDs in middleware
});

// Register logging middleware first
await registerLoggingMiddleware(app);

// Register rate limiting middleware
await registerRateLimitMiddleware(app);

// Health check endpoint
app.get("/health", async (request) => {
  request.log.debug("Health check requested");

  await pool.query("select 1");
  const body: HealthResponse = { ok: true };
  return body;
});

// Register application routes
await registerTrackRoutes(app);
await registerEventRoutes(app);
await registerConversionRoutes(app);

// Start server
await app.listen({
  port: env.PORT,
  host: "0.0.0.0",
});

startScheduler();

app.log.info(`Server listening on port ${env.PORT}`);
app.log.info(`Environment: ${env.APP_ENV}`);
app.log.info(`Log level: ${env.LOG_LEVEL}`);
