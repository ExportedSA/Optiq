/**
 * Integration Framework
 * 
 * Unified interface for ad platform integrations
 */

// Types
export type {
  PlatformCode,
  IntegrationStatus,
  OAuthToken,
  ConnectionParams,
  ConnectionResult,
  AccountMetadata,
  CampaignData,
  AdData,
  CostMetrics,
  SyncOptions,
  SyncResult,
  Integration,
  IntegrationConfig,
  IntegrationFactory,
} from "./types";

// Base class
export { BaseIntegration } from "./base-integration";

// Example integration
export { GoogleAdsIntegration } from "./google-ads-integration";

// Factory
export {
  IntegrationRegistry,
  getIntegration,
  isPlatformSupported,
  getSupportedPlatforms,
} from "./integration-factory";
