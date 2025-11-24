import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded font-quicksand font-bold text-base leading-[100%] tracking-[0] transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-5 shrink-0 [&_svg]:shrink-0 [&_svg]:**:stroke-current outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive cursor-pointer",
  {
    variants: {
      variant: {
        default: "bg-base-primary text-base-white hover:bg-base-primary-dark",
        secondary:
          "bg-base-secondary text-base-white hover:bg-base-secondary-dark",
        black: "bg-base-black text-base-white hover:bg-base-black/90",
        info: "bg-base-info text-base-white hover:bg-base-info/90",
        success: "bg-base-success text-base-white hover:bg-base-success/90",
        warning: "bg-base-warning text-base-white hover:bg-base-warning/90",

        outlinePrimary:
          "border border-base-primary text-base-primary bg-transparent hover:border-base-primary-dark hover:text-base-primary-dark",
        outlineSecondary:
          "border border-base-secondary text-base-secondary bg-transparent hover:border-base-secondary-dark hover:text-base-secondary-dark",
        outlineBlack:
          "border border-base-black text-base-black bg-transparent hover:text-base-black/90",
        outlineDestructive:
          "border border-base-danger text-base-danger bg-transparent hover:text-base-danger/90",
        outlineInfo:
          "border border-base-info text-base-info bg-transparent hover:text-base-info/90",
        outlineSuccess:
          "border border-base-success text-base-success bg-transparent hover:text-base-success/90",
        outlineWarning:
          "border border-base-warning text-base-warning bg-transparent hover:text-base-warning/90",

        outlineNavBtnPrimary:
          "border-0 bg-transparent text-base-primary hover:text-base-white hover:bg-base-primary",
        outlineNavBtnSecondary:
          "border-0 bg-transparent text-base-secondary hover:text-base-white hover:bg-base-secondary",
        outlineNavBtnBlack:
          "border-0 bg-transparent text-base-black hover:text-base-white hover:bg-base-black",
        outlineNavBtnDestructive:
          "border-0 bg-transparent text-base-danger hover:text-base-white hover:bg-base-danger",
        outlineNavBtnInfo:
          "border-0 bg-transparent text-base-info hover:text-base-white hover:bg-base-info",
        outlineNavBtnSuccess:
          "border-0 bg-transparent text-base-success hover:text-base-white hover:bg-base-success",
        outlineNavBtnWarning:
          "border-0 bg-transparent text-base-warning hover:text-base-white hover:bg-base-warning",

        linkPrimary:
          "text-base-primary underline underline-offset-4 hover:no-underline",
        linkSecondary:
          "text-base-secondary underline underline-offset-4 hover:no-underline",
        linkDark:
          "text-base-dark underline underline-offset-4 hover:no-underline",
        linkDestructive:
          "text-base-danger underline underline-offset-4 hover:no-underline",
        linkInfo:
          "text-base-info underline underline-offset-4 hover:no-underline",
        linkSuccess:
          "text-base-success underline underline-offset-4 hover:no-underline",
        linkWarning:
          "text-base-warning underline underline-offset-4 hover:no-underline",

        menuItem: cn(
          "text-lg hover:bg-base-primary/10 transition-colors",
          "data-[state=active]:bg-base-primary data-[state=active]:text-base-white",
          "data-[group-state=active]:bg-base-primary/20 data-[group-state=active]:text-base-primary",
        ),

        destructive:
          "bg-base-danger text-base-white hover:bg-base-danger/90 focus-visible:ring-base-danger/20 dark:focus-visible:ring-base-danger/40 dark:bg-base-danger/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
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
        menuChild:
          "h-12 pr-4 pl-14 py-3 rounded has-[>svg]:px-4 has-[>svg]:gap-4",
        none: "p-0 h-auto gap-0",
      },
    },

    defaultVariants: {
      variant: "default",
      size: "default",
      spacing: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  spacing,
  asChild = false,
  tooltip,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    tooltip?: string;
  }) {
  const Comp = asChild ? Slot : "button";

  const button = (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, spacing, className }))}
      {...props}
    />
  );

  return tooltip ? (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent>
        <p>{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  ) : (
    button
  );
}

export { Button };
