import { Reply } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Field, FieldLabel, FieldSeparator } from "../ui/field";
import { Textarea } from "../ui/textarea";

const ReplyFC = ({
  isModal,
  setIsModal,
}: {
  isModal: boolean;
  setIsModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <Dialog open={isModal} onOpenChange={setIsModal}>
      <DialogContent className="font-quicksand w-full max-w-3xl max-h-screen rounded">
        <DialogHeader>
          <div className="w-full space-y-6 ">
            <div className="flex items-center justify-between">
              <DialogTitle className="space-y-1 flex gap-2">
                <Reply className="text-base-gray" />
                <h4 className="font-montserrat font-semibold text-xl text-base-black">
                  name@email.com
                </h4>
              </DialogTitle>
            </div>
          </div>
        </DialogHeader>

        <FieldSeparator />
        <div className="space-y-4">
          <Field>
            <FieldLabel>Subject</FieldLabel>
            <Textarea placeholder="Write subject here" />
          </Field>
          <Field>
            <FieldLabel>Message</FieldLabel>
            <Textarea placeholder="Write your message here" />
          </Field>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReplyFC;
