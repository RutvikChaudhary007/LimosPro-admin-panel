import { ArrowLeft } from "lucide-react";
import type React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useFetchContentBlockById } from "@/api/contentBlock.api";
import ContentManagementForm, {
  type TContentForm,
} from "@/components/contentManagement/ContentManagementForm";
import { PageHeader } from "@/components/layouts/PageHeader";
import { Spinner } from "@/components/Spinner";
import { toastPromise } from "@/hooks/use-toast";
import { constant } from "@/lib/constant";
import queries from "@/lib/queries";

const EditContent: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isFetching, isError } = useFetchContentBlockById(id!);

  const editContentMutation = queries.useEditContentBlockMutation();
  const handleEditSubmit = async (data: TContentForm) => {
    try {
      toastPromise(editContentMutation.mutateAsync({ id: id!, data }), {
        loading: "Editing content...",
        success: (res) => {
          if (res) navigate(constant.ROUTING_URLS.CONTENT_MANAGEMENT_ALL_PAGES);
          return "Yeah! Content edited successfully.";
        },
        error: (e) =>
          e instanceof Error ? e.message : "Opps! Failed to update content.",
      });
    } catch (error) {
      if (error instanceof Error) console.error(error.message);
    }
  };
  if (isError) toast.error("Opps! failed to fetch the content.");
  return (
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
          { label: "Edit Page" },
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
        <ContentManagementForm
          initialData={data}
          onSubmit={handleEditSubmit}
          type="Edit Page"
        />
      )}
    </div>
  );
};

export default EditContent;
