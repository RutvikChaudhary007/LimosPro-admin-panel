import { AxiosError } from "axios";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ServiceForm from "@/components/contentManagement/services/ServiceForm";
import { PageHeader } from "@/components/layouts/PageHeader";
import { toastPromise } from "@/hooks/use-toast";
import { constant } from "@/lib/constant";
import queries from "@/lib/queries";
export default function CreatePage() {
  const navigate = useNavigate();
  const createServiceMutation = queries.useCreateServicePageContentMutation();

  const handleCreateService = (data: any) => {
    try {
      toastPromise(createServiceMutation.mutateAsync(data), {
        loading: "Creating service page...",
        success: () => {
          navigate(constant.ROUTING_URLS.CONTENT_MANAGEMENT_ALL_PAGES);
          return "Service page created successfully!";
        },
        error: (e) =>
          e instanceof AxiosError
            ? e.response?.data?.message || "Failed to create service"
            : "Failed to create service",
      });
    } catch (error) {
      console.error("Create service error:", error);
    }
  };

  return (
    <div className="p-6 space-y-6 md:p-8 md:space-y-8">
      <PageHeader
        title="Create Service Page"
        breadcrumbs={[
          { label: "Home", path: "/" },
          {
            label: "Content Management",
            path: constant.ROUTING_URLS.CONTENT_MANAGEMENT_ALL_PAGES,
          },
          {
            label: "Pages",
            path: constant.ROUTING_URLS.CONTENT_MANAGEMENT_ALL_PAGES,
          },
          { label: "Create Service" },
        ]}
        backAction={{
          variant: "outlinePrimary",
          label: "Back",
          icon: <ArrowLeft />,
          link: constant.ROUTING_URLS.CONTENT_MANAGEMENT_ALL_PAGES,
        }}
      />
      <ServiceForm onSubmit={handleCreateService} type={"Create"} />
    </div>
  );
}
