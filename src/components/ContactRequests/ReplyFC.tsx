import { Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useReplyContactMutation } from "@/api/contact.api";
import {
  Card,
  CardBody,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Field, FieldLabel, FieldSeparator } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { TContactRequest } from "../table/column";
import { Button } from "../ui/button";

const ReplyFC = ({
  isModal,
  setIsModal,
  request,
  onSuccess,
}: {
  isModal: boolean;
  setIsModal: React.Dispatch<React.SetStateAction<boolean>>;
  request: TContactRequest;
  onSuccess?: () => void;
}) => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const { mutate: sendReply, isPending } = useReplyContactMutation();

  const handleSend = () => {
    if (!subject.trim() || !message.trim()) {
      toast.error("Subject and message are required");
      return;
    }

    sendReply(
      { id: request.id, subject, message },
      {
        onSuccess: () => {
          toast.success("Reply sent successfully");
          setSubject("");
          setMessage("");
          setIsModal(false);
          onSuccess?.();
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || "Failed to send reply");
        },
      },
    );
  };

  return (
    <Dialog open={isModal} onOpenChange={setIsModal}>
      <DialogContent className="p-0 border-none max-w-2xl bg-transparent shadow-none">
        <Card>
          <CardBody>
            <CardHeader>
              <CardTitle>Reply to Inquiry</CardTitle>
              <CardDescription>
                Send a response to {request.email}
              </CardDescription>
            </CardHeader>

            <FieldSeparator />

            <CardContent className="space-y-4">
              <Field>
                <FieldLabel>To</FieldLabel>
                <Input
                  disabled
                  value={request.email || ""}
                  className="bg-base-primary/10"
                />
              </Field>
              <Field>
                <FieldLabel>Subject</FieldLabel>
                <Input
                  placeholder="Enter subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  disabled={isPending}
                />
              </Field>
              <Field>
                <FieldLabel>Message</FieldLabel>
                <Textarea
                  placeholder="Write your response here..."
                  className="min-h-[200px] resize-none"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={isPending}
                />
              </Field>
            </CardContent>

            <FieldSeparator />

            <CardFooter className="justify-end gap-3">
              <Button
                variant="outlineBlack"
                onClick={() => setIsModal(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button onClick={handleSend} disabled={isPending}>
                <span>{isPending ? "Sending..." : "Send Reply"}</span>
                <Send className={isPending ? "animate-pulse" : ""} />
              </Button>
            </CardFooter>
          </CardBody>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default ReplyFC;
