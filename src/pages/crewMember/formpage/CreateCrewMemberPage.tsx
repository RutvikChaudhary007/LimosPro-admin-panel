import { AxiosError } from "axios";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import CrewMemberForm, {
  type TCrewMemberForm,
} from "@/components/crewMember/crewMemberForm";
import { PageHeader } from "@/components/layouts/PageHeader";
import { toastPromise } from "@/hooks/use-toast";
import { constant } from "@/lib/constant";
import queries from "@/lib/queries";
import { styledLog } from "@/utils/styledLog";

const CreateCrewMemberPage = () => {
  const createCrewMemberMutation = queries.useCreateCrewMemberMutation();
  function handleCreateCrewMember(data: TCrewMemberForm) {
    try {
      toastPromise(createCrewMemberMutation.mutateAsync(data), {
        loading: "Loading...",
        success: "Yeah!, crew member created successfully.",
        error: (e) => {
          styledLog(e, "err;", "danger");
          return e instanceof AxiosError
            ? e.response?.data?.data?.error || e.response?.data?.message
            : "Failed to create crew member.";
        },
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  }

  return (
    <div className="p-6 space-y-6 md:p-8 md:space-y-8">
      <PageHeader
        title="Create Crew Member"
        breadcrumbs={[
          { label: "Home", path: "/" },
          { label: "Crew Member", path: constant.ROUTING_URLS.CREW_MEMBERS },
          { label: "Create Crew Member" },
        ]}
        backAction={{
          variant: "outlinePrimary",
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
