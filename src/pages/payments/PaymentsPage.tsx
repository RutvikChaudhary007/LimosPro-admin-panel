// @ts-nocheck

import { Download } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import useFetchAllPayments from "@/api/payment.api";
import { ErrorCard } from "@/components/common/ErrorCard";
import PageTitle from "@/components/common/PageTitle";
import { PageHeader } from "@/components/layouts/PageHeader";
import { Spinner } from "@/components/Spinner";
import { getPayments, type TPayments } from "@/components/table/column";
import { DataTable } from "@/components/table/data-table";
import { Button } from "@/components/ui/button";
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
import { constant } from "@/lib/constant";
import { generatePageTitle } from "@/utils/seo";

const showStatus = [
  { label: "Pending", value: "pending" },
  { label: "Failed", value: "failed" },
  { label: "Completed", value: "completed" },
  { label: "Refunded", value: "refunded" },
];

const showOptions = [
  { label: "Show 10", value: 10 },
  { label: "Show 15", value: 15 },
  { label: "Show 20", value: 20 },
  { label: "Show 25", value: 25 },
];

const tableData: TPayments[] = [
  {
    id: "801c9f7e-7dfa-4f97-9664-912fe821db19",
    Status: "Pending",
    Amount: "1879",
    BookingId: "AA57329144",
    PassengerName: "Chris Johnson",
    PaymentId: "TRXPAY000111",
  },
  {
    id: "801c9f7e-7dfa-4f97-a664-912fe821db1b",
    Status: "InProgress",

    Amount: "1879",
    BookingId: "AA57329144",
    PassengerName: "Jane Smith",
    PaymentId: "SAMPLEPAY123",
  },
];
const PaymentsPage = () => {
  const [{ value: optionDefaultValue }] = showOptions;
  const navigate = useNavigate();
  const [newPage, setNewPage] = useState<number>(1);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedOption, setSelectedOption] = useState(optionDefaultValue);
  // const [data, setData] = useState<TPayments[]>(tableData);
  // const { currentPage, nextPage, prevPage, setPage, totalPages, currentItems } = usePagination<TPayments>(data, 1, perPage);
  const { data, isFetching, isError, refetch } = useFetchAllPayments({
    page: newPage,
    limit: selectedOption,
    status: selectedStatus.value,
  });
  const { currentPage, setPage, totalPages, currentItems } =
    usePagination<TPayments>(
      data?.payments,
      newPage,
      selectedOption,
      data?.pagination,
    );

  const handleView = useCallback(
    (id: string) => {
      console.log("view:", id);
      navigate(constant.ROUTING_URLS.VIEW_PAYMENTS.replace(":id", id));
    },
    [navigate],
  );
  const handleEdit = useCallback(
    (id: string) => {
      console.log("Edit:", id);
      navigate(constant.ROUTING_URLS.EDIT_USERS.replace(":id", id));
    },
    [navigate],
  );
  const columns = useMemo(
    () => getPayments(handleView, handleEdit),
    [handleView, handleEdit],
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
      <PageTitle title={generatePageTitle("Payments")} />
      <div className="p-6 space-y-6 md:p-8 md:space-y-8">
        <PageHeader
          title="Payments"
          breadcrumbs={[{ label: "Home", path: "/" }, { label: "Payments" }]}
        />

        <div className="flex justify-between">
          <SelectDropDown
            placeholder={selectedOption}
            items={showOptions}
            value={selectedOption}
            setSelectedItem={setSelectedOption}
          />

          <div className="w-full max-w-fit flex items-center justify-between gap-4">
            <SelectDropDown
              placeholder="Select Status"
              items={showStatus}
              value={selectedStatus}
              setSelectedItem={setSelectedStatus}
            />
            <span
              // @ts-expect-error: We are intentionally assigning a number to a string type for testing.
              className={`${Object.keys(rowSelection).filter((k) => rowSelection[k]).length === 0 ? "cursor-no-drop" : "cursor-pointer"}`}
            >
              <Button
                variant="outlineBlack"
                type="button"
                disabled={
                  Object.keys(rowSelection).filter((k) => rowSelection[k])
                    .length === 0
                }
                onClick={() => {
                  // setData((prev) => prev.filter((_row, i) => !rowSelection[i]));
                  setRowSelection({});
                }}
              >
                Export
                <Download />
              </Button>
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
            onRowSelectionChange={setRowSelection}
            globalFilter={searchValue}
            onGlobalFilterChange={setSearchValue}
          />
        )}

        {/* Pagination */}
        {tableData.length > 0 && calculatedTotalPages > 1 && (
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

export default PaymentsPage;
