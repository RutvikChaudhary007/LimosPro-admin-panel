import { ROUTE_PERMISSIONS } from "./roles";

export function hasAccess(path: string, role: string): boolean {
  const allowedRoles = ROUTE_PERMISSIONS[path] || [];
  return allowedRoles.includes(role);
}

