import UsefetchAffiliateById from "@/api/getAffiliateById.api"
import { Spinner } from "@/components/Spinner"
import { ErrorCard } from "@/components/common/ErrorCard"
import PageTitle from "@/components/common/PageTitle"
import Header from "@/components/layouts/Header"
import { getStatusColor } from "@/components/table/column"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { constant } from "@/lib/constant"
import { cn } from "@/lib/utils"
import { env } from "@/utils/env"
import { geoDecoding } from "@/utils/googleMaps"
import { generatePageTitle } from "@/utils/seo"
import { useLoadScript, type Libraries } from "@react-google-maps/api"
import { ArrowLeft } from "lucide-react"
import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"

// const data = {
//     id: 1,
//     email: "name@email.com",
//     phone: "+1-424-231-6798",
//     location: "Company Location",
//     entityType: "Private Limited Company (Pvt Ltd)",
//     address: "123 Main St, Anytown, USA",
//     Documents: ["/4.25x6_Standard_Mailing_Print_Template_Alt.pdf","link 2"]
// }

const showStatus = [
  { label: "Active", value: "active" },
  { label: "Pending", value: "pending" },
  { label: "Inactive", value: "inactive" },
  { label: "Suspended", value: "suspended" },
]
const libraries = ["places", "geocoding"]

