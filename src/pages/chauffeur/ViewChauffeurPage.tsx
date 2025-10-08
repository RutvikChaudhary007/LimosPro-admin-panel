import {useFetchChauffeurById} from "@/api/chauffeur.api";
import { Spinner } from "@/components/Spinner";
import AdminRootLayout from "@/components/layouts/AdminRootLayout"
import Header from "@/components/layouts/Header";
import { getStatusColor } from "@/components/table/column";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { constant } from "@/lib/constant";
import { cn } from "@/lib/utils";
import { geoDecoding } from "@/utils/googleMaps";
import { useLoadScript, type Libraries } from "@react-google-maps/api";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

// const data = {
//     id: "e3848306-8768-478e-987e-f6e85fa5959e",
//     userId: "b587ee6a-e6e3-4c65-9e11-78dfb77d038d",
//     affiliateId: "e621b9aa-b4d9-4722-a21f-9e21efd3a768",
//     panNumber: "chauffeur_pan_1",
//     licenseNumber: "license_number_1",
//     vehicleId: "f14fd6ec-2490-46d6-affe-495f384d46ab",
//     user: {
//         firstName: "",
//         lastName: "",
//         email: "name@email.com"
//     },
//     businessContactNumber: "+1-424-231-6798",
//     documents: [
//         {
//             fileUrl: "https://qb-nauticalnode.s3.ap-south-1.amazonaws.com/chauffeurs/1746447580301-seller3.png",
//             originalName: "seller3.png",
//             mimetype: "image/png",
//             size: 406576
//         }
//     ],
//     availability: true,
//     location: "California",
//     status: "Active",
//     rating: "5.00",
//     createdAt: "2025-05-05T12:19:41.972Z",
//     updatedAt: "2025-05-05T12:19:41.972Z",
//     vehicle: {
//         id: "f14fd6ec-2490-46d6-affe-495f384d46ab",
//         affiliateId: "ee23cf74-f063-4f45-ad59-524df3fb8716",
//         plateNumber: "123459",
//         brand: "Miss",
//         model: "2017",
//         year: 2025,
//         color: "red",
//         capacity: 4,
//         vehicleType: "Executive Sedan Fit for 3 Passengers",
//         documents: [
//             {
//                 fileUrl: "https://qb-nauticalnode.s3.ap-south-1.amazonaws.com/chauffeurs/1746453402600-resume_sample_student8ea47e04a8fe67e6b7acff0000376a3b.pdf",
//                 originalName: "resume_sample_student8ea47e04a8fe67e6b7acff0000376a3b.pdf",
//                 mimetype: "application/pdf",
//                 size: 120009
//             }
//         ],
//         createdAt: "2025-05-05T12:12:03.865Z",
//         updatedAt: "2025-05-05T12:12:03.865Z",
//         deletedAt: null
//     }
// }

const showStatus = [
    { label: 'Active', value: 'active' },
    { label: 'Pending', value: 'pending' },
    { label: 'Inactive', value: 'inactive' },
    { label: 'Suspended', value: 'suspended' },
];

const libraries = ["places", "geocoding"];

