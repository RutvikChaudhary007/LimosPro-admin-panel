import { Outlet } from "react-router-dom";
import { AppSidebar } from "@/components/layouts/partials/app-sidebar";
import { SiteFooter } from "@/components/layouts/partials/site-footer";
import { SiteHeader } from "@/components/layouts/partials/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
export default function Layout() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 75)", // 300px
          "--header-height": "calc(var(--spacing) * 22)", // 88px
          "--footer-height": "calc(var(--spacing) * 13)", // 52px
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="overflow-auto">
          <Outlet />
        </div>
        <SiteFooter />
      </SidebarInset>
    </SidebarProvider>
  );
}
