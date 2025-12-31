# Neon Database Setup Guide

**Quick & Easy PostgreSQL Setup - No Docker Required!**

Neon is a serverless PostgreSQL provider that's perfect for development and production. Setup takes 2 minutes.

---

## 🚀 **Quick Setup (2 Minutes)**

### Step 1: Create Neon Account

1. Go to https://neon.tech
2. Click **"Sign Up"** (free tier available)
3. Sign up with GitHub, Google, or email
4. Verify your email if required

### Step 2: Create Database Project

1. After login, click **"Create a project"**
2. Project settings:
   - **Name:** `optiq` (or any name you prefer)
   - **Region:** Choose closest to you
   - **PostgreSQL version:** 15 (default)
3. Click **"Create project"**

### Step 3: Get Connection String

After project creation, you'll see your connection details:

1. Click on **"Connection string"** tab
2. Select **"Pooled connection"** (recommended for serverless)
3. Copy the connection string - it looks like:

```
postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require
```

### Step 4: Update .env File

1. Open your `.env` file
2. Replace the `DATABASE_URL` with your Neon connection string:

```env
DATABASE_URL="postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require"
```

**That's it! No Docker needed.**

---

## ✅ **Complete .env Setup**

Here's your complete `.env` file with Neon:

```env
# ============================================
# DATABASE (NEON)
# ============================================
DATABASE_URL="postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require"

# ============================================
# AUTHENTICATION
# ============================================
NEXTAUTH_URL="http://localhost:3004"
NEXTAUTH_SECRET="your_32_char_secret_here"

# ============================================
# DATA ENCRYPTION
# ============================================
DATA_ENCRYPTION_KEY="your_32_char_encryption_key_here"

# ============================================
# STRIPE (OPTIONAL - for billing features)
# ============================================
STRIPE_SECRET_KEY=sk_test_your_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_secret_here

# Stripe Price IDs
STRIPE_PRICE_STARTER_MONTHLY=price_xxx
STRIPE_PRICE_STARTER_ANNUAL=price_xxx
STRIPE_PRICE_GROWTH_MONTHLY=price_xxx
STRIPE_PRICE_GROWTH_ANNUAL=price_xxx
STRIPE_PRICE_SCALE_MONTHLY=price_xxx
STRIPE_PRICE_SCALE_ANNUAL=price_xxx

# ============================================
# AD PLATFORM APIS (OPTIONAL)
# ============================================
GOOGLE_ADS_CLIENT_ID=your_client_id
GOOGLE_ADS_CLIENT_SECRET=your_secret
GOOGLE_ADS_DEVELOPER_TOKEN=your_token
GOOGLE_ADS_REDIRECT_URI=http://localhost:3004/api/auth/callback/google

META_APP_ID=your_app_id
META_APP_SECRET=your_secret
META_REDIRECT_URI=http://localhost:3004/api/auth/callback/meta

TIKTOK_APP_ID=your_app_id
TIKTOK_APP_SECRET=your_secret
TIKTOK_OAUTH_REDIRECT_URI=http://localhost:3004/api/auth/callback/tiktok
```

---

## 🎯 **Start Your App**

Now you can start Optiq without Docker:

```bash
# Generate secrets if you haven't already
# PowerShell:
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})

# Start the app
npm run dev
```

**Access at:** http://localhost:3004

---

## 💡 **Neon Benefits**

### vs Docker:
- ✅ **No Docker installation** - Works immediately
- ✅ **No local resources** - Runs in the cloud
- ✅ **Auto-scaling** - Scales to zero when not in use
- ✅ **Instant backups** - Built-in point-in-time recovery
- ✅ **Free tier** - 0.5 GB storage, 3 GB data transfer

### Free Tier Limits:
- **Storage:** 0.5 GB
- **Compute:** 191.9 hours/month
- **Data transfer:** 3 GB/month
- **Branches:** 10

**Perfect for development and small projects!**

---

## 🔧 **Database Management**

### View Database in Neon Console

1. Go to https://console.neon.tech
2. Select your project
3. Click **"Tables"** to view data
4. Click **"SQL Editor"** to run queries

### Run Migrations

```bash
# Run Prisma migrations
npm run prisma:migrate

# Or manually:
cd apps/backend
npx prisma migrate dev
```

### Reset Database

```bash
cd apps/backend
npx prisma migrate reset
```

---

## 📊 **Connection Pooling**

Neon provides two connection types:

### 1. Pooled Connection (Recommended)
- For serverless/edge functions
- Connection string includes pooler endpoint
- Use this for Optiq

```
postgresql://user:pass@ep-xxx.pooler.region.aws.neon.tech/db?sslmode=require
```

### 2. Direct Connection
- For long-running processes
- Direct database connection
- Use for migrations

