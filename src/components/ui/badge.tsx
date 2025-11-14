import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "font-quicksand font-bold text-xs leading-[100%] tracking-[0] inline-flex items-center justify-center rounded-xl border px-2 py-[4.5px] w-fit whitespace-nowrap shrink-0 [&_svg]:**:stroke-current [&>svg]:size-4 gap-2 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-base-primary text-base-white [a&]:hover:bg-base-primary-dark",
        secondary:
          "border-transparent bg-base-secondary text-base-white [a&]:hover:bg-base-secondary-dark",
        black:
          "border-transparent bg-base-black text-base-white [a&]:hover:bg-base-black/90",
        white:
          "border-transparent bg-base-white text-base-black [a&]:hover:bg-base-white/90",
        destructive:
          "border-transparent bg-destructive text-base-black [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge };
