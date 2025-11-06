import { useFetchNewsById } from "@/api/news.api";
import Header from "@/components/layouts/BreadCramb";
import NewsForm, { type TNewsForm } from "@/components/news/NewsForm";
import { Spinner } from "@/components/Spinner";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
// import type { TNews } from "@/components/table/column";
import { Button } from "@/components/ui/button";
import { toastPromise } from "@/hooks/use-toast";
import { constant } from "@/lib/constant";
import queries from "@/lib/queries";

// const mockData: TNews = {
//     id: "1",
//     news: "You can book online the hourly service for the Houston rodeo on our website. If you are looking for a point-point one-way or round trip for the Houston rodeo, please call us to book by phone because the regular online point-point rates are not valid for Houston rodeo one-way or round trip.",
// }
const EditNewsPage = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const { data, isFetching } = useFetchNewsById(id!);
	const editNews = queries.useEditNewsMutation();
	const handleSubmit = async (data: TNewsForm): Promise<void> => {
		try {
			toastPromise(
				editNews.mutateAsync({ id: id!, data: { body: data.news } }),
				{
					loading: "Updating news...",
					success: (res) => {
						if (res) navigate(constant.ROUTING_URLS.NEWS);
						return "Yeah! News updated successfully";
					},
					error: "Failed to update news",
				},
			);
		} catch (error) {
			if (error instanceof Error) {
				toast.error(error.message);
			} else {
				toast.error("An unknown error occurred");
			}
		}
	};

	return (
		<>
			<div className="p-6 space-y-6 md:p-8 md:space-y-8">
				<Link to={constant.ROUTING_URLS.NEWS}>
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
							<h2 className="font-medium text-xl text-black">News</h2>
							<h4>
								{" "}
								<span className="text-[#959595] w-[116px] h-4 text-xs">
									News
								</span>{" "}
								<span className="text-xs text-[#3A3A3A] w-[50px] h-4">
									/ Edit News
								</span>
							</h4>
						</div>
					</div>
				</Header>
				{isFetching ? (
					<Spinner />
				) : (
					<NewsForm
						initialData={data}
						onSubmit={handleSubmit}
						type="Edit News"
					/>
				)}
			</div>
		</>
	);
};

export default EditNewsPage;
