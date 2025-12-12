import { type Libraries, useLoadScript } from "@react-google-maps/api";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useFetchAffiliateById } from "@/api";
import AffiliateForm from "@/components/affiliate/AffiliateForm";
import PageTitle from "@/components/common/PageTitle";
import { PageHeader } from "@/components/layouts/PageHeader";
import { Spinner } from "@/components/Spinner";
import { toastPromise } from "@/hooks/use-toast";
import { constant } from "@/lib/constant";
import queries from "@/lib/queries";
import { env } from "@/utils/env";
import { geoDecoding } from "@/utils/googleMaps";
import { generatePageTitle } from "@/utils/seo";

const libraries = ["places", "geocoding"];

function EditAffiliatePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  // console.log("id:",id)
  const [googleMapsApiKey] = useState<string | null>(
    env?.VITE_GOOGLE_MAP_KEY ?? "",
  );
  const [businessAddress, setBusinessAddress] = useState<string | undefined>(
    undefined,
  );
  // Load Google Maps script
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: googleMapsApiKey || "",
    libraries: libraries as Libraries,
  });

  const { data, isFetching } = useFetchAffiliateById({ id });
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
  const editAffiliateMutation = queries.useEditAffiliateMutation();
  const handleEditAffiliate = async (data: FormData) => {
    // console.log("called handleCreateAffiliate")
    try {
      toastPromise(editAffiliateMutation.mutateAsync({ data, id }), {
        loading: "Updating affiliate...",
        success: (res) => {
          if (res) navigate(constant.ROUTING_URLS.AFFILIATE);
          return "Yeah! Affiliate updated successfully";
        },
        error: (e) =>
          e instanceof AxiosError
            ? e.response?.data?.data?.error || e.response?.data?.message
            : "Opps! failed to update affiliate.",
      });
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    }
    // return await new Promise((res)=>{
    //   setTimeout(()=>res(console.log("promise:",data)),5000);
    // });
  };

  if (isFetching) return <Spinner />;
  return (
    <>
      <PageTitle title={generatePageTitle("Affiliate")} />
      <div className="p-6 space-y-6 md:p-8 md:space-y-8">
        <PageHeader
          title="Affiliate"
          breadcrumbs={[
            { label: "Home", path: "/" },
            { label: "Affiliate", path: constant.ROUTING_URLS.AFFILIATE },
            { label: "Edit Affiliate" },
          ]}
          backAction={{
            variant: "outlinePrimary",
            label: "Back",
            icon: <ArrowLeft />,
            link: constant.ROUTING_URLS.AFFILIATE,
          }}
        />
        <AffiliateForm
          onSubmit={handleEditAffiliate}
          initialData={data}
          businessAddress={businessAddress}
          type={"Edit Affiliate"}
        />
      </div>
    </>
  );
}

export default EditAffiliatePage;
