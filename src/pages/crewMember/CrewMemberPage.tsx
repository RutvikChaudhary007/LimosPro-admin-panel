// @ts-nocheck

import { ChevronDown, Plus, Trash2 } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import useFetchAllCrewMember from "@/api/crewMember.api";
import BulkDeleteBtn from "@/components/bulkDeleteBtn/BulkDeleteBtn";
import { ErrorCard } from "@/components/common/ErrorCard";
import PageTitle from "@/components/common/PageTitle";
import Header from "@/components/layouts/Header";
import { Spinner } from "@/components/Spinner";
import { getCrewMember, type TCrewMember } from "@/components/table/column";
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

// const tableData: TCrewMember [] = [
//   { id: "1", name: "Chris Johnson", designation: "USA Regional Sales Manager", email: "name@email.com", phone: "+1-624-231-6798", },
//   { id: "2", name: "Ovi Smith", designation: "Administrative Assistant", email: "name@email.com", phone: "+1-624-231-6798",},
//   { id: "3", name: "June Parker", designation: "Quality Assurance Officer", email: "name@email.com", phone: "+1-624-231-6798",},
//   { id: "4", name: "Casey Walker", designation: "Booking Agent", email: "name@email.com", phone: "+1-624-231-6798",},
//   { id: "5", name: "Jordon Lee", designation: "Driver Relations Manager", email: "name@email.com", phone: "+1-624-231-6798",},
//   { id: "6", name: "Taylor Morgan", designation: "Fleet Supervisor", email: "name@email.com", phone: "+1-624-231-6798",},
//   { id: "7", name: "Sam Patel", designation: "Dispatcher", email: "name@email.com", phone: "+1-624-231-6798",},
//   { id: "8", name: "Chris Johnson", designation: "Sales Representative", email: "name@email.com", phone: "+1-624-231-6798",},
//   { id: "9", name: "Ovi Smith", designation: "Operations Manager", email: "name@email.com", phone: "+1-624-231-6798",},
//   { id: "10", name: "June Parker", designation: "Sales Representative", email: "name@email.com", phone: "+1-624-231-6798",},
//   { id: "11", name: "Casey Walker", designation: "Dispatcher", email: "name@email.com", phone: "+1-624-231-6798",},
//   { id: "12", name: "Jordon Lee", designation: "Fleet Supervisor", email: "name@email.com", phone: "+1-624-231-6798",},
//   { id: "13", name: "Taylor Morgan", designation: "Driver Relations Manager", email: "name@email.com", phone: "+1-624-231-6798",},
//   { id: "14", name: "Sam Patel", designation: "Booking Agent", email: "name@email.com", phone: "+1-624-231-6798",},
//   { id: "15", name: "Chris Johnson", designation: "Quality Assurance Officer", email: "name@email.com", phone: "+1-624-231-6798",},
//   { id: "16", name: "Ovi Smith", designation: "Administrative Assistant", email: "name@email.com", phone: "+1-624-231-6798",},
//   { id: "17", name: "June Parker", designation: "Booking Agent", email: "name@email.com", phone: "+1-624-231-6798",},
//   { id: "18", name: "Casey Walker", designation: "", email: "name@email.com", phone: "+1-624-231-6798",},
//   { id: "19", name: "Jordon Lee", designation: "", email: "name@email.com", phone: "+1-624-231-6798", },
//   { id: "20", name: "Taylor Morgan", designation: "", email: "name@email.com", phone: "+1-624-231-6798",},
//   { id: "21", name: "Sam Patel", designation: "",email: "name@email.com", phone: "+1-624-231-6798", },
//   { id: "22", name: "Chris Johnson", designation: "",email: "name@email.com", phone: "+1-624-231-6798", },
//   { id: "23", name: "Ovi Smith", designation: "",email: "name@email.com", phone: "+1-624-231-6798", },
//   { id: "24", name: "June Parker", designation: "", email: "name@email.com", phone: "+1-624-231-6798",},
//   { id: "25", name: "Casey Walker", designation: "", email: "name@email.com", phone: "+1-624-231-6798",},
//   { id: "26", name: "Jordon Lee", designation: "", email: "name@email.com", phone: "+1-624-231-6798",},
//   { id: "27", name: "Taylor Morgan", designation: "",email: "name@email.com", phone: "+1-624-231-6798", },
//   { id: "28", name: "Sam Patel", designation: "",email: "name@email.com", phone: "+1-624-231-6798", },
//   { id: "29", name: "Sam Patel", designation: "",email: "name@email.com", phone: "+1-624-231-6798", },
//   { id: "30", name: "Sam Patel", designation: "", email: "name@email.com", phone: "+1-624-231-6798",},
//   { id: "31", name: "Sam Patel", designation: "", email: "name@email.com", phone: "+1-624-231-6798",},
//   { id: "32", name: "Chris Johnson", designation: "", email: "name@email.com", phone: "+1-624-231-6798",},
//   { id: "33", name: "Ovi Smith", designation: "", email: "name@email.com", phone: "+1-624-231-6798",},
//   { id: "34", name: "June Parker", designation: "", email: "name@email.com", phone: "+1-624-231-6798",},
//   { id: "35", name: "Casey Walker", designation: "",email: "name@email.com", phone: "+1-624-231-6798", },
//   { id: "36", name: "Jordon Lee", designation: "", email: "name@email.com", phone: "+1-624-231-6798",},
//   { id: "37", name: "Taylor Morgan", designation: "", email: "name@email.com", phone: "+1-624-231-6798",},
//   { id: "38", name: "Sam Patel", designation: "",email: "name@email.com", phone: "+1-624-231-6798", },
//   { id: "39", name: "Sam Patel", designation: "", email: "name@email.com", phone: "+1-624-231-6798",},
//   { id: "40", name: "Sam Patel", designation: "", email: "name@email.com", phone: "+1-624-231-6798",},
//   { id: "41", name: "Sam Patel", designation: "",email: "name@email.com", phone: "+1-624-231-6798",},

