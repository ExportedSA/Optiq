"use client";

/**
 * Onboarding Flow Component
 * 
 * Client-side multi-step onboarding
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { StepOrganization } from "./steps/step-organization";
import { StepTrackingSite } from "./steps/step-tracking-site";
import { StepConnections } from "./steps/step-connections";
import { StepTargets } from "./steps/step-targets";
import { StepInsights } from "./steps/step-insights";

interface OnboardingFlowProps {
  userId: string;
  userEmail: string;
  userName: string;
  initialStep: number;
  organizationId: string | null;
}

const STEPS = [
  { id: 1, title: "Create Organization", description: "Set up your workspace" },
  { id: 2, title: "Install Tracking", description: "Add tracking to your site" },
  { id: 3, title: "Connect Platforms", description: "Link your ad accounts" },
  { id: 4, title: "Set Targets", description: "Define your goals" },
  { id: 5, title: "First Insights", description: "View your data" },
];

export function OnboardingFlow({
  userId,
  userEmail,
  userName,
  initialStep,
  organizationId: initialOrgId,
}: OnboardingFlowProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [organizationId, setOrganizationId] = useState<string | null>(initialOrgId);
  const [trackingSiteId, setTrackingSiteId] = useState<string | null>(null);

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding
      router.push("/app");
    }
  };

  const handleSkip = () => {
    router.push("/app");
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar - Progress */}
      <div className="w-80 bg-white border-r border-gray-200 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Optiq</h1>
          <p className="text-sm text-gray-600 mt-1">Get started in minutes</p>
        </div>

        <nav className="space-y-4">
          {STEPS.map((step) => (
            <div
              key={step.id}
              className={`flex items-start ${
                step.id === currentStep
                  ? "text-blue-600"
                  : step.id < currentStep
                  ? "text-green-600"
                  : "text-gray-400"
              }`}
            >
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step.id === currentStep
                    ? "bg-blue-100 text-blue-600"
                    : step.id < currentStep
                    ? "bg-green-100 text-green-600"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {step.id < currentStep ? "✓" : step.id}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{step.title}</p>
                <p className="text-xs text-gray-500">{step.description}</p>
              </div>
            </div>
          ))}
        </nav>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Signed in as<br />
            <span className="font-medium text-gray-700">{userEmail}</span>
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-2xl">
          {currentStep === 1 && (
            <StepOrganization
              userId={userId}
              userName={userName}
              onComplete={(orgId) => {
                setOrganizationId(orgId);
                handleNext();
              }}
              onSkip={handleSkip}
            />
          )}

          {currentStep === 2 && organizationId && (
            <StepTrackingSite
              organizationId={organizationId}
              onComplete={(siteId) => {
                setTrackingSiteId(siteId);
                handleNext();
              }}
              onSkip={handleSkip}
            />
          )}

          {currentStep === 3 && organizationId && (
            <StepConnections
              organizationId={organizationId}
              onComplete={handleNext}
              onSkip={handleSkip}
            />
          )}

          {currentStep === 4 && organizationId && (
            <StepTargets
              organizationId={organizationId}
              onComplete={handleNext}
              onSkip={handleSkip}
            />
          )}

          {currentStep === 5 && organizationId && (
            <StepInsights
              organizationId={organizationId}
              onComplete={() => router.push("/app")}
            />
          )}
        </div>
      </div>
    </div>
  );
}
