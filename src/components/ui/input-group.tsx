import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

// --- MAIN GROUP ---
const inputGroupVariants = cva(
  "group/input-group font-quicksand font-medium text-base leading-none border bg-transparent rounded relative flex w-full items-center min-w-0 shadow-xs transition-[color,box-shadow,border-color] outline-none h-14 has-[>textarea]:h-auto",
  {
    variants: {
      variant: {
        primary:
          "border-base-gray focus-within:border-base-primary focus-within:text-base-primary",
        secondary:
          "border-base-gray focus-within:border-base-secondary focus-within:text-base-secondary",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  },
);

interface InputGroupProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof inputGroupVariants> {}

function InputGroup({ className, variant, ...props }: InputGroupProps) {
  return (
    <div
      data-slot="input-group"
      role="group"
      className={cn(
        inputGroupVariants({ variant }),
        // Common shared logic
        "focus-within:ring-0 focus-within:outline-none",
        "has-[>[data-align=inline-start]]:[&>input]:pl-5",
        "has-[>[data-align=inline-end]]:[&>input]:pr-5",
        "has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col has-[>[data-align=block-start]]:[&>input]:pb-5",
        "has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-end]]:[&>input]:pt-5",
        // Error state
        "has-[[data-slot][aria-invalid=true]]:border-destructive has-[[data-slot][aria-invalid=true]]:ring-destructive/20 dark:has-[[data-slot][aria-invalid=true]]:ring-destructive/40",
        // Disabled state
        "has-[[data-slot=input-group-control]:disabled]:cursor-not-allowed has-[[data-slot=input-group-control]:disabled]:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

// --- ADDON ---
const inputGroupAddonVariants = cva(
  "text-base-gray flex h-auto cursor-text items-center justify-center gap-2 py-1.5 text-sm font-medium select-none transition-colors [&_svg]:**:stroke-current [&>svg:not([class*='size-'])]:size-6 group-data-[disabled=true]/input-group:opacity-50",
  {
    variants: {
      align: {
        "inline-start":
          "order-first pl-4 has-[>button]:ml-[-0.45rem] has-[>kbd]:ml-[-0.35rem]",
        "inline-end":
          "order-last pr-4 has-[>button]:mr-[-0.45rem] has-[>kbd]:mr-[-0.35rem]",
        "block-start":
          "order-first w-full justify-start px-4 pt-4 [.border-b]:pb-4 group-has-[>input]/input-group:pt-4",
        "block-end":
          "order-last w-full justify-start px-4 pb-4 [.border-t]:pt-4 group-has-[>input]/input-group:pb-4",
      },
      variant: {
        primary: "group-focus-within/input-group:text-base-primary",
        secondary: "group-focus-within/input-group:text-base-secondary",
      },
    },
    defaultVariants: {
      align: "inline-start",
      variant: "primary",
    },
  },
);

function InputGroupAddon({
  className,
  align = "inline-start",
  variant = "primary",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof inputGroupAddonVariants>) {
  return (
    <div
      role="group"
      data-slot="input-group-addon"
      data-align={align}
      className={cn(inputGroupAddonVariants({ align, variant }), className)}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("button")) return;
        e.currentTarget.parentElement?.querySelector("input")?.focus();
      }}
      {...props}
    />
  );
}

// --- BUTTON ---
const inputGroupButtonVariants = cva(
  "text-sm shadow-none flex gap-2 items-center",
  {
    variants: {
      size: {
        xs: "h-6 gap-1 px-2 rounded-[calc(var(--radius)-5px)] [&>svg:not([class*='size-'])]:size-3.5 has-[>svg]:px-2",
        sm: "h-8 px-2.5 gap-1.5 rounded-md has-[>svg]:px-2.5",
        "icon-xs":
          "size-6 rounded-[calc(var(--radius)-5px)] p-0 has-[>svg]:p-0",
        "icon-sm": "size-8 p-0 has-[>svg]:p-0",
      },
    },
    defaultVariants: {
      size: "xs",
    },
  },
);

function InputGroupButton({
  className,
  type = "button",
  variant = "ghost",
  size = "xs",
  ...props
}: Omit<React.ComponentProps<typeof Button>, "size"> &
  VariantProps<typeof inputGroupButtonVariants>) {
  return (
    <Button
      type={type}
      data-size={size}
      variant={variant}
      className={cn(inputGroupButtonVariants({ size }), className)}
      {...props}
    />
  );
}

// --- TEXT (prefix/suffix text) ---
function InputGroupText({
  className,
  variant = "primary",
  ...props
}: React.ComponentProps<"span"> & { variant?: "primary" | "secondary" }) {
  return (
    <span
      className={cn(
        "text-base-gray flex items-center gap-2 text-sm transition-colors [&_svg]:pointer-events-none [&_svg]:**:stroke-current [&_svg:not([class*='size-'])]:size-4",
        variant === "primary"
          ? "group-focus-within/input-group:text-base-primary"
          : "group-focus-within/input-group:text-base-secondary",
        className,
      )}
      {...props}
    />
  );
}

// --- INPUT ---
function InputGroupInput({
  className,
  variant = "primary",
  ...props
}: React.ComponentProps<"input"> & {
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
}) {
  const focusColor =
    variant === "primary" ? "focus:text-black" : "focus:text-black";

  return (
    <Input
      data-slot="input-group-control"
      className={cn(
        "flex-1 rounded-none border-0 bg-transparent shadow-none transition-colors focus:border-none focus-visible:ring-0",
        "font-quicksand placeholder:text-base-gray text-base leading-none font-medium",
        focusColor,
        "focus:border-0 focus:outline-none focus-visible:ring-0",
        className,
      )}
      {...props}
    />
  );
}

// --- TEXTAREA ---
function InputGroupTextarea({
  className,
  variant = "primary",
  ...props
}: React.ComponentProps<"textarea"> & { variant?: "primary" | "secondary" }) {
  const focusColor =
    variant === "primary"
      ? "focus:text-base-primary"
      : "focus:text-base-secondary";

  return (
    <Textarea
      data-slot="input-group-control"
      className={cn(
        "flex-1 resize-none rounded-none border-0 bg-transparent p-4 shadow-none transition-colors focus:border-none focus-visible:ring-0",
        "font-quicksand placeholder:text-base-gray text-base leading-none font-medium",
        focusColor,
        "focus:outline-none focus-visible:ring-0",
        className,
      )}
      {...props}
    />
  );
}

export {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
};
