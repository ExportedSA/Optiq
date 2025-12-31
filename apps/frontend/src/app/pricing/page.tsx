"use client";

import { useState } from "react";
import { ModernCard } from "@/components/ui/modern-card";
import { ModernButton } from "@/components/ui/modern-button";
import { ModernBadge } from "@/components/ui/modern-badge";
import { PLAN_DEFINITIONS, type PlanTier } from "@optiq/shared";

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");

  const plans: PlanTier[] = ["FREE", "STARTER", "GROWTH", "SCALE"];

  const formatPrice = (cents: number) => {
    if (cents === 0) return "Free";
    const dollars = cents / 100;
    return `$${dollars.toLocaleString()}`;
  };

  const getMonthlyPrice = (tier: PlanTier) => {
    const plan = PLAN_DEFINITIONS[tier];
    if (billingCycle === "monthly") {
      return formatPrice(plan.pricing.monthlyPriceCents);
    }
    // Annual pricing divided by 12
    const monthlyFromAnnual = plan.pricing.annualPriceCents / 12;
    return formatPrice(monthlyFromAnnual);
  };

  const getAnnualSavings = (tier: PlanTier) => {
    const plan = PLAN_DEFINITIONS[tier];
    if (plan.pricing.monthlyPriceCents === 0) return 0;
    const monthlyTotal = plan.pricing.monthlyPriceCents * 12;
    const savings = monthlyTotal - plan.pricing.annualPriceCents;
    return savings / 100;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 py-12 px-4">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Choose the perfect plan for your business. No hidden fees, no surprises.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-4 bg-white rounded-2xl p-2 shadow-lg">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                billingCycle === "monthly"
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("annual")}
              className={`px-6 py-3 rounded-xl font-semibold transition-all relative ${
                billingCycle === "annual"
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Annual
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                Save 17%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {plans.map((tier) => {
            const plan = PLAN_DEFINITIONS[tier];
            const isRecommended = plan.recommended;
            const annualSavings = getAnnualSavings(tier);

            return (
              <div key={tier} className="relative">
                {isRecommended && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                    <ModernBadge variant="success" size="lg" pulse>
                      ⭐ Most Popular
                    </ModernBadge>
                  </div>
                )}

                <ModernCard
                  variant={isRecommended ? "gradient" : "glass"}
                  hover
                  className={`h-full flex flex-col ${
                    isRecommended ? "ring-2 ring-purple-500 scale-105" : ""
                  }`}
                >
                  <div className="flex-1">
                    {/* Plan Header */}
                    <div className="mb-6">
                      <h3
                        className={`text-2xl font-bold mb-2 ${
                          isRecommended ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {plan.name}
                      </h3>
                      <p
                        className={`text-sm ${
                          isRecommended ? "text-white/90" : "text-gray-600"
                        }`}
                      >
                        {plan.description}
                      </p>
                    </div>

                    {/* Price */}
                    <div className="mb-6">
                      <div
                        className={`text-4xl font-bold mb-2 ${
                          isRecommended ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {getMonthlyPrice(tier)}
                        {plan.pricing.monthlyPriceCents > 0 && (
                          <span className="text-lg font-normal">/mo</span>
                        )}
                      </div>
                      {billingCycle === "annual" && annualSavings > 0 && (
                        <p
                          className={`text-sm ${
                            isRecommended ? "text-white/80" : "text-green-600"
                          }`}
                        >
                          Save ${annualSavings.toLocaleString()}/year
                        </p>
                      )}
                      {billingCycle === "monthly" && plan.pricing.monthlyPriceCents > 0 && (
                        <p
                          className={`text-sm ${
                            isRecommended ? "text-white/80" : "text-gray-500"
                          }`}
                        >
                          Billed monthly
                        </p>
                      )}
                    </div>

                    {/* Features */}
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <svg
                            className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                              isRecommended ? "text-white" : "text-green-500"
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <span
                            className={`text-sm ${
                              isRecommended ? "text-white/90" : "text-gray-700"
                            }`}
                          >
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA Button */}
                  <ModernButton
                    variant={isRecommended ? "secondary" : "primary"}
                    size="lg"
                    className="w-full"
                  >
                    {tier === "FREE" ? "Get Started Free" : "Start Free Trial"}
                  </ModernButton>
                </ModernCard>
              </div>
            );
          })}
        </div>

        {/* Feature Comparison Table */}
        <ModernCard variant="glass" className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Feature Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-4 font-semibold text-gray-900">Feature</th>
                  {plans.map((tier) => (
                    <th key={tier} className="text-center py-4 px-4 font-semibold text-gray-900">
                      {PLAN_DEFINITIONS[tier].name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="py-4 px-4 text-gray-700">Workspaces</td>
                  {plans.map((tier) => {
                    const limit = PLAN_DEFINITIONS[tier].limits.maxWorkspaces;
                    return (
                      <td key={tier} className="text-center py-4 px-4 text-gray-900">
                        {limit === -1 ? "Unlimited" : limit}
                      </td>
                    );
                  })}
                </tr>
                <tr>
                  <td className="py-4 px-4 text-gray-700">Ad Platform Connectors</td>
                  {plans.map((tier) => {
                    const limit = PLAN_DEFINITIONS[tier].limits.maxConnectors;
                    return (
                      <td key={tier} className="text-center py-4 px-4 text-gray-900">
                        {limit === -1 ? "Unlimited" : limit}
                      </td>
                    );
                  })}
                </tr>
                <tr>
                  <td className="py-4 px-4 text-gray-700">Events per Month</td>
                  {plans.map((tier) => {
                    const limit = PLAN_DEFINITIONS[tier].limits.monthlyEventLimit;
                    return (
                      <td key={tier} className="text-center py-4 px-4 text-gray-900">
                        {(limit / 1000).toLocaleString()}K
                      </td>
                    );
                  })}
                </tr>
                <tr>
                  <td className="py-4 px-4 text-gray-700">Data Retention</td>
                  {plans.map((tier) => {
                    const days = PLAN_DEFINITIONS[tier].limits.dataRetentionDays;
                    return (
                      <td key={tier} className="text-center py-4 px-4 text-gray-900">
                        {days} days
                      </td>
                    );
                  })}
                </tr>
                <tr>
                  <td className="py-4 px-4 text-gray-700">Attribution Models</td>
                  {plans.map((tier) => {
                    const models = PLAN_DEFINITIONS[tier].limits.attributionModels.length;
                    return (
                      <td key={tier} className="text-center py-4 px-4 text-gray-900">
                        {models} {models === 1 ? "model" : "models"}
                      </td>
                    );
                  })}
                </tr>
                <tr>
                  <td className="py-4 px-4 text-gray-700">Alerts & Notifications</td>
                  {plans.map((tier) => {
                    const enabled = PLAN_DEFINITIONS[tier].limits.alertsEnabled;
                    return (
                      <td key={tier} className="text-center py-4 px-4">
                        {enabled ? (
                          <span className="text-green-500">✓</span>
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
                <tr>
                  <td className="py-4 px-4 text-gray-700">SSO/SAML</td>
                  {plans.map((tier) => {
                    const enabled = PLAN_DEFINITIONS[tier].limits.ssoEnabled;
                    return (
                      <td key={tier} className="text-center py-4 px-4">
                        {enabled ? (
                          <span className="text-green-500">✓</span>
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
                <tr>
                  <td className="py-4 px-4 text-gray-700">Priority Support</td>
                  {plans.map((tier) => {
                    const enabled = PLAN_DEFINITIONS[tier].limits.prioritySupport;
                    return (
                      <td key={tier} className="text-center py-4 px-4">
                        {enabled ? (
                          <span className="text-green-500">✓</span>
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        </ModernCard>

        {/* FAQ Section */}
        <ModernCard variant="glass" className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can I change plans at any time?
              </h3>
              <p className="text-gray-600">
                Yes! You can upgrade or downgrade your plan at any time. Upgrades take effect
                immediately, and downgrades take effect at the end of your current billing period.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What happens if I exceed my event limit?
              </h3>
              <p className="text-gray-600">
                We'll send you an alert when you reach 80% of your limit. Overages are charged at
                $3-4 per 10,000 events depending on your plan. You can also upgrade to a higher
                tier at any time.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Do you offer a free trial?
              </h3>
              <p className="text-gray-600">
                Yes! All paid plans include a 14-day free trial. No credit card required to start.
                You can also use our Free plan indefinitely to test the platform.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-600">
                We accept all major credit cards (Visa, Mastercard, American Express) via Stripe.
                Enterprise customers can also pay via invoice.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Is there a money-back guarantee?
              </h3>
              <p className="text-gray-600">
                Yes! We offer a 30-day money-back guarantee on all paid plans. If you're not
                satisfied, we'll refund your payment in full.
              </p>
            </div>
          </div>
        </ModernCard>

        {/* CTA Section */}
        <div className="text-center">
          <ModernCard variant="gradient" className="inline-block">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to optimize your ad spend?
            </h2>
            <p className="text-white/90 mb-6 text-lg">
              Join hundreds of marketers who trust Optiq for attribution tracking.
            </p>
            <ModernButton variant="secondary" size="lg">
              Start Your Free Trial →
            </ModernButton>
          </ModernCard>
        </div>
      </div>
    </div>
  );
}
