import { type Libraries, useLoadScript } from "@react-google-maps/api";
import { AxiosError } from "axios";
import { ArrowLeft } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useFetchChauffeurById } from "@/api";
import ChauffeurForm, {
  type TChauffeurForm,
} from "@/components/chauffeur/ChauffeurForm";
import { ErrorCard } from "@/components/common/ErrorCard";
import { EmptyDataState } from "@/components/EmptyDataState";
import { PageHeader } from "@/components/layouts/PageHeader";
import { Spinner } from "@/components/Spinner";
import { toastPromise } from "@/hooks/use-toast";
import { constant } from "@/lib/constant";
import queries from "@/lib/queries";
import { env } from "@/utils/env";
import { geoDecoding } from "@/utils/googleMaps";

const libraries = ["places", "geocoding"];
const EditChauffeurPage = () => {
  const { id } = useParams();
  const googleMapsApiKey = useMemo(() => env?.VITE_GOOGLE_MAP_KEY, []);
  const { data, isFetching, isError, refetch } = useFetchChauffeurById({
    id: id ?? "",
  });
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
  }, [isLoaded, loadError, data]);

  // Place this after you have both `data` and `address`
  const initialFormData = useMemo(() => {
    if (!data) return undefined;
    return { ...data, businessAddress: address };
  }, [data, address]);

  const editChauffeurMutation = queries.useEditChauffeurMutation();
  const handleEditChauffeur = async (data: TChauffeurForm) => {
    try {
      await toastPromise(
        editChauffeurMutation.mutateAsync({
          data,
          id: id ?? "",
        }),
        {
          loading: "Updating Chauffeur...",
          success: "Yeah! Chauffeur updated successfully.",
          error: (e) =>
            e instanceof AxiosError
              ? e.response?.data?.data?.error || e.response?.data?.message
              : "Opps! failed to update chauffeur",
        },
      );
    } catch (error) {
      // toastPromise already handled the error message display
      console.error("Save error:", error);
    }
  };

  return (
    <div className="p-6 space-y-6 md:p-8 md:space-y-8">
      <PageHeader
        title="Chauffeur"
        breadcrumbs={[
          { label: "Home", path: "/" },
          { label: "Chauffeur", path: constant.ROUTING_URLS.CHAUFFEUR },
          { label: "Edit Chauffeur" },
        ]}
        backAction={{
          variant: "outlinePrimary",
          label: "Back",
          icon: <ArrowLeft />,
          link: constant.ROUTING_URLS.CHAUFFEUR,
        }}
      />
      {isFetching ? (
        <Spinner />
      ) : isError ? (
        <ErrorCard refetch={refetch} />
      ) : !data || !data.id ? (
        <EmptyDataState
          entityName="Chauffeur"
          listRoute={constant.ROUTING_URLS.CHAUFFEUR}
        />
      ) : (
        <ChauffeurForm
          onSubmit={handleEditChauffeur}
          type={"Edit Chauffeur"}
          initialData={initialFormData}
        />
      )}
    </div>
  );
};

export default EditChauffeurPage;
