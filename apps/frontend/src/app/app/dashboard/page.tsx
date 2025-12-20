/**
 * Dashboard Page
 * 
 * Main analytics dashboard with KPIs, charts, and tables
 */

import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { DashboardClient } from "./dashboard-client";

export const metadata = {
  title: "Dashboard - Optiq",
  description: "View your marketing performance metrics",
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  if (!session.user.activeOrgId) {
    redirect("/onboarding");
  }

  return <DashboardClient />;
}
