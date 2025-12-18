/**
 * Integration Framework
 * 
 * Unified interface for ad platform integrations
 * 
 * ## Overview
 * 
 * This framework provides a plug-in architecture for adding new ad platform integrations.
 * Each integration implements a standard interface with methods for:
 * - OAuth connection flow (connect, completeConnection, refreshToken)
 * - Data synchronization (syncAccounts, syncCampaigns, syncAds, syncCosts)
 * - Connection management (testConnection, disconnect)
 * 
 * ## Adding a New Integration
 * 
 * 1. Create a new class extending `BaseIntegration`
 * 2. Implement all abstract methods
 * 3. Register in `IntegrationRegistry`
 * 4. Add platform-specific configuration
 * 
 * ## Example Usage
 * 
 * ```typescript
 * import { getIntegration } from '@optiq/shared/integrations';
 * 
 * // Create integration instance
 * const googleAds = getIntegration('GOOGLE_ADS', {
 *   clientId: process.env.GOOGLE_CLIENT_ID,
 *   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
 *   redirectUri: 'https://app.optiq.com/oauth/callback'
 * });
 * 
 * // Start OAuth flow
 * const authUrl = await googleAds.connect({
 *   organizationId: 'org_123',
 *   state: 'random_state'
 * });
 * 
 * // Complete connection
 * const result = await googleAds.completeConnection('org_123', authCode);
 * 
 * // Sync data
 * await googleAds.syncCampaigns('org_123', 'account_123', {
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-01-31')
 * });
 * ```
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
  IntegrationCore,
  Integration,
  IntegrationConfig,
  IntegrationFactory,
} from "./types";

// Base class
export { BaseIntegration } from "./base-integration";

// Example integration
export { GoogleAdsIntegration } from "./google-ads-integration";

export { ExampleStubIntegration } from "./example-stub-integration";

// Factory
export {
  IntegrationRegistry,
  registerIntegration,
  getIntegration,
  isPlatformSupported,
  getSupportedPlatforms,
} from "./integration-factory";
