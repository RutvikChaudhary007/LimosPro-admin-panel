import { Link, useLocation } from "react-router-dom";

export function AuthHeader() {
  const location = useLocation();

  let message = "";
  let text = "";
  let href = "";

  // if (location.pathname === "/auth/login") {
  //   message = "Don’t have an account?"
  //   text = "Sign Up"
  //   href = "/auth/register"
  // } else
  if (location.pathname === "/auth/register") {
    message = "Already have an account?";
    text = "Login";
    href = "/auth/login";
  } else if (location.pathname === "/auth/forgot-password") {
    message = "";
    text = "Back to Login";
    href = "/auth/login";
  }

  return (
    <header className="bg-base-white shadow-base-md sticky top-0 z-40 h-[66px] border-0">
      <div className="flex h-full w-full items-center justify-between px-4 py-2">
        {/* Logo */}
        <Link to="/" className="h-[50px] w-[161px] cursor-pointer">
          <img
            src="/logo/limospro-full-logo-dark.png"
            alt="LimosProLogo"
            className="object-cover"
          />
        </Link>

        {/* Right-side dynamic text */}
        <div className="font-quicksand text-base-black text-base leading-[100%] font-medium tracking-[0]">
          {message && `${message} `}
          <Link to={href} className="font-bold">
            {text}
          </Link>
        </div>
      </div>
    </header>
  );
}
