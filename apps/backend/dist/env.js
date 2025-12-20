import "dotenv/config";
import { z } from "zod";
import { AppEnvSchema, buildEnvMeta, loadEnv } from "@optiq/shared";
const EnvSchema = z.object({
    // Application
    APP_ENV: AppEnvSchema.default("development"),
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    PORT: z.coerce.number().int().min(1).max(65535).default(3001),
    // Database
    DATABASE_URL: z.string().url().describe("PostgreSQL connection string"),
    // CORS & Security
    CORS_ORIGIN: z.string().url().optional().describe("Allowed CORS origin (frontend URL)"),
    // Logging
    LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace"]).default("info"),
    DATA_ENCRYPTION_KEY: z.string().min(1),
    META_APP_ID: z.string().min(1),
    META_APP_SECRET: z.string().min(1),
    META_REDIRECT_URI: z.string().url(),
    TIKTOK_APP_ID: z.string().min(1),
    TIKTOK_APP_SECRET: z.string().min(1),
    TIKTOK_OAUTH_REDIRECT_URI: z.string().url(),
    TIKTOK_API_BASE_URL: z.string().url().default("https://business-api.tiktok.com"),
});
const base = loadEnv(EnvSchema, {
    APP_ENV: process.env.APP_ENV,
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    DATABASE_URL: process.env.DATABASE_URL,
    CORS_ORIGIN: process.env.CORS_ORIGIN,
    LOG_LEVEL: process.env.LOG_LEVEL,
    DATA_ENCRYPTION_KEY: process.env.DATA_ENCRYPTION_KEY,
    META_APP_ID: process.env.META_APP_ID,
    META_APP_SECRET: process.env.META_APP_SECRET,
    META_REDIRECT_URI: process.env.META_REDIRECT_URI,
    TIKTOK_APP_ID: process.env.TIKTOK_APP_ID,
    TIKTOK_APP_SECRET: process.env.TIKTOK_APP_SECRET,
    TIKTOK_OAUTH_REDIRECT_URI: process.env.TIKTOK_OAUTH_REDIRECT_URI,
    TIKTOK_API_BASE_URL: process.env.TIKTOK_API_BASE_URL,
}, {
    redactKeys: ["DATABASE_URL", "DATA_ENCRYPTION_KEY", "META_APP_SECRET", "TIKTOK_APP_SECRET"],
});
export const env = {
    ...base,
    ...buildEnvMeta(base.APP_ENV),
};
//# sourceMappingURL=env.js.map