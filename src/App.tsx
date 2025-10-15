import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import { TooltipProvider } from "./components/ui/tooltip";
import { lazy } from "react";
const AdminLoginPage = lazy(() => import("./pages/admin/AdminLoginPage"));
const DashboardPage = lazy(() => import("./pages/admin/DashboardPage"));
const RegionDashboardPage = lazy(() => import("./pages/region/RegionDashboardPage"));
const AddRegionPage = lazy(() => import("./pages/region/formpage/AddRegionPage"));
const RegionAdminPage = lazy(() => import("./pages/regionAdmin/RegionAdminPage"));
const AddRegionAdmin = lazy(() => import("./pages/regionAdmin/formpage/AddRegionAdmin"));
const AffiliatePage = lazy(() => import("./pages/affiliate/AffiliatePage"));
const ChauffeurPage = lazy(() => import("./pages/chauffeur/ChauffeurPage"));
const BookingPage = lazy(() => import("./pages/booking/BookingPage"));
const UsersPage = lazy(() => import("./pages/users/UsersPage"));
const FleetPage = lazy(() => import("./pages/fleet/FleetPage"));
const TripsPage = lazy(() => import("./pages/trips/TripsPage"));
const CreateAffiliatePage = lazy(() => import("./pages/affiliate/formPage/CreateAffiliatePage"));
const EditAffiliatePage = lazy(() => import("./pages/affiliate/formPage/EditAffiliatePage"));
const ViewAffiliatePage = lazy(() => import("./pages/affiliate/ViewAffiliatePage"));
import { constant } from "./lib/constant";
const EditChauffeurPage = lazy(() => import("./pages/chauffeur/formPage/EditChauffeurPage"));
const CreateChauffeurPage = lazy(() => import("./pages/chauffeur/formPage/CreateChauffeurPage"));
const ViewChauffeurPage = lazy(() => import("./pages/chauffeur/ViewChauffeurPage"));
const CreateUserPage = lazy(() => import("./pages/users/formPage/CreateUserPage"));
const EditUserPage = lazy(() => import("./pages/users/formPage/EditUserPage"));
const ViewUserPage = lazy(() => import("./pages/users/ViewUserPage"));
const CreateFleetPage = lazy(() => import("./pages/fleet/formPage/CreateFleetPage"));
const ViewFleetPage = lazy(() => import("./pages/fleet/ViewFleetPage"));
const EditFleetPage = lazy(() => import("./pages/fleet/formPage/EditFleetPage"));
// import NotificationPage from "./pages/notifications/NotificationPage";
const ViewTripsPage = lazy(() => import("./pages/trips/ViewTripsPage"));
const PaymentsPage = lazy(() => import("./pages/payments/PaymentsPage"));
const ViewPaymentPage = lazy(() => import("./pages/payments/ViewPaymentPage"));
const RefundPage = lazy(() => import("./pages/refund/RefundPage"));
const ViewRefundPage = lazy(() => import("./pages/refund/ViewRefundPage"));
const RefundRequestPage = lazy(() => import("./pages/refundRequest/RefundRequestPage"));
const CrewMemberPage = lazy(() => import("./pages/crewMember/CrewMemberPage"));
const StaffMemberPage = lazy(() => import("./pages/staffMember/StaffMemberPage"));
const CreateStaffMemberPage = lazy(() => import("./pages/staffMember/formpage/CreateStaffMemberPage"));
const EditStaffMemberPage = lazy(() => import("./pages/staffMember/formpage/EditStaffMemberPage"));
const ContactRequestsPage = lazy(() => import("./pages/contactRequests/ContactRequestsPage"));
const TestimonialPage = lazy(() => import("./pages/testimonial/TestimonialPage"));
const CreateTestimonailPage = lazy(() => import("./pages/testimonial/formpage/CreateTestimonailPage"));
const EditTestimonailPage = lazy(() => import("./pages/testimonial/formpage/EditTestimonailPage"));
const OurPartnerPage = lazy(() => import("./pages/ourPartner/OurPartnerPage"));
const CreateOurPartnerPage = lazy(() => import("./pages/ourPartner/formpage/CreateOurPartnerPage"));
const EditOurPartnerPage = lazy(() => import("./pages/ourPartner/formpage/EditOurPartnerPage"));
const Newspage = lazy(() => import("./pages/news/Newspage"));
const CreateNewsPage = lazy(() => import("./pages/news/formpage/CreateNewsPage"));
const EditNewsPage = lazy(() => import("./pages/news/formpage/EditNewsPage"));
const SettingsPage = lazy(() => import("./pages/settings/SettingsPage"));
const CreateIpWhiteListPage = lazy(() => import("./pages/ipWhiteList/formpage/CreateIpWhiteListPage"));
const IpWhiteListPage = lazy(() => import("./pages/ipWhiteList/IpWhiteListPage"));
const EditIpWhiteListPage = lazy(() => import("./pages/ipWhiteList/formpage/EditIpWhiteListPage"));
const FaqsPage = lazy(() => import("./pages/faqs/FaqsPage"));
const CreateFaqPage = lazy(() => import("./pages/faqs/formpage/CreateFaqPage"));
const EditFaqPage = lazy(() => import("./pages/faqs/formpage/EditFaqPage"));
const EditRegionPage = lazy(() => import("./pages/region/formpage/EditRegionPage"));
const EditRegionAdmin = lazy(() => import("./pages/regionAdmin/formpage/EditRegionAdmin"));
const ReportPage = lazy(() => import("./pages/report/ReportPage"));
const TripMapPage = lazy(() => import("./pages/trips/TripMapPage"));
const ViewBookingPage = lazy(() => import("./pages/booking/ViewBookingPage"));
const ContentManagement = lazy(() => import("./pages/contentManagment/ContentManagementPage"));
const CreateContent = lazy(() => import("./pages/contentManagment/formpage/CreateContent"));
const EditContent = lazy(() => import("./pages/contentManagment/formpage/EditContent"));
const CreateCrewMemberPage = lazy(() => import("./pages/crewMember/formpage/CreateCrewMemberPage"));
const EditCrewMemberPage = lazy(() => import("./pages/crewMember/formpage/EditCrewMemberPage"));
// import AdminProtectedRoute from "./utils/AdminProtectedRoute";
const ProtectedRoute = lazy(() => import("./utils/ProtectedRoute"));
const SeoPage = lazy(() => import("./pages/contentManagment/SeoPage"));
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster as Sonner } from "@/components/ui/sonner";
const AdminRootLayout = lazy(() => import("./components/layouts/AdminRootLayout"));
const ErrorBoundary = lazy(() => import("./components/ErrorBoundary"));
const BlogPostsPage = lazy(() => import("./pages/contentManagement/BlogPostsPage"));
const EditBlogPostPage = lazy(() => import("./pages/contentManagement/EditBlogPostPage"));
const ViewBlogPostPage = lazy(() => import("./pages/contentManagement/ViewBlogPostPage"));
const CreateBlogPostPage = lazy(() => import("./pages/contentManagement/CreateBlogPostPage"));


