import { ArrowLeft } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useFetchPartnerById } from "@/api/ourPartners.api";
import Header from "@/components/layouts/Header";
import OurPartnerForm, {
	type TOurPartnerForm,
} from "@/components/OurPartner/OurPartnerForm";
import { Spinner } from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { toastPromise } from "@/hooks/use-toast";
import { constant } from "@/lib/constant";
import queries from "@/lib/queries";

const EditOurPartnerPage = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const { data, isFetching } = useFetchPartnerById(id!);
	const editPartner = queries.useEditOurPartnerMutation();
	const handleSubmit = async (data: TOurPartnerForm): Promise<void> => {
		const formData = new FormData();
		formData.append("companyName", data.companyName);
		formData.append("url", data.url);
		formData.append("logoUrl", data.photo);
		try {
			toastPromise(editPartner.mutateAsync({ id: id!, data: formData }), {
				loading: "Updating Partner...",
				success: (res) => {
					if (res) {
						navigate(constant.ROUTING_URLS.OUR_PARTNERS);
					}
					return "Yeah! Partner updated successfully";
				},
				error: (e) =>
					e instanceof Error ? e.message : "Opps! Failed to update partner",
			});
		} catch (error) {
			if (error instanceof Error) {
				toast.error(error.message);
			} else {
				toast.error("An unexpected error occurred");
			}
		}
	};
	return (
		<>
			<div className="px-10 py-6 h-[calc(100vh-146px)] overflow-y-scroll">
				<Link to={constant.ROUTING_URLS.OUR_PARTNERS}>
					<Button
						variant="secondary"
						className="py-3 px-1.5 rounded bg-[#D9D9D9] w-[80px] h-[31px] flex items-center justify-center cursor-pointer text-[#5A5A5A]"
					>
						<ArrowLeft /> Back
					</Button>
				</Link>
				<Header className="p-4 h-[79px] bg-[#FDFDFD] shadow-[0_4px_20px_rgba(0,0,0,0.05)] mt-4 mb-5">
					<div className="w-full h-full flex items-center justify-between">
						<div>
							<h2 className="font-medium text-xl text-black">Our Partner</h2>
							<h4>
								{" "}
								<span className="text-[#959595] w-[116px] h-4 text-xs">
									Our Partners
								</span>{" "}
								<span className="text-xs text-[#3A3A3A] w-[50px] h-4">
									/ Edit Partner
								</span>
							</h4>
						</div>
					</div>
				</Header>
				{isFetching ? (
					<Spinner />
				) : (
					<OurPartnerForm
						initialData={data}
						onSubmit={handleSubmit}
						type="Edit Partners"
					/>
				)}
			</div>
		</>
	);
};

export default EditOurPartnerPage;
