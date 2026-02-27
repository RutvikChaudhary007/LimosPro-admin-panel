import { AxiosError } from "axios";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCreateCountryPage } from "@/api/pages/countryPage.api";
import CountryDetailForm from "@/components/contentManagement/country/CountryDetailForm";
import { PageHeader } from "@/components/layouts/PageHeader";
import { toastPromise } from "@/hooks/use-toast";
import { constant } from "@/lib/constant";

export default function CreatePage() {
  const navigate = useNavigate();
  const createMutation = useCreateCountryPage();

  const handleSubmit = (formData: FormData) => {
    toastPromise(createMutation.mutateAsync(formData), {
      loading: "Creating country page...",
      success: () => {
        navigate(constant.ROUTING_URLS.CONTENT_MANAGEMENT_ALL_PAGES);
        return "Country page created successfully!";
      },
      error: (e) =>
        e instanceof AxiosError
          ? e.response?.data?.message || "Failed to create country page"
          : "Failed to create country page",
    });
  };

  return (
    <div className="p-6 space-y-6 md:p-8 md:space-y-8">
      <PageHeader
        title="Create Country Detail Page"
        breadcrumbs={[
          { label: "Home", path: "/" },
          {
            label: "Content Management",
            path: constant.ROUTING_URLS.CONTENT_MANAGEMENT_ALL_PAGES,
          },
          { label: "Create Country Detail" },
        ]}
        backAction={{
          variant: "outlinePrimary",
          label: "Back",
          icon: <ArrowLeft />,
          link: constant.ROUTING_URLS.CONTENT_MANAGEMENT_ALL_PAGES,
        }}
      />
      <CountryDetailForm onSubmit={handleSubmit} type="Create" />
    </div>
  );
}
