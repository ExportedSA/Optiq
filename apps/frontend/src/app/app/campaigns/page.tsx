import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";
import { getCampaignPerformance } from "@/lib/campaigns";
import { CampaignsPageClient } from "./client";

export default async function CampaignsPage() {
  const session = await getServerSession(authOptions);
  const orgId = session?.user?.activeOrgId;

  if (!orgId) {
    redirect("/app");
  }

  const endDate = new Date();
  endDate.setHours(23, 59, 59, 999);
  const startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - 30);
  startDate.setHours(0, 0, 0, 0);

  const result = await getCampaignPerformance({
    filters: {
      organizationId: orgId,
      dateRange: { start: startDate, end: endDate },
    },
    sort: { field: "spend", direction: "desc" },
  });

  return (
    <CampaignsPageClient
      initialData={result.campaigns}
      platforms={result.platforms}
      total={result.total}
    />
  );
}
