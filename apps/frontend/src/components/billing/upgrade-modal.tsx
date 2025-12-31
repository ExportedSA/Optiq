"use client";

import { useState } from "react";
import { ModernCard } from "@/components/ui/modern-card";
import { ModernButton } from "@/components/ui/modern-button";
import { ModernBadge } from "@/components/ui/modern-badge";
import { PLAN_DEFINITIONS, type PlanTier } from "@optiq/shared";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan: PlanTier;
  targetPlan: PlanTier;
  billingCycle: "monthly" | "annual";
  onConfirm: () => Promise<void>;
}

export function UpgradeModal({
  isOpen,
  onClose,
  currentPlan,
  targetPlan,
  billingCycle,
  onConfirm,
}: UpgradeModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const currentPlanDef = PLAN_DEFINITIONS[currentPlan];
  const targetPlanDef = PLAN_DEFINITIONS[targetPlan];

  const targetPrice =
    billingCycle === "monthly"
      ? targetPlanDef.pricing.monthlyPriceCents
      : targetPlanDef.pricing.annualPriceCents / 12;

  const handleConfirm = async () => {
    setIsProcessing(true);
    try {
      await onConfirm();
    } catch (error) {
      console.error("Upgrade failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <ModernCard variant="glass" className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Upgrade Your Plan</h2>
            <p className="text-gray-600">
              You're upgrading from {currentPlanDef.name} to {targetPlanDef.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Plan Comparison */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Current Plan */}
          <div className="border border-gray-200 rounded-xl p-4">
            <div className="text-sm text-gray-500 mb-1">Current Plan</div>
            <div className="text-xl font-bold text-gray-900 mb-2">{currentPlanDef.name}</div>
            <div className="text-sm text-gray-600">{currentPlanDef.description}</div>
          </div>

          {/* Target Plan */}
          <div className="border-2 border-purple-500 rounded-xl p-4 bg-purple-50">
            <div className="flex items-center gap-2 mb-1">
              <div className="text-sm text-purple-600 font-semibold">New Plan</div>
              <ModernBadge variant="success" size="sm">
                Upgrade
              </ModernBadge>
            </div>
            <div className="text-xl font-bold text-gray-900 mb-2">{targetPlanDef.name}</div>
            <div className="text-sm text-gray-600">{targetPlanDef.description}</div>
          </div>
        </div>

        {/* New Features */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">What you'll get:</h3>
          <div className="space-y-2">
            {targetPlanDef.features.map((feature, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <svg
                  className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0"
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
                <span className="text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Summary */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm text-gray-600 mb-1">
                {billingCycle === "annual" ? "Annual" : "Monthly"} Billing
              </div>
              <div className="text-3xl font-bold text-gray-900">
                ${(targetPrice / 100).toFixed(2)}
                <span className="text-lg font-normal text-gray-600">/month</span>
              </div>
            </div>
            {billingCycle === "annual" && (
              <ModernBadge variant="success" size="lg">
                Save 17%
              </ModernBadge>
            )}
          </div>

          {billingCycle === "annual" && (
            <div className="text-sm text-gray-600">
              Billed annually at ${(targetPlanDef.pricing.annualPriceCents / 100).toFixed(2)}
            </div>
          )}
        </div>

        {/* Important Notes */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div className="text-sm text-blue-900">
              <p className="font-semibold mb-1">What happens next:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Your upgrade takes effect immediately</li>
                <li>You'll be charged the prorated amount for the current period</li>
                <li>New limits and features are available right away</li>
                <li>You can downgrade anytime (takes effect next billing cycle)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <ModernButton variant="ghost" size="lg" onClick={onClose} className="flex-1">
            Cancel
          </ModernButton>
          <ModernButton
            variant="gradient"
            size="lg"
            onClick={handleConfirm}
            loading={isProcessing}
            className="flex-1"
          >
            {isProcessing ? "Processing..." : `Upgrade to ${targetPlanDef.name}`}
          </ModernButton>
        </div>
      </ModernCard>
    </div>
  );
}
