import { type Libraries, useLoadScript } from "@react-google-maps/api";
import { formatDate } from "date-fns";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useFetchPaymentById } from "@/api";
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
const ViewPaymentPage = () => {
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
  const { data, isFetching, isError, refetch } = useFetchPaymentById({
    id: id!,
  });
  // Initialize Places Autocomplete
  useEffect(() => {
    let isMounted = true;

    const fetchAddress = async () => {
      if (isLoaded && data && !loadError) {
        try {
          const address = await geoDecoding({
            lat: data?.ride?.pickupLocation?.latitude,
            lng: data?.ride?.pickupLocation?.longitude,
          });
          const address2 = await geoDecoding({
            lat: data?.ride?.dropoffLocation?.latitude,
            lng: data?.ride?.dropoffLocation?.longitude,
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

    fetchAddress();

    return () => {
      isMounted = false;
    };
  }, [isLoaded, loadError, data]);
  if (isError) return <ErrorCard refetch={refetch} />;
  return (
    <div className="p-6 space-y-6 md:p-8 md:space-y-8 select-none">
      <PageHeader
        title="Payment Details"
        breadcrumbs={[
          { label: "Home", path: "/" },
          { label: "Payments", path: constant.ROUTING_URLS.PAYMENTS },
          { label: "View Payment" },
        ]}
        backAction={{
          variant: "outlinePrimary",
          label: "Back",
          icon: <ArrowLeft />,
          link: constant.ROUTING_URLS.PAYMENTS,
        }}
      />
      {isFetching ? (
        <Spinner />
      ) : (
        <Card>
          <CardBody>
            <CardHeader>
              <CardTitle>Payment ID: {data?.payment?.id}</CardTitle>
              <CardDescription className="text-sm font-bold">
                Created on:{" "}
                {formatDate(
                  data?.payment?.createdAt,
                  "dd-MM-yyyy hh:mm a",
                )}{" "}
              </CardDescription>
              <CardAction>
                <Button variant="black" className="capitalize">
                  {data?.payment?.paymentStatus}
                </Button>
              </CardAction>
            </CardHeader>
            <FieldSeparator />
            <CardContent>
              <h6 className="font-montserrat font-bold text-base-black text-sm mb-4">
                Passenger
              </h6>
              <div className="grid grid-cols-[max-content_1fr] gap-4 items-start">
                <Label className="font-montserrat font-semibold capitalize">
                  Name:
                </Label>
                <Label>
                  {data?.payment?.userDetails?.firstName}{" "}
                  {data?.payment?.userDetails?.lastName}
                </Label>

                <Label className="font-montserrat font-semibold capitalize">
                  Email:
                </Label>
                <Label>{data?.payment?.userDetails?.email}</Label>

                <Label className="font-montserrat font-semibold capitalize">
                  Phone:
                </Label>
                <Label>{data?.payment?.userDetails?.phoneNumber}</Label>

                <Label className="font-montserrat font-semibold capitalize">
                  Booking ID:
                </Label>
                <Label>{data?.payment?.bookingId}</Label>

                <div className="col-span-2">
                  <FieldSeparator />
                </div>

                {/* Car & Chauffeur Section */}
                <h6 className="font-montserrat font-bold text-base-black text-sm col-span-2">
                  Car and Chauffeur
                </h6>

                <Label className="font-montserrat font-semibold capitalize">
                  Car Name:
                </Label>
                <Label>{data?.ride?.carName}</Label>

                <Label className="font-montserrat font-semibold capitalize">
                  Chauffeur:
                </Label>
                <Link
                  to={constant.ROUTING_URLS.VIEW_CHAUFFEUR.replace(
                    ":id",
                    data?.ride?.chauffeurId ?? "",
                  )}
                >
                  <Button variant="linkDark" spacing="none">
                    {data?.ride?.chauffeurName}
                  </Button>
                </Link>

                <div className="col-span-2">
                  <FieldSeparator />
                </div>

                {/* Ride Section */}
                <h6 className="font-montserrat font-bold text-base-black text-sm col-span-2">
                  Ride
                </h6>

                <Label className="font-montserrat font-semibold capitalize">
                  Status:
                </Label>
                <Badge variant="black">{data?.ride?.status}</Badge>

                <Label className="font-montserrat font-semibold capitalize">
                  Type:
                </Label>
                <Label className="font-medium capitalize">
                  {data?.ride?.rideType}
                </Label>

                <Label className="font-montserrat font-semibold capitalize">
                  From:
                </Label>
                <Label>
                  {loadError
                    ? "Error map api loading"
                    : !pickUpAddress
                      ? "Error fetching address"
                      : pickUpAddress}
                </Label>

                <Label className="font-montserrat font-semibold capitalize">
                  To:
                </Label>
                <Label>
                  {loadError
                    ? "Error map api loading"
                    : !dropOffAddress
                      ? "Error fetching address"
                      : dropOffAddress}
                </Label>

                <Label className="font-montserrat font-semibold capitalize">
                  Total Price:
                </Label>
                <Label>${data?.payment?.amount}</Label>
              </div>
            </CardContent>
          </CardBody>
        </Card>
      )}
    </div>
  );
};

export default ViewPaymentPage;
