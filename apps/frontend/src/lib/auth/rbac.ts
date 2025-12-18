import "server-only";

/**
 * Role-Based Access Control (RBAC)
 * 
 * Workspace roles: OWNER > ADMIN > MEMBER > VIEWER
 * Each role inherits permissions from lower roles.
 */

export type WorkspaceRole = "OWNER" | "ADMIN" | "MEMBER" | "VIEWER";

export type Permission =
  // Organization management
  | "org:read"
  | "org:update"
  | "org:delete"
  | "org:manage_billing"
  | "org:manage_members"
  | "org:transfer_ownership"
  // Ad accounts & connectors
  | "connectors:read"
  | "connectors:create"
  | "connectors:update"
  | "connectors:delete"
  // Campaigns & ads
  | "campaigns:read"
  | "campaigns:create"
  | "campaigns:update"
  | "campaigns:delete"
  // Tracking & attribution
  | "tracking:read"
  | "tracking:create"
  | "tracking:update"
  | "tracking:delete"
  // Journeys
  | "journeys:read"
  | "journeys:create"
  | "journeys:update"
  | "journeys:delete"
  // Alerts
  | "alerts:read"
  | "alerts:create"
  | "alerts:update"
  | "alerts:delete"
  | "alerts:acknowledge"
  // Settings
  | "settings:read"
  | "settings:update"
  // Reports & analytics
  | "reports:read"
  | "reports:export"
  // API keys
  | "api_keys:read"
  | "api_keys:create"
  | "api_keys:delete";

/**
 * Permission matrix by role
 * Each role includes all permissions of roles below it
 */
const ROLE_PERMISSIONS: Record<WorkspaceRole, Permission[]> = {
  VIEWER: [
    "org:read",
    "connectors:read",
    "campaigns:read",
    "tracking:read",
    "journeys:read",
    "alerts:read",
    "settings:read",
    "reports:read",
  ],

  MEMBER: [
    // Inherits VIEWER permissions
    "org:read",
    "connectors:read",
    "campaigns:read",
    "tracking:read",
    "journeys:read",
    "alerts:read",
    "settings:read",
    "reports:read",
    // Additional permissions
    "campaigns:create",
    "campaigns:update",
    "tracking:create",
    "tracking:update",
    "journeys:create",
    "journeys:update",
    "alerts:create",
    "alerts:update",
    "alerts:acknowledge",
    "reports:export",
  ],

  ADMIN: [
    // Inherits MEMBER permissions
    "org:read",
    "connectors:read",
    "campaigns:read",
    "tracking:read",
    "journeys:read",
    "alerts:read",
    "settings:read",
    "reports:read",
    "campaigns:create",
    "campaigns:update",
    "tracking:create",
    "tracking:update",
    "journeys:create",
    "journeys:update",
    "alerts:create",
    "alerts:update",
    "alerts:acknowledge",
    "reports:export",
    // Additional permissions
    "org:update",
    "org:manage_members",
    "connectors:create",
    "connectors:update",
    "connectors:delete",
    "campaigns:delete",
    "tracking:delete",
    "journeys:delete",
    "alerts:delete",
    "settings:update",
    "api_keys:read",
    "api_keys:create",
    "api_keys:delete",
  ],

  OWNER: [
    // All permissions
    "org:read",
    "org:update",
    "org:delete",
    "org:manage_billing",
    "org:manage_members",
    "org:transfer_ownership",
    "connectors:read",
    "connectors:create",
    "connectors:update",
    "connectors:delete",
    "campaigns:read",
    "campaigns:create",
    "campaigns:update",
    "campaigns:delete",
    "tracking:read",
    "tracking:create",
    "tracking:update",
    "tracking:delete",
    "journeys:read",
    "journeys:create",
    "journeys:update",
    "journeys:delete",
    "alerts:read",
    "alerts:create",
    "alerts:update",
    "alerts:delete",
    "alerts:acknowledge",
    "settings:read",
    "settings:update",
    "reports:read",
    "reports:export",
    "api_keys:read",
    "api_keys:create",
    "api_keys:delete",
  ],
};

/**
 * Role hierarchy (higher index = more permissions)
 */
const ROLE_HIERARCHY: WorkspaceRole[] = ["VIEWER", "MEMBER", "ADMIN", "OWNER"];

export function hasPermission(role: WorkspaceRole, permission: Permission): boolean {
  const permissions = ROLE_PERMISSIONS[role];
  return permissions?.includes(permission) ?? false;
}

export function hasAnyPermission(role: WorkspaceRole, permissions: Permission[]): boolean {
  return permissions.some((p) => hasPermission(role, p));
}

export function hasAllPermissions(role: WorkspaceRole, permissions: Permission[]): boolean {
  return permissions.every((p) => hasPermission(role, p));
}

export function getRolePermissions(role: WorkspaceRole): Permission[] {
  return ROLE_PERMISSIONS[role] ?? [];
}

export function isRoleAtLeast(role: WorkspaceRole, minimumRole: WorkspaceRole): boolean {
  const roleIndex = ROLE_HIERARCHY.indexOf(role);
  const minIndex = ROLE_HIERARCHY.indexOf(minimumRole);
  return roleIndex >= minIndex;
}

export function canManageRole(actorRole: WorkspaceRole, targetRole: WorkspaceRole): boolean {
  // Can only manage roles below your own
  const actorIndex = ROLE_HIERARCHY.indexOf(actorRole);
  const targetIndex = ROLE_HIERARCHY.indexOf(targetRole);
  return actorIndex > targetIndex;
}

export function getAssignableRoles(actorRole: WorkspaceRole): WorkspaceRole[] {
  const actorIndex = ROLE_HIERARCHY.indexOf(actorRole);
  // Can assign roles below your own
  return ROLE_HIERARCHY.slice(0, actorIndex);
}

export function getRoleDisplayName(role: WorkspaceRole): string {
  const names: Record<WorkspaceRole, string> = {
    OWNER: "Owner",
    ADMIN: "Admin",
    MEMBER: "Member",
    VIEWER: "Viewer",
  };
  return names[role] ?? role;
}

export function getRoleDescription(role: WorkspaceRole): string {
  const descriptions: Record<WorkspaceRole, string> = {
    OWNER: "Full access including billing and ownership transfer",
    ADMIN: "Can manage members, connectors, and all settings",
    MEMBER: "Can create and edit campaigns, tracking, and alerts",
    VIEWER: "Read-only access to all data",
  };
  return descriptions[role] ?? "";
}
