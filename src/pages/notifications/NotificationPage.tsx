// @ts-nocheck

import { ChevronDown, Plus, Trash2 } from "lucide-react";
import { type JSX, useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/layouts/BreadCramb";
import {
	getNotification,
	getStatusColor,
	type TNotification,
} from "@/components/table/column";
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
import { constant } from "@/lib/constant";

const showStatus = [
	{ label: "Show 10", value: 10 },
	{ label: "Show 15", value: 15 },
	{ label: "Show 20", value: 20 },
	{ label: "Show 25", value: 25 },
];

const tableData: TNotification[] = [
	{
		id: "12345",
		notification: "New Inquiry Received",
		description:
			"You have a new inquiry from a potential passenger. Check the details and follow up.",
		created_at: "2025-04-16T10:00:00Z",
	},
	{
		id: "67890",
		notification: "Ride Completed Successfully",
		description:
			"The ride for booking ID #4521 has been successfully completed by the assigned driver.",
		created_at: "2025-04-16T10:00:00Z",
	},
	{
		id: "67890",
		notification: "Login Alert",
		description: "Your account was accessed from a new device at 3:15 PM.",
		created_at: "2025-06-16T10:00:00Z",
	},
	{
		id: "67891",
		notification: "Ride Delayed",
		description: "Driver is running late. Estimated delay: 12 minutes.",
		created_at: "2025-06-16T10:00:00Z",
	},
	{
		id: "12345",
		notification: "New Inquiry Received",
		description:
			"You have a new inquiry from a potential passenger. Check the details and follow up.",
		created_at: "2025-04-16T10:00:00Z",
	},
	{
		id: "67890",
		notification: "Ride Completed Successfully",
		description:
			"The ride for booking ID #4521 has been successfully completed by the assigned driver.",
		created_at: "2025-04-16T10:00:00Z",
	},
	{
		id: "67890",
		notification: "Login Alert",
		description: "Your account was accessed from a new device at 3:15 PM.",
		created_at: "2025-06-16T10:00:00Z",
	},
	{
		id: "67891",
		notification: "Ride Delayed",
		description: "Driver is running late. Estimated delay: 12 minutes.",
		created_at: "2025-06-16T10:00:00Z",
	},
	{
		id: "12345",
		notification: "New Inquiry Received",
		description:
			"You have a new inquiry from a potential passenger. Check the details and follow up.",
		created_at: "2025-04-16T10:00:00Z",
	},
	{
		id: "67890",
		notification: "Ride Completed Successfully",
		description:
			"The ride for booking ID #4521 has been successfully completed by the assigned driver.",
		created_at: "2025-04-16T10:00:00Z",
	},
	{
		id: "67890",
		notification: "Login Alert",
		description: "Your account was accessed from a new device at 3:15 PM.",
		created_at: "2025-06-16T10:00:00Z",
	},
	{
		id: "67891",
		notification: "Ride Delayed",
		description: "Driver is running late. Estimated delay: 12 minutes.",
		created_at: "2025-06-16T10:00:00Z",
	},
];

function NotificationPage(): JSX.Element {
	const perPage = 10;
	const [selectedStatus, setSelectedStatus] = useState(showStatus[0]);
	const [data, setData] = useState<TNotification[]>(tableData);
	const { currentPage, nextPage, prevPage, setPage, totalPages, currentItems } =
		usePagination<TNotification>(data, 1, perPage);

	const columns = useMemo(() => getNotification(), []);
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
							<h2 className="font-medium text-xl text-black">Notification</h2>
							<h4>
								{" "}
								<span className="text-[#515151] w-[116px] h-4 text-xs">
									LIMOSPRO
								</span>{" "}
								<span className="text-xs text-[#939393] w-[50px] h-4">
									/ Notification
								</span>
							</h4>
						</div>
					</div>
				</Header>

				<div className="flex justify-between gap-2.5">
					<div className="flex items-center gap-3">
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="outline"
									className={`w-[180px] h-[39px] flex items-center justify-between rounded mt-5 shadow-inner shadow-[#F1F1F1] cursor-pointer `}
								>
									{selectedStatus.label} <ChevronDown className="ml-2" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								className="w-56 bg-[#FDFDFD] shadow-inner shadow-[#F1F1F1] cursor-pointer"
								align="start"
							>
								<DropdownMenuGroup>
									{showStatus.map((option) => (
										<DropdownMenuItem
											key={option.value}
											className={`flex items-center justify-between cursor-pointer ${getStatusColor(option.label)} ${option.label === "Active" && "text-white"}`}
											onClick={() => setSelectedStatus(option)}
										>
											{option.label} <ChevronDown className="ml-2" />
										</DropdownMenuItem>
									))}
								</DropdownMenuGroup>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
					<div className="w-[369px] h-[39px] mt-5 flex items-center justify-end gap-3">
						<span
							className={`${Object.keys(rowSelection).filter((k) => rowSelection[k]).length === 0 ? "cursor-no-drop" : "cursor-pointer"}`}
						>
							<Button
								variant={"outline"}
								className="p-2.5 w-[137px] h-full rounded flex items-center justify-evenly  cursor-pointer bg-[#FDFDFD] shadow-inner shadow-[#F1F1F1] hover:bg-none outline-0"
								disabled={
									Object.keys(rowSelection).filter((k) => rowSelection[k])
										.length === 0
								}
								onClick={() => {
									setData((prev) => prev.filter((row, i) => !rowSelection[i]));
									setRowSelection({});
								}}
							>
								<span className="text-[#959595] text-sm w-[93px] h-[19px]">
									Delete
								</span>
								<Trash2 size={14} className="text-[#959595] cursor-pointer" />
							</Button>
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
									href="#"
									onClick={() => handlePageChange(currentPage - 1)}
									className={
										currentPage === 1 ? "pointer-events-none opacity-50" : ""
									}
								/>
							</PaginationItem>

							{generatePaginationItems()}

							<PaginationItem>
								<PaginationNext
									href="#"
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
}

export default NotificationPage;
