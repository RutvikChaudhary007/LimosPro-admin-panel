import { AxiosError } from "axios";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useFetchBusinessPageLayoutById,
  useUpdateBusinessPageLayout,
} from "@/api";
import { ErrorCard } from "@/components/common/ErrorCard";
import PageTitle from "@/components/common/PageTitle";
import { PageHeader } from "@/components/layouts/PageHeader";
import type { MultiLangPageTemplateFormData } from "@/components/pagebuilder/PageBuilderBusinessForm";
import { Spinner } from "@/components/Spinner";
import { toastPromise } from "@/hooks/use-toast";
import { constant } from "@/lib/constant";
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
  const handleSubmit = (data: Partial<MultiLangPageTemplateFormData>) => {
    try {
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
    } catch (error) {
      console.error(error);
    }
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
            {
              label: "Pages",
              path: constant.ROUTING_URLS.CONTENT_MANAGEMENT_ALL_PAGES,
            },
            { label: "Edit" },
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
          <PageForm initialData={page} onSubmit={handleSubmit} />
        )}
      </div>
    </>
  );
}

export default EditPage;
