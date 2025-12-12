// import IconAffiliate from "@/assets/Icons/affiliate.svg?react"

import {
  IconAffiliate,
  IconCar,
  IconChartBar,
  IconDatabase,
  IconFileWord,
  IconHeartHandshake,
  IconHelp,
  IconMail,
  IconNews,
  IconReport,
  IconRoute,
  IconSearch,
  IconShield,
  IconStar,
  IconTruck,
  IconUser,
} from "@tabler/icons-react";
import type * as React from "react";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import IconBooking from "@/assets/Icons/booking.svg?react";
// import IconChauffeur from "@/assets/Icons/chauffeur.svg?react"
// import IconCMS from "@/assets/Icons/cms.svg?react"
// import IconContactRequests from "@/assets/Icons/contact-requests.svg?react"
import IconCrew from "@/assets/Icons/crew.svg?react";
import IconHome from "@/assets/Icons/dashboard.svg?react";
// import IconFaq from "@/assets/Icons/faq.svg?react"
// import IconFleet from "@/assets/Icons/fleet.svg?react"
// import IconIp from "@/assets/Icons/ip.svg?react"
// import IconNews from "@/assets/Icons/news.svg?react"
// import IconPartners from "@/assets/Icons/partners.svg?react"
import IconPayments from "@/assets/Icons/payments.svg?react";
import IconRegion from "@/assets/Icons/region.svg?react";
// import IconReports from "@/assets/Icons/reports.svg?react"
import IconSettings from "@/assets/Icons/settings.svg?react";
// import IconStaff from "@/assets/Icons/staff.svg?react"
// import IconTestimonial from "@/assets/Icons/testimonial.svg?react"
// import IconTrips from "@/assets/Icons/trips.svg?react"
import IconUsers from "@/assets/Icons/users.svg?react";

import { NavDocuments } from "@/components/layouts/sidebar/nav-documents";
import { NavMain } from "@/components/layouts/sidebar/nav-main";
import { NavSecondary } from "@/components/layouts/sidebar/nav-secondary";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { constant } from "@/lib/constant";
import { useUserStore } from "@/stores/useAuthStore";
import { hasDynamicAccess } from "@/utils/Helper";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: constant.ROUTING_URLS.DASHBOARD,
      icon: IconHome,
      isActive: true,
    },
    {
      title: "Region Management",
      url: "#",
      icon: IconRegion,
      items: [
        { title: "Regions", url: constant.ROUTING_URLS.REGION },
        { title: "Region Admins", url: constant.ROUTING_URLS.REGION_ADMIN },
      ],
    },
    {
      title: "Affiliate",
      url: constant.ROUTING_URLS.AFFILIATE,
      icon: IconAffiliate,
    },
    {
      title: "Chauffeur",
      url: constant.ROUTING_URLS.CHAUFFEUR,
      icon: IconCar,
    },
    {
      title: "Bookings",
      url: constant.ROUTING_URLS.BOOKING,
      icon: IconBooking,
    },
    {
      title: "Users",
      url: constant.ROUTING_URLS.USERS,
      icon: IconUsers,
    },
    {
      title: "Fleets",
      url: constant.ROUTING_URLS.FLEETS,
      icon: IconTruck,
    },
    {
      title: "Trips",
      url: constant.ROUTING_URLS.TRIPS,
      icon: IconRoute,
    },
    {
      title: "Payments",
      url: constant.ROUTING_URLS.PAYMENTS,
      icon: IconPayments,
    },
    {
      title: "Reports",
      url: constant.ROUTING_URLS.REPORTS,
      icon: IconReport,
    },
    {
      title: "Content Management",
      url: "#",
      icon: IconChartBar,
      items: [
        { title: "Blogs", url: constant.ROUTING_URLS.BLOG_POSTS },
        {
          title: "Pages",
          url: constant.ROUTING_URLS.CONTENT_MANAGEMENT_ALL_PAGES,
        },
        { title: "SEO", url: constant.ROUTING_URLS.SEO },
      ],
    },
    {
      title: "Crew Members",
      url: constant.ROUTING_URLS.CREW_MEMBERS,
      icon: IconCrew,
    },
    {
      title: "Staff Members",
      url: constant.ROUTING_URLS.STAFF_MEMBERS,
      icon: IconUser,
    },
    {
      title: "Contact Requests",
      url: constant.ROUTING_URLS.CONTACT_REQUESTS,
      icon: IconMail,
    },
    {
      title: "Testimonials",
      url: constant.ROUTING_URLS.TESTIMONIALS,
      icon: IconStar,
    },
    {
      title: "News",
      url: constant.ROUTING_URLS.NEWS,
      icon: IconNews,
    },
    {
      title: "FAQs",
      url: constant.ROUTING_URLS.FAQ,
      icon: IconHelp,
    },
    {
      title: "IP White List",
      url: constant.ROUTING_URLS.IP_WHITE_LIST,
      icon: IconShield,
    },
    {
      title: "Our Partners",
      url: constant.ROUTING_URLS.OUR_PARTNERS,
      icon: IconHeartHandshake,
    },
    {
      title: "Settings",
      url: constant.ROUTING_URLS.SETTINGS,
      icon: IconSettings,
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
};

