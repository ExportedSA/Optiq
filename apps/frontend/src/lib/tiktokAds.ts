import "server-only";

import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import { decryptString, encryptString } from "@/lib/crypto";

export type TikTokReportingRow = {
  date: string; // YYYY-MM-DD
  campaignId: string;
  campaignName: string;
  adId?: string;
  adName?: string;
  impressions: bigint;
  clicks: bigint;
  spendMicros: bigint;
  conversions: bigint;
};

type TikTokTokenResponse = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  refresh_expires_in: number;
  scope: string;
};

type TikTokApiResponse<T> = {
  code: number;
  message: string;
  request_id?: string;
  data?: T;
};

export class TikTokAdsService {
  private readonly baseUrl: string;

  public constructor() {
    this.baseUrl = env.TIKTOK_API_BASE_URL;
  }

  public buildAuthUrl(params: {
    state: string;
  }): string {
    const url = new URL("https://www.tiktok.com/v2/auth/authorize/");
    url.searchParams.set("client_key", env.TIKTOK_APP_ID);
    url.searchParams.set("redirect_uri", env.TIKTOK_OAUTH_REDIRECT_URI);
    url.searchParams.set("response_type", "code");
    url.searchParams.set("scope", "ads.read,reporting.read");
    url.searchParams.set("state", params.state);
    return url.toString();
  }

  public async exchangeCode(code: string): Promise<TikTokTokenResponse> {
    const url = new URL("/open_api/v1.3/oauth2/access_token/", this.baseUrl);

    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        app_id: env.TIKTOK_APP_ID,
        secret: env.TIKTOK_APP_SECRET,
        auth_code: code,
        grant_type: "authorization_code",
      }),
    });

    const json = (await res.json().catch(() => null)) as TikTokApiResponse<TikTokTokenResponse> | null;
    if (!res.ok || !json || json.code !== 0 || !json.data) {
      throw new Error(`TIKTOK_OAUTH_EXCHANGE_FAILED_${res.status}:${JSON.stringify(json)}`);
    }

    return json.data;
  }

  private async refreshToken(refreshToken: string): Promise<TikTokTokenResponse> {
    const url = new URL("/open_api/v1.3/oauth2/refresh_token/", this.baseUrl);

    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        app_id: env.TIKTOK_APP_ID,
        secret: env.TIKTOK_APP_SECRET,
        refresh_token: refreshToken,
        grant_type: "refresh_token",
      }),
    });

    const json = (await res.json().catch(() => null)) as TikTokApiResponse<TikTokTokenResponse> | null;
    if (!res.ok || !json || json.code !== 0 || !json.data) {
      throw new Error(`TIKTOK_OAUTH_REFRESH_FAILED_${res.status}:${JSON.stringify(json)}`);
    }

    return json.data;
  }

  public async getValidAccessToken(params: {
    organizationId: string;
    advertiserId: string;
  }): Promise<{ accessToken: string }>
  {
    const cred = await prisma.tikTokAdsCredential.findUnique({
      where: {
        organizationId_advertiserId: {
          organizationId: params.organizationId,
          advertiserId: params.advertiserId,
        },
      },
      select: {
        accessTokenEnc: true,
        refreshTokenEnc: true,
        accessTokenExpiresAt: true,
        refreshTokenExpiresAt: true,
      },
    });

    if (!cred) throw new Error("TIKTOK_ADS_NOT_CONNECTED");

    const now = Date.now();
    const accessExp = cred.accessTokenExpiresAt?.getTime() ?? 0;

    if (cred.accessTokenEnc && accessExp - now > 60_000) {
      return { accessToken: decryptString(cred.accessTokenEnc) };
    }

    const refreshExp = cred.refreshTokenExpiresAt?.getTime() ?? 0;
    if (refreshExp && refreshExp - now <= 0) {
      throw new Error("TIKTOK_REFRESH_TOKEN_EXPIRED");
    }

    const refresh = decryptString(cred.refreshTokenEnc);
    const refreshed = await this.refreshToken(refresh);

    const newAccessExp = new Date(Date.now() + refreshed.expires_in * 1000);
    const newRefreshExp = new Date(Date.now() + refreshed.refresh_expires_in * 1000);

    await prisma.tikTokAdsCredential.update({
      where: {
        organizationId_advertiserId: {
          organizationId: params.organizationId,
          advertiserId: params.advertiserId,
        },
      },
      data: {
        accessTokenEnc: encryptString(refreshed.access_token),
        refreshTokenEnc: encryptString(refreshed.refresh_token),
        accessTokenExpiresAt: newAccessExp,
        refreshTokenExpiresAt: newRefreshExp,
      },
      select: { id: true },
    });

    return { accessToken: refreshed.access_token };
  }

  private async fetchWithRetry(url: string, init: RequestInit, attempt = 0): Promise<Response> {
    const res = await fetch(url, init);
    if (res.status !== 429 && res.status !== 503) return res;
    if (attempt >= 6) return res;

    const retryAfter = res.headers.get("retry-after");
    const base = retryAfter ? Number.parseInt(retryAfter, 10) * 1000 : 0;
    const jitter = Math.floor(Math.random() * 250);
    const backoff = Math.min(30_000, (2 ** attempt) * 500 + jitter);

    await new Promise((r) => setTimeout(r, Math.max(base, backoff)));
    return this.fetchWithRetry(url, init, attempt + 1);
  }

  public async fetchDailyCampaignReport(params: {
    organizationId: string;
    advertiserId: string;
    startDate: string;
    endDate: string;
  }): Promise<TikTokReportingRow[]> {
    const { accessToken } = await this.getValidAccessToken({
      organizationId: params.organizationId,
      advertiserId: params.advertiserId,
    });

    const url = new URL("/open_api/v1.3/report/integrated/get/", this.baseUrl);

    const body = {
      advertiser_id: params.advertiserId,
      report_type: "BASIC",
      dimensions: ["stat_time_day", "campaign_id"],
      metrics: ["spend", "impressions", "clicks", "conversion"],
      start_date: params.startDate,
      end_date: params.endDate,
      page: 1,
      page_size: 1000,
    };

    const res = await this.fetchWithRetry(url.toString(), {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "access-token": accessToken,
      },
      body: JSON.stringify(body),
    });

    const json = (await res.json().catch(() => null)) as TikTokApiResponse<any> | null;
    if (!res.ok || !json || json.code !== 0) {
      throw new Error(`TIKTOK_REPORT_ERROR_${res.status}:${JSON.stringify(json)}`);
    }

    const list = (json.data?.list ?? []) as any[];
    return list.map(mapTikTokCampaignRow);
  }

  public async fetchDailyAdReport(params: {
    organizationId: string;
    advertiserId: string;
    startDate: string;
    endDate: string;
  }): Promise<TikTokReportingRow[]> {
    const { accessToken } = await this.getValidAccessToken({
      organizationId: params.organizationId,
      advertiserId: params.advertiserId,
    });

    const url = new URL("/open_api/v1.3/report/integrated/get/", this.baseUrl);

    const body = {
      advertiser_id: params.advertiserId,
      report_type: "BASIC",
      dimensions: ["stat_time_day", "campaign_id", "ad_id"],
      metrics: ["spend", "impressions", "clicks", "conversion"],
      start_date: params.startDate,
      end_date: params.endDate,
      page: 1,
      page_size: 1000,
    };

    const res = await this.fetchWithRetry(url.toString(), {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "access-token": accessToken,
      },
      body: JSON.stringify(body),
    });

    const json = (await res.json().catch(() => null)) as TikTokApiResponse<any> | null;
    if (!res.ok || !json || json.code !== 0) {
      throw new Error(`TIKTOK_REPORT_ERROR_${res.status}:${JSON.stringify(json)}`);
    }

    const list = (json.data?.list ?? []) as any[];
    return list.map(mapTikTokAdRow);
  }
}

