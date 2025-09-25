
import UsefetchChauffeurById from "@/api/getChauffeurById"
import ChauffeurForm, { type TChauffeurForm } from "@/components/chauffeur/ChauffeurForm"
import AdminRootLayout from "@/components/layouts/AdminRootLayout"
import Header from "@/components/layouts/Header"
import { Button } from "@/components/ui/button"
import { constant } from "@/lib/constant"
import { ArrowLeft } from "lucide-react"
import { Link, useParams } from "react-router-dom"
import { geoDecoding } from "@/utils/googleMaps";
import { useLoadScript, type Libraries } from "@react-google-maps/api";
import { useCallback, useEffect, useMemo, useState } from "react"

// Define libraries outside component to prevent unnecessary re-renders
const libraries: Libraries = ["places", "geocoding"];

const EditChauffeurPage = () => {
  const { id } = useParams();
  const googleMapsApiKey = useMemo(() => import.meta.env.VITE_GOOGLE_MAP_KEY as string, []);
  const { data, isFetching, error } = UsefetchChauffeurById({ id: id! });
  const [address, setAddress] = useState<string | undefined>(undefined);
  
  // Load Google Maps script
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: googleMapsApiKey || "",
    libraries,
  });
  
  // Geocode location to address
  useEffect(() => {
    if (!isLoaded || !data?.location?.latitude || loadError) return;
    
    let cancelled = false;
    
    geoDecoding({
      lat: data.location.latitude,
      lng: data.location.longitude,
    }).then(decoded => {
      if (!cancelled && decoded) setAddress(decoded as string);
    }).catch(err => {
      console.error("Geocoding error:", err);
    });
    
    return () => { cancelled = true; };
  }, [isLoaded, loadError, data?.location?.latitude, data?.location?.longitude]);
  
  // Prepare form data with address
  const initialFormData = useMemo(() => {
    if (!data) return undefined;
    return { ...data, businessAddress: address };
  }, [data, address]);

  // Handle form submission
  const handleEditChauffeur = useCallback(async (formData: TChauffeurForm) => {
    console.log("called handle edit chauffeur!");
    try {
      return new Promise((res) => setTimeout(() => res(console.log(formData)), 3000));
    } catch (err) {
      console.error("Error updating chauffeur:", err);
      throw err;
    }
  }, []);

  // Loading state
  if (isFetching) return <p>Loading...</p>;
  
  // Error handling
  if (error) {
    console.error("Error fetching chauffeur:", error);
    return <p>Error loading chauffeur data. Please try again.</p>;
  }
  
  return (
    <AdminRootLayout>
      <div className='px-10 py-6 h-[calc(100vh-146px)] overflow-y-scroll'>
        <Link to={constant.ROUTING_URLS.CHAUFFEUR}>
          <Button 
            variant="outline" 
            className='py-3 px-1.5 rounded bg-[#D9D9D9] w-[80px] h-[31px] flex items-center justify-center cursor-pointer text-[#5A5A5A]'
          >
            <ArrowLeft/> Back
          </Button>
        </Link>
        <Header className="p-4 h-[79px] bg-[#FDFDFD] shadow-[0_4px_20px_rgba(0,0,0,0.05)] mt-4 mb-5">
          <div className="w-full h-full flex items-center justify-between">
            <div>
              <h2 className="font-medium text-xl text-black">Chauffeur</h2>
              <h4>
                <span className="text-[#959595] w-[116px] h-4 text-xs">Chauffeur</span>
                <span className="text-xs text-[#3A3A3A] w-[50px] h-4">/ Edit Chauffeur</span>
              </h4>
            </div>
          </div>
        </Header>
        <ChauffeurForm 
          onSubmit={handleEditChauffeur}
          type="Edit Chauffeur"
          initialData={initialFormData}
        />
      </div>
    </AdminRootLayout>
  );
}

export default EditChauffeurPage
