import { type Libraries, useLoadScript } from "@react-google-maps/api";
import { IconFileDownload, IconFileInfo } from "@tabler/icons-react";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useFetchChauffeurById } from "@/api";
import { ErrorCard } from "@/components/common/ErrorCard";
import { EmptyDataState } from "@/components/EmptyDataState";
import { PageHeader } from "@/components/layouts/PageHeader";
import { Spinner } from "@/components/Spinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardBody,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FieldSeparator } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { constant } from "@/lib/constant";
import { cn } from "@/lib/utils";
import { env } from "@/utils/env";
import { geoDecoding } from "@/utils/googleMaps";

const libraries = ["places", "geocoding"];

const DocJsx = ({
  documentsLength,
  data,
}: {
  documentsLength: number;
  data: {
    documents: [
      {
        fileUrl: string;
      },
    ];
  };
}) => {
  // console.log(documentsLength)
  return [0, 1, 2, 3].map((i) => (
    <div key={i} className="flex items-center gap-6">
      <Label className="font-montserrat font-semibold w-full max-w-max">
        Document {i + 1}:
      </Label>
      <div
        className={cn(
          "bg-base-white w-full flex items-center space-x-5",
          (i > documentsLength || documentsLength === 0) &&
            "opacity-50 cursor-no-drop",
        )}
      >
        <Badge variant="black">
          {i <= documentsLength ? "Submitted" : "Pending"}
        </Badge>

        <Link
          to={i <= documentsLength ? data?.documents[i - 1]?.fileUrl : ""}
          // to={doc?.fileUrl ?? "#"}
          rel="noreferrer"
          target="_blank"
        >
          <Button
            variant="outlineNavBtnBlack"
            size="xl"
            spacing="lg"
            tooltip="View File"
            className={`${(i > documentsLength || documentsLength === 0) && "opacity-50 cursor-no-drop"}`}
          >
            <IconFileInfo />
          </Button>
        </Link>
        <Link
          to={i <= documentsLength ? data?.documents[i - 1]?.fileUrl : ""}
          // to={doc?.fileUrl ?? "#"}
          download={i <= documentsLength ? data?.documents[i - 1] : ""}
          target="_blank"
        >
          <Button
            variant="outlineNavBtnBlack"
            size="xl"
            spacing="lg"
            tooltip="Download File"
            className={`${(i > documentsLength || documentsLength === 0) && "opacity-50 cursor-no-drop"}`}
          >
            <IconFileDownload />
          </Button>
        </Link>
      </div>
    </div>
  ));
};

const ViewChauffeurPage = () => {
  const { id } = useParams();
  const [googleMapsApiKey] = useState<string | null>(
    env?.VITE_GOOGLE_MAP_KEY ?? "",
  );
  const [isaddress, setAddress] = useState<string | undefined>(undefined);
  const { data, isFetching, isError, refetch } = useFetchChauffeurById({
    id: id!,
  });
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

  if (isError) return <ErrorCard refetch={refetch} />;
  if (!isFetching && (!data || !data.id)) {
    return (
      <EmptyDataState
        entityName="Chauffeur"
        listRoute={constant.ROUTING_URLS.CHAUFFEUR}
      />
    );
  }

  return (
    <div className="p-6 space-y-6 md:p-8 md:space-y-8">
      <PageHeader
        title="Chauffeur Details"
        breadcrumbs={[
          { label: "Home", path: "/" },
          { label: "Chauffeur", path: constant.ROUTING_URLS.CHAUFFEUR },
          { label: "View Chauffeur" },
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
      ) : (
        <Card>
          <CardBody>
            <CardHeader>
              <CardTitle>
                {data?.userFirstName} {data?.userLastName}
              </CardTitle>
              <CardDescription className="text-sm font-bold">
                Location:{" "}
                {loadError
                  ? "Error map api loading"
                  : !isaddress
                    ? "Error fetching address"
                    : isaddress}
              </CardDescription>
              {data?.status && (
                <CardAction>
                  <Button variant="black" className="capitalize">
                    {data.status}
                  </Button>
                </CardAction>
              )}
            </CardHeader>
            <FieldSeparator />
            <CardContent>
              <div className="w-full mb-4">
                <h6 className="font-montserrat font-bold text-base-black text-sm mb-4">
                  Company
                </h6>

                <div className="grid grid-cols-[max-content_1fr] gap-4 items-start">
                  <Label className="font-montserrat font-semibold capitalize">
                    Email:
                  </Label>
                  <Label>{data?.userEmail}</Label>
                  <Label className="font-montserrat font-semibold capitalize">
                    Phone:
                  </Label>
                  <Label>{data?.userPhoneNumber}</Label>

                  <div className="col-span-2">
                    <FieldSeparator />
                  </div>

                  <Label className="font-montserrat font-semibold capitalize">
                    Vehicle ID:
                  </Label>
                  <Label>{data?.vehicleId}</Label>

                  <div className="col-span-2">
                    <FieldSeparator />
                  </div>

                  <Label className="font-montserrat font-semibold capitalize">
                    Tax Id:
                  </Label>
                  <Label>{data?.taxIdNumber}</Label>
                  <Label className="font-montserrat font-semibold capitalize">
                    License:
                  </Label>
                  <Label>{data?.licenseNumber}</Label>

                  <div className="col-span-2">
                    <FieldSeparator />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h6 className="font-montserrat font-bold text-base-black text-sm mt-4">
                  Documents
                </h6>
                {/* {docJsx} */}
                <DocJsx documentsLength={documentsLength} data={data} />
              </div>
            </CardContent>
          </CardBody>
        </Card>
      )}
    </div>
  );
};

export default ViewChauffeurPage;
