import type { NormalizedCostRow } from "./types";
import { NormalizedCostRowSchema } from "./types";

function normalizeName(name: string | undefined | null): string | undefined {
  if (!name) return undefined;
  const v = name.trim().replace(/\s+/g, " ");
  return v.length ? v : undefined;
}

function spendToMicros(value: unknown): bigint {
  const n = Number(value ?? 0);
  if (!Number.isFinite(n)) return 0n;
  return BigInt(Math.round(n * 1_000_000));
}

export type MetaInsightInput = {
  date_start: string;
  campaign_id?: string;
  campaign_name?: string;
  adset_id?: string;
  adset_name?: string;
  ad_id?: string;
  ad_name?: string;
  impressions?: string;
  clicks?: string;
  spend?: string;
  publisher_platform?: string;
};

export function mapMetaInsightToNormalized(row: MetaInsightInput): NormalizedCostRow {
  const out: NormalizedCostRow = {
    channel: "META",
    date: row.date_start,
    campaign_id: String(row.campaign_id ?? ""),
    campaign_name: normalizeName(row.campaign_name),
    adset_id: row.adset_id ? String(row.adset_id) : undefined,
    adset_name: normalizeName(row.adset_name),
    ad_id: row.ad_id ? String(row.ad_id) : undefined,
    ad_name: normalizeName(row.ad_name),
    impressions: BigInt(parseInt(row.impressions ?? "0", 10)),
    clicks: BigInt(parseInt(row.clicks ?? "0", 10)),
    spend_micros: spendToMicros(row.spend),
    publisher_platform: normalizeName(row.publisher_platform),
  };

  return NormalizedCostRowSchema.parse(out);
}

export type TikTokReportingRowInput = {
  date: string;
  campaignId: string;
  campaignName?: string;
  adId?: string;
  adName?: string;
  impressions: bigint;
  clicks: bigint;
  spendMicros: bigint;
};

export function mapTikTokRowToNormalized(row: TikTokReportingRowInput): NormalizedCostRow {
  const out: NormalizedCostRow = {
    channel: "TIKTOK",
    date: row.date,
    campaign_id: row.campaignId,
    campaign_name: normalizeName(row.campaignName),
    ad_id: row.adId,
    ad_name: normalizeName(row.adName),
    impressions: row.impressions,
    clicks: row.clicks,
    spend_micros: row.spendMicros,
  };

  return NormalizedCostRowSchema.parse(out);
}

export type GoogleAdsRowInput = {
  date: string;
  campaignId: string;
  campaignName?: string;
  adGroupId?: string;
  adGroupName?: string;
  adId?: string;
  adName?: string;
  impressions: bigint;
  clicks: bigint;
  spendMicros: bigint;
};

export function mapGoogleAdsRowToNormalized(row: GoogleAdsRowInput): NormalizedCostRow {
  const out: NormalizedCostRow = {
    channel: "GOOGLE_ADS",
    date: row.date,
    campaign_id: row.campaignId,
    campaign_name: normalizeName(row.campaignName),
    adset_id: row.adGroupId,
    adset_name: normalizeName(row.adGroupName),
    ad_id: row.adId,
    ad_name: normalizeName(row.adName),
    impressions: row.impressions,
    clicks: row.clicks,
    spend_micros: row.spendMicros,
  };

  return NormalizedCostRowSchema.parse(out);
}
