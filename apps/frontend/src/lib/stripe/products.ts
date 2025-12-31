/**
 * Stripe Product and Price Configuration
 * 
 * This file maps our internal plan tiers to Stripe Price IDs.
 * Update these IDs after creating products in Stripe Dashboard.
 */

import type { PlanTier } from "@optiq/shared";

export interface StripePriceConfig {
  monthly: string;
  annual: string;
}

/**
 * Stripe Price IDs for each plan tier
 * 
 * To set up:
 * 1. Go to https://dashboard.stripe.com/products
 * 2. Create a product for each tier (Starter, Growth, Enterprise)
 * 3. Add two prices per product: monthly and annual
 * 4. Copy the price IDs (price_xxx) and paste them here
 * 5. Update your .env file with STRIPE_SECRET_KEY and STRIPE_PUBLISHABLE_KEY
 */
export const STRIPE_PRICES: Record<Exclude<PlanTier, "FREE">, StripePriceConfig> = {
  STARTER: {
    monthly: process.env.STRIPE_PRICE_STARTER_MONTHLY || "price_starter_monthly_placeholder",
    annual: process.env.STRIPE_PRICE_STARTER_ANNUAL || "price_starter_annual_placeholder",
  },
  GROWTH: {
    monthly: process.env.STRIPE_PRICE_GROWTH_MONTHLY || "price_growth_monthly_placeholder",
    annual: process.env.STRIPE_PRICE_GROWTH_ANNUAL || "price_growth_annual_placeholder",
  },
  SCALE: {
    monthly: process.env.STRIPE_PRICE_SCALE_MONTHLY || "price_scale_monthly_placeholder",
    annual: process.env.STRIPE_PRICE_SCALE_ANNUAL || "price_scale_annual_placeholder",
  },
};

/**
 * Get Stripe Price ID for a given plan and billing cycle
 */
export function getStripePriceId(
  tier: Exclude<PlanTier, "FREE">,
  billingCycle: "monthly" | "annual"
): string {
  return STRIPE_PRICES[tier][billingCycle];
}

/**
 * Stripe Product Configuration Guide
 * 
 * Create these products in Stripe Dashboard:
 * 
 * 1. STARTER PLAN
 *    - Name: "Optiq Starter"
 *    - Description: "For small businesses scaling their ad spend"
 *    - Monthly Price: $199/month
 *    - Annual Price: $1,990/year ($165.83/month)
 * 
 * 2. GROWTH PLAN
 *    - Name: "Optiq Growth"
 *    - Description: "For growing teams optimizing ROI across channels"
 *    - Monthly Price: $399/month
 *    - Annual Price: $3,990/year ($332.50/month)
 * 
 * 3. ENTERPRISE PLAN
 *    - Name: "Optiq Enterprise"
 *    - Description: "For agencies and enterprises with complex needs"
 *    - Monthly Price: $999/month
 *    - Annual Price: $9,990/year ($832.50/month)
 * 
 * For each product:
 * - Set billing period to "Monthly" or "Yearly"
 * - Enable "Recurring" billing
 * - Set currency to USD
 * - Copy the price ID (starts with "price_")
 * - Add to environment variables
 */

/**
 * Environment Variables Required:
 * 
 * Add these to your .env file:
 * 
 * # Stripe Configuration
 * STRIPE_SECRET_KEY=sk_test_...
 * NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
 * STRIPE_WEBHOOK_SECRET=whsec_...
 * 
 * # Stripe Price IDs
 * STRIPE_PRICE_STARTER_MONTHLY=price_...
 * STRIPE_PRICE_STARTER_ANNUAL=price_...
 * STRIPE_PRICE_GROWTH_MONTHLY=price_...
 * STRIPE_PRICE_GROWTH_ANNUAL=price_...
 * STRIPE_PRICE_SCALE_MONTHLY=price_...
 * STRIPE_PRICE_SCALE_ANNUAL=price_...
 */
