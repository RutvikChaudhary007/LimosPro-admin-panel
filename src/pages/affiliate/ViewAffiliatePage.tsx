import UsefetchAffiliateById from "@/api/getAffiliateById.api"
import { Spinner } from "@/components/Spinner"
import PageTitle from "@/components/common/PageTitle"
import Header from "@/components/layouts/Header"
import { getStatusColor } from "@/components/table/column"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { constant } from "@/lib/constant"
import { cn } from "@/lib/utils"
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
  { label: 'Active', value: 'active' },
  { label: 'Pending', value: 'pending' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'Suspended', value: 'suspended' },
];
const libraries = ["places", "geocoding"];

const ViewAffiliatePage = () => {
    const [selectedStatus, setSelectedStatus] = useState(showStatus[0]);
    const { id } = useParams(); 
 const [googleMapsApiKey] = useState<string | null>(import.meta.env.VITE_GOOGLE_MAP_KEY);
    const [businessAddress, setBusinessAddress] = useState<string | undefined>(undefined);
    // Load Google Maps script
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: googleMapsApiKey || "",
        libraries: libraries as Libraries,
    });

    // console.log("id:",id)
    const {data,isFetching} = UsefetchAffiliateById({id});
     // Initialize Places Autocomplete
    useEffect(() => {
        let isMounted = true;

        const fetchAddress = async () => {
            if (isLoaded && data && !loadError) {
                try {
                    const address = await geoDecoding({
                        lat: data?.businessLocation?.latitude,
                        lng: data?.businessLocation?.longitude,
                    });
                    if (isMounted) {
                        console.log("Decoded Address:", address);
                        if (address) {
                            setBusinessAddress(address as string);
                        }
                       
                    }
                } catch (err) {
                    console.error("Geocoding failed:", err);
                }
            }
        };

        fetchAddress();

        return () => {
            isMounted = false;
        };
    }, [isLoaded, loadError, data]);
    // console.log("data:",data)
    // if(error) return (<h1>error.message</h1>);
    const documentsLength = data?.documents?.length
    // const docJsx = [];
    const docJsx=[1,2,3,4].map((i)=>(
      <div key={i} className="flex items-center gap-6">
                            <Label className="block text-sm font-semibold capitalize w-[95px] ">Document {i}:</Label>
                            <div className={cn("bg-[#FFFFFF] w-full h-[33px] flex items-center space-x-5", i > documentsLength && "opacity-50 cursor-no-drop")} >
                            <Label className="inline-block bg-[#444444] text-white px-2 py-0.5 rounded text-xs text-center !w-[70px] h-5">{i<=documentsLength ? "Submitted" : "Pending"}</Label>
                            <Link to={i <= documentsLength ? data?.documents[(i - 1)]?.fileUrl: "#"} rel="noreferrer" target="_blank"><img src="/document-eye.svg" alt="eye page" /> </Link>
                            <Link to={i <= documentsLength ? data?.documents[(i-1)]?.fileUrl:"#"} download={i <= documentsLength ? data?.documents[(i-1)]:"#"} target="_blank"><img src="/document-arrow-down.svg" alt="down page" />
                            </Link>
                            </div>
                        </div>
    ));

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
            <div className='px-10 py-6 h-[calc(100vh-146px)] overflow-y-scroll'>
            <Link to={constant.ROUTING_URLS.AFFILIATE}>
      <Button variant="outline" className='py-3 px-1.5 rounded bg-[#D9D9D9] w-[80px] h-[31px] flex items-center justify-center cursor-pointer text-[#5A5A5A]'><ArrowLeft/> Back</Button>
            </Link>
      <Header className="p-4 h-[79px] bg-[#FDFDFD] shadow-[0_4px_20px_rgba(0,0,0,0.05)] mt-4 mb-5">
          <div className="w-full h-full flex items-center justify-between">
            <div>
              <h2 className="font-medium text-xl text-black">Affiliate</h2>
              <h4> <span className="text-[#959595] w-[116px] h-4 text-xs">LIMOSPRO</span> <span className="text-xs text-[#3A3A3A] w-[50px] h-4">/ View Affiliate</span></h4>
            </div>
          </div>
        </Header>
        {isFetching? (<Spinner/>):(<Card className="inset-shadow-xs inset-shadow-[#F1F1F1] bg-[#FDFDFD] rounded-[6px] px-5 space-y-6">
        <CardHeader className="w-full h-[55px] flex items-center justify-between">
            <div className="w-full h-full">
                <h4 className="font-semibold text-xl text-[#000000]">{data?.companyName}</h4>
                <h5 className="text-[#5A5A5A] font-semibold">{data?.user?.firstName} {data?.user?.lastName}</h5>
            </div>
            <DropdownMenu >
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className={`w-[180px] h-[39px] flex items-center justify-between rounded mt-5 shadow-inner shadow-[#F1F1F1] cursor-pointer bg-[#FFFFFF] ${getStatusColor(selectedStatus.label)} ${selectedStatus.label === "Active" && "text-white"}`}>
                {selectedStatus.label}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className={cn(`w-56 bg-[#FDFDFD] shadow-inner shadow-[#F1F1F1] cursor-pointer rounded space-y-1`,
                
            )} align="start">
              <DropdownMenuGroup>
                {showStatus.map(option => (
                  <DropdownMenuItem
                    key={option.value}
                    className={`flex items-center justify-between cursor-pointer bg-[#FFFFFF] ${getStatusColor(option.label)} ${option.label === "Active" && "text-white"}`}
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
            <hr className="w-full h-[1px] bg-[#EEEEEE]"/>
            <div className="w-full h-[209px] space-y-4">
                <h6 className="text-sm text-[#5A5A5A] h-[19px] w-full">Company</h6>
                {Object.entries(data as Record<string, React.ReactNode>).map(([key,val])=>{
                    // if (!["email","phone", "location", "entityType", "address"].includes(key.toLowerCase())) return;
                    if (!["businessemail","businesscontactnumber",  "entitytype", "businessaddress"].includes(key.toLowerCase())) return;
                  return  (
                    <div key={key} className="flex items-center gap-6">
                    <Label className="text-sm font-semibold capitalize min-w-[158px]">{key}:</Label>
                    <span className="text-[#3A3A3A] font-medium">{["businessaddress"].includes(key.toLowerCase()) ? loadError ? "Error map api loading" : (!businessAddress ? "Error fetching address": businessAddress) : val}</span>
                </div>
                )})}
            </div>
            <hr className="w-full h-[1px] bg-[#EEEEEE]"/>
            <div className="w-full h-[215px]">
                <h6 className="text-sm text-[#5A5A5A] h-[19px] w-full">Documents</h6>
                {docJsx}
            </div>
        </CardContent>
        </Card>)}
        
      </div>
    </>
  )
}

export default ViewAffiliatePage
