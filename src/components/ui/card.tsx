import type * as React from "react";
import IconTrendingUp from "@/assets/Icons/ic-arrow-trending-up.svg?react";
import { cn } from "@/lib/utils";
import { Badge } from "./badge";

function Card({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & { variant?: "default" | "horizontal" }) {
  return (
    <div
      data-slot="card"
      data-variant={variant}
      className={cn(
        "bg-base-white text-base-black flex flex-col gap-0 rounded border border-base-light-gray shadow-base-md overflow-hidden",
        "data-[variant=horizontal]:flex-row data-[variant=horizontal]:items-stretch",
        className,
      )}
      {...props}
    />
  );
}

function CardBody({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-body"
      className={cn(
        "flex flex-col gap-4 w-full p-6 justify-between",
        "",
        className,
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min items-start  [.border-b]:pb-6",
        "has-data-[slot=card-action]:gap-2 has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-action]:grid-rows-[auto_auto]",
        className,
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        "font-montserrat font-bold text-base-black text-2xl leading-[100%] tracking-normal",
        className,
      )}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn(
        "font-quicksand font-medium text-base-gray text-xs leading-[100%] tracking-normal ",
        className,
      )}
      {...props}
    />
  );
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className,
      )}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn(
        " font-quicksand font-medium text-base-black text-base leading-[100%] tracking-normal",
        className,
      )}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "flex items-center  [.border-t]:pt-6 font-quicksand font-medium text-base-black text-base leading-[100%] tracking-normal",
        className,
      )}
      {...props}
    />
  );
}

function CardImage({ className, ...props }: React.ComponentProps<"img">) {
  return (
    <img
      data-slot="card-image"
      className={cn(
        "object-cover",
        "data-[variant=default]:w-full data-[variant=default]:h-full",
        "data-[variant=horizontal]:w-full data-[variant=horizontal]:h-auto",
        className,
      )}
      {...props}
    />
  );
}

function MetricCard({
  title = "Total Revenue",
  value = "$0.00",
  percentage = "0%",
  icon = <IconTrendingUp />,
  bgClass = "bg-base-blue-cream",
  wrapperClass = "",
  bodyClass = "",
  headerClass = "",
  actionClass = "",
  badgeClass = "",
  contentClass = "",
  titleClass = "",
  valueClass = "",
}: {
  title?: string;
  value?: string;
  percentage?: string;
  icon?: React.ReactNode;
  bgClass?: string;
  wrapperClass?: string;
  bodyClass?: string;
  headerClass?: string;
  actionClass?: string;
  badgeClass?: string;
  contentClass?: string;
  titleClass?: string;
  valueClass?: string;
}) {
  return (
    <Card
      className={`border-base-primary @container/card w-full rounded ${bgClass} shadow-none ${wrapperClass}`}
    >
      <CardBody className={`pt-2.5 pl-6 pb-6 pr-2.5 gap-1.5 ${bodyClass}`}>
        <CardHeader className={headerClass}>
          <CardAction className={actionClass}>
            <Badge className={badgeClass}>
              {icon}
              <span>{percentage}</span>
            </Badge>
          </CardAction>
        </CardHeader>

        <CardContent className={`space-y-1 ${contentClass}`}>
          <p
            className={`font-quicksand text-base leading-[100%] font-medium tracking-[0] text-black ${titleClass}`}
          >
            {title}
          </p>
          <h4
            className={`font-montserrat text-2xl leading-[100%] font-bold tracking-[0] text-black ${valueClass}`}
          >
            {value}
          </h4>
        </CardContent>
      </CardBody>
    </Card>
  );
}

export {
  Card,
  CardAction,
  CardBody,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardImage,
  CardTitle,
  MetricCard,
};
