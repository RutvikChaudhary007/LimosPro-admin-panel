import { ROUTE_PERMISSIONS, PERMISSION_TO_ROUTE_MAPPING } from "./roles";

export function hasAccess(path: string, role: string): boolean {
  const allowedRoles = ROUTE_PERMISSIONS[path] || [];
  return allowedRoles.includes(role);
}

// New function to check access using permissions from login response
export function hasPermissionAccess(path: string, userPermissions: string[]): boolean {
  // If user has 'accessAllFeatures' permission, grant access to everything
  if (userPermissions.includes('accessAllFeatures')) {
    return true;
  }

  // Check if any of the user's permissions grant access to this route
  for (const permission of userPermissions) {
    const allowedRoutes = PERMISSION_TO_ROUTE_MAPPING[permission] || [];
    if (allowedRoutes.includes(path)) {
      return true;
    }
  }

  return false;
}

// Enhanced function that supports both role-based and permission-based access
export function hasDynamicAccess(path: string, role?: string, userPermissions?: string[]): boolean {
  // If permissions are provided, use permission-based access
  if (userPermissions && userPermissions.length > 0) {
    return hasPermissionAccess(path, userPermissions);
  }

  // Fallback to role-based access if no permissions provided
  if (role) {
    return hasAccess(path, role);
  }

  return false;
}

