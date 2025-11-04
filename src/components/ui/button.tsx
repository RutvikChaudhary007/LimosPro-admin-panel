import { cn } from "@/lib/utils"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded font-quicksand font-bold text-base leading-[100%] tracking-[0] transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-5 shrink-0 [&_svg]:shrink-0 [&_svg]:**:stroke-current outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-base-primary text-base-white hover:bg-base-primary-dark",
        secondary: "bg-base-secondary text-base-white hover:bg-base-secondary-dark",
        black: "bg-base-black text-base-white hover:bg-base-black/90",
        outlinePrimary:
          "border border-base-primary text-base-primary bg-transparent hover:border-base-primary-dark hover:text-base-primary-dark",
        outlineSecondary:
          "border border-base-secondary text-base-secondary bg-transparent hover:border-base-secondary-dark hover:text-base-secondary-dark",
        outlineBlack:
          "border border-base-black text-base-black bg-transparent hover:text-base-black/90",
        outlineNavBtnPrimary:
          "border-0 bg-transparent text-base-primary hover:text-base-white hover:bg-base-primary",
        outlineNavBtnSecondary:
          "border-0 bg-transparent text-base-secondary hover:text-base-white hover:bg-base-secondary",
        outlineNavBtnBlack:
          "border-0 bg-transparent text-base-black hover:text-base-white hover:bg-base-black",
        linkPrimary: "text-base-primary underline underline-offset-4 hover:no-underline",
        linkSecondary: "text-base-secondary underline underline-offset-4 hover:no-underline",
        linkDark: "text-base-dark underline underline-offset-4 hover:no-underline",
        menuItem: cn(
          "text-lg hover:bg-base-primary/10 transition-colors",
          "data-[state=active]:bg-base-primary data-[state=active]:text-base-white",
          "data-[group-state=active]:bg-base-primary/20 data-[group-state=active]:text-base-primary"
        ),
        destructive:
          "bg-destructive text-base-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },

      // visual size styles
      size: {
        default: "[&_svg:not([class*='size-'])]:size-5",
        sm: "[&_svg:not([class*='size-'])]:size-4",
        lg: "font-montserrat [&_svg:not([class*='size-'])]:size-6",
        xl: "[&_svg:not([class*='size-'])]:size-7",
        menu: "[&_svg:not([class*='size-'])]:size-6",
        icon: "[&_svg:not([class*='size-'])]:size-5",
      },

      // spacing and layout
      spacing: {
        default: "h-[52px] gap-4 p-4",
        sm: "h-8 px-3 py-2 gap-2 rounded-xs",
        lg: "h-11 rounded gap-2 p-2",
        xl: "h-16 p-5 gap-5 rounded-md",
        menu: "h-12 px-4 py-3 gap-4 rounded",
        menuChild: "h-12 pr-4 pl-14 py-3 rounded has-[>svg]:px-4 has-[>svg]:gap-4",
        none: "p-0 h-auto gap-0",
      },
    },

    defaultVariants: {
      variant: "default",
      size: "default",
      spacing: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  spacing,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> & VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, spacing, className }))}
      {...props}
    />
  )
}

export { Button }
