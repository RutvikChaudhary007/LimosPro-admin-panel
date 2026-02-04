import { AxiosError } from "axios";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useFetchServicePageContentById } from "@/api/pages/servicePages.api";
import { ErrorCard } from "@/components/common/ErrorCard";
import PageTitle from "@/components/common/PageTitle";
import ServiceForm from "@/components/contentManagement/services/ServiceForm";
import { PageHeader } from "@/components/layouts/PageHeader";
import { Spinner } from "@/components/Spinner";
import { toastPromise } from "@/hooks/use-toast";
import { constant } from "@/lib/constant";
import queries from "@/lib/queries";
import { generatePageTitle } from "@/utils/seo";

export default function EditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    data: serviceData,
    isFetching,
    isError,
    refetch,
  } = useFetchServicePageContentById(id as string);
  const updateServiceMutation = queries.useEditServicePageContentMutation();

  const handleSubmit = (data: any) => {
    try {
      toastPromise(
        updateServiceMutation.mutateAsync({ id: id as string, data }),
        {
          loading: "Updating service page...",
          success: () => {
            navigate(constant.ROUTING_URLS.CONTENT_MANAGEMENT_ALL_PAGES);
            return "Service page updated successfully";
          },
          error: (e) =>
            e instanceof AxiosError
              ? e.response?.data?.message || "Failed to update service page"
              : "Failed to update service page",
        },
      );
    } catch (error) {
      console.error(error);
    }
  };
  // console.log("serviceData", serviceData);
  if (isError) return <ErrorCard refetch={refetch} />;

  return (
    <>
      <PageTitle title={generatePageTitle("Edit Service Page")} />
      <div className="p-6 space-y-6 md:p-8 md:space-y-8">
        <PageHeader
          title="Edit Service"
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
            { label: "Edit Service" },
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
          <ServiceForm
            initialData={serviceData}
            onSubmit={handleSubmit}
            type="Update"
          />
        )}
      </div>
    </>
  );
}
