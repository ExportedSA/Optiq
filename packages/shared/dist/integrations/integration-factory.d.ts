/**
 * Integration Factory
 *
 * Registry and factory for creating platform integrations
 */
import type { Integration, IntegrationFactory, PlatformCode, IntegrationConfig } from "./types";
/**
 * Integration constructor type
 */
type IntegrationConstructor = new (config: IntegrationConfig) => Integration;
/**
 * Integration registry and factory
 */
export declare class IntegrationRegistry implements IntegrationFactory {
    private static instance;
    private integrations;
    private constructor();
    /**
     * Get singleton instance
     */
    static getInstance(): IntegrationRegistry;
    /**
     * Register default integrations
     */
    private registerDefaults;
    /**
     * Register a new integration
     */
    register(platform: PlatformCode, integration: IntegrationConstructor): void;
    /**
     * Create integration instance
     */
    create(platform: PlatformCode, config: IntegrationConfig): Integration;
    /**
     * Get all supported platforms
     */
    getSupportedPlatforms(): PlatformCode[];
    /**
     * Check if platform is supported
     */
    isSupported(platform: PlatformCode): boolean;
}
export declare function registerIntegration(platform: PlatformCode, integration: IntegrationConstructor): void;
/**
 * Convenience function to get integration instance
 */
export declare function getIntegration(platform: PlatformCode, config: IntegrationConfig): Integration;
/**
 * Convenience function to check if platform is supported
 */
export declare function isPlatformSupported(platform: PlatformCode): boolean;
/**
 * Get all supported platforms
 */
export declare function getSupportedPlatforms(): PlatformCode[];
export {};
//# sourceMappingURL=integration-factory.d.ts.map