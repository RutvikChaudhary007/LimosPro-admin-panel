import { IconFilterX } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getAllInquiries,
  useBulkDeleteInquiries,
  useDeleteInquiry,
  useFetchAllInquiries,
} from "@/api/inquiry.api";
import BulkDeleteBtn from "@/components/bulkDeleteBtn/BulkDeleteBtn";
import PageTitle from "@/components/common/PageTitle";
import { PageHeader } from "@/components/layouts/PageHeader";
import { PaginationControls } from "@/components/pagination";
import { PermissionGate } from "@/components/permissions";
import { Spinner } from "@/components/Spinner";
import { getInquiryColumns } from "@/components/table/column";
import { DataTable } from "@/components/table/data-table";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { SelectDropDown } from "@/components/ui/select";
import { useDebounce } from "@/hooks/useDebounce";
import usePagination from "@/hooks/usePagination";
import { queryKeys } from "@/lib/queryKeys";
import {
  InquiryStatus,
  InquiryType,
  type TInquiry,
} from "@/types/inquiry.type";
import { generatePageTitle } from "@/utils/seo";
import { ViewInquiryModal } from "./components/ViewInquiryModal";

const showStatus = [
  { label: "Pending", value: InquiryStatus.PENDING },
  { label: "Reviewing", value: InquiryStatus.REVIEWING },
  { label: "Resolved", value: InquiryStatus.RESOLVED },
  { label: "Rejected", value: InquiryStatus.REJECTED },
];

const showTime = [
  { label: "Weekly", value: "weekly" },
  { label: "Monthly", value: "monthly" },
  { label: "Yearly", value: "yearly" },
];

const showType = [
  { label: "Event Planner", value: InquiryType.EVENT_PLANNER },
  { label: "Diplomatic", value: InquiryType.DIPLOMATIC },
];

const InquiriesPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [newPage, setNewPage] = useState(1);
  const [perPage, setPerPage] = useState<number>(10);
  const [selectedInquiryId, setSelectedInquiryId] = useState<string | null>(
    null,
  );
  const [tableRef, setTableRef] = useState<any>(null);

  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedType, setSelectedType] = useState("");

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
      case "weekly": {
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
      default: {
        start = undefined;
      }
    }

    return {
      startDate: start?.toISOString(),
      endDate: selectedTime ? end.toISOString() : undefined,
    };
  }, [selectedTime]);

  const [searchValue, setSearchValue] = useState("");
  const debouncedSearch = useDebounce(searchValue, 500);

  const { data, isFetching, refetch } = useFetchAllInquiries({
    page: newPage,
    limit: perPage,
    status: selectedStatus,
    type: selectedType,
    dateRange: { startDate, endDate },
    search: debouncedSearch,
  });

  const queryClient = useQueryClient();
  useEffect(() => {
    if (data?.pagination?.hasNextPage === true) {
      queryClient.prefetchQuery({
        queryKey: queryKeys.inquiry.lists(
          newPage + 1,
          perPage,
          selectedStatus,
          selectedType,
          { startDate, endDate },
        ),
        queryFn: () =>
          getAllInquiries(newPage + 1, perPage, selectedStatus, selectedType, {
            startDate,
            endDate,
          }),
      });
    }
  }, [
    queryClient,
    newPage,
    data,
    startDate,
    endDate,
    selectedStatus,
    selectedType,
    perPage,
  ]);

  const { mutate: deleteInquiry } = useDeleteInquiry();
  const bulkDeleteInquiryMutation = useBulkDeleteInquiries();

  const { currentPage, setPage, totalPages, currentItems } =
    usePagination<TInquiry>(
      data?.inquiries ?? [],
      newPage,
      perPage,
      data?.pagination,
    );

  const handleView = useCallback((id: string) => {
    setSelectedInquiryId(id);
    setIsOpen(true);
  }, []);

  const handleDelete = useCallback(
    (id: string) => {
      deleteInquiry(id, {
        onSuccess: () => {
          refetch();
        },
      });
    },
    [deleteInquiry, refetch],
  );

  const columns = getInquiryColumns(handleView, handleDelete);

  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});

  const calculatedTotalPages = Math.max(1, totalPages);

  const handlePageChange = (value: number) => {
    setNewPage(value);
    setPage(value);
    window.scrollTo(0, 0);
  };

  const handlePerPageChange = (value: number) => {
    setPerPage(value);
    setNewPage(1);
    setPage(1);
    refetch();
  };

  // Reset to page 1 when perPage changes
  useEffect(() => {
    setNewPage(1);
    setPage(1);
  }, [perPage, setPage]);

  // Reset to page 1 and clear search when filters change (status/time)
  useEffect(() => {
    setNewPage(1);
    setPage(1);
    setSearchValue("");
  }, [selectedStatus, selectedTime, selectedType, refetch, setPage]);

  const selectedInquiry = useMemo(() => {
    return currentItems.find((i) => i.id === selectedInquiryId) || null;
  }, [currentItems, selectedInquiryId]);

  return (
    <>
      <PageTitle title={generatePageTitle("Inquiries")} />
      <div className="p-6 space-y-6 md:p-8 md:space-y-8">
        <PageHeader
          title="Inquiries"
          breadcrumbs={[{ label: "Home", path: "/" }, { label: "Inquiries" }]}
        />
        <div className="flex justify-between gap-4">
          <div className="flex items-center gap-4 flex-wrap">
            <SelectDropDown
              placeholder={"Select Status"}
              items={showStatus}
              value={selectedStatus}
              setSelectedItem={setSelectedStatus}
            />
            <SelectDropDown
              placeholder={"Select Type"}
              items={showType}
              value={selectedType}
              setSelectedItem={setSelectedType}
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
                setSelectedType("");
                setSearchValue("");
              }}
              type="button"
              variant={"outlineSecondary"}
            >
              <IconFilterX /> <span>Clear Filter</span>
            </Button>
            <PermissionGate permission="manageInquiries" action="bulkDelete">
              <span
                className={`${Object.keys(rowSelection).filter((k) => rowSelection[k]).length === 0 ? "cursor-no-drop" : "cursor-pointer"}`}
              >
                <BulkDeleteBtn<TInquiry, any>
                  rowSelection={rowSelection}
                  tableRef={tableRef}
                  bulkDeleteMutation={bulkDeleteInquiryMutation}
                  refetch={refetch}
                  setRowSelection={setRowSelection}
                  title="manageInquiries"
                  descTitle="inquiry"
                />
              </span>
            </PermissionGate>
            <div>
              <InputGroup>
                <InputGroupInput
                  type="text"
                  placeholder="Search"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                    }
                  }}
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
            onTableReady={setTableRef}
            globalFilter={searchValue}
            onGlobalFilterChange={setSearchValue}
            manualFiltering={true}
          />
        )}

        {/* View Dialog */}
        <ViewInquiryModal
          inquiry={selectedInquiry}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        />

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
};

export default InquiriesPage;
