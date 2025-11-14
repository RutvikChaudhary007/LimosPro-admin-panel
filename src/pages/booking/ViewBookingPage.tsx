import { type Libraries, useLoadScript } from "@react-google-maps/api";
import { formatDate } from "date-fns";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import UsefetchBookingById from "@/api/getBookingById.api";
import { ErrorCard } from "@/components/common/ErrorCard";
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
import { env } from "@/utils/env";
import { geoDecoding } from "@/utils/googleMaps";

const libraries = ["places", "geocoding"];
const ViewBookingPage = () => {
  const { id } = useParams();
  const [googleMapsApiKey] = useState<string | null>(
    env?.VITE_GOOGLE_MAP_KEY ?? "",
  );
  const [Locations, setLocations] = useState<{
    pickUpAddress: string;
    dropOffAddress: string;
  }>({ pickUpAddress: "", dropOffAddress: "" });
  const { data, isFetching, isError, refetch } = UsefetchBookingById({ id });
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
          const pickUpAddress = await geoDecoding({
            lat: data?.pickupLocation?.latitude,
            lng: data?.pickupLocation?.longitude,
          });
          const dropOffAddress = await geoDecoding({
            lat: data?.dropoffLocation?.latitude,
            lng: data?.dropoffLocation?.longitude,
          });

          if (isMounted) {
            console.log("Decoded Address:", pickUpAddress);
            console.log("Decoded dropOffAddress:", dropOffAddress);
            setLocations((prev) => ({
              ...prev,
              ...(pickUpAddress
                ? { pickUpAddress: pickUpAddress as string }
                : {}),
              ...(dropOffAddress
                ? { dropOffAddress: dropOffAddress as string }
                : {}),
            }));
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
  if (isError) return <ErrorCard refetch={refetch} />;
  return (
    <div className="p-6 space-y-6 md:p-8 md:space-y-8">
      <PageHeader
        title="Booking Details"
        breadcrumbs={[
          { label: "Home", path: "/" },
          { label: "Bookings", path: constant.ROUTING_URLS.BOOKING },
          { label: "View Booking" },
        ]}
        action={{
          variant: "outlineBlack",
          label: "Back",
          icon: <ArrowLeft />,
          link: constant.ROUTING_URLS.BOOKING,
        }}
      />
      {isFetching ? (
        <Spinner />
      ) : (
        <Card>
          <CardBody>
            <CardHeader>
              <CardTitle>Booking ID: {data?.id}</CardTitle>
              <CardDescription className="text-sm font-bold">
                Created on: {formatDate(
                  data?.createdAt,
                  "dd-MM-yyyy hh:mm a",
                )}{" "}
              </CardDescription>
              <CardAction>
                <Button variant="black" className="capitalize">
                  Payment Done
                </Button>
              </CardAction>
            </CardHeader>
            <FieldSeparator />
            <CardContent>
              <div className="w-full mb-4">
                <h6 className="texfont-montserrat font-bold text-base-black text-sm mb-4">
                  Passenger
                </h6>
                <div className="grid grid-cols-[max-content_1fr] gap-4 items-start">
                  <Label className="font-montserrat font-semibold capitalize">
                    Name:
                  </Label>
                  <Label>{data?.thirdPartyUser?.name}</Label>
                  <Label className="font-montserrat font-semibold capitalize">
                    Email:
                  </Label>
                  <Label>{data?.thirdPartyUser?.email}</Label>
                  <Label className="font-montserrat font-semibold capitalize">
                    Phone:
                  </Label>
                  <Label>{data?.thirdPartyUser?.phone}</Label>

                  <div className="col-span-2">
                    <FieldSeparator />
                  </div>

                  <h6 className="texfont-montserrat font-bold text-base-black text-sm col-span-2">
                    Car and Chauffeur
                  </h6>

                  <Label className="font-montserrat font-semibold capitalize">
                    Car Name:
                  </Label>
                  <Label>
                    {data?.vehicle?.make} {data?.vehicle?.model}
                  </Label>

                  <Label className="font-montserrat font-semibold capitalize">
                    Chauffeur:
                  </Label>
                  <Label>
                    {data?.chauffeur?.firstName} {data?.chauffeur?.lastName}
                  </Label>

                  <div className="col-span-2">
                    <FieldSeparator />
                  </div>

                  <h6 className="texfont-montserrat font-bold text-base-black text-sm col-span-2">
                    Ride
                  </h6>

                  <Label className="font-montserrat font-semibold capitalize">
                    Status:
                  </Label>
                  <Badge variant="black">{data?.status}</Badge>

                  <Label className="font-montserrat font-semibold capitalize">
                    Type:
                  </Label>
                  <Label>{data?.bookingType}</Label>

                  <Label className="font-montserrat font-semibold capitalize">
                    From:
                  </Label>
                  <Label>{Locations?.pickUpAddress}</Label>

                  <Label className="font-montserrat font-semibold capitalize">
                    to:
                  </Label>
                  <Label>{Locations?.dropOffAddress}</Label>

                  <Label className="font-montserrat font-semibold capitalize">
                    price:
                  </Label>
                  <Label>{"N/A"}</Label>
                </div>
              </div>
            </CardContent>
          </CardBody>
        </Card>
      )}
    </div>
  );
};

export default ViewBookingPage;
