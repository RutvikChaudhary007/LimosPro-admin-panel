import { useFetchContactRequestById } from "@/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "../Spinner";
import { FieldSeparator } from "../ui/field";

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
      {isFetching ? (
        <Spinner />
      ) : (
        <DialogContent className="font-quicksand w-full max-w-3xl max-h-screen rounded">
          <DialogHeader>
            <div className="w-full h-full space-y-6 ">
              <div className="flex items-center justify-between">
                <DialogTitle className="space-y-3">
                  <h4 className="font-montserrat font-semibold text-xl text-base-black">
                    {data?.email}
                  </h4>
                  <h5 className="font-montserrat text-base text-base-gray font-semibold">
                    {data?.phone}
                  </h5>
                </DialogTitle>
              </div>
            </div>
          </DialogHeader>

          <FieldSeparator />
          {data?.message}
        </DialogContent>
      )}
    </Dialog>
  );
}

export default ViewModal;

// const htmlContent = () => {
//   return (<div className="w-full h-full space-y-4">
//     <div className="flex items-center gap-6">
//       <div className="text-[#3A3A3A] font-medium flex flex-col space-y-10"><span>Hi,
//         </span>

//        <span> Are you looking to boost your business with a custom mobile app? At Hoff & Mazor, we specialize in creating innovative and user-friendly apps tailored to your unique needs.</span>
// <span>
//         Benefits of choosing us:
//         1. Customized solutions
//         2. User-friendly design
//         3. Timely delivery
//         4. Ongoing support
//         </span>
// <span>
//         Don't miss out on the opportunity to stand out from the competition. Contact us today for a consultation!
// </span>
//        <span> Best regards,</span>

// <span>
//         John Smith
//         Hoff & Mazor
//         john@hoffnmazordeveloper.com
// </span>
//         Respond with stop to optout.</div>
//     </div>
//     </div>)
// }
