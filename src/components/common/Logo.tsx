import React from "react"
import { UserPlus } from "lucide-react"

interface LogoProps {
  className?: string
  showBackgroundEffect?: boolean
  useSignupIcon?: boolean
}

const Logo: React.FC<LogoProps> = ({
  className,
  showBackgroundEffect = true,
  useSignupIcon = false,
}) => {
  return (
    <div className={`relative ${className || "h-10"}`}>
      {showBackgroundEffect && (
        <div className="bg-brand-blue absolute inset-0 rotate-3 transform rounded-lg"></div>
      )}

      {useSignupIcon ? (
        <div className="relative flex h-full w-full items-center justify-center">
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
  )
}

export default Logo
