import { AxiosError } from "axios";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCreateCitiesHubPage } from "@/api/pages/citiesHubPage.api";
import CitiesHubForm from "@/components/contentManagement/citiesHub/CitiesHubForm";
import { PageHeader } from "@/components/layouts/PageHeader";
import { toastPromise } from "@/hooks/use-toast";
import { constant } from "@/lib/constant";

export default function CreatePage() {
  const navigate = useNavigate();
  const createCitiesHubMutation = useCreateCitiesHubPage();

  const handleCreateCitiesHub = (data: any) => {
    // data is FormData, so we need to append to it, not spread it
    data.append("pageName", "CitiesHub");
    data.append("category", "citiesHub");
    data.append("slug", "cities");

    try {
      toastPromise(createCitiesHubMutation.mutateAsync(data), {
        loading: "Creating cities hub page...",
        success: () => {
          navigate(constant.ROUTING_URLS.CONTENT_MANAGEMENT_ALL_PAGES);
          return "Cities hub page created successfully!";
        },
        error: (e) =>
          e instanceof AxiosError
            ? e.response?.data?.message || "Failed to create cities hub"
            : "Failed to create cities hub",
      });
    } catch (error) {
      console.error("Create cities hub error:", error);
    }
  };

  return (
    <div className="p-6 space-y-6 md:p-8 md:space-y-8">
      <PageHeader
        title="Cities Hub"
        breadcrumbs={[
          { label: "Home", path: "/" },
          {
            label: "Content Management",
            path: constant.ROUTING_URLS.CONTENT_MANAGEMENT_ALL_PAGES,
          },
          { label: "Create Cities Hub" },
        ]}
        backAction={{
          variant: "outlinePrimary",
          label: "Back",
          icon: <ArrowLeft />,
          link: constant.ROUTING_URLS.CONTENT_MANAGEMENT_ALL_PAGES,
        }}
      />
      <CitiesHubForm onSubmit={handleCreateCitiesHub} type={"Create"} />
    </div>
  );
}
