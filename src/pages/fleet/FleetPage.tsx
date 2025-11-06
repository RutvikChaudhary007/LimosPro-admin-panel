// @ts-nocheck

// import { useQueryClient } from "@tanstack/react-query";
import UsefetchAllFleets from "@/api/getAllFleets.api";
import BulkDeleteBtn from "@/components/bulkDeleteBtn/BulkDeleteBtn";
import { ErrorCard } from "@/components/common/ErrorCard";
import PageTitle from "@/components/common/PageTitle";
import Header from "@/components/layouts/BreadCramb";
import { Spinner } from "@/components/Spinner";
import { getFleets, type TFleet } from "@/components/table/column";
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
import { ChevronDown, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const showTime = [
	{ label: "All Time", value: "" },
	{ label: "Weekly", value: "weekly" },
	{ label: "Monthly", value: "monthly" },
	{ label: "Yearly", value: "yearly" },
];

// const tableData: TFleet[] = [
//     {
//         "id": "3959bb6d-8782-41db-9365-ff7876e88131",
//         "affiliateId": "d194f9aa-8bee-4c36-9d50-c2df01882efe",
//         "plateNumber": "AB-123-CDa",
//         "brand": "Mercedes-S-classa",
//         "model": "2024",
//         "year": 2025,
//         "color": "black",
//         "vehicleType": "Executive Sedan Fit for 3 Passengers",
//         "capacity": 3,
//         "documents": [],
//         "vehicleImages": [],
//         "createdAt": "2025-07-15T12:43:58.461Z",
//         "updatedAt": "2025-07-15T12:43:58.461Z",
//         "deletedAt": null
//     },
//     {
//         "id": "3959bb6d-8782-41db-9365-ff7876e88132",
//         "affiliateId": "a194f9aa-8bee-4c36-9d50-c2df01882efe",
//         "plateNumber": "BB-123-CDa",
//         "brand": "Mercedes-S-classa",
//         "model": "2023",
//         "year": 2025,
//         "color": "black",
//         "vehicleType": "Executive Sedan Fit for 4 Passengers",
//         "capacity": 4,
//         "documents": [],
//         "vehicleImages": [],
//         "createdAt": "2025-07-15T12:43:58.461Z",
//         "updatedAt": "2025-07-15T12:43:58.461Z",
//         "deletedAt": null
//     },
//     {
//         "id": "3959bb6d-8782-41db-9365-ff7876e88132",
//         "affiliateId": "a194f9aa-8bee-4c36-9d50-c2df01882efe",
//         "plateNumber": "BB-123-CDa",
//         "brand": "Mercedes-S-classa",
//         "model": "2023",
//         "year": 2025,
//         "color": "black",
//         "vehicleType": "Executive Sedan Fit for 4 Passengers",
//         "capacity": 4,
//         "documents": [],
//         "vehicleImages": [],
//         "createdAt": "2025-07-15T12:43:58.461Z",
//         "updatedAt": "2025-07-15T12:43:58.461Z",
//         "deletedAt": null
//     },
//     {
//         "id": "3959bb6d-8782-41db-9365-ff7876e88132",
//         "affiliateId": "a194f9aa-8bee-4c36-9d50-c2df01882efe",
//         "plateNumber": "BB-123-CDa",
//         "brand": "Mercedes-S-classa",
//         "model": "2023",
//         "year": 2025,
//         "color": "black",
//         "vehicleType": "Executive Sedan Fit for 4 Passengers",
//         "capacity": 4,
//         "documents": [],
//         "vehicleImages": [],
//         "createdAt": "2025-07-15T12:43:58.461Z",
//         "updatedAt": "2025-07-15T12:43:58.461Z",
//         "deletedAt": null
//     },
//     {
//         "id": "3959bb6d-8782-41db-9365-ff7876e88132",
//         "affiliateId": "a194f9aa-8bee-4c36-9d50-c2df01882efe",
//         "plateNumber": "BB-123-CDa",
//         "brand": "Mercedes-S-classa",
//         "model": "2023",
//         "year": 2025,
//         "color": "black",
//         "vehicleType": "Executive Sedan Fit for 4 Passengers",
//         "capacity": 4,
//         "documents": [],
//         "vehicleImages": [],
//         "createdAt": "2025-07-15T12:43:58.461Z",
//         "updatedAt": "2025-07-15T12:43:58.461Z",
//         "deletedAt": null
//     },
//     {
//         "id": "3959bb6d-8782-41db-9365-ff7876e88132",
//         "affiliateId": "a194f9aa-8bee-4c36-9d50-c2df01882efe",
//         "plateNumber": "BB-123-CDa",
//         "brand": "Mercedes-S-classa",
//         "model": "2023",
//         "year": 2025,
//         "color": "black",
//         "vehicleType": "Executive Sedan Fit for 4 Passengers",
//         "capacity": 4,
//         "documents": [],
//         "vehicleImages": [],
//         "createdAt": "2025-07-15T12:43:58.461Z",
//         "updatedAt": "2025-07-15T12:43:58.461Z",
//         "deletedAt": null
//     },
//     {
//         "id": "3959bb6d-8782-41db-9365-ff7876e88132",
//         "affiliateId": "a194f9aa-8bee-4c36-9d50-c2df01882efe",
//         "plateNumber": "BB-123-CDa",
//         "brand": "Mercedes-S-classa",
//         "model": "2023",
//         "year": 2025,
//         "color": "black",
//         "vehicleType": "Executive Sedan Fit for 4 Passengers",
//         "capacity": 4,
//         "documents": [],
//         "vehicleImages": [],
//         "createdAt": "2025-07-15T12:43:58.461Z",
//         "updatedAt": "2025-07-15T12:43:58.461Z",
//         "deletedAt": null
//     },
//     {
//         "id": "3959bb6d-8782-41db-9365-ff7876e88132",
//         "affiliateId": "a194f9aa-8bee-4c36-9d50-c2df01882efe",
//         "plateNumber": "BB-123-CDa",
//         "brand": "Mercedes-S-classa",
//         "model": "2023",
//         "year": 2025,
//         "color": "black",
//         "vehicleType": "Executive Sedan Fit for 4 Passengers",
//         "capacity": 4,
//         "documents": [],
//         "vehicleImages": [],
//         "createdAt": "2025-07-15T12:43:58.461Z",
//         "updatedAt": "2025-07-15T12:43:58.461Z",
//         "deletedAt": null
//     },
//     {
//         "id": "3959bb6d-8782-41db-9365-ff7876e88132",
//         "affiliateId": "a194f9aa-8bee-4c36-9d50-c2df01882efe",
//         "plateNumber": "BB-123-CDa",
//         "brand": "Mercedes-S-classa",
//         "model": "2023",
//         "year": 2025,
//         "color": "black",
//         "vehicleType": "Executive Sedan Fit for 4 Passengers",
//         "capacity": 4,
//         "documents": [],
//         "vehicleImages": [],
//         "createdAt": "2025-07-15T12:43:58.461Z",
//         "updatedAt": "2025-07-15T12:43:58.461Z",
//         "deletedAt": null
//     },
//     {
//         "id": "3959bb6d-8782-41db-9365-ff7876e88132",
//         "affiliateId": "a194f9aa-8bee-4c36-9d50-c2df01882efe",
//         "plateNumber": "BB-123-CDa",
//         "brand": "Mercedes-S-classa",
//         "model": "2023",
//         "year": 2025,
//         "color": "black",
//         "vehicleType": "Executive Sedan Fit for 4 Passengers",
//         "capacity": 4,
//         "documents": [],
//         "vehicleImages": [],
//         "createdAt": "2025-07-15T12:43:58.461Z",
//         "updatedAt": "2025-07-15T12:43:58.461Z",
//         "deletedAt": null
//     },
//     {
//         "id": "3959bb6d-8782-41db-9365-ff7876e88132",
//         "affiliateId": "a194f9aa-8bee-4c36-9d50-c2df01882efe",
//         "plateNumber": "BB-123-CDa",
//         "brand": "Mercedes-S-classa",
//         "model": "2023",
//         "year": 2025,
//         "color": "black",
//         "vehicleType": "Executive Sedan Fit for 4 Passengers",
//         "capacity": 4,
//         "documents": [],
//         "vehicleImages": [],
//         "createdAt": "2025-07-15T12:43:58.461Z",
//         "updatedAt": "2025-07-15T12:43:58.461Z",
//         "deletedAt": null
//     },
//     {
//         "id": "3959bb6d-8782-41db-9365-ff7876e88132",
//         "affiliateId": "a194f9aa-8bee-4c36-9d50-c2df01882efe",
//         "plateNumber": "BB-123-CDa",
//         "brand": "Mercedes-S-classa",
//         "model": "2023",
//         "year": 2025,
//         "color": "black",
//         "vehicleType": "Executive Sedan Fit for 4 Passengers",
//         "capacity": 4,
//         "documents": [],
//         "vehicleImages": [],
//         "createdAt": "2025-07-15T12:43:58.461Z",
//         "updatedAt": "2025-07-15T12:43:58.461Z",
//         "deletedAt": null
//     },
//     {
//         "id": "3959bb6d-8782-41db-9365-ff7876e88132",
//         "affiliateId": "a194f9aa-8bee-4c36-9d50-c2df01882efe",
//         "plateNumber": "BB-123-CDa",
//         "brand": "Mercedes-S-classa",
//         "model": "2023",
//         "year": 2025,
//         "color": "black",
//         "vehicleType": "Executive Sedan Fit for 4 Passengers",
//         "capacity": 4,
//         "documents": [],
//         "vehicleImages": [],
//         "createdAt": "2025-07-15T12:43:58.461Z",
//         "updatedAt": "2025-07-15T12:43:58.461Z",
//         "deletedAt": null
//     },
//     {
//         "id": "3959bb6d-8782-41db-9365-ff7876e88132",
//         "affiliateId": "a194f9aa-8bee-4c36-9d50-c2df01882efe",
//         "plateNumber": "BB-123-CDa",
//         "brand": "Mercedes-S-classa",
//         "model": "2023",
//         "year": 2025,
//         "color": "black",
//         "vehicleType": "Executive Sedan Fit for 4 Passengers",
//         "capacity": 4,
//         "documents": [],
//         "vehicleImages": [],
//         "createdAt": "2025-07-15T12:43:58.461Z",
//         "updatedAt": "2025-07-15T12:43:58.461Z",
//         "deletedAt": null
//     },
//     {
//         "id": "3959bb6d-8782-41db-9365-ff7876e88132",
//         "affiliateId": "a194f9aa-8bee-4c36-9d50-c2df01882efe",
//         "plateNumber": "BB-123-CDa",
//         "brand": "Mercedes-S-classa",
//         "model": "2023",
//         "year": 2025,
//         "color": "black",
//         "vehicleType": "Executive Sedan Fit for 4 Passengers",
//         "capacity": 4,
//         "documents": [],
//         "vehicleImages": [],
//         "createdAt": "2025-07-15T12:43:58.461Z",
//         "updatedAt": "2025-07-15T12:43:58.461Z",
//         "deletedAt": null
//     },
// ];
function FleetPage() {
	const navigate = useNavigate();
	const perPage = 10;

	const [tableRef, setTableRef] = useState<any>(null);
	const [selectedTime, setSelectedTime] = useState(showTime[0]);
	// --- Time range helper ---
	const { startDate, endDate } = useMemo(() => {
		const now = new Date();
		const end = new Date(
			Date.UTC(
				now.getUTCFullYear(),
				now.getUTCMonth(),
				now.getUTCDate(),
				23,
				59,
				59,
				999,
			),
		);
		let start: Date | undefined;

		switch (selectedTime.value) {
			case "weekly": {
				// last 7 days inclusive (UTC)
				start = new Date(
					Date.UTC(
						now.getUTCFullYear(),
						now.getUTCMonth(),
						now.getUTCDate() - 6,
						0,
						0,
						0,
						0,
					),
				);
				break;
			}
			case "monthly": {
				start = new Date(
					Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0, 0),
				);
				break;
			}
			case "yearly": {
				start = new Date(Date.UTC(now.getUTCFullYear(), 0, 1, 0, 0, 0, 0));
				break;
			}
			default: {
				// All time: leave undefined so callers can omit filters
				start = undefined;
			}
		}

		return { startDate: start, endDate: selectedTime.value ? end : undefined };
	}, [selectedTime]);

	// const [data, setData] = useState<TFleet[]>(tableData);
	const { data, refetch, isPending, isError } = UsefetchAllFleets({
		DateRange: { startDate, endDate },
	});
	const { currentPage, setPage, totalPages, currentItems } =
		usePagination<TFleet>(data?.vehicles, 1, perPage);
	// const { currentPage, nextPage, prevPage, setPage, totalPages, currentItems } = usePagination<TFleet>(data, 1, perPage);

	// const queryClient = useQueryClient();
	// useEffect(() => {
	//   queryClient.prefetchQuery(UsefetchAllFleets({DateRange: {startDate,endDate}, page: currentPage + 1}));
	// }, [queryClient, currentPage, startDate, endDate]);

	const handleView = (id: string) => {
		console.log("view:", id);
		navigate(constant.ROUTING_URLS.VIEW_FLEET.replace(":id", id));
	};
	const handleEdit = (id: string) => {
		console.log("Edit:", id);
		navigate(constant.ROUTING_URLS.EDIT_FLEET.replace(":id", id));
	};
	const deleteMutation = queries.useDeletefleetMutation(refetch);
	const bulkDeleteFleetsMutation = queries.useBulkDeletefleetMutation();
	const handleDelete = async (id: string) => {
		try {
			toastPromise(deleteMutation.mutateAsync(id), {
				loading: "Deleting...",
				success: "Yeah! fleet deleted successfully.",
				error: "Opps! failed to delete fleet.",
			});
		} catch (error) {
			console.log(error);
		}
		// setData((prev) => prev.filter((row) => row.id !== id));
	};
	const columns = getFleets(handleView, handleEdit, handleDelete);
	const [searchValue, setSearchValue] = useState("");
	const [rowSelection, setRowSelection] = useState({});
	// Number of pages based on filtered data
	const calculatedTotalPages = Math.max(1, totalPages);

	// if(isFetching) return <Spinner/>
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
			<PageTitle title={generatePageTitle("Fleet")} />
			<div className="p-6 space-y-6 md:p-8 md:space-y-8">
				<Header className="p-4 h-[79px] bg-[#FDFDFD] shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
					<div className="w-full h-full flex items-center justify-between">
						<div>
							<h2 className="font-medium text-xl text-black">Fleet</h2>
							<h4>
								{" "}
								<span className="text-[#515151] w-[116px] h-4 text-xs">
									LIMOSPRO
								</span>{" "}
								<span className="text-xs text-[#939393] w-[50px] h-4">
									/ Fleet
								</span>
							</h4>
						</div>
						<Link to={constant.ROUTING_URLS.CREATE_FLEET}>
							{" "}
							<Button
								variant={"outline"}
								className="cursor-pointer bg-[#E4E4E4] flex items-center rounded"
							>
								<Plus className="text-[#515151]" />
								<span className="text-[#515151] font-medium text-sm">
									Add Fleet
								</span>
							</Button>
						</Link>
					</div>
				</Header>

				<div className="flex justify-between gap-2.5">
					<div className="flex items-center gap-3">
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="outline"
									className={`w-[180px] h-[39px] flex items-center justify-between rounded mt-5 shadow-inner shadow-[#F1F1F1] cursor-pointer bg-[#FFFFFF] `}
								>
									{selectedTime.label} <ChevronDown className="ml-2" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								className="w-56 bg-[#FDFDFD] shadow-inner shadow-[#F1F1F1] cursor-pointer"
								align="start"
							>
								<DropdownMenuGroup>
									{showTime.map((option) => (
										<DropdownMenuItem
											key={option.value}
											className={`flex items-center justify-between cursor-pointer bg-[#FFFFFF]`}
											onClick={() => setSelectedTime(option)}
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
							<BulkDeleteBtn
								rowSelection={rowSelection}
								tableRef={tableRef}
								bulkDeleteMutation={bulkDeleteFleetsMutation}
								refetch={refetch}
								setRowSelection={setRowSelection}
								title="Fleets"
								descTitle="fleets"
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
				{isPending ? (
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

export default FleetPage;
