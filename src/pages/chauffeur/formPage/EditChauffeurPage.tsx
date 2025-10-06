import ChauffeurForm, { type TChauffeurForm } from "@/components/chauffeur/ChauffeurForm"
import AdminRootLayout from "@/components/layouts/AdminRootLayout"
import Header from "@/components/layouts/Header"
import { Button } from "@/components/ui/button"
import { constant } from "@/lib/constant"
import { ArrowLeft } from "lucide-react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { geoDecoding } from "@/utils/googleMaps";
import { useLoadScript, type Libraries } from "@react-google-maps/api";
import {  useEffect, useMemo, useState } from "react"
import { Spinner } from "@/components/Spinner"
import queries from "@/lib/queries"
import { toastPromise, useToast } from "@/hooks/use-toast"
import useFetchChauffeurById from "@/api/getChauffeurById.api"

// const initialData: TChauffeurForm = {
//     id: "e3848306-8768-478e-987e-f6e85fa5959e",
//     userId: "b587ee6a-e6e3-4c65-9e11-78dfb77d038d",
//     affiliateId: "e621b9aa-b4d9-4722-a21f-9e21efd3a768",
//     panNumber: "chauffeur_pan_1",
//     licenseNumber: "license_number_1",
//     vehicleId: "f14fd6ec-2490-46d6-affe-495f384d46ab",
//     user: {
//           firstName: "akbarbbdf",
//           lastName: "Bhoraniyabbdf",
//           email: "akbar.bhoranbbiydfa@qalbit.com"
//       },
//     documents: [
//       {
//         fileUrl: "https://qb-nauticalnode.s3.ap-south-1.amazonaws.com/chauffeurs/1746447580301-seller3.png",
//         originalName: "seller3.png",
//         mimetype: "image/png",
//         size: 406576
//       }
//     ],
//     availability: true,
//     location: {
//       latitude: 28.6139,
//       longitude: 77.209
//     },
//     status: "Active",
//     rating: "5.00",
//     createdAt: "2025-05-05T12:19:41.972Z",
//     updatedAt: "2025-05-05T12:19:41.972Z",
//     vehicle: {
//       id: "f14fd6ec-2490-46d6-affe-495f384d46ab",
//       affiliateId: "ee23cf74-f063-4f45-ad59-524df3fb8716",
//       plateNumber: "123459",
//       brand: "Miss",
//       model: "2017",
//       year: 2025,
//       color: "red",
//       capacity: 4,
//       vehicleType: "Executive Sedan Fit for 3 Passengers",
//       documents: [
//         {
//           fileUrl: "https://qb-nauticalnode.s3.ap-south-1.amazonaws.com/chauffeurs/1746453402600-resume_sample_student8ea47e04a8fe67e6b7acff0000376a3b.pdf",
//           originalName: "resume_sample_student8ea47e04a8fe67e6b7acff0000376a3b.pdf",
//           mimetype: "application/pdf",
//           size: 120009
//         }
//       ],
//       createdAt: "2025-05-05T12:12:03.865Z",
//       updatedAt: "2025-05-05T12:12:03.865Z",
//       deletedAt: null
//     }
//     }

    const libraries = ["places", "geocoding"];
const EditChauffeurPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const googleMapsApiKey = useMemo(() => import.meta.env.VITE_GOOGLE_MAP_KEY as string, []);
  // const [data, setData] = useState(initialData);
  // const isFetching = false;
  const { data, isFetching } = useFetchChauffeurById({ id: id! });
  const [address, setAddress] = useState<string | undefined>(undefined);
  
  // Load Google Maps script
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: googleMapsApiKey || "",
        libraries: libraries as Libraries,
    });
  
    // Initialize Places Autocomplete
    useEffect(() => {
      if (isLoaded && data && !loadError) {
        let cancelled = false;
        geoDecoding({
          lat: data?.location?.latitude,
          lng: data?.location?.longitude,
        }).then(decoded => {
          if (!cancelled && decoded) setAddress(decoded as string);
        });
        return () => { cancelled = true; };
      }
    }, [isLoaded, loadError, data?.location?.latitude, data?.location?.longitude]);
    
     // Place this after you have both `data` and `address`
  const initialFormData = useMemo(() => {
    if (!data) return undefined;
    return { ...data, businessAddress: address };
  }, [data, address]);

    // useEffect(() => {
    //     let isMounted = true;

    //     const fetchAddress = async () => {
    //         if (isLoaded && data && !loadError) {
    //             try {
    //                 const address = await geoDecoding({
    //                     lat: data?.location?.latitude,
    //                     lng: data?.location?.longitude,
    //                 });

    //                 if (isMounted) {
    //                     console.log("Decoded Address:", address);
    //                     if (address) {
    //                         setAddress(address as string);
    //                         // data["Address"] = address;
    //                     }
    //                 }
    //             } catch (err) {
    //                 console.error("Geocoding failed:", err);
    //             }
    //         }
    //     };

    //     fetchAddress();

    //     return () => {
    //         isMounted = false;
    //     };
    // }, [isLoaded, loadError, data]);
  // if (isFetching) return (<p>Loading...</p>);
  const {toast} = useToast();
  const editChauffeurMutation = queries.useEditChauffeurMutation();
  const handleEditChauffeur = async (data: FormData)=>{
          console.log("called handle edit chauffeur!")
          // return new Promise((res)=>setTimeout(()=>res(console.log(data)),3000));
          try {
           toastPromise(editChauffeurMutation.mutateAsync({data,id}),{
            loading: "Updating Chauffeur...",
            success: (res)=>{
              if(res) navigate(constant.ROUTING_URLS.CHAUFFEUR)
                return "Yeah! Chauffeur updated successfully."
            },
            error: (e)=> (e instanceof Error) ? e.message : "Opps! failed to update chauffeur",
           }) 
          } catch (error) {
            if(error instanceof Error){
              toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
              });
            }else{
             toast({
                title: "Error",
                description: "An unexpected error occurred",
                variant: "destructive",
              });
          }
          }
  }
    
  return (
    <AdminRootLayout>
      <div className='px-10 py-6 h-[calc(100vh-146px)] overflow-y-scroll'>
            <Link to={constant.ROUTING_URLS.CHAUFFEUR}>
      <Button variant="outline" className='py-3 px-1.5 rounded bg-[#D9D9D9] w-[80px] h-[31px] flex items-center justify-center cursor-pointer text-[#5A5A5A]'><ArrowLeft/> Back</Button>
            </Link>
      <Header className="p-4 h-[79px] bg-[#FDFDFD] shadow-[0_4px_20px_rgba(0,0,0,0.05)] mt-4 mb-5">
          <div className="w-full h-full flex items-center justify-between">
            <div>
              <h2 className="font-medium text-xl text-black">Chauffeur</h2>
              <h4> <span className="text-[#959595] w-[116px] h-4 text-xs">Chauffeur</span> <span className="text-xs text-[#3A3A3A] w-[50px] h-4">/ Edit Chauffeur</span></h4>
            </div>
          </div>
        </Header>
        {isFetching ? (<Spinner/>): (
          <ChauffeurForm 
        onSubmit={handleEditChauffeur}
        type={"Edit Chauffeur"} 
        initialData={initialFormData}
        />
        )}
      
      </div>
    </AdminRootLayout>
  )
}

export default EditChauffeurPage
