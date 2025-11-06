//@ts-nocheck

import useFetchAllRegions from "@/api/region.api";
import PageTitle from "@/components/common/PageTitle";
import Header from "@/components/layouts/BreadCramb";
import { Spinner } from "@/components/Spinner";
import { getRegionColumns, type TRegion } from "@/components/table/column";
import { DataTable } from "@/components/table/data-table";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { ChevronDown, Plus, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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

const tableData: TRegion[] = [
	{ id: "1", regionName: "Region 1", admin: "Chris Johnson" },
	{ id: "2", regionName: "Region 1", admin: "Ovi Smith" },
	{ id: "3", regionName: "Region 1", admin: "June Parker" },
	{ id: "4", regionName: "Region 1", admin: "Casey Walker" },
	{ id: "5", regionName: "Region 1", admin: "Jordon Lee" },
	{ id: "6", regionName: "Region 1", admin: "Taylor Morgan" },
	{ id: "7", regionName: "Region 1", admin: "Sam Patel" },
	{ id: "8", regionName: "Region 1", admin: "Chris Johnson" },
	{ id: "9", regionName: "Region 1", admin: "Ovi Smith" },
	{ id: "10", regionName: "Region 1", admin: "June Parker" },
	{ id: "11", regionName: "Region 1", admin: "Casey Walker" },
	{ id: "12", regionName: "Region 1", admin: "Jordon Lee" },
	{ id: "13", regionName: "Region 1", admin: "Taylor Morgan" },
	{ id: "14", regionName: "Region 1", admin: "Sam Patel" },
	{ id: "15", regionName: "Region 1", admin: "Chris Johnson" },
	{ id: "16", regionName: "Region 1", admin: "Ovi Smith" },
	{ id: "17", regionName: "Region 1", admin: "June Parker" },
	{ id: "18", regionName: "Region 1", admin: "Casey Walker" },
	{ id: "19", regionName: "Region 1", admin: "Jordon Lee" },
	{ id: "20", regionName: "Region 1", admin: "Taylor Morgan" },
	{ id: "21", regionName: "Region 1", admin: "Sam Patel" },
	{ id: "22", regionName: "Region 1", admin: "Chris Johnson" },
	{ id: "23", regionName: "Region 1", admin: "Ovi Smith" },
	{ id: "24", regionName: "Region 1", admin: "June Parker" },
	{ id: "25", regionName: "Region 1", admin: "Casey Walker" },
	{ id: "26", regionName: "Region 1", admin: "Jordon Lee" },
	{ id: "27", regionName: "Region 1", admin: "Taylor Morgan" },
	{ id: "28", regionName: "Region 1", admin: "Sam Patel" },
	{ id: "29", regionName: "Region 1", admin: "Sam Patel" },
	{ id: "30", regionName: "Region 1", admin: "Sam Patel" },
	{ id: "31", regionName: "Region 1", admin: "Sam Patel" },
	{ id: "32", regionName: "Region 1", admin: "Chris Johnson" },
	{ id: "33", regionName: "Region 1", admin: "Ovi Smith" },
	{ id: "34", regionName: "Region 1", admin: "June Parker" },
	{ id: "35", regionName: "Region 1", admin: "Casey Walker" },
	{ id: "36", regionName: "Region 1", admin: "Jordon Lee" },
	{ id: "37", regionName: "Region 1", admin: "Taylor Morgan" },
	{ id: "38", regionName: "Region 1", admin: "Sam Patel" },
	{ id: "39", regionName: "Region 1", admin: "Sam Patel" },
	{ id: "40", regionName: "Region 1", admin: "Sam Patel" },
	{ id: "41", regionName: "Region 1", admin: "Sam Patel" },
	{ id: "42", regionName: "Region 1", admin: "Chris Johnson" },
	{ id: "43", regionName: "Region 1", admin: "Ovi Smith" },
	{ id: "44", regionName: "Region 1", admin: "June Parker" },
	{ id: "45", regionName: "Region 1", admin: "Casey Walker" },
	{ id: "46", regionName: "Region 1", admin: "Jordon Lee" },
	{ id: "47", regionName: "Region 1", admin: "Taylor Morgan" },
	{ id: "48", regionName: "Region 1", admin: "Sam Patel" },
	{ id: "49", regionName: "Region 1", admin: "Sam Patel" },
	{ id: "50", regionName: "Region 1", admin: "Sam Patel" },
];

function RegionDashboardPage() {
	const navigate = useNavigate();
	const [perPage, setPerPage] = useState(10);
	const [page, setCPage] = useState(1);
	const [selected, setSelected] = useState(showOptions[0]);
	// const [data, setData] = useState<TRegion[]>(tableData);
	const { data, refetch, isFetching } = useFetchAllRegions({ limit: perPage });
	const { currentPage, setPage, totalPages, currentItems } =
		usePagination<TRegion>(data?.regions, page, perPage, data?.pagination);

	useEffect(() => {
		setCPage(currentPage);
	}, [currentPage]);

	useEffect(() => {
		setPerPage(selected.value);
	}, [selected]);

	const handleEdit = (id: string) => {
		console.log("Edit:", id);
		navigate(constant.ROUTING_URLS.EDIT_REGION.replace(":id", id));
	};
	const deleteRegion = queries.useDeleteRegionMutation();
	const handleDelete = (id: string) => {
		try {
			toastPromise(deleteRegion.mutateAsync(id), {
				loading: "Deleting Region...",
				success: (res) => {
					if (res?.status === true) refetch();
					return "Yeah! Region deleted successfully";
				},
				error: (e) =>
					e instanceof Error ? e.message : "Opps! Error deleting region",
			});
		} catch (error) {
			if (error instanceof Error) {
				toast.error(error.message);
			} else {
				toast.error("Opps! An unexpected error occured");
			}
		}
	};
	const editRegionMutation = queries.useEditRegionMutation();
	const handleAccess = async (id: string, permissionIds: string[]) => {
		console.log("manage access:", permissionIds, "id:", id);
		toastPromise(
			await editRegionMutation.mutateAsync({
				id,
				data: { permissionAccess: permissionIds },
			}),
			{
				loading: "Updating access...",
				success: (res) => {
					if (res.status === true) refetch();
					return "Yeah! Region updated.";
				},
				error: (e) =>
					e instanceof Error
						? e.message
						: "Opps! Failed to update access permission.",
			},
		);
	};
	const columns = getRegionColumns(handleEdit, handleDelete, handleAccess);

	const [searchValue, setSearchValue] = useState("");
	const [rowSelection, setRowSelection] = useState({});
	// Number of pages based on filtered data
	const calculatedTotalPages = Math.max(1, totalPages);

	// Handle page change
	const handlePageChange = (newPage: number) => {
		setCPage(newPage);
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
			<PageTitle title={generatePageTitle("Region")} />
			<div className="p-6 space-y-6 md:p-8 md:space-y-8">
				<Header className="p-4 bg-[#FDFDFD] shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
					<div className="w-full h-full flex items-center justify-between">
						<div>
							<h2 className="font-medium text-xl text-black">
								Region Management
							</h2>
							<h4>
								<span className="text-[#959595]">LIMOSPRO</span>{" "}
								<span className="text-[#959595]">/ Region Management</span>{" "}
								<span className="text-xs text-[#3A3A3A]">/ Regions</span>
							</h4>
						</div>
						<Link to={constant.ROUTING_URLS.CREATE_REGION}>
							{" "}
							<Button>
								<Plus />
								<span>Add Regions</span>
							</Button>
						</Link>
					</div>
				</Header>

				<div className="flex justify-between">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button>
								{selected.label} <ChevronDown />
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
							<Button
								variant={"outlineBlack"}
								// @ts-expect-error: We are intentionally assigning a number to a string type for testing.
								disabled={
									Object.keys(rowSelection).filter((k) => rowSelection[k])
										.length === 0
								}
								onClick={() => {
									setData((prev) =>
										// @ts-expect-error: We are intentionally assigning a number to a string type for testing.
										prev.filter((row, i) => !rowSelection[i]),
									);
									console.log("data:", data);
									console.log("rowSelection:", rowSelection);
									setRowSelection({});
								}}
							>
								<span>Delete</span>
								<Trash2 />
							</Button>
						</span>
						<div className="">
							<InputGroup>
								<InputGroupInput
									type="search"
									placeholder="search"
									value={searchValue}
									onChange={(e) => setSearchValue(e.target.value)}
								/>
								<InputGroupAddon>
									<Search />
								</InputGroupAddon>
							</InputGroup>
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
						globalFilter={searchValue}
						onGlobalFilterChange={setSearchValue}
					/>
				)}

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

export default RegionDashboardPage;
