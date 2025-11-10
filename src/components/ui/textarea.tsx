import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";
import { cn } from "@/lib/utils";

// --- VARIANT STYLES ---
const textareaVariants = cva(
  "font-quicksand font-medium text-base leading-[100%] tracking-[0] border-base-gray placeholder:text-base-gray aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive flex field-sizing-content min-h-16 w-full rounded border bg-transparent p-4 shadow-xs transition-[color,box-shadow,border-color] outline-none focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
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

function Textarea({
  className,
  variant,
  ...props
}: React.ComponentProps<"textarea"> & VariantProps<typeof textareaVariants>) {
  return <textarea data-slot="textarea" className={cn(textareaVariants({ variant }), className)} {...props} />;
}

export { Textarea };
