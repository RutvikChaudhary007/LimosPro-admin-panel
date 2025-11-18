import { ArrowLeft } from "lucide-react";
import CrewMemberForm, {
  type TCrewMemberForm,
} from "@/components/crewMember/crewMemberForm";
import { PageHeader } from "@/components/layouts/PageHeader";
import { toastPromise } from "@/hooks/use-toast";
import { constant } from "@/lib/constant";
import queries from "@/lib/queries";

const CreateCrewMemberPage = () => {
  const createCrewMemberMutation = queries.useCreateCrewMemberMutation();
  function handleCreateCrewMember(data: TCrewMemberForm) {
    try {
      console.log("data", data);
      toastPromise(createCrewMemberMutation.mutateAsync(data), {
        loading: "Loading...",
        success: "Yeah!, crew member created successfully.",
        error: (e) =>
          e instanceof Error ? e.message : "Failed to create crew member.",
      });
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="p-6 space-y-6 md:p-8 md:space-y-8">
      <PageHeader
        title="Edit Crew Member"
        breadcrumbs={[
          { label: "Home", path: "/" },
          { label: "Crew Member", path: constant.ROUTING_URLS.CREW_MEMBERS },
          { label: "Create Crew Member" },
        ]}
        action={{
          variant: "outlineBlack",
          label: "Back",
          icon: <ArrowLeft />,
          link: constant.ROUTING_URLS.CREW_MEMBERS,
        }}
      />
      <CrewMemberForm
        onSubmit={handleCreateCrewMember}
        type={"Create Crew Member"}
      />
    </div>
  );
};

export default CreateCrewMemberPage;
