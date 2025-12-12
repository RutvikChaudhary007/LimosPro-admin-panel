import { ArrowLeft } from "lucide-react";
import type React from "react";
import { useNavigate } from "react-router-dom";
import ContentManagementForm, {
  type TContentForm,
} from "@/components/contentManagement/ContentManagementForm";
import { PageHeader } from "@/components/layouts/PageHeader";
import { toastPromise } from "@/hooks/use-toast";
import { constant } from "@/lib/constant";
import queries from "@/lib/queries";

// ------------------- CreateContent -------------------
const CreateContent: React.FC = () => {
  const navigate = useNavigate();
  const createContentMutation = queries.useCreateContentBlockMutation();
  const handleOnSubmit = async (data: TContentForm) => {
    console.log("data:", data);
    try {
      toastPromise(createContentMutation.mutateAsync(data), {
        loading: "Creating Content...",
        success: (res) => {
          if (res) navigate(constant.ROUTING_URLS.CONTENT_MANAGEMENT_ALL_PAGES);
          return "Yeah! Content created successfully.";
        },
        error: (e) =>
          e instanceof AxiosError
            ? e.response?.data?.data?.error || e.response?.data?.message
            : "Opps! Failed to create content.",
      });
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  };
  return (
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
      <ContentManagementForm onSubmit={handleOnSubmit} type="Create Page" />
    </div>
  );
};

export default CreateContent;
