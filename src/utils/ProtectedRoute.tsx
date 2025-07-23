import React from "react";
import { Outlet,Navigate, useLocation } from "react-router-dom";
import useAuthStore from "@/store/useAuthStore";

function ProtectedRoute() {
   const {token} = useAuthStore(); // Implement your authentication check here
   

return token ? <Outlet/> : <Navigate to="/login" />;
  
}

export default ProtectedRoute;
