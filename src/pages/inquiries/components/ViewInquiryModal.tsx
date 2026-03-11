import { format } from "date-fns";
import { toast } from "sonner";
import { useUpdateInquiryStatus } from "@/api/inquiry.api";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  DiplomaticInquiryData,
  EventPlannerData,
  TInquiry,
} from "@/types/inquiry.type";
import { InquiryStatus, InquiryType } from "@/types/inquiry.type";

interface ViewInquiryModalProps {
  inquiry: TInquiry | null;
  isOpen: boolean;
  onClose: () => void;
}

const DetailItem = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => (
  <div className="flex flex-col gap-1">
    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
      {label}
    </span>
    <span className="text-sm font-semibold">{value || "N/A"}</span>
  </div>
);

export const ViewInquiryModal = ({
  inquiry,
  isOpen,
  onClose,
}: ViewInquiryModalProps) => {
  const { mutate: updateStatus, isPending: isUpdating } =
    useUpdateInquiryStatus();

  if (!inquiry) return null;

  const handleStatusChange = (newStatus: InquiryStatus) => {
    updateStatus(
      { id: inquiry.id, status: newStatus },
      {
        onSuccess: () => {
          toast.success("Inquiry status updated successfully");
        },
        onError: () => {
          toast.error("Failed to update inquiry status");
        },
      },
    );
  };

  const isEventPlanner = inquiry.type === InquiryType.EVENT_PLANNER;
  const isDiplomatic = inquiry.type === InquiryType.DIPLOMATIC;

  const renderDetails = () => {
    if (isEventPlanner) {
      const data = inquiry.details as EventPlannerData;
      return (
        <div className="grid grid-cols-2 gap-6 mt-4">
          <DetailItem label="Event Type" value={data.eventType} />
          <DetailItem label="Estimated Guests" value={data.estimatedGuests} />
          <DetailItem
            label="Event Date"
            value={format(new Date(data.eventDate), "dd MMM yyyy")}
          />
          <DetailItem label="Role/Position" value={data.rolePosition} />
          <div className="col-span-2">
            <DetailItem
              label="Event Location"
              value={`${data.eventLocation.venue || ""}, ${data.eventLocation.city}`}
            />
          </div>
          <div className="col-span-2">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Vehicle Needs
            </span>
            <div className="flex flex-wrap gap-2 mt-1">
              {Object.entries(data.vehicleNeeds).map(
                ([key, val]) =>
                  val && (
                    <Badge key={key} variant="secondary" className="capitalize">
                      {key}: {val}
                    </Badge>
                  ),
              )}
            </div>
          </div>
          {data.message && (
            <div className="col-span-2">
              <DetailItem label="Message" value={data.message} />
            </div>
          )}
        </div>
      );
    }

    if (isDiplomatic) {
      const data = inquiry.details as DiplomaticInquiryData;
      return (
        <div className="grid grid-cols-2 gap-6 mt-4">
          <DetailItem
            label="Country Represented"
            value={data.countryRepresented}
          />
          <DetailItem label="Service Type" value={data.serviceType} />
          <DetailItem label="Title/Position" value={data.titlePosition} />
          <DetailItem label="Primary Cities" value={data.primaryCitiesNeeded} />
          <div className="col-span-2">
            <DetailItem
              label="Office Address"
              value={`${data.officeAddress}, ${data.city}, ${data.country}`}
            />
          </div>
          <div className="col-span-2">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Security Requirements
            </span>
            <div className="flex flex-wrap gap-2 mt-1">
              {data.securityRequirements.map((req) => (
                <Badge key={req} variant="secondary">
                  {req}
                </Badge>
              ))}
            </div>
          </div>
          {data.specialProtocolRequirements && (
            <div className="col-span-2">
              <DetailItem
                label="Protocol Requirements"
                value={data.specialProtocolRequirements}
              />
            </div>
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-start pr-8">
            <div>
              <DialogTitle className="text-2xl font-bold">
                {inquiry.contactName}
              </DialogTitle>
              <p className="text-muted-foreground">{inquiry.companyName}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge className="capitalize">{inquiry.status}</Badge>
              <Select
                disabled={isUpdating}
                onValueChange={(value) =>
                  handleStatusChange(value as InquiryStatus)
                }
                defaultValue={inquiry.status}
              >
                <SelectTrigger className="w-[140px] h-8 text-xs">
                  <SelectValue placeholder="Update Status" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(InquiryStatus).map((status) => (
                    <SelectItem
                      key={status}
                      value={status}
                      className="capitalize text-xs"
                    >
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-8 mt-4">
          <section>
            <h3 className="text-lg font-bold border-b pb-2 mb-4">
              Contact Information
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <DetailItem label="Email" value={inquiry.email} />
              <DetailItem label="Phone" value={inquiry.phone} />
            </div>
          </section>

          <section>
            <h3 className="text-lg font-bold border-b pb-2 mb-4">
              Inquiry Details ({inquiry.type.replace(/([A-Z])/g, " $1")})
            </h3>
            {renderDetails()}
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
};
