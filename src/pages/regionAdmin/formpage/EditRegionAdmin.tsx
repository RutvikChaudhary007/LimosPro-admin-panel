import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useFetchRegionAdminById } from "@/api";
import { PageHeader } from "@/components/layouts/PageHeader";
import RegionAdminForm, {
  type TRegionAdmin,
} from "@/components/regionManagement/regionAdmin/RegionAdminForm";
import { Spinner } from "@/components/Spinner";
import { constant } from "@/lib/constant";
import queries from "@/lib/queries";

const EditRegionAdmin = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isFetching } = useFetchRegionAdminById(id ?? "");

  const editRegionAdmin = queries.useEditRegionAdminMutation();

  async function handleOnSubmit(values: TRegionAdmin) {
    if (!id) {
      toast.error("Regional admin id is missing");
      return;
    }

    try {
      await editRegionAdmin.mutateAsync({ id, data: values as any });
      toast.success("Regional admin updated successfully");
      navigate(constant.ROUTING_URLS.REGION_ADMIN);
    } catch (e: any) {
      toast.error(
        e?.response?.data?.message ||
          e?.message ||
          "Failed to update regional admin",
      );
    }
  }
  return (
    <div className="p-6 space-y-6 md:p-8 md:space-y-8">
      <PageHeader
        title="Region Management"
        breadcrumbs={[
          { label: "Home", path: "/" },
          { label: "Region Management" },
          { label: "Edit Regional Admin" },
        ]}
        backAction={{
          variant: "outlinePrimary",
          label: "Back",
          icon: <ArrowLeft />,
          link: constant.ROUTING_URLS.REGION_ADMIN,
        }}
      />

      {isFetching ? (
        <Spinner />
      ) : (
        <RegionAdminForm
          initialData={data}
          title="Edit Regional Admin"
          onSubmit={handleOnSubmit}
        />
      )}
    </div>
  );
};

export default EditRegionAdmin;
