import { AxiosError } from "axios";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useFetchRegionById } from "@/api";
import { ErrorCard } from "@/components/common/ErrorCard";
import { EmptyDataState } from "@/components/EmptyDataState";
import { PageHeader } from "@/components/layouts/PageHeader";
import RegionForm, {
  type TRegion,
} from "@/components/regionManagement/region/RegionForm";
import { Spinner } from "@/components/Spinner";
import { toastPromise } from "@/hooks/use-toast";
import { constant } from "@/lib/constant";
import queries from "@/lib/queries";

const EditRegionPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isFetching, isError, refetch } = useFetchRegionById(id ?? "");

  const editRegion = queries.useEditRegionMutation();
  async function onSubmit(values: TRegion) {
    try {
      await toastPromise(
        editRegion.mutateAsync({ id: id ?? "", data: values }),
        {
          loading: "Updating region...",
          success: (res) => {
            if (res?.status === true) {
              navigate(constant.ROUTING_URLS.REGION);
            }
            return "Region updated successfully";
          },
          error: (e) =>
            e instanceof Error || e instanceof AxiosError
              ? e.message
              : "Opps! Error updating region",
        },
      );
    } catch (error) {
      // toastPromise already handled the error message display
      console.error("Save error:", error);
    }
  }
  return (
    <div className="p-6 space-y-6 md:p-8 md:space-y-8">
      <PageHeader
        title="Edit Region"
        breadcrumbs={[
          { label: "Home", path: "/" },
          { label: "Region Management" },
          { label: "Regions", path: constant.ROUTING_URLS.REGION },
          { label: "Edit Region" },
        ]}
        backAction={{
          variant: "outlinePrimary",
          label: "Back",
          icon: <ArrowLeft />,
          link: constant.ROUTING_URLS.REGION,
        }}
      />

      {isFetching ? (
        <Spinner />
      ) : isError ? (
        <ErrorCard refetch={refetch} />
      ) : !data || !data.id ? (
        <EmptyDataState
          entityName="Region"
          listRoute={constant.ROUTING_URLS.REGION}
        />
      ) : (
        <RegionForm
          initialData={data}
          title="Edit Region"
          onSubmit={onSubmit}
        />
      )}
    </div>
  );
};

export default EditRegionPage;
