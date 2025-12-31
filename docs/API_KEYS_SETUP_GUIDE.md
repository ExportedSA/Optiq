# Complete API Keys Setup Guide for Optiq

**Last Updated:** December 31, 2024

This guide walks you through obtaining and configuring all required API keys to get Optiq running.

---

## 📋 **Quick Overview**

### Required (Core Functionality):
1. ✅ **Database** - PostgreSQL via Neon (free, no Docker) or Docker
2. ✅ **NextAuth** - Authentication secret
3. ✅ **Data Encryption** - Encryption key for sensitive data

### Required for Full Features:
4. ✅ **Stripe** - Payment processing (detailed walkthrough below)
5. ✅ **Google Ads** - Ad platform integration
6. ✅ **Meta (Facebook)** - Ad platform integration
7. ✅ **TikTok Ads** - Ad platform integration

---

## 🚀 **Getting Started (Minimum Setup)**

### Step 1: Copy Environment File

```bash
cp .env.example .env
```

### Step 2: Generate Required Secrets

**For Windows (PowerShell):**
```powershell
# Generate NextAuth Secret (32 characters)
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})

# Generate Data Encryption Key (32 characters)
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

**For Mac/Linux:**
```bash
# Generate NextAuth Secret
openssl rand -base64 32

# Generate Data Encryption Key
openssl rand -base64 32
```

### Step 3: Update .env File

```env
# Database (Docker handles this automatically)
DATABASE_URL="postgresql://optiq:optiq_password@localhost:5432/optiq"

# Authentication
NEXTAUTH_URL="http://localhost:3004"
NEXTAUTH_SECRET="your_generated_secret_here"

# Data Encryption
DATA_ENCRYPTION_KEY="your_generated_encryption_key_here"
```

**You can now start Optiq with basic functionality!**

```bash
npm run dev
```

---

## 💳 **STRIPE SETUP (Complete Walkthrough)**

### Why Stripe?
Stripe handles all subscription billing, payment processing, and invoicing for Optiq.

---

### Part 1: Create Stripe Account

#### 1.1 Sign Up
1. Go to https://stripe.com
2. Click **"Start now"** or **"Sign in"**
3. Create account with email and password
4. Verify your email address

#### 1.2 Activate Account
1. Complete business information
2. Add bank account details (for payouts)
3. Verify identity (if required)

**Note:** You can test everything in **Test Mode** before going live.

---

### Part 2: Get API Keys

#### 2.1 Navigate to API Keys
1. Log in to https://dashboard.stripe.com
2. Click **Developers** in left sidebar
3. Click **API keys**

#### 2.2 Copy Keys
You'll see two types of keys:

**Publishable Key** (starts with `pk_test_` or `pk_live_`)
- Used in frontend/client-side code
- Safe to expose publicly
- Copy this to `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

**Secret Key** (starts with `sk_test_` or `sk_live_`)
- Used in backend/server-side code
- **NEVER expose publicly**
- Copy this to `STRIPE_SECRET_KEY`

#### 2.3 Update .env
```env
# Stripe API Keys
STRIPE_SECRET_KEY=sk_test_51Abc...xyz
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51Abc...xyz
```

---

### Part 3: Create Products & Prices

#### 3.1 Navigate to Products
1. In Stripe Dashboard, click **Products** in left sidebar
2. Click **+ Add product**

#### 3.2 Create Starter Plan

**Product Information:**
- Name: `Optiq Starter`
- Description: `For small businesses scaling their ad spend`
- Image: (optional, upload logo)

**Pricing:**
1. Click **Add another price**
2. Create **Monthly Price:**
   - Price: `$199.00`
   - Billing period: `Monthly`
   - Currency: `USD`
   - Type: `Recurring`
   - Click **Add price**
   - **Copy the Price ID** (starts with `price_`) → Save as `STRIPE_PRICE_STARTER_MONTHLY`

3. Click **Add another price** again
4. Create **Annual Price:**
   - Price: `$1,990.00`
   - Billing period: `Yearly`
   - Currency: `USD`
   - Type: `Recurring`
   - Click **Add price**
   - **Copy the Price ID** → Save as `STRIPE_PRICE_STARTER_ANNUAL`

#### 3.3 Create Growth Plan

Repeat the process:

**Product Information:**
- Name: `Optiq Growth`
- Description: `For growing teams optimizing ROI across channels`

**Pricing:**
- Monthly: `$399.00` → Copy Price ID to `STRIPE_PRICE_GROWTH_MONTHLY`
- Annual: `$3,990.00` → Copy Price ID to `STRIPE_PRICE_GROWTH_ANNUAL`

#### 3.4 Create Enterprise Plan

