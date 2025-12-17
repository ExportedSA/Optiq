import Fastify from "fastify";

import type { HealthResponse } from "@optiq/shared";
import { env } from "./env";
import { registerTrackRoutes } from "./api/routes/track";

const app = Fastify({
  logger: true,
});

app.get("/health", async () => {
  const body: HealthResponse = { ok: true };
  return body;
});

await registerTrackRoutes(app);

await app.listen({
  port: env.PORT,
  host: "0.0.0.0",
});
