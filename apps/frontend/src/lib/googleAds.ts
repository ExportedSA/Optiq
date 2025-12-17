import "server-only";

import { OAuth2Client } from "google-auth-library";

import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import { decryptString, encryptString } from "@/lib/crypto";

const GOOGLE_ADS_API_VERSION = "v16";

export type GoogleAdsMetricRow = {
  date: string; // YYYY-MM-DD
  campaignId: string;
  campaignName: string;
  adId?: string;
  adName?: string;
  impressions: bigint;
  clicks: bigint;
  conversions: bigint;
  costMicros: bigint;
};

type GoogleTokenResponse = {
  access_token: string;
  expires_in?: number;
  scope?: string;
  token_type?: string;
  refresh_token?: string;
};

export class GoogleAdsService {
  private oauth: OAuth2Client;

  public constructor() {
    this.oauth = new OAuth2Client({
      clientId: env.GOOGLE_OAUTH_CLIENT_ID,
      clientSecret: env.GOOGLE_OAUTH_CLIENT_SECRET,
      redirectUri: env.GOOGLE_OAUTH_REDIRECT_URI,
    });
  }

  public buildAuthUrl(state: string): string {
    return this.oauth.generateAuthUrl({
      access_type: "offline",
      prompt: "consent",
      scope: ["https://www.googleapis.com/auth/adwords"],
      include_granted_scopes: true,
      state,
    });
  }

  public async exchangeCode(code: string): Promise<GoogleTokenResponse> {
    const { tokens } = await this.oauth.getToken(code);
    return {
      access_token: tokens.access_token ?? "",
      expires_in: tokens.expiry_date
        ? Math.max(0, Math.floor((tokens.expiry_date - Date.now()) / 1000))
        : undefined,
      scope: tokens.scope ?? undefined,
      refresh_token: tokens.refresh_token ?? undefined,
      token_type: tokens.token_type ?? undefined,
    };
  }

  private async refreshAccessToken(refreshToken: string): Promise<GoogleTokenResponse> {
    this.oauth.setCredentials({ refresh_token: refreshToken });
    const { credentials } = await this.oauth.refreshAccessToken();

    return {
      access_token: credentials.access_token ?? "",
      expires_in: credentials.expiry_date
        ? Math.max(0, Math.floor((credentials.expiry_date - Date.now()) / 1000))
        : undefined,
      scope: credentials.scope ?? undefined,
      token_type: credentials.token_type ?? undefined,
    };
  }

  public async getValidAccessToken(params: {
    organizationId: string;
    customerId: string;
  }): Promise<{ accessToken: string }>
  {
    const cred = await prisma.googleAdsCredential.findUnique({
      where: {
        organizationId_customerId: {
          organizationId: params.organizationId,
          customerId: params.customerId,
        },
      },
      select: {
        refreshTokenEnc: true,
        accessTokenEnc: true,
        accessTokenExpiresAt: true,
      },
    });

    if (!cred) throw new Error("GOOGLE_ADS_NOT_CONNECTED");

    const now = Date.now();
    const expiresAt = cred.accessTokenExpiresAt?.getTime() ?? 0;
    const stillValid = cred.accessTokenEnc && expiresAt - now > 60_000;

    if (stillValid) {
      return { accessToken: decryptString(cred.accessTokenEnc) };
    }

    const refreshToken = decryptString(cred.refreshTokenEnc);
    const refreshed = await this.refreshAccessToken(refreshToken);
    if (!refreshed.access_token) throw new Error("GOOGLE_OAUTH_REFRESH_FAILED");

    const newExpiresAt = refreshed.expires_in
      ? new Date(Date.now() + refreshed.expires_in * 1000)
      : null;

    await prisma.googleAdsCredential.update({
      where: {
        organizationId_customerId: {
          organizationId: params.organizationId,
          customerId: params.customerId,
        },
      },
      data: {
        accessTokenEnc: encryptString(refreshed.access_token),
        accessTokenExpiresAt: newExpiresAt,
      },
      select: { id: true },
    });

    return { accessToken: refreshed.access_token };
  }

