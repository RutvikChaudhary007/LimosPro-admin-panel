import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ADMIN_PANEL_ALLOWED_ROLES = [
  "Super Admin",
  "Regional Admin",
  "Staff",
  "Dispatcher",
  "SEO",
  "Partner",
];

export const useAuth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      navigate("/login");
      return;
    }

    try {
      const user = JSON.parse(userStr);

      // Check if any of user's roles are allowed to access Admin Panel
      const userRoles = user.roles || [];
      const isAllowed = userRoles.some((role: string) =>
        ADMIN_PANEL_ALLOWED_ROLES.includes(role),
      );
      if (!isAllowed) {
        console.warn(`Access denied for roles: ${userRoles.join(", ")}`);
        localStorage.clear();
        navigate("/unauthorized");
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
      localStorage.clear();
      navigate("/login");
    }
  }, [navigate]);

  const getUser = () => {
    try {
      const userStr = localStorage.getItem("user");
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  };

  const getPermissions = () => {
    try {
      const permStr = localStorage.getItem("permissions");
      return permStr ? JSON.parse(permStr) : [];
    } catch {
      return [];
    }
  };

  return {
    user: getUser(),
    permissions: getPermissions(),
    isAuthenticated: !!getUser(),
  };
};
