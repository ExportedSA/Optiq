/**
 * Meta Marketing API Client
 *
 * Resilient client with paging, retry logic, and rate limit handling
 */
/**
 * Meta API Client with resilience features
 */
export declare class MetaApiClient {
    private rateLimiter;
    private accessToken;
    constructor(accessToken: string);
    /**
     * Make API request with retry and rate limiting
     */
    request<T>(endpoint: string, params?: Record<string, string>, attempt?: number): Promise<T>;
    /**
     * Fetch all pages of data
     */
    fetchAllPages<T>(endpoint: string, params?: Record<string, string>): AsyncGenerator<T[], void, unknown>;
    /**
     * Fetch all data (flattened)
     */
    fetchAll<T>(endpoint: string, params?: Record<string, string>): Promise<T[]>;
    /**
     * Calculate exponential backoff delay
     */
    private calculateBackoff;
    /**
     * Sleep utility
     */
    private sleep;
}
/**
 * Create Meta API client
 */
export declare function createMetaApiClient(accessToken: string): MetaApiClient;
//# sourceMappingURL=meta-api-client.d.ts.map