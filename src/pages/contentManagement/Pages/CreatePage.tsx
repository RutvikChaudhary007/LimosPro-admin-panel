import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { useCreateBusinessPageLayout } from "@/api/pages/businessPageLayout.api";
import PageTitle from "@/components/common/PageTitle";
import { PageHeader } from "@/components/layouts/PageHeader";
import type { PageTemplateFormData } from "@/components/pagebuilder.businessForm";
import { toastPromise } from "@/hooks/use-toast";
import { generatePageTitle } from "@/utils/seo";
import { styledLog } from "@/utils/styledLog";
import PageForm from "./PageForm";

function CreatePage() {
  const navigate = useNavigate();
  const createPageMutation = useCreateBusinessPageLayout();

  const handleSubmit = (data: PageTemplateFormData) => {
    styledLog(data, "data:", "info");
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
            { label: "Pages", path: "/content-management/pages" },
            { label: "Create" },
          ]}
        />
        <PageForm onSubmit={handleSubmit} />
      </div>
    </>
  );
}

export default CreatePage;
