import { AxiosError } from "axios";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useFetchChauffeurPageById,
  useUpdateChauffeurPage,
} from "@/api/pages/chauffeurPage.api";
import { ErrorCard } from "@/components/common/ErrorCard";
import PageTitle from "@/components/common/PageTitle";
import ChauffeurForm from "@/components/contentManagement/chauffeur/ChauffeurForm";
import { PageHeader } from "@/components/layouts/PageHeader";
import { Spinner } from "@/components/Spinner";
import { toastPromise } from "@/hooks/use-toast";
import { constant } from "@/lib/constant";
import { generatePageTitle } from "@/utils/seo";

export default function EditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    data: pageData,
    isFetching,
    isError,
    refetch,
  } = useFetchChauffeurPageById(id || "");
  const updateChauffeurPageMutation = useUpdateChauffeurPage();
  const handleSubmit = (data: any) => {
    try {
      toastPromise(
        updateChauffeurPageMutation.mutateAsync({ id: id || "", data }),
        {
          loading: "Updating chauffeur page...",
          success: () => {
            navigate(constant.ROUTING_URLS.CONTENT_MANAGEMENT_ALL_PAGES);
            return "Chauffeur page updated successfully";
          },
          error: (e) =>
            e instanceof AxiosError
              ? e.response?.data?.message
              : "Failed to update chauffeur page",
        },
      );
    } catch (error) {
      console.error(error);
    }
  };

  if (isError) return <ErrorCard refetch={refetch} />;

  return (
    <>
      <PageTitle title={generatePageTitle("Edit Chauffeur Page")} />
      <div className="p-6 space-y-6 md:p-8 md:space-y-8">
        <PageHeader
          title="Chauffeur"
          breadcrumbs={[
            { label: "Home", path: "/" },
            {
              label: "Content Management",
              path: constant.ROUTING_URLS.CONTENT_MANAGEMENT_ALL_PAGES,
            },
            { label: "Edit Chauffeur" },
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
          <ChauffeurForm
            initialData={pageData || {}}
            onSubmit={handleSubmit}
            type="Update Chauffeur"
          />
        )}
      </div>
    </>
  );
}
