import { z } from "zod";

import { AppEnvSchema, buildEnvMeta, loadEnv } from "@optiq/shared";

const EnvSchema = z.object({
  APP_ENV: AppEnvSchema.default("development"),
  PORT: z.coerce.number().int().min(1).max(65535).default(4000),
  DATABASE_URL: z.string().url(),
});

const base = loadEnv(EnvSchema, {
  APP_ENV: process.env.APP_ENV,
  PORT: process.env.PORT,
  DATABASE_URL: process.env.DATABASE_URL,
});

export const env = {
  ...base,
  ...buildEnvMeta(base.APP_ENV),
} as const;