  private async fetchWithRetry(
    url: string,
    init: RequestInit,
    attempt = 0,
  ): Promise<Response> {
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

  private async googleAdsSearch(params: {
    customerId: string;
    accessToken: string;
    query: string;
  }): Promise<unknown[]> {
    const url = `https://googleads.googleapis.com/${GOOGLE_ADS_API_VERSION}/customers/${params.customerId}/googleAds:searchStream`;

    const headers: Record<string, string> = {
      authorization: `Bearer ${params.accessToken}`,
      "developer-token": env.GOOGLE_ADS_DEVELOPER_TOKEN,
      "content-type": "application/json",
    };

    if (env.GOOGLE_ADS_LOGIN_CUSTOMER_ID) {
      headers["login-customer-id"] = env.GOOGLE_ADS_LOGIN_CUSTOMER_ID;
    }

    const res = await this.fetchWithRetry(url, {
      method: "POST",
      headers,
      body: JSON.stringify({ query: params.query }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`GOOGLE_ADS_API_ERROR_${res.status}:${text}`);
    }

    const json = (await res.json()) as unknown[];
    return json;
  }

  public async fetchDailyCampaignMetrics(params: {
    organizationId: string;
    customerId: string;
    startDate: string;
    endDate: string;
  }): Promise<GoogleAdsMetricRow[]> {
    const { accessToken } = await this.getValidAccessToken({
      organizationId: params.organizationId,
      customerId: params.customerId,
    });

    const query = `
      SELECT
        segments.date,
        campaign.id,
        campaign.name,
        metrics.impressions,
        metrics.clicks,
        metrics.conversions,
        metrics.cost_micros
      FROM campaign
      WHERE segments.date BETWEEN '${params.startDate}' AND '${params.endDate}'
    `;

    const chunks = await this.googleAdsSearch({
      customerId: params.customerId,
      accessToken,
      query,
    });

    const rows: GoogleAdsMetricRow[] = [];

    for (const chunk of chunks) {
      const results = (chunk as any)?.results as any[] | undefined;
      if (!results) continue;

      for (const r of results) {
        rows.push({
          date: String(r?.segments?.date),
          campaignId: String(r?.campaign?.id),
          campaignName: String(r?.campaign?.name ?? ""),
          impressions: BigInt(r?.metrics?.impressions ?? 0),
          clicks: BigInt(r?.metrics?.clicks ?? 0),
          conversions: BigInt(r?.metrics?.conversions ?? 0),
          costMicros: BigInt(r?.metrics?.costMicros ?? r?.metrics?.cost_micros ?? 0),
        });
      }
    }

    return rows;
  }

  public async fetchDailyAdMetrics(params: {
    organizationId: string;
    customerId: string;
    startDate: string;
    endDate: string;
  }): Promise<GoogleAdsMetricRow[]> {
    const { accessToken } = await this.getValidAccessToken({
      organizationId: params.organizationId,
      customerId: params.customerId,
    });

    const query = `
      SELECT
        segments.date,
        campaign.id,
        campaign.name,
        ad_group_ad.ad.id,
        ad_group_ad.ad.name,
        metrics.impressions,
        metrics.clicks,
        metrics.conversions,
        metrics.cost_micros
      FROM ad_group_ad
      WHERE segments.date BETWEEN '${params.startDate}' AND '${params.endDate}'
    `;

    const chunks = await this.googleAdsSearch({
      customerId: params.customerId,
      accessToken,
      query,
    });

    const rows: GoogleAdsMetricRow[] = [];

    for (const chunk of chunks) {
      const results = (chunk as any)?.results as any[] | undefined;
      if (!results) continue;

      for (const r of results) {
        rows.push({
          date: String(r?.segments?.date),
          campaignId: String(r?.campaign?.id),
          campaignName: String(r?.campaign?.name ?? ""),
          adId: String(r?.adGroupAd?.ad?.id ?? r?.ad_group_ad?.ad?.id),
          adName: String(r?.adGroupAd?.ad?.name ?? r?.ad_group_ad?.ad?.name ?? ""),
          impressions: BigInt(r?.metrics?.impressions ?? 0),
          clicks: BigInt(r?.metrics?.clicks ?? 0),
          conversions: BigInt(r?.metrics?.conversions ?? 0),
          costMicros: BigInt(r?.metrics?.costMicros ?? r?.metrics?.cost_micros ?? 0),
        });
      }
    }

    return rows;
  }
}
