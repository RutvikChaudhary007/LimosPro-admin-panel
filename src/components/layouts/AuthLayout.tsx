import { Outlet } from "react-router-dom";
import { AuthHeader } from "./partials/auth-header";

function AuthLayout() {
  return (
    <>
      <AuthHeader />
      <Outlet />
    </>
  );
}

export default AuthLayout;
