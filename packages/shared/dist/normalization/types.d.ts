import { z } from "zod";
export declare const ChannelSchema: z.ZodEnum<{
    GOOGLE_ADS: "GOOGLE_ADS";
    META: "META";
    TIKTOK: "TIKTOK";
    LINKEDIN: "LINKEDIN";
    X: "X";
}>;
export type Channel = z.infer<typeof ChannelSchema>;
export declare const IsoDateSchema: z.ZodString;
export type IsoDate = z.infer<typeof IsoDateSchema>;
export declare const NormalizedCostRowSchema: z.ZodObject<{
    channel: z.ZodEnum<{
        GOOGLE_ADS: "GOOGLE_ADS";
        META: "META";
        TIKTOK: "TIKTOK";
        LINKEDIN: "LINKEDIN";
        X: "X";
    }>;
    date: z.ZodString;
    campaign_id: z.ZodString;
    campaign_name: z.ZodOptional<z.ZodString>;
    adset_id: z.ZodOptional<z.ZodString>;
    adset_name: z.ZodOptional<z.ZodString>;
    ad_id: z.ZodOptional<z.ZodString>;
    ad_name: z.ZodOptional<z.ZodString>;
    spend_micros: z.ZodBigInt;
    clicks: z.ZodBigInt;
    impressions: z.ZodBigInt;
    publisher_platform: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type NormalizedCostRow = z.infer<typeof NormalizedCostRowSchema>;
//# sourceMappingURL=types.d.ts.map