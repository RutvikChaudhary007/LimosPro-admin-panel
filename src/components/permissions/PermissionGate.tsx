import type React from "react";
import { usePermission } from "@/hooks/usePermission";

interface PermissionGateProps {
  children: React.ReactNode;
  permission: string;
  action?: string;
  fallback?: React.ReactNode;
}

/**
 * Component to conditionally render children based on user permissions
 *
 * @example
 * <PermissionGate permission="Users" action="create">
 *   <Button>Add User</Button>
 * </PermissionGate>
 */
const PermissionGate: React.FC<PermissionGateProps> = ({
  children,
  permission,
  action = "view",
  fallback = null,
}) => {
  const { hasPermission } = usePermission();

  if (hasPermission(permission, action)) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
};

export default PermissionGate;
