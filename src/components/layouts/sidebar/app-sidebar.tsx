// import IconPartner from "@/assets/Icons/partner.svg?react"
// import IconCMS from "@/assets/Icons/cms.svg?react"
// import IconChauffeur from "@/assets/Icons/chauffeur.svg?react"
// import IconContactRequests from "@/assets/Icons/contact-requests.svg?react"
// import IconFaq from "@/assets/Icons/faq.svg?react"
// import IconFleet from "@/assets/Icons/fleet.svg?react"
// import IconIp from "@/assets/Icons/ip.svg?react"
// import IconNews from "@/assets/Icons/news.svg?react"
// import IconPartners from "@/assets/Icons/partners.svg?react"
// import IconReports from "@/assets/Icons/reports.svg?react"
// import IconStaff from "@/assets/Icons/staff.svg?react"
// import IconTestimonial from "@/assets/Icons/testimonial.svg?react"
// import IconTrips from "@/assets/Icons/trips.svg?react"

import {
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
  IconTicket,
  IconTruck,
  IconUser,
} from "@tabler/icons-react";
import { Store } from "lucide-react";
import type * as React from "react";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import IconBooking from "@/assets/Icons/booking.svg?react";
import IconHome from "@/assets/Icons/dashboard.svg?react";
import IconPayments from "@/assets/Icons/payments.svg?react";
import IconRegion from "@/assets/Icons/region.svg?react";
import IconSettings from "@/assets/Icons/settings.svg?react";
import IconUsers from "@/assets/Icons/users.svg?react";
import { NavDocuments } from "@/components/layouts/sidebar/nav-documents";
import { NavMain } from "@/components/layouts/sidebar/nav-main";
import { NavSecondary } from "@/components/layouts/sidebar/nav-secondary";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { usePermission } from "@/hooks/usePermission";
import { constant } from "@/lib/constant";

type NavItem = {
  title: string;
  url: string;
  icon?: any;
  isActive?: boolean;
  permission?: string | string[];
  action?: string;
  items?: {
    title: string;
    url: string;
    permission?: string | string[];
    action?: string;
  }[];
};

