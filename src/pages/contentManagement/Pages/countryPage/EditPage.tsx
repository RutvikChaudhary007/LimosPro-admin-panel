import { AxiosError } from "axios";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useFetchCountryPageById,
  useUpdateCountryPage,
} from "@/api/pages/countryPage.api";
import { ErrorCard } from "@/components/common/ErrorCard";
import CountryDetailForm from "@/components/contentManagement/country/CountryDetailForm";
import { PageHeader } from "@/components/layouts/PageHeader";
import { Spinner } from "@/components/Spinner";
import { toastPromise } from "@/hooks/use-toast";
import { constant } from "@/lib/constant";

export default function EditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, isFetching, isError, refetch } = useFetchCountryPageById(
    id ?? "",
  );
  const updateMutation = useUpdateCountryPage();

  const handleSubmit = (formData: FormData) => {
    if (!id) return;
    toastPromise(updateMutation.mutateAsync({ id, data: formData }), {
      loading: "Updating country page...",
      success: () => {
        navigate(constant.ROUTING_URLS.CONTENT_MANAGEMENT_ALL_PAGES);
        return "Country page updated successfully!";
      },
      error: (e) =>
        e instanceof AxiosError
          ? e.response?.data?.message || "Failed to update country page"
          : "Failed to update country page",
    });
  };

  if (isError) return <ErrorCard refetch={refetch} />;

  return (
    <div className="p-6 space-y-6 md:p-8 md:space-y-8">
      <PageHeader
        title="Edit Country Detail Page"
        breadcrumbs={[
          { label: "Home", path: "/" },
          {
            label: "Content Management",
            path: constant.ROUTING_URLS.CONTENT_MANAGEMENT_ALL_PAGES,
          },
          { label: "Edit Country Detail" },
        ]}
        backAction={{
          variant: "outlinePrimary",
          label: "Back",
          icon: <ArrowLeft />,
          link: constant.ROUTING_URLS.CONTENT_MANAGEMENT_ALL_PAGES,
        }}
      />
      {isFetching ? (
        <Spinner />
      ) : (
        <CountryDetailForm
          initialData={data}
          onSubmit={handleSubmit}
          type="Update"
        />
      )}
    </div>
  );
}
