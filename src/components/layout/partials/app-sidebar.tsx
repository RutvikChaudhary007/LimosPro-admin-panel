// import IconAffiliate from "@/assets/Icons/affiliate.svg?react"
import IconBooking from "@/assets/Icons/booking.svg?react"
// import IconChauffeur from "@/assets/Icons/chauffeur.svg?react"
// import IconCMS from "@/assets/Icons/cms.svg?react"
// import IconContactRequests from "@/assets/Icons/contact-requests.svg?react"
import IconCrew from "@/assets/Icons/crew.svg?react"
import IconHome from "@/assets/Icons/dashboard.svg?react"
// import IconFaq from "@/assets/Icons/faq.svg?react"
// import IconFleet from "@/assets/Icons/fleet.svg?react"
// import IconIp from "@/assets/Icons/ip.svg?react"
// import IconNews from "@/assets/Icons/news.svg?react"
// import IconPartners from "@/assets/Icons/partners.svg?react"
import IconPayments from "@/assets/Icons/payments.svg?react"
import IconRegion from "@/assets/Icons/region.svg?react"
// import IconReports from "@/assets/Icons/reports.svg?react"
import IconSettings from "@/assets/Icons/settings.svg?react"
// import IconStaff from "@/assets/Icons/staff.svg?react"
// import IconTestimonial from "@/assets/Icons/testimonial.svg?react"
// import IconTrips from "@/assets/Icons/trips.svg?react"
import IconUsers from "@/assets/Icons/users.svg?react"

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
} from "@tabler/icons-react"
import * as React from "react"
import { Link } from "react-router-dom"

import { NavDocuments } from "@/components/layout/partials/nav-documents"
import { NavMain } from "@/components/layout/partials/nav-main"
import { NavSecondary } from "@/components/layout/partials/nav-secondary"
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
  user: [
    {
      name: "Alaadin",
      email: "alaadin@example.com",
      avatar: "/avatars/alaadin.jpg",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconHome,
      isActive: true,
    },
    {
      title: "Region Management",
      url: "#",
      icon: IconRegion,
      items: [
        { title: "Regions", url: "/region-management/regions" },
        { title: "Region Admins", url: "/region-management/region-admins" },
      ],
    },
    {
      title: "Affiliate",
      url: "/affiliate",
      icon: IconAffiliate,
    },
    {
      title: "Chauffeur",
      url: "/chauffeur",
      icon: IconCar,
    },
    {
      title: "Bookings",
      url: "/bookings",
      icon: IconBooking,
    },
    {
      title: "Users",
      url: "/users",
      icon: IconUsers,
    },
    {
      title: "Fleets",
      url: "/fleets",
      icon: IconTruck,
    },
    {
      title: "Trips",
      url: "/trips",
      icon: IconRoute,
    },
    {
      title: "Payments",
      url: "/payments",
      icon: IconPayments,
    },
    {
      title: "Reports",
      url: "/reports",
      icon: IconReport,
    },
    {
      title: "Content Management",
      url: "#",
      icon: IconChartBar,
      items: [
        { title: "Blogs", url: "/content-management/blogs" },
        { title: "Pages", url: "/content-management/pages" },
        { title: "Seo", url: "/content-management/seo" },
      ],
    },
    {
      title: "Crew Members",
      url: "/crew-members",
      icon: IconCrew,
    },
    {
      title: "Staff Members",
      url: "/staff-members",
      icon: IconUser,
    },
    {
      title: "Contact Requests",
      url: "/contact-requests",
      icon: IconMail,
    },
    {
      title: "Testimonials",
      url: "/testimonials",
      icon: IconStar,
    },
    {
      title: "News",
      url: "/news",
      icon: IconNews,
    },
    {
      title: "FAQs",
      url: "/faqs",
      icon: IconHelp,
    },
    {
      title: "IP White List",
      url: "/ip-whitelist",
      icon: IconShield,
    },
    {
      title: "Our Partners",
      url: "/our-partners",
      icon: IconHeartHandshake,
    },
    {
      title: "Settings",
      url: "/settings",
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
                  src="/logo/limospro-icon.png"
                  alt="LimosProIcon"
                  className="size-10 group-data-[collapsible=icon]:size-8"
                />
                <img
                  src="/logo/limospro-text.png"
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
      <SidebarFooter className="overflow-hidden bg-transparent py-2 group-data-[collapsible=icon]:w-0 group-data-[collapsible=icon]:p-0">
        <div className="font-quicksand space-y-1 text-center text-base leading-[100%] tracking-[0]">
          <div className="font-bold text-black">Limospro™</div>
          <div className="text-base-black font-medium">Version: 1.0.0</div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

export const user = data.user[0]
