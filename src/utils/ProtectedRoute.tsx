import { Navigate, Outlet, useLocation } from "react-router-dom";
import { constant } from "@/lib/constant";
// import { Navigate, Outlet, useLocation, matchPath } from "react-router-dom";
// import { ROUTE_PERMISSIONS } from "./roles";
import { hasDynamicAccess } from "./Helper";

const ProtectedRoute: React.FC = () => {
  const location = useLocation();

  let userRole: string | null = null;
  let userPermissions: string[] = [];

  try {
    userRole = localStorage.getItem("role");
    const storedPermissions = localStorage.getItem("permissions");
    userPermissions = storedPermissions ? JSON.parse(storedPermissions) : [];
  } catch {
    userRole = null;
    userPermissions = [];
  }

  // ✅ Find first matching route pattern in ROUTE_PERMISSIONS
  // const matchedKey = Object.keys(ROUTE_PERMISSIONS).find((pattern) =>
  //   matchPath(pattern, location.pathname)
  // );

  // const allowedRoles = matchedKey ? ROUTE_PERMISSIONS[matchedKey] : [];

  if (!userRole) {
    return <Navigate to={constant.ROUTING_URLS.ADMIN_LOGIN} replace />;
  } else if (!hasDynamicAccess(location.pathname, userRole, userPermissions)) {
    console.log(location.pathname, userRole, userPermissions);
    return <Navigate to={constant.ROUTING_URLS.DASHBOARD} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;

// // ProtectedRoute.tsx
// import React from "react";
// import { Navigate, useLocation } from "react-router-dom";
// import { ROUTE_PERMISSIONS } from "./constant";
// import { constant } from "@/lib/constant";

// interface ProtectedRouteProps {
//   children: React.ReactNode;
// }

// const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
//   const location = useLocation();
//   const userRole = localStorage.getItem("user");

//   const allowedRoles = ROUTE_PERMISSIONS[location.pathname] || [];

//   if (!userRole || !allowedRoles.includes(userRole)) {
//     return <Navigate to={constant.ROUTING_URLS.DASHBOARD} replace />;
//   }

//   return <>{children}</>;
// };

// export default ProtectedRoute;

// import React from "react";
// import { Navigate, Outlet, useLocation } from "react-router-dom";
// import { ROUTE_PERMISSIONS } from "./roles";
// import { constant } from "@/lib/constant";

// const ProtectedRoute: React.FC = () => {
//   const location = useLocation();

//   // Get user role from localStorage
//   let userRole: string | null = null;
//   try {
//     const stored = localStorage.getItem("user");
//     if (stored) {
//       userRole = stored;
//     }
//   } catch {
//     userRole = null;
//   }

//   // Get allowed roles for this path
//   const allowedRoles = ROUTE_PERMISSIONS[location.pathname] || [];

//   if (!userRole ) {
//     return <Navigate to={constant.ROUTING_URLS.ADMIN_LOGIN} replace />;
//   }else if(userRole && !allowedRoles.includes(userRole)){
//    return <Navigate to={constant.ROUTING_URLS.DASHBOARD} replace  />;
//   }

//   return <Outlet />; // ✅ renders the child route if allowed
// };

// export default ProtectedRoute;
