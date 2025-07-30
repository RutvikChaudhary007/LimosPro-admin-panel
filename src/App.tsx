import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import { TooltipProvider } from "./components/ui/tooltip";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import DashboardPage from "./pages/admin/DashboardPage";
import RegionDashboardPage from "./pages/region/RegionDashboardPage";
import AddRegionPage from "./pages/region/AddRegionPage";
import RegionAdminPage from "./pages/region/regionAdmin/RegionAdminPage";
import AddRegionAdmin from "./pages/region/regionAdmin/AddRegionAdmin";
import AffiliatePage from "./pages/affiliate/AffiliatePage";

function App() {

  return (
    <TooltipProvider>
      <BrowserRouter>
      <Routes >
          <Route path={'/admin/login'} element={<AdminLoginPage/>} />
          <Route index path={'/admin/dashboard'} element={<DashboardPage />} />
          <Route path={'/region_management/regions'} element={<RegionDashboardPage />} />
          <Route path={'/region_management/region/add-region'} element={<AddRegionPage />} />
          <Route path={'/region_management/region/admins'} element={<RegionAdminPage />} />
          <Route path={'/region_management/admin/create-region-admin'} element={<AddRegionAdmin />} />
          <Route path={'/affiliate'} element={<AffiliatePage />} />
      </Routes>
      </BrowserRouter>
    </TooltipProvider>
  )
}

export default App
