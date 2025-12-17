import { z } from "zod";

import { AppEnvSchema, buildEnvMeta, loadEnv } from "@optiq/shared";

const EnvSchema = z.object({
  // Application
  APP_ENV: AppEnvSchema.default("development"),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  
  // Database
  DATABASE_URL: z.string().url().describe("PostgreSQL connection string"),
  
  // NextAuth
  NEXTAUTH_SECRET: z.string().min(32).describe("Secret for NextAuth session encryption (min 32 chars)"),
  NEXTAUTH_URL: z.string().url().optional().describe("Canonical URL of your site"),

  // Data Encryption
  DATA_ENCRYPTION_KEY: z.string().min(32).describe("AES-256 key for encrypting sensitive data (32+ chars)"),

  // Google OAuth & Ads
  GOOGLE_OAUTH_CLIENT_ID: z.string().min(1).describe("Google OAuth 2.0 Client ID"),
  GOOGLE_OAUTH_CLIENT_SECRET: z.string().min(1).describe("Google OAuth 2.0 Client Secret"),
  GOOGLE_OAUTH_REDIRECT_URI: z.string().url().describe("OAuth redirect URI for Google"),
  GOOGLE_ADS_DEVELOPER_TOKEN: z.string().min(1).describe("Google Ads API Developer Token"),
  GOOGLE_ADS_LOGIN_CUSTOMER_ID: z.string().min(1).optional().describe("Google Ads Manager Account ID (optional)"),

  // Meta (Facebook) Ads
  META_APP_ID: z.string().min(1).describe("Meta App ID"),
  META_APP_SECRET: z.string().min(1).describe("Meta App Secret"),
  META_OAUTH_REDIRECT_URI: z.string().url().describe("OAuth redirect URI for Meta"),
  META_API_VERSION: z.string().min(1).default("v20.0").describe("Meta Graph API version"),

  // TikTok Ads
  TIKTOK_APP_ID: z.string().min(1).describe("TikTok App ID"),
  TIKTOK_APP_SECRET: z.string().min(1).describe("TikTok App Secret"),
  TIKTOK_OAUTH_REDIRECT_URI: z.string().url().describe("OAuth redirect URI for TikTok"),
  TIKTOK_API_BASE_URL: z.string().url().default("https://business-api.tiktok.com").describe("TikTok Business API base URL"),
  
  // Email Notifications (Optional)
  SMTP_HOST: z.string().optional().describe("SMTP server hostname"),
  SMTP_PORT: z.coerce.number().int().min(1).max(65535).optional().describe("SMTP server port"),
  SMTP_USER: z.string().optional().describe("SMTP username"),
  SMTP_PASSWORD: z.string().optional().describe("SMTP password"),
  SMTP_FROM_EMAIL: z.string().email().optional().describe("From email address for notifications"),
  SMTP_FROM_NAME: z.string().optional().describe("From name for notifications"),
});

const base = loadEnv(
  EnvSchema,
  {
    APP_ENV: process.env.APP_ENV,
    NODE_ENV: process.env.NODE_ENV,
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
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASSWORD: process.env.SMTP_PASSWORD,
    SMTP_FROM_EMAIL: process.env.SMTP_FROM_EMAIL,
    SMTP_FROM_NAME: process.env.SMTP_FROM_NAME,
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
      "SMTP_PASSWORD",
    ],
  },
);

export const env = {
  ...base,
  ...buildEnvMeta(base.APP_ENV),
} as const;
