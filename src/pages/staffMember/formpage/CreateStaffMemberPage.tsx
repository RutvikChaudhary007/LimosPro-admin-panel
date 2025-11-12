import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import Header from "@/components/layouts/BreadCramb";
import StaffMemberForm from "@/components/staffMember/StaffMemberForm";
import { Button } from "@/components/ui/button";
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
        error: (e) => (e instanceof Error ? e.message : "Failed to create Staff Member"),
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
    <div className="px-10 py-6 h-[calc(100vh-146px)]">
      <Link to={constant.ROUTING_URLS.STAFF_MEMBERS}>
        <Button
          variant="outline"
          className="py-3 px-1.5 rounded bg-[#D9D9D9] w-[80px] h-[31px] flex items-center justify-center cursor-pointer text-[#5A5A5A]"
        >
          <ArrowLeft /> Back
        </Button>
      </Link>
      <Header className="p-4 h-[79px] rounded-[6px] bg-[#FDFDFD] shadow-base-light mt-4 mb-5">
        <div className="">
          <h2 className="font-medium text-xl text-black">Staff Members</h2>
          <h4>
            <span className="text-[#959595] w-14 h-4">Staff Members</span>{" "}
            <span className="text-xs text-[#3A3A3A] w-[50px] h-4">/ Create Staff Members</span>
          </h4>
        </div>
      </Header>
      <StaffMemberForm onSubmit={onSubmit} type={"Create Staff Members"} />
    </div>
  );
};

export default CreateStaffMemberPage;
