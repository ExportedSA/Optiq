import "server-only";

import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import { decryptString, encryptString } from "@/lib/crypto";

export type MetaInsightsRow = {
  date: string; // YYYY-MM-DD
  publisherPlatform: "facebook" | "instagram" | "audience_network" | "messenger" | string;
  campaignId: string;
  campaignName: string;
  adId?: string;
  adName?: string;
  impressions: bigint;
  clicks: bigint;
  spendMicros: bigint;
  conversions: bigint;
};

type MetaTokenExchange = {
  access_token: string;
  token_type?: string;
  expires_in?: number;
};

type MetaLongLivedToken = {
  access_token: string;
  token_type?: string;
  expires_in?: number;
};

export class MetaAdsService {
  private readonly baseUrl: string;

  public constructor() {
    this.baseUrl = `https://graph.facebook.com/${env.META_API_VERSION}`;
  }

  public buildAuthUrl(state: string): string {
    const url = new URL("https://www.facebook.com/v20.0/dialog/oauth");
    url.searchParams.set("client_id", env.META_APP_ID);
    url.searchParams.set("redirect_uri", env.META_OAUTH_REDIRECT_URI);
    url.searchParams.set(
      "scope",
      [
        "ads_read",
        "read_insights",
        "business_management"
      ].join(","),
    );
    url.searchParams.set("response_type", "code");
    url.searchParams.set("state", state);
    return url.toString();
  }

  public async exchangeCode(code: string): Promise<MetaTokenExchange> {
    const url = new URL(`${this.baseUrl}/oauth/access_token`);
    url.searchParams.set("client_id", env.META_APP_ID);
    url.searchParams.set("client_secret", env.META_APP_SECRET);
    url.searchParams.set("redirect_uri", env.META_OAUTH_REDIRECT_URI);
    url.searchParams.set("code", code);

    const res = await fetch(url, { method: "GET" });
    const json = (await res.json().catch(() => null)) as any;
    if (!res.ok || !json?.access_token) {
      throw new Error(`META_OAUTH_EXCHANGE_FAILED_${res.status}:${JSON.stringify(json)}`);
    }

    return {
      access_token: String(json.access_token),
      token_type: json.token_type ? String(json.token_type) : undefined,
      expires_in: json.expires_in ? Number(json.expires_in) : undefined,
    };
  }

  public async exchangeForLongLivedToken(shortLivedAccessToken: string): Promise<MetaLongLivedToken> {
    const url = new URL(`${this.baseUrl}/oauth/access_token`);
    url.searchParams.set("grant_type", "fb_exchange_token");
    url.searchParams.set("client_id", env.META_APP_ID);
    url.searchParams.set("client_secret", env.META_APP_SECRET);
    url.searchParams.set("fb_exchange_token", shortLivedAccessToken);

    const res = await fetch(url, { method: "GET" });
    const json = (await res.json().catch(() => null)) as any;
    if (!res.ok || !json?.access_token) {
      throw new Error(`META_OAUTH_LONG_LIVED_FAILED_${res.status}:${JSON.stringify(json)}`);
    }

    return {
      access_token: String(json.access_token),
      token_type: json.token_type ? String(json.token_type) : undefined,
      expires_in: json.expires_in ? Number(json.expires_in) : undefined,
    };
  }

  public async getValidAccessToken(params: {
    organizationId: string;
    metaAdAccountId: string;
  }): Promise<{ accessToken: string }> {
    // Get credentials from IntegrationConnection
    const connection = await prisma.integrationConnection.findFirst({
      where: {
        organizationId: params.organizationId,
        platformCode: "META",
        externalAccountId: params.metaAdAccountId,
        status: "CONNECTED",
      },
      select: {
        accessTokenEnc: true,
        accessTokenExpiresAt: true,
      },
    });

    if (!connection || !connection.accessTokenEnc) throw new Error("META_ADS_NOT_CONNECTED");

    const now = Date.now();
    const expiresAt = connection.accessTokenExpiresAt?.getTime() ?? 0;
    const stillValid = expiresAt - now > 7 * 24 * 60 * 60_000;

    if (stillValid) {
      return { accessToken: decryptString(connection.accessTokenEnc) };
    }

    const current = decryptString(connection.accessTokenEnc);
    const refreshed = await this.exchangeForLongLivedToken(current);

    const newExpiresAt = refreshed.expires_in
      ? new Date(Date.now() + refreshed.expires_in * 1000)
      : null;

    // Update the connection with new access token
    await prisma.integrationConnection.updateMany({
      where: {
        organizationId: params.organizationId,
        platformCode: "META",
        externalAccountId: params.metaAdAccountId,
      },
      data: {
        accessTokenEnc: encryptString(refreshed.access_token),
        accessTokenExpiresAt: newExpiresAt,
      },
    });

    return { accessToken: refreshed.access_token };
  }

