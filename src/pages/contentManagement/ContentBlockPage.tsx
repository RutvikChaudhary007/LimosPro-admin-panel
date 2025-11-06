//@ts-nocheck

import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import useFetchAllContentBlock from "@/api/contentBlock.api";
import BulkDeleteBtn from "@/components/bulkDeleteBtn/BulkDeleteBtn";
import { ErrorCard } from "@/components/common/ErrorCard";
import PageTitle from "@/components/common/PageTitle";
import Header from "@/components/layouts/BreadCramb";
import { Spinner } from "@/components/Spinner";
import { getContent } from "@/components/table/column";
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
import { toastPromise } from "@/hooks/use-toast";
import { constant } from "@/lib/constant";
import queries from "@/lib/queries";
import { generatePageTitle } from "@/utils/seo";

function ContentBlockPage() {
	const navigate = useNavigate();
	const perPage = 10;
	const [newPage, setNewPage] = useState<number>(1);
	const [tableRef, setTableRef] = useState<any>(null);
	const { data, refetch, isFetching, isError } = useFetchAllContentBlock({
		limit: perPage,
	});

	const tabsData = useMemo(() => {
		const uniqueTabs = new Set();
		data?.blocks?.foreach((rawData) => {
			uniqueTabs.add(rawData?.pageName);
		});
		return uniqueTabs;
	}, [data]);

	const handleEdit = (id: string) => {
		console.log("Edit:", id);
		navigate(constant.ROUTING_URLS.EDIT_CONTENT_MANAGEMENT.replace(":id", id));
	};
	//   const deleteChauffeurMutation = queries.useDeleteChauffeurMutation();
	//   const bulkDeleteChauffeurMutation = queries.useBulkDeleteChauffeurMutation();
	const handleDelete = (id: string) => {
		console.log("id", id);
		try {
			toastPromise(deleteChauffeurMutation.mutateAsync(id), {
				loading: "Deleting chauffeur...",
				success: (res) => {
					//   if(res) refetch();
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
	const columns = getContent(handleEdit, handleDelete);

	const [searchValue, setSearchValue] = useState("");
	const [rowSelection, setRowSelection] = useState<{ [key: string]: boolean }>(
		{},
	);

	const { currentPage, setPage, totalPages, currentItems } = usePagination<any>(
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
			<PageTitle title={generatePageTitle("ContentBlock")} />
			<div className="px-10 py-6 h-[calc(100vh-146px)] overflow-y-scroll">
				<Header className="p-4 h-[79px] bg-[#FDFDFD] shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
					<div className="w-full h-full flex items-center justify-between">
						<div>
							<h2 className="font-medium text-xl text-black">Content Block</h2>
							<h4>
								{" "}
								<span className="text-[#515151] w-[116px] h-4 text-xs">
									LIMOSPRO
								</span>{" "}
								<span className="text-xs text-[#939393] w-[50px] h-4">
									/ Content Block
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
									Add Content Block
								</span>
							</Button>
						</Link>
					</div>
				</Header>

				<div className="flex justify-between gap-2.5">
					<div className="flex items-center gap-3"></div>
					<div className="w-[369px] h-[39px] mt-5 flex items-center justify-end gap-3">
						<span
							className={`${Object.keys(rowSelection).filter((k) => rowSelection[k]).length === 0 ? "cursor-no-drop" : "cursor-pointer"}`}
						>
							<BulkDeleteBtn
								rowSelection={rowSelection}
								tableRef={tableRef}
								bulkDeleteMutation={() => {}}
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

export default ContentBlockPage;
