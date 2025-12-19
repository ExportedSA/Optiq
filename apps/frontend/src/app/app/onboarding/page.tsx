import type { Metadata } from "next";

import { OnboardingClient } from "./client";

export const metadata: Metadata = {
  title: "Get Started | Optiq",
};

export default function OnboardingPage() {
  return <OnboardingClient />;
}
