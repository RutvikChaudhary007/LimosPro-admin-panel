import { AxiosError } from "axios";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DestinationForm from "@/components/contentManagement/destination/DestinationForm";
import { PageHeader } from "@/components/layouts/PageHeader";
import { toastPromise } from "@/hooks/use-toast";
import { constant } from "@/lib/constant";
import queries from "@/lib/queries";

export default function CreatePage() {
  const navigate = useNavigate();
  const createDestinationMutation =
    queries.useCreateDestinationPageContentMutation();

  const handleCreateDestination = (data: any) => {
    try {
      toastPromise(createDestinationMutation.mutateAsync(data), {
        loading: "Creating destination page...",
        success: () => {
          navigate(constant.ROUTING_URLS.CONTENT_MANAGEMENT_ALL_PAGES);
          return "Destination page created successfully!";
        },
        error: (e) =>
          e instanceof AxiosError
            ? e.response?.data?.message || "Failed to create destination"
            : "Failed to create destination",
      });
    } catch (error) {
      console.error("Create destination error:", error);
    }
  };

  return (
    <div className="p-6 space-y-6 md:p-8 md:space-y-8">
      <PageHeader
        title="Create Destination Page"
        breadcrumbs={[
          { label: "Home", path: "/" },
          {
            label: "Content Management",
            path: constant.ROUTING_URLS.CONTENT_MANAGEMENT_ALL_PAGES,
          },
          { label: "Create Destination" },
        ]}
        backAction={{
          variant: "outlinePrimary",
          label: "Back",
          icon: <ArrowLeft />,
          link: constant.ROUTING_URLS.CONTENT_MANAGEMENT_ALL_PAGES,
        }}
      />
      <DestinationForm onSubmit={handleCreateDestination} type={"Create"} />
    </div>
  );
}
