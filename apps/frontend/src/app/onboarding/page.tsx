/**
 * Onboarding Page
 * 
 * Multi-step onboarding flow:
 * 1. Create organization
 * 2. Create tracking site + install snippet
 * 3. Connect Meta/Google
 * 4. Set CPA/ROAS targets
 * 5. First insights screen
 */

import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { OnboardingFlow } from "./onboarding-flow";

export const metadata = {
  title: "Get Started - Optiq",
  description: "Set up your Optiq account in minutes",
};

export default async function OnboardingPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  // Check if user has completed onboarding
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      email: true,
      name: true,
      activeOrgId: true,
    },
  });

  if (!user) {
    redirect("/auth/signin");
  }

  // Get user's organizations
  const memberships = await prisma.membership.findMany({
    where: { userId: user.id },
    include: {
      organization: {
        include: {
          trackingSites: true,
          integrationConnections: {
            where: { status: "CONNECTED" },
          },
          settings: true,
        },
      },
    },
  });

  // Determine current step
  let currentStep = 1;
  let organizationId: string | null = null;

  if (memberships.length > 0) {
    const org = memberships[0].organization;
    organizationId = org.id;
    currentStep = 2;

    if (org.trackingSites.length > 0) {
      currentStep = 3;
    }

    if (org.integrationConnections.length > 0) {
      currentStep = 4;
    }

    if (org.settings?.trackingSettings) {
      const settings = org.settings.trackingSettings as any;
      if (settings?.targetCpa || settings?.targetRoas) {
        currentStep = 5;
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <OnboardingFlow
        userId={user.id}
        userEmail={user.email || ""}
        userName={user.name || ""}
        initialStep={currentStep}
        organizationId={organizationId}
      />
    </div>
  );
}
