import { type Libraries, useLoadScript } from "@react-google-maps/api";
import { formatDate } from "date-fns";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { useFetchBookingById } from "@/api";
import { PartnerAssignModal } from "@/components/booking/PartnerAssignModal";
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
import { useSocket } from "@/context/SocketContext";
import { constant } from "@/lib/constant";
import { env } from "@/utils/env";
import { formatFieldValue } from "@/utils/formatters";
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
  const { data, isFetching, isError, refetch } = useFetchBookingById({ id });
  // Load Google Maps script
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: googleMapsApiKey || "",
    libraries: libraries as Libraries,
  });
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const { socket } = useSocket();

  useEffect(() => {
    if (socket && id) {
      const handleUpdate = (payload: {
        bookingId: string;
        status: string;
        message: string;
      }) => {
        if (payload.bookingId === id) {
          toast.info(
            payload.message || `Booking assignment status: ${payload.status}`,
          );
          refetch();
        }
      };

      socket.on("adminAssignmentUpdate", handleUpdate);
      return () => {
        socket.off("adminAssignmentUpdate", handleUpdate);
      };
    }
  }, [socket, id, refetch]);

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
  if (!isFetching && (!data || !data.id)) {
    return (
      <EmptyDataState
        entityName="Booking"
        listRoute={constant.ROUTING_URLS.BOOKING}
      />
    );
  }

  return (
    <div className="p-6 space-y-6 md:p-8 md:space-y-8">
      <PageHeader
        title="Booking Details"
        breadcrumbs={[
          { label: "Home", path: "/" },
          { label: "Bookings", path: constant.ROUTING_URLS.BOOKING },
          { label: "View Booking" },
        ]}
        backAction={{
          variant: "outlinePrimary",
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
                <div className="flex gap-2">
                  {data?.trip?.tripType === "scheduled" &&
                    typeof data?.status === "string" &&
                    ["created", "booked"].includes(
                      data?.status?.toLowerCase(),
                    ) && (
                      <Button
                        variant="black"
                        className="capitalize"
                        onClick={() => setIsAssignModalOpen(true)}
                      >
                        Assign
                      </Button>
                    )}
                  <Button variant="black" className="capitalize">
                    Payment Done
                  </Button>
                </div>
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
                <Label>{formatFieldValue(data?.thirdPartyUser?.name)}</Label>
                <Label className="font-montserrat font-semibold capitalize">
                  Email:
                </Label>
                <Label>{formatFieldValue(data?.thirdPartyUser?.email)}</Label>
                <Label className="font-montserrat font-semibold capitalize">
                  Phone:
                </Label>
                <Label>{formatFieldValue(data?.thirdPartyUser?.phone)}</Label>

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
                  {formatFieldValue(
                    `${data?.vehicle?.make || ""} ${data?.vehicle?.model || ""}`.trim() ||
                      null,
                  )}
                </Label>

                <Label className="font-montserrat font-semibold capitalize">
                  Chauffeur:
                </Label>
                <Label>
                  {formatFieldValue(
                    `${data?.chauffeur?.firstName || ""} ${data?.chauffeur?.lastName || ""}`.trim() ||
                      null,
                  )}
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
                <Label>{formatFieldValue(data?.bookingType)}</Label>

                <Label className="font-montserrat font-semibold capitalize">
                  From:
                </Label>
                <Label>{formatFieldValue(Locations?.pickUpAddress)}</Label>

                <Label className="font-montserrat font-semibold capitalize">
                  to:
                </Label>
                <Label>{formatFieldValue(Locations?.dropOffAddress)}</Label>

                <Label className="font-montserrat font-semibold capitalize">
                  price:
                </Label>
                <Label>{formatFieldValue(data?.price, "N/A")}</Label>
              </div>
            </CardContent>
          </CardBody>
        </Card>
      )}
      <PartnerAssignModal
        isOpen={isAssignModalOpen}
        onOpenChange={setIsAssignModalOpen}
        bookingId={id || ""}
      />
    </div>
  );
};

export default ViewBookingPage;
