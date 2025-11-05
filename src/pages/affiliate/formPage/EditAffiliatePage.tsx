import { useFetchAffiliateById } from "@/api/affiliate.api"
import AffiliateForm from "@/components/affiliate/AffiliateForm"
import Header from "@/components/layout/Header"
import { Button } from "@/components/ui/button"
import { toastPromise } from "@/hooks/use-toast"
import { constant } from "@/lib/constant"
import queries from "@/lib/queries"
import { env } from "@/utils/env"
import { geoDecoding } from "@/utils/googleMaps"
import { useLoadScript, type Libraries } from "@react-google-maps/api"
import { ArrowLeft } from "lucide-react"
import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"

const libraries = ["places", "geocoding"]

function EditAffiliatePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  // console.log("id:",id)
  const [googleMapsApiKey] = useState<string | null>(env?.VITE_GOOGLE_MAP_KEY ?? null)
  const [businessAddress, setBusinessAddress] = useState<string | undefined>(undefined)
  // Load Google Maps script
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: googleMapsApiKey || "",
    libraries: libraries as Libraries,
  })

  const { data, isFetching } = useFetchAffiliateById({ id })
  // Initialize Places Autocomplete
  useEffect(() => {
    let isMounted = true

    const fetchAddress = async () => {
      if (isLoaded && data && !loadError) {
        try {
          const address = await geoDecoding({
            lat: data?.businessLocation?.latitude,
            lng: data?.businessLocation?.longitude,
          })
          if (isMounted) {
            console.log("Decoded Address:", address)
            if (address) {
              setBusinessAddress(address as string)
            }
          }
        } catch (err) {
          console.error("Geocoding failed:", err)
        }
      }
    }

    fetchAddress()

    return () => {
      isMounted = false
    }
  }, [isLoaded, loadError, data])
  const editAffiliateMutation = queries.useEditAffiliateMutation()
  const handleEditAffiliate = async (data: object) => {
    // console.log("called handleCreateAffiliate")
    try {
      toastPromise(editAffiliateMutation.mutateAsync({ data, id }), {
        loading: "Updating affiliate...",
        success: (res) => {
          if (res) navigate(constant.ROUTING_URLS.AFFILIATE)
          return "Yeah! Affiliate updated successfully"
        },
        error: (e) => (e instanceof Error ? e.message : "Opps! failed to update affiliate."),
      })
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error("An unexpected error occurred")
      }
    }
    // return await new Promise((res)=>{
    //   setTimeout(()=>res(console.log("promise:",data)),5000);
    // });
  }

  if (isFetching) return <p>Loading...</p>
  return (
    <div className="h-[calc(100vh-146px)] overflow-y-scroll px-10 py-6">
      <Link to={constant.ROUTING_URLS.AFFILIATE}>
        <Button
          variant="outlineBlack"
          className="flex w-20 cursor-pointer items-center justify-center rounded bg-[#D9D9D9] px-1.5 py-3 text-[#5A5A5A]"
        >
          <ArrowLeft /> Back
        </Button>
      </Link>
      <Header className="mt-4 mb-5 h-[79px] bg-[#FDFDFD] p-4 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
        <div className="flex h-full w-full items-center justify-between">
          <div>
            <h2 className="text-xl font-medium text-black">Affiliate</h2>
            <h4>
              {" "}
              <span className="h-4 w-[116px] text-xs text-[#959595]">LIMOSPRO</span>{" "}
              <span className="h-4 w-[50px] text-xs text-[#3A3A3A]">/ Edit Affiliate</span>
            </h4>
          </div>
        </div>
      </Header>
      <AffiliateForm
        onSubmit={handleEditAffiliate}
        initialData={data}
        businessAddress={businessAddress}
        type={"Edit Affiliate"}
      />
    </div>
  )
}

export default EditAffiliatePage
