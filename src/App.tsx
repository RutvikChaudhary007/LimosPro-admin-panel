import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import { TooltipProvider } from "./components/ui/tooltip";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import DashboardPage from "./pages/admin/DashboardPage";

function App() {

  return (
    <TooltipProvider>
      <BrowserRouter>
      <Routes>
          <Route path={'/admin/login'} element={<AdminLoginPage/>} />
          <Route path={'/admin/dashboard'} element={<DashboardPage />} />
      </Routes>
      </BrowserRouter>
    </TooltipProvider>
  )
}

export default App
