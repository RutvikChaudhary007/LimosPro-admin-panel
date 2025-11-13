// @ts-nocheck

import { ArrowLeft } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import useFetchAllAffiliate from "@/api/getAllAffiliate.api";
import useFetchFleetById from "@/api/getFleetById.api";
import useFetchAllRegions from "@/api/region.api";
import FleetForm from "@/components/fleet/FleetForm";
import Header from "@/components/layouts/BreadCramb";
import { Spinner } from "@/components/Spinner";
import { Button } from "@/components/ui/button";
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
      <Link to={constant.ROUTING_URLS.FLEETS}>
        <Button
          variant="outline"
          className="py-3 px-1.5 rounded bg-[#D9D9D9] w-[80px] h-[31px] flex items-center justify-center cursor-pointer text-[#5A5A5A]"
        >
          <ArrowLeft /> Back
        </Button>
      </Link>
      <Header className="p-4 h-[79px] bg-[#FDFDFD] shadow-base-light mt-4 mb-5">
        <div className="w-full h-full flex items-center justify-between">
          <div>
            <h2 className="font-medium text-xl text-black">Fleet</h2>
            <h4>
              {" "}
              <span className="text-[#959595] w-[116px] h-4 text-xs">
                Fleet
              </span>{" "}
              <span className="text-xs text-[#3A3A3A] w-[50px] h-4">
                / Edit Fleet
              </span>
            </h4>
          </div>
        </div>
      </Header>
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
