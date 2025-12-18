// Re-export from main auth file
export { authOptions, authHandler } from "../auth";

// RBAC exports
export {
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  getRolePermissions,
  isRoleAtLeast,
  canManageRole,
  getAssignableRoles,
  getRoleDisplayName,
  getRoleDescription,
} from "./rbac";

export type { WorkspaceRole, Permission } from "./rbac";

// Authorization exports
export {
  getAuthContext,
  requireAuth,
  requirePermission,
  requireAnyPermission,
  requireRole,
  authErrorResponse,
  verifyResourceOwnership,
  verifyMembership,
  scopedWhere,
} from "./authorization";

export type { AuthContext, AuthResult } from "./authorization";

// Rate limiting exports
export {
  checkRateLimit,
  rateLimitByIp,
  rateLimitByOrg,
  rateLimitByUser,
  rateLimitByApiKey,
  combinedRateLimit,
  getRateLimitHeaders,
  getClientIp,
  RATE_LIMITS,
} from "./rate-limit";

export type { RateLimitConfig, RateLimitResult } from "./rate-limit";

// Middleware exports
export {
  withAuth,
  withRateLimit,
  withResourceOwnership,
  withIngestProtection,
} from "./middleware";

export type { ProtectedRouteOptions, ProtectedHandler } from "./middleware";
