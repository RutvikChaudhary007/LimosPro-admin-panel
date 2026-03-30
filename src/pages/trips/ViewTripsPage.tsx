import { type Libraries, useLoadScript } from "@react-google-maps/api";
import { formatDate } from "date-fns";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useFetchTripById } from "@/api";
import { PageHeader } from "@/components/layouts/PageHeader";
import { Spinner } from "@/components/Spinner";
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

const ViewTripsPage = () => {
  const { id } = useParams();
  const [googleMapsApiKey] = useState<string | null>(
    env?.VITE_GOOGLE_MAP_KEY ?? "",
  );
  const [pickUpAddress, setPickUpAddress] = useState<string | undefined>(
    undefined,
  );
  const [dropOffAddress, setDropOffAddress] = useState<string | undefined>(
    undefined,
  );

  // Load Google Maps script
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: googleMapsApiKey || "",
    libraries: libraries as Libraries,
  });

  const { data, isFetching } = useFetchTripById({ id: id! });
  // Initialize Places Autocomplete
  useEffect(() => {
    let isMounted = true;

    const fetchAddress = async () => {
      if (isLoaded && data && !loadError) {
        try {
          const address = await geoDecoding({
            lat: data?.pickupLocation?.lat,
            lng: data?.pickupLocation?.lng,
          });
          const address2 = await geoDecoding({
            lat: data?.dropoffLocation?.lat,
            lng: data?.dropoffLocation?.lng,
          });
          if (isMounted) {
            console.log("Decoded Address:", address);
            if (address) {
              setPickUpAddress(address as string);
            }
            if (address2) {
              setDropOffAddress(address2 as string);
            }
          }
        } catch (err) {
          console.error("Geocoding failed:", err);
        }
      }
    };

    console.log("trips details => ", data);
    return () => {
      isMounted = false;
    };
  }, [isLoaded, loadError, data]);

  return (
    <div className="p-6 space-y-6 md:p-8 md:space-y-8">
      <PageHeader
        title="Trip Details"
        breadcrumbs={[
          { label: "Home", path: "/" },
          { label: "Trips", path: constant.ROUTING_URLS.TRIPS },
          { label: "View Trip" },
        ]}
        backAction={{
          variant: "outlinePrimary",
          label: "Back",
          icon: <ArrowLeft />,
          link: constant.ROUTING_URLS.TRIPS,
        }}
      />
      {isFetching ? (
        <Spinner />
      ) : (
        <Card>
          <CardBody>
            <CardHeader>
              <CardTitle>Booking ID: {data?.bookingId}</CardTitle>
              <CardDescription className="text-sm font-bold">
                Created on: {formatDate(
                  data?.createdAt,
                  "dd-MM-yyyy hh:mm a",
                )}{" "}
              </CardDescription>
              <CardAction className="flex flex-wrap gap-2">
                <Button type="button" variant="black" className="capitalize">
                  {data?.tripStatus}
                </Button>
                <Link
                  to={constant.ROUTING_URLS.TRIPS_MAP.replace(":id", id!)}
                  className="block"
                >
                  <Button type="button">View Live Location</Button>
                </Link>
              </CardAction>
            </CardHeader>
            <FieldSeparator />
            <CardContent>
              <h6 className="texfont-montserrat font-bold text-base-black text-sm mb-4">
                Passenger
              </h6>
              <div className="grid grid-cols-[max-content_1fr] gap-4 items-start">
                <Label className="font-montserrat font-semibold capitalize">
                  Name:
                </Label>
                <Label>
                  {data?.user?.firstName} {data?.user?.lastName}
                </Label>
                <Label className="font-montserrat font-semibold capitalize">
                  Email:
                </Label>
                <Label>{data?.user?.email}</Label>
                <Label className="font-montserrat font-semibold capitalize">
                  Phone:
                </Label>
                <Label>{data?.user?.phoneNumber}</Label>

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
                  {data?.vehicle
                    ? `${data.vehicle.make} ${data.vehicle.model}`
                    : "N/A"}
                </Label>

                <Label className="font-montserrat font-semibold capitalize">
                  Chauffeur:
                </Label>
                <Label>
                  {data?.chauffeur
                    ? `${data.chauffeur.firstName} ${data.chauffeur.lastName}`
                    : "N/A"}
                </Label>

                <div className="col-span-2">
                  <FieldSeparator />
                </div>

                <h6 className="texfont-montserrat font-bold text-base-black text-sm col-span-2">
                  Trip
                </h6>

                <Label className="font-montserrat font-semibold capitalize">
                  Trip Id:
                </Label>
                <Label>{data?.id}</Label>

                <Label className="font-montserrat font-semibold capitalize">
                  price:
                </Label>
                <Label>${data.fare}</Label>

                <Label className="font-montserrat font-semibold capitalize">
                  Type:
                </Label>
                <Label className="capitalize">{data?.tripType}</Label>

                <Label className="font-montserrat font-semibold capitalize">
                  From:
                </Label>
                <Label>
                  {pickUpAddress || data?.pickupLocation?.address || "N/A"}
                </Label>

                <Label className="font-montserrat font-semibold capitalize">
                  to:
                </Label>
                <Label>
                  {dropOffAddress || data?.dropoffLocation?.address || "N/A"}
                </Label>
              </div>
            </CardContent>
          </CardBody>
        </Card>
      )}
    </div>
  );
};

export default ViewTripsPage;
