import { Outlet } from "react-router-dom";
import { AppSidebar } from "@/components/layouts/partials/app-sidebar";
import { NotificationsProvider } from "@/components/layouts/partials/notifications-context";
import { SiteFooter } from "@/components/layouts/partials/site-footer";
import { SiteHeader } from "@/components/layouts/partials/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function Layout() {
  return (
    <NotificationsProvider>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 80)", // 320px
            "--header-height": "calc(var(--spacing) * 22)", // 88px
            "--footer-height": "calc(var(--spacing) * 12)", // 40px
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
    </NotificationsProvider>
  );
}