**Product Information:**
- Name: `Optiq Enterprise`
- Description: `For agencies and enterprises with complex needs`

**Pricing:**
- Monthly: `$999.00` → Copy Price ID to `STRIPE_PRICE_SCALE_MONTHLY`
- Annual: `$9,990.00` → Copy Price ID to `STRIPE_PRICE_SCALE_ANNUAL`

#### 3.5 Update .env with Price IDs
```env
# Stripe Price IDs
STRIPE_PRICE_STARTER_MONTHLY=price_1Abc...
STRIPE_PRICE_STARTER_ANNUAL=price_1Def...
STRIPE_PRICE_GROWTH_MONTHLY=price_1Ghi...
STRIPE_PRICE_GROWTH_ANNUAL=price_1Jkl...
STRIPE_PRICE_SCALE_MONTHLY=price_1Mno...
STRIPE_PRICE_SCALE_ANNUAL=price_1Pqr...
```

---

### Part 4: Set Up Webhooks

Webhooks notify your app when subscription events occur (payment succeeded, subscription canceled, etc.)

#### 4.1 Create Webhook Endpoint
1. In Stripe Dashboard, go to **Developers** → **Webhooks**
2. Click **+ Add endpoint**

#### 4.2 Configure Endpoint

**For Local Development:**
- Endpoint URL: `http://localhost:3004/api/webhooks/stripe`
- Description: `Optiq Local Development`

**For Production:**
- Endpoint URL: `https://yourdomain.com/api/webhooks/stripe`
- Description: `Optiq Production`

#### 4.3 Select Events
Click **Select events** and choose:
- ✅ `customer.subscription.created`
- ✅ `customer.subscription.updated`
- ✅ `customer.subscription.deleted`
- ✅ `customer.subscription.trial_will_end`
- ✅ `invoice.payment_succeeded`
- ✅ `invoice.payment_failed`
- ✅ `checkout.session.completed`
- ✅ `checkout.session.expired`

Click **Add events**

#### 4.4 Get Webhook Secret
1. After creating the endpoint, click on it
2. Click **Reveal** under **Signing secret**
3. Copy the secret (starts with `whsec_`)
4. Add to .env:

```env
STRIPE_WEBHOOK_SECRET=whsec_abc123...
```

---

### Part 5: Test Stripe Integration

#### 5.1 Install Stripe CLI (for local testing)

**Mac:**
```bash
brew install stripe/stripe-cli/stripe
```

**Windows:**
Download from https://github.com/stripe/stripe-cli/releases

**Linux:**
```bash
wget https://github.com/stripe/stripe-cli/releases/download/v1.19.0/stripe_1.19.0_linux_x86_64.tar.gz
tar -xvf stripe_1.19.0_linux_x86_64.tar.gz
sudo mv stripe /usr/local/bin/
```

#### 5.2 Login to Stripe CLI
```bash
stripe login
```

This opens your browser to authorize the CLI.

#### 5.3 Forward Webhooks to Local Server
```bash
stripe listen --forward-to localhost:3004/api/webhooks/stripe
```

This gives you a webhook signing secret for local testing. Use this instead of the dashboard webhook secret during development.

#### 5.4 Test Card Numbers

**Success:**
- Card: `4242 4242 4242 4242`
- Expiry: Any future date (e.g., `12/25`)
- CVC: Any 3 digits (e.g., `123`)

**Decline:**
- Card: `4000 0000 0000 0002`

**3D Secure Required:**
- Card: `4000 0025 0000 3155`

**Full list:** https://stripe.com/docs/testing

---

### Part 6: Stripe Complete .env Example

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_51Abc...xyz
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51Abc...xyz
STRIPE_WEBHOOK_SECRET=whsec_abc123...

# Stripe Price IDs - Starter Plan
STRIPE_PRICE_STARTER_MONTHLY=price_1Abc...
STRIPE_PRICE_STARTER_ANNUAL=price_1Def...

# Stripe Price IDs - Growth Plan
STRIPE_PRICE_GROWTH_MONTHLY=price_1Ghi...
STRIPE_PRICE_GROWTH_ANNUAL=price_1Jkl...

# Stripe Price IDs - Enterprise Plan
STRIPE_PRICE_SCALE_MONTHLY=price_1Mno...
STRIPE_PRICE_SCALE_ANNUAL=price_1Pqr...
```

---

## 📱 **GOOGLE ADS SETUP**

### Step 1: Create Google Cloud Project

1. Go to https://console.cloud.google.com
2. Click **Select a project** → **New Project**
3. Name: `Optiq Attribution`
4. Click **Create**

### Step 2: Enable Google Ads API

1. In Google Cloud Console, go to **APIs & Services** → **Library**
2. Search for `Google Ads API`
3. Click **Enable**

### Step 3: Create OAuth Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **+ Create Credentials** → **OAuth client ID**
3. Application type: `Web application`
4. Name: `Optiq`
5. Authorized redirect URIs:
   - `http://localhost:3004/api/auth/callback/google`
   - `https://yourdomain.com/api/auth/callback/google` (production)
