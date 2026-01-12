import { IconFilterX } from "@tabler/icons-react";
import type { Table } from "@tanstack/react-table";
import { AxiosError } from "axios";
import { Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFetchAllUsers } from "@/api";
import BulkDeleteBtn from "@/components/bulkDeleteBtn/BulkDeleteBtn";
import { ErrorCard } from "@/components/common/ErrorCard";
import PageTitle from "@/components/common/PageTitle";
import { PageHeader } from "@/components/layouts/PageHeader";
import PaginationControls from "@/components/pagination/PaginationControls";
import { PermissionGate } from "@/components/permissions";
import { Spinner } from "@/components/Spinner";
import { getUsers, type TUsers } from "@/components/table/column";
import { DataTable } from "@/components/table/data-table";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { SelectDropDown } from "@/components/ui/select";
import { toastPromise } from "@/hooks/use-toast";
import usePagination from "@/hooks/usePagination";
import { constant } from "@/lib/constant";
import queries from "@/lib/queries";
import { generatePageTitle } from "@/utils/seo";

const showStatus = [
  { label: "Active", value: "active" },
  { label: "In Active", value: "inActive" },
  { label: "Suspended", value: "suspended" },
];

const showTime = [
  { label: "Weekly", value: "weekly" },
  { label: "Monthly", value: "monthly" },
  { label: "Yearly", value: "yearly" },
];

function UsersPage() {
  const navigate = useNavigate();
  const [perPage, setperPage] = useState<number>(10);
  const [newPage, setNewPage] = useState<number>(1);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
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
      default:
        start = undefined;
        return { startDate: undefined, endDate: undefined };
    }
    return { startDate: start, endDate: end };
  }, [selectedTime]);

  const [tableRef, setTableRef] = useState<Table<TUsers> | null>(null);

  const { data, refetch, isFetching, isError } = useFetchAllUsers({
    DateRange: { startDate, endDate },
    page: newPage,
    status: selectedStatus,
    limit: perPage,
  });

  const { currentPage, setPage, totalPages, currentItems } =
    usePagination<TUsers>(data?.users, newPage, perPage, data?.pagination);

  const handleView = (id: string) => {
    // console.log("view:", id);
    navigate(constant.ROUTING_URLS.VIEW_USERS.replace(":id", id));
  };

  const handleEdit = (id: string) => {
    // console.log("Edit:", id);
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
        return e instanceof AxiosError
          ? e.response?.data?.data?.error || e.response?.data?.message
          : "Failed to delete user.";
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
  const handlePageChange = (value: number) => {
    setNewPage(value);
    setPage(value);
    window.scrollTo(0, 0);
  };

  // Handle per-page size change
  const handlePerPageChange = (value: number) => {
    setperPage(value);
    setNewPage(1);
    setPage(1);
    refetch();
  };

  if (isError) return <ErrorCard refetch={refetch} />;
  return (
    <>
      <PageTitle title={generatePageTitle("Users")} />
      <div className="p-6 space-y-6 md:p-8 md:space-y-8">
        <PageHeader
          title="Users"
          breadcrumbs={[{ label: "Home", path: "/" }, { label: "Users" }]}
          action={{
            label: "Add User",
            icon: <Plus />,
            link: constant.ROUTING_URLS.CREATE_USERS,
            permission: "manageUsers",
            actionName: "create",
          }}
        />

        <div className="flex items-end justify-between gap-4">
          <div className="flex items-center gap-4">
            <SelectDropDown
              placeholder={"Select Status"}
              items={showStatus}
              value={selectedStatus}
              setSelectedItem={setSelectedStatus}
            />
            <SelectDropDown
              placeholder={"Select Time"}
              items={showTime}
              value={selectedTime}
              setSelectedItem={setSelectedTime}
            />
          </div>
          <div className="w-full max-w-fit flex flex-wrap items-center justify-between gap-4">
            <Button
              onClick={() => {
                setSelectedStatus("");
                setSelectedTime("");
                setSearchValue("");
              }}
              type="button"
              variant={"outlineSecondary"}
            >
              <IconFilterX /> <span>Clear Filter</span>
            </Button>
            <PermissionGate permission="manageUsers" action="bulkDelete">
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
                  title="manageUsers"
                  descTitle="users"
                  rowSelection={rowSelection}
                  setRowSelection={setRowSelection}
                  tableRef={tableRef}
                />
              </span>
            </PermissionGate>
            <div className="">
              <InputGroup>
                <InputGroupInput
                  type="search"
                  placeholder="Search"
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
        {totalPages >= 0 && calculatedTotalPages >= 1 && (
          <PaginationControls
            currentPage={currentPage}
            totalPages={calculatedTotalPages}
            onPageChange={handlePageChange}
            onPerPageChange={handlePerPageChange}
            totalItems={data?.pagination?.totalItems}
            perPage={perPage}
          />
        )}
      </div>
    </>
  );
}

export default UsersPage;
