import { z } from "zod";
/**
 * Currency code (ISO 4217)
 */
export declare const CurrencySchema: z.ZodString;
/**
 * Customer identifiers schema
 * Supports email hash, phone hash, and custom IDs
 */
export declare const CustomerIdentifiersSchema: z.ZodObject<{
    emailHash: z.ZodOptional<z.ZodString>;
    phoneHash: z.ZodOptional<z.ZodString>;
    customerId: z.ZodOptional<z.ZodString>;
    externalId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
/**
 * Source metadata for attribution
 */
export declare const SourceMetadataSchema: z.ZodObject<{
    utmSource: z.ZodOptional<z.ZodString>;
    utmMedium: z.ZodOptional<z.ZodString>;
    utmCampaign: z.ZodOptional<z.ZodString>;
    utmTerm: z.ZodOptional<z.ZodString>;
    utmContent: z.ZodOptional<z.ZodString>;
    gclid: z.ZodOptional<z.ZodString>;
    fbclid: z.ZodOptional<z.ZodString>;
    ttclid: z.ZodOptional<z.ZodString>;
    referrer: z.ZodOptional<z.ZodString>;
    landingPage: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
/**
 * Line item schema for order details
 */
export declare const LineItemSchema: z.ZodObject<{
    productId: z.ZodString;
    productName: z.ZodOptional<z.ZodString>;
    quantity: z.ZodNumber;
    unitPrice: z.ZodNumber;
    totalPrice: z.ZodNumber;
    category: z.ZodOptional<z.ZodString>;
    brand: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
/**
 * Single conversion schema
 */
export declare const ConversionSchema: z.ZodObject<{
    conversionId: z.ZodString;
    orderId: z.ZodOptional<z.ZodString>;
    conversionName: z.ZodString;
    value: z.ZodNumber;
    currency: z.ZodDefault<z.ZodString>;
    timestamp: z.ZodOptional<z.ZodNumber>;
    customer: z.ZodObject<{
        emailHash: z.ZodOptional<z.ZodString>;
        phoneHash: z.ZodOptional<z.ZodString>;
        customerId: z.ZodOptional<z.ZodString>;
        externalId: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
    anonymousId: z.ZodString;
    sessionId: z.ZodString;
    source: z.ZodOptional<z.ZodObject<{
        utmSource: z.ZodOptional<z.ZodString>;
        utmMedium: z.ZodOptional<z.ZodString>;
        utmCampaign: z.ZodOptional<z.ZodString>;
        utmTerm: z.ZodOptional<z.ZodString>;
        utmContent: z.ZodOptional<z.ZodString>;
        gclid: z.ZodOptional<z.ZodString>;
        fbclid: z.ZodOptional<z.ZodString>;
        ttclid: z.ZodOptional<z.ZodString>;
        referrer: z.ZodOptional<z.ZodString>;
        landingPage: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    lineItems: z.ZodOptional<z.ZodArray<z.ZodObject<{
        productId: z.ZodString;
        productName: z.ZodOptional<z.ZodString>;
        quantity: z.ZodNumber;
        unitPrice: z.ZodNumber;
        totalPrice: z.ZodNumber;
        category: z.ZodOptional<z.ZodString>;
        brand: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>>;
    properties: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strip>;
/**
 * Batch conversion ingestion request schema
 */
export declare const BatchConversionRequestSchema: z.ZodObject<{
    conversions: z.ZodArray<z.ZodObject<{
        conversionId: z.ZodString;
        orderId: z.ZodOptional<z.ZodString>;
        conversionName: z.ZodString;
        value: z.ZodNumber;
        currency: z.ZodDefault<z.ZodString>;
        timestamp: z.ZodOptional<z.ZodNumber>;
        customer: z.ZodObject<{
            emailHash: z.ZodOptional<z.ZodString>;
            phoneHash: z.ZodOptional<z.ZodString>;
            customerId: z.ZodOptional<z.ZodString>;
            externalId: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
        anonymousId: z.ZodString;
        sessionId: z.ZodString;
        source: z.ZodOptional<z.ZodObject<{
            utmSource: z.ZodOptional<z.ZodString>;
            utmMedium: z.ZodOptional<z.ZodString>;
            utmCampaign: z.ZodOptional<z.ZodString>;
            utmTerm: z.ZodOptional<z.ZodString>;
            utmContent: z.ZodOptional<z.ZodString>;
            gclid: z.ZodOptional<z.ZodString>;
            fbclid: z.ZodOptional<z.ZodString>;
            ttclid: z.ZodOptional<z.ZodString>;
            referrer: z.ZodOptional<z.ZodString>;
            landingPage: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
        lineItems: z.ZodOptional<z.ZodArray<z.ZodObject<{
            productId: z.ZodString;
            productName: z.ZodOptional<z.ZodString>;
            quantity: z.ZodNumber;
            unitPrice: z.ZodNumber;
            totalPrice: z.ZodNumber;
            category: z.ZodOptional<z.ZodString>;
            brand: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>>;
        properties: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>>;
    siteKey: z.ZodString;
}, z.core.$strip>;
/**
 * Conversion ingestion response schema
 */
export declare const ConversionIngestionResponseSchema: z.ZodObject<{
    success: z.ZodBoolean;
    accepted: z.ZodNumber;
    rejected: z.ZodNumber;
    duplicates: z.ZodNumber;
    errors: z.ZodOptional<z.ZodArray<z.ZodObject<{
        conversionId: z.ZodOptional<z.ZodString>;
        orderId: z.ZodOptional<z.ZodString>;
        index: z.ZodNumber;
        message: z.ZodString;
    }, z.core.$strip>>>;
}, z.core.$strip>;
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
//# sourceMappingURL=conversion.d.ts.map