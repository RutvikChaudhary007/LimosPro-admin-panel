import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";
import { createContext, useContext } from "react";

import { Button } from "@/components/ui/button";
import { INPUT_SIZES, Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const InputGroupContext = createContext<
  { size?: "sm" | "md" | "lg" } | undefined
>(undefined);

function useInputGroupContext() {
  return useContext(InputGroupContext);
}

// --- MAIN GROUP ---
const inputGroupVariants = cva(
  "group/input-group font-quicksand font-medium text-base leading-none border bg-transparent rounded relative flex w-full items-center min-w-0 shadow-xs transition-[color,box-shadow,border-color] outline-none has-[>textarea]:h-auto",
  {
    variants: {
      variant: {
        primary:
          "border-base-gray focus-within:border-base-primary focus-within:text-base-primary",
        secondary:
          "border-base-gray focus-within:border-base-secondary focus-within:text-base-secondary",
      },
      size: {
        sm: INPUT_SIZES.sm.height,
        md: INPUT_SIZES.md.height,
        lg: INPUT_SIZES.lg.height,
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

interface InputGroupProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof inputGroupVariants> {}

function InputGroup({ className, variant, size, ...props }: InputGroupProps) {
  return (
    <InputGroupContext.Provider value={{ size: size || "lg" }}>
      <div
        data-slot="input-group"
        role="group"
        className={cn(
          inputGroupVariants({ variant, size }),
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
    </InputGroupContext.Provider>
  );
}

// --- ADDON ---
const inputGroupAddonVariants = cva(
  "text-base-gray flex h-auto cursor-text items-center justify-center gap-2 py-1.5 text-sm font-medium select-none transition-colors [&_svg]:**:stroke-current [&>svg:not([class*='size-'])]:size-6 group-data-[disabled=true]/input-group:opacity-50",
  {
    variants: {
      align: {
        "inline-start":
          "order-first has-[>button]:ml-[-0.45rem] has-[>kbd]:ml-[-0.35rem]",
        "inline-end":
          "order-last has-[>button]:mr-[-0.45rem] has-[>kbd]:mr-[-0.35rem]",
        "block-start": "order-first w-full justify-start",
        "block-end": "order-last w-full justify-start",
      },
      size: {
        sm: "",
        md: "",
        lg: "",
      },
      variant: {
        primary: "group-focus-within/input-group:text-base-primary",
        secondary: "group-focus-within/input-group:text-base-secondary",
      },
    },
    compoundVariants: [
      { align: "inline-start", size: "sm", class: "pl-2" },
      { align: "inline-start", size: "md", class: "pl-3" },
      { align: "inline-start", size: "lg", class: "pl-4" },
      { align: "inline-end", size: "sm", class: "pr-2" },
      { align: "inline-end", size: "md", class: "pr-3" },
      { align: "inline-end", size: "lg", class: "pr-4" },
      {
        align: "block-start",
        size: "sm",
        class: "px-2 pt-2 [.border-b]:pb-2 group-has-[>input]/input-group:pt-2",
      },
      {
        align: "block-start",
        size: "md",
        class: "px-3 pt-3 [.border-b]:pb-3 group-has-[>input]/input-group:pt-3",
      },
      {
        align: "block-start",
        size: "lg",
        class: "px-4 pt-4 [.border-b]:pb-4 group-has-[>input]/input-group:pt-4",
      },
      {
        align: "block-end",
        size: "sm",
        class: "px-2 pb-2 [.border-t]:pt-2 group-has-[>input]/input-group:pb-2",
      },
      {
        align: "block-end",
        size: "md",
        class: "px-3 pb-3 [.border-t]:pt-3 group-has-[>input]/input-group:pb-3",
      },
      {
        align: "block-end",
        size: "lg",
        class: "px-4 pb-4 [.border-t]:pt-4 group-has-[>input]/input-group:pb-4",
      },
    ],
    defaultVariants: {
      align: "inline-start",
      size: "md",
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
  const context = useInputGroupContext();
  const size = context?.size || "md";

  return (
    <div
      role="group"
      data-slot="input-group-addon"
      data-align={align}
      className={cn(
        inputGroupAddonVariants({ align, size, variant }),
        className,
      )}
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
  const context = useInputGroupContext();
  const size = context?.size || "md";

  const focusColor =
    variant === "primary" ? "focus:text-black" : "focus:text-black";

  const sizeClasses = INPUT_SIZES[size];
  const sizePadding = `${sizeClasses.height} ${sizeClasses.padding}`;

  return (
    <Input
      data-slot="input-group-control"
      className={cn(
        "flex-1 rounded-none border-0 bg-transparent shadow-none transition-colors focus:border-none focus-visible:ring-0",
        "font-quicksand placeholder:text-base-gray text-base leading-none font-medium",
        focusColor,
        "focus:border-0 focus:outline-none focus-visible:ring-0",
        sizePadding,
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
        "flex-1 resize-none rounded-none border-0 bg-transparent shadow-none transition-colors focus:border-none focus-visible:ring-0",
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
