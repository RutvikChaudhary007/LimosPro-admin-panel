// @ts-nocheck

import { Plus, Search } from "lucide-react";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import useFetchAllCrewMember from "@/api/crewMember.api";
import BulkDeleteBtn from "@/components/bulkDeleteBtn/BulkDeleteBtn";
import { ErrorCard } from "@/components/common/ErrorCard";
import PageTitle from "@/components/common/PageTitle";
import { PageHeader } from "@/components/layouts/PageHeader";
import { Spinner } from "@/components/Spinner";
import { getCrewMember, type TCrewMember } from "@/components/table/column";
import { DataTable } from "@/components/table/data-table";
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
import { SelectDropDown } from "@/components/ui/select";
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

const CrewMemberPage = () => {
  const [{ value: optionDefaultValue }] = showOptions;
  const naviagte = useNavigate();
  const [tableRef, setTableRef] = useState<any>(null);
  const [newPage, setNewPage] = useState(1);
  const [selectedOption, setSelectedOption] = useState(optionDefaultValue);
  // const [data, setData] = useState<TCrewMember[]>(tableData);
  const { data, refetch, isFetching, isError } = useFetchAllCrewMember({
    page: newPage,
    limit: 10,
  });
  const { currentPage, setPage, totalPages, currentItems } =
    usePagination<TCrewMember>(
      data?.crewMembers || [],
      newPage,
      selectedOption,
      data?.pagination,
    );

  const handleEdit = useCallback(
    (id: string) => {
      console.log("Edit:", id);
      naviagte(constant.ROUTING_URLS.EDIT_CREW_MEMBERS.replace(":id", id));
    },
    [naviagte],
  );
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
      <div className="p-6 space-y-6 md:p-8 md:space-y-8">
        <PageHeader
          title="Crew Member"
          breadcrumbs={[{ label: "Home", path: "/" }, { label: "Crew Member" }]}
          action={{
            label: "Add a Crew Member",
            icon: <Plus />,
            link: constant.ROUTING_URLS.CREATE_CREW_MEMBERS,
          }}
        />

        <div className="flex justify-between">
          <SelectDropDown
            placeholder={selectedOption}
            items={showOptions}
            value={selectedOption}
            setSelectedItem={setSelectedOption}
          />
          <div className="w-full max-w-fit flex items-center justify-between gap-4">
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
