import { lazy } from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import AuthLayout from "./components/layout/AuthLayout"
import Layout from "./components/layout/Layout"
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage"
import LoginPage from "./pages/auth/LoginPage"
import RegisterPage from "./pages/auth/RegisterPage"
import AlertPage from "./pages/components/AlertPage"
import BadgePage from "./pages/components/BadgePage"
import ButtonPage from "./pages/components/ButtonPage"
import CardPage from "./pages/components/CardPage"
import TextFieldPage from "./pages/components/TextFieldPage"
import { constant } from "./lib/constant"
import ProtectedRoute from "./components/ProtectedRoute"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
const DashboardPage = lazy(() => import("./pages/dashboard/Dashboard"))
const RegionDashboardPage = lazy(() => import("./pages/region/RegionDashboardPage"))
const AddRegionPage = lazy(() => import("./pages/region/formpage/AddRegionPage"))
const EditRegionPage = lazy(() => import("./pages/region/formpage/EditRegionPage"))

const RegionAdminPage = lazy(() => import("./pages/regionAdmin/RegionAdminPage"))
const AddRegionAdmin = lazy(() => import("./pages/regionAdmin/formpage/AddRegionAdmin"))
const EditRegionAdmin = lazy(() => import("./pages/regionAdmin/formpage/EditRegionAdmin"))
const AffiliatePage = lazy(() => import("./pages/affiliate/AffiliatePage"))
const CreateAffiliatePage = lazy(() => import("./pages/affiliate/formPage/CreateAffiliatePage"))
const EditAffiliatePage = lazy(() => import("./pages/affiliate/formPage/EditAffiliatePage"))
const ViewAffiliatePage = lazy(() => import("./pages/affiliate/ViewAffiliatePage"))

const queryClient = new QueryClient()
function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path="auth">
              <Route path={constant.ROUTING_URLS.ADMIN_LOGIN} element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
              <Route path="forgot-password" element={<ForgotPasswordPage />} />
            </Route>
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path={constant.ROUTING_URLS.DASHBOARD} element={<DashboardPage />} />
              <Route path={constant.ROUTING_URLS.REGION} element={<RegionDashboardPage />} />
              <Route path={constant.ROUTING_URLS.CREATE_REGION} element={<AddRegionPage />} />
              <Route path={constant.ROUTING_URLS.EDIT_REGION} element={<EditRegionPage />} />

              <Route path={constant.ROUTING_URLS.REGION_ADMIN} element={<RegionAdminPage />} />
              <Route
                path={constant.ROUTING_URLS.CREATE_REGION_ADMIN}
                element={<AddRegionAdmin />}
              />
              <Route path={constant.ROUTING_URLS.EDIT_REGION_ADMIN} element={<EditRegionAdmin />} />
              <Route path={constant.ROUTING_URLS.AFFILIATE} element={<AffiliatePage />} />
              <Route
                path={constant.ROUTING_URLS.CREATE_AFFILIATE}
                element={<CreateAffiliatePage />}
              />
              <Route path={constant.ROUTING_URLS.EDIT_AFFILIATE} element={<EditAffiliatePage />} />
              <Route path={constant.ROUTING_URLS.VIEW_AFFILIATE} element={<ViewAffiliatePage />} />

              {/* <Route path="region-management">
                <Route path="regions" />
                <Route path="region-admins" />
              </Route> */}
              {/* <Route path="content-management">
                <Route path="blogs" />
                <Route path="pages" />
                <Route path="seo" />
              </Route> */}
            </Route>
            <Route path="components">
              <Route path="button-page" element={<ButtonPage />} />
              <Route path="text-field-page" element={<TextFieldPage />} />
              <Route path="badge-page" element={<BadgePage />} />
              <Route path="alert-page" element={<AlertPage />} />
              <Route path="card-page" element={<CardPage />} />
            </Route>
          </Route>
        </Routes>
      </QueryClientProvider>
    </BrowserRouter>
  )
}

export default App
