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
import { constant } from "@/lib/constant"

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
        { title: "Pages", url: constant.ROUTING_URLS.CONTENT_MANAGEMENT_ALL_PAGES },
        { title: "Seo", url: constant.ROUTING_URLS.SEO },
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
