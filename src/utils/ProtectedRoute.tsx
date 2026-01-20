import { Navigate, Outlet, useLocation } from "react-router-dom";
import { usePermission } from "@/hooks/usePermission";
import { constant } from "@/lib/constant";
import { hasDynamicAccess } from "./Helper";

interface ProtectedRouteProps {
  permission?: string | string[];
  action?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  permission,
  action = "view",
}) => {
  const location = useLocation();
  const { hasPermission, user, isLoggedIn } = usePermission();

  const userRole = user?.role;
  const userPermissions = user?.permissions || [];

  if (!isLoggedIn) {
    return <Navigate to={constant.ROUTING_URLS.ADMIN_LOGIN} replace />;
  }

  // Always allow access to unauthorized page if logged in
  if (location.pathname === "/unauthorized") {
    return <Outlet />;
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
  if (!hasDynamicAccess(location.pathname, userRole, userPermissions)) {
    console.log(`Path access denied for ${location.pathname}`);
    if (location.pathname === constant.ROUTING_URLS.DASHBOARD) {
      return <Navigate to="/unauthorized" replace />;
    }
    return <Navigate to={constant.ROUTING_URLS.DASHBOARD} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
