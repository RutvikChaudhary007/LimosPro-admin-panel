import { type Libraries, useLoadScript } from "@react-google-maps/api";
import { formatDate } from "date-fns";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useFetchPaymentById } from "@/api/payment.api";
import { ErrorCard } from "@/components/common/ErrorCard";
import Header from "@/components/layouts/BreadCramb";
import { Spinner } from "@/components/Spinner";
import { getStatusColor } from "@/components/table/column";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { constant } from "@/lib/constant";
import { env } from "@/utils/env";
import { geoDecoding } from "@/utils/googleMaps";

const newStatus = [
  {
    label: "Payment Done",
    css: "bg-[#444444] text-white",
    value: "paymentDone",
  },
  { label: "Payment Pending", css: "bg-[#959595]", value: "paymentPending" },
  {
    label: "Refund In-progress",
    css: "bg-[#959595]",
    value: "RefundInProgress",
  },
  { label: "Refund Done", css: "bg-[#959595]", value: "RefundDone" },
  { label: "Refund Requested", css: "bg-[#959595]", value: "RefundRequested" },
];
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
      <Link to={constant.ROUTING_URLS.PAYMENTS}>
        <Button
          variant="outline"
          className="py-3 px-1.5 rounded bg-[#D9D9D9] w-[80px] h-[31px] flex items-center justify-center cursor-pointer text-[#5A5A5A]"
        >
          <ArrowLeft /> Back
        </Button>
      </Link>
      <Header className="p-4 h-[79px] bg-[#FDFDFD] shadow-base-md mt-4 mb-5">
        <div className="w-full h-full flex items-center justify-between">
          <div>
            <h2 className="font-medium text-xl text-black">Payments</h2>
            <h4>
              {" "}
              <span className="text-[#959595] w-[116px] h-4 text-xs">
                Payments
              </span>{" "}
              <span className="text-xs text-[#3A3A3A] w-[50px] h-4">
                / View Payments
              </span>
            </h4>
          </div>
        </div>
      </Header>
      {isFetching ? (
        <Spinner />
      ) : (
        <Card className="inset-shadow-xs inset-shadow-[#F1F1F1] bg-[#FDFDFD] rounded-[6px] px-5 space-y-6">
          <CardHeader className="w-full  flex items-center justify-between">
            <div className="w-full h-full space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-xl text-[#000000]">
                    Payment Id: {data?.payment?.id}
                  </h4>
                  <h5 className="text-[#5A5A5A] font-semibold">
                    Created on:{" "}
                    {formatDate(
                      data?.payment?.createdAt || "",
                      "dd-MM-yyyy hh:mm a",
                    )}
                  </h5>
                </div>

                <div
                  className={`flex items-center justify-between px-4 py-2 rounded ${newStatus.find((option) => option.value === (data?.payment?.status ?? "paymentDone"))?.css}`}
                >
                  {data?.payment?.paymentStatus ?? "Payment Done"}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <hr className="w-full h-[1px] bg-[#EEEEEE]" />
            <div className="w-full h-full space-y-4">
              <h6 className="text-sm text-[#5A5A5A] h-[19px] w-full">
                Passenger
              </h6>
              <div className="flex items-center gap-6">
                <Label className="min-w-[153px] text-sm font-semibold capitalize">
                  Name:
                </Label>
                <span className="text-[#3A3A3A] font-medium">
                  {data?.payment?.userDetails?.firstName}{" "}
                  {data?.payment?.userDetails?.lastName}
                </span>
              </div>
              <div className="flex items-center gap-6">
                <Label className="min-w-[153px] text-sm font-semibold capitalize">
                  Email:
                </Label>
                <span className="text-[#3A3A3A] font-medium">
                  {data?.payment?.userDetails?.email}
                </span>
              </div>
              <div className="flex items-center gap-6">
                <Label className="min-w-[153px] text-sm font-semibold capitalize">
                  phone:
                </Label>
                <span className="text-[#3A3A3A] font-medium">
                  {data?.payment?.userDetails?.phoneNumber}
                </span>
              </div>
              <div className="flex items-center gap-6">
                <Label className="min-w-[153px] text-sm font-semibold capitalize">
                  Booking ID:
                </Label>
                <span className="text-[#3A3A3A] font-medium">
                  {data?.payment?.bookingId}
                </span>
              </div>
              <hr className="w-full h-[1px] bg-[#EEEEEE]" />
              <h6 className="text-sm text-[#5A5A5A] h-[19px] w-full">
                Car and Chauffeur
              </h6>

              <div className="flex items-center gap-6">
                <Label className="min-w-[153px] text-sm font-semibold capitalize">
                  Car Name::
                </Label>
                <span className="text-[#3A3A3A] font-medium">
                  {data?.ride?.carName}
                </span>
              </div>
              <div className="flex items-center gap-6">
                <Label className="min-w-[153px] text-sm font-semibold capitalize">
                  Chauffeur:
                </Label>
                <Link
                  to={`${constant.ROUTING_URLS.VIEW_CHAUFFEUR.replace(":id", data?.ride?.chauffeurId || "")}`}
                  className="underline"
                >
                  <span className="text-[#3A3A3A] font-medium">
                    {data?.ride?.chauffeurName}
                  </span>
                </Link>
              </div>
              <hr className="w-full h-[1px] bg-[#EEEEEE]" />
              <h6 className="text-sm text-[#5A5A5A] h-[19px] w-full">Ride</h6>
              <div className="flex items-center gap-6">
                <Label className="min-w-[153px] text-sm font-semibold capitalize">
                  Status:
                </Label>
                <span
                  className={`text-[#3A3A3A] font-medium ${getStatusColor("Completed")} px-2 py-0.5 rounded`}
                >
                  {data?.ride?.status}
                </span>
              </div>
              <div className="flex items-center gap-6">
                <Label className="min-w-[153px] text-sm font-semibold capitalize">
                  type:
                </Label>
                <span className="text-[#3A3A3A] font-medium capitalize">
                  {data?.ride?.rideType}
                </span>
              </div>
              <div className="flex items-center gap-6">
                <Label className="min-w-[153px] text-sm font-semibold capitalize">
                  From:
                </Label>
                <span className="text-[#3A3A3A] font-medium">
                  {loadError
                    ? "Error map api loading"
                    : !pickUpAddress
                      ? "Error fetching address"
                      : pickUpAddress}
                </span>
              </div>
              <div className="flex items-center gap-6">
                <Label className="min-w-[153px] text-sm font-semibold capitalize">
                  To:
                </Label>
                <span className="text-[#3A3A3A] font-medium">
                  {loadError
                    ? "Error map api loading"
                    : !dropOffAddress
                      ? "Error fetching address"
                      : dropOffAddress}
                </span>
              </div>
              <div className="flex items-center gap-6">
                <Label className="min-w-[153px] text-sm font-semibold capitalize">
                  Total Price:
                </Label>
                <span className="text-[#3A3A3A] font-medium">
                  ${data?.payment?.amount}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ViewPaymentPage;
