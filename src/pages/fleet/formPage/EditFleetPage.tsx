// @ts-nocheck

import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import useFetchAllAffiliate from "@/api/getAllAffiliate.api";
import useFetchFleetById from "@/api/getFleetById.api";
import useFetchAllRegions from "@/api/region.api";
import FleetForm from "@/components/fleet/FleetForm";
import { PageHeader } from "@/components/layouts/PageHeader";
import { Spinner } from "@/components/Spinner";
import { toastPromise } from "@/hooks/use-toast";
import { constant } from "@/lib/constant";
import queries from "@/lib/queries";
import type { TFleetData } from "@/types/fleet.type";

const _dummnyData = {};
const EditFleetPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: AffiliateData, isFetching: isAffiliateFetching } =
    useFetchAllAffiliate({ DateRange: undefined });
  const { data: RegionData, isFetching: isRegionFetching } = useFetchAllRegions(
    {},
  );
  const { data, isFetching } = useFetchFleetById({ id });
  const editFleetMutation = queries.useEditfleetMutation();
  const handleEditFleet = async (data: TFleetData) => {
    try {
      await toastPromise(editFleetMutation.mutateAsync({ id, data }), {
        loading: "Updating fleet...",
        success: (res) => {
          if (res) navigate(constant.ROUTING_URLS.FLEETS);
          return "Fleet updated successfully";
        },
        error: (e) =>
          e instanceof Error ? e.message : "Failed to update fleet",
      });
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred");
      }
    }
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
        action={{
          variant: "outlineBlack",
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
          isAffiliateFetching={isAffiliateFetching}
          affiliateData={AffiliateData}
          RegionData={RegionData}
          isRegionFetching={isRegionFetching}
          type={"Edit Fleet"}
        />
      )}
    </div>
  );
};

export default EditFleetPage;
