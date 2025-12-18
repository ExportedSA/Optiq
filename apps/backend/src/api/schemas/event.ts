import { z } from "zod";

/**
 * Event type enum matching Prisma schema
 */
export const EventTypeSchema = z.enum(["PAGE_VIEW", "CONVERSION", "CUSTOM"]);

/**
 * UTM parameters schema
 */
export const UTMParametersSchema = z.object({
  source: z.string().max(200).optional(),
  medium: z.string().max(200).optional(),
  campaign: z.string().max(200).optional(),
  term: z.string().max(200).optional(),
  content: z.string().max(200).optional(),
});

/**
 * Single event schema for ingestion
 */
export const EventSchema = z.object({
  // Event identification
  eventId: z.string().min(8).max(128).describe("Client-generated unique event ID"),
  type: EventTypeSchema.describe("Event type"),
  name: z.string().min(1).max(200).optional().describe("Event name (required for CONVERSION and CUSTOM)"),
  
  // Timing
  timestamp: z.number().int().positive().optional().describe("Unix timestamp in milliseconds"),
  
  // Page context
  url: z.string().url().max(2048).describe("Full page URL"),
  path: z.string().min(1).max(2048).describe("URL path"),
  referrer: z.string().url().max(2048).optional().describe("Referrer URL"),
  title: z.string().max(512).optional().describe("Page title"),
  
  // User identification
  anonymousId: z.string().min(8).max(128).describe("Anonymous user ID (cookie)"),
  sessionId: z.string().min(8).max(128).describe("Session ID"),
  
  // Attribution
  utm: UTMParametersSchema.optional().describe("UTM parameters"),
  
  // Conversion value (for CONVERSION events)
  value: z.number().nonnegative().optional().describe("Conversion value in base currency"),
  
  // Custom properties
  properties: z.record(z.string(), z.unknown()).optional().describe("Custom event properties"),
}).refine(
  (data) => {
    // Require name for CONVERSION and CUSTOM events
    if ((data.type === "CONVERSION" || data.type === "CUSTOM") && !data.name) {
      return false;
    }
    return true;
  },
  {
    message: "Event name is required for CONVERSION and CUSTOM events",
    path: ["name"],
  }
);

/**
 * Batch event ingestion request schema
 */
export const BatchEventRequestSchema = z.object({
  events: z.array(EventSchema).min(1).max(100).describe("Array of events (max 100 per batch)"),
  siteKey: z.string().min(1).describe("Tracking site public key"),
});

/**
 * Event ingestion response schema
 */
export const EventIngestionResponseSchema = z.object({
  success: z.boolean(),
  accepted: z.number().int().nonnegative().describe("Number of events accepted"),
  rejected: z.number().int().nonnegative().describe("Number of events rejected"),
  duplicates: z.number().int().nonnegative().describe("Number of duplicate events"),
  errors: z.array(z.object({
    eventId: z.string().optional(),
    index: z.number().int().nonnegative(),
    message: z.string(),
  })).optional().describe("Validation errors"),
});

/**
 * TypeScript types
 */
export type EventType = z.infer<typeof EventTypeSchema>;
export type UTMParameters = z.infer<typeof UTMParametersSchema>;
export type Event = z.infer<typeof EventSchema>;
export type BatchEventRequest = z.infer<typeof BatchEventRequestSchema>;
export type EventIngestionResponse = z.infer<typeof EventIngestionResponseSchema>;
