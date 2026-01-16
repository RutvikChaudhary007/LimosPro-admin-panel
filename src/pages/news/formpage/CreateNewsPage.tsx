import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/layouts/PageHeader";
import NewsForm, { type TNewsForm } from "@/components/news/NewsForm";
import { toastPromise } from "@/hooks/use-toast";
import { constant } from "@/lib/constant";
import queries from "@/lib/queries";

const CreateNewsPage = () => {
  const createNewsMutation = queries.useCreateNewsMutation();
  const handleSubmit = async (data: TNewsForm): Promise<void> => {
    try {
      await toastPromise(createNewsMutation.mutateAsync({ body: data.news }), {
        loading: "Creating news...",
        success: "Yeah! News created successfully",
        error: "Failed to create news",
      });
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="p-6 space-y-6 md:p-8 md:space-y-8">
      <PageHeader
        title="Create News"
        breadcrumbs={[
          { label: "Home", path: "/" },
          { label: "News", path: constant.ROUTING_URLS.NEWS },
          { label: "Create News" },
        ]}
        backAction={{
          variant: "outlinePrimary",
          label: "Back",
          icon: <ArrowLeft />,
          link: constant.ROUTING_URLS.NEWS,
        }}
      />
      <NewsForm onSubmit={handleSubmit} type="Create News" />
    </div>
  );
};

export default CreateNewsPage;
