import "server-only";

import { z } from "zod";

export type Platform = "GOOGLE_ADS" | "META" | "TIKTOK";

export type DailySyncPayload = {
  platform: Platform;
  externalAccountId: string; // customerId / act_123 / advertiserId
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  granularity: "campaign" | "ad";
};

export const DailySyncPayloadSchema = z.object({
  platform: z.enum(["GOOGLE_ADS", "META", "TIKTOK"]),
  externalAccountId: z.string().min(1),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  granularity: z.enum(["campaign", "ad"]),
});

export function buildIdempotencyKey(input: {
  organizationId: string;
  platform: Platform;
  externalAccountId: string;
  startDate: string;
  endDate: string;
  granularity: "campaign" | "ad";
}): string {
  return [
    "daily-sync",
    input.organizationId,
    input.platform,
    input.externalAccountId,
    input.startDate,
    input.endDate,
    input.granularity,
  ].join(":");
}
