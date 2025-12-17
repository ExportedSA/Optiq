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
});

const base = loadEnv(
  EnvSchema,
  {
    APP_ENV: process.env.APP_ENV,
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    DATABASE_URL: process.env.DATABASE_URL,
    CORS_ORIGIN: process.env.CORS_ORIGIN,
    LOG_LEVEL: process.env.LOG_LEVEL,
  },
  {
    redactKeys: ["DATABASE_URL"],
  },
);

export const env = {
  ...base,
  ...buildEnvMeta(base.APP_ENV),
} as const;
