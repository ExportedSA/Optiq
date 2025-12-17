import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";
import { getSpendConversionTimeSeries, getDateRangeFromPreset } from "@/lib/analytics";
import { AnalyticsPageClient } from "./client";

export default async function AnalyticsPage() {
  const session = await getServerSession(authOptions);
  const orgId = session?.user?.activeOrgId;

  if (!orgId) {
    redirect("/app");
  }

  const { start, end } = getDateRangeFromPreset("30d");

  const chartData = await getSpendConversionTimeSeries({
    organizationId: orgId,
    startDate: start,
    endDate: end,
  });

  return (
    <AnalyticsPageClient
      initialData={chartData}
      initialDateRange={{ start: start.toISOString(), end: end.toISOString() }}
    />
  );
}
