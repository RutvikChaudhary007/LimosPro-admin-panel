// @ts-nocheck

import { useFetchChauffeurById } from "@/api/chauffeur.api";
import ChauffeurForm from "@/components/chauffeur/ChauffeurForm";
import type { TCrewMemberForm } from "@/components/crewMember/crewMemberForm";
import Header from "@/components/layouts/BreadCramb";
import { Spinner } from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { toastPromise, useToast } from "@/hooks/use-toast";
import { constant } from "@/lib/constant";
import queries from "@/lib/queries";
import { env } from "@/utils/env";
import { geoDecoding } from "@/utils/googleMaps";
import { type Libraries, useLoadScript } from "@react-google-maps/api";
import { ArrowLeft } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

const libraries = ["places", "geocoding"];
const EditChauffeurPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const googleMapsApiKey = useMemo(() => env.VITE_GOOGLE_MAP_KEY as string, []);
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
      }).then((decoded) => {
        if (!cancelled && decoded) setAddress(decoded as string);
      });
      return () => {
        cancelled = true;
      };
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
  const { toast } = useToast();
  const editChauffeurMutation = queries.useEditChauffeurMutation();
  const handleEditChauffeur = async (data: TCrewMemberForm) => {
    console.log("called handle edit chauffeur!");
    // return new Promise((res)=>setTimeout(()=>res(console.log(data)),3000));
    try {
      toastPromise(
        editChauffeurMutation.mutateAsync({
          data: data as TCrewMemberForm,
          id,
        }),
        {
          loading: "Updating Chauffeur...",
          success: (res) => {
            if (res) navigate(constant.ROUTING_URLS.CHAUFFEUR);
            return "Yeah! Chauffeur updated successfully.";
          },
          error: (e) => (e instanceof Error ? e.message : "Opps! failed to update chauffeur"),
        },
      );
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <>
      <div className="p-6 space-y-6 md:p-8 md:space-y-8">
        <Link to={constant.ROUTING_URLS.CHAUFFEUR}>
          <Button
            variant="outline"
            className="py-3 px-1.5 rounded bg-[#D9D9D9] w-[80px] h-[31px] flex items-center justify-center cursor-pointer text-[#5A5A5A]"
          >
            <ArrowLeft /> Back
          </Button>
        </Link>
        <Header className="p-4 h-[79px] bg-[#FDFDFD] shadow-[0_4px_20px_rgba(0,0,0,0.05)] mt-4 mb-5">
          <div className="w-full h-full flex items-center justify-between">
            <div>
              <h2 className="font-medium text-xl text-black">Chauffeur</h2>
              <h4>
                {" "}
                <span className="text-[#959595] w-[116px] h-4 text-xs">Chauffeur</span>{" "}
                <span className="text-xs text-[#3A3A3A] w-[50px] h-4">/ Edit Chauffeur</span>
              </h4>
            </div>
          </div>
        </Header>
        {isFetching ? (
          <Spinner />
        ) : (
          <ChauffeurForm onSubmit={handleEditChauffeur} type={"Edit Chauffeur"} initialData={initialFormData} />
        )}
      </div>
    </>
  );
};

export default EditChauffeurPage;
