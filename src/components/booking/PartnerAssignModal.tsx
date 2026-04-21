import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useDispatchPartner, useFetchAvailablePartners } from "@/api";
import { Spinner } from "@/components/Spinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
  const [isAssigning, setIsAssigning] = useState<string | null>(null);
  const dispatchPartnerMutation = useDispatchPartner();
  const { data, isFetching, isError, error, refetch } =
    useFetchAvailablePartners({
      bookingId,
      enabled: isOpen,
    });

  const partners: Partner[] = Array.isArray(data) ? (data as Partner[]) : [];

  useEffect(() => {
    if (isOpen && bookingId) refetch();
  }, [isOpen, bookingId, refetch]);

  useEffect(() => {
    if (!isError) return;
    const message =
      (error as any)?.response?.data?.message ||
      (error as any)?.message ||
      "Failed to load partners";
    toast.error(message);
  }, [isError, error]);

  const handleAssign = async (partnerId: string) => {
    if (!bookingId) return;
    try {
      setIsAssigning(partnerId);
      await dispatchPartnerMutation.mutateAsync({ bookingId, partnerId });
      toast.success("Partner dispatched successfully");
      onOpenChange(false);
    } catch (err) {
      const message =
        (err as any)?.response?.data?.message ||
        (err as any)?.message ||
        "Failed to dispatch partner";
      toast.error(message);
    } finally {
      setIsAssigning(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Assign Partner</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          {isFetching ? (
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
