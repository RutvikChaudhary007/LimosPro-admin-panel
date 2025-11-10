import CrewMemberForm, { type TCrewMemberForm } from "@/components/crewMember/crewMemberForm";
import Header from "@/components/layouts/BreadCramb";
import { Button } from "@/components/ui/button";
import { toastPromise } from "@/hooks/use-toast";
import { constant } from "@/lib/constant";
import queries from "@/lib/queries";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const CreateCrewMemberPage = () => {
  const createCrewMemberMutation = queries.useCreateCrewMemberMutation();
  function handleCreateCrewMember(data: TCrewMemberForm) {
    try {
      console.log("data", data);
      toastPromise(createCrewMemberMutation.mutateAsync(data), {
        loading: "Loading...",
        success: "Yeah!, crew member created successfully.",
        error: (e) => (e instanceof Error ? e.message : "Failed to create crew member."),
      });
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <div className="p-6 space-y-6 md:p-8 md:space-y-8">
        <Link to={constant.ROUTING_URLS.CREW_MEMBERS}>
          <Button
            variant="outline"
            className="py-3 px-1.5 rounded bg-[#D9D9D9] w-[80px] h-[31px] flex items-center justify-center cursor-pointer text-[#5A5A5A]"
          >
            <ArrowLeft /> Back
          </Button>
        </Link>
        <Header className="p-4 h-[79px] bg-[#FDFDFD] shadow-base-light mt-4 mb-5">
          <div className="w-full h-full flex items-center justify-between">
            <div>
              <h2 className="font-medium text-xl text-black">Crew Member</h2>
              <h4>
                {" "}
                <span className="text-[#959595] w-[116px] h-4 text-xs">LIMOSPRO</span>{" "}
                <span className="text-xs text-[#3A3A3A] w-[50px] h-4">/ Create Crew Member</span>
              </h4>
            </div>
          </div>
        </Header>
        <CrewMemberForm onSubmit={handleCreateCrewMember} type={"Create Crew Member"} />
      </div>
    </>
  );
};

export default CreateCrewMemberPage;
