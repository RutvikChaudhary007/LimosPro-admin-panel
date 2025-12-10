import { AxiosError } from "axios";
import { useNavigate, useParams } from "react-router-dom";
import {
  useFetchBusinessPageLayoutById,
  useUpdateBusinessPageLayout,
} from "@/api/pages/businessPageLayout.api";
import { ErrorCard } from "@/components/common/ErrorCard";
import PageTitle from "@/components/common/PageTitle";
import { PageHeader } from "@/components/layouts/PageHeader";
import type { PageTemplateFormData } from "@/components/pagebuilder.businessForm";
import { Spinner } from "@/components/Spinner";
import { toastPromise } from "@/hooks/use-toast";
import { generatePageTitle } from "@/utils/seo";
import { styledLog } from "@/utils/styledLog";
import PageForm from "./PageForm";

function EditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    data: page,
    isFetching,
    isError,
    refetch,
  } = useFetchBusinessPageLayoutById(id || "");
  const updatePageMutation = useUpdateBusinessPageLayout();
  styledLog(page, "page;", "info");
  const handleSubmit = (data: Partial<PageTemplateFormData>) => {
    toastPromise(updatePageMutation.mutateAsync({ id: id!, data }), {
      loading: "Updating page...",
      success: () => {
        navigate("/content-management/pages");
        return "Page updated successfully";
      },
      error: (e) =>
        e instanceof AxiosError
          ? e.response?.data?.message
          : "Failed to update page",
    });
  };

  if (isError) return <ErrorCard refetch={refetch} />;

  return (
    <>
      <PageTitle title={generatePageTitle("Edit Page")} />
      <div className="p-6 space-y-6 md:p-8 md:space-y-8">
        <PageHeader
          title="Edit Page"
          breadcrumbs={[
            { label: "Home", path: "/" },
            { label: "Content Management" },
            { label: "Pages", path: "/content-management/pages" },
            { label: "Edit" },
          ]}
        />
        {isFetching ? (
          <Spinner />
        ) : (
          <PageForm initialData={page} onSubmit={handleSubmit} />
        )}
      </div>
    </>
  );
}

export default EditPage;
