import { Outlet,Navigate } from "react-router-dom";
// import useAdminAuthStore from "@/store/useAdminAuthStore";

function AdminProtectedRoute() {
//    const {token , user} = useAdminAuthStore(); // Implement your authentication check here
   

// return token && user?.role === "super_admin" ? <Outlet/> : <Navigate to="/admin/login" />;
  
}

export default AdminProtectedRoute;
