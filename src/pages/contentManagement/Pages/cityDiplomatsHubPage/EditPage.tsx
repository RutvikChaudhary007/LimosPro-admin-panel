import { AxiosError } from "axios";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useFetchCityDiplomatsHubPageById,
  useUpdateCityDiplomatsHubPage,
} from "@/api/pages/cityDiplomatsHubPage.api";
import { ErrorCard } from "@/components/common/ErrorCard";
import PageTitle from "@/components/common/PageTitle";
import CityDiplomatsHubForm from "@/components/contentManagement/cityDiplomatsHub/CityDiplomatsHubForm";
import { PageHeader } from "@/components/layouts/PageHeader";
import { Spinner } from "@/components/Spinner";
import { toastPromise } from "@/hooks/use-toast";
import { constant } from "@/lib/constant";
import { generatePageTitle } from "@/utils/seo";

export default function EditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    data: cityDiplomatsHubPageData,
    isFetching,
    isError,
    refetch,
  } = useFetchCityDiplomatsHubPageById(id as string);
  const updateCityDiplomatsHubMutation = useUpdateCityDiplomatsHubPage();

  const handleSubmit = (data: any) => {
    try {
      toastPromise(
        updateCityDiplomatsHubMutation.mutateAsync({
          id: id as string,
          data,
        }),
        {
          loading: "Updating city diplomats hub page...",
          success: () => {
            navigate(constant.ROUTING_URLS.CONTENT_MANAGEMENT_ALL_PAGES);
            return "City diplomats hub page updated successfully";
          },
          error: (e) =>
            e instanceof AxiosError
              ? e.response?.data?.message
              : "Failed to update city diplomats hub page",
        },
      );
    } catch (error) {
      console.error(error);
    }
  };

  if (isError) return <ErrorCard refetch={refetch} />;

  return (
    <>
      <PageTitle title={generatePageTitle("Edit City Diplomats Hub Page")} />
      <div className="p-6 space-y-6 md:p-8 md:space-y-8">
        <PageHeader
          title="City Diplomats Hub"
          breadcrumbs={[
            { label: "Home", path: "/" },
            {
              label: "Content Management",
              path: constant.ROUTING_URLS.CONTENT_MANAGEMENT_ALL_PAGES,
            },
            {
              label: "City Diplomats Hub",
              path: constant.ROUTING_URLS.CONTENT_MANAGEMENT_ALL_PAGES,
            },
            { label: "Edit City Diplomats Hub" },
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
          <CityDiplomatsHubForm
            initialData={cityDiplomatsHubPageData}
            onSubmit={handleSubmit}
            type="Update City Diplomats Hub"
          />
        )}
      </div>
    </>
  );
}
