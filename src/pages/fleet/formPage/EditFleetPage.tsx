import { AxiosError } from "axios";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useFetchAllPartner,
  useFetchAllRegions,
  useFetchFleetById,
} from "@/api";
import FleetForm from "@/components/fleet/FleetForm";
import { PageHeader } from "@/components/layouts/PageHeader";
import { Spinner } from "@/components/Spinner";
import { toastPromise } from "@/hooks/use-toast";
import { constant } from "@/lib/constant";
import queries from "@/lib/queries";
import type { TFleetData } from "@/types/fleet.type";

const EditFleetPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: PartnerData, isFetching: isPartnerFetching } =
    useFetchAllPartner({ DateRange: undefined });
  const { data: RegionData, isFetching: isRegionFetching } = useFetchAllRegions(
    {},
  );
  const { data, isFetching } = useFetchFleetById({ id: id! });
  const editFleetMutation = queries.useEditfleetMutation();
  const handleEditFleet = async (data: TFleetData) => {
    toastPromise(editFleetMutation.mutateAsync({ id: id!, data }), {
      loading: "Updating fleet...",
      success: (res) => {
        if (res) navigate(constant.ROUTING_URLS.FLEETS);
        return "Fleet updated successfully";
      },
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
