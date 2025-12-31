"use client";

import { useEffect, useState } from "react";
import { ModernCard } from "@/components/ui/modern-card";
import { ModernBadge } from "@/components/ui/modern-badge";
import { PLAN_DEFINITIONS, type PlanTier, calculateOverages } from "@optiq/shared";

interface UsageData {
  trackedEvents: number;
  connectedAccounts: number;
  workspacesUsed: number;
  periodStart: Date;
  periodEnd: Date;
}

interface UsageTrackerProps {
  currentPlan: PlanTier;
  usage: UsageData;
  onUpgradeClick?: () => void;
}

export function UsageTracker({ currentPlan, usage, onUpgradeClick }: UsageTrackerProps) {
  const [showAlert, setShowAlert] = useState(false);
  const plan = PLAN_DEFINITIONS[currentPlan];
  const limits = plan.limits;

  // Calculate usage percentages
  const eventsPercentage = (usage.trackedEvents / limits.monthlyEventLimit) * 100;
  const connectorsPercentage =
    limits.maxConnectors === -1
      ? 0
      : (usage.connectedAccounts / limits.maxConnectors) * 100;
  const workspacesPercentage =
    limits.maxWorkspaces === -1 ? 0 : (usage.workspacesUsed / limits.maxWorkspaces) * 100;

  // Calculate overages
  const overages = calculateOverages(usage, limits, plan.pricing);
  const hasOverages = overages.totalOverageCents > 0;

  // Show alert if usage is high
  useEffect(() => {
    if (eventsPercentage >= 80 || connectorsPercentage >= 80 || workspacesPercentage >= 80) {
      setShowAlert(true);
    }
  }, [eventsPercentage, connectorsPercentage, workspacesPercentage]);

  const getUsageColor = (percentage: number) => {
    if (percentage >= 100) return "text-red-600";
    if (percentage >= 80) return "text-orange-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-green-600";
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return "bg-red-500";
    if (percentage >= 80) return "bg-orange-500";
    if (percentage >= 60) return "bg-yellow-500";
    return "bg-green-500";
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="space-y-4">
      {/* Alert Banner */}
      {showAlert && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 animate-fade-in">
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
            <div className="flex-1">
              <h3 className="font-semibold text-orange-900 mb-1">
                You're approaching your plan limits
              </h3>
              <p className="text-sm text-orange-800 mb-3">
                Consider upgrading to avoid overages or service interruption.
              </p>
              {onUpgradeClick && (
                <button
                  onClick={onUpgradeClick}
                  className="text-sm font-semibold text-orange-600 hover:text-orange-700 underline"
                >
                  Upgrade Plan →
                </button>
              )}
            </div>
            <button
              onClick={() => setShowAlert(false)}
              className="text-orange-400 hover:text-orange-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Usage Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Events Usage */}
        <ModernCard variant="glass">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-700">Events This Month</h3>
            <ModernBadge
              variant={eventsPercentage >= 100 ? "error" : eventsPercentage >= 80 ? "warning" : "info"}
              size="sm"
            >
              {eventsPercentage.toFixed(0)}%
            </ModernBadge>
          </div>

          <div className="mb-3">
            <div className="flex items-baseline gap-2">
              <span className={`text-2xl font-bold ${getUsageColor(eventsPercentage)}`}>
                {formatNumber(usage.trackedEvents)}
              </span>
              <span className="text-sm text-gray-500">
                / {formatNumber(limits.monthlyEventLimit)}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${getProgressColor(eventsPercentage)}`}
              style={{ width: `${Math.min(eventsPercentage, 100)}%` }}
            />
          </div>

          {overages.eventsOverage > 0 && (
            <div className="mt-2 text-xs text-red-600">
              Overage: {formatNumber(overages.eventsOverage)} events (${(overages.eventsOverageCents / 100).toFixed(2)})
            </div>
          )}
        </ModernCard>

        {/* Connectors Usage */}
        <ModernCard variant="glass">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-700">Connected Platforms</h3>
            <ModernBadge
              variant={
                connectorsPercentage >= 100
                  ? "error"
                  : connectorsPercentage >= 80
                  ? "warning"
                  : "info"
              }
              size="sm"
            >
              {limits.maxConnectors === -1 ? "∞" : `${connectorsPercentage.toFixed(0)}%`}
            </ModernBadge>
          </div>

          <div className="mb-3">
            <div className="flex items-baseline gap-2">
              <span className={`text-2xl font-bold ${getUsageColor(connectorsPercentage)}`}>
                {usage.connectedAccounts}
              </span>
              <span className="text-sm text-gray-500">
                / {limits.maxConnectors === -1 ? "Unlimited" : limits.maxConnectors}
              </span>
            </div>
          </div>

          {limits.maxConnectors !== -1 && (
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${getProgressColor(connectorsPercentage)}`}
                style={{ width: `${Math.min(connectorsPercentage, 100)}%` }}
              />
            </div>
          )}

          {overages.connectorsOverage > 0 && (
            <div className="mt-2 text-xs text-red-600">
              Overage: {overages.connectorsOverage} connectors ($
              {(overages.connectorsOverageCents / 100).toFixed(2)})
            </div>
          )}
        </ModernCard>

        {/* Workspaces Usage */}
        <ModernCard variant="glass">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-700">Workspaces</h3>
            <ModernBadge
              variant={
                workspacesPercentage >= 100
                  ? "error"
                  : workspacesPercentage >= 80
                  ? "warning"
                  : "info"
              }
              size="sm"
            >
              {limits.maxWorkspaces === -1 ? "∞" : `${workspacesPercentage.toFixed(0)}%`}
            </ModernBadge>
          </div>

          <div className="mb-3">
            <div className="flex items-baseline gap-2">
              <span className={`text-2xl font-bold ${getUsageColor(workspacesPercentage)}`}>
                {usage.workspacesUsed}
              </span>
              <span className="text-sm text-gray-500">
                / {limits.maxWorkspaces === -1 ? "Unlimited" : limits.maxWorkspaces}
              </span>
            </div>
          </div>

          {limits.maxWorkspaces !== -1 && (
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${getProgressColor(workspacesPercentage)}`}
                style={{ width: `${Math.min(workspacesPercentage, 100)}%` }}
              />
            </div>
          )}
        </ModernCard>
      </div>

      {/* Overage Summary */}
      {hasOverages && (
        <ModernCard variant="glass" className="bg-red-50 border-red-200">
          <div className="flex items-start gap-3">
            <svg
              className="w-6 h-6 text-red-600 mt-0.5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div className="flex-1">
              <h3 className="font-semibold text-red-900 mb-1">Overage Charges This Period</h3>
              <p className="text-sm text-red-800 mb-2">
                You've exceeded your plan limits. Additional charges will apply.
              </p>
              <div className="text-2xl font-bold text-red-900">
                ${(overages.totalOverageCents / 100).toFixed(2)}
              </div>
              <p className="text-xs text-red-700 mt-1">
                Will be added to your next invoice
              </p>
            </div>
          </div>
        </ModernCard>
      )}

      {/* Billing Period */}
      <div className="text-center text-sm text-gray-500">
        Current billing period: {new Date(usage.periodStart).toLocaleDateString()} -{" "}
        {new Date(usage.periodEnd).toLocaleDateString()}
      </div>
    </div>
  );
}
