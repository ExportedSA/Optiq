"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";

type OnboardingStep = "workspace" | "connect-ads" | "install-tracker" | "set-targets" | "first-insights";

interface OnboardingState {
  currentStep: OnboardingStep;
  workspaceCreated: boolean;
  adsConnected: boolean;
  trackerInstalled: boolean;
  targetsSet: boolean;
}

interface ConnectionStatus {
  google: boolean;
  meta: boolean;
  tiktok: boolean;
}

interface TrackerInfo {
  siteKey: string;
  snippet: string;
}

const STEPS: { key: OnboardingStep; title: string; description: string }[] = [
  {
    key: "workspace",
    title: "Create Workspace",
    description: "Set up your organization and workspace",
  },
  {
    key: "connect-ads",
    title: "Connect Ad Accounts",
    description: "Link your Google, Meta, or TikTok ad accounts",
  },
  {
    key: "install-tracker",
    title: "Install Tracker",
    description: "Add the Optiq tracking script to your website",
  },
  {
    key: "set-targets",
    title: "Set Targets",
    description: "Define your CPA and ROAS goals",
  },
  {
    key: "first-insights",
    title: "First Insights",
    description: "See your initial attribution data",
  },
];

function getStepIndex(step: OnboardingStep): number {
  return STEPS.findIndex((s) => s.key === step);
}

