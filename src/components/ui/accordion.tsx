import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { cva, type VariantProps } from "class-variance-authority";
import { ChevronDownIcon } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

// CVA definitions
const accordionRoot = cva(
  "shadow-base-md rounded bg-base-white overflow-hidden",
  {
    variants: {
      variant: {
        default: "",
        primary: "",
        secondary: "",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

const accordionItem = cva("border-b last:border-b-0", {
  variants: {
    variant: {
      default: "border-base-light-gray",
      primary: "border-base-primary/10",
      secondary: "border-base-secondary/10",
    },
  },
  defaultVariants: { variant: "default" },
});

const accordionTrigger = cva(
  "font-quicksand font-bold text-base flex flex-1 items-start justify-between gap-4 p-4 text-left transition-all duration-300 ease-in-out outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:shrink-0 [&[data-state=open]>svg]:rotate-180",
  {
    variants: {
      variant: {
        default:
          "text-base-black hover:bg-base-light-gray data-[state=open]:bg-base-light-gray",
        primary:
          "text-base-black hover:bg-base-primary/10 data-[state=open]:bg-base-primary data-[state=open]:text-base-white",
        secondary:
          "text-base-black hover:bg-base-secondary/10 data-[state=open]:bg-base-secondary data-[state=open]:text-base-white",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

const accordionContent = cva(
  "font-quicksand font-medium text-xs data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden bg-base-white text-base-black",
  {
    variants: {
      variant: {
        default: "",
        primary: "",
        secondary: "",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

// Context to pass variant to children
const AccordionVariantContext =
  React.createContext<VariantProps<typeof accordionRoot>["variant"]>("default");

// Root
function Accordion({
  className,
  variant,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root> &
  VariantProps<typeof accordionRoot>) {
  return (
    <AccordionVariantContext.Provider value={variant}>
      <AccordionPrimitive.Root
        data-slot="accordion"
        className={cn(accordionRoot({ variant }), className)}
        {...props}
      >
        {children}
      </AccordionPrimitive.Root>
    </AccordionVariantContext.Provider>
  );
}

// Item
function AccordionItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  const variant = React.useContext(AccordionVariantContext);
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn(accordionItem({ variant }), className)}
      {...props}
    >
      {children}
    </AccordionPrimitive.Item>
  );
}

// Trigger
function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  const variant = React.useContext(AccordionVariantContext);
  return (
    <AccordionPrimitive.Header className="flex w-full">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(accordionTrigger({ variant }), className)}
        {...props}
      >
        {children}
        <ChevronDownIcon />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

// Content
function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  const variant = React.useContext(AccordionVariantContext);
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className={cn(accordionContent({ variant }), className)}
      {...props}
    >
      <div className={cn("px-6 py-4", className)}>{children}</div>
    </AccordionPrimitive.Content>
  );
}

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger };
