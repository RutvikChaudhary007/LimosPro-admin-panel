import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import { TooltipProvider } from "./components/ui/tooltip";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import DashboardPage from "./pages/admin/DashboardPage";
import RegionDashboardPage from "./pages/region/RegionDashboardPage";

function App() {

  return (
    <TooltipProvider>
      <BrowserRouter>
      <Routes>
          <Route path={'/admin/login'} element={<AdminLoginPage/>} />
          <Route path={'/admin/dashboard'} element={<DashboardPage />} />
          <Route path={'/region_management/regions'} element={<RegionDashboardPage />} />
      </Routes>
      </BrowserRouter>
    </TooltipProvider>
  )
}

export default App
