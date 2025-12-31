"use client";

import { useState } from "react";
import { ModernCard } from "@/components/ui/modern-card";
import { ModernButton } from "@/components/ui/modern-button";
import { ModernBadge } from "@/components/ui/modern-badge";
import { UsageTracker } from "@/components/billing/usage-tracker";
import { UpgradeModal } from "@/components/billing/upgrade-modal";
import { DowngradeModal } from "@/components/billing/downgrade-modal";
import { PLAN_DEFINITIONS, type PlanTier } from "@optiq/shared";

export default function BillingPage() {
  // Mock data - replace with real data from API
  const [currentPlan] = useState<PlanTier>("GROWTH");
  const [billingCycle] = useState<"monthly" | "annual">("annual");
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showDowngradeModal, setShowDowngradeModal] = useState(false);
  const [targetPlan, setTargetPlan] = useState<PlanTier>("SCALE");

  const mockUsage = {
    trackedEvents: 180000,
    connectedAccounts: 8,
    workspacesUsed: 3,
    periodStart: new Date(2024, 11, 1),
    periodEnd: new Date(2024, 11, 31),
  };

  const mockPaymentMethod = {
    type: "card",
    last4: "4242",
    brand: "Visa",
    expiryMonth: 12,
    expiryYear: 2025,
  };

  const mockInvoices = [
    {
      id: "inv_001",
      date: new Date(2024, 10, 1),
      amount: 39900,
      status: "paid",
      invoiceUrl: "#",
    },
    {
      id: "inv_002",
      date: new Date(2024, 9, 1),
      amount: 39900,
      status: "paid",
      invoiceUrl: "#",
    },
    {
      id: "inv_003",
      date: new Date(2024, 8, 1),
      amount: 39900,
      status: "paid",
      invoiceUrl: "#",
    },
  ];

  const currentPlanDef = PLAN_DEFINITIONS[currentPlan];
  const nextBillingDate = new Date(2025, 0, 1);

  const handleUpgrade = (plan: PlanTier) => {
    setTargetPlan(plan);
    setShowUpgradeModal(true);
  };

  const handleDowngrade = (plan: PlanTier) => {
    setTargetPlan(plan);
    setShowDowngradeModal(true);
  };

  const confirmUpgrade = async () => {
    // TODO: Implement Stripe checkout
    console.log("Upgrading to", targetPlan);
    setShowUpgradeModal(false);
  };

  const confirmDowngrade = async () => {
    // TODO: Implement downgrade API call
    console.log("Downgrading to", targetPlan);
    setShowDowngradeModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          Billing & Subscription
        </h1>
        <p className="text-gray-600 mt-1">Manage your plan, usage, and payment methods</p>
      </div>

      {/* Current Plan Card */}
      <ModernCard variant="gradient">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-white">{currentPlanDef.name} Plan</h2>
              {currentPlanDef.recommended && (
                <ModernBadge variant="success" pulse>
                  ⭐ Current Plan
                </ModernBadge>
              )}
            </div>
            <p className="text-white/90 mb-4">{currentPlanDef.description}</p>

            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-4xl font-bold text-white">
                ${(currentPlanDef.pricing.monthlyPriceCents / 100).toFixed(0)}
              </span>
              <span className="text-white/80">/month</span>
              {billingCycle === "annual" && (
                <ModernBadge variant="success" size="sm">
                  Billed Annually
                </ModernBadge>
              )}
            </div>

            <div className="text-sm text-white/80">
              Next billing date: {nextBillingDate.toLocaleDateString()}
            </div>
          </div>

          <div className="flex gap-2">
            <ModernButton variant="secondary" size="md">
              Change Plan
            </ModernButton>
            <ModernButton variant="ghost" size="md" className="text-white hover:bg-white/20">
              Cancel Subscription
            </ModernButton>
          </div>
        </div>
      </ModernCard>

      {/* Usage Tracker */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Current Usage</h2>
        <UsageTracker
          currentPlan={currentPlan}
          usage={mockUsage}
          onUpgradeClick={() => handleUpgrade("SCALE")}
        />
      </div>

      {/* Available Plans */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Available Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(["STARTER", "GROWTH", "SCALE"] as PlanTier[]).map((tier) => {
            const plan = PLAN_DEFINITIONS[tier];
            const isCurrent = tier === currentPlan;
            const isUpgrade = tier > currentPlan;

            return (
              <ModernCard
                key={tier}
                variant={isCurrent ? "gradient" : "glass"}
                className={isCurrent ? "ring-2 ring-purple-500" : ""}
              >
                <div className="flex flex-col h-full">
                  <div className="flex-1">
                    <h3
                      className={`text-xl font-bold mb-2 ${isCurrent ? "text-white" : "text-gray-900"}`}
                    >
                      {plan.name}
                    </h3>
                    <p className={`text-sm mb-4 ${isCurrent ? "text-white/90" : "text-gray-600"}`}>
                      {plan.description}
                    </p>

                    <div
                      className={`text-3xl font-bold mb-4 ${isCurrent ? "text-white" : "text-gray-900"}`}
                    >
                      ${(plan.pricing.monthlyPriceCents / 100).toFixed(0)}
                      <span className="text-lg font-normal">/mo</span>
                    </div>

                    <ul className="space-y-2 mb-4">
                      {plan.features.slice(0, 5).map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <svg
                            className={`w-4 h-4 mt-0.5 flex-shrink-0 ${isCurrent ? "text-white" : "text-green-500"}`}
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
                          <span className={isCurrent ? "text-white/90" : "text-gray-700"}>
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {isCurrent ? (
                    <div className="w-full">
                      <ModernBadge variant="success" size="lg">
                        Current Plan
                      </ModernBadge>
                    </div>
                  ) : (
                    <ModernButton
                      variant={isUpgrade ? "primary" : "ghost"}
                      size="md"
                      className="w-full"
                      onClick={() =>
                        isUpgrade ? handleUpgrade(tier) : handleDowngrade(tier)
                      }
                    >
                      {isUpgrade ? "Upgrade" : "Downgrade"}
                    </ModernButton>
                  )}
                </div>
              </ModernCard>
            );
          })}
        </div>
      </div>

      {/* Payment Method */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Method</h2>
        <ModernCard variant="glass">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
              </div>
              <div>
                <div className="font-semibold text-gray-900">
                  {mockPaymentMethod.brand} •••• {mockPaymentMethod.last4}
                </div>
                <div className="text-sm text-gray-600">
                  Expires {mockPaymentMethod.expiryMonth}/{mockPaymentMethod.expiryYear}
                </div>
              </div>
            </div>
            <ModernButton variant="ghost" size="sm">
              Update
            </ModernButton>
          </div>
        </ModernCard>
      </div>

      {/* Billing History */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Billing History</h2>
        <ModernCard variant="glass">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Amount</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {mockInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-900">
                      {invoice.date.toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-gray-900">
                      ${(invoice.amount / 100).toFixed(2)}
                    </td>
                    <td className="py-3 px-4">
                      <ModernBadge variant="success" size="sm">
                        {invoice.status}
                      </ModernBadge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <a
                        href={invoice.invoiceUrl}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        Download
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ModernCard>
      </div>

      {/* Modals */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        currentPlan={currentPlan}
        targetPlan={targetPlan}
        billingCycle={billingCycle}
        onConfirm={confirmUpgrade}
      />

      <DowngradeModal
        isOpen={showDowngradeModal}
        onClose={() => setShowDowngradeModal(false)}
        currentPlan={currentPlan}
        targetPlan={targetPlan}
        onConfirm={confirmDowngrade}
      />
    </div>
  );
}
