// import { createChauffeur } from "@/api/createChauffeur"

import { ArrowLeft } from "lucide-react";
// import type { ApiErrorResponse } from "@/types/global/ErrorResponse"
// import { useMutation } from "@tanstack/react-query"
// import type { AxiosError } from "axios"
import ChauffeurForm, {
  type TChauffeurForm,
} from "@/components/chauffeur/ChauffeurForm";
import { PageHeader } from "@/components/layouts/PageHeader";
import { toastPromise } from "@/hooks/use-toast";
import { constant } from "@/lib/constant";
import queries from "@/lib/queries";

const CreateChauffeurPage = () => {
  const createChauffeurMutation = queries.useCreateChauffeurMutation();

  const handleCreateChauffeur = async (data: TChauffeurForm) => {
    console.log("called handle create chauffeur!", data);
    try {
      toastPromise(createChauffeurMutation.mutateAsync(data), {
        loading: "Submitting...",
        success: "Chauffeur created successfully!",
        error: (e) =>
          e instanceof Error ? e.message : "Failed to create chauffeur",
      });
    } catch (error) {
      // Error handling is done in onError callback
      console.error("Login error:", error);
    }
  };
  return (
    <div className="p-6 space-y-6 md:p-8 md:space-y-8">
      <PageHeader
        title="Chauffeur"
        breadcrumbs={[
          { label: "Home", path: "/" },
          { label: "Chauffeur", path: constant.ROUTING_URLS.CHAUFFEUR },
          { label: "Create Chauffeur" },
        ]}
        backAction={{
          variant: "outlinePrimary",
          label: "Back",
          icon: <ArrowLeft />,
          link: constant.ROUTING_URLS.CHAUFFEUR,
        }}
      />

      <ChauffeurForm
        onSubmit={handleCreateChauffeur}
        type={"Create Chauffeur"}
      />
    </div>
  );
};

export default CreateChauffeurPage;
