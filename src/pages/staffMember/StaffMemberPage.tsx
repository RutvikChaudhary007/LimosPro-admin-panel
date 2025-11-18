//@ts-nocheck

import { Plus, Search } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import useFetchAllStaffMember from "@/api/staffMember.api";
import BulkDeleteBtn from "@/components/bulkDeleteBtn/BulkDeleteBtn";
import { ErrorCard } from "@/components/common/ErrorCard";
import PageTitle from "@/components/common/PageTitle";
import { PageHeader } from "@/components/layouts/PageHeader";
import { Spinner } from "@/components/Spinner";
import { getStaffMember, type TStaffMember } from "@/components/table/column";
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
import usePagination from "@/hooks/use-pagination";
import { toastPromise } from "@/hooks/use-toast";
import { constant } from "@/lib/constant";
import queries from "@/lib/queries";
import { generatePageTitle } from "@/utils/seo";

const StaffMemberPage = () => {
  const navigate = useNavigate();
  // const [perPage] = useState(10);
  const [newPage, setNewPage] = useState(1);
  const [tableRef, setTableRef] = useState<any>(null);
  // const [data, setData] = useState<TStaffMember[]>(tableData);
  const { data, refetch, isFetching, isError } = useFetchAllStaffMember({
    page: newPage,
    limit: 10,
  });

  const { currentPage, setPage, totalPages, currentItems } =
    usePagination<TStaffMember>(
      data?.staffMembers,
      newPage,
      10,
      data?.pagination,
    );

  const handleEdit = useCallback(
    (id: string) => {
      console.log("Edit:", id);
      navigate(constant.ROUTING_URLS.EDIT_STAFF_MEMBERS.replace(":id", id));
    },
    [navigate],
  );
  const handleAccess = useCallback((id: string) => {
    console.log("Access:", id);
  }, []);
  const deleteStaffMember = queries.useDeleteStaffMemberMutation();
  const bulkDeleteStaffMember = queries.useBulkDeleteStaffMemberMutation();
  const handleDelete = useCallback(
    (id: string) => {
      try {
        toastPromise(deleteStaffMember.mutateAsync({ id }), {
          loading: "Deleting staff member...",
          success: (res) => {
            if (res) refetch();
            return "Staff member deleted successfully";
          },
          error: (e) =>
            e instanceof Error ? e.message : "An unknown error occurred",
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
    },
    [deleteStaffMember.mutateAsync, refetch],
  );
  const columns = useMemo(
    () => getStaffMember(handleEdit, handleAccess, handleDelete),
    [handleEdit, handleAccess, handleDelete],
  );

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
      <PageTitle title={generatePageTitle("Staff Member")} />
      <div className="p-6 space-y-6 md:p-8 md:space-y-8">
        <PageHeader
          title="Staff Member"
          breadcrumbs={[
            { label: "Home", path: "/" },
            { label: "Staff Member" },
          ]}
          action={{
            label: "Add Staff Member",
            icon: <Plus />,
            link: constant.ROUTING_URLS.CREATE_STAFF_MEMBERS,
          }}
        />

        <div className="flex justify-between">
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

          <div className="">
            <span
              className={`${Object.keys(rowSelection).filter((k) => rowSelection[k]).length === 0 ? "cursor-no-drop" : "cursor-pointer"}`}
            >
              <BulkDeleteBtn
                rowSelection={rowSelection}
                tableRef={tableRef}
                bulkDeleteMutation={bulkDeleteStaffMember}
                refetch={refetch}
                setRowSelection={setRowSelection}
                title="Staff Members"
                descTitle="staff members"
              />
            </span>
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

export default StaffMemberPage;
