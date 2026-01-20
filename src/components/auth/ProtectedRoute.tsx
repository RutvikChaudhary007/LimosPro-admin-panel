import { Navigate } from "react-router-dom";
import { usePermission } from "@/hooks/usePermission";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: string | string[];
  requiredAction?: string;
  fallbackPath?: string;
}

/**
 * ProtectedRoute component for route-level permission checking
 * Redirects to unauthorized page if user lacks required permission
 */
export const ProtectedRoute = ({
  children,
  requiredPermission,
  requiredAction,
  fallbackPath = "/unauthorized",
}: ProtectedRouteProps) => {
  const { hasPermission } = usePermission();

  // If no specific permission required, just render
  if (!requiredPermission) {
    return <>{children}</>;
  }

  // Check if user has required permission and action
  if (!hasPermission(requiredPermission, requiredAction)) {
    return <Navigate to={fallbackPath} replace />;
  }

  return <>{children}</>;
};
