"use client";

import { useState, useEffect } from "react";

// Inline SVG icons to avoid external dependencies
function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );
}

function ZapIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  );
}

function LinkIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
  );
}

function CodeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  );
}

function TargetIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" strokeWidth={2} />
      <circle cx="12" cy="12" r="6" strokeWidth={2} />
      <circle cx="12" cy="12" r="2" strokeWidth={2} />
    </svg>
  );
}

function ChartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );
}

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  href: string;
  icon: React.ReactNode;
}

interface OnboardingChecklistProps {
  onComplete?: () => void;
  className?: string;
}

export function OnboardingChecklist({ onComplete, className = "" }: OnboardingChecklistProps) {
  const [steps, setSteps] = useState<OnboardingStep[]>([]);
  const [loading, setLoading] = useState(true);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    loadOnboardingStatus();
  }, []);

  async function loadOnboardingStatus() {
    try {
      const res = await fetch("/api/onboarding/status");
      if (res.ok) {
        const data = await res.json();
        const state = data.state || {};
        const connections = data.connections || {};

        setSteps([
          {
            id: "workspace",
            title: "Create Workspace",
            description: "Set up your organization",
            completed: state.workspaceCreated ?? true, // Assume done if they're logged in
            href: "/app/settings",
            icon: <ZapIcon className="h-5 w-5" />,
          },
          {
            id: "connect-ads",
            title: "Connect Ad Accounts",
            description: "Link Google, Meta, or TikTok",
            completed: connections.google || connections.meta || connections.tiktok,
            href: "/app/onboarding?step=connect-ads",
            icon: <LinkIcon className="h-5 w-5" />,
          },
          {
            id: "install-tracker",
            title: "Install Tracking Snippet",
            description: "Add Optiq to your website",
            completed: state.trackerInstalled ?? false,
            href: "/app/onboarding?step=install-tracker",
            icon: <CodeIcon className="h-5 w-5" />,
          },
          {
            id: "set-targets",
            title: "Set Performance Targets",
            description: "Define CPA and ROAS goals",
            completed: state.targetsSet ?? false,
            href: "/app/onboarding?step=set-targets",
            icon: <TargetIcon className="h-5 w-5" />,
          },
          {
            id: "first-insights",
            title: "See First Insights",
            description: "View your attribution data",
            completed: data.hasInsights ?? false,
            href: "/app/analytics",
            icon: <ChartIcon className="h-5 w-5" />,
          },
        ]);

        // Check if all steps are complete
        const allComplete = 
          (state.workspaceCreated ?? true) &&
          (connections.google || connections.meta || connections.tiktok) &&
          (state.trackerInstalled ?? false) &&
          (state.targetsSet ?? false) &&
          (data.hasInsights ?? false);

        if (allComplete && onComplete) {
          onComplete();
        }
      }
    } catch (error) {
      console.error("Failed to load onboarding status:", error);
    } finally {
      setLoading(false);
    }
  }

  const completedCount = steps.filter((s) => s.completed).length;
  const progress = steps.length > 0 ? (completedCount / steps.length) * 100 : 0;
  const allComplete = completedCount === steps.length;

  if (dismissed || allComplete) {
    return null;
  }

  if (loading) {
    return (
      <div className={`rounded-xl border border-zinc-200 bg-white p-6 ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-4 w-48 rounded bg-zinc-200" />
          <div className="h-2 w-full rounded bg-zinc-100" />
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 rounded bg-zinc-100" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-xl border border-zinc-200 bg-white p-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900">Get Started with Optiq</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Complete these steps to start seeing insights in under 10 minutes
          </p>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-sm text-zinc-400 hover:text-zinc-600"
        >
          Dismiss
        </button>
      </div>

      {/* Progress bar */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-zinc-700">
            {completedCount} of {steps.length} complete
          </span>
          <span className="text-zinc-500">{Math.round(progress)}%</span>
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-zinc-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="mt-6 space-y-2">
        {steps.map((step, index) => (
          <a
            key={step.id}
            href={step.href}
            className={`flex items-center gap-4 rounded-lg border p-4 transition-all ${
              step.completed
                ? "border-green-200 bg-green-50"
                : "border-zinc-200 bg-white hover:border-blue-200 hover:bg-blue-50"
            }`}
          >
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full ${
                step.completed
                  ? "bg-green-100 text-green-600"
                  : "bg-zinc-100 text-zinc-500"
              }`}
            >
              {step.completed ? (
                <CheckCircleIcon className="h-5 w-5" />
              ) : (
                step.icon
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span
                  className={`font-medium ${
                    step.completed ? "text-green-700" : "text-zinc-900"
                  }`}
                >
                  {step.title}
                </span>
                {step.completed && (
                  <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                    Done
                  </span>
                )}
              </div>
              <p className="text-sm text-zinc-500">{step.description}</p>
            </div>
            {!step.completed && (
              <ChevronRightIcon className="h-5 w-5 text-zinc-400" />
            )}
          </a>
        ))}
      </div>

      {/* Quick tip */}
      <div className="mt-6 rounded-lg bg-blue-50 p-4">
        <p className="text-sm text-blue-800">
          <strong>Tip:</strong> Connect at least one ad platform and install the tracking snippet to start seeing attribution insights immediately.
        </p>
      </div>
    </div>
  );
}
