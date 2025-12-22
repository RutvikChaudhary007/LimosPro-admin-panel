import { AxiosError } from "axios";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCreateBusinessPageLayout } from "@/api";
import HomeForm from "@/components/contentManagement/home/HomeForm";
import { PageHeader } from "@/components/layouts/PageHeader";
import { toastPromise } from "@/hooks/use-toast";
import { constant } from "@/lib/constant";

export default function CreatePage() {
  const navigate = useNavigate();
  const createHomeMutation = useCreateBusinessPageLayout();

  const handleCreateHome = (data: any) => {
    try {
      toastPromise(
        createHomeMutation.mutateAsync({ ...data, category: "home" }),
        {
          loading: "Creating home page...",
          success: () => {
            navigate(constant.ROUTING_URLS.CONTENT_MANAGEMENT_ALL_PAGES);
            return "Home page created successfully!";
          },
          error: (e) =>
            e instanceof AxiosError
              ? e.response?.data?.message || "Failed to create home"
              : "Failed to create home",
        },
      );
    } catch (error) {
      console.error("Create home error:", error);
    }
  };

  return (
    <div className="p-6 space-y-6 md:p-8 md:space-y-8">
      <PageHeader
        title="Home"
        breadcrumbs={[
          { label: "Home", path: "/" },
          {
            label: "Content Management",
            path: constant.ROUTING_URLS.CONTENT_MANAGEMENT_ALL_PAGES,
          },
          { label: "Create Home" },
        ]}
        backAction={{
          variant: "outlinePrimary",
          label: "Back",
          icon: <ArrowLeft />,
          link: constant.ROUTING_URLS.CONTENT_MANAGEMENT_ALL_PAGES,
        }}
      />
      <HomeForm onSubmit={handleCreateHome} type={"Create"} />
    </div>
  );
}
