/**
 * Meta OAuth Connect Endpoint
 * 
 * Initiates OAuth flow for Meta (Facebook) Ads
 */

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const runtime = "nodejs";

/**
 * GET /api/integrations/meta/connect
 * Redirect to Meta OAuth authorization
 */
export async function GET(request: Request) {
  try {
    // Authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const organizationId = session.user.activeOrgId;
    if (!organizationId) {
      return NextResponse.json(
        { error: "No active organization" },
        { status: 400 }
      );
    }

    // Meta OAuth configuration
    const clientId = process.env.META_APP_ID;
    const redirectUri = `${process.env.NEXTAUTH_URL}/api/integrations/meta/callback`;

    if (!clientId) {
      return NextResponse.json(
        { error: "Meta OAuth not configured" },
        { status: 500 }
      );
    }

    // Scopes for Meta Ads API
    const scopes = [
      "ads_management",
      "ads_read",
      "business_management",
    ].join(",");

    // State parameter to prevent CSRF (include org ID)
    const state = Buffer.from(
      JSON.stringify({
        organizationId,
        timestamp: Date.now(),
      })
    ).toString("base64");

    // Build authorization URL
    const authUrl = new URL("https://www.facebook.com/v18.0/dialog/oauth");
    authUrl.searchParams.set("client_id", clientId);
    authUrl.searchParams.set("redirect_uri", redirectUri);
    authUrl.searchParams.set("scope", scopes);
    authUrl.searchParams.set("state", state);
    authUrl.searchParams.set("response_type", "code");

    // Redirect to Meta OAuth
    return NextResponse.redirect(authUrl.toString());
  } catch (error) {
    console.error("Meta OAuth connect error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