6. Click **Create**
7. Copy **Client ID** and **Client Secret**

### Step 4: Get Developer Token

1. Go to https://ads.google.com/aw/apicenter
2. Click **Apply for access**
3. Fill out the form (usually approved within 24 hours)
4. Once approved, copy your **Developer Token**

### Step 5: Update .env

```env
# Google Ads API
GOOGLE_ADS_CLIENT_ID=123456789-abc.apps.googleusercontent.com
GOOGLE_ADS_CLIENT_SECRET=GOCSPX-abc123...
GOOGLE_ADS_DEVELOPER_TOKEN=abc123xyz...
GOOGLE_ADS_REDIRECT_URI=http://localhost:3004/api/auth/callback/google
```

---

## 📘 **META (FACEBOOK) ADS SETUP**

### Step 1: Create Meta App

1. Go to https://developers.facebook.com
2. Click **My Apps** → **Create App**
3. Use case: `Business`
4. App name: `Optiq Attribution`
5. Contact email: your email
6. Click **Create App**

### Step 2: Add Marketing API

1. In your app dashboard, find **Marketing API**
2. Click **Set Up**
3. Follow the setup wizard

### Step 3: Get App Credentials

1. Go to **Settings** → **Basic**
2. Copy **App ID** → `META_APP_ID`
3. Click **Show** next to **App Secret**, copy it → `META_APP_SECRET`

### Step 4: Configure OAuth Redirect

1. Go to **Settings** → **Basic**
2. Scroll to **App Domains**
3. Add: `localhost` (for development)
4. In **Website** section, add:
   - `http://localhost:3004`
5. Click **Save Changes**

### Step 5: Update .env

```env
# Meta (Facebook) Ads API
META_APP_ID=123456789012345
META_APP_SECRET=abc123def456...
META_REDIRECT_URI=http://localhost:3004/api/auth/callback/meta
```

---

## 🎵 **TIKTOK ADS SETUP**

### Step 1: Create TikTok Developer Account

1. Go to https://ads.tiktok.com/marketing_api/homepage
2. Click **Get Started**
3. Sign in with TikTok account or create one
4. Complete developer registration

### Step 2: Create App

1. Go to https://ads.tiktok.com/marketing_api/apps
2. Click **Create an App**
3. App name: `Optiq Attribution`
4. App description: `Attribution tracking for TikTok Ads`
5. Click **Submit**

### Step 3: Get App Credentials

1. Click on your app
2. Copy **App ID** → `TIKTOK_APP_ID`
3. Copy **Secret** → `TIKTOK_APP_SECRET`

### Step 4: Configure Redirect URI

1. In app settings, find **Redirect URL**
2. Add: `http://localhost:3004/api/auth/callback/tiktok`
3. Click **Save**

### Step 5: Request API Access

1. In app dashboard, click **Apply for permissions**
2. Select required scopes:
   - `user.info.basic`
   - `ad_account.info`
   - `campaign.info`
   - `adgroup.info`
   - `ad.info`
3. Submit application (review takes 1-3 business days)

### Step 6: Update .env

```env
# TikTok Ads API
TIKTOK_APP_ID=1234567890123456789
TIKTOK_APP_SECRET=abc123def456...
TIKTOK_OAUTH_REDIRECT_URI=http://localhost:3004/api/auth/callback/tiktok
```

---

## ✅ **COMPLETE .env FILE EXAMPLE**

