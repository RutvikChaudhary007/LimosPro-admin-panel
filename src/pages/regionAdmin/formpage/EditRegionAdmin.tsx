import { ArrowLeft } from "lucide-react";
import { useParams } from "react-router-dom";
import { useFetchRegionAdminById } from "@/api";
import { PageHeader } from "@/components/layouts/PageHeader";
import RegionAdminForm, {
  type TRegionAdmin,
} from "@/components/regionManagement/regionAdmin/RegionAdminForm";
import { Spinner } from "@/components/Spinner";
import { constant } from "@/lib/constant";

const EditRegionAdmin = () => {
  const { id } = useParams();
  const { data, isFetching } = useFetchRegionAdminById(id ?? "");

  async function handleOnSubmit(values: TRegionAdmin) {
    await new Promise((res) => setTimeout(res, 1200)); // artificial delay to notice isSubmitting
    console.log("data:", values);
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
