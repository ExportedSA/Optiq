import "server-only";

import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  hasPermission,
  hasAnyPermission,
  isRoleAtLeast,
  type WorkspaceRole,
  type Permission,
} from "./rbac";

/**
 * Authorization Context
 * 
 * Contains user, organization, and role information for authorization checks.
 */
export interface AuthContext {
  userId: string;
  organizationId: string;
  role: WorkspaceRole;
  email: string;
}

export interface AuthResult {
  authorized: boolean;
  context?: AuthContext;
  error?: string;
  status?: number;
}

/**
 * Get authorization context for the current request
 * Returns null if not authenticated or no active organization
 */
export async function getAuthContext(): Promise<AuthContext | null> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || !session?.user?.activeOrgId) {
    return null;
  }

  const membership = await prisma.membership.findUnique({
    where: {
      userId_organizationId: {
        userId: session.user.id,
        organizationId: session.user.activeOrgId,
      },
    },
    select: { role: true },
  });

  if (!membership) {
    return null;
  }

  return {
    userId: session.user.id,
    organizationId: session.user.activeOrgId,
    role: membership.role as WorkspaceRole,
    email: session.user.email ?? "",
  };
}

/**
 * Require authentication and return auth context
 */
export async function requireAuth(): Promise<AuthResult> {
  const context = await getAuthContext();

  if (!context) {
    return {
      authorized: false,
      error: "Authentication required",
      status: 401,
    };
  }

  return {
    authorized: true,
    context,
  };
}

/**
 * Require a specific permission
 */
export async function requirePermission(permission: Permission): Promise<AuthResult> {
  const authResult = await requireAuth();

  if (!authResult.authorized || !authResult.context) {
    return authResult;
  }

  if (!hasPermission(authResult.context.role, permission)) {
    return {
      authorized: false,
      context: authResult.context,
      error: `Permission denied: ${permission}`,
      status: 403,
    };
  }

  return authResult;
}

/**
 * Require any of the specified permissions
 */
export async function requireAnyPermission(permissions: Permission[]): Promise<AuthResult> {
  const authResult = await requireAuth();

  if (!authResult.authorized || !authResult.context) {
    return authResult;
  }

  if (!hasAnyPermission(authResult.context.role, permissions)) {
    return {
      authorized: false,
      context: authResult.context,
      error: `Permission denied: requires one of ${permissions.join(", ")}`,
      status: 403,
    };
  }

  return authResult;
}

/**
 * Require a minimum role level
 */
export async function requireRole(minimumRole: WorkspaceRole): Promise<AuthResult> {
  const authResult = await requireAuth();

  if (!authResult.authorized || !authResult.context) {
    return authResult;
  }

  if (!isRoleAtLeast(authResult.context.role, minimumRole)) {
    return {
      authorized: false,
      context: authResult.context,
      error: `Role ${minimumRole} or higher required`,
      status: 403,
    };
  }

  return authResult;
}

/**
 * Create an error response for authorization failures
 */
export function authErrorResponse(result: AuthResult): NextResponse {
  return NextResponse.json(
    { error: result.error ?? "Unauthorized" },
    { status: result.status ?? 403 }
  );
}

/**
 * Verify that a resource belongs to the user's organization
 * This is critical for multi-tenant isolation
 */
export async function verifyResourceOwnership(
  context: AuthContext,
  resourceType: string,
  resourceId: string
): Promise<boolean> {
  switch (resourceType) {
    case "adAccount":
      return verifyAdAccountOwnership(context.organizationId, resourceId);
    case "campaign":
      return verifyCampaignOwnership(context.organizationId, resourceId);
    case "trackingSite":
      return verifyTrackingSiteOwnership(context.organizationId, resourceId);
    case "alertRule":
      return verifyAlertRuleOwnership(context.organizationId, resourceId);
    case "journey":
      return verifyJourneyOwnership(context.organizationId, resourceId);
    default:
      return false;
  }
}

async function verifyAdAccountOwnership(organizationId: string, resourceId: string): Promise<boolean> {
  const count = await prisma.adAccount.count({
    where: { id: resourceId, organizationId },
  });
  return count > 0;
}

async function verifyCampaignOwnership(organizationId: string, resourceId: string): Promise<boolean> {
  const count = await prisma.campaign.count({
    where: { id: resourceId, organizationId },
  });
  return count > 0;
}

async function verifyTrackingSiteOwnership(organizationId: string, resourceId: string): Promise<boolean> {
  const count = await prisma.trackingSite.count({
    where: { id: resourceId, organizationId },
  });
  return count > 0;
}

async function verifyAlertRuleOwnership(organizationId: string, resourceId: string): Promise<boolean> {
  const count = await prisma.alertRule.count({
    where: { id: resourceId, organizationId },
  });
  return count > 0;
}

async function verifyJourneyOwnership(organizationId: string, resourceId: string): Promise<boolean> {
  const count = await prisma.journey.count({
    where: { id: resourceId, organizationId },
  });
  return count > 0;
}

/**
 * Scoped query helper - ensures all queries are scoped to the user's organization
 * Use this to build tenant-isolated queries
 */
export function scopedWhere<T extends Record<string, unknown>>(
  context: AuthContext,
  additionalWhere?: T
): T & { organizationId: string } {
  return {
    ...additionalWhere,
    organizationId: context.organizationId,
  } as T & { organizationId: string };
}

/**
 * Verify membership in an organization
 */
export async function verifyMembership(
  userId: string,
  organizationId: string
): Promise<{ isMember: boolean; role?: WorkspaceRole }> {
  const membership = await prisma.membership.findUnique({
    where: {
      userId_organizationId: {
        userId,
        organizationId,
      },
    },
    select: { role: true },
  });

  if (!membership) {
    return { isMember: false };
  }

  return {
    isMember: true,
    role: membership.role as WorkspaceRole,
  };
}
