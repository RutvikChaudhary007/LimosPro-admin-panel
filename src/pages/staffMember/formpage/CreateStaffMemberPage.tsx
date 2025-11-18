import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/layouts/PageHeader";
import StaffMemberForm from "@/components/staffMember/StaffMemberForm";
import { toastPromise } from "@/hooks/use-toast";
import { constant } from "@/lib/constant";
import queries from "@/lib/queries";

const CreateStaffMemberPage = () => {
  const createStaffMutation = queries.useCreateStaffMemberMutation();
  async function onSubmit(values: object) {
    console.log("data:", values);
    try {
      toastPromise(createStaffMutation.mutateAsync(values), {
        loading: "Creating Staff Member...",
        success: "Staff Member Created Successfully",
        error: (e) =>
          e instanceof Error ? e.message : "Failed to create Staff Member",
      });
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  }
  return (
    <div className="p-6 space-y-6 md:p-8 md:space-y-8">
      <PageHeader
        title="Create Staff Member"
        breadcrumbs={[
          { label: "Home", path: "/" },
          { label: "Staff Members", path: constant.ROUTING_URLS.STAFF_MEMBERS },
          { label: "Create Staff Member" },
        ]}
        action={{
          variant: "outlineBlack",
          label: "Back",
          icon: <ArrowLeft />,
          link: constant.ROUTING_URLS.STAFF_MEMBERS,
        }}
      />
      <StaffMemberForm onSubmit={onSubmit} type={"Create Staff Member"} />
    </div>
  );
};

export default CreateStaffMemberPage;
