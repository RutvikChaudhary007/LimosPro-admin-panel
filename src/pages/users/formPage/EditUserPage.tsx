// import { updateUser } from "@/api/updateUserById"

import { ArrowLeft } from "lucide-react";
import { useParams } from "react-router-dom";
// import type { ApiErrorResponse } from "@/types/global/ErrorResponse"
import { PageHeader } from "@/components/layouts/PageHeader";
// import { useMutation } from "@tanstack/react-query"
// import type { AxiosError } from "axios"
import UserForm from "@/components/user/UserForm";
import { toastPromise } from "@/hooks/use-toast";
import { constant } from "@/lib/constant";
import queries from "@/lib/queries";
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
        error: (e) =>
          e instanceof Error ? e.message : "Opps! Failed to update the user.",
      });
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="p-6 space-y-6 md:p-8 md:space-y-8">
      <PageHeader
        title="Edit User"
        breadcrumbs={[
          { label: "Home", path: "/" },
          { label: "Users", path: constant.ROUTING_URLS.USERS },
          { label: "Edit User" },
        ]}
        backAction={{
          variant: "outlinePrimary",
          label: "Back",
          icon: <ArrowLeft />,
          link: constant.ROUTING_URLS.USERS,
        }}
      />
      <UserForm
        initialData={initialData}
        onSubmit={handleEditUser}
        type={"Edit User"}
      />
    </div>
  );
};

export default EditUserPage;