const queryClient = new QueryClient();
function App() {

  return (
    <TooltipProvider>
      <Sonner position="top-right" />
      <BrowserRouter>
      <QueryClientProvider client={queryClient}>
      <ErrorBoundary>      
      <Routes >
        
          <Route  path={constant.ROUTING_URLS.ADMIN_LOGIN} element={<AdminLoginPage/>} />
           {/* Protected wrapper */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AdminRootLayout />}>
            <Route index path={constant.ROUTING_URLS.DASHBOARD} element={<DashboardPage />} />
            <Route path={constant.ROUTING_URLS.REGION} element={<RegionDashboardPage />} />
            <Route path={constant.ROUTING_URLS.CREATE_REGION} element={<AddRegionPage />} />
            <Route path={constant.ROUTING_URLS.EDIT_REGION} element={<EditRegionPage />} />
            <Route path={constant.ROUTING_URLS.REGION_ADMIN} element={<RegionAdminPage />} />
            <Route path={constant.ROUTING_URLS.EDIT_REGION_ADMIN} element={<EditRegionAdmin />} />
            <Route path={constant.ROUTING_URLS.CREATE_REGION_ADMIN} element={<AddRegionAdmin />} />
            <Route path={constant.ROUTING_URLS.AFFILIATE} element={<AffiliatePage />} />
            <Route path={constant.ROUTING_URLS.CREATE_AFFILIATE} element={<CreateAffiliatePage />} />
            <Route path={constant.ROUTING_URLS.EDIT_AFFILIATE} element={<EditAffiliatePage />} />
            <Route path={constant.ROUTING_URLS.VIEW_AFFILIATE} element={<ViewAffiliatePage />} />
            <Route path={constant.ROUTING_URLS.CHAUFFEUR} element={<ChauffeurPage />} />
            <Route path={constant.ROUTING_URLS.CREATE_CHAUFFEUR} element={<CreateChauffeurPage />} />
            <Route path={constant.ROUTING_URLS.EDIT_CHAUFFEUR} element={<EditChauffeurPage />} />
            <Route path={constant.ROUTING_URLS.VIEW_CHAUFFEUR} element={<ViewChauffeurPage />} />
            <Route path={constant.ROUTING_URLS.BOOKING} element={<BookingPage />} />
            <Route path={constant.ROUTING_URLS.VIEW_BOOKING} element={<ViewBookingPage />} />
            <Route path={constant.ROUTING_URLS.USERS} element={<UsersPage />} />
            <Route path={constant.ROUTING_URLS.CREATE_USERS} element={<CreateUserPage />} />
            <Route path={constant.ROUTING_URLS.EDIT_USERS} element={<EditUserPage />} />
            <Route path={constant.ROUTING_URLS.VIEW_USERS} element={<ViewUserPage />} />
            <Route path={constant.ROUTING_URLS.FLEETS} element={<FleetPage />} />
            <Route path={constant.ROUTING_URLS.CREATE_FLEET} element={<CreateFleetPage />} />
            <Route path={constant.ROUTING_URLS.EDIT_FLEET} element={<EditFleetPage />} />
            <Route path={constant.ROUTING_URLS.VIEW_FLEET} element={<ViewFleetPage />} />
            <Route path={constant.ROUTING_URLS.CREATE_FLEET} element={<CreateFleetPage />} />
            <Route path={constant.ROUTING_URLS.TRIPS} element={<TripsPage />} />
            <Route path={constant.ROUTING_URLS.TRIPS_MAP} element={<TripMapPage />} />
            <Route path={constant.ROUTING_URLS.VIEW_TRIPS} element={<ViewTripsPage />} />
            {/* <Route path={constant.ROUTING_URLS.NOTIFICATION} element={<NotificationPage />} /> */}
            <Route path={constant.ROUTING_URLS.PAYMENTS} element={<PaymentsPage />} />
            <Route path={constant.ROUTING_URLS.VIEW_PAYMENTS} element={<ViewPaymentPage />} />
            <Route path={constant.ROUTING_URLS.REFUND} element={<RefundPage />} />
            <Route path={constant.ROUTING_URLS.VIEW_REFUND} element={<ViewRefundPage />} />
            <Route path={constant.ROUTING_URLS.REFUND_REQUEST} element={<RefundRequestPage />} />
            <Route path={constant.ROUTING_URLS.CREW_MEMBERS} element={<CrewMemberPage />} />
            <Route path={constant.ROUTING_URLS.CREATE_CREW_MEMBERS} element={<CreateCrewMemberPage />} />
            <Route path={constant.ROUTING_URLS.EDIT_CREW_MEMBERS} element={<EditCrewMemberPage />} />
            <Route path={constant.ROUTING_URLS.STAFF_MEMBERS} element={<StaffMemberPage />} />
            <Route path={constant.ROUTING_URLS.CREATE_STAFF_MEMBERS} element={<CreateStaffMemberPage />} />
            <Route path={constant.ROUTING_URLS.EDIT_STAFF_MEMBERS} element={<EditStaffMemberPage />} />
            <Route path={constant.ROUTING_URLS.CONTACT_REQUESTS} element={<ContactRequestsPage />} />
            <Route path={constant.ROUTING_URLS.TESTIMONIALS} element={<TestimonialPage />} />
            <Route path={constant.ROUTING_URLS.CREATE_TESTIMONIALS} element={<CreateTestimonailPage />} />
            <Route path={constant.ROUTING_URLS.EDIT_TESTIMONIALS} element={<EditTestimonailPage />} />
            <Route path={constant.ROUTING_URLS.OUR_PARTNERS} element={<OurPartnerPage />} />
            <Route path={constant.ROUTING_URLS.CREATE_OUR_PARTNERS} element={<CreateOurPartnerPage />} />
            <Route path={constant.ROUTING_URLS.EDIT_OUR_PARTNERS} element={<EditOurPartnerPage />} />
            <Route path={constant.ROUTING_URLS.NEWS} element={<Newspage />} />
            <Route path={constant.ROUTING_URLS.CREATE_NEWS} element={<CreateNewsPage />} />
            <Route path={constant.ROUTING_URLS.EDIT_NEWS} element={<EditNewsPage />} />
            <Route path={constant.ROUTING_URLS.SETTINGS} element={<SettingsPage />} />
            <Route path={constant.ROUTING_URLS.IP_WHITE_LIST} element={<IpWhiteListPage />} />
            <Route path={constant.ROUTING_URLS.CREATE_IP_WHITE_LIST} element={<CreateIpWhiteListPage />} />
            <Route path={constant.ROUTING_URLS.EDIT_IP_WHITE_LIST} element={<EditIpWhiteListPage />} />
            <Route path={constant.ROUTING_URLS.FAQ} element={<FaqsPage />} />
            <Route path={constant.ROUTING_URLS.CREATE_FAQ} element={<CreateFaqPage />} />
            <Route path={constant.ROUTING_URLS.EDIT_FAQ} element={<EditFaqPage />} />
            <Route path={constant.ROUTING_URLS.REPORTS} element={<ReportPage />} />
            {/* Content Management Routes */}
            <Route path={constant.ROUTING_URLS.CONTENT_MANAGEMENT_ALL_PAGES} element={<ContentManagement />} />
            <Route path={constant.ROUTING_URLS.CREATE_CONTENT_MANAGEMENT} element={<CreateContent />} />
            <Route path={constant.ROUTING_URLS.EDIT_CONTENT_MANAGEMENT} element={<EditContent />} />
            <Route path={constant.ROUTING_URLS.BLOG_POSTS} element={<BlogPostsPage />} />
            <Route path={constant.ROUTING_URLS.CREATE_BLOG_POST} element={<CreateBlogPostPage />} />
            <Route path={constant.ROUTING_URLS.EDIT_BLOG_POST} element={<EditBlogPostPage />} />
            <Route path={constant.ROUTING_URLS.VIEW_BLOG_POST} element={<ViewBlogPostPage />} />
            <Route path={constant.ROUTING_URLS.SEO} element={<SeoPage />} />
            {/* <Route path={constant.ROUTING_URLS.CREATE_SEO} element={<SeoPage />} />
            <Route path={constant.ROUTING_URLS.EDIT_SEO} element={<SeoPage />} /> */}
          </Route>
         </Route>
      </Routes>
      </ErrorBoundary>
      </QueryClientProvider>
      </BrowserRouter>
    </TooltipProvider>
  )
}

export default App
