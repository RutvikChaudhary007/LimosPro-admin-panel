import { lazy } from "react";
import { Navigate } from "react-router-dom";
import { constant } from "@/lib/constant";

// Auth routes
const LoginPage = lazy(() => import("../pages/auth/LoginPage"));

// Dashboard
const DashboardPage = lazy(() => import("../pages/dashboard/Dashboard"));
const DashboardRedirect = () => (
  <Navigate to={constant.ROUTING_URLS.DASHBOARD} replace />
);

// Region
const RegionDashboardPage = lazy(
  () => import("../pages/region/RegionDashboardPage"),
);
const AddRegionPage = lazy(
  () => import("../pages/region/formpage/AddRegionPage"),
);
const EditRegionPage = lazy(
  () => import("../pages/region/formpage/EditRegionPage"),
);

// Region Admin
const RegionAdminPage = lazy(
  () => import("../pages/regionAdmin/RegionAdminPage"),
);
const AddRegionAdmin = lazy(
  () => import("../pages/regionAdmin/formpage/AddRegionAdmin"),
);
const EditRegionAdmin = lazy(
  () => import("../pages/regionAdmin/formpage/EditRegionAdmin"),
);

// Partner
const PartnerPage = lazy(() => import("../pages/partner/PartnerPage"));
const CreatePartnerPage = lazy(
  () => import("../pages/partner/formPage/CreatePartnerPage"),
);
const EditPartnerPage = lazy(
  () => import("../pages/partner/formPage/EditPartnerPage"),
);
const ViewPartnerPage = lazy(() => import("../pages/partner/ViewPartnerPage"));

// Chauffeur
const ChauffeurPage = lazy(() => import("../pages/chauffeur/ChauffeurPage"));
const CreateChauffeurPage = lazy(
  () => import("../pages/chauffeur/formPage/CreateChauffeurPage"),
);
const EditChauffeurPage = lazy(
  () => import("../pages/chauffeur/formPage/EditChauffeurPage"),
);
const ViewChauffeurPage = lazy(
  () => import("../pages/chauffeur/ViewChauffeurPage"),
);

// Booking
const BookingPage = lazy(() => import("../pages/booking/BookingPage"));
const ViewBookingPage = lazy(() => import("../pages/booking/ViewBookingPage"));

// Users
const UsersPage = lazy(() => import("../pages/users/UsersPage"));
const CreateUserPage = lazy(
  () => import("../pages/users/formPage/CreateUserPage"),
);
const EditUserPage = lazy(() => import("../pages/users/formPage/EditUserPage"));
const ViewUserPage = lazy(() => import("../pages/users/ViewUserPage"));

// Notifications
const NotificationsPage = lazy(
  () => import("../pages/notifications/NotificationsPage"),
);

// Fleet
const FleetPage = lazy(() => import("../pages/fleet/FleetPage"));
const CreateFleetPage = lazy(
  () => import("../pages/fleet/formPage/CreateFleetPage"),
);
const EditFleetPage = lazy(
  () => import("../pages/fleet/formPage/EditFleetPage"),
);
const ViewFleetPage = lazy(() => import("../pages/fleet/ViewFleetPage"));

// Trips
const TripsPage = lazy(() => import("../pages/trips/TripsPage"));
const ViewTripsPage = lazy(() => import("../pages/trips/ViewTripsPage"));
const TripMapPage = lazy(() => import("../pages/trips/TripMapPage"));

// Payments & Refunds
const PaymentsPage = lazy(() => import("../pages/payments/PaymentsPage"));
const ViewPaymentPage = lazy(() => import("../pages/payments/ViewPaymentPage"));
const RefundPage = lazy(() => import("../pages/refund/RefundPage"));
const ViewRefundPage = lazy(() => import("../pages/refund/ViewRefundPage"));
const RefundRequestPage = lazy(
  () => import("../pages/refundRequest/RefundRequestPage"),
);

// Crew & Staff
const CrewMemberPage = lazy(() => import("../pages/crewMember/CrewMemberPage"));
const CreateCrewMemberPage = lazy(
  () => import("../pages/crewMember/formpage/CreateCrewMemberPage"),
);
const EditCrewMemberPage = lazy(
  () => import("../pages/crewMember/formpage/EditCrewMemberPage"),
);

