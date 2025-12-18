"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type PlanDto = {
  tier: string;
  name: string;
  description: string;
  features: string[];
  recommended: boolean;
  pricing: {
    monthly: number;
    annual: number;
    annualMonthly: number;
  };
  limits: {
    workspaces: number | string;
    connectors: number | string;
    events: string;
    retention: string;
    attributionModels: string[];
    alerts: boolean;
    sso: boolean;
    prioritySupport: boolean;
  };
  overages: {
    eventsPer10k: number;
    connector: number;
  };
};

type UsageDto = {
  plan: string;
  periodStart: string;
  periodEnd: string;
  usage: {
    trackedEvents: number;
    connectedAccounts: number;
    workspacesUsed: number;
  };
  limits: {
    maxWorkspaces: number;
    maxConnectors: number;
    monthlyEventLimit: number;
    dataRetentionDays: number;
  };
  overages: {
    eventsOverage: number;
    connectorsOverage: number;
    eventsOverageCents: number;
    connectorsOverageCents: number;
    totalOverageCents: number;
  };
};

function formatCurrency(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

function formatNumber(n: number): string {
  return new Intl.NumberFormat("en-US").format(n);
}

export function BillingClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [plans, setPlans] = useState<PlanDto[]>([]);
  const [usage, setUsage] = useState<UsageDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [plansRes, usageRes] = await Promise.all([
        fetch("/api/billing/plans"),
        fetch("/api/billing/usage"),
      ]);

      if (plansRes.ok) {
        const data = await plansRes.json();
        setPlans(data.plans ?? []);
      }

      if (usageRes.ok) {
        const data = await usageRes.json();
        setUsage(data);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (searchParams?.get("success") === "true") {
      setSuccessMessage("Your subscription has been updated successfully!");
      router.replace("/app/settings/billing");
      void load();
    }
    if (searchParams?.get("canceled") === "true") {
      router.replace("/app/settings/billing");
    }
  }, [searchParams, router, load]);

  const handleUpgrade = async (tier: string) => {
    setUpgrading(tier);
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier, interval: billingCycle }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.checkoutUrl) {
          window.location.href = data.checkoutUrl;
        }
      } else {
        const error = await res.json();
        alert(error.error || "Failed to start checkout");
      }
    } finally {
      setUpgrading(null);
    }
  };

  const handleManageSubscription = async () => {
    try {
      const res = await fetch("/api/billing/portal", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        if (data.portalUrl) {
          window.location.href = data.portalUrl;
        }
      }
    } catch {
      alert("Failed to open billing portal");
    }
  };

  const currentPlan = plans.find((p) => p.tier === usage?.plan) ?? plans[0];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Billing & Plans</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Manage your subscription and view usage
        </p>
      </div>

      {usage && (
        <section className="rounded-xl border border-zinc-200 bg-white p-6">
          <h2 className="text-lg font-medium text-zinc-900">Current Usage</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Billing period: {new Date(usage.periodStart).toLocaleDateString()} – {new Date(usage.periodEnd).toLocaleDateString()}
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <UsageMeter
              label="Tracked Events"
              current={usage.usage.trackedEvents}
              limit={usage.limits.monthlyEventLimit}
            />
            <UsageMeter
              label="Connected Accounts"
              current={usage.usage.connectedAccounts}
              limit={usage.limits.maxConnectors}
            />
            <UsageMeter
              label="Workspaces"
              current={usage.usage.workspacesUsed}
              limit={usage.limits.maxWorkspaces}
            />
          </div>

          {usage.overages.totalOverageCents > 0 && (
            <div className="mt-4 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
              <div className="text-sm font-medium text-yellow-800">
                Estimated overage charges this period
              </div>
              <div className="mt-1 text-lg font-semibold text-yellow-900">
                {formatCurrency(usage.overages.totalOverageCents)}
              </div>
              <div className="mt-1 text-xs text-yellow-700">
                {usage.overages.eventsOverage > 0 && (
                  <span>{formatNumber(usage.overages.eventsOverage)} events over limit • </span>
                )}
                {usage.overages.connectorsOverage > 0 && (
                  <span>{usage.overages.connectorsOverage} connectors over limit</span>
                )}
              </div>
            </div>
          )}
        </section>
      )}

      <section>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-medium text-zinc-900">Plans</h2>
          <div className="flex rounded-lg border border-zinc-200 bg-zinc-50 p-1">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${
                billingCycle === "monthly"
                  ? "bg-white text-zinc-900 shadow-sm"
                  : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("annual")}
              className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${
                billingCycle === "annual"
                  ? "bg-white text-zinc-900 shadow-sm"
                  : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              Annual <span className="text-green-600">Save 20%</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-[400px] animate-pulse rounded-xl bg-zinc-100" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {plans.map((plan) => {
              const isCurrent = plan.tier === usage?.plan;
              const price = billingCycle === "monthly" ? plan.pricing.monthly : plan.pricing.annualMonthly;

              return (
                <div
                  key={plan.tier}
                  className={`relative flex flex-col rounded-xl border p-6 ${
                    plan.recommended
                      ? "border-blue-500 ring-2 ring-blue-500"
                      : "border-zinc-200"
                  } ${isCurrent ? "bg-zinc-50" : "bg-white"}`}
                >
                  {plan.recommended && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-500 px-3 py-1 text-xs font-medium text-white">
                      Recommended
                    </div>
                  )}

                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-zinc-900">{plan.name}</h3>
                    <p className="mt-1 text-sm text-zinc-500">{plan.description}</p>
                  </div>

                  <div className="mb-6">
                    <span className="text-3xl font-bold text-zinc-900">
                      ${price.toFixed(0)}
                    </span>
                    <span className="text-zinc-500">/mo</span>
                    {billingCycle === "annual" && plan.pricing.monthly > 0 && (
                      <div className="mt-1 text-xs text-zinc-500">
                        Billed annually (${plan.pricing.annual.toFixed(0)}/yr)
                      </div>
                    )}
                  </div>

                  <ul className="mb-6 flex-1 space-y-2">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-zinc-600">
                        <span className="text-green-500">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {plan.overages.eventsPer10k > 0 && (
                    <div className="mb-4 rounded-lg bg-zinc-50 p-3 text-xs text-zinc-600">
                      <div>Overages:</div>
                      <div>${plan.overages.eventsPer10k.toFixed(2)} per 10k events</div>
                      <div>${plan.overages.connector.toFixed(2)} per extra connector</div>
                    </div>
                  )}

                  <button
                    disabled={isCurrent || upgrading === plan.tier || plan.tier === "FREE"}
                    onClick={() => handleUpgrade(plan.tier)}
                    className={`w-full rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                      isCurrent
                        ? "cursor-default bg-zinc-100 text-zinc-500"
                        : plan.recommended
                        ? "bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                        : "bg-zinc-900 text-white hover:bg-zinc-800 disabled:opacity-50"
                    }`}
                  >
                    {upgrading === plan.tier
                      ? "Redirecting..."
                      : isCurrent
                      ? "Current Plan"
                      : plan.tier === "FREE"
                      ? "Free"
                      : "Upgrade"}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {usage?.plan && usage.plan !== "FREE" && (
        <section className="rounded-xl border border-zinc-200 bg-white p-6">
          <h2 className="text-lg font-medium text-zinc-900">Manage Subscription</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Update payment method, view invoices, or cancel your subscription
          </p>
          <button
            onClick={handleManageSubscription}
            className="mt-4 rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
          >
            Open Billing Portal
          </button>
        </section>
      )}

      {successMessage && (
        <div className="fixed bottom-4 right-4 rounded-lg border border-green-200 bg-green-50 p-4 shadow-lg">
          <div className="flex items-center gap-2">
            <span className="text-green-600">✓</span>
            <span className="text-sm text-green-800">{successMessage}</span>
            <button
              onClick={() => setSuccessMessage(null)}
              className="ml-2 text-green-600 hover:text-green-800"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <section className="rounded-xl border border-zinc-200 bg-white p-6">
        <h2 className="text-lg font-medium text-zinc-900">Value Metrics</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Your plan is based on tracked events and connected ad accounts
        </p>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-zinc-100 p-4">
            <div className="text-sm font-medium text-zinc-700">Tracked Events</div>
            <div className="mt-1 text-xs text-zinc-500">
              Every page view, conversion, and custom event counts toward your monthly limit.
              Overages are billed per 10,000 events.
            </div>
          </div>
          <div className="rounded-lg border border-zinc-100 p-4">
            <div className="text-sm font-medium text-zinc-700">Connected Ad Accounts</div>
            <div className="mt-1 text-xs text-zinc-500">
              Each connected Google, Meta, TikTok, or LinkedIn ad account counts toward your connector limit.
              Extra connectors can be added for a monthly fee.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function UsageMeter({
  label,
  current,
  limit,
}: {
  label: string;
  current: number;
  limit: number;
}) {
  const isUnlimited = limit === -1;
  const percent = isUnlimited ? 0 : Math.min(100, (current / limit) * 100);
  const isOver = !isUnlimited && current > limit;

  return (
    <div className="rounded-lg border border-zinc-100 p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-zinc-700">{label}</span>
        <span className="text-sm text-zinc-500">
          {formatNumber(current)} / {isUnlimited ? "∞" : formatNumber(limit)}
        </span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-zinc-100">
        <div
          className={`h-full rounded-full transition-all ${
            isOver ? "bg-red-500" : percent > 80 ? "bg-yellow-500" : "bg-green-500"
          }`}
          style={{ width: `${Math.min(100, percent)}%` }}
        />
      </div>
      {isOver && (
        <div className="mt-1 text-xs text-red-600">
          {formatNumber(current - limit)} over limit
        </div>
      )}
    </div>
  );
}
