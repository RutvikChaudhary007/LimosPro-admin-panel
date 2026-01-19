import { AxiosError } from "axios";
import { ArrowLeft } from "lucide-react";
import { useParams } from "react-router-dom";
import {
  useFetchAllPartner,
  useFetchAllRegions,
  useFetchFleetById,
} from "@/api";
import { ErrorCard } from "@/components/common/ErrorCard";
import { EmptyDataState } from "@/components/EmptyDataState";
import FleetForm from "@/components/fleet/FleetForm";
import { PageHeader } from "@/components/layouts/PageHeader";
import { Spinner } from "@/components/Spinner";
import { toastPromise } from "@/hooks/use-toast";
import { constant } from "@/lib/constant";
import queries from "@/lib/queries";
import type { TFleetData } from "@/types/fleet.type";

const EditFleetPage = () => {
  const { id } = useParams();
  const { data: PartnerData, isFetching: isPartnerFetching } =
    useFetchAllPartner({ DateRange: undefined });
  const { data: RegionData, isFetching: isRegionFetching } = useFetchAllRegions(
    {},
  );
  const { data, isFetching, isError, refetch } = useFetchFleetById({ id: id! });
  const editFleetMutation = queries.useEditfleetMutation();
  const handleEditFleet = async (data: TFleetData) => {
    await toastPromise(editFleetMutation.mutateAsync({ id: id!, data }), {
      loading: "Updating fleet...",
      success: "Fleet updated successfully",
      error: (e) =>
        e instanceof AxiosError
          ? e.response?.data?.data?.error || e.response?.data?.message
          : "Failed to update fleet",
    });
  };

  return (
    <div className="p-6 space-y-6 md:p-8 md:space-y-8">
      <PageHeader
        title="Edit Fleet"
        breadcrumbs={[
          { label: "Home", path: "/" },
          { label: "Fleets", path: constant.ROUTING_URLS.FLEETS },
          { label: "Edit Fleet" },
        ]}
        backAction={{
          variant: "outlinePrimary",
          label: "Back",
          icon: <ArrowLeft />,
          link: constant.ROUTING_URLS.FLEETS,
        }}
      />
      {isFetching ? (
        <Spinner />
      ) : isError ? (
        <ErrorCard refetch={refetch} />
      ) : !data || !data.id ? (
        <EmptyDataState
          entityName="Fleet"
          listRoute={constant.ROUTING_URLS.FLEETS}
        />
      ) : (
        <FleetForm
          initialData={data}
          onSubmit={handleEditFleet}
          isPartnerFetching={isPartnerFetching}
          partnerData={PartnerData}
          RegionData={RegionData}
          isRegionFetching={isRegionFetching}
          type={"Edit Fleet"}
        />
      )}
    </div>
  );
};

export default EditFleetPage;
