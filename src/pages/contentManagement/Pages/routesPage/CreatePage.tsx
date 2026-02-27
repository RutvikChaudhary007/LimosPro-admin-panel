import { AxiosError } from "axios";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useCreateRoutePage } from "@/api/pages/routesPage.api";
import CitiesPageForm from "@/components/contentManagement/routes/CitiesPageForm";
import CityRoutesForm from "@/components/contentManagement/routes/CityRoutesForm";
import CountriesPageForm from "@/components/contentManagement/routes/CountriesPageForm";
import { PageHeader } from "@/components/layouts/PageHeader";
import { toastPromise } from "@/hooks/use-toast";
import { constant } from "@/lib/constant";

export default function CreatePage() {
  const navigate = useNavigate();
  const { category } = useParams<{ category: string }>();
  const createMutation = useCreateRoutePage();

  const handleSubmit = (formData: FormData) => {
    toastPromise(createMutation.mutateAsync(formData), {
      loading: "Creating page...",
      success: () => {
        navigate(constant.ROUTING_URLS.CONTENT_MANAGEMENT_ALL_PAGES);
        return "Page created successfully!";
      },
      error: (e) =>
        e instanceof AxiosError
          ? e.response?.data?.message || "Failed to create page"
          : "Failed to create page",
    });
  };

  const categoryLower = category?.toLowerCase() ?? "";
  const title =
    categoryLower === "cityroutes"
      ? "Create City-to-City Routes Page"
      : categoryLower === "countries"
        ? "Create Countries Page"
        : categoryLower === "cities"
          ? "Create Cities Page"
          : "Create Page";

  return (
    <div className="p-6 space-y-6 md:p-8 md:space-y-8">
      <PageHeader
        title={title}
        breadcrumbs={[
          { label: "Home", path: "/" },
          {
            label: "Content Management",
            path: constant.ROUTING_URLS.CONTENT_MANAGEMENT_ALL_PAGES,
          },
          { label: title },
        ]}
        backAction={{
          variant: "outlinePrimary",
          label: "Back",
          icon: <ArrowLeft />,
          link: constant.ROUTING_URLS.CONTENT_MANAGEMENT_ALL_PAGES,
        }}
      />
      {categoryLower === "cityroutes" && (
        <CityRoutesForm onSubmit={handleSubmit} type="Create" />
      )}
      {categoryLower === "countries" && (
        <CountriesPageForm onSubmit={handleSubmit} type="Create" />
      )}
      {categoryLower === "cities" && (
        <CitiesPageForm onSubmit={handleSubmit} type="Create" />
      )}
      {categoryLower !== "cityroutes" &&
        categoryLower !== "countries" &&
        categoryLower !== "cities" && (
          <CityRoutesForm onSubmit={handleSubmit} type="Create" />
        )}
    </div>
  );
}
