import { AxiosError } from "axios";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useFetchRouteDetailsPageById, useUpdateRouteDetailsPage } from "@/api";
import { ErrorCard } from "@/components/common/ErrorCard";
import PageTitle from "@/components/common/PageTitle";
import RouteDetailsForm from "@/components/contentManagement/routeDetail/RouteDetailsForm";
import { PageHeader } from "@/components/layouts/PageHeader";
import { Spinner } from "@/components/Spinner";
import { toastPromise } from "@/hooks/use-toast";
import { constant } from "@/lib/constant";
import { generatePageTitle } from "@/utils/seo";

export default function EditPage() {
  const { id } = useParams<{ id: string; category: string }>();
  const navigate = useNavigate();

  const { data, isFetching, isError, refetch } = useFetchRouteDetailsPageById(
    id!,
  );
  const updateRouteDetailMutation = useUpdateRouteDetailsPage();
  const handleSubmit = (data: any) => {
    try {
      toastPromise(
        updateRouteDetailMutation.mutateAsync({
          id: id as string,
          data,
        }),
        {
          loading: "Updating Route Details page...",
          success: () => {
            navigate(constant.ROUTING_URLS.CONTENT_MANAGEMENT_ALL_PAGES);
            return "Route Details page updated successfully";
          },
          error: (e) =>
            e instanceof AxiosError
              ? e.response?.data?.message
              : "Failed to update route details page",
        },
      );
    } catch (error) {
      console.error(error);
    }
  };

  if (isError) return <ErrorCard refetch={refetch} />;
  return (
    <>
      <PageTitle title={generatePageTitle("Edit Route Page")} />
      <div className="p-6 space-y-6 md:p-8 md:space-y-8">
        <PageHeader
          title="Route Details"
          breadcrumbs={[
            { label: "Route", path: "/" },
            {
              label: "Content Management",
              path: constant.ROUTING_URLS.CONTENT_MANAGEMENT_ALL_PAGES,
            },
            {
              label: "Route",
              path: constant.ROUTING_URLS.CONTENT_MANAGEMENT_ALL_PAGES,
            },
            { label: "Edit Route Details" },
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
          <RouteDetailsForm
            initialData={data}
            onSubmit={handleSubmit}
            type="edit"
          />
        )}
      </div>
    </>
  );
}
