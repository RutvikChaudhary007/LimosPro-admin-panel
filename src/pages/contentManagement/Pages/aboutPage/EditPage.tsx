import { AxiosError } from "axios";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useFetchBusinessPageLayoutById,
  useUpdateBusinessPageLayout,
} from "@/api";
import { ErrorCard } from "@/components/common/ErrorCard";
import PageTitle from "@/components/common/PageTitle";
import AboutForm from "@/components/contentManagement/about/AboutForm";
import { PageHeader } from "@/components/layouts/PageHeader";
import { Spinner } from "@/components/Spinner";
import { toastPromise } from "@/hooks/use-toast";
import { constant } from "@/lib/constant";
import { generatePageTitle } from "@/utils/seo";

export default function EditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    data: aboutData,
    isFetching,
    isError,
    refetch,
  } = useFetchBusinessPageLayoutById(id as string);
  const updateAboutMutation = useUpdateBusinessPageLayout();

  const handleSubmit = (data: any) => {
    try {
      toastPromise(
        updateAboutMutation.mutateAsync({
          id: id as string,
          data: { ...data, category: "about" },
        }),
        {
          loading: "Updating about page...",
          success: () => {
            navigate(constant.ROUTING_URLS.CONTENT_MANAGEMENT_ALL_PAGES);
            return "About page updated successfully";
          },
          error: (e) =>
            e instanceof AxiosError
              ? e.response?.data?.message || "Failed to update about page"
              : "Failed to update about page",
        },
      );
    } catch (error) {
      console.error(error);
    }
  };

  if (isError) return <ErrorCard refetch={refetch} />;

  return (
    <>
      <PageTitle title={generatePageTitle("Edit About Page")} />
      <div className="p-6 space-y-6 md:p-8 md:space-y-8">
        <PageHeader
          title="Edit About Page"
          breadcrumbs={[
            { label: "Home", path: "/" },
            {
              label: "Content Management",
              path: constant.ROUTING_URLS.CONTENT_MANAGEMENT_ALL_PAGES,
            },
            { label: "Edit About" },
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
          <AboutForm
            initialData={aboutData}
            onSubmit={handleSubmit}
            type="Update"
          />
        )}
      </div>
    </>
  );
}
