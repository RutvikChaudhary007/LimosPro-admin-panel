import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import type { TFaqForm } from "@/components/faq/FaqForm";
import FaqForm from "@/components/faq/FaqForm";
import Header from "@/components/layouts/BreadCramb";
import { Button } from "@/components/ui/button";
import { toastPromise } from "@/hooks/use-toast";
import { constant } from "@/lib/constant";
import queries from "@/lib/queries";

const CreateFaqPage = () => {
	const navigate = useNavigate();
	const createFaqMutation = queries.useCreateFaqMutation();
	const handleSubmit = async (data: TFaqForm): Promise<void> => {
		try {
			toastPromise(createFaqMutation.mutateAsync(data), {
				loading: "Creating faq...",
				success: (res) => {
					if (res) navigate(constant.ROUTING_URLS.FAQ);
					return "Yeah! Faq created successfully";
				},
				error: "Failed to create faq",
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
				<Link to={constant.ROUTING_URLS.FAQ}>
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
							<h2 className="font-medium text-xl text-black">
								Frequently Asked Question
							</h2>
							<h4>
								{" "}
								<span className="text-[#959595] w-[116px] h-4 text-xs">
									Faq
								</span>{" "}
								<span className="text-xs text-[#3A3A3A] w-[50px] h-4">
									/ Add Faq
								</span>
							</h4>
						</div>
					</div>
				</Header>
				<FaqForm onSubmit={handleSubmit} type="Create Faq" />
			</div>
		</>
	);
};

export default CreateFaqPage;
