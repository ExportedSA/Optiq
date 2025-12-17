import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";
import { getAlertSettings } from "@/lib/settings";
import { AlertSettingsPageClient } from "./client";

export default async function AlertSettingsPage() {
  const session = await getServerSession(authOptions);
  const orgId = session?.user?.activeOrgId;

  if (!orgId) {
    redirect("/app");
  }

  const settings = await getAlertSettings(orgId);

  return <AlertSettingsPageClient initialSettings={settings} />;
}
