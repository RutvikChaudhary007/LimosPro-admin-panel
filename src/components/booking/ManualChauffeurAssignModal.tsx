import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useFetchAllChauffeur } from "@/api";
import { Spinner } from "@/components/Spinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSocket } from "@/context/SocketContext";

// interface Chauffeur {
//   id: string;
//   partnerId: string;
//   userFirstName: string;
//   userLastName: string;
//   userEmail: string;
//   userPhoneNumber: string;
//   status: string;
//   rating: string;
//   partner?: {
//     id: string;
//     companyName: string;
//   };
//   vehicle?: {
//     make: string;
//     model: string;
//     vehicleType: string;
//   };
// }

interface ManualChauffeurAssignModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  bookingId: string;
  vehicleType?: string;
}

export const ManualChauffeurAssignModal = ({
  isOpen,
  onOpenChange,
  bookingId,
  vehicleType,
}: ManualChauffeurAssignModalProps) => {
  const { socket } = useSocket();
  const [isAssigning, setIsAssigning] = useState<string | null>(null);

  const {
    data: chauffeurs,
    isLoading,
    refetch,
  } = useFetchAllChauffeur({
    status: "active",
    limit: 100,
  });

  useEffect(() => {
    if (isOpen) {
      refetch();
    }
  }, [isOpen, refetch]);

  useEffect(() => {
    if (!socket || !bookingId || !isOpen) return;

    const handleRequested = (data: { success: boolean; message: string }) => {
      if (data.success) {
        toast.success("Manual assignment request sent");
        onOpenChange(false);
      } else {
        toast.error(data.message || "Failed to assign chauffeur");
      }
      setIsAssigning(null);
    };

    const handleError = (err: { message: string }) => {
      toast.error(err.message || "Something went wrong");
      setIsAssigning(null);
    };

    socket.on("partnerAssignmentRequested", handleRequested);
    socket.on("bookingError", handleError);

    return () => {
      socket.off("partnerAssignmentRequested", handleRequested);
      socket.off("bookingError", handleError);
    };
  }, [socket, bookingId, isOpen, onOpenChange]);

  const handleAssign = (chauffeurId: string, partnerId: string) => {
    if (!socket) return;
    setIsAssigning(chauffeurId);
    socket.emit("requestPartnerAssignment", {
      bookingId,
      partnerId,
      chauffeurId,
      tripType: "manual",
    });
  };

  const chauffeursList = Array.isArray(chauffeurs)
    ? chauffeurs
    : (chauffeurs as any)?.chauffeurs || [];

  const filteredChauffeurs =
    chauffeursList?.filter(
      (c: any) =>
        !vehicleType ||
        c.vehicle?.vehicleType === vehicleType ||
        c.chauffeurPricing?.some((p: any) => p.vehicleType === vehicleType),
    ) || [];

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            Direct Chauffeur Assignment (Super Admin Only)
          </DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          {isLoading ? (
            <div className="flex justify-center p-8">
              <Spinner />
            </div>
          ) : filteredChauffeurs.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No available online chauffeurs found{" "}
              {vehicleType ? `for ${vehicleType}` : ""}.
            </div>
          ) : (
            <div className="max-h-[400px] overflow-y-auto space-y-3 pr-2">
              {filteredChauffeurs.map((chauffeur: any) => (
                <div
                  key={chauffeur.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/5 transition-colors"
                >
                  <div className="space-y-1">
                    <h4 className="font-semibold">
                      {chauffeur.userFirstName} {chauffeur.userLastName}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {chauffeur.userEmail}
                    </p>
                    <div className="text-xs text-muted-foreground flex flex-col gap-1">
                      {chauffeur.partner?.companyName && (
                        <span>Partner: {chauffeur.partner.companyName}</span>
                      )}
                      {chauffeur.vehicle && (
                        <span>
                          Vehicle: {chauffeur.vehicle.make}{" "}
                          {chauffeur.vehicle.model}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="success">Online</Badge>
                      {(chauffeur.vehicle?.vehicleType ||
                        chauffeur.chauffeurPricing?.[0]?.vehicleType) && (
                        <Badge variant="outline">
                          {chauffeur.vehicle?.vehicleType ||
                            chauffeur.chauffeurPricing[0].vehicleType}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    loading={isAssigning === chauffeur.id}
                    disabled={!!isAssigning}
                    onClick={() =>
                      handleAssign(chauffeur.id, chauffeur.partnerId)
                    }
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
