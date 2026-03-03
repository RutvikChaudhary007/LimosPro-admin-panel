import { AxiosError } from "axios";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useFetchCitiesHubPageById,
  useUpdateCitiesHubPage,
} from "@/api/pages/citiesHubPage.api";
import { ErrorCard } from "@/components/common/ErrorCard";
import PageTitle from "@/components/common/PageTitle";
import CitiesHubForm from "@/components/contentManagement/citiesHub/CitiesHubForm";
import { PageHeader } from "@/components/layouts/PageHeader";
import { Spinner } from "@/components/Spinner";
import { toastPromise } from "@/hooks/use-toast";
import { constant } from "@/lib/constant";
import { generatePageTitle } from "@/utils/seo";

export default function EditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    data: citiesHubPageData,
    isFetching,
    isError,
    refetch,
  } = useFetchCitiesHubPageById(id as string);
  const updateCitiesHubMutation = useUpdateCitiesHubPage();

  const handleSubmit = (data: any) => {
    try {
      toastPromise(
        updateCitiesHubMutation.mutateAsync({
          id: id as string,
          data,
        }),
        {
          loading: "Updating cities hub page...",
          success: () => {
            navigate(constant.ROUTING_URLS.CONTENT_MANAGEMENT_ALL_PAGES);
            return "Cities hub page updated successfully";
          },
          error: (e) =>
            e instanceof AxiosError
              ? e.response?.data?.message
              : "Failed to update cities hub page",
        },
      );
    } catch (error) {
      console.error(error);
    }
  };

  if (isError) return <ErrorCard refetch={refetch} />;

  return (
    <>
      <PageTitle title={generatePageTitle("Edit Cities Hub Page")} />
      <div className="p-6 space-y-6 md:p-8 md:space-y-8">
        <PageHeader
          title="Cities Hub"
          breadcrumbs={[
            { label: "Home", path: "/" },
            {
              label: "Content Management",
              path: constant.ROUTING_URLS.CONTENT_MANAGEMENT_ALL_PAGES,
            },
            {
              label: "Cities Hub",
              path: constant.ROUTING_URLS.CONTENT_MANAGEMENT_ALL_PAGES,
            },
            { label: "Edit Cities Hub" },
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
          <CitiesHubForm
            initialData={citiesHubPageData}
            onSubmit={handleSubmit}
            type="Update Cities Hub"
          />
        )}
      </div>
    </>
  );
}
