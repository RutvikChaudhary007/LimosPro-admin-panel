import { AxiosError } from "axios";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCreateBusinessPageLayout } from "@/api";
import ChauffeurForm from "@/components/contentManagement/chauffeur/ChauffeurForm";
import { PageHeader } from "@/components/layouts/PageHeader";
import { toastPromise } from "@/hooks/use-toast";
import { constant } from "@/lib/constant";

export default function CreatePage() {
  const navigate = useNavigate();
  const createChauffeurMutation = useCreateBusinessPageLayout();

  const handleCreateChauffeur = (data: any) => {
    try {
      toastPromise(
        createChauffeurMutation.mutateAsync({ ...data, category: "chauffeur" }),
        {
          loading: "Creating chauffeur page...",
          success: () => {
            navigate(constant.ROUTING_URLS.CONTENT_MANAGEMENT_ALL_PAGES);
            return "Chauffeur page created successfully!";
          },
          error: (e) =>
            e instanceof AxiosError
              ? e.response?.data?.message || "Failed to create chauffeur page"
              : "Failed to create chauffeur page",
        },
      );
    } catch (error) {
      console.error("Create chauffeur error:", error);
    }
  };

  return (
    <div className="p-6 space-y-6 md:p-8 md:space-y-8">
      <PageHeader
        title="Chauffeur"
        breadcrumbs={[
          { label: "Home", path: "/" },
          {
            label: "Content Management",
            path: constant.ROUTING_URLS.CONTENT_MANAGEMENT_ALL_PAGES,
          },
          { label: "Create Chauffeur" },
        ]}
        backAction={{
          variant: "outlinePrimary",
          label: "Back",
          icon: <ArrowLeft />,
          link: constant.ROUTING_URLS.CONTENT_MANAGEMENT_ALL_PAGES,
        }}
      />
      <ChauffeurForm
        onSubmit={handleCreateChauffeur}
        type={"Create Chauffeur"}
      />
    </div>
  );
}
