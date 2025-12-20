/**
 * Meta Marketing API Client
 *
 * Resilient client with paging, retry logic, and rate limit handling
 */
import { META_ADS_CONFIG } from "../config/meta-ads";
/**
 * Rate limiter state
 */
class RateLimiter {
    callsThisMinute = 0;
    callsThisHour = 0;
    minuteResetTime = Date.now() + 60000;
    hourResetTime = Date.now() + 3600000;
    async checkLimit() {
        const now = Date.now();
        // Reset minute counter
        if (now >= this.minuteResetTime) {
            this.callsThisMinute = 0;
            this.minuteResetTime = now + 60000;
        }
        // Reset hour counter
        if (now >= this.hourResetTime) {
            this.callsThisHour = 0;
            this.hourResetTime = now + 3600000;
        }
        // Check limits
        if (this.callsThisMinute >= META_ADS_CONFIG.rateLimits.callsPerMinute) {
            const waitTime = this.minuteResetTime - now;
            console.log(`Rate limit reached (minute). Waiting ${waitTime}ms...`);
            await this.sleep(waitTime);
            this.callsThisMinute = 0;
            this.minuteResetTime = Date.now() + 60000;
        }
        if (this.callsThisHour >= META_ADS_CONFIG.rateLimits.callsPerHour) {
            const waitTime = this.hourResetTime - now;
            console.log(`Rate limit reached (hour). Waiting ${waitTime}ms...`);
            await this.sleep(waitTime);
            this.callsThisHour = 0;
            this.hourResetTime = Date.now() + 3600000;
        }
        this.callsThisMinute++;
        this.callsThisHour++;
    }
    sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}
/**
 * Meta API Client with resilience features
 */
export class MetaApiClient {
    rateLimiter = new RateLimiter();
    accessToken;
    constructor(accessToken) {
        this.accessToken = accessToken;
    }
    /**
     * Make API request with retry and rate limiting
     */
    async request(endpoint, params = {}, attempt = 1) {
        // Check rate limit before making request
        await this.rateLimiter.checkLimit();
        const url = new URL(`${META_ADS_CONFIG.baseUrl}/${META_ADS_CONFIG.apiVersion}/${endpoint}`);
        url.searchParams.set("access_token", this.accessToken);
        for (const [key, value] of Object.entries(params)) {
            url.searchParams.set(key, value);
        }
        try {
            const response = await fetch(url.toString());
            // Handle rate limiting
            if (response.status === 429) {
                const retryAfter = parseInt(response.headers.get("retry-after") || "60");
                console.log(`Rate limited by Meta. Retrying after ${retryAfter}s...`);
                if (attempt >= META_ADS_CONFIG.retry.maxAttempts) {
                    throw new Error(`Max retry attempts reached. Status: ${response.status}`);
                }
                const delay = Math.max(retryAfter * 1000, this.calculateBackoff(attempt));
                await this.sleep(delay);
                return this.request(endpoint, params, attempt + 1);
            }
            // Handle retryable errors
            if (META_ADS_CONFIG.retry.retryableStatusCodes.includes(response.status)) {
                if (attempt >= META_ADS_CONFIG.retry.maxAttempts) {
                    throw new Error(`Max retry attempts reached. Status: ${response.status}`);
                }
                const delay = this.calculateBackoff(attempt);
                console.log(`Request failed with ${response.status}. Retrying in ${delay}ms... (attempt ${attempt}/${META_ADS_CONFIG.retry.maxAttempts})`);
                await this.sleep(delay);
                return this.request(endpoint, params, attempt + 1);
            }
            if (!response.ok) {
                const error = await response.text();
                throw new Error(`API request failed: ${response.status} ${error}`);
            }
            return (await response.json());
        }
        catch (error) {
            // Retry on network errors
            if (error instanceof TypeError && attempt < META_ADS_CONFIG.retry.maxAttempts) {
                const delay = this.calculateBackoff(attempt);
                console.log(`Network error. Retrying in ${delay}ms... (attempt ${attempt}/${META_ADS_CONFIG.retry.maxAttempts})`);
                await this.sleep(delay);
                return this.request(endpoint, params, attempt + 1);
            }
            throw error;
        }
    }
    /**
     * Fetch all pages of data
     */
    async *fetchAllPages(endpoint, params = {}) {
        let nextUrl = null;
        let isFirstPage = true;
        while (isFirstPage || nextUrl) {
            let data;
            if (isFirstPage) {
                // First page - use endpoint and params
                data = await this.request(endpoint, {
                    ...params,
                    limit: META_ADS_CONFIG.paging.defaultLimit.toString(),
                });
                isFirstPage = false;
            }
            else {
                // Subsequent pages - use next URL
                const url = new URL(nextUrl);
                const pathAndParams = url.pathname + url.search;
                // Extract endpoint from full URL
                const apiVersionIndex = pathAndParams.indexOf(`/${META_ADS_CONFIG.apiVersion}/`);
                const relativeEndpoint = pathAndParams.substring(apiVersionIndex + `/${META_ADS_CONFIG.apiVersion}/`.length);
                // Parse query params
                const urlParams = {};
                url.searchParams.forEach((value, key) => {
                    if (key !== "access_token") {
                        urlParams[key] = value;
                    }
                });
                data = await this.request(relativeEndpoint.split("?")[0], urlParams);
            }
            // Yield current page data
            if (data.data && Array.isArray(data.data)) {
                yield data.data;
            }
            // Check for next page
            nextUrl = data.paging?.next || null;
            // Break if no more pages
            if (!nextUrl) {
                break;
            }
        }
    }
    /**
     * Fetch all data (flattened)
     */
    async fetchAll(endpoint, params = {}) {
        const allData = [];
        for await (const page of this.fetchAllPages(endpoint, params)) {
            allData.push(...page);
        }
        return allData;
    }
    /**
     * Calculate exponential backoff delay
     */
    calculateBackoff(attempt) {
        const delay = META_ADS_CONFIG.retry.initialDelayMs * Math.pow(META_ADS_CONFIG.retry.backoffMultiplier, attempt - 1);
        return Math.min(delay, META_ADS_CONFIG.retry.maxDelayMs);
    }
    /**
     * Sleep utility
     */
    sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}
/**
 * Create Meta API client
 */
export function createMetaApiClient(accessToken) {
    return new MetaApiClient(accessToken);
}
//# sourceMappingURL=meta-api-client.js.map