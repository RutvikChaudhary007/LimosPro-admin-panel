import { useEffect } from "react"
import { Outlet, useNavigate } from "react-router-dom"
// import useAdminAuthStore from "@/store/useAdminAuthStore";

function ProtectedRoute() {
  const navigate = useNavigate()
  //    const {token , user} = useAdminAuthStore(); // Implement your authentication check here

  const userRole = localStorage.getItem("role")
  // console.log(userRole)
  useEffect(() => {
    if (!userRole || !["Super Admin", "SEO Agent", "Affiliate"].includes(userRole)) {
      // console.log("login..")
      navigate("/auth/login")
    }
  }, [])
  return userRole && ["Super Admin", "SEO Agent", "Affiliate"].includes(userRole) && <Outlet />
}

export default ProtectedRoute
