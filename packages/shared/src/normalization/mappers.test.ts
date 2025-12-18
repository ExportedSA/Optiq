import { describe, it, expect } from "vitest";

import { NormalizedCostRowSchema } from "./types";
import { mapMetaInsightToNormalized, mapTikTokRowToNormalized, mapGoogleAdsRowToNormalized } from "./mappers";

describe("normalization mappers", () => {
  it("maps Meta insight row to canonical shape", () => {
    const row = mapMetaInsightToNormalized({
      date_start: "2025-01-02",
      campaign_id: "cmp_1",
      campaign_name: "  My   Campaign ",
      adset_id: "as_1",
      adset_name: " Adset ",
      ad_id: "ad_1",
      ad_name: "  Ad Name ",
      impressions: "10",
      clicks: "2",
      spend: "1.23",
      publisher_platform: "instagram",
    });

    expect(NormalizedCostRowSchema.safeParse(row).success).toBe(true);
    expect(row.channel).toBe("META");
    expect(row.campaign_name).toBe("My Campaign");
    expect(row.spend_micros).toBe(1_230_000n);
  });

  it("maps TikTok reporting row to canonical shape", () => {
    const row = mapTikTokRowToNormalized({
      date: "2025-01-02",
      campaignId: "123",
      campaignName: "  TikTok   Campaign ",
      adId: "999",
      adName: "  Ad  ",
      impressions: 5n,
      clicks: 1n,
      spendMicros: 500_000n,
    });

    expect(row.channel).toBe("TIKTOK");
    expect(row.campaign_name).toBe("TikTok Campaign");
  });

  it("maps Google Ads row to canonical shape", () => {
    const row = mapGoogleAdsRowToNormalized({
      date: "2025-01-02",
      campaignId: "c1",
      campaignName: "Camp",
      adGroupId: "ag1",
      adGroupName: " Ad Group ",
      adId: "a1",
      adName: " Ad ",
      impressions: 10n,
      clicks: 3n,
      spendMicros: 1_000n,
    });

    expect(row.channel).toBe("GOOGLE_ADS");
    expect(row.adset_name).toBe("Ad Group");
  });
});
