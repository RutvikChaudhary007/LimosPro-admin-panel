import { type Libraries, useLoadScript } from "@react-google-maps/api";
import { AxiosError } from "axios";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFetchPartnerById } from "@/api";
import { ErrorCard } from "@/components/common/ErrorCard";
import PageTitle from "@/components/common/PageTitle";
import { EmptyDataState } from "@/components/EmptyDataState";
import { PageHeader } from "@/components/layouts/PageHeader";
import PartnerForm from "@/components/partner/PartnerForm";
import { Spinner } from "@/components/Spinner";
import { toastPromise } from "@/hooks/use-toast";
import { constant } from "@/lib/constant";
import queries from "@/lib/queries";
import { env } from "@/utils/env";
import { geoDecoding } from "@/utils/googleMaps";
import { generatePageTitle } from "@/utils/seo";

const libraries = ["places", "geocoding"];

function EditPartnerPage() {
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

  const { data, isFetching, isError, refetch } = useFetchPartnerById({ id });
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
  const editPartnerMutation = queries.useEditPartnerMutation();
  const handleEditPartner = async (data: FormData) => {
    // console.log("called handleCreatePartner")
    try {
      // Pre-open a tab synchronously to avoid popup blockers.
      const onboardingPopup = window.open("about:blank", "_blank");

      const res: any = await toastPromise(
        editPartnerMutation.mutateAsync({ data, id }),
        {
          loading: "Updating Partner...",
          success: "Yeah! Partner updated successfully",
          error: (e) =>
            e instanceof AxiosError
              ? e.response?.data?.data?.error || e.response?.data?.message
              : "Opps! failed to update Partner.",
        },
      );

      const onboardingLink =
        res?.data?.onboardingLink ||
        res?.data?.data?.onboardingLink ||
        res?.onboardingLink;
      if (typeof onboardingLink === "string" && onboardingLink.trim()) {
        if (onboardingPopup) {
          onboardingPopup.location.href = onboardingLink;
          onboardingPopup.opener = null;
        } else {
          window.location.href = onboardingLink;
        }
      } else if (onboardingPopup) {
        onboardingPopup.close();
      }

      navigate(constant.ROUTING_URLS.PARTNER);
    } catch (error) {
      // toastPromise already handled the error message display
      console.error("Save error:", error);
    }
    // return await new Promise((res)=>{
    //   setTimeout(()=>res(console.log("promise:",data)),5000);
    // });
  };

  return (
    <>
      <PageTitle title={generatePageTitle("Partner")} />
      <div className="p-6 space-y-6 md:p-8 md:space-y-8">
        <PageHeader
          title="Partner"
          breadcrumbs={[
            { label: "Home", path: "/" },
            { label: "Partner", path: constant.ROUTING_URLS.PARTNER },
            { label: "Edit Partner" },
          ]}
          backAction={{
            variant: "outlinePrimary",
            label: "Back",
            icon: <ArrowLeft />,
            link: constant.ROUTING_URLS.PARTNER,
          }}
        />
        {isFetching ? (
          <Spinner />
        ) : isError ? (
          <ErrorCard refetch={refetch} />
        ) : !data || !data.id ? (
          <EmptyDataState
            entityName="Partner"
            listRoute={constant.ROUTING_URLS.PARTNER}
          />
        ) : (
          <PartnerForm
            onSubmit={handleEditPartner}
            initialData={data}
            businessAddress={businessAddress}
            disabledFields={["password"]}
            type={"Edit Partner"}
          />
        )}
      </div>
    </>
  );
}

export default EditPartnerPage;