const ViewAffiliatePage = () => {
  const [selectedStatus, setSelectedStatus] = useState(showStatus[0])
  const { id } = useParams()
  const [googleMapsApiKey] = useState<string | null>(env!.VITE_GOOGLE_MAP_KEY)
  const [businessAddress, setBusinessAddress] = useState<string | undefined>(undefined)
  // Load Google Maps script
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: googleMapsApiKey || "",
    libraries: libraries as Libraries,
  })

  // console.log("id:",id)
  const { data, isFetching, isError, refetch } = UsefetchAffiliateById({ id })
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
  // console.log("data:",data)
  // if(error) return (<h1>error.message</h1>);
  const documentsLength = data?.documents?.length
  // const docJsx = [];
  const docJsx = [1, 2, 3, 4].map((i) => (
    <div key={i} className="flex items-center gap-6">
      <Label className="block w-[95px] text-sm font-semibold capitalize">Document {i}:</Label>
      <div
        className={cn(
          "flex h-[33px] w-full items-center space-x-5 bg-[#FFFFFF]",
          i > documentsLength && "cursor-no-drop opacity-50"
        )}
      >
        <Label className="inline-block h-5 !w-[70px] rounded bg-[#444444] px-2 py-0.5 text-center text-xs text-white">
          {i <= documentsLength ? "Submitted" : "Pending"}
        </Label>
        <Link
          to={i <= documentsLength ? data?.documents[i - 1]?.fileUrl : "#"}
          rel="noreferrer"
          target="_blank"
        >
          <img src="/document-eye.svg" alt="eye page" />{" "}
        </Link>
        <Link
          to={i <= documentsLength ? data?.documents[i - 1]?.fileUrl : "#"}
          download={i <= documentsLength ? data?.documents[i - 1] : "#"}
          target="_blank"
        >
          <img src="/document-arrow-down.svg" alt="down page" />
        </Link>
      </div>
    </div>
  ))
  if (isError) return <ErrorCard refetch={refetch} />
  // for (let i = 1; i <= 4; i++) {
  //     docJsx.push (
  //         <div key={i} className="flex items-center gap-6">
  //                         <Label className="block text-sm font-semibold capitalize w-[95px] ">Document {i}:</Label>
  //                         <div className={cn("bg-[#FFFFFF] w-full h-[33px] flex items-center space-x-5", i > documentsLength && "opacity-50 cursor-no-drop")} >
  //                         <Label className="inline-block bg-[#444444] text-white px-2 py-0.5 rounded text-xs text-center !w-[70px] h-5">{i<=documentsLength ? "Submitted" : "Pending"}</Label>
  //                         <Link to={i <= documentsLength ? data.Documents[(i - 1)]: "#"} rel="noreferrer" target="_blank"><img src="/document-eye.svg" alt="eye page" /> </Link>
  //                         <Link to={i <= documentsLength ? data.Documents[(i-1)]:"#"} download={i <= documentsLength ? data.Documents[(i-1)]:"#"} target="_blank"><img src="/document-arrow-down.svg" alt="down page" />
  //                         </Link>
  //                         </div>
  //                     </div>
  //     )
  // }
  return (
    <>
      <PageTitle title={generatePageTitle("Affiliate")} />
      <div className="h-[calc(100vh-146px)] overflow-y-scroll px-10 py-6">
        <Link to={constant.ROUTING_URLS.AFFILIATE}>
          <Button
            variant="outline"
            className="flex h-[31px] w-[80px] cursor-pointer items-center justify-center rounded bg-[#D9D9D9] px-1.5 py-3 text-[#5A5A5A]"
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
                <span className="h-4 w-[50px] text-xs text-[#3A3A3A]">/ View Affiliate</span>
              </h4>
            </div>
          </div>
        </Header>
        {isFetching ? (
          <Spinner />
        ) : (
          <Card className="space-y-6 rounded-[6px] bg-[#FDFDFD] px-5 inset-shadow-xs inset-shadow-[#F1F1F1]">
            <CardHeader className="flex h-[55px] w-full items-center justify-between">
              <div className="h-full w-full">
                <h4 className="text-xl font-semibold text-[#000000]">{data?.companyName}</h4>
                <h5 className="font-semibold text-[#5A5A5A]">
                  {data?.user?.firstName} {data?.user?.lastName}
                </h5>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className={`mt-5 flex h-[39px] w-[180px] cursor-pointer items-center justify-between rounded bg-[#FFFFFF] shadow-inner shadow-[#F1F1F1] ${getStatusColor(selectedStatus.label)} ${selectedStatus.label === "Active" && "text-white"}`}
                  >
                    {selectedStatus.label}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className={cn(
                    `w-56 cursor-pointer space-y-1 rounded bg-[#FDFDFD] shadow-inner shadow-[#F1F1F1]`
                  )}
                  align="start"
                >
                  <DropdownMenuGroup>
                    {showStatus.map((option) => (
                      <DropdownMenuItem
                        key={option.value}
                        className={`flex cursor-pointer items-center justify-between bg-[#FFFFFF] ${getStatusColor(option.label)} ${option.label === "Active" && "text-white"}`}
                        onClick={() => setSelectedStatus(option)}
                      >
                        {option.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent className="space-y-6">
              <hr className="h-[1px] w-full bg-[#EEEEEE]" />
              <div className="h-[209px] w-full space-y-4">
                <h6 className="h-[19px] w-full text-sm text-[#5A5A5A]">Company</h6>
                {Object.entries(data as Record<string, React.ReactNode>).map(([key, val]) => {
                  // if (!["email","phone", "location", "entityType", "address"].includes(key.toLowerCase())) return;
                  if (
                    ![
                      "businessemail",
                      "businesscontactnumber",
                      "entitytype",
                      "businessaddress",
                    ].includes(key.toLowerCase())
                  )
                    return
                  return (
                    <div key={key} className="flex items-center gap-6">
                      <Label className="min-w-[158px] text-sm font-semibold capitalize">
                        {key}:
                      </Label>
                      <span className="font-medium text-[#3A3A3A]">
                        {["businessaddress"].includes(key.toLowerCase())
                          ? loadError
                            ? "Error map api loading"
                            : !businessAddress
                              ? "Error fetching address"
                              : businessAddress
                          : val}
                      </span>
                    </div>
                  )
                })}
              </div>
              <hr className="h-[1px] w-full bg-[#EEEEEE]" />
              <div className="h-[215px] w-full">
                <h6 className="h-[19px] w-full text-sm text-[#5A5A5A]">Documents</h6>
                {docJsx}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  )
}

export default ViewAffiliatePage
