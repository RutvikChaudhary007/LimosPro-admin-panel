import {
  IconChartBar,
  IconDatabase,
  IconFileWord,
  IconHelp,
  IconHome,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
} from "@tabler/icons-react"
import * as React from "react"
import { Link } from "react-router-dom"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconHome,
      isActive: true,
    },
    {
      title: "Lifecycle",
      url: "#",
      icon: IconListDetails,
      items: [
        { title: "History", url: "#" },
        { title: "Starred", url: "#" },
        { title: "Settings", url: "#" },
      ],
    },
    {
      title: "Analytics",
      url: "#",
      icon: IconChartBar,
    },
  ],
  documents: [
    { name: "Data Library", url: "#", icon: IconDatabase },
    { name: "Reports", url: "#", icon: IconReport },
    { name: "Word Assistant", url: "#", icon: IconFileWord },
  ],
  navSecondary: [
    { title: "Settings", url: "#", icon: IconSettings },
    { title: "Get Help", url: "#", icon: IconHelp },
    { title: "Search", url: "#", icon: IconSearch },
  ],
}

export function AppSidebar({
  showDocuments = false,
  showSecondary = false,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  showDocuments?: boolean
  showSecondary?: boolean
}) {
  return (
    <Sidebar collapsible="icon" {...props}>
      {/* Header */}
      <SidebarHeader className="mx-2 h-[calc(var(--header-height)-8px)] justify-center border-b p-0 py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="h-auto data-[slot=sidebar-menu-button]:bg-transparent data-[slot=sidebar-menu-button]:p-[5px]! data-[slot=sidebar-menu-button]:pr-4! group-data-[collapsible=icon]:data-[slot=sidebar-menu-button]:p-0!"
            >
              <Link to="/" className="flex max-w-fit items-center gap-2">
                <img
                  src="../src/assets/logo/limospro-icon.png"
                  alt="LimosProIcon"
                  className="size-10 group-data-[collapsible=icon]:size-8"
                />
                <img
                  src="../src/assets/logo/limospro-text.png"
                  alt="LimosProText"
                  className="h-[26px] w-[95px] group-data-[collapsible=icon]:hidden"
                />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Main Content */}
      <SidebarContent>
        <NavMain items={data.navMain} />
        {showDocuments && <NavDocuments items={data.documents} />}
        {showSecondary && <NavSecondary items={data.navSecondary} className="mt-auto" />}
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="bg-transparent group-data-[collapsible=icon]:hidden">
        <div className="font-quicksand space-y-1 py-2 text-center text-base leading-[100%] tracking-[0]">
          <div className="font-bold text-black">Limospro™</div>
          <div className="text-base-black font-medium">Version: 1.0.0</div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
