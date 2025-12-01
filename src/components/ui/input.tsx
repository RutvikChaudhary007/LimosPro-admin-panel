import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";
import { cn } from "@/lib/utils";

// --- SIZE CONSTANTS ---
export const INPUT_SIZES = {
  sm: { height: "h-8", padding: "p-2" },
  md: { height: "h-10", padding: "p-3" },
  lg: { height: "h-13", padding: "p-4" },
} as const;

export type InputSize = keyof typeof INPUT_SIZES;

// --- VARIANT STYLES ---
const inputVariants = cva(
  "font-quicksand font-medium text-base leading-[100%] tracking-[0] file:text-base-gray placeholder:text-base-gray border-base-gray h-13 w-full min-w-0 rounded border bg-transparent transition-[color,box-shadow,border-color] outline-none file:inline-flex file:h-13 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm aria-invalid:border-destructive aria-invalid:ring-0 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
  {
    variants: {
      variant: {
        primary: "focus:border-base-primary",
        secondary: "focus:border-base-secondary",
      },
      size: {
        sm: `${INPUT_SIZES.sm.height} ${INPUT_SIZES.sm.padding}`,
        md: `${INPUT_SIZES.md.height} ${INPUT_SIZES.md.padding}`,
        lg: `${INPUT_SIZES.lg.height} ${INPUT_SIZES.lg.padding}`,
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
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
