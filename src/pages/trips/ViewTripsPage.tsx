import { type Libraries, useLoadScript } from "@react-google-maps/api";
import { formatDate } from "date-fns";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import useFetchTripById from "@/api/getTripById.api";
import Header from "@/components/layouts/BreadCramb";
import { Spinner } from "@/components/Spinner";
import { getStatusColor } from "@/components/table/column";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { constant } from "@/lib/constant";
import { cn } from "@/lib/utils";
import { env } from "@/utils/env";
import { geoDecoding } from "@/utils/googleMaps";

const showStatus = [
  { label: "Completed", value: "completed" },
  { label: "In-Progress", value: "inProgress" },
  { label: "Cancelled", value: "cancelled" },
  { label: "Pending", value: "pending" },
];

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
const getNewStatusColor = (value: string) => {
  console.log(value.toLowerCase().trim());
  console.log(
    "newStatus:",
    newStatus.find((status) => status.value.toLowerCase().trim() === value.toLowerCase().trim()),
  );
  return newStatus.find((status) => status.value.toLowerCase().trim() === value.toLowerCase().trim());
};
const ViewTripsPage = () => {
  const { id } = useParams();
  const [googleMapsApiKey] = useState<string | null>(env?.VITE_GOOGLE_MAP_KEY ?? "");
  const [pickUpAddress, setPickUpAddress] = useState<string | undefined>(undefined);
  const [dropOffAddress, setDropOffAddress] = useState<string | undefined>(undefined);

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

    fetchAddress();

    return () => {
      isMounted = false;
    };
  }, [isLoaded, loadError, data]);
  const [selectedStatus, setSelectedStatus] = useState(showStatus[0]);

  return (
    <div className="p-6 space-y-6 md:p-8 md:space-y-8">
      <Link to={constant.ROUTING_URLS.TRIPS}>
        <Button
          variant="outline"
          className="py-3 px-1.5 rounded bg-[#D9D9D9] w-[80px] h-[31px] flex items-center justify-center cursor-pointer text-[#5A5A5A]"
        >
          <ArrowLeft /> Back
        </Button>
      </Link>
      <Header className="p-4 h-[79px] bg-[#FDFDFD] shadow-base-light mt-4 mb-5">
        <div className="w-full h-full flex items-center justify-between">
          <div>
            <h2 className="font-medium text-xl text-black">Trips</h2>
            <h4>
              {" "}
              <span className="text-[#959595] w-[116px] h-4 text-xs">Trips</span>{" "}
              <span className="text-xs text-[#3A3A3A] w-[50px] h-4">/ View Trips</span>
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
                  <h4 className="font-semibold text-xl text-[#000000]">Booking ID: AA57329144.</h4>
                  <h5 className="text-[#5A5A5A] font-semibold">
                    Created on: {formatDate(data?.createdAt || "", "dd-MM-yyyy hh:mm a")}
                  </h5>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className={`w-[180px] h-[39px] flex items-center justify-between rounded shadow-inner shadow-[#F1F1F1] cursor-pointer bg-[#FFFFFF] ${getStatusColor(selectedStatus.label)} ${selectedStatus.label === "Active" && "text-white"}`}
                    >
                      {selectedStatus.label}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className={cn(`w-56 bg-[#FDFDFD] shadow-inner shadow-[#F1F1F1] cursor-pointer rounded space-y-1`)}
                    align="start"
                  >
                    <DropdownMenuGroup>
                      {showStatus.map((option) => (
                        <DropdownMenuItem
                          key={option.value}
                          className={`flex items-center justify-between cursor-pointer bg-[#FFFFFF] ${getStatusColor(option.label)} ${option.label === "Active" && "text-white"}`}
                          onClick={() => setSelectedStatus(option)}
                        >
                          {option.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <Link to={constant.ROUTING_URLS.TRIPS_MAP.replace(":id", id!)}>
                <Button type="button" variant={"secondary"}>
                  View Live Location
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <hr className="w-full h-[1px] bg-[#EEEEEE]" />
            <div className="w-full h-full space-y-4">
              <h6 className="text-sm text-[#5A5A5A] h-[19px] w-full">Passenger</h6>
              <div className="flex items-center gap-6">
                <Label className="min-w-[153px] text-sm font-semibold capitalize">Name:</Label>
                <span className="text-[#3A3A3A] font-medium">
                  {data?.user?.firstName} {data?.user?.lastName}
                </span>
              </div>
              <div className="flex items-center gap-6">
                <Label className="min-w-[153px] text-sm font-semibold capitalize">Email:</Label>
                <span className="text-[#3A3A3A] font-medium">{data?.user?.email}</span>
              </div>
              <div className="flex items-center gap-6">
                <Label className="min-w-[153px] text-sm font-semibold capitalize">phone:</Label>
                <span className="text-[#3A3A3A] font-medium">{data?.user?.phoneNumber}</span>
              </div>
              <hr className="w-full h-[1px] bg-[#EEEEEE]" />
              <h6 className="text-sm text-[#5A5A5A] h-[19px] w-full">Car and Chauffeur</h6>

              <div className="flex items-center gap-6">
                <Label className="min-w-[153px] text-sm font-semibold capitalize">Car Name:</Label>
                <span className="text-[#3A3A3A] font-medium">
                  {data?.vehicle?.make} {data?.vehicle?.model}
                </span>
              </div>
              <div className="flex items-center gap-6">
                <Label className="min-w-[153px] text-sm font-semibold capitalize">Chauffeur:</Label>
                <span className="text-[#3A3A3A] font-medium">
                  {data?.chauffeur?.firstName} {data?.chauffeur?.lastName}
                </span>
              </div>
              <hr className="w-full h-[1px] bg-[#EEEEEE]" />
              <h6 className="text-sm text-[#5A5A5A] h-[19px] w-full">Trip</h6>
              <div className="flex items-center gap-6">
                <Label className="min-w-[153px] text-sm font-semibold capitalize">Price:</Label>
                <span className="text-[#3A3A3A] font-medium">${data?.fare}</span>
              </div>
              <div className="flex items-center gap-6">
                <Label className="min-w-[153px] text-sm font-semibold capitalize">Status:</Label>
                <span
                  className={`text-[#3A3A3A] font-medium ${getNewStatusColor(data?.tripStatus)?.css} px-2 py-0.5 rounded`}
                >
                  {data?.tripStatus}
                </span>
              </div>
              <div className="flex items-center gap-6">
                <Label className="min-w-[153px] text-sm font-semibold capitalize">Type:</Label>
                <span className="text-[#3A3A3A] font-medium">{data?.tripType}</span>
              </div>
              <div className="flex items-center gap-6">
                <Label className="min-w-[153px] text-sm font-semibold capitalize">From:</Label>
                <span className="text-[#3A3A3A] font-medium">
                  {loadError ? "Error map api loading" : !pickUpAddress ? "Error fetching address" : pickUpAddress}
                </span>
              </div>
              <div className="flex items-center gap-6">
                <Label className="min-w-[153px] text-sm font-semibold capitalize">To:</Label>
                <span className="text-[#3A3A3A] font-medium">
                  {loadError ? "Error map api loading" : !dropOffAddress ? "Error fetching address" : dropOffAddress}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ViewTripsPage;
