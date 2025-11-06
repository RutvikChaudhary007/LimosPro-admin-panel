import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Header from "@/components/layouts/Header";
import TestimonialForm from "@/components/testimonail/TestimonialForm";
import { Button } from "@/components/ui/button";
import { toastPromise } from "@/hooks/use-toast";
import { constant } from "@/lib/constant";
import queries from "@/lib/queries";
import type { TTestimonialFormData } from "@/types/testimonial.type";

const CreateTestimonailPage = () => {
	const navigate = useNavigate();
	const createTestimonialMutation = queries.useCreateTestimonialMutation();
	const handleSubmit = async (data: TTestimonialFormData): Promise<void> => {
		try {
			toastPromise(
				createTestimonialMutation.mutateAsync({
					customerName: data.name,
					content: data.message,
					customerImage: data.photo,
					rating: data.rating,
					isFeatured: data.isFeatured,
				}),
				{
					loading: "Creating testimonial...",
					success: (res) => {
						if (res) navigate(constant.ROUTING_URLS.TESTIMONIALS);
						return "Yeah! Testimonial created successfully";
					},
					error: (e) =>
						e instanceof Error
							? e.message
							: "Opps! Failed to create testimonial",
				},
			);
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
				<Link to={constant.ROUTING_URLS.TESTIMONIALS}>
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
							<h2 className="font-medium text-xl text-black">Testimonail</h2>
							<h4>
								{" "}
								<span className="text-[#959595] w-[116px] h-4 text-xs">
									Testimonail
								</span>{" "}
								<span className="text-xs text-[#3A3A3A] w-[50px] h-4">
									/ Create Testimonail
								</span>
							</h4>
						</div>
					</div>
				</Header>
				<TestimonialForm onSubmit={handleSubmit} type="Create Testimonail" />
			</div>
		</>
	);
};

export default CreateTestimonailPage;
