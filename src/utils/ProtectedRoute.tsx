import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthContext } from "@/context/AuthContext";
import { usePermission } from "@/hooks/usePermission";
import { constant } from "@/lib/constant";
import { hasDynamicAccess } from "./Helper";

interface ProtectedRouteProps {
  permission?: string | string[];
  action?: string;
  restrictedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  permission,
  action = "view",
  restrictedRoles,
}) => {
  const location = useLocation();
  const { user, isAuthLoading } = useAuthContext();
  const { hasPermission, permissions, role, isLoggedIn } = usePermission();

  const userRole = role;
  const userPermissions = permissions || [];

  if (isAuthLoading) {
    return null;
  }

  if (!user || !isLoggedIn) {
    return <Navigate to={constant.ROUTING_URLS.ADMIN_LOGIN} replace />;
  }

  // Always allow access to unauthorized page if logged in
  if (location.pathname === "/unauthorized") {
    return <Outlet />;
  }

  // Check if user's role is restricted from accessing this route
  if (restrictedRoles && restrictedRoles.includes(userRole)) {
    console.log(`Access denied for role ${userRole} on ${location.pathname}`);
    return <Navigate to="/unauthorized" replace />;
  }

  // If explicit permission is provided, use it
  if (permission) {
    if (!hasPermission(permission, action)) {
      console.log(`Access denied for ${permission}:${action}`);
      return <Navigate to="/unauthorized" replace />;
    }
    return <Outlet />;
  }

  // Fallback to legacy path-based check
  if (!hasDynamicAccess(location.pathname, userRole, userPermissions as any)) {
    console.log(`Path access denied for ${location.pathname}`);
    if (location.pathname === constant.ROUTING_URLS.DASHBOARD) {
      return <Navigate to="/unauthorized" replace />;
    }
    return <Navigate to={constant.ROUTING_URLS.DASHBOARD} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
