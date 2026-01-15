import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

// import useAdminAuthStore from "@/store/useAdminAuthStore";

function AdminProtectedRoute() {
  const navigate = useNavigate();
  //    const {token , user} = useAdminAuthStore(); // Implement your authentication check here

  const userRole = localStorage.getItem("role");
  console.log(userRole);
  useEffect(() => {
    if (
      !userRole ||
      !["Super Admin", "SEO Agent", "Affiliate"].includes(userRole)
    ) {
      console.log("login..");
      navigate("/cms/login");
    }
  }, [navigate, userRole]);
  return (
    userRole &&
    ["Super Admin", "SEO Agent", "Affiliate"].includes(userRole) && <Outlet />
  );
}

export default AdminProtectedRoute;
