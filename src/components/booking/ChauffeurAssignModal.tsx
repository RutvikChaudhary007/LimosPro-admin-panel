import { useEffect } from "react";
import { toast } from "sonner";
import { useAssignChauffeurs } from "@/api";
import { Spinner } from "@/components/Spinner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSocket } from "@/context/SocketContext";

interface ChauffeurAssignModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  bookingId: string;
}

export const ChauffeurAssignModal = ({
  isOpen,
  onOpenChange,
  bookingId,
}: ChauffeurAssignModalProps) => {
  const { socket } = useSocket();
  const {
    mutate: assignChauffeur,
    isPending: isLoading,
    isSuccess,
  } = useAssignChauffeurs();

  // Listen for partner-specific events
  useEffect(() => {
    if (!socket || !bookingId) return;

    const handleBookingAccepted = (data: {
      bookingId: string;
      partnerId?: string;
    }) => {
      if (data.bookingId === bookingId) {
        toast.success("Booking accepted by partner");
        onOpenChange(false);
      }
    };

    const handleBookingRejected = (data: {
      bookingId: string;
      partnerId?: string;
      reason?: string;
    }) => {
      if (data.bookingId === bookingId) {
        toast.error(data.reason || "Booking rejected by partner");
      }
    };

    const handleBookingCancelled = (data: {
      bookingId: string;
      reason?: string;
    }) => {
      if (data.bookingId === bookingId) {
        toast.warning(data.reason || "Booking has been cancelled");
        onOpenChange(false);
      }
    };

    const handleTimeout = (data: { bookingId: string }) => {
      if (data.bookingId === bookingId) {
        toast.warning("Assignment request timed out");
      }
    };

    const handleBookingError = (err: {
      bookingId?: string;
      message?: string;
    }) => {
      if (err.bookingId === bookingId || !err.bookingId) {
        toast.error(err.message || "Booking error occurred");
      }
    };

    socket.on("bookingAccepted", handleBookingAccepted);
    socket.on("bookingRejected", handleBookingRejected);
    socket.on("bookingCancelled", handleBookingCancelled);
    socket.on("assignmentTimeout", handleTimeout);
    socket.on("bookingError", handleBookingError);

    return () => {
      socket.off("bookingAccepted", handleBookingAccepted);
      socket.off("bookingRejected", handleBookingRejected);
      socket.off("bookingCancelled", handleBookingCancelled);
      socket.off("assignmentTimeout", handleTimeout);
      socket.off("bookingError", handleBookingError);
    };
  }, [socket, bookingId, onOpenChange]);

  // Only trigger when modal opens (isOpen becomes true)
  useEffect(() => {
    if (isOpen && bookingId && !isSuccess) {
      assignChauffeur(bookingId);
    }
  }, [isOpen, bookingId, assignChauffeur, isSuccess]);

  // Close modal when assignment is successful
  useEffect(() => {
    if (isSuccess) {
      onOpenChange(false);
    }
  }, [isSuccess, onOpenChange]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Auto-Dispatch Partner</DialogTitle>
        </DialogHeader>
        <div className="py-8 space-y-4">
          {isLoading ? (
            <div className="flex flex-col items-center gap-4">
              <Spinner />
              <p className="text-sm text-muted-foreground">
                Sending auto-dispatch request...
              </p>
            </div>
          ) : isSuccess ? (
            <div className="text-center text-success py-4">
              Auto-dispatch request sent successfully!
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-4">
              Ready to send auto-dispatch request.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