  private async fetchWithRetry(url: string, attempt = 0): Promise<Response> {
    const res = await fetch(url, { method: "GET" });

    if (res.status !== 429 && res.status !== 503) return res;
    if (attempt >= 6) return res;

    const retryAfter = res.headers.get("retry-after");
    const base = retryAfter ? Number.parseInt(retryAfter, 10) * 1000 : 0;
    const jitter = Math.floor(Math.random() * 250);
    const backoff = Math.min(30_000, (2 ** attempt) * 500 + jitter);

    await new Promise((r) => setTimeout(r, Math.max(base, backoff)));
    return this.fetchWithRetry(url, attempt + 1);
  }

  public async fetchDailyCampaignInsights(params: {
    organizationId: string;
    metaAdAccountId: string; // e.g. act_123
    startDate: string;
    endDate: string;
  }): Promise<MetaInsightsRow[]> {
    const { accessToken } = await this.getValidAccessToken({
      organizationId: params.organizationId,
      metaAdAccountId: params.metaAdAccountId,
    });

    const url = new URL(`${this.baseUrl}/${params.metaAdAccountId}/insights`);
    url.searchParams.set(
      "fields",
      [
        "date_start",
        "campaign_id",
        "campaign_name",
        "impressions",
        "clicks",
        "spend",
        "actions",
        "publisher_platform",
      ].join(","),
    );
    url.searchParams.set("level", "campaign");
    url.searchParams.set("time_increment", "1");
    url.searchParams.set(
      "time_range",
      JSON.stringify({ since: params.startDate, until: params.endDate }),
    );
    url.searchParams.set("breakdowns", "publisher_platform");
    url.searchParams.set("access_token", accessToken);

    const res = await this.fetchWithRetry(url.toString());
    const json = (await res.json().catch(() => null)) as any;
    if (!res.ok) {
      throw new Error(`META_API_ERROR_${res.status}:${JSON.stringify(json)}`);
    }

    const data = (json?.data ?? []) as any[];
    return data.map(mapMetaInsightsToRow);
  }

  public async fetchDailyAdInsights(params: {
    organizationId: string;
    metaAdAccountId: string;
    startDate: string;
    endDate: string;
  }): Promise<MetaInsightsRow[]> {
    const { accessToken } = await this.getValidAccessToken({
      organizationId: params.organizationId,
      metaAdAccountId: params.metaAdAccountId,
    });

    const url = new URL(`${this.baseUrl}/${params.metaAdAccountId}/insights`);
    url.searchParams.set(
      "fields",
      [
        "date_start",
        "campaign_id",
        "campaign_name",
        "ad_id",
        "ad_name",
        "impressions",
        "clicks",
        "spend",
        "actions",
        "publisher_platform",
      ].join(","),
    );
    url.searchParams.set("level", "ad");
    url.searchParams.set("time_increment", "1");
    url.searchParams.set(
      "time_range",
      JSON.stringify({ since: params.startDate, until: params.endDate }),
    );
    url.searchParams.set("breakdowns", "publisher_platform");
    url.searchParams.set("access_token", accessToken);

    const res = await this.fetchWithRetry(url.toString());
    const json = (await res.json().catch(() => null)) as any;
    if (!res.ok) {
      throw new Error(`META_API_ERROR_${res.status}:${JSON.stringify(json)}`);
    }

    const data = (json?.data ?? []) as any[];
    return data.map(mapMetaInsightsToRow);
  }
}

function parseSpendMicros(spend: unknown): bigint {
  const n = Number(spend ?? 0);
  if (!Number.isFinite(n)) return 0n;
  return BigInt(Math.round(n * 1_000_000));
}

function parseActionsConversions(actions: unknown): bigint {
  if (!Array.isArray(actions)) return 0n;

  const conversionTypes = new Set([
    "purchase",
    "offsite_conversion.purchase",
    "omni_purchase",
    "complete_registration",
    "lead",
  ]);

  let total = 0n;
  for (const a of actions) {
    const type = (a as any)?.action_type as string | undefined;
    const value = (a as any)?.value;
    if (!type || !conversionTypes.has(type)) continue;
    const num = BigInt(Number(value ?? 0));
    total += num;
  }

  return total;
}

export function mapMetaInsightsToRow(i: any): MetaInsightsRow {
  return {
    date: String(i?.date_start),
    publisherPlatform: String(i?.publisher_platform ?? "facebook"),
    campaignId: String(i?.campaign_id),
    campaignName: String(i?.campaign_name ?? ""),
    adId: i?.ad_id ? String(i.ad_id) : undefined,
    adName: i?.ad_name ? String(i.ad_name) : undefined,
    impressions: BigInt(i?.impressions ?? 0),
    clicks: BigInt(i?.clicks ?? 0),
    spendMicros: parseSpendMicros(i?.spend),
    conversions: parseActionsConversions(i?.actions),
  };
}
