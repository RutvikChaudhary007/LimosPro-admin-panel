import { Outlet, useLocation } from "react-router-dom";
import ErrorBoundary from "@/components/ErrorBoundary";
import { SiteFooter } from "@/components/layouts/footer/site-footer";
import { NotificationsProvider } from "@/components/layouts/header/notifications-context";
import { SiteHeader } from "@/components/layouts/header/site-header";
import { AppSidebar } from "@/components/layouts/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { PartnerBookingNotification } from "../booking/PartnerBookingNotification";

export default function Layout() {
  const location = useLocation();

  return (
    <NotificationsProvider>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 80)", // 320px
            "--header-height": "calc(var(--spacing) * 22)", // 88px
            "--footer-height": "calc(var(--spacing) * 12)", // 48px
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="overflow-auto">
            <ErrorBoundary key={location.pathname}>
              <Outlet />
            </ErrorBoundary>
          </div>
          <SiteFooter />
          <PartnerBookingNotification />
        </SidebarInset>
      </SidebarProvider>
    </NotificationsProvider>
  );
}