```env
# ============================================
# DATABASE
# ============================================
DATABASE_URL="postgresql://optiq:optiq_password@localhost:5432/optiq"

# ============================================
# AUTHENTICATION
# ============================================
NEXTAUTH_URL="http://localhost:3004"
NEXTAUTH_SECRET="your_32_char_secret_here_abc123"

# ============================================
# DATA ENCRYPTION
# ============================================
DATA_ENCRYPTION_KEY="your_32_char_encryption_key_here_xyz789"

# ============================================
# STRIPE (PAYMENT PROCESSING)
# ============================================
STRIPE_SECRET_KEY=sk_test_51Abc...xyz
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51Abc...xyz
STRIPE_WEBHOOK_SECRET=whsec_abc123...

# Stripe Price IDs
STRIPE_PRICE_STARTER_MONTHLY=price_1Abc...
STRIPE_PRICE_STARTER_ANNUAL=price_1Def...
STRIPE_PRICE_GROWTH_MONTHLY=price_1Ghi...
STRIPE_PRICE_GROWTH_ANNUAL=price_1Jkl...
STRIPE_PRICE_SCALE_MONTHLY=price_1Mno...
STRIPE_PRICE_SCALE_ANNUAL=price_1Pqr...

# ============================================
# GOOGLE ADS API
# ============================================
GOOGLE_ADS_CLIENT_ID=123456789-abc.apps.googleusercontent.com
GOOGLE_ADS_CLIENT_SECRET=GOCSPX-abc123...
GOOGLE_ADS_DEVELOPER_TOKEN=abc123xyz...
GOOGLE_ADS_REDIRECT_URI=http://localhost:3004/api/auth/callback/google

# ============================================
# META (FACEBOOK) ADS API
# ============================================
META_APP_ID=123456789012345
META_APP_SECRET=abc123def456...
META_REDIRECT_URI=http://localhost:3004/api/auth/callback/meta

# ============================================
# TIKTOK ADS API
# ============================================
TIKTOK_APP_ID=1234567890123456789
TIKTOK_APP_SECRET=abc123def456...
TIKTOK_OAUTH_REDIRECT_URI=http://localhost:3004/api/auth/callback/tiktok
```

---

## 🚀 **STARTUP CHECKLIST**

### Minimum to Start (Local Development):
- [x] Copy `.env.example` to `.env`
- [x] Generate `NEXTAUTH_SECRET`
- [x] Generate `DATA_ENCRYPTION_KEY`
- [x] Run `npm run dev`

### For Full Functionality:
- [ ] Set up Stripe account
- [ ] Create Stripe products & prices
- [ ] Configure Stripe webhooks
- [ ] Set up Google Ads API (if using Google Ads)
- [ ] Set up Meta Ads API (if using Facebook Ads)
- [ ] Set up TikTok Ads API (if using TikTok Ads)

---

## 🔒 **SECURITY BEST PRACTICES**

### 1. Never Commit .env to Git
```bash
# Already in .gitignore, but verify:
cat .gitignore | grep .env
```

### 2. Use Different Keys for Development vs Production
- Test mode keys for development (`sk_test_`, `pk_test_`)
- Live mode keys for production (`sk_live_`, `pk_live_`)

### 3. Rotate Keys Regularly
- Change secrets every 90 days
- Immediately rotate if compromised

### 4. Use Environment-Specific Variables
- Development: `http://localhost:3004`
- Staging: `https://staging.yourdomain.com`
- Production: `https://yourdomain.com`

---

## 🐛 **TROUBLESHOOTING**

### "Invalid API Key" Error
- ✅ Check key is copied correctly (no extra spaces)
- ✅ Verify you're using test keys in development
- ✅ Ensure key hasn't been revoked in dashboard

### Stripe Webhook Not Receiving Events
- ✅ Check webhook URL is publicly accessible
- ✅ Verify webhook secret matches
- ✅ Use Stripe CLI for local testing
- ✅ Check Stripe Dashboard → Webhooks → Logs

### Google/Meta/TikTok OAuth Fails
- ✅ Verify redirect URI matches exactly
- ✅ Check app is in correct mode (development/production)
- ✅ Ensure API access is approved
- ✅ Verify scopes/permissions are granted

---

## 📚 **ADDITIONAL RESOURCES**

### Stripe:
- Dashboard: https://dashboard.stripe.com
- Documentation: https://stripe.com/docs
- Testing: https://stripe.com/docs/testing
- CLI: https://stripe.com/docs/stripe-cli

### Google Ads:
- Console: https://console.cloud.google.com
- API Center: https://ads.google.com/aw/apicenter
- Documentation: https://developers.google.com/google-ads/api

### Meta Ads:
- Developer Portal: https://developers.facebook.com
- Marketing API: https://developers.facebook.com/docs/marketing-apis
- Business Manager: https://business.facebook.com

### TikTok Ads:
- Developer Portal: https://ads.tiktok.com/marketing_api
- Documentation: https://ads.tiktok.com/marketing_api/docs

---

## 💡 **QUICK START COMMANDS**

```bash
# 1. Install dependencies
npm install

# 2. Copy environment file
cp .env.example .env

# 3. Generate secrets (PowerShell)
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})

# 4. Update .env with generated secrets

# 5. Start development server
npm run dev
```

**Access the app at:** http://localhost:3004

---

**Last Updated:** December 31, 2024  
**Questions?** Check the troubleshooting section or refer to official documentation links above.
