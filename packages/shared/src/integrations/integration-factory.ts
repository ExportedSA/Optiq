/**
 * Integration Factory
 * 
 * Registry and factory for creating platform integrations
 */

import type { Integration, IntegrationFactory, PlatformCode, IntegrationConfig } from "./types";
import { GoogleAdsIntegration } from "./google-ads-integration";

/**
 * Integration constructor type
 */
type IntegrationConstructor = new (config: IntegrationConfig) => Integration;

/**
 * Integration registry and factory
 */
export class IntegrationRegistry implements IntegrationFactory {
  private static instance: IntegrationRegistry;
  private integrations: Map<PlatformCode, IntegrationConstructor>;

  private constructor() {
    this.integrations = new Map();
    this.registerDefaults();
  }

  /**
   * Get singleton instance
   */
  static getInstance(): IntegrationRegistry {
    if (!IntegrationRegistry.instance) {
      IntegrationRegistry.instance = new IntegrationRegistry();
    }
    return IntegrationRegistry.instance;
  }

  /**
   * Register default integrations
   */
  private registerDefaults(): void {
    this.register("GOOGLE_ADS", GoogleAdsIntegration);
    // TODO: Register other platforms
    // this.register("META", MetaAdsIntegration);
    // this.register("TIKTOK", TikTokAdsIntegration);
  }

  /**
   * Register a new integration
   */
  register(platform: PlatformCode, integration: IntegrationConstructor): void {
    this.integrations.set(platform, integration);
  }

  /**
   * Create integration instance
   */
  create(platform: PlatformCode, config: IntegrationConfig): Integration {
    const IntegrationClass = this.integrations.get(platform);

    if (!IntegrationClass) {
      throw new Error(`Integration not found for platform: ${platform}`);
    }

    return new IntegrationClass(config);
  }

  /**
   * Get all supported platforms
   */
  getSupportedPlatforms(): PlatformCode[] {
    return Array.from(this.integrations.keys());
  }

  /**
   * Check if platform is supported
   */
  isSupported(platform: PlatformCode): boolean {
    return this.integrations.has(platform);
  }
}

/**
 * Convenience function to get integration instance
 */
export function getIntegration(
  platform: PlatformCode,
  config: IntegrationConfig,
): Integration {
  const registry = IntegrationRegistry.getInstance();
  return registry.create(platform, config);
}

/**
 * Convenience function to check if platform is supported
 */
export function isPlatformSupported(platform: PlatformCode): boolean {
  const registry = IntegrationRegistry.getInstance();
  return registry.isSupported(platform);
}

/**
 * Get all supported platforms
 */
export function getSupportedPlatforms(): PlatformCode[] {
  const registry = IntegrationRegistry.getInstance();
  return registry.getSupportedPlatforms();
}