export function OnboardingClient() {
  const router = useRouter();
  const [state, setState] = useState<OnboardingState>({
    currentStep: "workspace",
    workspaceCreated: false,
    adsConnected: false,
    trackerInstalled: false,
    targetsSet: false,
  });

  const [loading, setLoading] = useState(true);
  const [connections, setConnections] = useState<ConnectionStatus>({
    google: false,
    meta: false,
    tiktok: false,
  });
  const [trackerInfo, setTrackerInfo] = useState<TrackerInfo | null>(null);
  const [targets, setTargets] = useState({ targetCpa: 50, targetRoas: 3 });
  const [saving, setSaving] = useState(false);

  // Load onboarding state
  const loadState = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/onboarding/status");
      if (res.ok) {
        const data = await res.json();
        setState(data.state);
        setConnections(data.connections || { google: false, meta: false, tiktok: false });
        if (data.trackerInfo) {
          setTrackerInfo(data.trackerInfo);
        }
        if (data.targets) {
          setTargets(data.targets);
        }
      }
    } catch {
      // Use defaults
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadState();
  }, [loadState]);

  const goToStep = (step: OnboardingStep) => {
    setState((s) => ({ ...s, currentStep: step }));
  };

  const completeWorkspace = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/onboarding/complete-step", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ step: "workspace" }),
      });
      if (res.ok) {
        setState((s) => ({ ...s, workspaceCreated: true, currentStep: "connect-ads" }));
      }
    } finally {
      setSaving(false);
    }
  };

  const connectAds = async (platform: "google" | "meta" | "tiktok") => {
    // Redirect to OAuth flow
    window.location.href = `/api/integrations/${platform}/connect?returnTo=/app/onboarding`;
  };

  const skipAdsConnection = () => {
    setState((s) => ({ ...s, currentStep: "install-tracker" }));
  };

  const markAdsConnected = async () => {
    setSaving(true);
    try {
      await fetch("/api/onboarding/complete-step", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ step: "connect-ads" }),
      });
      setState((s) => ({ ...s, adsConnected: true, currentStep: "install-tracker" }));
    } finally {
      setSaving(false);
    }
  };

  const generateTracker = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/onboarding/generate-tracker", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setTrackerInfo(data);
      }
    } finally {
      setSaving(false);
    }
  };

  const verifyTracker = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/onboarding/verify-tracker", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        if (data.verified) {
          setState((s) => ({ ...s, trackerInstalled: true, currentStep: "set-targets" }));
        } else {
          alert("Tracker not detected yet. Please ensure the script is installed and try again.");
        }
      }
    } finally {
      setSaving(false);
    }
  };

  const skipTrackerInstall = () => {
    setState((s) => ({ ...s, currentStep: "set-targets" }));
  };

  const saveTargets = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/onboarding/set-targets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(targets),
      });
      if (res.ok) {
        setState((s) => ({ ...s, targetsSet: true, currentStep: "first-insights" }));
      }
    } finally {
      setSaving(false);
    }
  };

  const finishOnboarding = () => {
    router.push("/app/roi");
  };

  const currentStepIndex = getStepIndex(state.currentStep);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-zinc-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8 py-8">
      <div className="text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
          Welcome to Optiq
        </h1>
        <p className="mt-2 text-zinc-600">
          Let&apos;s get you set up in just a few minutes
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-2">
        {STEPS.map((step, index) => {
          const isComplete =
            (step.key === "workspace" && state.workspaceCreated) ||
            (step.key === "connect-ads" && state.adsConnected) ||
            (step.key === "install-tracker" && state.trackerInstalled) ||
            (step.key === "set-targets" && state.targetsSet) ||
            (step.key === "first-insights" && false);

          const isCurrent = step.key === state.currentStep;

          return (
            <div key={step.key} className="flex items-center">
              <button
                onClick={() => goToStep(step.key)}
                className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                  isComplete
                    ? "bg-green-500 text-white"
                    : isCurrent
                    ? "bg-zinc-900 text-white"
                    : "bg-zinc-200 text-zinc-600"
                }`}
              >
                {isComplete ? "✓" : index + 1}
              </button>
              {index < STEPS.length - 1 && (
                <div
                  className={`mx-2 h-0.5 w-8 ${
                    index < currentStepIndex ? "bg-green-500" : "bg-zinc-200"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Step Content */}
      <div className="rounded-xl border border-zinc-200 bg-white p-8">
        {state.currentStep === "workspace" && (
          <WorkspaceStep
            completed={state.workspaceCreated}
            onComplete={completeWorkspace}
            saving={saving}
          />
        )}

        {state.currentStep === "connect-ads" && (
          <ConnectAdsStep
            connections={connections}
            onConnect={connectAds}
            onSkip={skipAdsConnection}
            onContinue={markAdsConnected}
            saving={saving}
          />
        )}

        {state.currentStep === "install-tracker" && (
          <InstallTrackerStep
            trackerInfo={trackerInfo}
            onGenerate={generateTracker}
            onVerify={verifyTracker}
            onSkip={skipTrackerInstall}
            saving={saving}
          />
        )}

        {state.currentStep === "set-targets" && (
          <SetTargetsStep
            targets={targets}
            onTargetsChange={setTargets}
            onSave={saveTargets}
            saving={saving}
          />
        )}

        {state.currentStep === "first-insights" && (
          <FirstInsightsStep onFinish={finishOnboarding} />
        )}
      </div>
    </div>
  );
}

function WorkspaceStep({
  completed,
  onComplete,
  saving,
}: {
  completed: boolean;
  onComplete: () => void;
  saving: boolean;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-zinc-900">Create Your Workspace</h2>
        <p className="mt-1 text-zinc-600">
          Your workspace is already set up! Click continue to proceed.
        </p>
      </div>

      <div className="rounded-lg border border-green-200 bg-green-50 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-white">
            ✓
          </div>
          <div>
            <div className="font-medium text-green-900">Workspace Ready</div>
            <div className="text-sm text-green-700">
              Your organization and workspace have been created
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={onComplete}
        disabled={saving}
        className="w-full rounded-lg bg-zinc-900 px-4 py-3 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50"
      >
        {saving ? "Saving..." : "Continue"}
      </button>
    </div>
  );
}

function ConnectAdsStep({
  connections,
  onConnect,
  onSkip,
  onContinue,
  saving,
}: {
  connections: ConnectionStatus;
  onConnect: (platform: "google" | "meta" | "tiktok") => void;
  onSkip: () => void;
  onContinue: () => void;
  saving: boolean;
}) {
  const hasAnyConnection = connections.google || connections.meta || connections.tiktok;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-zinc-900">Connect Your Ad Accounts</h2>
        <p className="mt-1 text-zinc-600">
          Link your advertising platforms to start tracking spend and attribution
        </p>
      </div>

      <div className="space-y-3">
        <AdPlatformCard
          name="Google Ads"
          icon="G"
          connected={connections.google}
          onConnect={() => onConnect("google")}
        />
        <AdPlatformCard
          name="Meta Ads"
          icon="M"
          connected={connections.meta}
          onConnect={() => onConnect("meta")}
        />
        <AdPlatformCard
          name="TikTok Ads"
          icon="T"
          connected={connections.tiktok}
          onConnect={() => onConnect("tiktok")}
        />
      </div>

      <div className="flex gap-3">
        <button
          onClick={onSkip}
          className="flex-1 rounded-lg border border-zinc-200 px-4 py-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
        >
          Skip for now
        </button>
        <button
          onClick={onContinue}
          disabled={saving || !hasAnyConnection}
          className="flex-1 rounded-lg bg-zinc-900 px-4 py-3 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Continue"}
        </button>
      </div>
    </div>
  );
}

function AdPlatformCard({
  name,
  icon,
  connected,
  onConnect,
}: {
  name: string;
  icon: string;
  connected: boolean;
  onConnect: () => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-zinc-200 p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 text-lg font-bold text-zinc-700">
          {icon}
        </div>
        <div>
          <div className="font-medium text-zinc-900">{name}</div>
          <div className="text-sm text-zinc-500">
            {connected ? "Connected" : "Not connected"}
          </div>
        </div>
      </div>
      {connected ? (
        <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
          ✓ Connected
        </span>
      ) : (
        <button
          onClick={onConnect}
          className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
        >
          Connect
        </button>
      )}
    </div>
  );
}

