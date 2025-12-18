import "server-only";

import type { PlanTier } from "@optiq/shared";

/**
 * Stripe Products & Prices Mapping
 * 
 * These IDs should be created in Stripe Dashboard and stored in env vars.
 * Each plan tier has monthly and annual price IDs.
 */

export interface StripePriceConfig {
  monthly: string;
  annual: string;
}

export interface StripeProductConfig {
  productId: string;
  prices: StripePriceConfig;
}

export const STRIPE_CONFIG = {
  publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "",
  secretKey: process.env.STRIPE_SECRET_KEY ?? "",
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET ?? "",
  
  products: {
    STARTER: {
      productId: process.env.STRIPE_PRODUCT_STARTER ?? "prod_starter",
      prices: {
        monthly: process.env.STRIPE_PRICE_STARTER_MONTHLY ?? "price_starter_monthly",
        annual: process.env.STRIPE_PRICE_STARTER_ANNUAL ?? "price_starter_annual",
      },
    },
    GROWTH: {
      productId: process.env.STRIPE_PRODUCT_GROWTH ?? "prod_growth",
      prices: {
        monthly: process.env.STRIPE_PRICE_GROWTH_MONTHLY ?? "price_growth_monthly",
        annual: process.env.STRIPE_PRICE_GROWTH_ANNUAL ?? "price_growth_annual",
      },
    },
    SCALE: {
      productId: process.env.STRIPE_PRODUCT_SCALE ?? "prod_scale",
      prices: {
        monthly: process.env.STRIPE_PRICE_SCALE_MONTHLY ?? "price_scale_monthly",
        annual: process.env.STRIPE_PRICE_SCALE_ANNUAL ?? "price_scale_annual",
      },
    },
  } as Record<Exclude<PlanTier, "FREE">, StripeProductConfig>,

  portalConfigId: process.env.STRIPE_PORTAL_CONFIG_ID ?? "",

  successUrl: process.env.NEXTAUTH_URL
    ? `${process.env.NEXTAUTH_URL}/app/settings/billing?success=true`
    : "http://localhost:3000/app/settings/billing?success=true",

  cancelUrl: process.env.NEXTAUTH_URL
    ? `${process.env.NEXTAUTH_URL}/app/settings/billing?canceled=true`
    : "http://localhost:3000/app/settings/billing?canceled=true",
};

export function getPriceId(tier: PlanTier, interval: "monthly" | "annual"): string | null {
  if (tier === "FREE") return null;
  const product = STRIPE_CONFIG.products[tier];
  if (!product) return null;
  return product.prices[interval];
}

export function getTierFromPriceId(priceId: string): { tier: PlanTier; interval: "monthly" | "annual" } | null {
  for (const [tier, config] of Object.entries(STRIPE_CONFIG.products)) {
    if (config.prices.monthly === priceId) {
      return { tier: tier as PlanTier, interval: "monthly" };
    }
    if (config.prices.annual === priceId) {
      return { tier: tier as PlanTier, interval: "annual" };
    }
  }
  return null;
}

export function isStripeConfigured(): boolean {
  return !!(STRIPE_CONFIG.secretKey && STRIPE_CONFIG.publishableKey);
}
