import {
  Activity,
  AlertTriangle,
  Car,
  MapPin,
  Radio,
  Timer,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFetchAllTrips } from "@/api";
import { PageHeader } from "@/components/layouts/PageHeader";
import { Spinner } from "@/components/Spinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  MetricCard,
} from "@/components/ui/card";
import { useSocket } from "@/context/SocketContext";
import { constant } from "@/lib/constant";

export default function DispatchDashboardPage() {
  const navigate = useNavigate();
  const { socket } = useSocket();
  const [activeBroadcasts, setActiveBroadcasts] = useState<any[]>([]);

  // Fetch active trips (in-progress or pending assignment)
  const { data: tripsData, isLoading } = useFetchAllTrips({
    tripStatus: "pending,inProgress",
    limit: 50,
  });

  useEffect(() => {
    if (!socket) return;

    const handleNewBooking = (data: any) => {
      console.log("📩 Admin received new booking broadcast:", data);
      if (!data.bookingId) return;
      setActiveBroadcasts((prev) => {
        // Prevent duplicates
        if (prev.find((b) => b.bookingId === data.bookingId)) return prev;
        return [...prev, { ...data, timestamp: Date.now() }];
      });
    };

    const handleBookingUpdate = (data: any) => {
      console.log("📩 Admin received booking update:", data);
      if (data.status === "ACCEPTED" || data.status === "CANCELLED") {
        setActiveBroadcasts((prev) =>
          prev.filter((b) => b.bookingId !== data.bookingId),
        );
      }
    };

    socket.on("adminNewBooking", handleNewBooking);
    socket.on("adminAssignmentUpdate", handleBookingUpdate);

    return () => {
      socket.off("adminNewBooking", handleNewBooking);
      socket.off("adminAssignmentUpdate", handleBookingUpdate);
    };
  }, [socket]);

  // Clean up old broadcasts
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveBroadcasts((prev) =>
        prev.filter((b) => Date.now() - (b.timestamp || Date.now()) < 20000),
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) return <Spinner />;

  const tripsNeedingAttention =
    tripsData?.trips?.filter(
      (t: any) =>
        t.tripStatus === "noChauffeurFound" ||
        t.tripStatus === "noPartnerFound" ||
        t.booking?.status === "noChauffeurFound" ||
        t.booking?.status === "noPartnerFound",
    ) || [];

  return (
    <div className="p-6 space-y-8 md:p-8 bg-muted/20 min-h-screen">
      <PageHeader
        title="Dispatch Dashboard"
        breadcrumbs={[{ label: "Home", path: "/" }, { label: "Dispatch" }]}
      />

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="All Active Trips"
          value={String(tripsData?.trips?.length || 0)}
          icon={<Activity className="w-4 h-4" />}
          bgClass="bg-blue-50/50"
          wrapperClass="border-blue-100 shadow-sm"
        />
        <MetricCard
          title="Needs Attention"
          value={String(tripsNeedingAttention.length)}
          icon={<AlertTriangle className="w-4 h-4" />}
          bgClass="bg-red-50/50"
          wrapperClass="border-red-100 shadow-sm"
          valueClass="text-red-600"
        />
        <MetricCard
          title="Live Broadcasts"
          value={String(activeBroadcasts.length)}
          icon={<Radio className="w-4 h-4 text-primary animate-pulse" />}
          bgClass="bg-primary/5"
          wrapperClass="border-primary/10 shadow-sm"
        />
        <MetricCard
          title="Service Types"
          value="Mixed"
          icon={<Car className="w-4 h-4" />}
          bgClass="bg-green-50/50"
          wrapperClass="border-green-100 shadow-sm"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Active Broadcasts Section */}
        <Card className="shadow-lg border-none bg-base-white ring-1 ring-base-gray/5">
          <CardHeader className="border-b px-6 py-4">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Radio className="w-5 h-5 text-primary" />
              </div>
              Live Assignment Broadcasts
              <Badge
                variant="outline"
                className="ml-auto font-mono text-[10px] uppercase tracking-wider"
              >
                Real-time
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardBody className="p-6">
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {activeBroadcasts.length === 0 ? (
                <div className="text-center py-12 flex flex-col items-center gap-3 border-2 border-dashed rounded-xl border-muted/30">
                  <div className="p-3 bg-muted/10 rounded-full">
                    <Activity className="w-8 h-8 text-muted/40" />
                  </div>
                  <p className="text-muted-foreground font-medium">
                    No live broadcasts currently
                  </p>
                </div>
              ) : (
                activeBroadcasts.map((broadcast) => {
                  const timeLeft = Math.max(
                    0,
                    20 -
                      Math.floor(
                        (Date.now() - (broadcast.timestamp || Date.now())) /
                          1000,
                      ),
                  );
                  return (
                    <div
                      key={broadcast.bookingId}
                      className="group relative flex items-center justify-between p-5 border rounded-xl bg-gradient-to-r from-primary/5 to-transparent border-primary/10 hover:border-primary/30 transition-all"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-primary px-2 py-0.5 bg-primary/10 rounded uppercase tracking-tighter">
                            Booking
                          </span>
                          <span className="font-mono text-sm font-semibold">
                            #
                            {broadcast.bookingId?.slice(-8).toUpperCase() ||
                              "N/A"}
                          </span>
                        </div>
                        <div className="text-sm text-base-black/70 flex items-center gap-2">
                          <div className="min-w-4">
                            <MapPin className="w-3.5 h-3.5 text-primary/60" />
                          </div>
                          <span className="truncate max-w-[200px]">
                            {broadcast.pickupLocation?.address ||
                              "Location not found"}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-3">
                        <div className="flex items-center gap-2 px-3 py-1 bg-white shadow-sm border rounded-full">
                          <Timer
                            className={`w-3.5 h-3.5 ${timeLeft < 5 ? "text-red-500 animate-bounce" : "text-primary"}`}
                          />
                          <span
                            className={`font-mono font-bold text-sm ${timeLeft < 5 ? "text-red-500" : "text-primary"}`}
                          >
                            {timeLeft}s
                          </span>
                        </div>
                        <Button
                          size="sm"
                          variant="outlineBlack"
                          className="rounded-full px-5 hover:bg-black hover:text-white transition-colors"
                          onClick={() =>
                            navigate(
                              constant.ROUTING_URLS.VIEW_BOOKING.replace(
                                ":id",
                                broadcast.bookingId,
                              ),
                            )
                          }
                        >
                          Track Flow
                        </Button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardBody>
        </Card>

        {/* Actionable Trips Section */}
        <Card className="shadow-lg border-none bg-base-white ring-1 ring-base-gray/5">
          <CardHeader className="border-b px-6 py-4 text-destructive">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="w-5 h-5" />
              </div>
              Critical: Attention Required
              <Badge variant="destructive" className="ml-auto">
                {tripsNeedingAttention.length} Trips
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardBody className="p-6">
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {tripsNeedingAttention.length === 0 ? (
                <div className="text-center py-12 flex flex-col items-center gap-3 border-2 border-dashed rounded-xl border-muted/30">
                  <div className="p-3 bg-green-50 rounded-full">
                    <Car className="w-8 h-8 text-green-400" />
                  </div>
                  <p className="text-muted-foreground font-medium">
                    All operations running smooth
                  </p>
                </div>
              ) : (
                tripsNeedingAttention.map((trip: any) => (
                  <div
                    key={trip.id}
                    className="group flex items-center justify-between p-5 border rounded-xl border-red-100 bg-red-50/20 hover:bg-red-50/40 transition-colors"
                  >
                    <div className="space-y-1.5">
                      <div className="font-bold text-base-black">
                        #{trip.bookingId}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="destructive"
                          className="text-[10px] py-0 px-2 uppercase tracking-wide"
                        >
                          {trip.tripStatus || trip.booking?.status}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground font-medium uppercase truncate max-w-[120px]">
                          {trip.tripType || "Service"}
                        </span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="rounded-full px-6 shadow-sm hover:shadow-md"
                      onClick={() =>
                        navigate(
                          constant.ROUTING_URLS.VIEW_BOOKING.replace(
                            ":id",
                            trip.id,
                          ),
                        )
                      }
                    >
                      Manage Trip
                    </Button>
                  </div>
                ))
              )}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Global Active Trips List */}
      <Card className="shadow-lg border-none bg-base-white ring-1 ring-base-gray/5">
        <CardHeader className="border-b px-8 py-6">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl">Fleet Activity Monitor</CardTitle>
            <div className="flex gap-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="w-3 h-3 rounded-full bg-green-500"></span>
                Live Feed
              </div>
            </div>
          </div>
        </CardHeader>
        <CardBody className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-muted-foreground uppercase text-[10px] font-bold tracking-[2px]">
                <tr>
                  <th className="px-8 py-4">Booking Reference</th>
                  <th className="px-8 py-4">Customer</th>
                  <th className="px-8 py-4">Dispatch Status</th>
                  <th className="px-8 py-4 text-center">Operation Type</th>
                  <th className="px-8 py-4 text-right">Context</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {tripsData?.trips?.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-8 py-12 text-center text-muted-foreground italic"
                    >
                      No active operations found
                    </td>
                  </tr>
                ) : (
                  tripsData?.trips?.map((trip: any) => (
                    <tr
                      key={trip.id}
                      className="group hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-8 py-5">
                        <span
                          className="font-mono font-bold text-primary group-hover:underline cursor-pointer"
                          onClick={() =>
                            navigate(
                              constant.ROUTING_URLS.VIEW_BOOKING.replace(
                                ":id",
                                trip.id,
                              ),
                            )
                          }
                        >
                          #{trip.bookingId}
                        </span>
                      </td>
                      <td className="px-8 py-5 font-medium">
                        {trip.userName || "Guest User"}
                      </td>
                      <td className="px-8 py-5">
                        <Badge
                          variant="info"
                          className="capitalize bg-blue-100 text-blue-700 hover:bg-blue-100 border-none px-3 font-semibold"
                        >
                          {trip.status}
                        </Badge>
                      </td>
                      <td className="px-8 py-5 text-center">
                        <span className="text-xs font-bold text-muted-foreground uppercase bg-muted px-2 py-1 rounded">
                          {trip.tripType}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="hover:bg-primary/10 hover:text-primary rounded-full px-6"
                          onClick={() =>
                            navigate(
                              constant.ROUTING_URLS.VIEW_BOOKING.replace(
                                ":id",
                                trip.id,
                              ),
                            )
                          }
                        >
                          View Details
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
