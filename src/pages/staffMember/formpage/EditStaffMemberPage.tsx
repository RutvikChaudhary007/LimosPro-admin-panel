//@ts-nocheck

import { AxiosError } from "axios";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useFetchOneStaffMember } from "@/api";
import { PageHeader } from "@/components/layouts/PageHeader";
import { Spinner } from "@/components/Spinner";
import StaffMemberForm from "@/components/staffMember/StaffMemberForm";
import { toastPromise } from "@/hooks/use-toast";
import { constant } from "@/lib/constant";
import queries from "@/lib/queries";

// const initialData = {
//     firstName: "John",
//     lastName: "Doe",
//     email: "name@email.com",
//     password: "password@123",
//     role: ["admin"]
// }
const EditStaffMemberPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isFetching } = useFetchOneStaffMember({ id: id as string });
  const editStaffMember = queries.useUpdateStaffMemberMutation();

  async function onSubmit(values: any) {
    try {
      const staffData = { ...values };

      if (staffData?.password?.includes("*")) delete staffData.password;

      await toastPromise(
        editStaffMember.mutateAsync({
          id: id as string,
          regionId: data?.region?.id as string,
          data: staffData,
        }),
        {
          loading: "Updating staff member...",
          success: "Staff member updated successfully",
          error: (e) =>
            e instanceof AxiosError
              ? e.response?.data?.message
              : "Failed to update staff member",
        },
      );

      navigate(constant.ROUTING_URLS.STAFF_MEMBERS);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message);
      } else {
        toast.error("An unknown error occurred");
      }
    }
  }
  return (
    <div className="p-6 space-y-6 md:p-8 md:space-y-8">
      <PageHeader
        title="Edit Staff Member"
        breadcrumbs={[
          { label: "Home", path: "/" },
          { label: "Staff Members", path: constant.ROUTING_URLS.STAFF_MEMBERS },
          { label: "Edit Staff Member" },
        ]}
        backAction={{
          variant: "outlinePrimary",
          label: "Back",
          icon: <ArrowLeft />,
          link: constant.ROUTING_URLS.STAFF_MEMBERS,
        }}
      />
      {isFetching ? (
        <Spinner />
      ) : (
        <StaffMemberForm
          initialData={data}
          onSubmit={onSubmit}
          type={"Edit Staff Member"}
        />
      )}
    </div>
  );
};

export default EditStaffMemberPage;
