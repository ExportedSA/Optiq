import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { getAlertSettings, updateAlertSettings } from "@/lib/settings";
import type { AlertSettingsUpdate } from "@/lib/settings";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const orgId = session?.user?.activeOrgId;

    if (!orgId) {
      return NextResponse.json({ error: "No active organization" }, { status: 400 });
    }

    const settings = await getAlertSettings(orgId);
    return NextResponse.json(settings);
  } catch (error) {
    console.error("Failed to get alert settings:", error);
    return NextResponse.json({ error: "Failed to get settings" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const orgId = session?.user?.activeOrgId;

    if (!orgId) {
      return NextResponse.json({ error: "No active organization" }, { status: 400 });
    }

    const body = (await request.json()) as AlertSettingsUpdate;
    const settings = await updateAlertSettings(orgId, body);

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Failed to update alert settings:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