const ViewChauffeurPage = () => {
    const { id } = useParams();
    const [googleMapsApiKey] = useState<string | null>(import.meta.env.VITE_GOOGLE_MAP_KEY);
    const [selectedStatus, setSelectedStatus] = useState(showStatus[0]);
    const [isaddress, setAddress] = useState<string | undefined>(undefined);
    const { data, isFetching } = useFetchChauffeurById({ id: id! });
    // Load Google Maps script
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: googleMapsApiKey || "",
        libraries: libraries as Libraries,
    });
    // Initialize Places Autocomplete
    useEffect(() => {
        let isMounted = true;

        const fetchAddress = async () => {
            if (isLoaded && data && !loadError) {
                try {
                    const address = await geoDecoding({
                        lat: data?.location?.latitude,
                        lng: data?.location?.longitude,
                    });

                    if (isMounted) {
                        console.log("Decoded Address:", address);
                        if (address) {
                            setAddress(address as string);
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

    // if (isFetching) return (<p>Loading...</p>);
    // if (error) return (<h1>{error.message}</h1>);
    const documentsLength = data?.documents?.length || 0;
    // const docJsx = [];
    const docJsx = [1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-center gap-6">
            <Label className="block text-sm font-semibold capitalize w-[95px] min-w-[158px]">Document {i}:</Label>
            <div className={cn("bg-[#FFFFFF] w-full h-[33px] flex items-center space-x-5", i > documentsLength && "opacity-50 cursor-no-drop")} >
                <Label className="inline-block bg-[#444444] text-white px-2 py-0.5 rounded text-xs text-center !w-[70px] h-5">{i <= documentsLength ? "Submitted" : "Pending"}</Label>
                <Link to={i <= documentsLength ? data.documents[(i - 1)]?.fileUrl : "#"} rel="noreferrer" target="_blank"><img src="/document-eye.svg" alt="eye page" /> </Link>
                <Link to={i <= documentsLength ? data.documents[(i - 1)]?.fileUrl : "#"} download={i <= documentsLength ? data.documents[(i - 1)]?.fileUrl : "#"} target="_blank"><img src="/document-arrow-down.svg" alt="down page" />
                </Link>
            </div>
        </div>
    ));
    return (
        <AdminRootLayout>
            <div className='px-10 py-6 h-[calc(100vh-146px)] overflow-y-scroll'>
                <Link to={constant.ROUTING_URLS.CHAUFFEUR}>
                    <Button variant="outline" className='py-3 px-1.5 rounded bg-[#D9D9D9] w-[80px] h-[31px] flex items-center justify-center cursor-pointer text-[#5A5A5A]'><ArrowLeft /> Back</Button>
                </Link>
                <Header className="p-4 h-[79px] bg-[#FDFDFD] shadow-[0_4px_20px_rgba(0,0,0,0.05)] mt-4 mb-5">
                    <div className="w-full h-full flex items-center justify-between">
                        <div>
                            <h2 className="font-medium text-xl text-black">Chauffeur</h2>
                            <h4> <span className="text-[#959595] w-[116px] h-4 text-xs">Chauffeur</span> <span className="text-xs text-[#3A3A3A] w-[50px] h-4">/ View Chauffeur</span></h4>
                        </div>
                    </div>
                </Header>
                {isFetching? (<Spinner/>):(
                    <Card className="inset-shadow-xs inset-shadow-[#F1F1F1] bg-[#FDFDFD] rounded-[6px] px-5 space-y-6">
                    <CardHeader className="w-full h-[55px] flex items-center justify-between">
                        <div className="w-full h-full">
                            <h4 className="font-semibold text-xl text-[#000000]">{data?.userFirstName} {data?.userLastName}</h4>
                            <h5 className="text-[#5A5A5A] font-semibold">Location: {loadError ? "Error map api loading" : (!isaddress ? "Error fetching address": isaddress) }</h5>
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
                        <hr className="w-full h-[1px] bg-[#EEEEEE]" />
                        <div className="w-full h-[95px] space-y-4">
                            <h6 className="text-sm text-[#5A5A5A] h-[19px] w-full">Contact Details</h6>
                            <div className="flex items-center gap-6">
                                <Label className="text-sm font-semibold capitalize min-w-[158px]">Email:</Label>
                                <span className="text-[#3A3A3A] font-medium">{data?.userEmail}</span>
                            </div>
                            <div className="flex items-center gap-6">
                                <Label className="text-sm font-semibold capitalize min-w-[158px]">Phone:</Label>
                                <span className="text-[#3A3A3A] font-medium">{data?.userPhoneNumber}</span>
                            </div>

                        </div>
                        <hr className="w-full h-[1px] bg-[#EEEEEE]" />
                        <div className="w-full h-[22px] flex items-center gap-6">
                            <Label className="text-sm font-semibold capitalize min-w-[158px]">
                                Vehicle ID:
                            </Label>
                            <span className="text-[#3A3A3A] font-medium">{data?.vehicleId}</span>
                        </div>
                        <hr className="w-full h-[1px] bg-[#EEEEEE]" />
                        <div className="w-full  space-y-4">
                            <div className="w-full h-[22px] flex items-center gap-6">
                                <Label className="text-sm font-semibold capitalize w-[80px] min-w-[158px]">
                                    Pan:
                                </Label>
                                <span className="text-[#3A3A3A] font-medium">{data?.panNumber}</span>
                            </div>
                            <div className="w-full h-[22px] flex items-center gap-6">
                                <Label className="text-sm font-semibold capitalize w-[80px] min-w-[158px]">
                                    License:
                                </Label>
                                <span className="text-[#3A3A3A] font-medium">{data?.licenseNumber}</span>
                            </div>
                        </div>
                        <hr className="w-full h-[1px] bg-[#EEEEEE]" />
                        <div className="w-full h-[215px]">
                            <h6 className="text-sm text-[#5A5A5A] h-[19px] w-full">Documents</h6>
                            {docJsx}
                        </div>
                    </CardContent>
                </Card>
                )}
                
            </div>
        </AdminRootLayout>
    )
}

export default ViewChauffeurPage
