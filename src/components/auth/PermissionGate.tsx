import { usePermission } from "@/hooks/usePermission";

interface PermissionGateProps {
  children: React.ReactNode;
  permission: string;
  action?: string;
  fallback?: React.ReactNode;
}

/**
 * PermissionGate component for conditional rendering based on permissions
 * Hides UI elements if user lacks required permission
 */
export const PermissionGate = ({
  children,
  permission,
  action,
  fallback = null,
}: PermissionGateProps) => {
  const { hasPermission } = usePermission();

  if (!hasPermission(permission, action)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
