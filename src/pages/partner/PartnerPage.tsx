import { IconFilterX } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import type { Table } from "@tanstack/react-table";
import { AxiosError } from "axios";
import { Plus, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { getAllPartner, useFetchAllPartner } from "@/api";
import BulkDeleteBtn from "@/components/bulkDeleteBtn/BulkDeleteBtn";
import { ErrorCard } from "@/components/common/ErrorCard";
import PageTitle from "@/components/common/PageTitle";
import { PageHeader } from "@/components/layouts/PageHeader";
import PaginationControls from "@/components/pagination/PaginationControls";
import { PermissionGate } from "@/components/permissions";
import { Spinner } from "@/components/Spinner";
import { getPartner } from "@/components/table/column";
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
import type { TBlkDelRes } from "@/types/global/BulkDeleteResponse.type";
import type { IPartner } from "@/types/partner/partner.type";
import { generatePageTitle } from "@/utils/seo";

const showStatus = [
  { label: "Approved", value: "approved" },
  { label: "Pending", value: "pending" },
  { label: "Rejected", value: "rejected" },
];

const showTime = [
  { label: "Weekly", value: "weekly" },
  { label: "Monthly", value: "monthly" },
  { label: "Quarterly", value: "quarterly" },
  { label: "6 Months", value: "6_months" },
  { label: "Yearly", value: "yearly" },
];

function PartnerPage() {
  const navigate = useNavigate();
  const [perPage, setperPage] = useState<number>(10);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
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

    switch (selectedTime) {
      case "weekly":
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

      case "monthly":
        start = new Date(
          Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0, 0),
        );
        break;

      case "quarterly":
        start = new Date(
          Date.UTC(
            now.getUTCFullYear(),
            now.getUTCMonth() - 2,
            now.getUTCDate(),
            0,
            0,
            0,
            0,
          ),
        );
        break;

      case "6_months":
        start = new Date(
          Date.UTC(
            now.getUTCFullYear(),
            now.getUTCMonth() - 5,
            now.getUTCDate(),
            0,
            0,
            0,
            0,
          ),
        );
        break;

      case "yearly":
        start = new Date(Date.UTC(now.getUTCFullYear(), 0, 1, 0, 0, 0, 0));
        break;

      default:
        start = undefined;
    }

    return { startDate: start, endDate: selectedTime ? end : undefined };
  }, [selectedTime]);

  const [newPage, setNewPage] = useState<number>(1);
  const {
    data: FetchData,
    refetch,
    isFetching,
    isError,
  } = useFetchAllPartner({
    DateRange: { startDate, endDate },
    page: newPage,
    limit: perPage,
    status: selectedStatus,
  });
  const [tableRef, setTableRef] = useState<Table<IPartner> | null>(null);
  const queryClient = useQueryClient();
  useEffect(() => {
    if (FetchData?.pagination?.hasNextPage === true) {
      queryClient.prefetchQuery({
        queryKey: ["Partner", { startDate, endDate }, newPage + 1, perPage],
        queryFn: () =>
          getAllPartner(
            { startDate, endDate },
            newPage + 1,
            perPage,
            selectedStatus,
          ),
      });
    }
  }, [
    queryClient,
    newPage,
    FetchData,
    startDate,
    endDate,
    selectedStatus,
    perPage,
  ]);

  const { currentPage, setPage, totalPages, currentItems } =
    usePagination<IPartner>(
      FetchData?.partners,
      newPage,
      perPage,
      FetchData?.pagination,
    );
  useEffect(() => {
    if (currentPage) {
      setNewPage(currentPage);
    }
  }, [currentPage]);

  // Reset to page 1 when perPage changes
  useEffect(() => {
    setPage(1);
    setNewPage(1);
  }, [perPage, setPage]);

  const handleView = (id: string) => {
    navigate(constant.ROUTING_URLS.VIEW_PARTNER.replace(":id", id));
  };

  const deletePartnerMutation = queries.useDeletePartnerMutation(refetch);
  const bulkDeletePartnerMutation = queries.useBulkDeletePartnerMutation();
  const handleEdit = (id: string) => {
    navigate(constant.ROUTING_URLS.EDIT_PARTNER.replace(":id", id));
  };
  const handleDelete = async (id: string) => {
    try {
      // Remove remember field before sending to API
      // await loginMutation.mutateAsync(loginData);
      toastPromise(deletePartnerMutation.mutateAsync(id), {
        loading: "Deleting Partner...",
        success: "Yeah! Partner deleted successfully!",
        error: (e) =>
          e instanceof AxiosError
            ? e.response?.data?.data?.error || e.response?.data?.message
            : "Opps! Failed to delete Partner",
      });
    } catch (error) {
      // Error handling is done in onError callback
      console.error("Partner delete error:", error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Opps! An unknown error occurred.");
      }
    }
  };
  const columns = getPartner(handleView, handleEdit, handleDelete);
  const [searchValue, setSearchValue] = useState("");
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  useEffect(() => {
    if (currentPage) {
      console.log("currentPage:", currentPage);
      setRowSelection({});
    }
  }, [currentPage]);

  // Number of pages based on filtered data
  const calculatedTotalPages = Math.max(1, totalPages);

  // Handle page change
  const handlePageChange = (value: number) => {
    setNewPage(value);
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
      <PageTitle title={generatePageTitle("Partner")} />
      <div className="p-6 space-y-6 md:p-8 md:space-y-8">
        <PageHeader
          title="Partner"
          breadcrumbs={[{ label: "Home", path: "/" }, { label: "Partner" }]}
          action={{
            label: "Add Partner",
            icon: <Plus />,
            link: constant.ROUTING_URLS.CREATE_PARTNER,
            permission: "managePartners",
            actionName: "create",
          }}
        />

        <div className="flex justify-between">
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
          <div className="w-full max-w-fit flex flex-wrap items-center justify-end gap-4">
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
            <PermissionGate permission="managePartners" action="bulkDelete">
              <span
                className={`${Object.keys(rowSelection).filter((k) => rowSelection[k]).length === 0 ? "cursor-no-drop" : "cursor-pointer"}`}
              >
                <BulkDeleteBtn<IPartner, TBlkDelRes>
                  rowSelection={rowSelection}
                  tableRef={tableRef}
                  bulkDeleteMutation={bulkDeletePartnerMutation}
                  refetch={refetch}
                  setRowSelection={setRowSelection}
                  title="managePartners"
                  descTitle="Partners"
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
            onPerPageChange={handlePerPageChange}
            totalItems={FetchData?.pagination?.totalItems}
            perPage={perPage}
          />
        )}
      </div>
    </>
  );
}

export default PartnerPage;
