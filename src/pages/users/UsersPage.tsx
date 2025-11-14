import type { Table } from "@tanstack/react-table";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import UsefetchAllUsers from "@/api/getAllUser.api";
import BulkDeleteBtn from "@/components/bulkDeleteBtn/BulkDeleteBtn";
import { ErrorCard } from "@/components/common/ErrorCard";
import PageTitle from "@/components/common/PageTitle";
import { PageHeader } from "@/components/layouts/PageHeader";
import { Spinner } from "@/components/Spinner";
import { getUsers, type TUsers } from "@/components/table/column";
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

const showStatus = [
  { label: "Active", value: "active" },
  { label: "Pending", value: "pending" },
  { label: "Inactive", value: "inactive" },
  { label: "Suspended", value: "suspended" },
];

const showTime = [
  { label: "All Time", value: "all-time" },
  { label: "Weekly", value: "weekly" },
  { label: "Monthly", value: "monthly" },
  { label: "Yearly", value: "yearly" },
];

function UsersPage() {
  const [{ value: statusDefaultValue }] = showStatus;
  const [{ value: timeDefaultValue }] = showTime;
  const navigate = useNavigate();
  const perPage = 10;
  const [selectedStatus, setSelectedStatus] = useState(statusDefaultValue);
  const [selectedTime, setSelectedTime] = useState(timeDefaultValue);
  // --- Time range helper ---
  const { startDate, endDate } = useMemo(() => {
    const now = new Date();

    // End date (same for all except all-time)
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

    switch (selectedTime) {
      case "weekly": {
        start = new Date(
          Date.UTC(
            now.getUTCFullYear(),
            now.getUTCMonth(),
            now.getUTCDate() - 6, // last 7 days
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
      case "all-time": {
        start = undefined;
        return { startDate: undefined, endDate: undefined };
      }
      default:
        start = undefined;
    }
    return { startDate: start, endDate: end };
  }, [selectedTime]);

  const [tableRef, setTableRef] = useState<Table<TUsers> | null>(null);

  const { data, refetch, isFetching, isError } = UsefetchAllUsers({
    DateRange: { startDate, endDate },
  });

  const { currentPage, setPage, totalPages, currentItems } =
    usePagination<TUsers>(data?.users, 1, perPage);

  const handleView = (id: string) => {
    console.log("view:", id);
    navigate(constant.ROUTING_URLS.VIEW_USERS.replace(":id", id));
  };

  const handleEdit = (id: string) => {
    console.log("Edit:", id);
    navigate(constant.ROUTING_URLS.EDIT_USERS.replace(":id", id));
  };
  const deleteUserMutation = queries.useDeleteUserMutation();
  const bulkDeleteUserMutation = queries.useBulkDeleteUserMutation();
  const handleDelete = async (id: string) => {
    toastPromise(await deleteUserMutation.mutateAsync(id), {
      loading: "Loading...",
      success: (res) => {
        if (res) refetch();
        return "yeah! user deleted successfully";
      },
      error: (e) => {
        return e instanceof Error ? e.message : "Failed to delete user.";
      },
    });
    //   setData((prev) =>
    //     prev.filter((row) => row.id !== id))
  };

  const columns = getUsers(handleView, handleEdit, handleDelete);
  const [searchValue, setSearchValue] = useState("");
  const [rowSelection, setRowSelection] = useState<{ [key: string]: boolean }>(
    {},
  );

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
      <PageTitle title={generatePageTitle("Users")} />
      <div className="p-6 space-y-6 md:p-8 md:space-y-8">
        <PageHeader
          title="Users"
          breadcrumbs={[{ label: "Home", path: "/" }, { label: "Users" }]}
        />

        <div className="flex items-end justify-between gap-4">
          <div className="flex items-center gap-4">
            <SelectDropDown
              placeholder={selectedStatus}
              items={showStatus}
              value={selectedStatus}
              setSelectedItem={setSelectedStatus}
            />
            <SelectDropDown
              placeholder={selectedTime}
              items={showTime}
              value={selectedTime}
              setSelectedItem={setSelectedTime}
            />
          </div>
          <div className="w-full max-w-fit flex items-center justify-between gap-4">
            <span
              className={`${
                Object.keys(rowSelection).filter((k) => rowSelection[k])
                  .length === 0
                  ? "cursor-no-drop"
                  : "cursor-pointer"
              }`}
            >
              <BulkDeleteBtn
                refetch={refetch}
                bulkDeleteMutation={bulkDeleteUserMutation}
                title="Users"
                descTitle="users"
                rowSelection={rowSelection}
                setRowSelection={setRowSelection}
                tableRef={tableRef}
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
            onTableReady={setTableRef}
            rowSelection={rowSelection}
            onRowSelectionChange={setRowSelection}
            globalFilter={searchValue}
            onGlobalFilterChange={setSearchValue}
          />
        )}

        {/* Pagination */}
        {data?.users?.length > 0 && calculatedTotalPages > 1 && (
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

export default UsersPage;