const StaffMemberPage = lazy(
  () => import("../pages/staffMember/StaffMemberPage"),
);
const CreateStaffMemberPage = lazy(
  () => import("../pages/staffMember/formpage/CreateStaffMemberPage"),
);
const EditStaffMemberPage = lazy(
  () => import("../pages/staffMember/formpage/EditStaffMemberPage"),
);

// Contact Requests
const ContactRequestsPage = lazy(
  () => import("../pages/contactRequests/ContactRequestsPage"),
);

// Support Tickets
const SupportTicketsPage = lazy(
  () => import("../pages/supportTickets/supportTickets"),
);
const ViewSupportTicketPage = lazy(
  () => import("../pages/supportTickets/ViewSupportTicketPage"),
);

// Testimonials
const TestimonialPage = lazy(
  () => import("../pages/testimonial/TestimonialPage"),
);
const CreateTestimonailPage = lazy(
  () => import("../pages/testimonial/formpage/CreateTestimonailPage"),
);
const EditTestimonailPage = lazy(
  () => import("../pages/testimonial/formpage/EditTestimonailPage"),
);

// News
const Newspage = lazy(() => import("../pages/news/Newspage"));
const CreateNewsPage = lazy(
  () => import("../pages/news/formpage/CreateNewsPage"),
);
const EditNewsPage = lazy(() => import("../pages/news/formpage/EditNewsPage"));

// Settings & IP Whitelist
// const SettingsPage = lazy(() => import("../pages/settings/SettingsPage"));
const SiteSettingsPage = lazy(
  () => import("../pages/settings/SiteSettingsPage"),
);
const IpWhiteListPage = lazy(
  () => import("../pages/ipWhiteList/IpWhiteListPage"),
);
const CreateIpWhiteListPage = lazy(
  () => import("../pages/ipWhiteList/formpage/CreateIpWhiteListPage"),
);
const EditIpWhiteListPage = lazy(
  () => import("../pages/ipWhiteList/formpage/EditIpWhiteListPage"),
);
const AccountSettings = lazy(() => import("../pages/settings/account/page"));

// FAQs
const FAQsPage = lazy(() => import("../pages/faqs/page")); //** New Index Page Of Faqs For CMS Pages **//
const FaqsListPage = lazy(() => import("../pages/faqs/FaqsPage")); //** FAQs listing page For Mobile App **//
const CreateFaqPage = lazy(
  () => import("../pages/faqs/formpage/CreateFaqPage"),
);
const EditFaqPage = lazy(() => import("../pages/faqs/formpage/EditFaqPage"));

// Reports
const ReportPage = lazy(() => import("../pages/reports/ReportsLayout"));

// Content Management
// const ContentManagement = lazy(() => import("../pages/contentManagement/Pages/PageListPage"));
const ContentManagement = lazy(
  () => import("../pages/contentManagement/Pages/CMSPageList"),
);
const CMSCategoryRouter = lazy(
  () => import("../pages/contentManagement/Pages/CMSCategoryRouter"),
);
const CreateContent = () => <CMSCategoryRouter mode="create" />;
const EditContent = () => <CMSCategoryRouter mode="edit" />;
// const PagePreview = lazy(
//   () => import("../pages/contentManagement/Pages/PagePreview"),
// );
// const SeoPage = lazy(() => import("../pages/contentManagement/SeoPage"));

// Blog Posts
const BlogPostsPage = lazy(
  () => import("../pages/contentManagement/blogs/BlogPostsPage"),
);
const CreateBlogPostPage = lazy(
  () => import("../pages/contentManagement/blogs/CreateBlogPostPage"),
);
const EditBlogPostPage = lazy(
  () => import("../pages/contentManagement/blogs/EditBlogPostPage"),
);
const ViewBlogPostPage = lazy(
  () => import("../pages/contentManagement/blogs/ViewBlogPostPage"),
);

