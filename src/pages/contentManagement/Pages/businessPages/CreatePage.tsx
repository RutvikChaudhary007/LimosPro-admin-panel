import { AxiosError } from "axios";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCreateBusinessPageLayout } from "@/api";
import PageTitle from "@/components/common/PageTitle";
import { PageHeader } from "@/components/layouts/PageHeader";
import type { MultiLangPageTemplateFormData } from "@/components/pagebuilder/PageBuilderBusinessForm";
import { toastPromise } from "@/hooks/use-toast";
import { constant } from "@/lib/constant";
import { generatePageTitle } from "@/utils/seo";
import PageForm from "./PageForm";

function CreatePage() {
  const navigate = useNavigate();
  const createPageMutation = useCreateBusinessPageLayout();

  const handleSubmit = (data: MultiLangPageTemplateFormData) => {
    // styledLog(data, "data:", "info");
    data.category = "business";
    toastPromise(createPageMutation.mutateAsync(data as any), {
      loading: "Creating page...",
      success: () => {
        navigate("/content-management/pages");
        return "Page created successfully";
      },
      error: (e) =>
        e instanceof AxiosError
          ? e.response?.data?.message
          : "Failed to create page",
    });
  };

  return (
    <>
      <PageTitle title={generatePageTitle("Create Page")} />
      <div className="p-6 space-y-6 md:p-8 md:space-y-8">
        <PageHeader
          title="Create Page"
          breadcrumbs={[
            { label: "Home", path: "/" },
            { label: "Content Management" },
            {
              label: "Pages",
              path: constant.ROUTING_URLS.CONTENT_MANAGEMENT_ALL_PAGES,
            },
            { label: "Create Page" },
          ]}
          backAction={{
            variant: "outlinePrimary",
            label: "Back",
            icon: <ArrowLeft />,
            link: constant.ROUTING_URLS.CONTENT_MANAGEMENT_ALL_PAGES,
          }}
        />
        <PageForm onSubmit={handleSubmit} />
      </div>
    </>
  );
}

export default CreatePage;
