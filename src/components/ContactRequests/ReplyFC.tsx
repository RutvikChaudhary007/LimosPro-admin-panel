import { Reply } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
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
      <DialogContent className="overflow-y-scroll min-w-[680px] max-h-screen px-5">
        <DialogHeader>
          <div className="w-full h-full space-y-6 ">
            <div className="flex items-center justify-between">
              <DialogTitle className="space-y-1">
                <Reply className="text-[#5A5A5A]" />
                <h4 className="font-semibold text-xl text-[#000000]">name@email.com</h4>
              </DialogTitle>
            </div>
          </div>
        </DialogHeader>

        <hr className="w-full h-[1px] bg-[#EEEEEE]" />
        <div className="h-[85px] w-[600px]">
          <Label className="text-sm pb-3">Subject</Label>
          <Input className="h-full rounded placeholder:text-[#E6E6E6]" placeholder="Write Subject here" />
        </div>
        <div className="h-[217px] w-[600px] mt-10">
          <Label className="text-sm  pb-3">Message</Label>
          <Textarea
            className="h-full rounded placeholder:text-[#E6E6E6] font-medium"
            placeholder="Write Subject here"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReplyFC;
