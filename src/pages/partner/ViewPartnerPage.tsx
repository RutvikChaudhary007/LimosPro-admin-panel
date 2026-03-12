import { type Libraries, useLoadScript } from "@react-google-maps/api";
import { IconFileDownload, IconFileInfo } from "@tabler/icons-react";
import { ArrowLeft } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useFetchPartnerById } from "@/api";
import { ErrorCard } from "@/components/common/ErrorCard";
import PageTitle from "@/components/common/PageTitle";
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
import { generatePageTitle } from "@/utils/seo";

const libraries = ["places", "geocoding"];

const ViewPartnerPage = () => {
  const { id } = useParams();
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

  // console.log("id:",id)
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
            // console.log("Decoded Address:", address);
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
  const documentsLength = data?.documents?.length;
  const docJsx = data?.documents?.map((doc: { fileUrl: string }, i: number) => (
    <div key={i} className="flex items-center gap-6">
      <Label className="font-montserrat font-semibold w-full max-w-max">
        Document {i + 1}:
      </Label>
      <div
        className={cn(
          "bg-base-white w-full flex items-center space-x-5",
          i > documentsLength && "opacity-50 cursor-no-drop",
        )}
      >
        <Badge variant="black">
          {i <= documentsLength ? "Submitted" : "Pending"}
        </Badge>

        <Link
          // to={i <= documentsLength ? data?.documents[i - 1]?.fileUrl : "#"}
          to={doc?.fileUrl ?? "#"}
          rel="noreferrer"
          target="_blank"
        >
          <Button
            variant="outlineNavBtnBlack"
            size="xl"
            spacing="lg"
            tooltip="View File"
          >
            <IconFileInfo />
          </Button>
        </Link>
        <Link
          // to={i <= documentsLength ? data?.documents[i - 1]?.fileUrl : "#"}
          to={doc?.fileUrl ?? "#"}
          download={i <= documentsLength ? data?.documents[i - 1] : "#"}
          target="_blank"
        >
          <Button
            variant="outlineNavBtnBlack"
            size="xl"
            spacing="lg"
            tooltip="Download File"
          >
            <IconFileDownload />
          </Button>
        </Link>
      </div>
    </div>
  ));
  if (isError) return <ErrorCard refetch={refetch} />;
  if (!isFetching && (!data || !data.id)) {
    return (
      <EmptyDataState
        entityName="Partner"
        listRoute={constant.ROUTING_URLS.PARTNER}
      />
    );
  }

  return (
    <>
      <PageTitle title={generatePageTitle("Partner")} />
      <div className="p-6 space-y-6 md:p-8 md:space-y-8">
        <PageHeader
          title="Partner Details"
          breadcrumbs={[
            { label: "Home", path: "/" },
            { label: "Partner", path: constant.ROUTING_URLS.PARTNER },
            { label: "View Partner" },
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
        ) : (
          <Card>
            <CardBody>
              <CardHeader>
                <CardTitle>{data?.companyName}</CardTitle>
                <CardDescription className="text-sm font-bold">
                  {data?.user?.firstName} {data?.user?.lastName}
                  {
                    businessAddress?.split(",")[
                      businessAddress?.split(",").length - 1
                    ]
                  }
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

                  <div className="grid grid-cols-[max-content_1fr] gap-4 items-center">
                    {Object.entries(data as Record<string, React.ReactNode>)
                      ?.filter(([key]) =>
                        [
                          "businessemail",
                          "businesscontactnumber",
                          "entitytype",
                          "businessaddress",
                        ].includes(key?.toLowerCase()),
                      )
                      .map(([key, val]) => (
                        <React.Fragment key={key}>
                          <Label className="font-montserrat font-semibold capitalize">
                            {key}:
                          </Label>
                          <Label className="">{val}</Label>
                        </React.Fragment>
                      ))}
                  </div>
                </div>

                {data?.partnerData &&
                  Object.keys(data.partnerData).length > 0 && (
                    <>
                      <FieldSeparator />
                      <div className="w-full mb-4 mt-4">
                        <h6 className="font-montserrat font-bold text-base-black text-sm mb-4">
                          Additional Information
                        </h6>
                        <div className="grid grid-cols-[max-content_1fr] gap-4 items-center">
                          {Object.entries(data.partnerData)
                            .filter(
                              ([key]) =>
                                ![
                                  "contactPerson",
                                  "interests",
                                  "password",
                                ].includes(key),
                            )
                            .map(([key, val]) => (
                              <React.Fragment key={key}>
                                <Label className="font-montserrat font-semibold capitalize whitespace-nowrap">
                                  {key.replace(/([A-Z])/g, " $1")}:
                                </Label>
                                <Label className="break-all text-sm font-medium">
                                  {String(val || "N/A")}
                                </Label>
                              </React.Fragment>
                            ))}

                          {data.partnerData.contactPerson && (
                            <React.Fragment>
                              <Label className="font-montserrat font-semibold capitalize whitespace-nowrap">
                                Contact Person:
                              </Label>
                              <Label className="break-all text-sm font-medium">
                                {data.partnerData.contactPerson.fullName ||
                                  "N/A"}
                                {data.partnerData.contactPerson.jobTitle
                                  ? ` (${data.partnerData.contactPerson.jobTitle})`
                                  : ""}
                                {data.partnerData.contactPerson.role
                                  ? ` (${data.partnerData.contactPerson.role})`
                                  : ""}
                              </Label>
                            </React.Fragment>
                          )}

                          {Array.isArray(data.partnerData.interests) &&
                            data.partnerData.interests.length > 0 && (
                              <React.Fragment>
                                <Label className="font-montserrat font-semibold capitalize whitespace-nowrap self-start mt-1">
                                  Interests:
                                </Label>
                                <div className="flex flex-wrap gap-2">
                                  {data.partnerData.interests.map(
                                    (interest: string) => (
                                      <Badge key={interest} variant="secondary">
                                        {interest}
                                      </Badge>
                                    ),
                                  )}
                                </div>
                              </React.Fragment>
                            )}
                        </div>
                      </div>
                    </>
                  )}
                <FieldSeparator />
                <div className="space-y-4">
                  <h6 className="font-montserrat font-bold text-base-black text-sm mt-4">
                    Documents
                  </h6>
                  {docJsx}
                </div>
              </CardContent>
            </CardBody>
          </Card>
        )}
      </div>
    </>
  );
};

export default ViewPartnerPage;