function InstallTrackerStep({
  trackerInfo,
  onGenerate,
  onVerify,
  onSkip,
  saving,
}: {
  trackerInfo: TrackerInfo | null;
  onGenerate: () => void;
  onVerify: () => void;
  onSkip: () => void;
  saving: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const copySnippet = () => {
    if (trackerInfo) {
      navigator.clipboard.writeText(trackerInfo.snippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-zinc-900">Install Tracking Script</h2>
        <p className="mt-1 text-zinc-600">
          Add this script to your website to track visitor journeys and conversions
        </p>
      </div>

      {!trackerInfo ? (
        <div className="space-y-4">
          <p className="text-sm text-zinc-600">
            Generate your unique tracking script to get started.
          </p>
          <button
            onClick={onGenerate}
            disabled={saving}
            className="rounded-lg bg-zinc-900 px-4 py-3 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50"
          >
            {saving ? "Generating..." : "Generate Tracking Script"}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700">Your Site Key</label>
            <div className="mt-1 rounded-lg bg-zinc-100 px-4 py-2 font-mono text-sm text-zinc-900">
              {trackerInfo.siteKey}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700">
              Copy this snippet into your website&apos;s &lt;head&gt; tag
            </label>
            <div className="relative mt-1">
              <pre className="overflow-x-auto rounded-lg bg-zinc-900 p-4 text-sm text-zinc-100">
                {trackerInfo.snippet}
              </pre>
              <button
                onClick={copySnippet}
                className="absolute right-2 top-2 rounded bg-zinc-700 px-3 py-1 text-xs text-white hover:bg-zinc-600"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>

          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
            <div className="text-sm text-blue-800">
              <strong>What this script does:</strong>
              <ul className="mt-2 list-inside list-disc space-y-1">
                <li>Assigns a first-party visitor ID cookie</li>
                <li>Captures UTM parameters and referrer</li>
                <li>Tracks page views and conversions</li>
                <li>Enables multi-touch attribution</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={onSkip}
          className="flex-1 rounded-lg border border-zinc-200 px-4 py-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
        >
          Skip for now
        </button>
        <button
          onClick={onVerify}
          disabled={saving || !trackerInfo}
          className="flex-1 rounded-lg bg-zinc-900 px-4 py-3 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50"
        >
          {saving ? "Verifying..." : "Verify Installation"}
        </button>
      </div>
    </div>
  );
}

function SetTargetsStep({
  targets,
  onTargetsChange,
  onSave,
  saving,
}: {
  targets: { targetCpa: number; targetRoas: number };
  onTargetsChange: (targets: { targetCpa: number; targetRoas: number }) => void;
  onSave: () => void;
  saving: boolean;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-zinc-900">Set Your Performance Targets</h2>
        <p className="mt-1 text-zinc-600">
          Define your CPA and ROAS goals to enable waste detection alerts
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-zinc-700">Target CPA</label>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-zinc-500">$</span>
            <input
              type="number"
              min="0"
              step="1"
              value={targets.targetCpa}
              onChange={(e) =>
                onTargetsChange({ ...targets, targetCpa: parseFloat(e.target.value) || 0 })
              }
              className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-400"
            />
          </div>
          <p className="mt-1 text-xs text-zinc-500">
            Your target cost per acquisition
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700">Target ROAS</label>
          <div className="mt-1 flex items-center gap-2">
            <input
              type="number"
              min="0"
              step="0.1"
              value={targets.targetRoas}
              onChange={(e) =>
                onTargetsChange({ ...targets, targetRoas: parseFloat(e.target.value) || 0 })
              }
              className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-400"
            />
            <span className="text-zinc-500">x</span>
          </div>
          <p className="mt-1 text-xs text-zinc-500">
            Your target return on ad spend
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
        <div className="text-sm text-amber-800">
          <strong>How targets work:</strong>
          <p className="mt-1">
            Optiq will alert you when campaigns exceed your CPA target or fall below your ROAS
            target. You can adjust these anytime in Settings.
          </p>
        </div>
      </div>

      <button
        onClick={onSave}
        disabled={saving}
        className="w-full rounded-lg bg-zinc-900 px-4 py-3 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save & Continue"}
      </button>
    </div>
  );
}

function FirstInsightsStep({ onFinish }: { onFinish: () => void }) {
  return (
    <div className="space-y-6 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
        <span className="text-3xl">🎉</span>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-zinc-900">You&apos;re All Set!</h2>
        <p className="mt-1 text-zinc-600">
          Optiq is now tracking your ad performance and building attribution data.
        </p>
      </div>

      <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-6 text-left">
        <h3 className="font-medium text-zinc-900">What happens next:</h3>
        <ul className="mt-3 space-y-2 text-sm text-zinc-600">
          <li className="flex items-start gap-2">
            <span className="text-green-500">✓</span>
            <span>Cost data syncs from your connected ad accounts (usually within 1 hour)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500">✓</span>
            <span>Visitor journeys are built as users interact with your site</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500">✓</span>
            <span>Attribution is calculated for each conversion</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500">✓</span>
            <span>Waste detection alerts you to underperforming spend</span>
          </li>
        </ul>
      </div>

      <button
        onClick={onFinish}
        className="w-full rounded-lg bg-zinc-900 px-4 py-3 text-sm font-medium text-white hover:bg-zinc-800"
      >
        Go to Dashboard
      </button>
    </div>
  );
}
