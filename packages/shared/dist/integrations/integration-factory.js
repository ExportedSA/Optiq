/**
 * Integration Factory
 *
 * Registry and factory for creating platform integrations
 */
import { GoogleAdsIntegration } from "./google-ads-integration";
/**
 * Integration registry and factory
 */
export class IntegrationRegistry {
    static instance;
    integrations;
    constructor() {
        this.integrations = new Map();
        this.registerDefaults();
    }
    /**
     * Get singleton instance
     */
    static getInstance() {
        if (!IntegrationRegistry.instance) {
            IntegrationRegistry.instance = new IntegrationRegistry();
        }
        return IntegrationRegistry.instance;
    }
    /**
     * Register default integrations
     */
    registerDefaults() {
        this.register("GOOGLE_ADS", GoogleAdsIntegration);
        // TODO: Register other platforms
        // this.register("META", MetaAdsIntegration);
        // this.register("TIKTOK", TikTokAdsIntegration);
    }
    /**
     * Register a new integration
     */
    register(platform, integration) {
        this.integrations.set(platform, integration);
    }
    /**
     * Create integration instance
     */
    create(platform, config) {
        const IntegrationClass = this.integrations.get(platform);
        if (!IntegrationClass) {
            throw new Error(`Integration not found for platform: ${platform}`);
        }
        return new IntegrationClass(config);
    }
    /**
     * Get all supported platforms
     */
    getSupportedPlatforms() {
        return Array.from(this.integrations.keys());
    }
    /**
     * Check if platform is supported
     */
    isSupported(platform) {
        return this.integrations.has(platform);
    }
}
export function registerIntegration(platform, integration) {
    const registry = IntegrationRegistry.getInstance();
    registry.register(platform, integration);
}
/**
 * Convenience function to get integration instance
 */
export function getIntegration(platform, config) {
    const registry = IntegrationRegistry.getInstance();
    return registry.create(platform, config);
}
/**
 * Convenience function to check if platform is supported
 */
export function isPlatformSupported(platform) {
    const registry = IntegrationRegistry.getInstance();
    return registry.isSupported(platform);
}
/**
 * Get all supported platforms
 */
export function getSupportedPlatforms() {
    const registry = IntegrationRegistry.getInstance();
    return registry.getSupportedPlatforms();
}
//# sourceMappingURL=integration-factory.js.map