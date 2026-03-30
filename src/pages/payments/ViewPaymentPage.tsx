import { type Libraries, useLoadScript } from "@react-google-maps/api";
import { formatDate } from "date-fns";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useFetchPaymentById } from "@/api";
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

  // Debug: log the data to see what's coming from backend

  // Initialize Places Autocomplete
  useEffect(() => {
    let isMounted = true;

    const fetchAddress = async () => {
      if (!data) return;

      // First check if address is already available from backend
      const pickupAddr = data?.ride?.pickupLocation?.address;
      const dropoffAddr = data?.ride?.dropoffLocation?.address;

      if (pickupAddr && isMounted) {
        setPickUpAddress(pickupAddr);
      }
      if (dropoffAddr && isMounted) {
        setDropOffAddress(dropoffAddr);
      }

      // If no address from backend and Google Maps is loaded, try geocoding
      if (isLoaded && !loadError && (!pickupAddr || !dropoffAddr)) {
        try {
          if (!pickupAddr && data?.ride?.pickupLocation?.latitude) {
            const address = await geoDecoding({
              lat: String(data.ride.pickupLocation.latitude),
              lng: String(data.ride.pickupLocation.longitude),
            });
            if (isMounted && address) {
              setPickUpAddress(address as string);
            }
          }
          if (!dropoffAddr && data?.ride?.dropoffLocation?.latitude) {
            const address2 = await geoDecoding({
              lat: String(data.ride.dropoffLocation.latitude),
              lng: String(data.ride.dropoffLocation.longitude),
            });
            if (isMounted && address2) {
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
  if (!isFetching && (!data || !data.payment || !data.payment.id)) {
    return (
      <EmptyDataState
        entityName="Payment"
        listRoute={constant.ROUTING_URLS.PAYMENTS}
      />
    );
  }

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
                  {/* Priority: userDetails -> thirdPartyUser -> guestUser */}
                  {data?.payment?.userDetails?.firstName ||
                  data?.payment?.userDetails?.lastName
                    ? `${data?.payment?.userDetails?.firstName ?? ""} ${data?.payment?.userDetails?.lastName ?? ""}`.trim()
                    : data?.payment?.thirdPartyUser?.name
                      ? data?.payment?.thirdPartyUser?.name
                      : data?.payment?.guestUser?.name
                        ? data?.payment?.guestUser?.name
                        : "N/A"}
                </Label>

                <Label className="font-montserrat font-semibold capitalize">
                  Email:
                </Label>
                <Label>
                  {data?.payment?.userDetails?.email
                    ? data?.payment?.userDetails?.email
                    : data?.payment?.thirdPartyUser?.email
                      ? data?.payment?.thirdPartyUser?.email
                      : data?.payment?.guestUser?.email
                        ? data?.payment?.guestUser?.email
                        : "N/A"}
                </Label>

                <Label className="font-montserrat font-semibold capitalize">
                  Phone:
                </Label>
                <Label>
                  {data?.payment?.userDetails?.phoneNumber
                    ? data?.payment?.userDetails?.phoneNumber
                    : data?.payment?.thirdPartyUser?.phone
                      ? data?.payment?.thirdPartyUser?.phone
                      : data?.payment?.guestUser?.phone
                        ? data?.payment?.guestUser?.phone
                        : "N/A"}
                </Label>

                <Label className="font-montserrat font-semibold capitalize">
                  Booking ID:
                </Label>
                <Label>{data?.payment?.bookingId}</Label>

                {/* DEBUG: Temporary raw data display */}
                <div className="col-span-2 mt-4 p-2 bg-gray-100 rounded text-xs font-mono">
                  <div>DEBUG:</div>
                  <div>
                    userDetails: {JSON.stringify(data?.payment?.userDetails)}
                  </div>
                  <div>
                    thirdPartyUser:{" "}
                    {JSON.stringify(data?.payment?.thirdPartyUser)}
                  </div>
                  <div>
                    guestUser: {JSON.stringify(data?.payment?.guestUser)}
                  </div>
                </div>

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
