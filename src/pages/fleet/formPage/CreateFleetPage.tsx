
import { createFleet } from "@/api/createFleet.api"
import UsefetchAllAffiliate from "@/api/getAllAffiliate.api"
import useFetchAllRegions from "@/api/getAllRegion.api"
import FleetForm from "@/components/fleet/FleetForm"
import AdminRootLayout from "@/components/layouts/AdminRootLayout"
import Header from "@/components/layouts/Header"
import { Button } from "@/components/ui/button"
import { toastPromise, useToast } from "@/hooks/use-toast"
import { constant } from "@/lib/constant"
import type { TFleetData } from "@/types/fleet"
import type { ApiErrorResponse } from "@/types/global/ErrorResponse"
import { useMutation } from "@tanstack/react-query"
import type { AxiosError } from "axios"
import { ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"

const CreateFleetPage = () => {
  const {toast} = useToast();
  const {data: AffiliateData,isFetching: isAffiliateFetching} = UsefetchAllAffiliate({DateRange: undefined});
  const {data: RegionData, isFetching: isRegionFetching} = useFetchAllRegions({});
  const createFleetMutation = useMutation({
    mutationFn: createFleet,
    onSuccess: ()=>{},
    onError: (err: unknown) => {
      let errorMessage = 'An unexpected error occurred';
      
      if (err && typeof err === 'object' && 'isAxiosError' in err) {
        const axiosError = err as AxiosError<ApiErrorResponse>;
        errorMessage = axiosError.response?.data?.message || axiosError.response?.data?.error || errorMessage;
      }
      
      // Don't show toast for rate limiting
      if (errorMessage.includes("429")) return;
      toast({
        title: "Create fleet failed",
        description: errorMessage,
        variant: "destructive",
      });
    },
  })
    const handleCreateFleet = async (data: TFleetData)=> {
        console.log("called handle create fleet!", data)
        try {
          toastPromise(await createFleetMutation.mutateAsync(data),{
            loading: "Loading...",
            success: "Yeah! fleet created successfully.",
            error: "Opps! failed to create fleet.",
          });      
        } catch (error) {
          console.error("Error while creating fleet", error);
        }
    }
  return (
    <AdminRootLayout>
      <div className='px-10 py-6 h-[calc(100vh-146px)] overflow-y-scroll'>
            <Link to={constant.ROUTING_URLS.FLEETS}>
      <Button variant="outline" className='py-3 px-1.5 rounded bg-[#D9D9D9] w-[80px] h-[31px] flex items-center justify-center cursor-pointer text-[#5A5A5A]'><ArrowLeft/> Back</Button>
            </Link>
      <Header className="p-4 h-[79px] bg-[#FDFDFD] shadow-[0_4px_20px_rgba(0,0,0,0.05)] mt-4 mb-5">
          <div className="w-full h-full flex items-center justify-between">
            <div>
              <h2 className="font-medium text-xl text-black">Fleet</h2>
              <h4> <span className="text-[#959595] w-[116px] h-4 text-xs">Fleet</span> <span className="text-xs text-[#3A3A3A] w-[50px] h-4">/ Create Fleet</span></h4>
            </div>
          </div>
        </Header>
        <FleetForm 
        onSubmit={handleCreateFleet}
        isAffiliateFetching={isAffiliateFetching}
        affiliateData={AffiliateData}
        RegionData={RegionData}
        isRegionFetching={isRegionFetching}
        type={"Create Fleet"} 
        />
      </div>
    </AdminRootLayout>
  )
}

export default CreateFleetPage;
