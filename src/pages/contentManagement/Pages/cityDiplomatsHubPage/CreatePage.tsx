import { AxiosError } from "axios";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCreateCityDiplomatsHubPage } from "@/api/pages/cityDiplomatsHubPage.api";
import PageTitle from "@/components/common/PageTitle";
import CityDiplomatsHubForm from "@/components/contentManagement/cityDiplomatsHub/CityDiplomatsHubForm";
import { PageHeader } from "@/components/layouts/PageHeader";
import { toastPromise } from "@/hooks/use-toast";
import { constant } from "@/lib/constant";
import { generatePageTitle } from "@/utils/seo";

export default function CreatePage() {
  const navigate = useNavigate();
  const createCityDiplomatsHubMutation = useCreateCityDiplomatsHubPage();

  const handleCreateCityDiplomatsHub = (data: any) => {
    // data is FormData, so we need to append to it, not spread it
    data.append("pageName", "cities");
    data.append("slug", "diplomats-hub");

    try {
      toastPromise(createCityDiplomatsHubMutation.mutateAsync(data), {
        loading: "Creating city diplomats hub page...",
        success: () => {
          navigate(constant.ROUTING_URLS.CONTENT_MANAGEMENT_ALL_PAGES);
          return "City diplomats hub page created successfully!";
        },
        error: (e) =>
          e instanceof AxiosError
            ? e.response?.data?.message || "Failed to create city diplomats hub"
            : "Failed to create city diplomats hub",
      });
    } catch (error) {
      console.error("Create city diplomats hub error:", error);
    }
  };

  return (
    <>
      <PageTitle title={generatePageTitle("Create City Diplomats Hub")} />
      <div className="p-6 space-y-6 md:p-8 md:space-y-8">
        <PageHeader
          title="City Diplomats Hub"
          breadcrumbs={[
            { label: "Home", path: "/" },
            {
              label: "Content Management",
              path: constant.ROUTING_URLS.CONTENT_MANAGEMENT_ALL_PAGES,
            },
            { label: "Create City Diplomats Hub" },
          ]}
          backAction={{
            variant: "outlinePrimary",
            label: "Back",
            icon: <ArrowLeft />,
            link: constant.ROUTING_URLS.CONTENT_MANAGEMENT_ALL_PAGES,
          }}
        />
        <CityDiplomatsHubForm
          onSubmit={handleCreateCityDiplomatsHub}
          type="Create"
        />
      </div>
    </>
  );
}
