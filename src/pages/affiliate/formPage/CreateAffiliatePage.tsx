// import { createAffiliate } from "@/api/createAffiliate";

import { useQueryClient } from "@tanstack/react-query";
// import type { ApiErrorResponse } from "@/types/global/ErrorResponse";
// import { useMutation } from "@tanstack/react-query";
// import type { AxiosError } from "axios";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import AffiliateForm from "@/components/affiliate/AffiliateForm";
import PageTitle from "@/components/common/PageTitle";
import Header from "@/components/layouts/BreadCramb";
import { Button } from "@/components/ui/button";
import { toastPromise } from "@/hooks/use-toast";
import { constant } from "@/lib/constant";
import queries from "@/lib/queries";
import type { IAffiliate } from "@/types/affiliate.type";
import { generatePageTitle } from "@/utils/seo";

function CreateAffiliatePage() {
	// const {toast} = useToast();
	// const navigate = useNavigate();
	const createAffiliateMutation = queries.useCreateAffiliateMutation();
	const queryClient = useQueryClient();
	const handleCreateAffiliate = (data: IAffiliate) => {
		console.log("called handleCreateAffiliate", data);
		try {
			// Remove remember field before sending to API
			// await loginMutation.mutateAsync(loginData);
			// await createAffiliateMutation.mutateAsync(data)
			toastPromise(createAffiliateMutation.mutateAsync(data), {
				loading: "Submitting...",
				success: (res) => {
					if (res) {
						queryClient.invalidateQueries({ queryKey: ["affiliates"] });
					}
					return "Affiliate created successfully!";
				},
				error: (e) =>
					e instanceof Error ? e.message : "Failed to create affiliate",
			});
		} catch (error) {
			// Error handling is done in onError callback
			console.error("Login error:", error);
		}
	};
	return (
		<>
			<PageTitle title={generatePageTitle("Affiliate")} />
			<div className="px-10 py-6 h-[calc(100vh-146px)] overflow-y-scroll">
				<Link to={constant.ROUTING_URLS.AFFILIATE}>
					<Button
						variant="outline"
						className="py-3 px-1.5 rounded bg-[#D9D9D9] w-[80px] h-[31px] flex items-center justify-center cursor-pointer text-[#5A5A5A]"
					>
						<ArrowLeft /> Back
					</Button>
				</Link>
				<Header className="p-4 h-[79px] bg-[#FDFDFD] shadow-[0_4px_20px_rgba(0,0,0,0.05)] mt-4 mb-5">
					<div className="w-full h-full flex items-center justify-between">
						<div>
							<h2 className="font-medium text-xl text-black">Affiliate</h2>
							<h4>
								{" "}
								<span className="text-[#959595] w-[116px] h-4 text-xs">
									LIMOSPRO
								</span>{" "}
								<span className="text-xs text-[#3A3A3A] w-[50px] h-4">
									/ Create Affiliate
								</span>
							</h4>
						</div>
					</div>
				</Header>
				<AffiliateForm
					onSubmit={handleCreateAffiliate}
					type={"Create Affiliate"}
				/>
			</div>
		</>
	);
}

export default CreateAffiliatePage;
