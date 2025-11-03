import { AppSidebar } from "@/components/layout/partials/app-sidebar"
import { SiteFooter } from "@/components/layout/partials/site-footer"
import { SiteHeader } from "@/components/layout/partials/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Outlet } from "react-router-dom"
export default function Layout() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 75)", // 300px
          "--header-height": "calc(var(--spacing) * 22)", // 88px
          "--footer-height": "calc(var(--spacing) * 17)", // 68px
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <Outlet />
        <SiteFooter />
      </SidebarInset>
    </SidebarProvider>
  )
}
