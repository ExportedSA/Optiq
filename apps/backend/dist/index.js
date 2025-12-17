import Fastify from "fastify";
import { env } from "./env";
import { registerTrackRoutes } from "./api/routes/track";
const app = Fastify({
    logger: true,
});
app.get("/health", async () => {
    const body = { ok: true };
    return body;
});
await registerTrackRoutes(app);
await app.listen({
    port: env.PORT,
    host: "0.0.0.0",
});
//# sourceMappingURL=index.js.map