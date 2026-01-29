import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Spinner } from "@/components/Spinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSocket } from "@/context/SocketContext"; // Assuming there's a socket context

interface Partner {
  partnerId: string;
  companyName: string;
  businessEmail: string;
  slaScore: number;
}

interface PartnerAssignModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  bookingId: string;
}

export const PartnerAssignModal = ({
  isOpen,
  onOpenChange,
  bookingId,
}: PartnerAssignModalProps) => {
  const { socket } = useSocket();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAssigning, setIsAssigning] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && socket && bookingId) {
      setIsLoading(true);
      socket.emit("getAvailablePartners", { bookingId });

      const handlePartners = (data: { partners: Partner[] }) => {
        // console.log("partners:",data)
        setPartners(data.partners || []);
        setIsLoading(false);
      };

      const handleRequested = (data: { success: boolean; message: string }) => {
        if (data.success) {
          toast.success("Assignment requested successfully");
          onOpenChange(false);
          setIsAssigning(null);
        } else {
          toast.error(data.message || "Failed to request assignment");
          setIsAssigning(null);
        }
        setIsAssigning(null);
      };

      const handleError = (err: { message: string }) => {
        toast.error(err.message || "Something went wrong");
        setIsLoading(false);
        setIsAssigning(null);
      };

      socket.on("availablePartners", handlePartners);
      socket.on("partnerAssignmentRequested", handleRequested);
      socket.on("bookingError", handleError);

      return () => {
        socket.off("availablePartners", handlePartners);
        socket.off("partnerAssignmentRequested", handleRequested);
        socket.off("bookingError", handleError);
      };
    }
  }, [isOpen, socket, bookingId, onOpenChange]);

  const handleAssign = (partnerId: string) => {
    if (!socket) return;
    setIsAssigning(partnerId);
    socket.emit("requestPartnerAssignment", {
      bookingId,
      partnerId,
      tripType: "manual", // or derive from booking
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Assign Partner</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          {isLoading ? (
            <div className="flex justify-center p-8">
              <Spinner />
            </div>
          ) : partners.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No available partners found.
            </div>
          ) : (
            <div className="max-h-[400px] overflow-y-auto space-y-3 pr-2">
              {partners.map((partner) => (
                <div
                  key={partner.partnerId}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/5 transition-colors"
                >
                  <div className="space-y-1">
                    <h4 className="font-semibold">{partner.companyName}</h4>
                    <p className="text-sm text-muted-foreground">
                      {partner.businessEmail}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        SLA Score:
                      </span>
                      <Badge
                        variant={partner.slaScore > 80 ? "success" : "warning"}
                      >
                        {partner.slaScore.toFixed(1)}%
                      </Badge>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    loading={isAssigning === partner.partnerId}
                    disabled={!!isAssigning}
                    onClick={() => handleAssign(partner.partnerId)}
                  >
                    Assign
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