const data: {
  navMain: NavItem[];
  documents: any[];
  navSecondary: any[];
} = {
  navMain: [
    {
      title: "Dashboard",
      url: constant.ROUTING_URLS.DASHBOARD,
      icon: IconHome,
      isActive: true,
      permission: "manageDashboard",
      action: "view",
    },
    {
      title: "Region Management",
      url: "#",
      icon: IconRegion,
      items: [
        {
          title: "Regions",
          url: constant.ROUTING_URLS.REGION,
          permission: "manageRegions",
          action: "view",
        },
        {
          title: "Region Admins",
          url: constant.ROUTING_URLS.REGION_ADMIN,
          permission: "manageRegionAdmins",
          action: "view",
        },
      ],
    },
    {
      title: "Partners",
      url: constant.ROUTING_URLS.PARTNER,
      icon: IconHeartHandshake,
      permission: "managePartners",
      action: "view",
    },
    {
      title: "Chauffeur",
      url: constant.ROUTING_URLS.CHAUFFEUR,
      icon: IconCar,
      permission: ["manageChauffeurs", "managePartnerChauffeurs"],
      action: "view",
    },
    {
      title: "Bookings",
      url: constant.ROUTING_URLS.BOOKING,
      icon: IconBooking,
      permission: "manageBookings",
      action: "view",
    },
    // {
    //   title: "Dispatch",
    //   url: constant.ROUTING_URLS.DISPATCH_DASHBOARD,
    //   icon: IconChartBar,
    //   permission: "manageBookings",
    //   action: "view",
    // },
    {
      title: "Users",
      url: constant.ROUTING_URLS.USERS,
      icon: IconUsers,
      permission: "manageUsers",
      action: "view",
    },
    {
      title: "Fleets",
      url: constant.ROUTING_URLS.FLEETS,
      icon: IconTruck,
      permission: "manageFleets",
      action: "view",
    },
    {
      title: "Service Pricing",
      url: constant.ROUTING_URLS.SERVICE_PRICING,
      icon: Store,
      permission: "setRegionPricing",
      action: "view",
    },
    {
      title: "Trips",
      url: constant.ROUTING_URLS.TRIPS,
      icon: IconRoute,
      permission: "manageTrips",
      action: "view",
    },
    {
      title: "Payments",
      url: "#",
      icon: IconPayments,
      items: [
        {
          title: "Payments",
          url: constant.ROUTING_URLS.PAYMENTS,
          permission: "managePayments",
          action: "view",
        },
        {
          title: "Payouts",
          url: constant.ROUTING_URLS.PAYOUTS,
          permission: "managePayments",
          action: "view",
        },
      ],
    },
    {
      title: "Reports",
      url: constant.ROUTING_URLS.REPORTS,
      icon: IconReport,
      permission: "manageReports",
      action: "view",
    },
    {
      title: "Audit Logs",
      url: constant.ROUTING_URLS.AUDIT_LOGS,
      icon: IconFileWord,
      permission: "manageReports",
      action: "view",
    },
    {
      title: "Content Management",
      url: "#",
      icon: IconChartBar,
      items: [
        {
          title: "Blogs",
          url: constant.ROUTING_URLS.BLOG_POSTS,
          permission: "manageBlogs",
          action: "view",
        },
        {
          title: "Pages",
          url: constant.ROUTING_URLS.CONTENT_MANAGEMENT_ALL_PAGES,
          permission: "manageContentManagement",
          action: "view",
        },
        {
          title: "FAQs",
          url: constant.ROUTING_URLS.CONTENT_FAQ,
          permission: "manageContentManagement",
          action: "view",
        },
      ],
    },
    {
      title: "Staff Members",
      url: constant.ROUTING_URLS.STAFF_MEMBERS,
      icon: IconUser,
      permission: "manageStaffMembers",
      action: "view",
    },
    {
      title: "Contact Requests",
      url: constant.ROUTING_URLS.CONTACT_REQUESTS,
      icon: IconMail,
      permission: "manageContactRequests",
      action: "view",
    },
    {
      title: "Testimonials",
      url: constant.ROUTING_URLS.TESTIMONIALS,
      icon: IconStar,
      permission: "manageTestimonials",
      action: "view",
    },
    {
      title: "News",
      url: constant.ROUTING_URLS.NEWS,
      icon: IconNews,
      permission: "manageNews",
      action: "view",
    },
    {
      title: "App FAQs",
      url: constant.ROUTING_URLS.FAQ,
      icon: IconHelp,
      permission: "manageContentManagement",
      action: "view",
    },
    {
      title: "IP Access",
      url: constant.ROUTING_URLS.IP_WHITE_LIST,
      icon: IconShield,
      permission: "manageIpAccess",
      action: "view",
    },
    {
      title: "Support Tickets",
      url: constant.ROUTING_URLS.SUPPORT_TICKETS,
      icon: IconTicket,
      permission: "manageContactRequests",
      action: "view",
    },
    {
      title: "Settings",
      url: constant.ROUTING_URLS.SETTINGS,
      icon: IconSettings,
      permission: "manageSettings",
      action: "view",
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
  const { hasPermission } = usePermission();

  const filteredNavigation = useMemo(() => {
    return data.navMain
      .map((item) => {
        // if item has children → filter children
        if (item.items) {
          const allowedChildren = item.items.filter(
            (child) =>
              !child.permission ||
              hasPermission(child.permission, child.action || "view"),
          );

          if (allowedChildren.length > 0) {
            return { ...item, items: allowedChildren };
          }
          return null;
        }

        // if no children → just check the parent
        return !item.permission ||
          hasPermission(item.permission, item.action || "view")
          ? item
          : null;
      })
      .filter(Boolean) as NavItem[];
  }, [hasPermission]);
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
              <Link to="/" className="flex max-w-fit items-center !gap-2">
                <img
                  src="/logo/limospro-logo.png"
                  alt="LimosProLogo"
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
        <ScrollArea className="h-full flex min-h-0 flex-1 flex-col gap-2">
          <NavMain items={filteredNavigation} />
          {showDocuments && <NavDocuments items={data.documents} />}
          {showSecondary && (
            <NavSecondary items={data.navSecondary} className="mt-auto" />
          )}
        </ScrollArea>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="overflow-hidden bg-transparent group-data-[collapsible=icon]:w-0 group-data-[collapsible=icon]:p-0 border-t mx-2 pt-2">
        <div className="font-quicksand text-center text-base leading-[100%] tracking-[0]">
          <div className="font-bold text-black">LimosPro™</div>
          <div className="text-[11px] text-base-black font-medium">
            Version: 1.0.0
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
