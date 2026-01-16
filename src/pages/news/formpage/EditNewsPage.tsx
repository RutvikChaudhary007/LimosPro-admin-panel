import { ArrowLeft } from "lucide-react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { useFetchNewsById } from "@/api";
import { PageHeader } from "@/components/layouts/PageHeader";
import NewsForm, { type TNewsForm } from "@/components/news/NewsForm";
import { Spinner } from "@/components/Spinner";
import { toastPromise } from "@/hooks/use-toast";
import { constant } from "@/lib/constant";
import queries from "@/lib/queries";

// const mockData: TNews = {
//     id: "1",
//     news: "You can book online the hourly service for the Houston rodeo on our website. If you are looking for a point-point one-way or round trip for the Houston rodeo, please call us to book by phone because the regular online point-point rates are not valid for Houston rodeo one-way or round trip.",
// }
const EditNewsPage = () => {
  const { id } = useParams();
  const { data, isFetching } = useFetchNewsById(id!);
  const editNews = queries.useEditNewsMutation();
  const handleSubmit = async (data: TNewsForm): Promise<void> => {
    try {
      await toastPromise(
        editNews.mutateAsync({ id: id!, data: { body: data.news } }),
        {
          loading: "Updating news...",
          success: "Yeah! News updated successfully",
          error: "Failed to update news",
        },
      );
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred");
      }
    }
  };

  return (
    <div className="p-6 space-y-6 md:p-8 md:space-y-8">
      <PageHeader
        title="Edit News"
        breadcrumbs={[
          { label: "Home", path: "/" },
          { label: "News", path: constant.ROUTING_URLS.NEWS },
          { label: "Edit News" },
        ]}
        backAction={{
          variant: "outlinePrimary",
          label: "Back",
          icon: <ArrowLeft />,
          link: constant.ROUTING_URLS.NEWS,
        }}
      />
      {isFetching ? (
        <Spinner />
      ) : (
        <NewsForm initialData={data} onSubmit={handleSubmit} type="Edit News" />
      )}
    </div>
  );
};

export default EditNewsPage;
