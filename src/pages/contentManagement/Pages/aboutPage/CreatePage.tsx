import { AxiosError } from "axios";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCreateBusinessPageLayout } from "@/api";
import AboutForm from "@/components/contentManagement/about/AboutForm";
import { PageHeader } from "@/components/layouts/PageHeader";
import { toastPromise } from "@/hooks/use-toast";
import { constant } from "@/lib/constant";

export default function CreatePage() {
  const navigate = useNavigate();
  const createAboutMutation = useCreateBusinessPageLayout();

  const handleCreateAbout = (data: any) => {
    try {
      toastPromise(
        createAboutMutation.mutateAsync({ ...data, category: "about" }),
        {
          loading: "Creating about page...",
          success: () => {
            navigate(constant.ROUTING_URLS.CONTENT_MANAGEMENT_ALL_PAGES);
            return "About page created successfully!";
          },
          error: (e) =>
            e instanceof AxiosError
              ? (e.response?.data?.data?.error ??
                e.response?.data?.message ??
                "Failed to create about page")
              : "Failed to create about page",
        },
      );
    } catch (error) {
      console.error("Create about error:", error);
    }
  };

  return (
    <div className="p-6 space-y-6 md:p-8 md:space-y-8">
      <PageHeader
        title="Create About Page"
        breadcrumbs={[
          { label: "Home", path: "/" },
          {
            label: "Content Management",
            path: constant.ROUTING_URLS.CONTENT_MANAGEMENT_ALL_PAGES,
          },
          { label: "Create About" },
        ]}
        backAction={{
          variant: "outlinePrimary",
          label: "Back",
          icon: <ArrowLeft />,
          link: constant.ROUTING_URLS.CONTENT_MANAGEMENT_ALL_PAGES,
        }}
      />
      <AboutForm onSubmit={handleCreateAbout} type={"Create"} />
    </div>
  );
}
