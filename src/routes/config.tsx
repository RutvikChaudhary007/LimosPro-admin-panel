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

// Affiliate
const AffiliatePage = lazy(() => import("../pages/affiliate/AffiliatePage"));
const CreateAffiliatePage = lazy(
  () => import("../pages/affiliate/formPage/CreateAffiliatePage"),
);
const EditAffiliatePage = lazy(
  () => import("../pages/affiliate/formPage/EditAffiliatePage"),
);
const ViewAffiliatePage = lazy(
  () => import("../pages/affiliate/ViewAffiliatePage"),
);

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

// Our Partners
const OurPartnerPage = lazy(() => import("../pages/ourPartner/OurPartnerPage"));
const CreateOurPartnerPage = lazy(
  () => import("../pages/ourPartner/formpage/CreateOurPartnerPage"),
);
const EditOurPartnerPage = lazy(
  () => import("../pages/ourPartner/formpage/EditOurPartnerPage"),
);

// News
const Newspage = lazy(() => import("../pages/news/Newspage"));
const CreateNewsPage = lazy(
  () => import("../pages/news/formpage/CreateNewsPage"),
);
const EditNewsPage = lazy(() => import("../pages/news/formpage/EditNewsPage"));

// Settings & IP Whitelist
const SettingsPage = lazy(() => import("../pages/settings/SettingsPage"));
const IpWhiteListPage = lazy(
  () => import("../pages/ipWhiteList/IpWhiteListPage"),
);
const CreateIpWhiteListPage = lazy(
  () => import("../pages/ipWhiteList/formpage/CreateIpWhiteListPage"),
);
const EditIpWhiteListPage = lazy(
  () => import("../pages/ipWhiteList/formpage/EditIpWhiteListPage"),
);

// FAQs
const FaqsPage = lazy(() => import("../pages/faqs/FaqsPage"));
const CreateFaqPage = lazy(
  () => import("../pages/faqs/formpage/CreateFaqPage"),
);
const EditFaqPage = lazy(() => import("../pages/faqs/formpage/EditFaqPage"));

// Reports
const ReportPage = lazy(() => import("../pages/report/ReportPage"));

// Content Management
const ContentManagement = lazy(
  () => import("../pages/contentManagment/ContentManagementPage"),
);
const CreateContent = lazy(
  () => import("../pages/contentManagment/formpage/CreateContent"),
);
const EditContent = lazy(
  () => import("../pages/contentManagment/formpage/EditContent"),
);
const SeoPage = lazy(() => import("../pages/contentManagment/SeoPage"));

