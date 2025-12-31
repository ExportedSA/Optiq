"use client";

import { useState } from "react";
import { ModernCard } from "@/components/ui/modern-card";
import { ModernButton } from "@/components/ui/modern-button";
import { PLAN_DEFINITIONS, type PlanTier } from "@optiq/shared";

interface DowngradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan: PlanTier;
  targetPlan: PlanTier;
  onConfirm: () => Promise<void>;
}

export function DowngradeModal({
  isOpen,
  onClose,
  currentPlan,
  targetPlan,
  onConfirm,
}: DowngradeModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const currentPlanDef = PLAN_DEFINITIONS[currentPlan];
  const targetPlanDef = PLAN_DEFINITIONS[targetPlan];

  const handleConfirm = async () => {
    setIsProcessing(true);
    try {
      await onConfirm();
    } catch (error) {
      console.error("Downgrade failed:", error);
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
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Downgrade Your Plan</h2>
            <p className="text-gray-600">
              You're downgrading from {currentPlanDef.name} to {targetPlanDef.name}
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

        {/* Warning */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <svg
              className="w-6 h-6 text-orange-600 mt-0.5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <div className="text-sm text-orange-900">
              <p className="font-semibold mb-1">You'll lose access to:</p>
              <ul className="list-disc list-inside space-y-1">
                {currentPlanDef.features
                  .filter((f) => !targetPlanDef.features.includes(f))
                  .map((feature, idx) => (
                    <li key={idx}>{feature}</li>
                  ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Plan Comparison */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Current Plan */}
          <div className="border-2 border-gray-300 rounded-xl p-4">
            <div className="text-sm text-gray-500 mb-1">Current Plan</div>
            <div className="text-xl font-bold text-gray-900 mb-2">{currentPlanDef.name}</div>
            <div className="text-2xl font-bold text-gray-900">
              ${(currentPlanDef.pricing.monthlyPriceCents / 100).toFixed(0)}
              <span className="text-sm font-normal text-gray-600">/mo</span>
            </div>
          </div>

          {/* Target Plan */}
          <div className="border border-gray-200 rounded-xl p-4">
            <div className="text-sm text-gray-500 mb-1">New Plan</div>
            <div className="text-xl font-bold text-gray-900 mb-2">{targetPlanDef.name}</div>
            <div className="text-2xl font-bold text-gray-900">
              {targetPlanDef.pricing.monthlyPriceCents === 0 ? (
                "Free"
              ) : (
                <>
                  ${(targetPlanDef.pricing.monthlyPriceCents / 100).toFixed(0)}
                  <span className="text-sm font-normal text-gray-600">/mo</span>
                </>
              )}
            </div>
          </div>
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
                <li>Your downgrade takes effect at the end of your current billing period</li>
                <li>You'll keep access to current features until then</li>
                <li>No refunds for the current period</li>
                <li>You can upgrade again anytime</li>
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
            variant="primary"
            size="lg"
            onClick={handleConfirm}
            loading={isProcessing}
            className="flex-1"
          >
            {isProcessing ? "Processing..." : `Confirm Downgrade`}
          </ModernButton>
        </div>
      </ModernCard>
    </div>
  );
}
