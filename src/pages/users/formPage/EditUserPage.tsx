// import { updateUser } from "@/api/updateUserById"

// import { useMutation } from "@tanstack/react-query"
// import type { AxiosError } from "axios"
import Header from "@/components/layouts/BreadCramb";
import { Button } from "@/components/ui/button";
import UserForm from "@/components/user/UserForm";
import { toastPromise } from "@/hooks/use-toast";
import { constant } from "@/lib/constant";
import queries from "@/lib/queries";
import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";
// import type { ApiErrorResponse } from "@/types/global/ErrorResponse"
import type { IUserFormData } from "@/types/user.type";

// @ts-expect-error: We are intentionally assigning a number to a string type for testing.
const initialData: IUserFormData = {
  // firstName: "John",
  // lastName: "Doe",
  // dateOfBirth: new Date("12-08-2025"),
  // email: "rutvik.chaudhary@qalbit.com",
  // phone: "9876543210",
  // gender: "female",
  status: "active",
};

const EditUserPage = () => {
  const { id } = useParams();

  const updateUserMutation = queries.useUpdateUserMutation();
  const handleEditUser = async (data: IUserFormData) => {
    try {
      toastPromise(await updateUserMutation.mutateAsync({ id: id!, data }), {
        loading: "Loading...",
        success: "Yeah! sucessfully updated the user.",
        error: (e) => (e instanceof Error ? e.message : "Opps! Failed to update the user."),
      });
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <div className="p-6 space-y-6 md:p-8 md:space-y-8">
        <Link to={constant.ROUTING_URLS.USERS}>
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
              <h2 className="font-medium text-xl text-black">User</h2>
              <h4>
                {" "}
                <span className="text-[#959595] w-[116px] h-4 text-xs">User</span>{" "}
                <span className="text-xs text-[#3A3A3A] w-[50px] h-4">/ Edit User</span>
              </h4>
            </div>
          </div>
        </Header>
        <UserForm initialData={initialData} onSubmit={handleEditUser} type={"Edit User"} />
      </div>
    </>
  );
};

export default EditUserPage;
