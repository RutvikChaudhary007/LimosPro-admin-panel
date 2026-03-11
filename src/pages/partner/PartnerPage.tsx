import { IconFilterX } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import type { Table } from "@tanstack/react-table";
import { AxiosError } from "axios";
import { Plus, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  getAllPartner,
  useFetchAllPartner,
  useUpdatePartnerStatusMutation,
} from "@/api";
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
import { queryKeys } from "@/lib/queryKeys";
import type { TBlkDelRes } from "@/types/global/BulkDeleteResponse.type";
import type { IPartner } from "@/types/partner/partner.type";
import { PartnerType } from "@/types/partner/partner.type";
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

const showPartnerType = [
  { label: "Corporate", value: PartnerType.CORPORATE },
  { label: "Hotel", value: PartnerType.HOTEL },
  { label: "Travel Agent", value: PartnerType.TRAVEL_AGENT },
  { label: "Individual", value: PartnerType.INDIVIDUAL },
];

function PartnerPage() {
  const navigate = useNavigate();
  const [perPage, setperPage] = useState<number>(10);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedPartnerType, setSelectedPartnerType] = useState("");
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
    partnerType: selectedPartnerType,
  });
  const [tableRef, setTableRef] = useState<Table<IPartner> | null>(null);
  const queryClient = useQueryClient();
  useEffect(() => {
    if (FetchData?.pagination?.hasNextPage === true) {
      queryClient.prefetchQuery({
        queryKey: queryKeys.partner.listParams(
          { startDate, endDate },
          newPage + 1,
          perPage,
          selectedStatus,
          selectedPartnerType,
        ),
        queryFn: () =>
          getAllPartner(
            { startDate, endDate },
            newPage + 1,
            perPage,
            selectedStatus,
            selectedPartnerType,
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
    selectedPartnerType,
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
  const handleDelete = async (id: string) => {
    try {
      toastPromise(deletePartnerMutation.mutateAsync(id), {
        loading: "Deleting Partner...",
        success: "Yeah! Partner deleted successfully!",
        error: (e) =>
          e instanceof AxiosError
            ? e.response?.data?.data?.error || e.response?.data?.message
            : "Opps! Failed to delete Partner",
      });
    } catch (error) {
      console.error("Partner delete error:", error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Opps! An unknown error occurred.");
      }
    }
  };

  const bulkDeletePartnerMutation = queries.useBulkDeletePartnerMutation();
  const handleEdit = (id: string) => {
    navigate(constant.ROUTING_URLS.EDIT_PARTNER.replace(":id", id));
  };
  const updateStatusMutation = useUpdatePartnerStatusMutation(refetch);

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await toastPromise(updateStatusMutation.mutateAsync({ id, status }), {
        loading: "Updating Status...",
        success: "Yeah! Partner status updated successfully!",
        error: (e) =>
          e instanceof AxiosError
            ? e.response?.data?.data?.error || e.response?.data?.message
            : "Opps! Failed to update status",
      });
    } catch (error) {
      console.error("Status update error:", error);
    }
  };

  const handleCommissionChange = async (id: string, commissionRate: number) => {
    try {
      await toastPromise(
        updateStatusMutation.mutateAsync({ id, commissionRate }),
        {
          loading: "Updating Commission...",
          success: "Yeah! Partner commission updated successfully!",
          error: (e) =>
            e instanceof AxiosError
              ? e.response?.data?.data?.error || e.response?.data?.message
              : "Opps! Failed to update commission",
        },
      );
    } catch (error) {
      console.error("Commission update error:", error);
    }
  };

  const columns = getPartner(
    handleView,
    handleEdit,
    handleDelete,
    handleStatusChange,
    handleCommissionChange,
  );
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
            <SelectDropDown
              placeholder={"Select Partner Type"}
              items={showPartnerType}
              value={selectedPartnerType}
              setSelectedItem={setSelectedPartnerType}
            />
          </div>
          <div className="w-full max-w-fit flex flex-wrap items-center justify-end gap-4">
            <Button
              onClick={() => {
                setSelectedStatus("");
                setSelectedTime("");
                setSelectedPartnerType("");
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
