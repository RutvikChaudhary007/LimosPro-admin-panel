import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import { TooltipProvider } from "./components/ui/tooltip";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import DashboardPage from "./pages/admin/DashboardPage";
import RegionDashboardPage from "./pages/region/RegionDashboardPage";
import AddRegionPage from "./pages/region/formpage/AddRegionPage";
import RegionAdminPage from "./pages/regionAdmin/RegionAdminPage";
import AddRegionAdmin from "./pages/regionAdmin/formpage/AddRegionAdmin";
import AffiliatePage from "./pages/affiliate/AffiliatePage";
import ChauffeurPage from "./pages/chauffeur/ChauffeurPage";
import BookingPage from "./pages/booking/BookingPage";
import UsersPage from "./pages/users/UsersPage";
import FleetPage from "./pages/fleet/FleetPage";
import TripsPage from "./pages/trips/TripsPage";
import CreateAffiliatePage from "./pages/affiliate/formPage/CreateAffiliatePage";
import EditAffiliatePage from "./pages/affiliate/formPage/EditAffiliatePage";
import ViewAffiliatePage from "./pages/affiliate/ViewAffiliatePage";
import { constant } from "./lib/constant";
import EditChauffeurPage from "./pages/chauffeur/formPage/EditChauffeurPage";
import CreateChauffeurPage from "./pages/chauffeur/formPage/CreateChauffeurPage";
import ViewChauffeurPage from "./pages/chauffeur/ViewChauffeurPage";
import CreateUserPage from "./pages/users/formPage/CreateUserPage";
import EditUserPage from "./pages/users/formPage/EditUserPage";
import ViewUserPage from "./pages/users/ViewUserPage";
import CreateFleetPage from "./pages/fleet/formPage/CreateFleetPage";
import ViewFleetPage from "./pages/fleet/ViewFleetPage";
import EditFleetPage from "./pages/fleet/formPage/EditFleetPage";
import NotificationPage from "./pages/notifications/NotificationPage";
import ViewTripsPage from "./pages/trips/ViewTripsPage";
import PaymentsPage from "./pages/payments/PaymentsPage";
import ViewPaymentPage from "./pages/payments/ViewPaymentPage";
import RefundPage from "./pages/refund/RefundPage";
import ViewRefundPage from "./pages/refund/ViewRefundPage";
import RefundRequestPage from "./pages/refundRequest/RefundRequestPage";
import CrewMemberPage from "./pages/crewMember/CrewMemberPage";
import StaffMemberPage from "./pages/staffMember/StaffMemberPage";
import CreateStaffMemberPage from "./pages/staffMember/formpage/CreateStaffMemberPage";
import EditStaffMemberPage from "./pages/staffMember/formpage/EditStaffMemberPage";
import ContactRequestsPage from "./pages/contactRequests/ContactRequestsPage";
import TestimonialPage from "./pages/testimonial/TestimonialPage";
import CreateTestimonailPage from "./pages/testimonial/formpage/CreateTestimonailPage";
import EditTestimonailPage from "./pages/testimonial/formpage/EditTestimonailPage";
import OurPartnerPage from "./pages/ourPartner/OurPartnerPage";
import CreateOurPartnerPage from "./pages/ourPartner/formpage/CreateOurPartnerPage";
import EditOurPartnerPage from "./pages/ourPartner/formpage/EditOurPartnerPage";
import Newspage from "./pages/news/Newspage";
import CreateNewsPage from "./pages/news/formpage/CreateNewsPage";
import EditNewsPage from "./pages/news/formpage/EditNewsPage";
import SettingsPage from "./pages/settings/SettingsPage";
import CreateIpWhiteListPage from "./pages/ipWhiteList/formpage/CreateIpWhiteListPage";
import IpWhiteListPage from "./pages/ipWhiteList/IpWhiteListPage";
import EditIpWhiteListPage from "./pages/ipWhiteList/formpage/EditIpWhiteListPage";
import FaqsPage from "./pages/faqs/FaqsPage";
import CreateFaqPage from "./pages/faqs/formpage/CreateFaqPage";
import EditFaqPage from "./pages/faqs/formpage/EditFaqPage";
import EditRegionPage from "./pages/region/formpage/EditRegionPage";
import EditRegionAdmin from "./pages/regionAdmin/formpage/EditRegionAdmin";
import ReportPage from "./pages/report/ReportPage";
import TripMapPage from "./pages/trips/TripMapPage";
import ViewBookingPage from "./pages/booking/ViewBookingPage";

function App() {

  return (
    <TooltipProvider>
      <BrowserRouter>
      <Routes >
          <Route path={constant.ROUTING_URLS.ADMIN_LOGIN} element={<AdminLoginPage/>} />
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
          <Route path={constant.ROUTING_URLS.CREATE_FLEET} element={<EditFleetPage />} />
          <Route path={constant.ROUTING_URLS.EDIT_FLEET} element={<CreateFleetPage />} />
          <Route path={constant.ROUTING_URLS.VIEW_FLEET} element={<ViewFleetPage />} />
          <Route path={constant.ROUTING_URLS.CREATE_FLEET} element={<CreateFleetPage />} />
          <Route path={constant.ROUTING_URLS.TRIPS} element={<TripsPage />} />
          <Route path={constant.ROUTING_URLS.TRIPS_MAP} element={<TripMapPage />} />
          <Route path={constant.ROUTING_URLS.VIEW_TRIPS} element={<ViewTripsPage />} />
          <Route path={constant.ROUTING_URLS.NOTIFICATION} element={<NotificationPage />} />
          <Route path={constant.ROUTING_URLS.PAYMENTS} element={<PaymentsPage />} />
          <Route path={constant.ROUTING_URLS.VIEW_PAYMENTS} element={<ViewPaymentPage />} />
          <Route path={constant.ROUTING_URLS.REFUND} element={<RefundPage />} />
          <Route path={constant.ROUTING_URLS.VIEW_REFUND} element={<ViewRefundPage />} />
          <Route path={constant.ROUTING_URLS.REFUND_REQUEST} element={<RefundRequestPage />} />
          <Route path={constant.ROUTING_URLS.CREW_MEMBERS} element={<CrewMemberPage />} />
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
      </Routes>
      </BrowserRouter>
    </TooltipProvider>
  )
}

export default App
