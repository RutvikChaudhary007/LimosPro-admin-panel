import { ArrowLeft } from "lucide-react";
import type React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useFetchContentBlockById } from "@/api/contentBlock.api";
import ContentManagementForm, {
	type TContentForm,
} from "@/components/contentManagement/ContentManagementForm";
import Header from "@/components/layouts/Header";
import { Spinner } from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { toastPromise } from "@/hooks/use-toast";
import { constant } from "@/lib/constant";
import queries from "@/lib/queries";

const EditContent: React.FC = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const { data, isFetching, isError } = useFetchContentBlockById(id!);

	const editContentMutation = queries.useEditContentBlockMutation();
	const handleEditSubmit = async (data: TContentForm) => {
		try {
			toastPromise(editContentMutation.mutateAsync({ id: id!, data }), {
				loading: "Editing content...",
				success: (res) => {
					if (res) navigate(constant.ROUTING_URLS.CONTENT_MANAGEMENT_ALL_PAGES);
					return "Yeah! Content edited successfully.";
				},
				error: (e) =>
					e instanceof Error ? e.message : "Opps! Failed to update content.",
			});
		} catch (error) {
			if (error instanceof Error) console.error(error.message);
		}
	};
	if (isError) toast.error("Opps! failed to fetch the content.");
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
								/ Edit Page
							</span>
						</h4>
					</div>
					{/* <Button className="text-white bg-[#5A5A5A]">Manage Field</Button> */}
				</div>
			</Header>
			{isFetching ? (
				<Spinner />
			) : (
				<ContentManagementForm
					initialData={data}
					onSubmit={handleEditSubmit}
					type="Edit Page"
				/>
			)}
		</div>
	);
};

export default EditContent;
