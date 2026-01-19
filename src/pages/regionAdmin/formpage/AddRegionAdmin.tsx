import { AxiosError } from "axios";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/layouts/PageHeader";
import RegionAdminForm, {
  type TRegionAdmin,
} from "@/components/regionManagement/regionAdmin/RegionAdminForm";
import { toastPromise } from "@/hooks/use-toast";
import { constant } from "@/lib/constant";
import queries from "@/lib/queries";

function AddRegionAdmin() {
  const navigate = useNavigate();

  const createRegionAdmin = queries.useCreateRegionAdminMutation();

  async function handleOnSubmit(values: TRegionAdmin) {
    try {
      await toastPromise(createRegionAdmin.mutateAsync(values), {
        loading: "Creating region admin...",
        success: (res) => {
          if (res) navigate(constant.ROUTING_URLS.REGION_ADMIN);
          return "Region admin created successfully";
        },
        error: (e) =>
          e instanceof AxiosError
            ? e.response?.data?.data?.error || e.response?.data?.message
            : "Opps! Error creating region admin",
      });
    } catch (error) {
      // toastPromise already handled the error message display
      console.error("Save error:", error);
    }
  }
  return (
    <div className="p-6 space-y-6 md:p-8 md:space-y-8">
      <PageHeader
        title="Region Management"
        breadcrumbs={[
          { label: "Home", path: "/" },
          { label: "Region Management" },
          { label: "Add Regional Admin" },
        ]}
        backAction={{
          variant: "outlinePrimary",
          label: "Back",
          icon: <ArrowLeft />,
          link: constant.ROUTING_URLS.REGION_ADMIN,
        }}
      />
      <RegionAdminForm
        title="Create Regional Admin"
        onSubmit={handleOnSubmit}
      />
    </div>
  );
}

export default AddRegionAdmin;
