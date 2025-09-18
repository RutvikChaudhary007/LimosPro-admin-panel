import { useEffect } from "react";
import {  Outlet, useNavigate } from "react-router-dom";
// import useAdminAuthStore from "@/store/useAdminAuthStore";

function AdminProtectedRoute() {
    const navigate = useNavigate()
//    const {token , user} = useAdminAuthStore(); // Implement your authentication check here
   
const userRole = localStorage.getItem("user");
console.log(userRole)
useEffect(()=>{
        if(!userRole || !["Admin","Seo","Affiliate"].includes(userRole)){
            console.log("login..")
        navigate("/cms/login")
    }

    },[])
return userRole && ["Admin","Seo","Affiliate"].includes(userRole)  && (<Outlet/>) ;
  
}

export default AdminProtectedRoute;
