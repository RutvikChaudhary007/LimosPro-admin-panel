import { useMemo } from "react";

export const usePermission = () => {
  const permissions = useMemo(() => {
    try {
      const permStr = localStorage.getItem("permissions");
      return permStr ? JSON.parse(permStr) : [];
    } catch {
      return [];
    }
  }, []);

  const user = useMemo(() => {
    try {
      const userStr = localStorage.getItem("user");
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  }, []);

  /**
   * Check if user has a specific permission with optional action
   * @param permissionName - Name of the permission to check
   * @param action - Optional action (view, create, update, delete, etc.)
   * @returns boolean indicating if user has permission
   */
  const hasPermission = (permissionName: string, action?: string): boolean => {
    // Super Admin has all permissions
    const userRoles = [user?.role, user?.roles].flat().filter(Boolean);
    if (userRoles.includes("Super Admin")) {
      return true;
    }

    const permission = permissions.find(
      (p: any) =>
        (typeof p === "string" && p === permissionName) ||
        (typeof p === "object" &&
          (p.permissionName === permissionName ||
            p.permission?.name === permissionName)),
    );

    if (!permission) return false;

    // If it's a string permission, we just check if it exists
    if (typeof permission === "string") return true;

    // If no specific action required, just check if permission exists
    if (!action) return true;

    // Check if specific action is allowed
    // Actions can be in permission.actions (object) or permission.actions (JSON string if not parsed)
    let actions = (permission as any).actions || {};
    if (typeof actions === "string") {
      try {
        actions = JSON.parse(actions);
      } catch {
        actions = {};
      }
    }

    return actions[action] === true;
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

  const isLoggedIn =
    (!!user || !!localStorage.getItem("user")) &&
    !!localStorage.getItem("accessToken");

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
    user,
    isLoggedIn,
    role:
      user?.role || (Array.isArray(user?.roles) ? user?.roles[0] : user?.roles),
  };
};
