import { AxiosError } from "axios";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useFetchRegionAdminById } from "@/api";
import { ErrorCard } from "@/components/common/ErrorCard";
import { EmptyDataState } from "@/components/EmptyDataState";
import { PageHeader } from "@/components/layouts/PageHeader";
import RegionAdminForm, {
  type TRegionAdmin,
} from "@/components/regionManagement/regionAdmin/RegionAdminForm";
import { Spinner } from "@/components/Spinner";
import { toastPromise } from "@/hooks/use-toast";
import { constant } from "@/lib/constant";
import queries from "@/lib/queries";

const EditRegionAdmin = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isFetching, isError, refetch } = useFetchRegionAdminById(
    id ?? "",
  );

  const editRegionAdmin = queries.useEditRegionAdminMutation();

  async function handleOnSubmit(values: TRegionAdmin) {
    try {
      await toastPromise(
        editRegionAdmin.mutateAsync({ id: id ?? "", data: values as any }),
        {
          loading: "Updating regional admin...",
          success: "Regional admin updated successfully",
          error: (e) =>
            e instanceof AxiosError
              ? e.response?.data?.message || e.message
              : "Failed to update regional admin",
        },
      );
      navigate(constant.ROUTING_URLS.REGION_ADMIN);
    } catch (e: any) {
      // toastPromise already handled the error message display
      console.error("Save error:", e);
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
      ) : isError ? (
        <ErrorCard refetch={refetch} />
      ) : !data || !data.id ? (
        <EmptyDataState
          entityName="Regional Admin"
          listRoute={constant.ROUTING_URLS.REGION_ADMIN}
        />
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
