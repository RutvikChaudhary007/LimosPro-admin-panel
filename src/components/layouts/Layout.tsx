import { Outlet } from "react-router-dom";
import { SiteFooter } from "@/components/layouts/footer/site-footer";
import { NotificationsProvider } from "@/components/layouts/header/notifications-context";
import { SiteHeader } from "@/components/layouts/header/site-header";
import { AppSidebar } from "@/components/layouts/sidebar/app-sidebar";
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
