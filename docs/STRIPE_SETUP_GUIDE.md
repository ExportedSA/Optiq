# Stripe Setup Guide for Optiq

This guide will walk you through setting up Stripe for Optiq's subscription billing.

## Prerequisites

- Stripe account (sign up at https://stripe.com)
- Access to Stripe Dashboard
- Optiq environment variables configured

---

## Step 1: Create Stripe Products

### 1.1 Navigate to Products
1. Go to https://dashboard.stripe.com/products
2. Click **"+ Add product"**

### 1.2 Create Starter Plan Product

**Product Details:**
- Name: `Optiq Starter`
- Description: `For small businesses scaling their ad spend`
- Statement descriptor: `OPTIQ STARTER`

**Pricing:**
1. Click **"Add another price"** to create two prices:

**Monthly Price:**
- Price: `$199.00`
- Billing period: `Monthly`
- Currency: `USD`
- Type: `Recurring`
- Copy the Price ID (starts with `price_`) → This is `STRIPE_PRICE_STARTER_MONTHLY`

**Annual Price:**
- Price: `$1,990.00` (or `$165.83/month`)
- Billing period: `Yearly`
- Currency: `USD`
- Type: `Recurring`
- Copy the Price ID → This is `STRIPE_PRICE_STARTER_ANNUAL`

### 1.3 Create Growth Plan Product

**Product Details:**
- Name: `Optiq Growth`
- Description: `For growing teams optimizing ROI across channels`
- Statement descriptor: `OPTIQ GROWTH`

**Pricing:**

**Monthly Price:**
- Price: `$399.00`
- Billing period: `Monthly`
- Copy Price ID → `STRIPE_PRICE_GROWTH_MONTHLY`

**Annual Price:**
- Price: `$3,990.00` (or `$332.50/month`)
- Billing period: `Yearly`
- Copy Price ID → `STRIPE_PRICE_GROWTH_ANNUAL`

### 1.4 Create Enterprise Plan Product

**Product Details:**
- Name: `Optiq Enterprise`
- Description: `For agencies and enterprises with complex needs`
- Statement descriptor: `OPTIQ ENTERPRISE`

**Pricing:**

**Monthly Price:**
- Price: `$999.00`
- Billing period: `Monthly`
- Copy Price ID → `STRIPE_PRICE_SCALE_MONTHLY`

**Annual Price:**
- Price: `$9,990.00` (or `$832.50/month`)
- Billing period: `Yearly`
- Copy Price ID → `STRIPE_PRICE_SCALE_ANNUAL`

---

## Step 2: Get API Keys

### 2.1 Get Publishable Key
1. Go to https://dashboard.stripe.com/apikeys
2. Copy **Publishable key** (starts with `pk_test_` or `pk_live_`)
3. This is `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

### 2.2 Get Secret Key
1. On the same page, reveal and copy **Secret key** (starts with `sk_test_` or `sk_live_`)
2. This is `STRIPE_SECRET_KEY`
3. **⚠️ NEVER commit this to version control!**

---

## Step 3: Set Up Webhooks

### 3.1 Create Webhook Endpoint
1. Go to https://dashboard.stripe.com/webhooks
2. Click **"+ Add endpoint"**
3. Endpoint URL: `https://your-domain.com/api/webhooks/stripe`
   - For local testing: Use ngrok or Stripe CLI
4. Description: `Optiq Subscription Events`

### 3.2 Select Events to Listen To
Select these events:
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`
- `checkout.session.completed`

### 3.3 Get Webhook Secret
1. After creating the endpoint, click on it
2. Click **"Reveal"** under **Signing secret**
3. Copy the secret (starts with `whsec_`)
4. This is `STRIPE_WEBHOOK_SECRET`

---

## Step 4: Update Environment Variables

Add these to your `.env` file:

```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Stripe Price IDs - Starter Plan
STRIPE_PRICE_STARTER_MONTHLY=price_your_starter_monthly_id
STRIPE_PRICE_STARTER_ANNUAL=price_your_starter_annual_id

# Stripe Price IDs - Growth Plan
STRIPE_PRICE_GROWTH_MONTHLY=price_your_growth_monthly_id
STRIPE_PRICE_GROWTH_ANNUAL=price_your_growth_annual_id

# Stripe Price IDs - Enterprise Plan
STRIPE_PRICE_SCALE_MONTHLY=price_your_scale_monthly_id
STRIPE_PRICE_SCALE_ANNUAL=price_your_scale_annual_id
```

---

## Step 5: Test in Development

### 5.1 Use Stripe CLI for Local Webhooks
```bash
# Install Stripe CLI
# Mac: brew install stripe/stripe-cli/stripe
# Windows: Download from https://github.com/stripe/stripe-cli/releases

# Login to Stripe
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3004/api/webhooks/stripe
```

### 5.2 Test Card Numbers
Use these test cards in development:
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- 3D Secure: `4000 0025 0000 3155`

Any future expiry date and any 3-digit CVC.

---

## Step 6: Implement Checkout Flow

The checkout flow is already implemented in:
- `/apps/frontend/src/lib/stripe/products.ts` - Price configuration
- `/apps/frontend/src/components/billing/upgrade-modal.tsx` - Upgrade UI
- `/apps/frontend/src/app/pricing/page.tsx` - Pricing page

### 6.1 Create Checkout Session API Route

Create `/apps/frontend/src/app/api/stripe/create-checkout/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getStripePriceId } from "@/lib/stripe/products";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { priceId, successUrl, cancelUrl } = await req.json();

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: successUrl,
    cancel_url: cancelUrl,
    customer_email: session.user.email!,
    metadata: {
      userId: session.user.id,
      organizationId: session.user.activeOrgId!,
    },
  });

  return NextResponse.json({ sessionId: checkoutSession.id });
}
```

---

## Step 7: Go Live Checklist

Before going to production:

### 7.1 Switch to Live Mode
1. Toggle to **Live mode** in Stripe Dashboard
2. Get new live API keys (`pk_live_` and `sk_live_`)
3. Update environment variables

### 7.2 Update Webhook Endpoint
1. Create new webhook for production URL
2. Update `STRIPE_WEBHOOK_SECRET` with live secret

### 7.3 Verify Products
1. Ensure all products are created in live mode
2. Update price IDs in environment variables

### 7.4 Test Production Flow
1. Make a real $1 test purchase
2. Verify webhook events are received
3. Refund the test purchase

---

## Troubleshooting

### Webhook Not Receiving Events
- Check webhook URL is publicly accessible
- Verify webhook secret is correct
- Check Stripe Dashboard > Webhooks > Logs

### Payment Fails
- Check API keys are correct
- Verify price IDs match Stripe products
- Check Stripe Dashboard > Logs for errors

### Subscription Not Created
- Check webhook handler is processing events
- Verify database is updating correctly
- Check application logs

---

## Security Best Practices

1. **Never expose secret keys**
   - Use environment variables
   - Never commit to git
   - Rotate keys if compromised

2. **Verify webhook signatures**
   - Always verify `stripe-signature` header
   - Prevents unauthorized webhook calls

3. **Use HTTPS in production**
   - Required for PCI compliance
   - Stripe won't send webhooks to HTTP

4. **Implement idempotency**
   - Handle duplicate webhook events
   - Use `event.id` for deduplication

---

## Additional Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe API Reference](https://stripe.com/docs/api)
- [Stripe Testing Guide](https://stripe.com/docs/testing)
- [Stripe Webhooks Guide](https://stripe.com/docs/webhooks)
- [Stripe CLI Documentation](https://stripe.com/docs/stripe-cli)

---

**Last Updated:** December 31, 2024