// ];

const CrewMemberPage = () => {
	const naviagte = useNavigate();
	const [tableRef, setTableRef] = useState<any>(null);
	const [newPage, setNewPage] = useState(1);
	const [selected, setSelected] = useState(showOptions[0]);
	// const [data, setData] = useState<TCrewMember[]>(tableData);
	const { data, refetch, isFetching, isError } = useFetchAllCrewMember({
		page: newPage,
		limit: 10,
	});
	const { currentPage, setPage, totalPages, currentItems } =
		usePagination<TCrewMember>(
			data?.crewMembers || [],
			newPage,
			selected.value,
			data?.pagination,
		);

	const handleEdit = useCallback((id: string) => {
		console.log("Edit:", id);
		naviagte(constant.ROUTING_URLS.EDIT_CREW_MEMBERS.replace(":id", id));
	}, []);
	const deleteCrewMember = queries.useDeleteCrewMemberMutation();
	const bulkDeleteCrewMember = queries.useBulkDeleteCrewMemberMutation();

	const handleDelete = (id: string) => {
		try {
			toastPromise(deleteCrewMember.mutateAsync({ id }), {
				loading: "Deleting crew member...",
				success: (res) => {
					if (res) refetch();
					return `Crew member deleted successfully`;
				},
				error: (e) =>
					e instanceof Error ? e.message : "Failed to delete crew member",
			});
		} catch (error) {
			if (error instanceof Error) {
				toast.error(error.message);
			} else {
				toast.error("An unknown error occurred");
			}
		}
		// setData((prev) =>
		//   prev.filter((row) => row.id !== id))
	};
	const columns = getCrewMember(handleEdit, handleDelete);

	const [searchValue, setSearchValue] = useState("");
	const [rowSelection, setRowSelection] = useState({});
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
			<PageTitle title={generatePageTitle("Crew Member")} />
			<div className="px-10 py-6 h-[calc(100vh-146px)] overflow-auto">
				<Header className="p-4 h-[79px] bg-[#FDFDFD] shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
					<div className="w-full h-full flex items-center justify-between">
						<div>
							<h2 className="font-medium text-xl text-black">Crew Member</h2>
							<h4>
								<span className="text-[#959595] w-14 h-4">LIMOSPRO</span>{" "}
								<span className="text-[#959595] w-[116px] h-4">
									/ Crew Member
								</span>
							</h4>
						</div>
						<Link to={constant.ROUTING_URLS.CREATE_CREW_MEMBERS}>
							{" "}
							<Button
								variant={"outline"}
								className="cursor-pointer bg-[#E4E4E4] flex items-center rounded"
							>
								<Plus className="text-[#515151]" />
								<span className="text-[#515151] font-medium text-sm">
									Add a Crew Member
								</span>
							</Button>
						</Link>
					</div>
				</Header>

				<div className="flex justify-between">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="outline"
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
								bulkDeleteMutation={bulkDeleteCrewMember}
								refetch={refetch}
								setRowSelection={setRowSelection}
								title="Crew Members"
								descTitle="crew members"
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
};

export default CrewMemberPage;
