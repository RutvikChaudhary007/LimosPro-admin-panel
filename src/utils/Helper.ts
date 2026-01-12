import { PERMISSION_TO_ROUTE_MAPPING, ROUTE_PERMISSIONS } from "./roles";

export function hasAccess(path: string, role: string): boolean {
  const routeKey = resolveRouteKey(path);
  const allowedRoles = routeKey ? ROUTE_PERMISSIONS[routeKey] || [] : [];
  return allowedRoles.includes(role);
}

// New function to check access using permissions from login response
export function hasPermissionAccess(
  path: string,
  userPermissions: (string | any)[],
): boolean {
  // If user has 'accessAllFeatures' permission, grant access to everything
  const hasGlobalAccess = userPermissions.some(
    (p) =>
      (typeof p === "string" && p === "accessAllFeatures") ||
      (typeof p === "object" &&
        (p.permissionName === "accessAllFeatures" ||
          p.permission?.name === "accessAllFeatures")),
  );

  if (hasGlobalAccess) {
    return true;
  }

  // Check if any of the user's permissions grant access to this route
  for (const p of userPermissions) {
    const permName =
      typeof p === "string" ? p : p.permissionName || p.permission?.name;

    // For object permissions, we must have at least 'view' access to access the route
    if (typeof p === "object" && p.actions && p.actions.view === false) {
      continue;
    }

    const allowedRoutes = PERMISSION_TO_ROUTE_MAPPING[permName] || [];
    if (allowedRoutes.some((pattern) => pathMatches(pattern, path))) {
      return true;
    }
  }

  return false;
}

// Enhanced function that supports both role-based and permission-based access
export function hasDynamicAccess(
  path: string,
  role?: string,
  userPermissions?: string[],
): boolean {
  // If permissions are provided, try permission-based access first
  if (userPermissions && userPermissions.length > 0) {
    if (hasPermissionAccess(path, userPermissions)) {
      return true;
    }
  }

  // Also allow role-based access (role rules should still apply even when
  // permissions exist but don't include a mapping for the route).
  if (role) {
    return hasAccess(path, role);
  }

  return false;
}

// --- Internal helpers ---
function normalizePath(value: string): string {
  if (!value) return "/";
  let out = value.trim();
  if (!out.startsWith("/")) out = `/${out}`;
  if (out.length > 1 && out.endsWith("/")) out = out.slice(0, -1);
  return out;
}

// Supports patterns like "/users/:id", "/users/*", and exact paths
function pathMatches(pattern: string, path: string): boolean {
  const p = normalizePath(pattern);
  const u = normalizePath(path);

  // Wildcard full match
  if (p === "/*") return true;

  const pParts = p.split("/");
  const uParts = u.split("/");

  for (let i = 0; i < pParts.length; i++) {
    const pSeg = pParts[i];
    const uSeg = uParts[i];

    if (pSeg === undefined) return false; // pattern shorter than url

    // Trailing wildcard matches the rest
    if (pSeg === "*") return true;

    // Param segment ":id" matches anything non-empty
    if (pSeg.startsWith(":")) {
      if (uSeg === undefined || uSeg.length === 0) return false;
      continue;
    }

    // Exact segment match
    if (uSeg !== pSeg) return false;
  }

  // All pattern segments matched; ensure url has no extra unmatched segments unless pattern ended with '*'
  return pParts.length === uParts.length || pParts[pParts.length - 1] === "*";
}

function resolveRouteKey(path: string): string | undefined {
  const keys = Object.keys(ROUTE_PERMISSIONS || {});
  const normalized = normalizePath(path);
  for (const key of keys) {
    if (pathMatches(key, normalized)) return key;
  }
  return undefined;
}
