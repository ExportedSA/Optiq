import "server-only";
import type { AttributionModel as PrismaAttributionModel } from "@prisma/client";

// Re-export Prisma's AttributionModel enum
export type AttributionModel = PrismaAttributionModel;

export type TouchPointData = {
  id: string;
  siteId: string;
  anonId: string;
  sessionId: string;
  occurredAt: Date;

  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmTerm: string | null;
  utmContent: string | null;

  gclid: string | null;
  fbclid: string | null;
  ttclid: string | null;
  msclkid: string | null;
  clickId: string | null;

  referrer: string | null;
  landingUrl: string | null;

  platformCode: string | null;
  campaignId: string | null;
  adAccountId: string | null;
  adId: string | null;
};

export type ConversionData = {
  id: string;
  siteId: string;
  anonId: string;
  occurredAt: Date;
};

export type AttributionLinkInput = {
  siteId: string;
  conversionId: string;
  touchPointId: string;
  model: AttributionModel;
  weight: number;
  position: number;
  touchPointCount: number;
};

export function extractClickIds(url: string): {
  gclid: string | null;
  fbclid: string | null;
  ttclid: string | null;
  msclkid: string | null;
  clickId: string | null;
} {
  try {
    const u = new URL(url);
    return {
      gclid: u.searchParams.get("gclid"),
      fbclid: u.searchParams.get("fbclid"),
      ttclid: u.searchParams.get("ttclid"),
      msclkid: u.searchParams.get("msclkid"),
      clickId:
        u.searchParams.get("clickid") ??
        u.searchParams.get("click_id") ??
        null,
    };
  } catch {
    return {
      gclid: null,
      fbclid: null,
      ttclid: null,
      msclkid: null,
      clickId: null,
    };
  }
}

export function inferPlatformFromClickId(clickIds: {
  gclid: string | null;
  fbclid: string | null;
  ttclid: string | null;
  msclkid: string | null;
}): string | null {
  if (clickIds.gclid) return "GOOGLE_ADS";
  if (clickIds.fbclid) return "META";
  if (clickIds.ttclid) return "TIKTOK";
  if (clickIds.msclkid) return "LINKEDIN";
  return null;
}
