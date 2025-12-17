import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";

import { authOptions } from "@/lib/auth";
import { getCampaignDetails } from "@/lib/campaigns";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CampaignDetailPage({ params }: PageProps) {
  const session = await getServerSession(authOptions);
  const orgId = session?.user?.activeOrgId;

  if (!orgId) {
    redirect("/app");
  }

  const { id } = await params;

  const endDate = new Date();
  endDate.setHours(23, 59, 59, 999);
  const startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - 30);
  startDate.setHours(0, 0, 0, 0);

  const result = await getCampaignDetails({
    organizationId: orgId,
    campaignId: id,
    dateRange: { start: startDate, end: endDate },
  });

  if (!result.campaign) {
    notFound();
  }

  const { campaign, dailyMetrics, ads } = result;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-zinc-500">
        <Link href="/app/campaigns" className="hover:text-zinc-700">
          Campaigns
        </Link>
        <span>/</span>
        <span className="text-zinc-900">{campaign.name}</span>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{campaign.name}</h1>
          <p className="mt-1 text-sm text-zinc-600">
            {campaign.platformName} • {campaign.adAccountName}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-medium ${
              campaign.status === "ACTIVE"
                ? "bg-green-100 text-green-700"
                : campaign.status === "PAUSED"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-zinc-100 text-zinc-700"
            }`}
          >
            {campaign.status}
          </span>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Spend" value={formatCurrency(campaign.spend)} />
        <MetricCard label="Conversions" value={formatNumber(campaign.conversions)} />
        <MetricCard label="CPA" value={campaign.cpa ? formatCurrency(campaign.cpa) : "—"} />
        <MetricCard label="ROAS" value={campaign.roas ? `${campaign.roas.toFixed(2)}x` : "—"} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-zinc-200 bg-white p-6">
          <h2 className="text-sm font-medium text-zinc-900">Daily Performance</h2>
          {dailyMetrics.length > 0 ? (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 text-left text-zinc-600">
                    <th className="pb-2 font-medium">Date</th>
                    <th className="pb-2 text-right font-medium">Spend</th>
                    <th className="pb-2 text-right font-medium">Conv.</th>
                    <th className="pb-2 text-right font-medium">Clicks</th>
                  </tr>
                </thead>
                <tbody>
                  {dailyMetrics.slice(-7).map((m) => (
                    <tr key={m.date} className="border-b border-zinc-100">
                      <td className="py-2">{m.date}</td>
                      <td className="py-2 text-right">{formatCurrency(m.spend)}</td>
                      <td className="py-2 text-right">{formatNumber(m.conversions)}</td>
                      <td className="py-2 text-right">{formatNumber(m.clicks)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="mt-4 text-sm text-zinc-500">No daily metrics available</p>
          )}
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-6">
          <h2 className="text-sm font-medium text-zinc-900">Ads in Campaign</h2>
          {ads.length > 0 ? (
            <div className="mt-4 space-y-3">
              {ads.slice(0, 10).map((ad) => (
                <div
                  key={ad.id}
                  className="flex items-center justify-between rounded-lg border border-zinc-100 p-3"
                >
                  <div>
                    <p className="text-sm font-medium text-zinc-900">{ad.name}</p>
                    <p className="text-xs text-zinc-500">
                      {formatNumber(ad.conversions)} conv. • CPA: {ad.cpa ? formatCurrency(ad.cpa) : "—"}
                    </p>
                  </div>
                  <span className="text-sm font-medium text-zinc-700">
                    {formatCurrency(ad.spend)}
                  </span>
                </div>
              ))}
              {ads.length > 10 && (
                <p className="text-center text-xs text-zinc-500">
                  +{ads.length - 10} more ads
                </p>
              )}
            </div>
          ) : (
            <p className="mt-4 text-sm text-zinc-500">No ads found</p>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-6">
        <h2 className="text-sm font-medium text-zinc-900">Additional Metrics</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div>
            <p className="text-xs text-zinc-500">Impressions</p>
            <p className="text-lg font-semibold">{formatNumber(campaign.impressions)}</p>
          </div>
          <div>
            <p className="text-xs text-zinc-500">Clicks</p>
            <p className="text-lg font-semibold">{formatNumber(campaign.clicks)}</p>
          </div>
          <div>
            <p className="text-xs text-zinc-500">CTR</p>
            <p className="text-lg font-semibold">
              {campaign.ctr ? `${campaign.ctr.toFixed(2)}%` : "—"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6">
      <p className="text-sm font-medium text-zinc-600">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
    </div>
  );
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}
