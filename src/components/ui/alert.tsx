import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative w-full box-border rounded border p-4 grid items-center grid-cols-[0_1fr] has-[>svg]:grid-cols-[24px_1fr] has-[>svg]:gap-4 [&>svg]:size-6 [&_svg]:**:stroke-current",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground",
        primary:
          "bg-base-primary/20 border-base-primary text-base-primary [&>svg]:text-base-primary *:data-[slot=alert-description]:text-base-primary/90",
        secondary:
          "bg-base-secondary/20 border-base-secondary text-base-secondary [&>svg]:text-base-secondary *:data-[slot=alert-description]:text-base-secondary/90",
        success:
          "bg-base-success/20 border-base-success text-base-success [&>svg]:text-base-success *:data-[slot=alert-description]:text-base-success/90",
        danger:
          "bg-base-danger/20 border-base-danger text-base-danger [&>svg]:text-base-danger *:data-[slot=alert-description]:text-base-danger/90",
        warning:
          "bg-base-warning/20 border-base-warning text-base-warning [&>svg]:text-base-warning *:data-[slot=alert-description]:text-base-warning/90",
        solidPrimary:
          "bg-base-primary border-base-primary text-base-white [&>svg]:text-base-white *:data-[slot=alert-description]:text-base-white/90",
        solidSecondary:
          "bg-base-secondary border-base-secondary text-base-white [&>svg]:text-base-white *:data-[slot=alert-description]:text-base-white/90",
        solidSuccess:
          "bg-base-success border-base-success text-base-white [&>svg]:text-base-white *:data-[slot=alert-description]:text-base-white/90",
        solidDanger:
          "bg-base-danger border-base-danger text-base-white [&>svg]:text-base-white *:data-[slot=alert-description]:text-base-white/90",
        solidWarning:
          "bg-base-warning border-base-warning text-base-white [&>svg]:text-base-white *:data-[slot=alert-description]:text-base-white/90",
        destructive:
          "text-destructive bg-card [&>svg]:text-current *:data-[slot=alert-description]:text-destructive/90",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  }
)

function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  )
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "font-quicksand col-start-2 text-base leading-[100%] font-medium tracking-[0]",
        className
      )}
      {...props}
    />
  )
}

function AlertDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "font-quicksand col-start-2 grid justify-items-start gap-1 text-sm leading-[100%] font-medium tracking-[0] [&_p]:leading-relaxed",
        className
      )}
      {...props}
    />
  )
}

export { Alert, AlertDescription, AlertTitle }
