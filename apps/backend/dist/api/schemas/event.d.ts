import { z } from "zod";
/**
 * Event type enum matching Prisma schema
 */
export declare const EventTypeSchema: z.ZodEnum<{
    PAGE_VIEW: "PAGE_VIEW";
    CONVERSION: "CONVERSION";
    CUSTOM: "CUSTOM";
}>;
/**
 * UTM parameters schema
 */
export declare const UTMParametersSchema: z.ZodObject<{
    source: z.ZodOptional<z.ZodString>;
    medium: z.ZodOptional<z.ZodString>;
    campaign: z.ZodOptional<z.ZodString>;
    term: z.ZodOptional<z.ZodString>;
    content: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
/**
 * Single event schema for ingestion
 */
export declare const EventSchema: z.ZodObject<{
    eventId: z.ZodString;
    type: z.ZodEnum<{
        PAGE_VIEW: "PAGE_VIEW";
        CONVERSION: "CONVERSION";
        CUSTOM: "CUSTOM";
    }>;
    name: z.ZodOptional<z.ZodString>;
    timestamp: z.ZodOptional<z.ZodNumber>;
    url: z.ZodString;
    path: z.ZodString;
    referrer: z.ZodOptional<z.ZodString>;
    title: z.ZodOptional<z.ZodString>;
    anonymousId: z.ZodString;
    sessionId: z.ZodString;
    utm: z.ZodOptional<z.ZodObject<{
        source: z.ZodOptional<z.ZodString>;
        medium: z.ZodOptional<z.ZodString>;
        campaign: z.ZodOptional<z.ZodString>;
        term: z.ZodOptional<z.ZodString>;
        content: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    value: z.ZodOptional<z.ZodNumber>;
    properties: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strip>;
/**
 * Batch event ingestion request schema
 */
export declare const BatchEventRequestSchema: z.ZodObject<{
    events: z.ZodArray<z.ZodObject<{
        eventId: z.ZodString;
        type: z.ZodEnum<{
            PAGE_VIEW: "PAGE_VIEW";
            CONVERSION: "CONVERSION";
            CUSTOM: "CUSTOM";
        }>;
        name: z.ZodOptional<z.ZodString>;
        timestamp: z.ZodOptional<z.ZodNumber>;
        url: z.ZodString;
        path: z.ZodString;
        referrer: z.ZodOptional<z.ZodString>;
        title: z.ZodOptional<z.ZodString>;
        anonymousId: z.ZodString;
        sessionId: z.ZodString;
        utm: z.ZodOptional<z.ZodObject<{
            source: z.ZodOptional<z.ZodString>;
            medium: z.ZodOptional<z.ZodString>;
            campaign: z.ZodOptional<z.ZodString>;
            term: z.ZodOptional<z.ZodString>;
            content: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
        value: z.ZodOptional<z.ZodNumber>;
        properties: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>>;
    siteKey: z.ZodString;
}, z.core.$strip>;
/**
 * Event ingestion response schema
 */
export declare const EventIngestionResponseSchema: z.ZodObject<{
    success: z.ZodBoolean;
    accepted: z.ZodNumber;
    rejected: z.ZodNumber;
    duplicates: z.ZodNumber;
    errors: z.ZodOptional<z.ZodArray<z.ZodObject<{
        eventId: z.ZodOptional<z.ZodString>;
        index: z.ZodNumber;
        message: z.ZodString;
    }, z.core.$strip>>>;
}, z.core.$strip>;
/**
 * TypeScript types
 */
export type EventType = z.infer<typeof EventTypeSchema>;
export type UTMParameters = z.infer<typeof UTMParametersSchema>;
export type Event = z.infer<typeof EventSchema>;
export type BatchEventRequest = z.infer<typeof BatchEventRequestSchema>;
export type EventIngestionResponse = z.infer<typeof EventIngestionResponseSchema>;
//# sourceMappingURL=event.d.ts.map