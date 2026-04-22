import { Route, Routes } from "react-router-dom";
import AuthLayout from "@/components/layouts/AuthLayout";
import Layout from "@/components/layouts/Layout";
import NotFound from "@/pages/notFound/NotFound";
import ProtectedRoute from "@/utils/ProtectedRoute";
import { routesConfig } from "./config";

export const renderRoutes = () => {
  return (
    <Routes>
      {routesConfig.map((module) => {
        // Auth routes
        if (module.layout === "auth") {
          return (
            <Route element={<AuthLayout />} key={module.layout}>
              {module.routes.map((r) => (
                <Route path={r.path} element={<r.element />} key={r.path} />
              ))}
            </Route>
          );
        }

        // Protected routes
        if (module.layout === "protected") {
          return (
            <Route
              element={
                <ProtectedRoute
                  permission={(module as any).permission}
                  action={(module as any).action}
                  restrictedRoles={(module as any).restrictedRoles}
                />
              }
              key={module.layout + module.module}
            >
              <Route element={<Layout />}>
                {module.routes.map((r) => (
                  <Route path={r.path} element={<r.element />} key={r.path} />
                ))}
              </Route>
            </Route>
          );
        }

        // Default routes (like component demos)
        if (module.layout === "default") {
          return module.routes.map((r) => (
            <Route path={r.path} element={<r.element />} key={r.path} />
          ));
        }

        return null;
      })}

      {/* Global 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
