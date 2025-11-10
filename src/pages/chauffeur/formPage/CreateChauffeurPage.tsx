// import { createChauffeur } from "@/api/createChauffeur"

import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
// import type { ApiErrorResponse } from "@/types/global/ErrorResponse"
// import { useMutation } from "@tanstack/react-query"
// import type { AxiosError } from "axios"
import ChauffeurForm, { type TChauffeurForm } from "@/components/chauffeur/ChauffeurForm";
import Header from "@/components/layouts/BreadCramb";
import { Button } from "@/components/ui/button";
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
        error: (e) => (e instanceof Error ? e.message : "Failed to create chauffeur"),
      });
    } catch (error) {
      // Error handling is done in onError callback
      console.error("Login error:", error);
    }
  };
  return (
    <>
      <div className="p-6 space-y-6 md:p-8 md:space-y-8">
        <Link to={constant.ROUTING_URLS.CHAUFFEUR}>
          <Button
            variant="outline"
            className="py-3 px-1.5 rounded bg-[#D9D9D9] w-[80px] h-[31px] flex items-center justify-center cursor-pointer text-[#5A5A5A]"
          >
            <ArrowLeft /> Back
          </Button>
        </Link>
        <Header className="p-4 h-[79px] bg-[#FDFDFD] shadow-[0_4px_20px_rgba(0,0,0,0.05)] mt-4 mb-5">
          <div className="w-full h-full flex items-center justify-between">
            <div>
              <h2 className="font-medium text-xl text-black">Chauffeur</h2>
              <h4>
                {" "}
                <span className="text-[#959595] w-[116px] h-4 text-xs">Chauffeur</span>{" "}
                <span className="text-xs text-[#3A3A3A] w-[50px] h-4">/ Create Chauffeur</span>
              </h4>
            </div>
          </div>
        </Header>
        <ChauffeurForm onSubmit={handleCreateChauffeur} type={"Create Chauffeur"} />
      </div>
    </>
  );
};

export default CreateChauffeurPage;
