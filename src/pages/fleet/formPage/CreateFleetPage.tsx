import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useFetchAllAffiliate from "@/api/getAllAffiliate.api";
import useFetchAllRegions from "@/api/region.api";
import FleetForm from "@/components/fleet/FleetForm";
import { PageHeader } from "@/components/layouts/PageHeader";
import { toastPromise } from "@/hooks/use-toast";
import { constant } from "@/lib/constant";
import queries from "@/lib/queries";
import type { TFleetData } from "@/types/fleet.type";

const CreateFleetPage = () => {
  const navigate = useNavigate();
  const { data: AffiliateData, isFetching: isAffiliateFetching } =
    useFetchAllAffiliate({ DateRange: undefined });
  const { data: RegionData, isFetching: isRegionFetching } = useFetchAllRegions(
    {},
  );
  const createFleetMutation = queries.useCreatefleetMutation();
  const handleCreateFleet = async (data: TFleetData) => {
    console.log("called handle create fleet!", data);
    try {
      toastPromise(await createFleetMutation.mutateAsync(data), {
        loading: "Creating fleet...",
        success: (res) => {
          if (res) navigate(constant.ROUTING_URLS.FLEETS);
          return "Yeah! fleet created successfully.";
        },
        error: (e) =>
          e instanceof Error ? e.message : "Opps! failed to create fleet.",
      });
    } catch (error) {
      console.error("Error while creating fleet", error);
    }
  };
  return (
    <div className="p-6 space-y-6 md:p-8 md:space-y-8">
      <PageHeader
        title="Create Fleet"
        breadcrumbs={[
          { label: "Home", path: "/" },
          { label: "Fleets", path: constant.ROUTING_URLS.FLEETS },
          { label: "Create Fleet" },
        ]}
        backAction={{
          variant: "outlinePrimary",
          label: "Back",
          icon: <ArrowLeft />,
          link: constant.ROUTING_URLS.FLEETS,
        }}
      />
      <FleetForm
        onSubmit={handleCreateFleet}
        isAffiliateFetching={isAffiliateFetching}
        affiliateData={AffiliateData}
        RegionData={RegionData}
        isRegionFetching={isRegionFetching}
        type={"Create Fleet"}
      />
    </div>
  );
};

export default CreateFleetPage;
