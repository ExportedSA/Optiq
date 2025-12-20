import { z } from "zod";
export const ChannelSchema = z.enum(["GOOGLE_ADS", "META", "TIKTOK", "LINKEDIN", "X"]);
export const IsoDateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
export const NormalizedCostRowSchema = z.object({
    channel: ChannelSchema,
    date: IsoDateSchema,
    campaign_id: z.string().min(1),
    campaign_name: z.string().min(1).optional(),
    adset_id: z.string().min(1).optional(),
    adset_name: z.string().min(1).optional(),
    ad_id: z.string().min(1).optional(),
    ad_name: z.string().min(1).optional(),
    spend_micros: z.bigint().nonnegative(),
    clicks: z.bigint().nonnegative(),
    impressions: z.bigint().nonnegative(),
    publisher_platform: z.string().min(1).optional(),
});
//# sourceMappingURL=types.js.map