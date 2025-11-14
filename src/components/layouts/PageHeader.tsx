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
import { Button } from "../ui/button";
import {
  Card,
  CardAction,
  CardBody,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

interface PageHeaderProps {
  title: string;
  breadcrumbs: { label: string; path?: string }[];
  action?: {
    label: string;
    icon?: React.ReactNode;
    link?: string;
    variant?:
      | "default"
      | "secondary"
      | "black"
      | "outlinePrimary"
      | "outlineSecondary"
      | "outlineBlack"
      | "outlineNavBtnPrimary"
      | "outlineNavBtnSecondary"
      | "outlineNavBtnBlack"
      | "linkPrimary"
      | "linkSecondary"
      | "linkDark";
    onClick?: () => void;
  };
  actionDetails?: {
    stats: { label: string; value: string | number }[];
  };
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  breadcrumbs,
  action,
  actionDetails,
}) => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Mobile: show first + last only
  const displayedBreadCrumbs = isMobile
    ? [breadcrumbs[0], breadcrumbs[breadcrumbs.length - 1]]
    : breadcrumbs;

  return (
    <Card className="shadow-base-sm">
      <CardBody>
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

                      {/* Mobile ellipsis */}
                      {isMobile && isFirst && breadcrumbs.length > 2 && (
                        <BreadcrumbSeparator>...</BreadcrumbSeparator>
                      )}

                      {/* Desktop separator */}
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
                    <p className="font-quicksand text-center text-lg font-semibold text-black">
                      {item.value}
                    </p>
                    <p className="font-quicksand text-center text-sm font-medium text-base-black">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            )}
            {action &&
              (action.link ? (
                <Link to={action.link}>
                  <Button variant={action.variant}>
                    {action.icon}
                    {action.label}
                  </Button>
                </Link>
              ) : (
                <Button variant={action.variant} onClick={action.onClick}>
                  {action.icon}
                  {action.label}
                </Button>
              ))}
          </CardAction>
        </CardHeader>
      </CardBody>
    </Card>
  );
};
