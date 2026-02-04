import { type Libraries, useLoadScript } from "@react-google-maps/api";
import { useQuery } from "@tanstack/react-query";
import { formatDate } from "date-fns";
import { ArrowLeft } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  type BookingNoteVisibility,
  getUserById,
  useCreateBookingNote,
  useFetchBookingById,
  useFetchBookingHistory,
  useFetchBookingNotes,
} from "@/api";
import { ChauffeurAssignModal } from "@/components/booking/ChauffeurAssignModal";
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
import { toastPromise } from "@/hooks/use-toast";
import { usePermission } from "@/hooks/usePermission";
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
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  // console.log("user:", user?.roles);
  // console.log("user:",user?.roles?.includes("Super Admin"))
  const [Locations, setLocations] = useState<{
    pickUpAddress: string;
    dropOffAddress: string;
  }>({ pickUpAddress: "", dropOffAddress: "" });
  const { data, isFetching, isError, refetch } = useFetchBookingById({ id });
  const { data: passengerUser } = useQuery({
    queryKey: ["bookingPassengerUser", data?.userId],
    queryFn: () => getUserById(data?.userId),
    enabled: !!data?.userId && !data?.thirdPartyUser,
    refetchOnWindowFocus: false,
    retry: false,
  });
  const { role } = usePermission();
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const {
    data: bookingHistoryData,
    isFetching: isHistoryFetching,
    isError: isHistoryError,
    refetch: refetchHistory,
  } = useFetchBookingHistory({ bookingId: id });
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
    const normalizedHistory = history
      .filter((item) => item?.status)
      .map((item) => {
        const parsedTimestamp = item?.timestamp
          ? formatDate(new Date(item.timestamp), "dd-MM-yyyy hh:mm a")
          : "N/A";
        return {
          status: formatFieldValue(item?.status, "Unknown"),
          timestamp: parsedTimestamp,
          note: formatFieldValue(item?.note, "No additional details."),
          state: item?.state,
        };
      });

    if (normalizedHistory.length) {
      const hasPending = normalizedHistory.some(
        (item) => item.status.toLowerCase() === "pending",
      );
      if (!hasPending) {
        const pendingTimestamp = data?.createdAt
          ? formatDate(new Date(data.createdAt), "dd-MM-yyyy hh:mm a")
          : normalizedHistory[normalizedHistory.length - 1]?.timestamp || "N/A";
        return [
          {
            status: "Pending",
            timestamp: pendingTimestamp,
            note: "Booking created and pending confirmation.",
            state: "completed",
          },
          ...normalizedHistory,
        ];
      }
      return normalizedHistory;
    }

    if (data?.status) {
      const currentTimestamp = data?.updatedAt
        ? formatDate(new Date(data.updatedAt), "dd-MM-yyyy hh:mm a")
        : data?.createdAt
          ? formatDate(new Date(data.createdAt), "dd-MM-yyyy hh:mm a")
          : "N/A";
      const currentStatus = formatFieldValue(data?.status, "Unknown");
      const pendingTimestamp = data?.createdAt
        ? formatDate(new Date(data.createdAt), "dd-MM-yyyy hh:mm a")
        : currentTimestamp;

      const fallbackHistory = [
        {
          status: "Pending",
          timestamp: pendingTimestamp,
          note: "Booking created and pending confirmation.",
          state: "completed",
        },
        {
          status: currentStatus,
          timestamp: currentTimestamp,
          note: "Current booking status.",
          state: "active",
        },
      ];

      if (currentStatus.toLowerCase() === "pending") {
        return fallbackHistory.slice(0, 1);
      }

      return fallbackHistory;
    }

    return [];
  }, [
    bookingHistoryData?.history,
    data?.status,
    data?.updatedAt,
    data?.createdAt,
  ]);

  const currentStatusIndex = useMemo(() => {
    const normalizedStatus = (
      bookingHistoryData?.currentStatus ||
      data?.status ||
      ""
    )
      .toString()
      .toLowerCase();
    if (!bookingStatusHistory.length) return 0;
    const foundIndex = bookingStatusHistory.findIndex((item) => {
      const status = item.status.toLowerCase();
      return (
        status === normalizedStatus ||
        status.replace(/\s+/g, "") === normalizedStatus
      );
    });
    if (foundIndex >= 0) return foundIndex;
    const activeIndex = bookingStatusHistory.findIndex(
      (item) => item.state === "active",
    );
    return activeIndex >= 0 ? activeIndex : bookingStatusHistory.length - 1;
  }, [bookingHistoryData?.currentStatus, bookingStatusHistory, data?.status]);

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
                    ["created", "booked", "assigned"].includes(
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
            <div className="grid gap-6 lg:grid-cols-[1fr_360px] lg:items-start">
              <Tabs defaultValue="details" className="space-y-6 max-w-[720px]">
                <TabsList className="grid w-full grid-cols-2 max-w-[320px]">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="notes">Notes</TabsTrigger>
                </TabsList>
                <TabsContent value="details">
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

                      <Label className="font-montserrat font-semibold capitalize">
                        price:
                      </Label>
                      <Label>{formatFieldValue(data?.price, "N/A")}</Label>
                    </div>
                  </CardContent>
                </TabsContent>
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
              <CardContent className="space-y-6 rounded-2xl border border-base-light-gray/60 bg-base-white p-5 shadow-sm min-h-[520px]">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h6 className="font-montserrat text-sm font-semibold text-base-black">
                      Booking Lifecycle
                    </h6>
                    <Badge
                      variant="secondary"
                      className="text-[10px] uppercase"
                    >
                      Active Trip
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
                        item.state === "active" || index === currentStatusIndex;
                      const isCompleted =
                        item.state === "completed" ||
                        index < currentStatusIndex;
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
            </div>
          </CardBody>
        </Card>
      )}
      {user?.roles?.includes("Super Admin") ||
      user?.roles?.includes("Regional Admin") ? (
        <PartnerAssignModal
          isOpen={isAssignModalOpen}
          onOpenChange={setIsAssignModalOpen}
          bookingId={id || ""}
        />
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