```
postgresql://user:pass@ep-xxx.region.aws.neon.tech/db?sslmode=require
```

**Optiq uses pooled connections by default.**

---

## 🌿 **Branching (Optional)**

Neon supports database branches for testing:

1. In Neon Console, click **"Branches"**
2. Click **"Create branch"**
3. Name it (e.g., `development`, `staging`)
4. Get the branch connection string
5. Use it in your `.env` for that environment

**Each branch is an isolated copy of your database.**

---

## 🔒 **Security Best Practices**

### 1. Never Commit Connection Strings
```bash
# Verify .env is in .gitignore
cat .gitignore | grep .env
```

### 2. Use Environment-Specific Databases
- **Development:** Neon free tier
- **Staging:** Neon paid tier or separate project
- **Production:** Neon Pro with backups

### 3. Rotate Passwords Regularly
1. Go to Neon Console → Settings → Reset password
2. Update `.env` with new connection string
3. Restart your app

### 4. Enable IP Allowlist (Production)
1. Neon Console → Settings → IP Allow
2. Add your server IPs
3. Blocks unauthorized access

---

## 🐛 **Troubleshooting**

### "Connection Refused" Error
- ✅ Check connection string is correct
- ✅ Ensure `?sslmode=require` is at the end
- ✅ Verify Neon project is active (not suspended)
- ✅ Check internet connection

### "Too Many Connections" Error
- ✅ Use pooled connection string
- ✅ Close unused database connections
- ✅ Upgrade Neon plan if needed

### "Database Does Not Exist" Error
- ✅ Run migrations: `npm run prisma:migrate`
- ✅ Check database name in connection string
- ✅ Verify project is created in Neon Console

### Slow Queries
- ✅ Neon auto-scales, but cold starts take ~1s
- ✅ Upgrade to paid tier for always-on compute
- ✅ Use connection pooling (already enabled)

---

## 📈 **Monitoring**

### View Metrics in Neon Console

1. Go to https://console.neon.tech
2. Select your project
3. Click **"Monitoring"**

**Available metrics:**
- Connection count
- Query performance
- Storage usage
- Compute hours
- Data transfer

---

## 💰 **Pricing**

### Free Tier (Perfect for Development)
- **Cost:** $0/month
- **Storage:** 0.5 GB
- **Compute:** 191.9 hours/month
- **Branches:** 10

### Launch Plan (Production)
- **Cost:** $19/month
- **Storage:** 10 GB included
- **Compute:** Always-on
- **Branches:** Unlimited
- **Point-in-time recovery:** 7 days

### Scale Plan (Enterprise)
- **Cost:** $69/month
- **Storage:** 50 GB included
- **Compute:** Auto-scaling
- **Support:** Priority
- **Recovery:** 30 days

**Start with free tier, upgrade when needed.**

---

## 🔄 **Migration from Docker**

If you were using Docker PostgreSQL:

### 1. Export Data from Docker

```bash
# If Docker is running
docker exec -t optiq-postgres pg_dump -U optiq optiq > backup.sql
```

### 2. Import to Neon

```bash
# Get Neon connection details
# In Neon Console, copy direct connection string

# Import data
psql "postgresql://user:pass@ep-xxx.region.aws.neon.tech/db?sslmode=require" < backup.sql
```

### 3. Update .env

Replace Docker connection string with Neon connection string.

### 4. Remove Docker

```bash
# Stop Docker containers
docker compose down

# Optional: Remove Docker Desktop if not needed
```

---

## 🎓 **Additional Resources**

- **Neon Documentation:** https://neon.tech/docs
- **Neon Console:** https://console.neon.tech
- **Prisma + Neon Guide:** https://neon.tech/docs/guides/prisma
- **Connection Pooling:** https://neon.tech/docs/connect/connection-pooling
- **Branching Guide:** https://neon.tech/docs/introduction/branching

---

## ✅ **Quick Start Checklist**

- [ ] Create Neon account at https://neon.tech
- [ ] Create new project named "optiq"
- [ ] Copy pooled connection string
- [ ] Update `DATABASE_URL` in `.env`
- [ ] Generate `NEXTAUTH_SECRET` and `DATA_ENCRYPTION_KEY`
- [ ] Run `npm run dev`
- [ ] Access app at http://localhost:3004

**Total time: ~2 minutes** ⚡

---

## 🎉 **You're Ready!**

Neon is now configured. Your database runs in the cloud with:
- ✅ Zero maintenance
- ✅ Automatic backups
- ✅ Instant scaling
- ✅ No Docker required

**Start building with:** `npm run dev`

---

**Last Updated:** December 31, 2024  
**Questions?** Check Neon docs at https://neon.tech/docs
