import { env } from "../env";
function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
}
function normalizeName(name) {
    return name.trim().replace(/\s+/g, " ");
}
function spendToMicros(value) {
    const n = Number(value ?? 0);
    if (!Number.isFinite(n))
        return 0n;
    return BigInt(Math.round(n * 1_000_000));
}
async function fetchWithRetry(url, init, attempt = 0) {
    const res = await fetch(url, init);
    if (res.status !== 429 && res.status !== 503)
        return res;
    if (attempt >= 6)
        return res;
    const retryAfter = res.headers.get("retry-after");
    const base = retryAfter ? Number.parseInt(retryAfter, 10) * 1000 : 0;
    const jitter = Math.floor(Math.random() * 250);
    const backoff = Math.min(30_000, 2 ** attempt * 500 + jitter);
    await sleep(Math.max(base, backoff));
    return fetchWithRetry(url, init, attempt + 1);
}
export class TikTokAdsClient {
    baseUrl;
    constructor() {
        this.baseUrl = env.TIKTOK_API_BASE_URL;
    }
    buildAuthUrl(params) {
        const url = new URL("https://www.tiktok.com/v2/auth/authorize/");
        url.searchParams.set("client_key", env.TIKTOK_APP_ID);
        url.searchParams.set("redirect_uri", env.TIKTOK_OAUTH_REDIRECT_URI);
        url.searchParams.set("response_type", "code");
        url.searchParams.set("scope", "ads.read,reporting.read");
        url.searchParams.set("state", params.state);
        return url.toString();
    }
    async exchangeCode(code) {
        const url = new URL("/open_api/v1.3/oauth2/access_token/", this.baseUrl);
        const res = await fetchWithRetry(url.toString(), {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
                app_id: env.TIKTOK_APP_ID,
                secret: env.TIKTOK_APP_SECRET,
                auth_code: code,
                grant_type: "authorization_code",
            }),
        });
        const json = (await res.json().catch(() => null));
        if (!res.ok || !json || json.code !== 0 || !json.data) {
            throw new Error(`TIKTOK_OAUTH_EXCHANGE_FAILED_${res.status}:${JSON.stringify(json)}`);
        }
        return json.data;
    }
    async refreshToken(refreshToken) {
        const url = new URL("/open_api/v1.3/oauth2/refresh_token/", this.baseUrl);
        const res = await fetchWithRetry(url.toString(), {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
                app_id: env.TIKTOK_APP_ID,
                secret: env.TIKTOK_APP_SECRET,
                refresh_token: refreshToken,
                grant_type: "refresh_token",
            }),
        });
        const json = (await res.json().catch(() => null));
        if (!res.ok || !json || json.code !== 0 || !json.data) {
            throw new Error(`TIKTOK_OAUTH_REFRESH_FAILED_${res.status}:${JSON.stringify(json)}`);
        }
        return json.data;
    }
    async fetchDailyCampaignReport(params) {
        return this.fetchReport({
            ...params,
            dimensions: ["stat_time_day", "campaign_id"],
        });
    }
    async fetchDailyAdReport(params) {
        return this.fetchReport({
            ...params,
            dimensions: ["stat_time_day", "campaign_id", "ad_id"],
        });
    }
    async fetchReport(params) {
        const url = new URL("/open_api/v1.3/report/integrated/get/", this.baseUrl);
        const metrics = ["spend", "impressions", "clicks", "conversion"];
        const pageSize = 1000;
        const out = [];
        for (let page = 1; page <= 100; page++) {
            const res = await fetchWithRetry(url.toString(), {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                    "access-token": params.accessToken,
                },
                body: JSON.stringify({
                    advertiser_id: params.advertiserId,
                    report_type: "BASIC",
                    dimensions: params.dimensions,
                    metrics,
                    start_date: params.startDate,
                    end_date: params.endDate,
                    page,
                    page_size: pageSize,
                }),
            });
            const json = (await res.json().catch(() => null));
            if (!res.ok || !json || json.code !== 0) {
                throw new Error(`TIKTOK_REPORT_ERROR_${res.status}:${JSON.stringify(json)}`);
            }
            const list = (json.data?.list ?? []);
            if (list.length === 0)
                break;
            for (const row of list) {
                const date = String(row?.dimensions?.stat_time_day ?? row?.stat_time_day);
                const campaignId = String(row?.dimensions?.campaign_id ?? row?.campaign_id);
                const campaignNameRaw = row?.dimensions?.campaign_name ?? row?.campaign_name;
                const adIdRaw = row?.dimensions?.ad_id ?? row?.ad_id;
                const adNameRaw = row?.dimensions?.ad_name ?? row?.ad_name;
                out.push({
                    date,
                    campaignId,
                    campaignName: campaignNameRaw ? normalizeName(String(campaignNameRaw)) : undefined,
                    adId: adIdRaw ? String(adIdRaw) : undefined,
                    adName: adNameRaw ? normalizeName(String(adNameRaw)) : undefined,
                    impressions: BigInt(row?.metrics?.impressions ?? row?.impressions ?? 0),
                    clicks: BigInt(row?.metrics?.clicks ?? row?.clicks ?? 0),
                    conversions: BigInt(row?.metrics?.conversion ?? row?.conversion ?? 0),
                    spendMicros: spendToMicros(row?.metrics?.spend ?? row?.spend ?? 0),
                });
            }
            if (list.length < pageSize)
                break;
        }
        return out;
    }
}
//# sourceMappingURL=tiktok-ads-client.js.map