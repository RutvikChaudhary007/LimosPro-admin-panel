import { useFetchContactRequestById } from "@/api/contactRequest.api";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
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
			{isFetching ? (
				<Spinner />
			) : (
				<DialogContent className="overflow-y-scroll min-w-[640px] max-h-screen">
					<DialogHeader>
						<div className="w-full h-full space-y-6 ">
							<div className="flex items-center justify-between">
								<DialogTitle className="space-y-3">
									<h4 className="font-semibold text-xl text-[#000000]">
										{data?.email}
									</h4>
									<h5 className="text-[#5A5A5A] font-semibold">
										{data?.phone}
									</h5>
								</DialogTitle>
							</div>
						</div>
					</DialogHeader>

					<hr className="w-full h-[1px] bg-[#EEEEEE]" />
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
