# Environment Configuration Guide

## Quick Start

1. **Copy the example file:**
   ```bash
   cp .env.example .env
   ```

2. **Generate secrets:**
   ```bash
   # Generate NEXTAUTH_SECRET
   openssl rand -base64 32
   
   # Generate DATA_ENCRYPTION_KEY
   openssl rand -base64 32
   ```

3. **Fill in required values** in `.env` (see below)

4. **Start the application:**
   ```bash
   npm run dev
   ```

## Required Environment Variables

### Critical (App won't start without these)

| Variable | Description | How to Get |
|----------|-------------|------------|
| `DATABASE_URL` | PostgreSQL connection string | Set up PostgreSQL locally or use a service like Supabase/Railway |
| `NEXTAUTH_SECRET` | Session encryption key (32+ chars) | `openssl rand -base64 32` |
| `DATA_ENCRYPTION_KEY` | Data encryption key (32+ chars) | `openssl rand -base64 32` |
| `GOOGLE_OAUTH_CLIENT_ID` | Google OAuth Client ID | [Google Cloud Console](https://console.cloud.google.com/apis/credentials) |
| `GOOGLE_OAUTH_CLIENT_SECRET` | Google OAuth Client Secret | Same as above |
| `GOOGLE_OAUTH_REDIRECT_URI` | OAuth callback URL | `http://localhost:3000/api/integrations/google-ads/oauth/callback` |
| `GOOGLE_ADS_DEVELOPER_TOKEN` | Google Ads API token | [Google Ads API Center](https://developers.google.com/google-ads/api/docs/get-started/dev-token) |
| `META_APP_ID` | Meta/Facebook App ID | [Meta Developers](https://developers.facebook.com/apps/) |
| `META_APP_SECRET` | Meta/Facebook App Secret | Same as above |
| `META_OAUTH_REDIRECT_URI` | OAuth callback URL | `http://localhost:3000/api/integrations/meta-ads/oauth/callback` |
| `TIKTOK_APP_ID` | TikTok App ID | [TikTok Marketing API](https://ads.tiktok.com/marketing_api/apps/) |
| `TIKTOK_APP_SECRET` | TikTok App Secret | Same as above |
| `TIKTOK_OAUTH_REDIRECT_URI` | OAuth callback URL | `http://localhost:3000/api/integrations/tiktok-ads/oauth/callback` |

### Optional

| Variable | Description | Default |
|----------|-------------|---------|
| `APP_ENV` | Environment mode | `development` |
| `NODE_ENV` | Node environment | `development` |
| `PORT` | Backend API port | `3001` |
| `CORS_ORIGIN` | Allowed CORS origin | Not set in dev |
| `LOG_LEVEL` | Logging verbosity | `info` |
| `SMTP_*` | Email notification settings | Email disabled if not set |

## Environment Validation

The application uses **Zod** for strict environment validation. If any required variable is missing or invalid, the app will:

1. **Fail fast** - Won't start at all
2. **Show clear errors** - Tells you exactly what's wrong
3. **Protect secrets** - Redacts sensitive values in error messages

### Example Error Output

```
╔════════════════════════════════════════════════════════════════════════════╗
║ ENVIRONMENT CONFIGURATION ERROR                                            ║
╚════════════════════════════════════════════════════════════════════════════╝

Your application failed to start due to invalid or missing environment variables.

ERRORS:
  • DATABASE_URL: Required
  • NEXTAUTH_SECRET: String must contain at least 32 character(s)
  • GOOGLE_OAUTH_CLIENT_ID: Required

TROUBLESHOOTING:
  1. Copy .env.example to .env if you haven't already
  2. Fill in all required values in your .env file
  3. Ensure all values match the expected format (URLs, numbers, etc.)
  4. Check that sensitive values meet minimum length requirements

For more details, see .env.example in the project root.
```

## Setting Up Integrations

### Google Ads

1. Create a project in [Google Cloud Console](https://console.cloud.google.com/)
2. Enable Google Ads API
3. Create OAuth 2.0 credentials
4. Apply for a [Developer Token](https://developers.google.com/google-ads/api/docs/get-started/dev-token)
5. Add redirect URI: `http://localhost:3000/api/integrations/google-ads/oauth/callback`

### Meta (Facebook) Ads

1. Create an app at [Meta Developers](https://developers.facebook.com/apps/)
2. Add "Marketing API" product
3. Configure OAuth redirect URI: `http://localhost:3000/api/integrations/meta-ads/oauth/callback`
4. Get App ID and App Secret from Settings > Basic

### TikTok Ads

1. Register at [TikTok Marketing API](https://ads.tiktok.com/marketing_api/apps/)
2. Create a new app
3. Configure redirect URI: `http://localhost:3000/api/integrations/tiktok-ads/oauth/callback`
4. Get App ID and App Secret from app settings

## Production Deployment

### Security Checklist

- [ ] Generate new secrets (don't reuse dev secrets!)
- [ ] Set `APP_ENV=production` and `NODE_ENV=production`
- [ ] Update all URLs to production domains
- [ ] Use environment-specific database
- [ ] Configure `CORS_ORIGIN` to your frontend URL
- [ ] Set `LOG_LEVEL=info` or `warn`
- [ ] Enable SMTP for email notifications
- [ ] Update all OAuth redirect URIs to production URLs
- [ ] Never commit `.env` to version control
- [ ] Use secrets management (AWS Secrets Manager, Vault, etc.)

### Environment-Specific Values

```bash
# Development
APP_ENV=development
NEXTAUTH_URL=http://localhost:3000
DATABASE_URL=postgresql://localhost:5432/optiq_dev

# Staging
APP_ENV=staging
NEXTAUTH_URL=https://staging.optiq.com
DATABASE_URL=postgresql://staging-db:5432/optiq_staging

# Production
APP_ENV=production
NEXTAUTH_URL=https://app.optiq.com
DATABASE_URL=postgresql://prod-db:5432/optiq_prod
CORS_ORIGIN=https://app.optiq.com
LOG_LEVEL=warn
```

## Troubleshooting

### "Invalid environment configuration" error
- Check that all required variables are set in `.env`
- Verify URLs are properly formatted (include `http://` or `https://`)
- Ensure secrets meet minimum length requirements (32+ characters)

### "Database connection failed"
- Verify PostgreSQL is running
- Check `DATABASE_URL` format: `postgresql://user:pass@host:port/db`
- Test connection: `psql $DATABASE_URL`

### OAuth redirect errors
- Ensure redirect URIs match exactly in provider settings
- Include protocol (`http://` or `https://`)
- No trailing slashes

### Port already in use
- Change `PORT` in `.env`
- Or kill the process: `lsof -ti:3001 | xargs kill -9` (macOS/Linux)

## Additional Resources

- [Zod Documentation](https://zod.dev/)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Google Ads API](https://developers.google.com/google-ads/api)
- [Meta Marketing API](https://developers.facebook.com/docs/marketing-apis)
- [TikTok Marketing API](https://ads.tiktok.com/marketing_api/docs)