// Blog Posts
const BlogPostsPage = lazy(
  () => import("../pages/contentManagement/BlogPostsPage"),
);
const CreateBlogPostPage = lazy(
  () => import("../pages/contentManagement/CreateBlogPostPage"),
);
const EditBlogPostPage = lazy(
  () => import("../pages/contentManagement/EditBlogPostPage"),
);
const ViewBlogPostPage = lazy(
  () => import("../pages/contentManagement/ViewBlogPostPage"),
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
    module: "dashboard",
    routes: [{ path: constant.ROUTING_URLS.DASHBOARD, element: DashboardPage }],
  },
  {
    layout: "protected",
    module: "region",
    routes: [
      { path: constant.ROUTING_URLS.REGION, element: RegionDashboardPage },
      { path: constant.ROUTING_URLS.CREATE_REGION, element: AddRegionPage },
      { path: constant.ROUTING_URLS.EDIT_REGION, element: EditRegionPage },
    ],
  },
  {
    layout: "protected",
    module: "regionAdmin",
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
    module: "affiliate",
    routes: [
      { path: constant.ROUTING_URLS.AFFILIATE, element: AffiliatePage },
      {
        path: constant.ROUTING_URLS.CREATE_AFFILIATE,
        element: CreateAffiliatePage,
      },
      {
        path: constant.ROUTING_URLS.EDIT_AFFILIATE,
        element: EditAffiliatePage,
      },
      {
        path: constant.ROUTING_URLS.VIEW_AFFILIATE,
        element: ViewAffiliatePage,
      },
    ],
  },
  {
    layout: "protected",
    module: "chauffeur",
    routes: [
      { path: constant.ROUTING_URLS.CHAUFFEUR, element: ChauffeurPage },
      {
        path: constant.ROUTING_URLS.CREATE_CHAUFFEUR,
        element: CreateChauffeurPage,
      },
      {
        path: constant.ROUTING_URLS.EDIT_CHAUFFEUR,
        element: EditChauffeurPage,
      },
      {
        path: constant.ROUTING_URLS.VIEW_CHAUFFEUR,
        element: ViewChauffeurPage,
      },
    ],
  },
  {
    layout: "protected",
    module: "booking",
    routes: [
      { path: constant.ROUTING_URLS.BOOKING, element: BookingPage },
      { path: constant.ROUTING_URLS.VIEW_BOOKING, element: ViewBookingPage },
    ],
  },
  {
    layout: "protected",
    module: "users",
    routes: [
      { path: constant.ROUTING_URLS.USERS, element: UsersPage },
      { path: constant.ROUTING_URLS.CREATE_USERS, element: CreateUserPage },
      { path: constant.ROUTING_URLS.EDIT_USERS, element: EditUserPage },
      { path: constant.ROUTING_URLS.VIEW_USERS, element: ViewUserPage },
    ],
  },
  {
    layout: "protected",
    module: "fleet",
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
    routes: [
      { path: constant.ROUTING_URLS.TRIPS, element: TripsPage },
      { path: constant.ROUTING_URLS.VIEW_TRIPS, element: ViewTripsPage },
      { path: constant.ROUTING_URLS.TRIPS_MAP, element: TripMapPage },
    ],
  },
  {
    layout: "protected",
    module: "payments",
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
    module: "contactTestimonialPartner",
    routes: [
      {
        path: constant.ROUTING_URLS.CONTACT_REQUESTS,
        element: ContactRequestsPage,
      },
      { path: constant.ROUTING_URLS.TESTIMONIALS, element: TestimonialPage },
      {
        path: constant.ROUTING_URLS.CREATE_TESTIMONIALS,
        element: CreateTestimonailPage,
      },
      {
        path: constant.ROUTING_URLS.EDIT_TESTIMONIALS,
        element: EditTestimonailPage,
      },
      { path: constant.ROUTING_URLS.OUR_PARTNERS, element: OurPartnerPage },
      {
        path: constant.ROUTING_URLS.CREATE_OUR_PARTNERS,
        element: CreateOurPartnerPage,
      },
      {
        path: constant.ROUTING_URLS.EDIT_OUR_PARTNERS,
        element: EditOurPartnerPage,
      },
    ],
  },
  {
    layout: "protected",
    module: "news",
    routes: [
      { path: constant.ROUTING_URLS.NEWS, element: Newspage },
      { path: constant.ROUTING_URLS.CREATE_NEWS, element: CreateNewsPage },
      { path: constant.ROUTING_URLS.EDIT_NEWS, element: EditNewsPage },
    ],
  },
  {
    layout: "protected",
    module: "settings",
    routes: [{ path: constant.ROUTING_URLS.SETTINGS, element: SettingsPage }],
  },
  {
    layout: "protected",
    module: "ipWhiteList",
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
    routes: [
      { path: constant.ROUTING_URLS.FAQ, element: FaqsPage },
      { path: constant.ROUTING_URLS.CREATE_FAQ, element: CreateFaqPage },
      { path: constant.ROUTING_URLS.EDIT_FAQ, element: EditFaqPage },
    ],
  },
  {
    layout: "protected",
    module: "reports",
    routes: [{ path: constant.ROUTING_URLS.REPORTS, element: ReportPage }],
  },
  {
    layout: "protected",
    module: "contentManagement",
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
    module: "seo",
    routes: [{ path: constant.ROUTING_URLS.SEO, element: SeoPage }],
  },
  {
    layout: "protected",
    module: "blogPosts",
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
];
