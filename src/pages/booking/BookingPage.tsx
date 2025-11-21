// @ts-nocheck

import { Download } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import UsefetchAllBookings from "@/api/getAllBookings.api";
import { ErrorCard } from "@/components/common/ErrorCard";
import PageTitle from "@/components/common/PageTitle";
import { Calendar28 } from "@/components/date/DateRange";
import { PageHeader } from "@/components/layouts/PageHeader";
import { Spinner } from "@/components/Spinner";
import {
  formatDate,
  getBooking,
  type TBooking,
} from "@/components/table/column";
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
import { exportToCsv } from "@/utils/export";
import { generatePageTitle } from "@/utils/seo";

const showStatus = [
  { label: "Accepted", value: "accepted" },
  { label: "Completed", value: "completed" },
  { label: "Pending", value: "pending" },
  { label: "Cancelled", value: "cancelled" },
];

type RowData = {
  affiliateId: string;
  id: string;
  status: string;
  createdAt: string | Date;
  updatedAt: string | Date;
};
function BookingPage() {
  const perPage = 10;
  const navigate = useNavigate();
  const [newPage, setNewPage] = useState<number>(1);
  const [selectedStatus, setSelectedStatus] = useState("");

  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  // const [data, setData] = useState<TBooking[]>(tableData);
  const { data, isFetching, error, isError } = UsefetchAllBookings({
    DateRange: dateRange,
    page: newPage,
    status: selectedStatus,
  });

  const handleView = (id: string) => {
    // console.log("view:", id);
    navigate(constant.ROUTING_URLS.VIEW_BOOKING.replace(":id", id));
  };
  const columns = getBooking(handleView);
  const [searchValue, setSearchValue] = useState("");
  const [rowSelection, setRowSelection] = useState<{ [key: string]: boolean }>(
    {},
  );

  // Filter data
  const filterData = data?.bookings?.filter((row: RowData) => {
    if (searchValue === "") return true;
    if (
      searchValue &&
      !row.affiliateId.toLowerCase().includes(searchValue.toLowerCase()) &&
      !row.id.toLowerCase().includes(searchValue.toLowerCase())
    ) {
      return false;
    }

    if (
      selectedStatus &&
      row.status.toLowerCase() !== selectedStatus.value.toLowerCase()
    ) {
      return false;
    }

    // Date range filter
    if (dateRange.from) {
      const createdAt = new Date(row.createdAt);
      // console.log(`verificationDate:${verificationDate}`)
      // console.log(`dateRange.from:${dateRange.from}`)
      if (createdAt < dateRange.from) return false;
    }

    if (dateRange.to) {
      const updatedAt = new Date(row.updatedAt);
      const endOfDay = new Date(dateRange.to);
      // console.log(`verificationDate:${verificationDate}`)
      // console.log(`dateRange.to:${dateRange.to}`)
      endOfDay.setHours(23, 59, 59, 999);
      // console.log(`endofDay:${endOfDay}`)
      if (updatedAt > endOfDay) return false;
    }

    return true;
  });

  const {
    currentPage,
    nextPage: _nextPage,
    prevPage: _prevPage,
    setPage,
    totalPages,
    currentItems,
  } = usePagination<TBooking>(filterData, newPage, perPage, data?.pagination);

  // const statusCounts = useMemo(() => {
  // return countByStatus(data?.statusCounts);
  // }, []);
  const statusCounts = data?.statusCounts;

  // Handle CSV export
  const handleExportCsv = () => {
    const headers = [
      "ID",
      "Affiliate Id",
      "bookingType",
      "scheduledTime",
      "price",
      "Status",
      "Created At",
    ];

    const csvData = data?.bookings?.map((v) => [
      v?.id || "",
      v?.affiliateId || "",
      v?.bookingType || "",
      v?.scheduledTime || "",
      v?.fare?.toString() || "",
      v?.status || "",
      formatDate(v?.createdAt || ""),
    ]);

    exportToCsv("booking_history", headers, csvData);

    // toast({
    //   title: "Export successful",
    //   description: "Verification history has been exported to CSV",
    // });
  };

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
  useEffect(() => {
    if (isError) {
      toast.error(error?.response?.data?.message);
    }
  }, [isError, error]);

  return (
    <>
      <PageTitle title={generatePageTitle("Booking")} />
      <div className="p-6 space-y-6 md:p-8 md:space-y-8">
        <PageHeader
          title="Bookings"
          breadcrumbs={[{ label: "Home", path: "/" }, { label: "Bookings" }]}
          actionDetails={{
            stats: [
              { label: "Accepted", value: statusCounts?.accepted },
              { label: "Pending", value: statusCounts?.pending },
              { label: "Cancelled", value: statusCounts?.cancelled },
              { label: "Completed", value: statusCounts?.completed },
            ],
          }}
        />

        <div className="flex items-end justify-between gap-4">
          <div className="flex items-center gap-4 ">
            <Calendar28 dateRange={dateRange} setDateRange={setDateRange} />
          </div>
          <div className="w-full max-w-fit flex items-center justify-between gap-4">
            <SelectDropDown
              placeholder={"Select Status"}
              items={showStatus}
              value={selectedStatus}
              setSelectedItem={setSelectedStatus}
            />

            <Button onClick={handleExportCsv} type="button" variant={"black"}>
              <span>Export</span>
              <Download />
            </Button>
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

export default BookingPage;
