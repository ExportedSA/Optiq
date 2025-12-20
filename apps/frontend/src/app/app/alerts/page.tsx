/**
 * Alerts Inbox Page
 * 
 * View and manage alert events
 */

import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AlertsInbox } from "./alerts-inbox";

export const metadata = {
  title: "Alerts - Optiq",
  description: "View and manage your alerts",
};

export default async function AlertsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  if (!session.user.activeOrgId) {
    redirect("/onboarding");
  }

  return <AlertsInbox />;
}
