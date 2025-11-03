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
import Dashboard from "./pages/dashboard/Dashboard"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="auth">
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="forgot-password" element={<ForgotPasswordPage />} />
          </Route>
        </Route>
        <Route element={<Layout />}>
          <Route index />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="region-management">
            <Route path="regions" />
            <Route path="region-admins" />
          </Route>
          <Route path="content-management">
            <Route path="blogs" />
            <Route path="pages" />
            <Route path="seo" />
          </Route>
        </Route>
        <Route path="components">
          <Route path="button-page" element={<ButtonPage />} />
          <Route path="text-field-page" element={<TextFieldPage />} />
          <Route path="badge-page" element={<BadgePage />} />
          <Route path="alert-page" element={<AlertPage />} />
          <Route path="card-page" element={<CardPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
