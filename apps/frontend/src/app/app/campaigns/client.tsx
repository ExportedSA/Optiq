"use client";

import { useState, useMemo } from "react";
import { CampaignDataTable } from "@/components/campaigns/data-table";
import { CampaignFilters } from "@/components/campaigns/filters";
import type { CampaignPerformanceRow } from "@/lib/campaigns";

interface Platform {
  code: string;
  name: string;
  count: number;
}

interface CampaignsPageClientProps {
  initialData: CampaignPerformanceRow[];
  platforms: Platform[];
  total: number;
}

export function CampaignsPageClient({
  initialData,
  platforms,
  total,
}: CampaignsPageClientProps) {
  const [search, setSearch] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);

  const filteredData = useMemo(() => {
    let data = initialData;

    if (selectedPlatforms.length > 0) {
      data = data.filter((c) => selectedPlatforms.includes(c.platformCode));
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.externalId.toLowerCase().includes(q)
      );
    }

    return data;
  }, [initialData, selectedPlatforms, search]);

  const wasteStats = useMemo(() => {
    const withWaste = filteredData.filter((c) => c.wasteLevel !== "none");
    const totalWasted = withWaste.reduce((sum, c) => sum + c.wastedSpend, 0);
    return {
      count: withWaste.length,
      totalWasted,
    };
  }, [filteredData]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Campaigns</h1>
          <p className="mt-1 text-sm text-zinc-600">
            {filteredData.length} of {total} campaigns
            {wasteStats.count > 0 && (
              <span className="ml-2 text-amber-600">
                • {wasteStats.count} with waste alerts (${wasteStats.totalWasted.toFixed(2)})
              </span>
            )}
          </p>
        </div>
      </div>

      <CampaignFilters
        platforms={platforms}
        selectedPlatforms={selectedPlatforms}
        onPlatformChange={setSelectedPlatforms}
        search={search}
        onSearchChange={setSearch}
      />

      <div className="space-y-2">
        <div className="flex items-center gap-4 text-xs text-zinc-500">
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-1 rounded-full bg-red-500" />
            Critical waste
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-1 rounded-full bg-orange-500" />
            High waste
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-1 rounded-full bg-yellow-500" />
            Medium waste
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-1 rounded-full bg-amber-400" />
            Low waste
          </span>
        </div>

        <CampaignDataTable data={filteredData} />
      </div>
    </div>
  );
}
