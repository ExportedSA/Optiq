export {
  STRIPE_CONFIG,
  getPriceId,
  getTierFromPriceId,
  isStripeConfigured,
} from "./config";

export type { StripePriceConfig, StripeProductConfig } from "./config";

export {
  getStripe,
  createCustomer,
  createCheckoutSession,
  createPortalSession,
  getSubscription,
  cancelSubscription,
  updateSubscription,
  constructWebhookEvent,
} from "./client";

export {
  handleSubscriptionCreated,
  handleSubscriptionUpdated,
  handleSubscriptionDeleted,
  handleInvoicePaid,
  handleInvoicePaymentFailed,
} from "./webhooks";

export {
  getEntitlements,
  checkConnectorLimit,
  checkWorkspaceLimit,
  checkEventLimit,
  checkAttributionModel,
  checkAlertsEnabled,
  checkSsoEnabled,
} from "./entitlements";

export type { Entitlements, EntitlementCheck } from "./entitlements";

export {
  withEntitlementCheck,
  createEntitlementGuard,
  requireConnector,
  requireWorkspace,
  requireEvent,
  requireAlerts,
} from "./middleware";

export type { EntitlementType } from "./middleware";
