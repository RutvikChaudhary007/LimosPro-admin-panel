import { Outlet } from "react-router-dom";
import { AuthHeader } from "./header/auth-header";

function AuthLayout() {
  return (
    <>
      <AuthHeader />
      <Outlet />
    </>
  );
}

export default AuthLayout;
