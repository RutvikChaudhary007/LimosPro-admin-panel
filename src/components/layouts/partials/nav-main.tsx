"use client"

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { ChevronRight } from "lucide-react"
import { Link, useLocation } from "react-router-dom"

interface NavItem {
  title: string
  url: string
  icon?: React.ComponentType<{ className?: string }>
  isActive?: boolean
  items?: { title: string; url: string }[]
}

export function NavMain({ items }: { items: NavItem[] }) {
  const location = useLocation()
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"

  // calculate active and child-active states
  const navItems = items.map((item) => {
    const isActive = location.pathname === item.url
    const isChildActive = item.items?.some((sub) => location.pathname === sub.url)
    return { ...item, isActive, isChildActive }
  })

  return (
    <SidebarGroup>
      <SidebarMenu>
        {navItems.map((item) => {
          const hasChildren = item.items && item.items.length > 0
          const isSubActive = item.items?.some((sub) => location.pathname === sub.url)

          // 🌟 collapsed → show HoverCard instead of Collapsible
          if (hasChildren && isCollapsed) {
            return (
              <SidebarMenuItem key={item.title}>
                <HoverCard openDelay={100} closeDelay={100}>
                  <HoverCardTrigger asChild>
                    <SidebarMenuButton
                      tooltip={item.title}
                      data-active={item.isActive}
                      data-child-active={isSubActive}
                    >
                      {item.icon && <item.icon />}
                    </SidebarMenuButton>
                  </HoverCardTrigger>

                  <HoverCardContent
                    side="right"
                    align="start"
                    className="font-quicksand border-base-gray bg-base-white w-64 rounded border p-2 text-base leading-[100%] font-medium tracking-[0] shadow-none"
                  >
                    <SidebarMenuSub className="mt-0">
                      {(item.items || []).map((subItem) => {
                        const isSubActive = location.pathname === subItem.url
                        return (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton asChild data-active={isSubActive}>
                              <Link to={subItem.url}>
                                <span>{subItem.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        )
                      })}
                    </SidebarMenuSub>
                  </HoverCardContent>
                </HoverCard>
              </SidebarMenuItem>
            )
          }

          // 🌟 expanded → keep Collapsible for submenus
          if (hasChildren) {
            return (
              <Collapsible
                key={item.title}
                asChild
                defaultOpen={item.isActive || isSubActive}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      tooltip={item.title}
                      data-active={item.isActive}
                      data-child-active={isSubActive}
                    >
                      {item.icon && <item.icon />}
                      <span className="truncate">{item.title}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {(item.items || []).map((subItem) => {
                        const isSubActive = location.pathname === subItem.url
                        return (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton asChild data-active={isSubActive}>
                              <Link to={subItem.url}>
                                <span>{subItem.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        )
                      })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            )
          }

          // 🌟 items without children
          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild tooltip={item.title} data-active={item.isActive}>
                <Link to={item.url}>
                  {item.icon && <item.icon />}
                  <span className="truncate">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
