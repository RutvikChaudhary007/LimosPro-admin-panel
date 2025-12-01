import { ChevronRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";

interface NavItem {
  title: string;
  url: string;
  icon?: React.ComponentType<{ className?: string }>;
  items?: { title: string; url: string }[];
}

export function NavMain({ items }: { items: NavItem[] }) {
  const location = useLocation();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const isActivePath = (path: string) =>
    location.pathname === path || location.pathname.startsWith(`${path}/`);

  const renderSubItems = (
    subItems: NavItem["items"] = [],
    className?: string,
  ) => (
    <SidebarMenuSub>
      {subItems.map((sub) => {
        const active = isActivePath(sub.url);
        return (
          <SidebarMenuSubItem key={sub.title}>
            <SidebarMenuSubButton
              asChild
              data-active={active}
              className={className}
            >
              <Link to={sub.url}>
                <span className="truncate">{sub.title}</span>
              </Link>
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>
        );
      })}
    </SidebarMenuSub>
  );

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => {
          const hasChildren = item.items?.length;
          const active = isActivePath(item.url);
          const childActive = item.items?.some((s) => isActivePath(s.url));

          // ---------------- COLLAPSED (Hover Menu) ----------------
          if (isCollapsed && hasChildren) {
            return (
              <SidebarMenuItem key={item.title}>
                <HoverCard openDelay={100} closeDelay={100}>
                  <HoverCardTrigger asChild>
                    <SidebarMenuButton
                      tooltip={item.title}
                      data-active={active}
                      data-child-active={childActive}
                    >
                      {item.icon && <item.icon />}
                    </SidebarMenuButton>
                  </HoverCardTrigger>

                  <HoverCardContent
                    side="right"
                    align="start"
                    className="font-quicksand border-base-gray bg-base-white w-full max-w-fit rounded border p-2 shadow-none"
                  >
                    {renderSubItems(item.items, "px-4 py-1")}
                  </HoverCardContent>
                </HoverCard>
              </SidebarMenuItem>
            );
          }

          // ---------------- EXPANDED (Collapsible Menu) ----------------
          if (hasChildren) {
            return (
              <Collapsible
                key={item.title}
                asChild
                defaultOpen={active || childActive}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      tooltip={item.title}
                      data-active={active}
                      data-child-active={childActive}
                    >
                      {item.icon && <item.icon />}
                      <span className="truncate">{item.title}</span>
                      <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>

                  <CollapsibleContent className="mt-2">
                    {renderSubItems(item.items)}
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            );
          }

          // ---------------- NORMAL ITEM ----------------
          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                tooltip={item.title}
                data-active={active}
              >
                <Link to={item.url}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
