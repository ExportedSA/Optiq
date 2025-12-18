import { z } from "zod";

/**
 * Currency code (ISO 4217)
 */
export const CurrencySchema = z.string().length(3).toUpperCase().describe("ISO 4217 currency code (e.g., USD, EUR, GBP)");

/**
 * Customer identifiers schema
 * Supports email hash, phone hash, and custom IDs
 */
export const CustomerIdentifiersSchema = z.object({
  emailHash: z.string().length(64).optional().describe("SHA-256 hash of customer email (lowercase)"),
  phoneHash: z.string().length(64).optional().describe("SHA-256 hash of customer phone (E.164 format)"),
  customerId: z.string().max(128).optional().describe("Your internal customer ID"),
  externalId: z.string().max(128).optional().describe("External customer ID (e.g., from CRM)"),
}).refine(
  (data) => {
    // At least one identifier must be provided
    return data.emailHash || data.phoneHash || data.customerId || data.externalId;
  },
  {
    message: "At least one customer identifier is required",
  }
);

/**
 * Source metadata for attribution
 */
export const SourceMetadataSchema = z.object({
  utmSource: z.string().max(200).optional().describe("UTM source"),
  utmMedium: z.string().max(200).optional().describe("UTM medium"),
  utmCampaign: z.string().max(200).optional().describe("UTM campaign"),
  utmTerm: z.string().max(200).optional().describe("UTM term"),
  utmContent: z.string().max(200).optional().describe("UTM content"),
  gclid: z.string().max(200).optional().describe("Google Click ID"),
  fbclid: z.string().max(200).optional().describe("Facebook Click ID"),
  ttclid: z.string().max(200).optional().describe("TikTok Click ID"),
  referrer: z.string().url().max(2048).optional().describe("Referrer URL"),
  landingPage: z.string().url().max(2048).optional().describe("Landing page URL"),
});

/**
 * Line item schema for order details
 */
export const LineItemSchema = z.object({
  productId: z.string().max(128).describe("Product ID or SKU"),
  productName: z.string().max(256).optional().describe("Product name"),
  quantity: z.number().int().positive().describe("Quantity purchased"),
  unitPrice: z.number().nonnegative().describe("Unit price in base currency"),
  totalPrice: z.number().nonnegative().describe("Total price (quantity * unitPrice)"),
  category: z.string().max(128).optional().describe("Product category"),
  brand: z.string().max(128).optional().describe("Product brand"),
});

/**
 * Single conversion schema
 */
export const ConversionSchema = z.object({
  // Conversion identification
  conversionId: z.string().min(8).max(128).describe("Unique conversion ID (for deduplication)"),
  orderId: z.string().max(128).optional().describe("Order ID (for order-level deduplication)"),
  
  // Conversion details
  conversionName: z.string().min(1).max(200).describe("Conversion name (e.g., 'Purchase', 'Lead', 'Signup')"),
  value: z.number().nonnegative().describe("Conversion value in base currency"),
  currency: CurrencySchema.default("USD"),
  
  // Timing
  timestamp: z.number().int().positive().optional().describe("Unix timestamp in milliseconds"),
  
  // Customer identifiers
  customer: CustomerIdentifiersSchema.describe("Customer identifiers for matching"),
  
  // Tracking context
  anonymousId: z.string().min(8).max(128).describe("Anonymous user ID (cookie)"),
  sessionId: z.string().min(8).max(128).describe("Session ID"),
  
  // Attribution source
  source: SourceMetadataSchema.optional().describe("Source metadata for attribution"),
  
  // Order details
  lineItems: z.array(LineItemSchema).max(100).optional().describe("Order line items (max 100)"),
  
  // Additional metadata
  properties: z.record(z.string(), z.unknown()).optional().describe("Custom conversion properties"),
});

/**
 * Batch conversion ingestion request schema
 */
export const BatchConversionRequestSchema = z.object({
  conversions: z.array(ConversionSchema).min(1).max(100).describe("Array of conversions (max 100 per batch)"),
  siteKey: z.string().min(1).describe("Tracking site public key"),
});

/**
 * Conversion ingestion response schema
 */
export const ConversionIngestionResponseSchema = z.object({
  success: z.boolean(),
  accepted: z.number().int().nonnegative().describe("Number of conversions accepted"),
  rejected: z.number().int().nonnegative().describe("Number of conversions rejected"),
  duplicates: z.number().int().nonnegative().describe("Number of duplicate conversions"),
  errors: z.array(z.object({
    conversionId: z.string().optional(),
    orderId: z.string().optional(),
    index: z.number().int().nonnegative(),
    message: z.string(),
  })).optional().describe("Validation errors"),
});

/**
 * TypeScript types
 */
export type Currency = z.infer<typeof CurrencySchema>;
export type CustomerIdentifiers = z.infer<typeof CustomerIdentifiersSchema>;
export type SourceMetadata = z.infer<typeof SourceMetadataSchema>;
export type LineItem = z.infer<typeof LineItemSchema>;
export type Conversion = z.infer<typeof ConversionSchema>;
export type BatchConversionRequest = z.infer<typeof BatchConversionRequestSchema>;
export type ConversionIngestionResponse = z.infer<typeof ConversionIngestionResponseSchema>;
