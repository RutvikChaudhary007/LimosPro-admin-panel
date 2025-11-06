import { ChevronDown } from "lucide-react";
import { type JSX, useState } from "react";
import { useNavigate } from "react-router-dom";
import useFetchAllTrips from "@/api/getAllTrips.api";
import BulkDeleteBtn from "@/components/bulkDeleteBtn/BulkDeleteBtn";
import { ErrorCard } from "@/components/common/ErrorCard";
import PageTitle from "@/components/common/PageTitle";
import Header from "@/components/layouts/BreadCramb";
import { Spinner } from "@/components/Spinner";
import {
	getStatusColor,
	getTrips,
	type TTrips,
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
import queries from "@/lib/queries";
import { generatePageTitle } from "@/utils/seo";

const showStatus = [
	{ label: "Completed", value: "completed" },
	{ label: "Pending", value: "pending" },
	{ label: "In-Progress", value: "inProgress" },
	{ label: "Cancelled", value: "cancelled" },
];

// const tableData: TTrips[] = [
// {
//     id: "12345",
//     bookingId: "67890",
//     chaufferId: "67890",
//     tripType: "oneWay",
//     tripStatus: "inProgress",
//     tripStartTime: "2025-04-16T10:00:00Z",
//     tripEndTime: "2025-04-16T12:00:00Z",
//     distanceInKm: 15.5,
//     gratuity: 5,
//     paymentStatus: "pending",
//     createdAt: "2025-04-16T10:00:00Z",
//     updatedAt: "2025-04-16T10:00:00Z"
// },
// {
//     id: "67890",
//     bookingId: "12345",
//     chaufferId: "12345",
//     tripType: "roundTrip",
//     tripStatus: "completed",
//     tripStartTime: "2025-04-17T08:00:00Z",
//     tripEndTime: "2025-04-17T10:00:00Z",
//     distanceInKm: 20,
//     gratuity: 10,
//     paymentStatus: "paid",
//     createdAt: "2025-04-17T08:00:00Z",
//     updatedAt: "2025-04-17T10:00:00Z"
// }
// ];

function TripsPage(): JSX.Element {
	const navigate = useNavigate();
	const perPage = 10;
	const [tableRef, setTableRef] = useState<any>(null);
	const [selectedStatus, setSelectedStatus] = useState(showStatus[0]);
	// const [data, setData] = useState<TTrips[]>(tableData);
	const { data, refetch, isFetching, isError } = useFetchAllTrips();
	const { currentPage, setPage, totalPages, currentItems } =
		usePagination<TTrips>(data?.trips ?? data, 1, perPage);
	// const { currentPage, nextPage, prevPage, setPage, totalPages, currentItems } = usePagination<TTrips>(data ?? data, 1, perPage);

	const handleView = (id: string) => {
		console.log("view:", id);
		navigate(constant.ROUTING_URLS.VIEW_TRIPS.replace(":id", id));
	};
	const handleMap = (id: string) => {
		console.log("Edit:", id);
		navigate(constant.ROUTING_URLS.TRIPS_MAP.replace(":id", id));
	};

	const columns = getTrips(handleView, handleMap);
	const [searchValue, setSearchValue] = useState("");
	const [rowSelection, setRowSelection] = useState({});

	const bulkDeleteTripsMutation = queries.useBulkDeleteTripsMutation();

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
			<PageTitle title={generatePageTitle("Trips")} />
			<div className="px-10 py-6 h-[calc(100vh-146px)] overflow-auto">
				<Header className="p-4 h-[79px] bg-[#FDFDFD] shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
					<div className="w-full h-full flex items-center justify-between">
						<div>
							<h2 className="font-medium text-xl text-black">Trips</h2>
							<h4>
								{" "}
								<span className="text-[#515151] w-[116px] h-4 text-xs">
									LIMOSPRO
								</span>{" "}
								<span className="text-xs text-[#939393] w-[50px] h-4">
									/ Trips
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
									className={`w-[180px] h-[39px] flex items-center justify-between rounded mt-5 shadow-inner shadow-[#F1F1F1] cursor-pointer ${getStatusColor(selectedStatus.label)} ${selectedStatus.label === "Active" && "text-white"}`}
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
							className={`${
								Object.keys(rowSelection).filter(
									(k) =>
										// @ts-expect-error: We are intentionally assigning a number to a string type for testing.
										rowSelection[k],
								).length === 0
									? "cursor-no-drop"
									: "cursor-pointer"
							}`}
						>
							<BulkDeleteBtn
								rowSelection={rowSelection}
								setRowSelection={setRowSelection}
								bulkDeleteMutation={bulkDeleteTripsMutation}
								refetch={refetch}
								tableRef={tableRef}
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

export default TripsPage;
