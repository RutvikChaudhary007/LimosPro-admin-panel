// @ts-nocheck

import { ChevronDown, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import useFetchAllChauffeur from "@/api/chauffeur.api";
import BulkDeleteBtn from "@/components/bulkDeleteBtn/BulkDeleteBtn";
import { ErrorCard } from "@/components/common/ErrorCard";
import PageTitle from "@/components/common/PageTitle";
import Header from "@/components/layouts/Header";
import { Spinner } from "@/components/Spinner";
import {
	getChauffeur,
	getStatusColor,
	type TChauffeur,
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
import { toastPromise } from "@/hooks/use-toast";
import { constant } from "@/lib/constant";
import queries from "@/lib/queries";
import { generatePageTitle } from "@/utils/seo";

const showStatus = [
	{ label: "Active", value: "active" },
	{ label: "Pending", value: "pending" },
	{ label: "Inactive", value: "inactive" },
	{ label: "Suspended", value: "suspended" },
];

const showTime = [
	{ label: "All Time", value: "" },
	{ label: "Weekly", value: "weekly" },
	{ label: "Monthly", value: "monthly" },
	{ label: "Yearly", value: "yearly" },
];

// const tableData: TChauffeur[] = [
//         {
//             "id": "801c9f7e-7dfa-4f97-9664-912fe821db19",
//             "businessAddress": "dafs",
//             "password": "dfa",
//             "user": {
//               "firstName": "dkfsa",
//               "lastName": "dfas",
//               "email": "ddfa@email.com"
//             },
//             "userId": "1b54693c-685f-4360-b07d-6ebfe74a96a7",
//             "affiliateId": "ba5227db-7a3f-45f5-945c-e9d5ef01968d",
//             "status": "Active",
//             "panNumber": "chauffeur_pan_875f",
//             "licenseNumber": "license_number_875f",
//             "vehicleId": "3959bb6d-8782-41db-9365-ff7876e88131",
//             "documents": [
//                 {
//                     "size": 254971,
//                     "fileUrl": "https://qb-nauticalnode.s3.ap-south-1.amazonaws.com/chauffeurs/1752584832584-Screenshot%20%287%29.png",
//                     "mimetype": "image/png",
//                     "originalName": "Screenshot (7).png"
//                 },
//                 {
//                     "size": 316890,
//                     "fileUrl": "https://qb-nauticalnode.s3.ap-south-1.amazonaws.com/chauffeurs/1752584832590-Screenshot%202023-07-25%20120555.png",
//                     "mimetype": "image/png",
//                     "originalName": "Screenshot 2023-07-25 120555.png"
//                 }
//             ],
//             "rating": "5.00",
//             "availability": true,
//             "location": {
//                 "latitude": 40.76303278785429,
//                 "longitude": -73.81583247888925
//             },
//             "gratuity": "0.00",
//             "createdAt": "2025-07-15T13:07:17.448Z",
//             "updatedAt": "2025-07-15T13:07:17.448Z",
//             "vehicle": {
//                 "id": "3959bb6d-8782-41db-9365-ff7876e88131",
//                 "affiliateId": "d194f9aa-8bee-4c36-9d50-c2df01882efe",
//                 "plateNumber": "AB-123-CDa",
//                 "brand": "Mercedes-S-classa",
//                 "model": "2024",
//                 "year": 2025,
//                 "color": "black",
//                 "vehicleType": "Executive Sedan Fit for 3 Passengers",
//                 "capacity": 4,
//                 "documents": [],
//                 "vehicleImages": [],
//                 "createdAt": "2025-07-15T12:43:58.461Z",
//                 "updatedAt": "2025-07-15T12:43:58.461Z",
//                 "deletedAt": null
//             }
//         },
//         {
//             "id": "801c9f7e-7dfa-4f97-9664-912fe821db17",
//             "businessAddress": "dafs",
//             "password": "dfa",
//             "user": {
//               "firstName": "dkfsa",
//               "lastName": "dfas",
//               "email": "ddfa@email.com"
//             },
//             "userId": "1b54693c-685f-4360-b07d-6ebfe74a96a7",
//             "affiliateId": "ba5227db-7a3f-45f5-945c-e9d5ef01968d",
//             "status": "pending",
//             "panNumber": "chauffeur_pan_875f",
//             "licenseNumber": "license_number_875f",
//             "vehicleId": "3959bb6d-8782-41db-9365-ff7876e88131",
//             "documents": [
//                 {
//                     "size": 254971,
//                     "fileUrl": "https://qb-nauticalnode.s3.ap-south-1.amazonaws.com/chauffeurs/1752584832584-Screenshot%20%287%29.png",
//                     "mimetype": "image/png",
//                     "originalName": "Screenshot (7).png"
//                 },
//                 {
//                     "size": 316890,
//                     "fileUrl": "https://qb-nauticalnode.s3.ap-south-1.amazonaws.com/chauffeurs/1752584832590-Screenshot%202023-07-25%20120555.png",
//                     "mimetype": "image/png",
//                     "originalName": "Screenshot 2023-07-25 120555.png"
//                 }
//             ],
//             "rating": "5.00",
//             "availability": true,
//             "location": {
//                 "latitude": 40.76303278785429,
//                 "longitude": -73.81583247888925
//             },
//             "gratuity": "0.00",
//             "createdAt": "2025-07-15T13:07:17.448Z",
//             "updatedAt": "2025-07-15T13:07:17.448Z",
//             "vehicle": {
//                 "id": "3959bb6d-8782-41db-9365-ff7876e88131",
//                 "affiliateId": "d194f9aa-8bee-4c36-9d50-c2df01882efe",
//                 "plateNumber": "AB-123-CDa",
//                 "brand": "Mercedes-S-classa",
//                 "model": "2024",
//                 "year": 2025,
//                 "color": "black",
//                 "vehicleType": "Executive Sedan Fit for 3 Passengers",
//                 "capacity": 4,
//                 "documents": [],
//                 "vehicleImages": [],
//                 "createdAt": "2025-07-15T12:43:58.461Z",
//                 "updatedAt": "2025-07-15T12:43:58.461Z",
//                 "deletedAt": null
//             }
//         },
//         {
//             "id": "801c9f7e-7dfa-4f97-9664-912fe821db16",
//             "businessAddress": "dafs",
//             "password": "dfa",
//             "user": {
//               "firstName": "dkfsa",
//               "lastName": "dfas",
//               "email": "ddfa@email.com"
//             },
//             "userId": "1b54693c-685f-4360-b07d-6ebfe74a96a7",
//             "affiliateId": "ba5227db-7a3f-45f5-945c-e9d5ef01968d",
//             "status": "inactive",
//             "panNumber": "chauffeur_pan_875f",
//             "licenseNumber": "license_number_875f",
//             "vehicleId": "3959bb6d-8782-41db-9365-ff7876e88131",
//             "documents": [
//                 {
//                     "size": 254971,
//                     "fileUrl": "https://qb-nauticalnode.s3.ap-south-1.amazonaws.com/chauffeurs/1752584832584-Screenshot%20%287%29.png",
//                     "mimetype": "image/png",
//                     "originalName": "Screenshot (7).png"
//                 },
//                 {
//                     "size": 316890,
//                     "fileUrl": "https://qb-nauticalnode.s3.ap-south-1.amazonaws.com/chauffeurs/1752584832590-Screenshot%202023-07-25%20120555.png",
//                     "mimetype": "image/png",
//                     "originalName": "Screenshot 2023-07-25 120555.png"
//                 }
//             ],
//             "rating": "5.00",
//             "availability": true,
//             "location": {
//                 "latitude": 40.76303278785429,
//                 "longitude": -73.81583247888925
//             },
//             "gratuity": "0.00",
//             "createdAt": "2025-07-15T13:07:17.448Z",
//             "updatedAt": "2025-07-15T13:07:17.448Z",
//             "vehicle": {
//                 "id": "3959bb6d-8782-41db-9365-ff7876e88131",
//                 "affiliateId": "d194f9aa-8bee-4c36-9d50-c2df01882efe",
//                 "plateNumber": "AB-123-CDa",
//                 "brand": "Mercedes-S-classa",
//                 "model": "2024",
//                 "year": 2025,
//                 "color": "black",
//                 "vehicleType": "Executive Sedan Fit for 3 Passengers",
//                 "capacity": 4,
//                 "documents": [],
//                 "vehicleImages": [],
//                 "createdAt": "2025-07-15T12:43:58.461Z",
//                 "updatedAt": "2025-07-15T12:43:58.461Z",
//                 "deletedAt": null
//             }
//         },
//         {
//             "id": "801c9f7e-7dfa-4f97-9664-912fe821db15",
//             "businessAddress": "dafs",
//             "password": "dfa",
//             "user": {
//               "firstName": "dkfsa",
//               "lastName": "dfas",
//               "email": "ddfa@email.com"
//             },
//             "userId": "1b54693c-685f-4360-b07d-6ebfe74a96a7",
//             "affiliateId": "ba5227db-7a3f-45f5-945c-e9d5ef01968d",
//             "status": "suspended",
//             "panNumber": "chauffeur_pan_875f",
//             "licenseNumber": "license_number_875f",
//             "vehicleId": "3959bb6d-8782-41db-9365-ff7876e88131",
//             "documents": [
//                 {
//                     "size": 254971,
//                     "fileUrl": "https://qb-nauticalnode.s3.ap-south-1.amazonaws.com/chauffeurs/1752584832584-Screenshot%20%287%29.png",
//                     "mimetype": "image/png",
//                     "originalName": "Screenshot (7).png"
//                 },
//                 {
//                     "size": 316890,
//                     "fileUrl": "https://qb-nauticalnode.s3.ap-south-1.amazonaws.com/chauffeurs/1752584832590-Screenshot%202023-07-25%20120555.png",
//                     "mimetype": "image/png",
//                     "originalName": "Screenshot 2023-07-25 120555.png"
//                 }
//             ],
//             "rating": "5.00",
//             "availability": true,
//             "location": {
//                 "latitude": 40.76303278785429,
//                 "longitude": -73.81583247888925
//             },
//             "gratuity": "0.00",
//             "createdAt": "2025-07-15T13:07:17.448Z",
//             "updatedAt": "2025-07-15T13:07:17.448Z",
//             "vehicle": {
//                 "id": "3959bb6d-8782-41db-9365-ff7876e88131",
//                 "affiliateId": "d194f9aa-8bee-4c36-9d50-c2df01882efe",
//                 "plateNumber": "AB-123-CDa",
//                 "brand": "Mercedes-S-classa",
//                 "model": "2024",
//                 "year": 2025,
//                 "color": "black",
//                 "vehicleType": "Executive Sedan Fit for 3 Passengers",
//                 "capacity": 4,
//                 "documents": [],
//                 "vehicleImages": [],
//                 "createdAt": "2025-07-15T12:43:58.461Z",
//                 "updatedAt": "2025-07-15T12:43:58.461Z",
//                 "deletedAt": null
//             }
//         },
//     ]
function ChauffeurPage() {
	const navigate = useNavigate();
	const perPage = 10;
	const [newPage, setNewPage] = useState<number>(1);
	const [selectedStatus, setSelectedStatus] = useState(showStatus[0]);
	const [selectedTime, setSelectedTime] = useState(showTime[0]);
	const { data, refetch, isFetching, isError } = useFetchAllChauffeur();
	const [tableRef, setTableRef] = useState<any>(null);
	// console.log("fetchedData:",data)

	/**
	 * Dummy data
	 */
	// const [data, setData] = useState<TChauffeur[]>(tableData);
	// const isFetching =   false;

	const handleView = (id: string) => {
		console.log("view:", id);
		navigate(constant.ROUTING_URLS.VIEW_CHAUFFEUR.replace(":id", id));
	};
	const handleEdit = (id: string) => {
		console.log("Edit:", id);
		navigate(constant.ROUTING_URLS.EDIT_CHAUFFEUR.replace(":id", id));
	};
	const deleteChauffeurMutation = queries.useDeleteChauffeurMutation();
	const bulkDeleteChauffeurMutation = queries.useBulkDeleteChauffeurMutation();
	const handleDelete = (id: string) => {
		console.log("id", id);
		try {
			toastPromise(deleteChauffeurMutation.mutateAsync(id), {
				loading: "Deleting chauffeur...",
				success: (res) => {
					if (res) refetch();
					return "Yeah! Chauffeur deleted successfully";
				},
				error: (e) =>
					e instanceof Error ? e.message : "Opps! Failed to delete chauffeur",
			});
		} catch (error) {
			if (error instanceof Error) {
				toast.error(error.message);
			} else {
				toast.error("Unknown error occurred");
			}
		}
		// setData((prev) =>
		//   prev.filter((row) => row.id !== id))
	};
	const columns = getChauffeur(handleView, handleEdit, handleDelete);

	const [searchValue, setSearchValue] = useState("");
	const [rowSelection, setRowSelection] = useState<{ [key: string]: boolean }>(
		{},
	);

	/**
	 * Below is for dummy data
	 */
	// const { currentPage, nextPage, prevPage, setPage, totalPages, currentItems } = usePagination<TChauffeur>(data || [], newPage, perPage, );
	/**
	 * Below is for real data
	 */
	const { currentPage, setPage, totalPages, currentItems } =
		usePagination<TChauffeur>(
			data?.chauffeurs || [],
			newPage,
			perPage,
			data?.pagination,
		);

	// Number of pages based on filtered data
	const calculatedTotalPages = Math.max(1, totalPages);

	// Handle page change
	const handlePageChange = (newPage: number) => {
		setPage(newPage);
		setNewPage(newPage);
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
			<PageTitle title={generatePageTitle("Chauffeur")} />
			<div className="px-10 py-6 h-[calc(100vh-146px)] overflow-y-scroll">
				<Header className="p-4 h-[79px] bg-[#FDFDFD] shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
					<div className="w-full h-full flex items-center justify-between">
						<div>
							<h2 className="font-medium text-xl text-black">Chauffeur</h2>
							<h4>
								{" "}
								<span className="text-[#515151] w-[116px] h-4 text-xs">
									LIMOSPRO
								</span>{" "}
								<span className="text-xs text-[#939393] w-[50px] h-4">
									/ Chauffeur
								</span>
							</h4>
						</div>
						<Link to={constant.ROUTING_URLS.CREATE_CHAUFFEUR}>
							{" "}
							<Button
								variant={"outline"}
								className="cursor-pointer bg-[#E4E4E4] flex items-center rounded"
							>
								<Plus className="text-[#515151]" />
								<span className="text-[#515151] font-medium text-sm">
									Add Chauffeur
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
								bulkDeleteMutation={bulkDeleteChauffeurMutation}
								refetch={refetch}
								setRowSelection={setRowSelection}
								title="Chauffeurs"
								descTitle="chauffeur"
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
						onRowSelectionChange={setRowSelection}
						onTableReady={setTableRef}
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

export default ChauffeurPage;
