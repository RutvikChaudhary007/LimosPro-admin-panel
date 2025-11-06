import { ArrowLeft } from "lucide-react";
import type React from "react";
import { Link, useNavigate } from "react-router-dom";
import ContentManagementForm, {
	type TContentForm,
} from "@/components/contentManagement/ContentManagementForm";
import Header from "@/components/layouts/BreadCramb";
import { Button } from "@/components/ui/button";
import { toastPromise } from "@/hooks/use-toast";
import { constant } from "@/lib/constant";
import queries from "@/lib/queries";

// ------------------- CreateContent -------------------
const CreateContent: React.FC = () => {
	const navigate = useNavigate();
	const createContentMutation = queries.useCreateContentBlockMutation();
	const handleOnSubmit = async (data: TContentForm) => {
		console.log("data:", data);
		try {
			toastPromise(createContentMutation.mutateAsync(data), {
				loading: "Creating Content...",
				success: (res) => {
					if (res) navigate(constant.ROUTING_URLS.CONTENT_MANAGEMENT_ALL_PAGES);
					return "Yeah! Content created successfully.";
				},
				error: (e) =>
					e instanceof Error ? e.message : "Opps! Failed to create content.",
			});
		} catch (error) {
			if (error instanceof Error) {
				console.error(error.message);
			}
		}
	};
	return (
		<div className="px-10 py-6 h-[calc(100vh-146px)] overflow-y-scroll">
			<Link to={constant.ROUTING_URLS.CONTENT_MANAGEMENT_ALL_PAGES}>
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
						<h2 className="font-medium text-xl text-black">
							Content Management
						</h2>
						<h4>
							{" "}
							<span className="text-[#959595] w-[116px] h-4 text-xs">
								All Pages
							</span>{" "}
							<span className="text-xs text-[#3A3A3A] w-[50px] h-4">
								/ Add Page
							</span>
						</h4>
					</div>
					{/* <Button className="text-white bg-[#5A5A5A]">Manage Field</Button> */}
				</div>
			</Header>
			<ContentManagementForm onSubmit={handleOnSubmit} type="Add Page" />
		</div>
	);
};

export default CreateContent;
