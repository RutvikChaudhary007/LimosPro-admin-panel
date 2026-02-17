import { Clock, DollarSign, MapPin, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSocket } from "@/context/SocketContext";
import { constant } from "@/lib/constant";
import { tokenManager } from "@/services/tokenManager";
import { useUserStore } from "@/stores/useAuthStore";

export function PartnerBookingNotification() {
  const { socket } = useSocket();
  const { user } = useUserStore();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [requestData, setRequestData] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const toastId = useRef<string | number | null>(null);

  useEffect(() => {
    const isPartner = user?.roles?.some(
      (role) => role.toLowerCase() === "partner",
    );

    if (!socket || !isPartner) return;

    const handleNewRequest = (data: any) => {
      console.log("📩 Received newPartnerBookingRequest:", data);

      setRequestData(data);
      setIsOpen(true);

      // Dismiss previous toast if exists
      if (toastId.current) toast.dismiss(toastId.current);

      const id = toast.info("New Booking Request Received!", {
        description: "You have a new booking waiting for your response.",
        duration: 20000,
      });
      toastId.current = id;
    };

    const handleAssignmentAccepted = (data: any) => {
      if (data.bookingId === requestData?.bookingId) {
        setIsOpen(false);
        setIsProcessing(false);
        setRequestData(null);
        if (toastId.current) toast.dismiss(toastId.current); // Dismiss toast
        toast.success("Booking Assigned Successfully");
        navigate(
          constant.ROUTING_URLS.VIEW_BOOKING.replace(":id", data.bookingId),
        );
      }
    };

    const handleAssignmentRejected = (data: any) => {
      if (data.bookingId === requestData?.bookingId) {
        setIsOpen(false);
        setIsProcessing(false);
        setRequestData(null);
        if (toastId.current) toast.dismiss(toastId.current); // Dismiss toast
        toast.info("Booking request rejected");
      }
    };

    const handleError = (err: any) => {
      toast.error(err.message || "An error occurred with the booking request");
      setIsProcessing(false);
    };

    socket.on("newPartnerBookingRequest", handleNewRequest);
    socket.on("partnerAssignmentAccepted", handleAssignmentAccepted);
    socket.on("partnerAssignmentRejected", handleAssignmentRejected);
    socket.on("bookingError", handleError);

    return () => {
      socket.off("newPartnerBookingRequest", handleNewRequest);
      socket.off("partnerAssignmentAccepted", handleAssignmentAccepted);
      socket.off("partnerAssignmentRejected", handleAssignmentRejected);
      socket.off("bookingError", handleError);
    };
  }, [socket, user, requestData, navigate]);

  const handleAccept = () => {
    const token = tokenManager.getAccessToken();
    if (!socket || !requestData || !token) return;
    setIsProcessing(true);
    socket.emit("partnerAcceptAssignment", {
      bookingId: requestData.bookingId,
      assignmentId: requestData.assignmentId,
      token,
    });
  };

  const handleReject = () => {
    const token = tokenManager.getAccessToken();
    if (!socket || !requestData || !token) return;
    setIsProcessing(true);
    socket.emit("partnerRejectAssignment", {
      bookingId: requestData.bookingId,
      assignmentId: requestData.assignmentId,
      token,
    });
  };

  console.log("🚀 ~ PartnerBookingNotification ~ requestData:", requestData);
  if (!requestData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>New Booking Request</DialogTitle>
          <DialogDescription>
            You have received a new booking request. Please review and respond
            within the timeout period.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          {/* Booking Type */}
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <p className="text-xs text-muted-foreground uppercase">
                Trip Type
              </p>
              <p className="font-semibold capitalize">
                {requestData.trip?.tripType || "N/A"}
              </p>
            </div>
            <Badge variant="outline">Awaiting Action</Badge>
          </div>

          {/* Locations */}
          <div className="space-y-3">
            <div className="p-3 border rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="w-3 h-3 text-muted-foreground" />
                <p className="text-xs text-muted-foreground uppercase">
                  Pickup
                </p>
              </div>
              <p className="text-sm font-medium">
                {requestData.booking?.pickupLocation?.address || "N/A"}
              </p>
            </div>
            <div className="p-3 border rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="w-3 h-3 text-muted-foreground" />
                <p className="text-xs text-muted-foreground uppercase">
                  Dropoff
                </p>
              </div>
              <p className="text-sm font-medium">
                {requestData.booking?.dropoffLocation?.address || "N/A"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 border rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-3 h-3 text-muted-foreground" />
                <p className="text-xs text-muted-foreground uppercase">
                  Scheduled Time
                </p>
              </div>
              <p className="text-sm font-semibold">
                {requestData.booking?.scheduledTime
                  ? new Date(requestData.booking.scheduledTime).toLocaleString()
                  : "Immediate"}
              </p>
            </div>
            <div className="p-3 border rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign className="w-3 h-3 text-muted-foreground" />
                <p className="text-xs text-muted-foreground uppercase">Fare</p>
              </div>
              <p className="text-sm font-semibold">
                ${Number(requestData.trip?.fare || 0).toFixed(2)}
              </p>
            </div>
          </div>

          <div className="p-3 border rounded-lg">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-muted-foreground" />
              <p className="text-sm">
                <span className="text-muted-foreground">Passenger:</span>{" "}
                <span className="font-semibold">
                  {requestData.passenger?.name || "Anonymous"}
                </span>
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            className="flex-1"
            onClick={handleReject}
            disabled={isProcessing}
          >
            Reject
          </Button>
          <Button
            className="flex-1"
            onClick={handleAccept}
            disabled={isProcessing}
            loading={isProcessing}
          >
            Accept Booking
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
