import type { Row } from "@tanstack/react-table";
import { CreditCardIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useFetchPaymentById } from "@/api";
import query from "@/lib/queries";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { SelectDropDown } from "../ui/select";

interface ManageRefundProps<
  T extends {
    id: string;
    amount?: string | number;
    bookingId?: string;
    customerId?: string;
    paymentId?: string;
  },
> {
  row: Row<T>;
  refundId?: string;
  heading?: string;
}

const ManageRefund = <
  T extends {
    id: string;
    amount?: string | number;
    bookingId?: string;
    customerId?: string;
    paymentId?: string;
  },
>({
  row,
  heading = "Manage Refund",
  refundId,
}: ManageRefundProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const [refundType, setRefundType] = useState<"full" | "partial">("full");
  const [amount, setAmount] = useState<string>("");

  const id = row.original.id || refundId || "";
  const { data: paymentDetails, isFetching } = useFetchPaymentById({ id });
  const { mutate: refund, isPending } = query.useRefundPaymentMutation();

  const originalAmount = parseFloat(row.original.amount as string) || 0;

  useEffect(() => {
    if (isOpen) {
      setRefundType("full");
      setAmount(originalAmount.toString());
    }
  }, [isOpen, originalAmount]);

  const handleRefundTypeChange = (value: "full" | "partial") => {
    setRefundType(value);
    if (value === "full") {
      setAmount(originalAmount.toString());
    } else {
      setAmount((originalAmount / 2).toString());
    }
  };

  const handleRefund = () => {
    const payload = {
      paymentId:
        row.original.paymentId || (row.original as any).PaymentId || id,
      amount: amount,
      bookingId:
        row.original.bookingId || (row.original as any).BookingId || "",
      customerId:
        row.original.customerId ||
        (row.original as any).userId ||
        (paymentDetails as any)?.userId ||
        "",
    };

    if (!payload.paymentId || !payload.amount || !payload.bookingId) {
      toast.error("Missing required refund information");
      return;
    }

    refund(payload, {
      onSuccess: () => {
        toast.success("Refund processed successfully");
        setIsOpen(false);
      },
      onError: (error: any) => {
        toast.error(
          error?.response?.data?.data?.error ??
            error?.response?.data?.message ??
            "Failed to process refund",
        );
      },
    });
  };

  return (
    <Dialog modal={true} open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={() => setIsOpen(true)}
          variant="outlineNavBtnPrimary"
          size="xl"
          spacing="lg"
          tooltip="Refund"
        >
          <CreditCardIcon />
        </Button>
      </DialogTrigger>

      <DialogContent className="w-full sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{heading}</DialogTitle>
          <DialogDescription>
            Process a refund for this payment.
          </DialogDescription>
        </DialogHeader>

        {isFetching ? (
          <div className="flex justify-center p-4">Loading details...</div>
        ) : (
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label>Refund Type</Label>
              <SelectDropDown
                placeholder="Select Refund Type"
                value={refundType}
                setSelectedItem={(v) =>
                  handleRefundTypeChange(v as "full" | "partial")
                }
                items={[
                  { label: "Full Refund", value: "full" },
                  { label: "Partial Refund", value: "partial" },
                ]}
                classname="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Refund Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
              />
            </div>
          </div>
        )}

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outlinePrimary">Cancel</Button>
          </DialogClose>
          <Button
            type="button"
            onClick={handleRefund}
            disabled={isPending || isFetching}
          >
            {isPending ? "Processing..." : "Refund"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ManageRefund;
