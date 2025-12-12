import { AxiosError } from "axios";
import { Plus, Search } from "lucide-react";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useFetchAllStaffMember } from "@/api";
import BulkDeleteBtn from "@/components/bulkDeleteBtn/BulkDeleteBtn";
import { ErrorCard } from "@/components/common/ErrorCard";
import PageTitle from "@/components/common/PageTitle";
import { PageHeader } from "@/components/layouts/PageHeader";
import { PaginationControls } from "@/components/pagination";
import { Spinner } from "@/components/Spinner";
import { getStaffMember, type TStaffMember } from "@/components/table/column";
import { DataTable } from "@/components/table/data-table";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { toastPromise } from "@/hooks/use-toast";
import usePagination from "@/hooks/usePagination";
import { constant } from "@/lib/constant";
import queries from "@/lib/queries";
import { generatePageTitle } from "@/utils/seo";

const StaffMemberPage = () => {
  const navigate = useNavigate();
  const [newPage, setNewPage] = useState(1);
  const [perPage, setPerPage] = useState<number>(10);
  const [tableRef, setTableRef] = useState<any>(null);
  const { data, refetch, isFetching, isError } = useFetchAllStaffMember({
    page: newPage,
    limit: perPage,
  });

  const { currentPage, setPage, totalPages, currentItems } =
    usePagination<TStaffMember>(
      data?.staffMembers,
      newPage,
      perPage,
      data?.pagination,
    );

  // console.log("StaffMemberPage Render:", {
  //   perPage,
  //   newPage,
  //   isFetching,
  //   dataLen: data?.staffMembers?.length,
  //   pagination: data?.pagination,
  //   ids: data?.staffMembers?.map((m: any) => m.id)
  // });

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
            e instanceof AxiosError
              ? e.response?.data?.message
              : "An unknown error occurred",
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

  // Remove useMemo to match UsersPage
  const columns = getStaffMember(handleEdit, handleAccess, handleDelete);

  const [searchValue, setSearchValue] = useState("");
  const [rowSelection, setRowSelection] = useState<{ [key: string]: boolean }>(
    {},
  );
  // Number of pages based on filtered data
  const calculatedTotalPages = Math.max(1, totalPages);

  // Unified handler for page and page size changes
  const handlePageChange = (value: number) => {
    // Check if it's a page size change (10, 20, or 30)
    if (value === 10 || value === 20 || value === 30) {
      setPerPage(value);
      setNewPage(1);
      setPage(1);
    } else {
      // Otherwise it's a page change
      setNewPage(value);
      setPage(value);
      window.scrollTo(0, 0);
    }
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
                placeholder="Search"
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
        {totalPages >= 0 && calculatedTotalPages >= 1 && (
          <PaginationControls
            currentPage={currentPage}
            totalPages={calculatedTotalPages}
            onPageChange={handlePageChange}
            totalItems={data?.pagination?.totalItems}
            perPage={perPage}
          />
        )}
      </div>
    </>
  );
};

export default StaffMemberPage;
