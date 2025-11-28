import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";
import { cn } from "@/lib/utils";

// --- VARIANT STYLES ---
const inputVariants = cva(
  "font-quicksand font-medium text-base leading-[100%] tracking-[0] file:text-base-gray placeholder:text-base-gray border-base-gray h-14 w-full min-w-0 rounded border bg-transparent transition-[color,box-shadow,border-color] outline-none file:inline-flex file:h-14 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm aria-invalid:border-destructive aria-invalid:ring-0 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
  {
    variants: {
      variant: {
        primary: "focus:border-base-primary",
        secondary: "focus:border-base-secondary",
      },
      size: {
        sm: "h-10 p-2",
        md: "h-12 p-3",
        lg: "h-14 p-4",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "lg",
    },
  },
);

// --- PROPS ---
function Input({
  className,
  type,
  variant,
  size,
  ...props
}: Omit<React.ComponentProps<"input">, "size"> &
  VariantProps<typeof inputVariants>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(inputVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Input };
