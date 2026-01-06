import type * as React from "react";
import { Outlet } from "react-router-dom";
import { AuthHeader } from "./header/auth-header";

const AUTH_HEADER_HEIGHT = "5rem";

function AuthLayout() {
  return (
    <div
      style={
        {
          "--auth-header-height": AUTH_HEADER_HEIGHT,
        } as React.CSSProperties
      }
    >
      <AuthHeader />
      <Outlet />
    </div>
  );
}

export default AuthLayout;
