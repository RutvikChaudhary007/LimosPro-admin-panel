import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/layouts/PageHeader";
import UserForm from "@/components/user/UserForm";
import { constant } from "@/lib/constant";
import type { IUserFormData } from "@/types/user.type";

const CreateUserPage = () => {
  const handleCreateUser = async (data: IUserFormData) => {
    return new Promise((res) =>
      setTimeout(() => res(console.log("IUserFormData:", data)), 5000),
    );
  };
  return (
    <div className="p-6 space-y-6 md:p-8 md:space-y-8">
      <PageHeader
        title="Create User"
        breadcrumbs={[
          { label: "Home", path: "/" },
          { label: "Users", path: constant.ROUTING_URLS.USERS },
          { label: "Create User" },
        ]}
        backAction={{
          variant: "outlinePrimary",
          label: "Back",
          icon: <ArrowLeft />,
          link: constant.ROUTING_URLS.USERS,
        }}
      />
      <UserForm onSubmit={handleCreateUser} type={"Create User"} />
    </div>
  );
};

export default CreateUserPage;
