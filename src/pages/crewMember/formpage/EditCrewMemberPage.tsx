// @ts-nocheck

import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import CrewMemberForm from "@/components/crewMember/crewMemberForm";
import { PageHeader } from "@/components/layouts/PageHeader";
import { toastPromise } from "@/hooks/use-toast";
import { constant } from "@/lib/constant";
import queries from "@/lib/queries";

const dummyData = {
  firstName: "John",
  lastName: "Doe",
  designation: "admin",
  email: "admin@email.com",
  phone: "123456789",
};

const EditCrewMemberPage = () => {
  const { id } = useParams();

  const navigate = useNavigate();
  const updateCrewMemberMutation = queries.useUpdateCrewMemberMutation();
  const handleEditCrewMember = (data: TCrewMemberForm) => {
    try {
      toastPromise(updateCrewMemberMutation.mutate({ data, id }), {
        loading: "Updating Crew Member...",
        success: (res) => {
          if (res) navigate(constant.ROUTING_URLS.CREW_MEMBERS);
          return "Crew Member Updated Successfully!";
        },
        error: (e) =>
          e instanceof Error ? e.message : "Failed to Update Crew Member!",
      });
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to Update Crew Member!");
      }
    }
  };
  return (
    <div className="p-6 space-y-6 md:p-8 md:space-y-8">
      <PageHeader
        title="Edit Crew Member"
        breadcrumbs={[
          { label: "Home", path: "/" },
          { label: "Crew Member", path: constant.ROUTING_URLS.CREW_MEMBERS },
          { label: "Edit Crew Member" },
        ]}
        backAction={{
          variant: "outlinePrimary",
          label: "Back",
          icon: <ArrowLeft />,
          link: constant.ROUTING_URLS.CREW_MEMBERS,
        }}
      />
      <CrewMemberForm
        initialData={dummyData}
        onSubmit={handleEditCrewMember}
        type={"Edit Crew Member"}
      />
    </div>
  );
};

export default EditCrewMemberPage;