export function AppSidebar({
  showDocuments = false,
  showSecondary = false,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  showDocuments?: boolean;
  showSecondary?: boolean;
}) {
  const { user } = useUserStore();
  const filteredNavigation = useMemo(() => {
    return data.navMain
      .map((item) => {
        // if item has children → filter children
        if (item.items) {
          const allowedChildren = item.items.filter((child) =>
            hasDynamicAccess(child.url, user?.role, user?.permissions),
          );
          // Only keep parent if parent has a route OR children are allowed
          if (
            hasDynamicAccess(item.url, user?.role, user?.permissions) ||
            allowedChildren.length > 0
          ) {
            return { ...item, items: allowedChildren };
          }
          return null; // Changed from [] to null
        }

        // if no children → just check the parent
        return hasDynamicAccess(item.url, user?.role, user?.permissions)
          ? item
          : null; // Changed from [] to null
      })
      .filter(Boolean) as typeof data.navMain;
  }, [user?.permissions, user?.role]);
  return (
    <Sidebar collapsible="icon" {...props}>
      {/* Header */}
      <SidebarHeader className="mx-2 h-[calc(var(--header-height)-8px)] justify-center border-b p-0">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="h-auto data-[slot=sidebar-menu-button]:bg-transparent data-[slot=sidebar-menu-button]:p-[5px]! data-[slot=sidebar-menu-button]:pr-4! group-data-[collapsible=icon]:data-[slot=sidebar-menu-button]:p-0!"
            >
              <Link to="/" className="flex max-w-fit items-center gap-2">
                <img
                  src="/logo/limospro-icon.png"
                  alt="LimosProIcon"
                  className="size-10 transition-all duration-300 ease-in-out group-data-[collapsible=icon]:size-12"
                />
                <img
                  src="/logo/limospro-text.png"
                  alt="LimosProText"
                  className="h-[26px] w-[95px] transition-all duration-300 ease-in-out group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:w-0"
                />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Main Content */}
      <SidebarContent>
        <NavMain items={filteredNavigation} />
        {showDocuments && <NavDocuments items={data.documents} />}
        {showSecondary && (
          <NavSecondary items={data.navSecondary} className="mt-auto" />
        )}
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="overflow-hidden bg-transparent group-data-[collapsible=icon]:w-0 group-data-[collapsible=icon]:p-0 border-t mx-2 pt-2">
        <div className="font-quicksand text-center text-base leading-[100%] tracking-[0]">
          <div className="font-bold text-black">Limospro™</div>
          <div className="text-[11px] text-base-black font-medium">
            Version: 1.0.0
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
