import { type Libraries, useLoadScript } from "@react-google-maps/api";
import { useQuery } from "@tanstack/react-query";
import { formatDate } from "date-fns";
import { ArrowLeft } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  type BookingDetail,
  type BookingNoteVisibility,
  getUserById,
  useCreateBookingNote,
  useFetchBookingById,
  useFetchBookingHistory,
  useFetchBookingNotes,
  // useRetryPartnerDispatch,
  useUpdateBookingStatus,
} from "@/api";
import { ChauffeurAssignModal } from "@/components/booking/ChauffeurAssignModal";
import { ManualChauffeurAssignModal } from "@/components/booking/ManualChauffeurAssignModal";
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
import { SelectDropDown } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useSocket } from "@/context/SocketContext";
import { toastPromise } from "@/hooks/use-toast";
import { usePermission } from "@/hooks/usePermission";
import { constant } from "@/lib/constant";
import { queryKeys } from "@/lib/queryKeys";
import { env } from "@/utils/env";
import { formatFieldValue } from "@/utils/formatters";
import { geoDecoding } from "@/utils/googleMaps";

const libraries = ["places", "geocoding"];
const ViewBookingPage = () => {
  const { id } = useParams();
  const [googleMapsApiKey] = useState<string | null>(
    env?.VITE_GOOGLE_MAP_KEY ?? "",
  );
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  // console.log("user:", user?.roles);
  // console.log("user:",user?.roles?.includes("Super Admin"))
  const [Locations, setLocations] = useState<{
    pickUpAddress: string;
    dropOffAddress: string;
  }>({ pickUpAddress: "", dropOffAddress: "" });

  // Return trip locations state
  const [returnLocations, setReturnLocations] = useState<{
    pickUpAddress: string;
    dropOffAddress: string;
  }>({ pickUpAddress: "", dropOffAddress: "" });
  const {
    data: apiResponse,
    isFetching,
    isError,
    refetch,
  } = useFetchBookingById({ id });

  // Extract booking data from new API response structure
  const data: BookingDetail | undefined = apiResponse?.onward?.booking;
  const returnBooking = apiResponse?.return?.booking;
  const isRoundTrip = apiResponse?.isRoundTrip;

  const { data: passengerUser } = useQuery({
    queryKey: queryKeys.bookingPassengerUser.detail(data?.userId),
    queryFn: () => getUserById(data?.userId),
    enabled: !!data?.userId && !data?.thirdPartyUser && !data?.guestUser,
    refetchOnWindowFocus: false,
    retry: false,
  });
  const { role } = usePermission();
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isReturnAssignModalOpen, setIsReturnAssignModalOpen] = useState(false);
  const [isManualAssignModalOpen, setIsManualAssignModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"onward" | "return" | "notes">(
    "onward",
  );
  const updateStatusMutation = useUpdateBookingStatus();
  // const retryDispatchMutation = useRetryPartnerDispatch();
  const {
    data: bookingHistoryData,
    isFetching: isHistoryFetching,
    isError: isHistoryError,
    refetch: refetchHistory,
  } = useFetchBookingHistory({ bookingId: id });

  // Fetch return trip booking history
  const {
    data: returnBookingHistoryData,
    isFetching: isReturnHistoryFetching,
    isError: isReturnHistoryError,
    refetch: refetchReturnHistory,
  } = useFetchBookingHistory({ bookingId: returnBooking?.id });
  const {
    data: notesData,
    isFetching: isNotesFetching,
    refetch: refetchNotes,
  } = useFetchBookingNotes({ bookingId: id });
  const createNoteMutation = useCreateBookingNote();
  const [noteMessage, setNoteMessage] = useState("");
  const [noteVisibility, setNoteVisibility] =
    useState<BookingNoteVisibility>("customer_visible");
  // Load Google Maps script
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: googleMapsApiKey || "",
    libraries: libraries as Libraries,
  });
  const visibilityOptions = useMemo(() => {
    const adminRoles = [
      "Super Admin",
      "Regional Admin",
      "Dispatcher",
      "Staff Member",
    ];
    if (adminRoles.includes(role)) {
      return [
        { value: "internal_ops", label: "Internal Ops" },
        { value: "partner_visible", label: "Partner Visible" },
        { value: "customer_visible", label: "Customer Visible" },
      ];
    }
    if (role === "Chauffeur") {
      return [
        { value: "partner_visible", label: "Partner Visible" },
        { value: "customer_visible", label: "Customer Visible" },
      ];
    }
    return [{ value: "customer_visible", label: "Customer Visible" }];
  }, [role]);

  const visibilityLabelMap: Record<BookingNoteVisibility, string> = {
    internal_ops: "Internal Ops",
    partner_visible: "Partner Visible",
    customer_visible: "Customer Visible",
  };

  const visibilityBadgeMap: Record<
    BookingNoteVisibility,
    "black" | "secondary" | "success"
  > = {
    internal_ops: "black",
    partner_visible: "secondary",
    customer_visible: "success",
  };

  const notesList = useMemo(() => {
    const notes = Array.isArray(notesData?.notes) ? notesData?.notes : [];
    return [...notes].sort((a, b) => {
      const aTime = a?.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bTime = b?.createdAt ? new Date(b.createdAt).getTime() : 0;
      return bTime - aTime;
    });
  }, [notesData?.notes]);

  const bookingStatusHistory = useMemo(() => {
    const history = Array.isArray(bookingHistoryData?.history)
      ? bookingHistoryData?.history
      : [];

    return history
      .filter((item) => item?.status)
      .map((item) => {
        const parsedTimestamp = item?.timestamp
          ? formatDate(new Date(item.timestamp), "dd-MM-yyyy hh:mm a")
          : "N/A";
        return {
          status: formatFieldValue(item?.status, "Unknown"),
          timestamp: parsedTimestamp,
          note: formatFieldValue(
            item?.note,
            item?.state === "pending"
              ? "Awaiting this step."
              : "No additional details.",
          ),
          state: item?.state,
        };
      });
  }, [bookingHistoryData?.history]);

  const currentStatusIndex = useMemo(() => {
    const normalizedStatus = (
      bookingHistoryData?.currentStatus ||
      data?.status ||
      ""
    )
      .toString()
      .toLowerCase()
      .trim();
    if (!bookingStatusHistory.length) return 0;
    const foundIndex = bookingStatusHistory.findIndex((item) => {
      const status = item.status.toLowerCase().replace(/\s+/g, "");
      const normalized = normalizedStatus.replace(/\s+/g, "");
      return status === normalized;
    });
    if (foundIndex >= 0) return foundIndex;
    const activeIndex = bookingStatusHistory.findIndex(
      (item) => item.state === "active",
    );
    return activeIndex >= 0 ? activeIndex : bookingStatusHistory.length - 1;
  }, [bookingHistoryData?.currentStatus, bookingStatusHistory, data?.status]);

  const isTerminalFailure = useMemo(() => {
    const terminalStatuses = [
      "nochauffeurfound",
      "nopartnerfound",
      "partnerchauffeurnotfound",
      "cancelled",
    ];
    const currentStatus = (
      bookingHistoryData?.currentStatus ||
      data?.status ||
      ""
    )
      .toString()
      .toLowerCase()
      .replace(/\s+/g, "");
    return terminalStatuses.includes(currentStatus);
  }, [bookingHistoryData?.currentStatus, data?.status]);

  // Return trip status history
  const returnBookingStatusHistory = useMemo(() => {
    const history = Array.isArray(returnBookingHistoryData?.history)
      ? returnBookingHistoryData?.history
      : [];

    return history
      .filter((item) => item?.status)
      .map((item) => {
        const parsedTimestamp = item?.timestamp
          ? formatDate(new Date(item.timestamp), "dd-MM-yyyy hh:mm a")
          : "N/A";
        return {
          status: formatFieldValue(item?.status, "Unknown"),
          timestamp: parsedTimestamp,
          note: formatFieldValue(
            item?.note,
            item?.state === "pending"
              ? "Awaiting this step."
              : "No additional details.",
          ),
          state: item?.state,
        };
      });
  }, [returnBookingHistoryData?.history]);

  const returnCurrentStatusIndex = useMemo(() => {
    const normalizedStatus = (
      returnBookingHistoryData?.currentStatus ||
      returnBooking?.status ||
      ""
    )
      .toString()
      .toLowerCase()
      .trim();
    if (!returnBookingStatusHistory.length) return 0;
    const foundIndex = returnBookingStatusHistory.findIndex((item) => {
      const status = item.status.toLowerCase().replace(/\s+/g, "");
      const normalized = normalizedStatus.replace(/\s+/g, "");
      return status === normalized;
    });
    if (foundIndex >= 0) return foundIndex;
    const activeIndex = returnBookingStatusHistory.findIndex(
      (item) => item.state === "active",
    );
    return activeIndex >= 0
      ? activeIndex
      : returnBookingStatusHistory.length - 1;
  }, [
    returnBookingHistoryData?.currentStatus,
    returnBookingStatusHistory,
    returnBooking?.status,
  ]);

  const isReturnTerminalFailure = useMemo(() => {
    const terminalStatuses = [
      "nochauffeurfound",
      "nopartnerfound",
      "partnerchauffeurnotfound",
      "cancelled",
    ];
    const currentStatus = (
      returnBookingHistoryData?.currentStatus ||
      returnBooking?.status ||
      ""
    )
      .toString()
      .toLowerCase()
      .replace(/\s+/g, "");
    return terminalStatuses.includes(currentStatus);
  }, [returnBookingHistoryData?.currentStatus, returnBooking?.status]);

  useEffect(() => {
    const defaultVisibility = visibilityOptions[0]?.value as
      | BookingNoteVisibility
      | undefined;
    if (
      defaultVisibility &&
      !visibilityOptions.some((item) => item.value === noteVisibility)
    ) {
      setNoteVisibility(defaultVisibility);
    }
  }, [noteVisibility, visibilityOptions]);

  const handleCreateNote = async () => {
    const trimmedMessage = noteMessage.trim();
    if (!id || !trimmedMessage) return;
    await toastPromise(
      createNoteMutation.mutateAsync({
        bookingId: id,
        message: trimmedMessage,
        visibility: noteVisibility,
      }),
      {
        loading: "Saving note...",
        success: "Note added",
        error: "Failed to add note",
      },
    );
    setNoteMessage("");
    refetchNotes();
  };
  // Initialize Places Autocomplete
  useEffect(() => {
    let isMounted = true;

    const fetchAddress = async () => {
      if (isLoaded && data && !loadError) {
        try {
          const pickUpAddress = await geoDecoding({
            lat: data?.pickupLocation?.latitude?.toString() ?? "",
            lng: data?.pickupLocation?.longitude?.toString() ?? "",
          });
          const dropOffAddress = await geoDecoding({
            lat: data?.dropoffLocation?.latitude?.toString() ?? "",
            lng: data?.dropoffLocation?.longitude?.toString() ?? "",
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

  // Geocoding for return trip locations
  useEffect(() => {
    let isMounted = true;

    const fetchReturnAddress = async () => {
      if (isLoaded && returnBooking && !loadError) {
        try {
          const pickUpAddress = await geoDecoding({
            lat: returnBooking?.pickupLocation?.latitude?.toString() ?? "",
            lng: returnBooking?.pickupLocation?.longitude?.toString() ?? "",
          });
          const dropOffAddress = await geoDecoding({
            lat: returnBooking?.dropoffLocation?.latitude?.toString() ?? "",
            lng: returnBooking?.dropoffLocation?.longitude?.toString() ?? "",
          });

          if (isMounted) {
            setReturnLocations((prev) => ({
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
          console.error("Geocoding failed for return trip:", err);
        }
      }
    };
    fetchReturnAddress();

    return () => {
      isMounted = false;
    };
  }, [isLoaded, loadError, returnBooking]);

  // Real-time updates via socket
  const { socket } = useSocket();
  useEffect(() => {
    if (!socket || !id) return;

    const handleAssignmentUpdate = (data: any) => {
      console.log("📩 Assignment update received:", data);
      if (data.bookingId === id) {
        refetch();
        refetchHistory();
      }
    };

    const handleStatusUpdate = (data: any) => {
      console.log("📩 Status update received:", data);
      if (data.bookingId === id) {
        refetch();
        refetchHistory();
      }
    };

    socket.on("adminAssignmentUpdate", handleAssignmentUpdate);
    socket.on("bookingStatusUpdate", handleStatusUpdate);

    return () => {
      socket.off("adminAssignmentUpdate", handleAssignmentUpdate);
      socket.off("bookingStatusUpdate", handleStatusUpdate);
    };
  }, [socket, id, refetch, refetchHistory]);

  if (isError) return <ErrorCard refetch={refetch} />;
  if (!isFetching && (!apiResponse || !data?.id)) {
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
              <CardTitle>
                Booking ID: {data?.id}
                {isRoundTrip && (
                  <Badge variant="secondary" className="ml-2">
                    Round Trip
                  </Badge>
                )}
              </CardTitle>
              <CardDescription className="text-sm font-bold">
                Created on:{" "}
                {data?.createdAt
                  ? formatDate(data.createdAt, "dd-MM-yyyy hh:mm a")
                  : "N/A"}{" "}
              </CardDescription>
              <CardAction>
                <div className="flex gap-2">
                  {/* Admin: Assign Partner (Scheduled & Created/Booked) */}
                  {user?.roles?.some((r: string) =>
                    ["Super Admin", "Regional Admin", "Dispatcher"].includes(r),
                  ) &&
                    data?.trip?.tripType === "scheduled" &&
                    typeof data?.status === "string" &&
                    ["created", "booked"].includes(
                      data?.status?.toLowerCase(),
                    ) && (
                      <Button
                        variant="black"
                        className="capitalize"
                        onClick={() => {
                          // On Return tab, open return booking assignment; otherwise onward.
                          if (activeTab === "return" && returnBooking) {
                            setIsReturnAssignModalOpen(true);
                          } else {
                            setIsAssignModalOpen(true);
                          }
                        }}
                        disabled={
                          activeTab === "return"
                            ? Boolean(returnBooking?.partnerId)
                            : Boolean(data?.partnerId)
                        }
                      >
                        {activeTab === "return"
                          ? "Assign Return Partner"
                          : "Assign Partner"}
                      </Button>
                    )}

                  {/* Partner: Dispatch Chauffeur (Scheduled & Accepted/PartnerAssigned) */}
                  {user?.roles?.includes("Partner") &&
                    data?.trip?.tripType === "scheduled" &&
                    typeof data?.status === "string" &&
                    ["partnerassigned", "accepted"].includes(
                      data?.status?.toLowerCase(),
                    ) && (
                      <Button
                        variant="black"
                        className="capitalize"
                        onClick={() => setIsAssignModalOpen(true)}
                      >
                        Dispatch Chauffeur
                      </Button>
                    )}

                  {/* Temporary Removed: Direct Assign and Retry Dispatch */}

                  <SelectDropDown
                    placeholder="Force Status"
                    items={[
                      { label: "Booked", value: "booked" },
                      { label: "Assigned", value: "assigned" },
                      { label: "En Route", value: "enRoute" },
                      { label: "On Location", value: "onLocation" },
                      { label: "Trip Started", value: "tripStarted" },
                      { label: "Completed", value: "completed" },
                      { label: "Cancelled", value: "cancelled" },
                    ]}
                    onChange={async (val) => {
                      await toastPromise(
                        updateStatusMutation.mutateAsync({
                          id: id!,
                          status: val,
                        }),
                        {
                          loading: `Updating to ${val}...`,
                          success: "Status updated",
                          error: "Failed to update status",
                        },
                      );
                    }}
                  />
                  <Button variant="black" className="capitalize">
                    Payment Done
                  </Button>
                </div>
              </CardAction>
            </CardHeader>
            <FieldSeparator />
            <div
              className={`grid gap-6 lg:items-start ${
                returnBooking && activeTab !== "notes"
                  ? "lg:grid-cols-[minmax(0,1fr)_380px]"
                  : "lg:grid-cols-[1fr_380px]"
              }`}
            >
              <Tabs
                value={activeTab}
                onValueChange={(val) =>
                  setActiveTab(val as "onward" | "return" | "notes")
                }
                className="space-y-6 w-full min-w-0"
              >
                <TabsList
                  className={`grid w-full ${
                    returnBooking
                      ? "grid-cols-3 max-w-[480px]"
                      : "grid-cols-2 max-w-[320px]"
                  }`}
                >
                  <TabsTrigger value="onward">Onward</TabsTrigger>
                  {returnBooking ? (
                    <TabsTrigger value="return">Return</TabsTrigger>
                  ) : null}
                  <TabsTrigger value="notes">Notes</TabsTrigger>
                </TabsList>
                <TabsContent value="onward">
                  <CardContent>
                    <h6 className="texfont-montserrat font-bold text-base-black text-sm mb-4">
                      Passenger
                    </h6>
                    <div className="grid grid-cols-[max-content_1fr] gap-4 items-start">
                      <Label className="font-montserrat font-semibold capitalize">
                        Name:
                      </Label>
                      <Label>
                        {formatFieldValue(
                          data?.thirdPartyUser?.name ||
                            data?.guestUser?.name ||
                            `${passengerUser?.firstName || ""} ${passengerUser?.lastName || ""}`.trim() ||
                            null,
                        )}
                      </Label>
                      <Label className="font-montserrat font-semibold capitalize">
                        Email:
                      </Label>
                      <Label>
                        {formatFieldValue(
                          data?.thirdPartyUser?.email ||
                            data?.guestUser?.email ||
                            passengerUser?.email ||
                            null,
                        )}
                      </Label>
                      <Label className="font-montserrat font-semibold capitalize">
                        Phone:
                      </Label>
                      <Label>
                        {formatFieldValue(
                          data?.thirdPartyUser?.phone ||
                            data?.guestUser?.phone ||
                            passengerUser?.phoneNumber ||
                            null,
                        )}
                      </Label>

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
                        Trip Type:
                      </Label>
                      <Badge variant="outline" className="capitalize">
                        {data?.trip?.tripType || "N/A"}
                      </Badge>

                      <Label className="font-montserrat font-semibold capitalize">
                        Fare:
                      </Label>
                      <Label className="font-bold">
                        {data?.trip?.fare
                          ? `$${Number(data.trip.fare).toFixed(2)}`
                          : "N/A"}
                      </Label>
                      <Label className="font-montserrat font-semibold capitalize">
                        Type:
                      </Label>
                      <Label>{formatFieldValue(data?.bookingType)}</Label>

                      <Label className="font-montserrat font-semibold capitalize">
                        From:
                      </Label>
                      <Label>
                        {formatFieldValue(Locations?.pickUpAddress)}
                      </Label>

                      <Label className="font-montserrat font-semibold capitalize">
                        to:
                      </Label>
                      <Label>
                        {formatFieldValue(Locations?.dropOffAddress)}
                      </Label>
                    </div>
                  </CardContent>
                </TabsContent>
                {returnBooking ? (
                  <TabsContent value="return">
                    <CardContent>
                      <h6 className="texfont-montserrat font-bold text-base-black text-sm mb-4 flex items-center justify-between">
                        Return Trip
                      </h6>

                      <div className="grid grid-cols-[max-content_1fr] gap-4 items-start">
                        <Label className="font-montserrat font-semibold capitalize">
                          Return Booking ID:
                        </Label>
                        <Label>{returnBooking?.id}</Label>

                        <Label className="font-montserrat font-semibold capitalize">
                          Return Status:
                        </Label>
                        <Badge variant="outline">{returnBooking?.status}</Badge>

                        <Label className="font-montserrat font-semibold capitalize">
                          Scheduled Time:
                        </Label>
                        <Label>
                          {returnBooking?.scheduledTime
                            ? formatDate(
                                new Date(returnBooking.scheduledTime),
                                "dd-MM-yyyy hh:mm a",
                              )
                            : "N/A"}
                        </Label>

                        <Label className="font-montserrat font-semibold capitalize">
                          From:
                        </Label>
                        <Label>
                          {formatFieldValue(returnLocations?.pickUpAddress)}
                        </Label>

                        <Label className="font-montserrat font-semibold capitalize">
                          To:
                        </Label>
                        <Label>
                          {formatFieldValue(returnLocations?.dropOffAddress)}
                        </Label>

                        <Label className="font-montserrat font-semibold capitalize">
                          Partner ID:
                        </Label>
                        <Label>
                          {formatFieldValue(
                            returnBooking?.partnerId,
                            "Not Assigned",
                          )}
                        </Label>
                      </div>
                    </CardContent>
                  </TabsContent>
                ) : null}
                <TabsContent value="notes">
                  <CardContent className="space-y-6">
                    <div className="space-y-3 rounded border border-base-light-gray/60 p-4">
                      <h6 className="font-montserrat font-bold text-base-black text-sm">
                        Add Note
                      </h6>
                      <Textarea
                        placeholder="Add booking note"
                        className="min-h-24"
                        value={noteMessage}
                        onChange={(event) => setNoteMessage(event.target.value)}
                      />
                      <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
                        <SelectDropDown
                          value={noteVisibility}
                          onChange={(value) =>
                            setNoteVisibility(value as BookingNoteVisibility)
                          }
                          items={visibilityOptions}
                          placeholder="Select visibility"
                          classname="w-full"
                        />
                        <Button
                          type="button"
                          variant="black"
                          className="w-full sm:w-auto"
                          onClick={handleCreateNote}
                          disabled={
                            createNoteMutation.isPending || !noteMessage.trim()
                          }
                        >
                          Add Note
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <h6 className="font-montserrat font-bold text-base-black text-sm">
                          Notes
                        </h6>
                        <span className="text-xs text-base-gray">
                          {isNotesFetching
                            ? "Loading..."
                            : `${notesList.length} notes`}
                        </span>
                      </div>
                      {isNotesFetching ? (
                        <Spinner />
                      ) : notesList.length ? (
                        <div className="space-y-3">
                          {notesList.map((note) => (
                            <div
                              key={note.id}
                              className="rounded border border-base-light-gray/60 p-4 space-y-2"
                            >
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <div className="flex flex-wrap items-center gap-2 text-xs text-base-gray">
                                  <span>
                                    {note?.createdAt
                                      ? formatDate(
                                          new Date(note.createdAt),
                                          "dd-MM-yyyy hh:mm a",
                                        )
                                      : "N/A"}
                                  </span>
                                  <span>•</span>
                                  <span className="capitalize">
                                    {formatFieldValue(
                                      note?.senderRole,
                                      "Unknown",
                                    )}
                                  </span>
                                </div>
                                <Badge
                                  variant={visibilityBadgeMap[note.visibility]}
                                >
                                  {visibilityLabelMap[note.visibility]}
                                </Badge>
                              </div>
                              <p className="text-sm text-base-black">
                                {formatFieldValue(note?.message)}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-base-gray">
                          No notes yet. Add the first update above.
                        </p>
                      )}
                    </div>
                  </CardContent>
                </TabsContent>
              </Tabs>
              {/* Lifecycle Cards - Tab controlled */}
              {activeTab === "notes" ? null : (
                <div
                  className={`flex flex-col gap-4 ${returnBooking ? "xl:flex-row xl:flex-wrap" : ""}`}
                >
                  {/* Onward Trip Lifecycle */}
                  {activeTab === "onward" ? (
                    <CardContent
                      className={`space-y-6 rounded-2xl border border-base-light-gray/60 bg-base-white p-5 shadow-sm min-h-[520px] flex-1 ${returnBooking ? "xl:w-[360px] xl:flex-none" : "w-[360px]"}`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <h6 className="font-montserrat text-sm font-semibold text-base-black">
                            {returnBooking
                              ? "Onward Trip Lifecycle"
                              : "Booking Lifecycle"}
                          </h6>
                          <Badge
                            variant="secondary"
                            className="text-[10px] uppercase"
                          >
                            {returnBooking ? "Onward Trip" : "Active Trip"}
                          </Badge>
                        </div>
                        <p className="text-xs text-base-gray">
                          Live status timeline with estimated progress.
                        </p>
                      </div>
                      <div className="space-y-6">
                        {isHistoryFetching ? (
                          <Spinner />
                        ) : isHistoryError ? (
                          <div className="space-y-3 text-sm text-base-gray">
                            <p>Unable to load booking lifecycle history.</p>
                            <Button
                              type="button"
                              variant="outlinePrimary"
                              className="w-full"
                              onClick={() => refetchHistory()}
                            >
                              Retry
                            </Button>
                          </div>
                        ) : bookingStatusHistory.length ? (
                          bookingStatusHistory.map((item, index) => {
                            const isActive =
                              item.state === "active" ||
                              (!isTerminalFailure &&
                                index === currentStatusIndex);
                            const isCompleted =
                              item.state === "completed" ||
                              (!isTerminalFailure &&
                                index < currentStatusIndex);
                            const dotClasses = isCompleted
                              ? "border-base-black bg-base-black"
                              : isActive
                                ? "border-base-black bg-base-white"
                                : "border-base-light-gray bg-base-white";
                            const lineClasses = isCompleted
                              ? "bg-base-black"
                              : "bg-base-light-gray/80";
                            const titleClasses = isActive
                              ? "text-base-black"
                              : isCompleted
                                ? "text-base-black"
                                : "text-base-gray";
                            const timestampClasses =
                              isCompleted || isActive
                                ? "text-base-gray"
                                : "text-base-gray/70";

                            return (
                              <div
                                key={`${item.status}-${item.timestamp}-${index}`}
                                className="relative pl-7"
                              >
                                {index < bookingStatusHistory.length - 1 ? (
                                  <span
                                    className={`absolute left-[37px] top-6 h-full w-0.5 ${lineClasses}`}
                                  />
                                ) : null}
                                <div className="flex items-start gap-3">
                                  <div
                                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${dotClasses}`}
                                  >
                                    {isCompleted ? (
                                      <span className="text-[10px] font-semibold text-white">
                                        ✓
                                      </span>
                                    ) : isActive ? (
                                      <span className="h-2 w-2 rounded-full bg-base-black" />
                                    ) : null}
                                  </div>
                                  <div className="flex-1 space-y-1">
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                      <span
                                        className={`text-sm font-semibold ${titleClasses}`}
                                      >
                                        {item.status}
                                      </span>
                                      <span
                                        className={`text-[11px] font-medium ${timestampClasses}`}
                                      >
                                        {item.timestamp}
                                      </span>
                                    </div>
                                    <p className="text-xs text-base-gray leading-relaxed">
                                      {item.note}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <p className="text-sm text-base-gray">
                            No booking lifecycle data available yet.
                          </p>
                        )}
                      </div>
                    </CardContent>
                  ) : null}

                  {/* Return Trip Lifecycle */}
                  {returnBooking && activeTab === "return" ? (
                    <CardContent className="space-y-6 rounded-2xl border border-base-light-gray/60 bg-base-white p-5 shadow-sm min-h-[520px] flex-1 xl:w-[360px] xl:flex-none">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <h6 className="font-montserrat text-sm font-semibold text-base-black">
                            Return Trip Lifecycle
                          </h6>
                          <Badge
                            variant="secondary"
                            className="text-[10px] uppercase"
                          >
                            Return Trip
                          </Badge>
                        </div>
                        <p className="text-xs text-base-gray">
                          Return trip status timeline.
                        </p>
                      </div>
                      <div className="space-y-6">
                        {isReturnHistoryFetching ? (
                          <Spinner />
                        ) : isReturnHistoryError ? (
                          <div className="space-y-3 text-sm text-base-gray">
                            <p>Unable to load return trip lifecycle history.</p>
                            <Button
                              type="button"
                              variant="outlinePrimary"
                              className="w-full"
                              onClick={() => refetchReturnHistory()}
                            >
                              Retry
                            </Button>
                          </div>
                        ) : returnBookingStatusHistory.length ? (
                          returnBookingStatusHistory.map((item, index) => {
                            const isActive =
                              item.state === "active" ||
                              (!isReturnTerminalFailure &&
                                index === returnCurrentStatusIndex);
                            const isCompleted =
                              item.state === "completed" ||
                              (!isReturnTerminalFailure &&
                                index < returnCurrentStatusIndex);
                            const dotClasses = isCompleted
                              ? "border-base-black bg-base-black"
                              : isActive
                                ? "border-base-black bg-base-white"
                                : "border-base-light-gray bg-base-white";
                            const lineClasses = isCompleted
                              ? "bg-base-black"
                              : "bg-base-light-gray/80";
                            const titleClasses = isActive
                              ? "text-base-black"
                              : isCompleted
                                ? "text-base-black"
                                : "text-base-gray";
                            const timestampClasses =
                              isCompleted || isActive
                                ? "text-base-gray"
                                : "text-base-gray/70";

                            return (
                              <div
                                key={`return-${item.status}-${item.timestamp}-${index}`}
                                className="relative pl-7"
                              >
                                {index <
                                returnBookingStatusHistory.length - 1 ? (
                                  <span
                                    className={`absolute left-[37px] top-6 h-full w-0.5 ${lineClasses}`}
                                  />
                                ) : null}
                                <div className="flex items-start gap-3">
                                  <div
                                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${dotClasses}`}
                                  >
                                    {isCompleted ? (
                                      <span className="text-[10px] font-semibold text-white">
                                        ✓
                                      </span>
                                    ) : isActive ? (
                                      <span className="h-2 w-2 rounded-full bg-base-black" />
                                    ) : null}
                                  </div>
                                  <div className="flex-1 space-y-1">
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                      <span
                                        className={`text-sm font-semibold ${titleClasses}`}
                                      >
                                        {item.status}
                                      </span>
                                      <span
                                        className={`text-[11px] font-medium ${timestampClasses}`}
                                      >
                                        {item.timestamp}
                                      </span>
                                    </div>
                                    <p className="text-xs text-base-gray leading-relaxed">
                                      {item.note}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <p className="text-sm text-base-gray">
                            No return trip lifecycle data available yet.
                          </p>
                        )}
                      </div>
                    </CardContent>
                  ) : null}
                </div>
              )}
            </div>
          </CardBody>
        </Card>
      )}
      {user?.roles?.includes("Super Admin") ||
      user?.roles?.includes("Regional Admin") ? (
        <>
          <PartnerAssignModal
            isOpen={isAssignModalOpen}
            onOpenChange={setIsAssignModalOpen}
            bookingId={id || ""}
          />
          {returnBooking && (
            <PartnerAssignModal
              isOpen={isReturnAssignModalOpen}
              onOpenChange={setIsReturnAssignModalOpen}
              bookingId={returnBooking?.id || ""}
            />
          )}
          <ManualChauffeurAssignModal
            isOpen={isManualAssignModalOpen}
            onOpenChange={setIsManualAssignModalOpen}
            bookingId={id || ""}
            vehicleType={data?.vehicleType}
          />
        </>
      ) : (
        user?.roles.includes("Partner") && (
          <ChauffeurAssignModal
            isOpen={isAssignModalOpen}
            onOpenChange={setIsAssignModalOpen}
            bookingId={id || ""}
          />
        )
      )}
    </div>
  );
};

export default ViewBookingPage;