function spendToMicros(value: unknown): bigint {
  const n = Number(value ?? 0);
  if (!Number.isFinite(n)) return 0n;
  return BigInt(Math.round(n * 1_000_000));
}

function mapTikTokCampaignRow(row: any): TikTokReportingRow {
  return {
    date: String(row?.dimensions?.stat_time_day ?? row?.stat_time_day),
    campaignId: String(row?.dimensions?.campaign_id ?? row?.campaign_id),
    campaignName: String(row?.dimensions?.campaign_name ?? ""),
    impressions: BigInt(row?.metrics?.impressions ?? row?.impressions ?? 0),
    clicks: BigInt(row?.metrics?.clicks ?? row?.clicks ?? 0),
    conversions: BigInt(row?.metrics?.conversion ?? row?.conversion ?? 0),
    spendMicros: spendToMicros(row?.metrics?.spend ?? row?.spend ?? 0),
  };
}

function mapTikTokAdRow(row: any): TikTokReportingRow {
  return {
    date: String(row?.dimensions?.stat_time_day ?? row?.stat_time_day),
    campaignId: String(row?.dimensions?.campaign_id ?? row?.campaign_id),
    campaignName: String(row?.dimensions?.campaign_name ?? ""),
    adId: String(row?.dimensions?.ad_id ?? row?.ad_id),
    adName: row?.dimensions?.ad_name ? String(row.dimensions.ad_name) : undefined,
    impressions: BigInt(row?.metrics?.impressions ?? row?.impressions ?? 0),
    clicks: BigInt(row?.metrics?.clicks ?? row?.clicks ?? 0),
    conversions: BigInt(row?.metrics?.conversion ?? row?.conversion ?? 0),
    spendMicros: spendToMicros(row?.metrics?.spend ?? row?.spend ?? 0),
  };
}

export const mapTikTokReportingRow = {
  campaign: mapTikTokCampaignRow,
  ad: mapTikTokAdRow,
};
