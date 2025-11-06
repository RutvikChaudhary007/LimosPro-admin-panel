// @ts-nocheck

import { ChevronDown, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import useFetchALLNews from "@/api/news.api";
import BulkDeleteBtn from "@/components/bulkDeleteBtn/BulkDeleteBtn";
import { ErrorCard } from "@/components/common/ErrorCard";
import PageTitle from "@/components/common/PageTitle";
import Header from "@/components/layouts/BreadCramb";
import { Spinner } from "@/components/Spinner";
import { getNews, type TNews } from "@/components/table/column";
import { DataTable } from "@/components/table/data-table";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import usePagination from "@/hooks/use-pagination";
import { toastPromise } from "@/hooks/use-toast";
import { constant } from "@/lib/constant";
import queries from "@/lib/queries";
import { generatePageTitle } from "@/utils/seo";

const showOptions = [
	{ value: 10, label: "Show 10" },
	{ value: 20, label: "Show 20" },
	{ value: 30, label: "Show 30" },
];

// const tableData: TNews[] = [
//     {
//         id: "1",
//         news: "You can book online the hourly service for the Houston rodeo on our website. If you are looking for a point-point one-way or round trip for the Houston rodeo, please call us to book by phone because the regular online point-point rates are not valid for Houston rodeo one-way or round trip."
//     },
//     {
//         id: "2",
//         news: "Special rates may apply during the events seasons and sports games in the Houston greater areas such as Houston rodeo, Christmas lights, new year's night, and big sports games."
//     },
//     {
//         id: "3",
//         news: "The rate is subject to change at any time without advanced announcement but it will not reflect in the reservations that are under processing or already booked."
//     },
//     {
//         id: "4",
//         news: "Office times: Monday – Sunday  8:00 AM – 10:00 PM."
//     },
//     {
//         id: "5",
//         news: "Transportation between Houston Airports, Houston greater area, and Galveston Cruise Port, Galveston Hotels, please book online by clicking on the Houston – Galveston button at the Online Quote & Booking and start from there."
//     },
// ]
const Newspage = () => {
	const navigate = useNavigate();
	const [tableRef, setTableRef] = useState<any>(null);
	const [perPage, setPerPage] = useState(10);
	const [selected, setSelected] = useState(showOptions[0]);
	// const [data, setData] = useState<TNews[]>(tableData);
	const { data, refetch, isFetching, isError } = useFetchALLNews();
	const { currentPage, setPage, totalPages, currentItems } =
		usePagination<TNews>(data?.items, 1, perPage, data?.pagination);
	// console.log("currentItems:", currentItems);

	useEffect(() => {
		setPerPage(selected.value);
	}, [selected]);
	const handleEdit = (id: string) => {
		console.log("Edit:", id);
		navigate(constant.ROUTING_URLS.EDIT_NEWS.replace(":id", id));
	};
	const deleteNews = queries.useDeleteNewsMutation();
	const bulkDeleteNews = queries.useBulkDeleteNewsMutation();
	const handleDelete = (id: string) => {
		try {
			toastPromise(deleteNews.mutateAsync(id), {
				loading: "Deleting news...",
				success: (res) => {
					if (res) refetch();
					return "News deleted successfully";
				},
				error: (e) =>
					e instanceof Error ? e.message : "Opps! Failed to delete news",
			});
		} catch (error) {
			if (error instanceof Error) {
				toast.error(error.message);
			} else {
				toast.error("An unexpected error occurred");
			}
		}
	};
	const columns = getNews(handleEdit, handleDelete);

	const [searchValue, setSearchValue] = useState("");
	const [rowSelection, setRowSelection] = useState({});
	// Number of pages based on filtered data
	const calculatedTotalPages = Math.max(1, totalPages);

	// Handle page change
	const handlePageChange = (newPage: number) => {
		setPage(newPage);
		window.scrollTo(0, 0);
	};

	// Generate pagination items
	const generatePaginationItems = () => {
		const items = [];

		// Always show first page
		items.push(
			<PaginationItem key="first">
				<PaginationLink
					isActive={currentPage === 1}
					onClick={() => handlePageChange(1)}
				>
					1
				</PaginationLink>
			</PaginationItem>,
		);

		// Show ellipsis if needed
		if (currentPage > 3) {
			items.push(
				<PaginationItem key="ellipsis-1">
					<PaginationEllipsis />
				</PaginationItem>,
			);
		}

		// Show nearby pages
		for (
			let i = Math.max(2, currentPage - 1);
			i <= Math.min(calculatedTotalPages - 1, currentPage + 1);
			i++
		) {
			if (i === 1 || i === calculatedTotalPages) continue; // Skip first and last pages as they're added separately

			items.push(
				<PaginationItem key={i}>
					<PaginationLink
						isActive={currentPage === i}
						onClick={() => handlePageChange(i)}
					>
						{i}
					</PaginationLink>
				</PaginationItem>,
			);
		}

		// Show ellipsis if needed
		if (currentPage < calculatedTotalPages - 2) {
			items.push(
				<PaginationItem key="ellipsis-2">
					<PaginationEllipsis />
				</PaginationItem>,
			);
		}

		// Always show last page if there's more than one page
		if (calculatedTotalPages > 1) {
			items.push(
				<PaginationItem key="last">
					<PaginationLink
						isActive={currentPage === calculatedTotalPages}
						onClick={() => handlePageChange(calculatedTotalPages)}
					>
						{calculatedTotalPages}
					</PaginationLink>
				</PaginationItem>,
			);
		}

		return items;
	};

	if (isError) return <ErrorCard refetch={refetch} />;
	return (
		<>
			<PageTitle title={generatePageTitle("News")} />
			<div className="px-10 py-6 h-[calc(100vh-146px)] overflow-auto">
				<Header className="p-4 h-[79px] bg-[#FDFDFD] shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
					<div className="w-full h-full flex items-center justify-between">
						<div>
							<h2 className="font-medium text-xl text-black">News</h2>
							<h4>
								<span className="text-[#959595] w-14 h-4">LIMOSPRO</span>{" "}
								<span className="text-[#959595] w-[116px] h-4">/ News</span>
							</h4>
						</div>
						<Link to={constant.ROUTING_URLS.CREATE_NEWS}>
							{" "}
							<Button
								variant="secondary"
								className="cursor-pointer bg-[#E4E4E4] flex items-center rounded"
							>
								<Plus className="text-[#515151]" />
								<span className="text-[#515151] font-medium text-sm">
									Add News
								</span>
							</Button>
						</Link>
					</div>
				</Header>

				<div className="flex justify-between">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="secondary"
								className="w-56 h-10 flex items-center justify-between rounded mt-5 shadow-inner shadow-[#F1F1F1] bg-[#FDFDFD] cursor-pointer"
							>
								{selected.label} <ChevronDown className="ml-2" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							className="w-56 bg-[#FDFDFD] shadow-inner shadow-[#F1F1F1] cursor-pointer"
							align="start"
						>
							<DropdownMenuGroup>
								{showOptions.map((option) => (
									<DropdownMenuItem
										key={option.value}
										className="flex items-center justify-between hover:bg-[#F1F1F1]"
										onClick={() => setSelected(option)}
									>
										{option.label} <ChevronDown className="ml-2" />
									</DropdownMenuItem>
								))}
							</DropdownMenuGroup>
						</DropdownMenuContent>
					</DropdownMenu>
					<div className="w-[369px] h-[39px] mt-5 flex items-center justify-between gap-3">
						<span
							className={`${Object.keys(rowSelection).filter((k) => rowSelection[k]).length === 0 ? "cursor-no-drop" : "cursor-pointer"}`}
						>
							<BulkDeleteBtn
								rowSelection={rowSelection}
								tableRef={tableRef}
								bulkDeleteMutation={bulkDeleteNews}
								refetch={refetch}
								setRowSelection={setRowSelection}
								title="News"
								descTitle="news"
							/>
						</span>
						<div className="p-2.5 w-[220px] h-full flex items-center focus-visible:border-none focus-visible:outline-none">
							<Input
								type="search"
								placeholder="search"
								className="text-[#959595]"
								value={searchValue}
								onChange={(e) => setSearchValue(e.target.value)}
							/>
						</div>
					</div>
				</div>
				{isFetching ? (
					<Spinner />
				) : (
					<DataTable
						columns={columns}
						data={currentItems}
						rowSelection={rowSelection}
						onTableReady={setTableRef}
						onRowSelectionChange={setRowSelection}
						globalFilter={searchValue}
						onGlobalFilterChange={setSearchValue}
					/>
				)}

				{/* Pagination */}
				{totalPages > 0 && calculatedTotalPages > 1 && (
					<Pagination className="justify-end mt-5 cursor-pointer">
						<PaginationContent>
							<PaginationItem>
								<PaginationPrevious
									href={"?page=" + currentPage}
									onClick={() => handlePageChange(currentPage - 1)}
									className={
										currentPage === 1 ? "pointer-events-none opacity-50" : ""
									}
								/>
							</PaginationItem>

							{generatePaginationItems()}

							<PaginationItem>
								<PaginationNext
									href={"?page=" + currentPage}
									onClick={() => handlePageChange(currentPage + 1)}
									className={
										currentPage === calculatedTotalPages
											? "pointer-events-none opacity-50"
											: ""
									}
								/>
							</PaginationItem>
						</PaginationContent>
					</Pagination>
				)}
			</div>
		</>
	);
};

export default Newspage;
