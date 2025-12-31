/**
 * Dashboard Page
 * 
 * Main analytics dashboard with KPIs, charts, and tables
 */

import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import type { Metadata } from "next";
import { authOptions } from "@/lib/auth";
import { AdvancedDashboardClient } from "./advanced-dashboard-client";

export const metadata: Metadata = {
  title: "Advanced Dashboard - Optiq",
  description: "Real-time marketing performance analytics with comparison, drill-down, and advanced visualizations",
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  if (!session.user.activeOrgId) {
    redirect("/onboarding");
  }

  return <AdvancedDashboardClient />;
}
