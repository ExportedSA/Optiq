import { z } from "zod";

import { AppEnvSchema, buildEnvMeta, loadEnv } from "@optiq/shared";

const EnvSchema = z.object({
  APP_ENV: AppEnvSchema.default("development"),
  DATABASE_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(32),
  NEXTAUTH_URL: z.string().url().optional(),

  DATA_ENCRYPTION_KEY: z.string().min(1),

  GOOGLE_OAUTH_CLIENT_ID: z.string().min(1),
  GOOGLE_OAUTH_CLIENT_SECRET: z.string().min(1),
  GOOGLE_OAUTH_REDIRECT_URI: z.string().url(),

  GOOGLE_ADS_DEVELOPER_TOKEN: z.string().min(1),
  GOOGLE_ADS_LOGIN_CUSTOMER_ID: z.string().min(1).optional(),

  META_APP_ID: z.string().min(1),
  META_APP_SECRET: z.string().min(1),
  META_OAUTH_REDIRECT_URI: z.string().url(),
  META_API_VERSION: z.string().min(1).default("v20.0"),

  TIKTOK_APP_ID: z.string().min(1),
  TIKTOK_APP_SECRET: z.string().min(1),
  TIKTOK_OAUTH_REDIRECT_URI: z.string().url(),
  TIKTOK_API_BASE_URL: z.string().url().default("https://business-api.tiktok.com"),
});

const base = loadEnv(
  EnvSchema,
  {
    APP_ENV: process.env.APP_ENV,
    DATABASE_URL: process.env.DATABASE_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,

    DATA_ENCRYPTION_KEY: process.env.DATA_ENCRYPTION_KEY,

    GOOGLE_OAUTH_CLIENT_ID: process.env.GOOGLE_OAUTH_CLIENT_ID,
    GOOGLE_OAUTH_CLIENT_SECRET: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    GOOGLE_OAUTH_REDIRECT_URI: process.env.GOOGLE_OAUTH_REDIRECT_URI,

    GOOGLE_ADS_DEVELOPER_TOKEN: process.env.GOOGLE_ADS_DEVELOPER_TOKEN,
    GOOGLE_ADS_LOGIN_CUSTOMER_ID: process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID,

    META_APP_ID: process.env.META_APP_ID,
    META_APP_SECRET: process.env.META_APP_SECRET,
    META_OAUTH_REDIRECT_URI: process.env.META_OAUTH_REDIRECT_URI,
    META_API_VERSION: process.env.META_API_VERSION,

    TIKTOK_APP_ID: process.env.TIKTOK_APP_ID,
    TIKTOK_APP_SECRET: process.env.TIKTOK_APP_SECRET,
    TIKTOK_OAUTH_REDIRECT_URI: process.env.TIKTOK_OAUTH_REDIRECT_URI,
    TIKTOK_API_BASE_URL: process.env.TIKTOK_API_BASE_URL,
  },
  {
    redactKeys: [
      "DATABASE_URL",
      "NEXTAUTH_SECRET",
      "DATA_ENCRYPTION_KEY",
      "GOOGLE_OAUTH_CLIENT_SECRET",
      "GOOGLE_ADS_DEVELOPER_TOKEN",
      "META_APP_SECRET",
      "TIKTOK_APP_SECRET",
    ],
  },
);

export const env = {
  ...base,
  ...buildEnvMeta(base.APP_ENV),
} as const;
