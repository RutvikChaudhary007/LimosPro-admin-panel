import type { VariantProps } from "class-variance-authority";
import React from "react";
import { Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";
import { Button, type buttonVariants } from "../ui/button";
import {
  Card,
  CardAction,
  CardBody,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

type ActionButton = {
  label?: string;
  icon?: React.ReactNode;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  link?: string;
  variant?: VariantProps<typeof buttonVariants>["variant"];
  className?: string;
  onClick?: () => void;
};

interface PageHeaderProps {
  title: string;
  breadcrumbs: { label: string; path?: string }[];
  action?: ActionButton | ActionButton[];
  actionDetails?: {
    stats: { label: string; value: string | number }[];
  };
  backAction?: ActionButton;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  breadcrumbs,
  action,
  actionDetails,
  backAction,
}) => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  const displayedBreadCrumbs = isMobile
    ? [breadcrumbs[0], breadcrumbs[breadcrumbs.length - 1]]
    : breadcrumbs;

  const renderActionButton = (
    btn: ActionButton,
    key?: number,
    isBack = false,
  ) => {
    const left = btn.leftIcon || btn.icon;

    const button = (
      <Button
        key={key}
        variant={btn.variant}
        onClick={btn.onClick}
        className={cn(btn.className, isBack && "border-0")}
      >
        {left && <span>{left}</span>}
        {btn.label && <span>{btn.label}</span>}
        {btn.rightIcon && <span>{btn.rightIcon}</span>}
      </Button>
    );

    return btn.link ? (
      <Link to={btn.link} key={key}>
        {button}
      </Link>
    ) : (
      button
    );
  };

  return (
    <Card className="shadow-base-sm" variant="horizontal">
      {backAction && (
        <div className="self-center ml-6">
          {renderActionButton(backAction, 0, true)}
        </div>
      )}

      <CardBody className={cn(backAction && "pl-2")}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>
            <Breadcrumb>
              <BreadcrumbList>
                {displayedBreadCrumbs.map((crumb, index) => {
                  const isLast = index === displayedBreadCrumbs.length - 1;
                  const isFirst = index === 0;

                  return (
                    <React.Fragment key={index}>
                      <BreadcrumbItem className="font-quicksand font-medium text-sm text-base-gray leading-[100%] tracking-normal">
                        {!isLast && crumb.path ? (
                          <BreadcrumbLink asChild>
                            <Link to={crumb.path}>{crumb.label}</Link>
                          </BreadcrumbLink>
                        ) : (
                          <BreadcrumbPage className="text-black">
                            {crumb.label}
                          </BreadcrumbPage>
                        )}
                      </BreadcrumbItem>

                      {isMobile && isFirst && breadcrumbs.length > 2 && (
                        <BreadcrumbSeparator>...</BreadcrumbSeparator>
                      )}

                      {!isMobile && !isLast && <BreadcrumbSeparator />}
                    </React.Fragment>
                  );
                })}
              </BreadcrumbList>
            </Breadcrumb>
          </CardDescription>

          <CardAction className="flex flex-wrap items-end gap-8">
            {actionDetails && (
              <div className="flex flex-wrap gap-10 text-right">
                {actionDetails.stats.map((item, i) => (
                  <div key={i}>
                    <p className="font-quicksand text-center text-base font-semibold text-black">
                      {item.value}
                    </p>
                    <p className="font-quicksand text-center text-sm font-medium text-base-black">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {action && (
              <div className="flex flex-wrap items-center gap-2">
                {(Array.isArray(action) ? action : [action]).map((a, i) =>
                  renderActionButton(a, i),
                )}
              </div>
            )}
          </CardAction>
        </CardHeader>
      </CardBody>
    </Card>
  );
};
