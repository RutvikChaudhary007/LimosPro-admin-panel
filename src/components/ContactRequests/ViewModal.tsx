import { format } from "date-fns";
import { useFetchContactRequestById } from "@/api";
import {
  Card,
  CardBody,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Field, FieldLabel, FieldSeparator } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Spinner } from "../Spinner";

function ViewModal({
  id,
  open,
  onOpenChange,
}: {
  id: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { data, isFetching } = useFetchContactRequestById({ id });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 border-none max-w-2xl bg-transparent shadow-none">
        {isFetching ? (
          <Card className="min-h-[300px] flex items-center justify-center">
            <Spinner />
          </Card>
        ) : (
          <Card>
            <CardBody>
              <CardHeader>
                <CardTitle>Contact Request Details</CardTitle>
                <CardDescription className="text-sm font-bold">
                  Submitted on{" "}
                  {data?.createdAt
                    ? format(new Date(data.createdAt), "dd MMM yyyy, hh:mm a")
                    : "N/A"}
                </CardDescription>
              </CardHeader>
              <FieldSeparator />
              <CardContent className="space-y-4">
                <div className="grid grid-cols-[max-content_1fr] gap-4 items-center">
                  <Label className="font-montserrat font-semibold">
                    Email:
                  </Label>
                  <Label>{data?.email || "N/A"}</Label>

                  <Label className="font-montserrat font-semibold">
                    Phone:
                  </Label>
                  <Label>{data?.phone || "N/A"}</Label>
                </div>
                <FieldSeparator />

                <Field className="mt-4">
                  <FieldLabel className="font-montserrat font-semibold text-base-black text-sm">
                    Message
                  </FieldLabel>
                  <div className="text-base text-base-black leading-relaxed whitespace-pre-wrap">
                    {data?.message || "No message provided."}
                  </div>
                </Field>
              </CardContent>
            </CardBody>
          </Card>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default ViewModal;
