import "server-only";

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import {
  checkConnectorLimit,
  checkWorkspaceLimit,
  checkEventLimit,
  checkAlertsEnabled,
  checkAttributionModel,
  type EntitlementCheck,
} from "./entitlements";
import type { AttributionModel } from "@optiq/shared";

export type EntitlementType =
  | "connector"
  | "workspace"
  | "event"
  | "alerts"
  | { attribution: AttributionModel };

export async function withEntitlementCheck(
  req: NextRequest,
  entitlement: EntitlementType,
  handler: () => Promise<NextResponse>
): Promise<NextResponse> {
  const session = await getServerSession(authOptions);
  const orgId = session?.user?.activeOrgId;

  if (!orgId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let check: EntitlementCheck;

  if (typeof entitlement === "object" && "attribution" in entitlement) {
    check = await checkAttributionModel(orgId, entitlement.attribution);
  } else {
    switch (entitlement) {
      case "connector":
        check = await checkConnectorLimit(orgId);
        break;
      case "workspace":
        check = await checkWorkspaceLimit(orgId);
        break;
      case "event":
        check = await checkEventLimit(orgId);
        break;
      case "alerts":
        check = await checkAlertsEnabled(orgId);
        break;
      default:
        check = { allowed: true };
    }
  }

  if (!check.allowed) {
    return NextResponse.json(
      {
        error: "entitlement_exceeded",
        message: check.reason,
        upgradeRequired: check.upgradeRequired,
      },
      { status: 403 }
    );
  }

  return handler();
}

export function createEntitlementGuard(entitlement: EntitlementType) {
  return async function guard(orgId: string): Promise<EntitlementCheck> {
    if (typeof entitlement === "object" && "attribution" in entitlement) {
      return checkAttributionModel(orgId, entitlement.attribution);
    }

    switch (entitlement) {
      case "connector":
        return checkConnectorLimit(orgId);
      case "workspace":
        return checkWorkspaceLimit(orgId);
      case "event":
        return checkEventLimit(orgId);
      case "alerts":
        return checkAlertsEnabled(orgId);
      default:
        return { allowed: true };
    }
  };
}

export const requireConnector = createEntitlementGuard("connector");
export const requireWorkspace = createEntitlementGuard("workspace");
export const requireEvent = createEntitlementGuard("event");
export const requireAlerts = createEntitlementGuard("alerts");
