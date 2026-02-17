import { useMemo } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { tokenManager } from "@/services/tokenManager";

export const usePermission = () => {
  const { user } = useAuthContext();

  const permissions = useMemo(() => {
    if (!user) return [];
    try {
      const permStr = localStorage.getItem("permissions");
      return permStr ? JSON.parse(permStr) : [];
    } catch {
      return [];
    }
  }, [user]);

  /**
   * Check if user has a specific permission with optional action
   * @param permissionName - Name or array of names of the permission to check
   * @param action - Optional action (view, create, update, delete, etc.)
   * @returns boolean indicating if user has permission
   */
  const hasPermission = (
    permissionName: string | string[],
    action?: string,
  ): boolean => {
    const names = Array.isArray(permissionName)
      ? permissionName
      : [permissionName];

    return names.some((name) => {
      const matchingPermissions = permissions.filter(
        (p: any) =>
          (typeof p === "string" && p === name) ||
          (typeof p === "object" &&
            (p.permissionName === name || p.permission?.name === name)),
      );

      if (matchingPermissions.length === 0) return false;

      // If any of them are just string permissions, they grant full access
      if (matchingPermissions.some((p: any) => typeof p === "string"))
        return true;

      // If no specific action required, having any match is enough
      if (!action) return true;

      // Check if specific action is allowed in ANY of the matching permissions
      return matchingPermissions.some((p: any) => {
        let actions = p.actions || {};
        if (typeof actions === "string") {
          try {
            actions = JSON.parse(actions);
          } catch {
            actions = {};
          }
        }
        return actions[action] === true;
      });
    });
  };

  // Convenience methods for common actions
  const canView = (permissionName: string) =>
    hasPermission(permissionName, "view");
  const canCreate = (permissionName: string) =>
    hasPermission(permissionName, "create");
  const canUpdate = (permissionName: string) =>
    hasPermission(permissionName, "update");
  const canDelete = (permissionName: string) =>
    hasPermission(permissionName, "delete");
  const canApprove = (permissionName: string) =>
    hasPermission(permissionName, "approve");
  const canExport = (permissionName: string) =>
    hasPermission(permissionName, "export");
  const canImport = (permissionName: string) =>
    hasPermission(permissionName, "import");

  const isLoggedIn = !!user && !!tokenManager.getAccessToken();

  return {
    hasPermission,
    canView,
    canCreate,
    canUpdate,
    canDelete,
    canApprove,
    canExport,
    canImport,
    permissions,
    isLoggedIn,
    roles: user?.roles || [],
    role: (() => {
      const roles = user?.roles || [];
      const priority = [
        "Super Admin",
        "Regional Admin",
        "Dispatcher",
        "Partner",
        "Chauffeur",
        "Staff Member",
        "SEO Agent",
      ];
      for (const r of priority) {
        if (roles.includes(r)) return r;
      }
      return roles[0] || "Super Admin";
    })(),
    hasRole: (role: string) => (user?.roles || []).includes(role),
    hasAnyRole: (roles: string[]) =>
      roles.some((r) => (user?.roles || []).includes(r)),
  };
};
