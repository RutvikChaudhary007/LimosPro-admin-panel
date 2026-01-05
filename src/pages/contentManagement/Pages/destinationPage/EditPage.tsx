import { AxiosError } from "axios";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useFetchDestinationPageContentById } from "@/api/pages/destinationPage.api";
import { ErrorCard } from "@/components/common/ErrorCard";
import PageTitle from "@/components/common/PageTitle";
import DestinationForm from "@/components/contentManagement/destination/DestinationForm";
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
    data: destinationData,
    isFetching,
    isError,
    refetch,
  } = useFetchDestinationPageContentById(id as string);
  const updateDestinationMutation =
    queries.useEditDestinationPageContentMutation();

  const handleSubmit = (data: any) => {
    try {
      toastPromise(
        updateDestinationMutation.mutateAsync({ id: id as string, data }),
        {
          loading: "Updating destination page...",
          success: () => {
            navigate(constant.ROUTING_URLS.CONTENT_MANAGEMENT_ALL_PAGES);
            return "Destination page updated successfully";
          },
          error: (e) =>
            e instanceof AxiosError
              ? e.response?.data?.message || "Failed to update destination page"
              : "Failed to update destination page",
        },
      );
    } catch (error) {
      console.error(error);
    }
  };

  if (isError) return <ErrorCard refetch={refetch} />;

  return (
    <>
      <PageTitle title={generatePageTitle("Edit Destination Page")} />
      <div className="p-6 space-y-6 md:p-8 md:space-y-8">
        <PageHeader
          title="Edit Destination"
          breadcrumbs={[
            { label: "Home", path: "/" },
            {
              label: "Content Management",
              path: constant.ROUTING_URLS.CONTENT_MANAGEMENT_ALL_PAGES,
            },
            { label: "Edit Destination" },
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
          <DestinationForm
            initialData={destinationData}
            onSubmit={handleSubmit}
            type="Update"
          />
        )}
      </div>
    </>
  );
}
