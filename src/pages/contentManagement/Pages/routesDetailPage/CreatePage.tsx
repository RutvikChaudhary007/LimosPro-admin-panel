import { AxiosError } from "axios";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCreateRoutePage } from "@/api/pages/routesPage.api";
import RouteDetailsForm from "@/components/contentManagement/routeDetail/RouteDetailsForm";
import { PageHeader } from "@/components/layouts/PageHeader";
import { toastPromise } from "@/hooks/use-toast";
import { constant } from "@/lib/constant";

export default function CreatePage() {
  const navigate = useNavigate();
  const createRouteDetails = useCreateRoutePage();
  const handleCreateRouteDetail = (data: any) => {
    // data is FormData, so we need to append to it, not spread it
    data.append("pageName", "Route");
    data.append("category", "route");

    try {
      toastPromise(createRouteDetails.mutateAsync(data), {
        loading: "Creating Route Details page...",
        success: () => {
          navigate(constant.ROUTING_URLS.CONTENT_MANAGEMENT_ALL_PAGES);
          return "Route Details page creaetd successfully";
        },
        error: (e) =>
          e instanceof AxiosError
            ? e.response?.data?.message
            : "Failed to create route details page",
      });
    } catch (error) {
      console.error("Create route detail error:", error);
    }
  };

  return (
    <div className="p-6 space-y-6 md:p-8 md:space-y-8">
      <PageHeader
        title="Route Detail"
        breadcrumbs={[
          { label: "Route", path: "/" },
          {
            label: "Content Management",
            path: constant.ROUTING_URLS.CONTENT_MANAGEMENT_ALL_PAGES,
          },
          { label: "Create Route Details" },
        ]}
        backAction={{
          variant: "outlinePrimary",
          label: "Back",
          icon: <ArrowLeft />,
          link: constant.ROUTING_URLS.CONTENT_MANAGEMENT_ALL_PAGES,
        }}
      />
      <RouteDetailsForm onSubmit={handleCreateRouteDetail} type={"Create"} />
    </div>
  );
}
