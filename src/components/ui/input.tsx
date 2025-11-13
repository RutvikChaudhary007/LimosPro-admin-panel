import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";
import { cn } from "@/lib/utils";

// --- VARIANT STYLES ---
const inputVariants = cva(
  "font-quicksand font-medium text-base leading-[100%] tracking-[0] file:text-base-gray placeholder:text-base-gray border-base-gray h-14 w-full min-w-0 rounded border bg-transparent p-4 transition-[color,box-shadow,border-color] outline-none file:inline-flex file:h-14 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm aria-invalid:border-destructive aria-invalid:ring-0 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
  {
    variants: {
      variant: {
        primary: "focus:border-base-primary",
        secondary: "focus:border-base-secondary",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  },
);

// --- PROPS ---
function Input({
  className,
  type,
  variant,
  ...props
}: React.ComponentProps<"input"> & VariantProps<typeof inputVariants>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(inputVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Input };
