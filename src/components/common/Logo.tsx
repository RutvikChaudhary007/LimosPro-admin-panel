import { UserPlus } from "lucide-react";
import type React from "react";

interface LogoProps {
  className?: string;
  showBackgroundEffect?: boolean;
  useSignupIcon?: boolean;
}

const Logo: React.FC<LogoProps> = ({
  className,
  showBackgroundEffect = true,
  useSignupIcon = false,
}) => {
  return (
    <div className={`relative ${className || "h-10"}`}>
      {showBackgroundEffect && (
        <div className="absolute inset-0 bg-brand-blue rounded-lg transform rotate-3"></div>
      )}

      {useSignupIcon ? (
        <div className="relative h-full w-full flex items-center justify-center">
          <UserPlus size={36} className="text-brand-blue stroke-[1.5px]" />
        </div>
      ) : (
        <img
          src="/lovable-uploads/77b494d6-3ba3-473f-b317-42cf971f70db.png"
          alt="Postcard OTP Logo"
          className={`${showBackgroundEffect ? "relative" : ""} h-full w-auto object-contain`}
        />
      )}
    </div>
  );
};

export default Logo;
