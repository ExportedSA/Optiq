import Fastify from "fastify";

import type { HealthResponse } from "@optiq/shared";
import { env } from "./env";
import { registerTrackRoutes } from "./api/routes/track";
import { registerLoggingMiddleware } from "./middleware/logging";

const app = Fastify({
  logger: false, // We'll use our custom logger
  requestIdHeader: "x-request-id",
  requestIdLogLabel: "requestId",
  genReqId: () => "", // We generate IDs in middleware
});

// Register logging middleware first
await registerLoggingMiddleware(app);

// Health check endpoint
app.get("/health", async (request) => {
  request.log.debug("Health check requested");
  const body: HealthResponse = { ok: true };
  return body;
});

// Register application routes
await registerTrackRoutes(app);

// Start server
await app.listen({
  port: env.PORT,
  host: "0.0.0.0",
});

app.log.info(`Server listening on port ${env.PORT}`);
app.log.info(`Environment: ${env.APP_ENV}`);
app.log.info(`Log level: ${env.LOG_LEVEL}`);