// Components (Demo)
const ButtonPage = lazy(() => import("../pages/components/ButtonPage"));
const TextFieldPage = lazy(() => import("../pages/components/TextFieldPage"));
const BadgePage = lazy(() => import("../pages/components/BadgePage"));
const AlertPage = lazy(() => import("../pages/components/AlertPage"));
const CardPage = lazy(() => import("../pages/components/CardPage"));
const FileUploadPage = lazy(() => import("../pages/components/FileUploadPage"));
const SelectOptionPage = lazy(
  () => import("../pages/components/SelectOptionPage"),
);
const SwitchPage = lazy(() => import("../pages/components/SwitchPage"));
const AccordionPage = lazy(() => import("../pages/components/AccordionPage"));
const UnauthorizedPage = lazy(() => import("../pages/UnauthorizedPage"));

export const routesConfig = [
  {
    layout: "auth",
    routes: [{ path: constant.ROUTING_URLS.ADMIN_LOGIN, element: LoginPage }],
  },
  {
    layout: "protected",
    module: "dashboardRedirect",
    routes: [
      {
        path: "/",
        element: DashboardRedirect,
      },
    ],
  },
  {
    layout: "protected",
    module: "supportTickets",
    permission: "manageIpAccess",
    action: "view",
    routes: [
      {
        path: constant.ROUTING_URLS.SUPPORT_TICKETS,
        element: SupportTicketsPage,
      },
      {
        path: constant.ROUTING_URLS.VIEW_SUPPORT_TICKETS,
        element: ViewSupportTicketPage,
      },
    ],
  },
  {
    layout: "protected",
    module: "dashboard",
    routes: [{ path: constant.ROUTING_URLS.DASHBOARD, element: DashboardPage }],
  },
  {
    layout: "protected",
    module: "region",
    permission: "manageRegions",
    action: "view",
    routes: [
      { path: constant.ROUTING_URLS.REGION, element: RegionDashboardPage },
      { path: constant.ROUTING_URLS.CREATE_REGION, element: AddRegionPage },
      { path: constant.ROUTING_URLS.EDIT_REGION, element: EditRegionPage },
    ],
  },
  {
    layout: "protected",
    module: "regionAdmin",
    permission: "manageRegionAdmins",
    action: "view",
    routes: [
      { path: constant.ROUTING_URLS.REGION_ADMIN, element: RegionAdminPage },
      {
        path: constant.ROUTING_URLS.CREATE_REGION_ADMIN,
        element: AddRegionAdmin,
      },
      {
        path: constant.ROUTING_URLS.EDIT_REGION_ADMIN,
        element: EditRegionAdmin,
      },
    ],
  },
  {
    layout: "protected",
    module: "partner",
    permission: "managePartners",
    action: "view",
    routes: [
      { path: constant.ROUTING_URLS.PARTNER, element: PartnerPage },
      {
        path: constant.ROUTING_URLS.CREATE_PARTNER,
        element: CreatePartnerPage,
      },
      {
        path: constant.ROUTING_URLS.EDIT_PARTNER,
        element: EditPartnerPage,
      },
      {
        path: constant.ROUTING_URLS.VIEW_PARTNER,
        element: ViewPartnerPage,
      },
    ],
  },
  {
    layout: "protected",
    module: "chauffeur",
    permission: "manageChauffeurs",
    action: "view",
    routes: [
      { path: constant.ROUTING_URLS.CHAUFFEUR, element: ChauffeurPage },
      {
        path: constant.ROUTING_URLS.VIEW_CHAUFFEUR,
        element: ViewChauffeurPage,
      },
    ],
  },
  {
    layout: "protected",
    module: "chauffeur-create",
    permission: "managePartnerChauffeurs",
    action: "create",
    routes: [
      {
        path: constant.ROUTING_URLS.CREATE_CHAUFFEUR,
        element: CreateChauffeurPage,
      },
    ],
  },
  {
    layout: "protected",
    module: "chauffeur-edit",
    permission: "managePartnerChauffeurs",
    action: "update",
    routes: [
      {
        path: constant.ROUTING_URLS.EDIT_CHAUFFEUR,
        element: EditChauffeurPage,
      },
    ],
  },
  {
    layout: "protected",
    module: "booking",
    permission: "manageBookings",
    action: "view",
    routes: [
      { path: constant.ROUTING_URLS.BOOKING, element: BookingPage },
      { path: constant.ROUTING_URLS.VIEW_BOOKING, element: ViewBookingPage },
    ],
  },
  {
    layout: "protected",
    module: "users",
    permission: "manageUsers",
    action: "view",
    routes: [
      { path: constant.ROUTING_URLS.USERS, element: UsersPage },
      { path: constant.ROUTING_URLS.CREATE_USERS, element: CreateUserPage },
      { path: constant.ROUTING_URLS.EDIT_USERS, element: EditUserPage },
      { path: constant.ROUTING_URLS.VIEW_USERS, element: ViewUserPage },
    ],
  },
  {
    layout: "protected",
    module: "notifications",
    permission: "manageNotifications", // Notifications often related to trips in this app context? Previous was "Trips".
    action: "view",
    routes: [
      { path: constant.ROUTING_URLS.NOTIFICATION, element: NotificationsPage },
    ],
  },
  {
    layout: "protected",
    module: "fleet",
    permission: "manageFleets",
    action: "view",
    routes: [
      { path: constant.ROUTING_URLS.FLEETS, element: FleetPage },
      { path: constant.ROUTING_URLS.CREATE_FLEET, element: CreateFleetPage },
      { path: constant.ROUTING_URLS.EDIT_FLEET, element: EditFleetPage },
      { path: constant.ROUTING_URLS.VIEW_FLEET, element: ViewFleetPage },
    ],
  },
  {
    layout: "protected",
    module: "trips",
    permission: "manageTrips",
    action: "view",
    routes: [
      { path: constant.ROUTING_URLS.TRIPS, element: TripsPage },
      { path: constant.ROUTING_URLS.VIEW_TRIPS, element: ViewTripsPage },
      { path: constant.ROUTING_URLS.TRIPS_MAP, element: TripMapPage },
    ],
  },
  {
    layout: "protected",
    module: "payments",
    permission: "managePayments",
    action: "view",
    routes: [
      { path: constant.ROUTING_URLS.PAYMENTS, element: PaymentsPage },
      { path: constant.ROUTING_URLS.VIEW_PAYMENTS, element: ViewPaymentPage },
      { path: constant.ROUTING_URLS.REFUND, element: RefundPage },
      { path: constant.ROUTING_URLS.VIEW_REFUND, element: ViewRefundPage },
      {
        path: constant.ROUTING_URLS.REFUND_REQUEST,
        element: RefundRequestPage,
      },
    ],
  },
  {
    layout: "protected",
    module: "crewStaff",
    permission: "manageStaffMembers",
    action: "view",
    routes: [
      { path: constant.ROUTING_URLS.CREW_MEMBERS, element: CrewMemberPage },
      {
        path: constant.ROUTING_URLS.CREATE_CREW_MEMBERS,
        element: CreateCrewMemberPage,
      },
      {
        path: constant.ROUTING_URLS.EDIT_CREW_MEMBERS,
        element: EditCrewMemberPage,
      },
      { path: constant.ROUTING_URLS.STAFF_MEMBERS, element: StaffMemberPage },
      {
        path: constant.ROUTING_URLS.CREATE_STAFF_MEMBERS,
        element: CreateStaffMemberPage,
      },
      {
        path: constant.ROUTING_URLS.EDIT_STAFF_MEMBERS,
        element: EditStaffMemberPage,
      },
    ],
  },
  {
    layout: "protected",
    module: "contactRequests",
    permission: "manageContactRequests",
    action: "view",
    routes: [
      {
        path: constant.ROUTING_URLS.CONTACT_REQUESTS,
        element: ContactRequestsPage,
      },
    ],
  },
  {
    layout: "protected",
    module: "testimonials",
    permission: "manageTestimonials",
    action: "view",
    routes: [
      { path: constant.ROUTING_URLS.TESTIMONIALS, element: TestimonialPage },
      {
        path: constant.ROUTING_URLS.CREATE_TESTIMONIALS,
        element: CreateTestimonailPage,
      },
      {
        path: constant.ROUTING_URLS.EDIT_TESTIMONIALS,
        element: EditTestimonailPage,
      },
    ],
  },
  {
    layout: "protected",
    module: "news",
    permission: "manageNews",
    action: "view",
    routes: [
      { path: constant.ROUTING_URLS.NEWS, element: Newspage },
      { path: constant.ROUTING_URLS.CREATE_NEWS, element: CreateNewsPage },
      { path: constant.ROUTING_URLS.EDIT_NEWS, element: EditNewsPage },
    ],
  },
  {
    layout: "protected",
    module: "settings",
    permission: "manageSettings",
    action: "view",
    routes: [
      { path: constant.ROUTING_URLS.SETTINGS, element: SiteSettingsPage },
    ],
  },
  {
    layout: "protected",
    module: "account",
    permission: "manageAccount",
    action: "view",
    routes: [
      {
        path: constant.ROUTING_URLS.ACCOUNT_SETTINGS,
        element: AccountSettings,
      },
    ],
  },
  {
    layout: "protected",
    module: "ipWhiteList",
    permission: "manageIpAccess",
    action: "view",
    routes: [
      { path: constant.ROUTING_URLS.IP_WHITE_LIST, element: IpWhiteListPage },
      {
        path: constant.ROUTING_URLS.CREATE_IP_WHITE_LIST,
        element: CreateIpWhiteListPage,
      },
      {
        path: constant.ROUTING_URLS.EDIT_IP_WHITE_LIST,
        element: EditIpWhiteListPage,
      },
    ],
  },
  {
    layout: "protected",
    module: "faqs",
    permission: "manageContentManagement", // FAQs mapped to manageContentManagement as per previous decision
    action: "view",
    routes: [
      { path: constant.ROUTING_URLS.FAQ, element: FaqsListPage },
      { path: constant.ROUTING_URLS.CREATE_FAQ, element: CreateFaqPage },
      { path: constant.ROUTING_URLS.EDIT_FAQ, element: EditFaqPage },
    ],
  },
  {
    layout: "protected",
    module: "reports",
    permission: "manageReports",
    action: "view",
    routes: [{ path: constant.ROUTING_URLS.REPORTS, element: ReportPage }],
  },
  {
    layout: "protected",
    module: "contentManagement",
    permission: "manageContentManagement",
    action: "view",
    routes: [
      {
        path: constant.ROUTING_URLS.CONTENT_MANAGEMENT_ALL_PAGES,
        element: ContentManagement,
      },
      {
        path: constant.ROUTING_URLS.CREATE_CONTENT_MANAGEMENT,
        element: CreateContent,
      },
      {
        path: constant.ROUTING_URLS.EDIT_CONTENT_MANAGEMENT,
        element: EditContent,
      },
    ],
  },
  {
    layout: "protected",
    module: "blogPosts",
    permission: "manageBlogs",
    action: "view",
    routes: [
      { path: constant.ROUTING_URLS.BLOG_POSTS, element: BlogPostsPage },
      {
        path: constant.ROUTING_URLS.CREATE_BLOG_POST,
        element: CreateBlogPostPage,
      },
      { path: constant.ROUTING_URLS.EDIT_BLOG_POST, element: EditBlogPostPage },
      { path: constant.ROUTING_URLS.VIEW_BLOG_POST, element: ViewBlogPostPage },
    ],
  },
  {
    layout: "protected",
    module: "Faqs",
    permission: "manageContentManagement",
    action: "view",
    routes: [{ path: constant.ROUTING_URLS.CONTENT_FAQ, element: FAQsPage }],
  },
  {
    layout: "default",
    module: "components",
    routes: [
      { path: "components/button", element: ButtonPage },
      { path: "components/text-field", element: TextFieldPage },
      { path: "components/badge", element: BadgePage },
      { path: "components/alert", element: AlertPage },
      { path: "components/card", element: CardPage },
      { path: "components/file", element: FileUploadPage },
      { path: "components/select-option", element: SelectOptionPage },
      { path: "components/switch", element: SwitchPage },
      { path: "components/accordion", element: AccordionPage },
    ],
  },
  {
    layout: "protected",
    module: "unauthorized",
    routes: [{ path: "/unauthorized", element: UnauthorizedPage }],
  },
];
