// @ts-nocheck

import { Plus } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/layouts/BreadCramb";
import { getHomeContent, type THomeContent } from "@/components/table/column";
import { DataTable } from "@/components/table/data-table";
import { Button } from "@/components/ui/button";
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
import { constant } from "@/lib/constant";
import { cn } from "@/lib/utils";

const tableData: THomeContent[] = [
	{
		id: "1",
		content: "Hero Section",
		description:
			"You can book online the hourly service for the Houston rodeo on our website. If you are looking for a point-point one-way or round trip for the Houston rodeo, please call us to book by phone because the regular online point-point rates are not valid for Houston rodeo one-way or round trip.",
	},
	{
		id: "2",
		content: "Our Section",
		description:
			"Special rates may apply during the events seasons and sports games in the Houston greater areas such as Houston rodeo, Christmas lights, new year's night, and big sports games.",
	},
	{
		id: "3",
		content: "Cities We Serve",
		description:
			"The rate is subject to change at any time without advanced announcement but it will not reflect in the reservations that are under processing or already booked.",
	},
	{
		id: "4",
		content: "Customer Reviews",
		description: "Office times: Monday – Sunday  8:00 AM – 10:00 PM.",
	},
	{
		id: "5",
		content: "Our partner",
		description:
			"Transportation between Houston Airports, Houston greater area, and Galveston Cruise Port, Galveston Hotels, please book online by clicking on the Houston – Galveston button at the Online Quote & Booking and start from there.",
	},
];

const SeoPage = () => {
	const navigate = useNavigate();
	const [perPage, setPerPage] = useState(10);
	const [data, setData] = useState<THomeContent[]>(tableData);
	const [activeBtn, setActiveBtn] = useState<string>("Home");
	const { currentPage, nextPage, prevPage, setPage, totalPages, currentItems } =
		usePagination<THomeContent>(data, 1, perPage);

	const handleEdit = (id: string) => {
		console.log("Edit:", id);
		navigate(constant.ROUTING_URLS.EDIT_CONTENT_MANAGEMENT.replace(":id", id));
	};
	const handleDelete = (id: string) => {
		setData((prev) => prev.filter((row) => row.id !== id));
	};
	const columns = getHomeContent(handleEdit, handleDelete);

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
	return (
		<>
			<div className="px-10 py-6 h-[calc(100vh-146px)] overflow-auto">
				<Header className="p-4 h-[79px] bg-[#FDFDFD] shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
					<div className="w-full h-full flex items-center justify-between">
						<div>
							<h2 className="font-medium text-xl text-black">
								Content Management
							</h2>
							<h4>
								<span className="text-[#959595] w-14 h-4">LIMOSPRO</span>{" "}
								<span className="text-[#959595] w-[116px] h-4">/ Seo</span>
							</h4>
						</div>
						<Link to={constant.ROUTING_URLS.CREATE_CONTENT_MANAGEMENT}>
							{" "}
							<Button
								variant={"outline"}
								className="cursor-pointer bg-[#E4E4E4] flex items-center rounded"
							>
								<Plus className="text-[#515151]" />
								<span className="text-[#515151] font-medium text-sm">Add</span>
							</Button>
						</Link>
					</div>
				</Header>

				<div className="flex items-center justify-between">
					<div className="w-[369px] h-[39px] mt-5 flex items-center justify-between gap-3">
						<div className="p-2.5 w-[220px] h-full flex items-center focus-visible:border-none focus-visible:outline-none  rounded">
							<Input
								type="search"
								placeholder="search"
								className="text-[#959595] rounded"
								value={searchValue}
								onChange={(e) => setSearchValue(e.target.value)}
							/>
						</div>
					</div>
				</div>

				<DataTable
					columns={columns}
					data={currentItems}
					rowSelection={rowSelection}
					onRowSelectionChange={setRowSelection}
					globalFilter={searchValue}
					onGlobalFilterChange={setSearchValue}
				/>

				{/* Pagination */}
				{tableData.length > 0 && calculatedTotalPages > 1 && (
					<Pagination className="justify-end mt-5 cursor-pointer">
						<PaginationContent>
							<PaginationItem>
								<PaginationPrevious
									href={"?page=" + currentPage}
									onClick={prevPage}
									className={
										currentPage === 1 ? "pointer-events-none opacity-50" : ""
									}
								/>
							</PaginationItem>

							{generatePaginationItems()}

							<PaginationItem>
								<PaginationNext
									href={"?page=" + currentPage}
									onClick={nextPage}
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

export default SeoPage;
