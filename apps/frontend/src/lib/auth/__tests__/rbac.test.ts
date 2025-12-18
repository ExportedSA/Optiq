import { describe, it, expect } from "vitest";
import {
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  isRoleAtLeast,
  canManageRole,
  getAssignableRoles,
  getRolePermissions,
  type WorkspaceRole,
  type Permission,
} from "../rbac";

describe("RBAC", () => {
  describe("hasPermission", () => {
    it("VIEWER can read but not write", () => {
      expect(hasPermission("VIEWER", "org:read")).toBe(true);
      expect(hasPermission("VIEWER", "campaigns:read")).toBe(true);
      expect(hasPermission("VIEWER", "campaigns:create")).toBe(false);
      expect(hasPermission("VIEWER", "org:update")).toBe(false);
    });

    it("MEMBER can create and update but not delete", () => {
      expect(hasPermission("MEMBER", "campaigns:create")).toBe(true);
      expect(hasPermission("MEMBER", "campaigns:update")).toBe(true);
      expect(hasPermission("MEMBER", "campaigns:delete")).toBe(false);
      expect(hasPermission("MEMBER", "alerts:acknowledge")).toBe(true);
    });

    it("ADMIN can manage most resources", () => {
      expect(hasPermission("ADMIN", "campaigns:delete")).toBe(true);
      expect(hasPermission("ADMIN", "connectors:create")).toBe(true);
      expect(hasPermission("ADMIN", "org:manage_members")).toBe(true);
      expect(hasPermission("ADMIN", "settings:update")).toBe(true);
      expect(hasPermission("ADMIN", "org:manage_billing")).toBe(false);
    });

    it("OWNER has all permissions", () => {
      expect(hasPermission("OWNER", "org:delete")).toBe(true);
      expect(hasPermission("OWNER", "org:manage_billing")).toBe(true);
      expect(hasPermission("OWNER", "org:transfer_ownership")).toBe(true);
    });
  });

  describe("hasAnyPermission", () => {
    it("returns true if any permission matches", () => {
      expect(hasAnyPermission("VIEWER", ["campaigns:create", "campaigns:read"])).toBe(true);
      expect(hasAnyPermission("VIEWER", ["campaigns:create", "campaigns:delete"])).toBe(false);
    });
  });

  describe("hasAllPermissions", () => {
    it("returns true only if all permissions match", () => {
      expect(hasAllPermissions("ADMIN", ["campaigns:create", "campaigns:delete"])).toBe(true);
      expect(hasAllPermissions("MEMBER", ["campaigns:create", "campaigns:delete"])).toBe(false);
    });
  });

  describe("isRoleAtLeast", () => {
    it("correctly compares role hierarchy", () => {
      expect(isRoleAtLeast("OWNER", "VIEWER")).toBe(true);
      expect(isRoleAtLeast("OWNER", "OWNER")).toBe(true);
      expect(isRoleAtLeast("ADMIN", "OWNER")).toBe(false);
      expect(isRoleAtLeast("VIEWER", "MEMBER")).toBe(false);
      expect(isRoleAtLeast("MEMBER", "MEMBER")).toBe(true);
    });
  });

  describe("canManageRole", () => {
    it("can only manage roles below own level", () => {
      expect(canManageRole("OWNER", "ADMIN")).toBe(true);
      expect(canManageRole("OWNER", "MEMBER")).toBe(true);
      expect(canManageRole("OWNER", "VIEWER")).toBe(true);
      expect(canManageRole("ADMIN", "MEMBER")).toBe(true);
      expect(canManageRole("ADMIN", "ADMIN")).toBe(false);
      expect(canManageRole("ADMIN", "OWNER")).toBe(false);
      expect(canManageRole("MEMBER", "VIEWER")).toBe(true);
      expect(canManageRole("MEMBER", "MEMBER")).toBe(false);
      expect(canManageRole("VIEWER", "VIEWER")).toBe(false);
    });
  });

  describe("getAssignableRoles", () => {
    it("returns roles below the actor role", () => {
      expect(getAssignableRoles("OWNER")).toEqual(["VIEWER", "MEMBER", "ADMIN"]);
      expect(getAssignableRoles("ADMIN")).toEqual(["VIEWER", "MEMBER"]);
      expect(getAssignableRoles("MEMBER")).toEqual(["VIEWER"]);
      expect(getAssignableRoles("VIEWER")).toEqual([]);
    });
  });

  describe("getRolePermissions", () => {
    it("returns all permissions for a role", () => {
      const viewerPerms = getRolePermissions("VIEWER");
      expect(viewerPerms).toContain("org:read");
      expect(viewerPerms).not.toContain("org:update");

      const ownerPerms = getRolePermissions("OWNER");
      expect(ownerPerms).toContain("org:transfer_ownership");
    });
  });
});
