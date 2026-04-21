// @ts-nocheck

import { IconFilterX } from "@tabler/icons-react";
import { Download } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useFetchAllBookings } from "@/api";
import PageTitle from "@/components/common/PageTitle";
import { Calendar28 } from "@/components/date/DateRange";
import { PageHeader } from "@/components/layouts/PageHeader";
import PaginationControls from "@/components/pagination/PaginationControls";
import { Spinner } from "@/components/Spinner";
import {
  formatDate,
  getBooking,
  type TBooking,
} from "@/components/table/column";
import { DataTable } from "@/components/table/data-table";
import { Button } from "@/components/ui/button";
import { SelectDropDown } from "@/components/ui/select";
import { useSocket } from "@/context/SocketContext";
import { constant } from "@/lib/constant";
import { exportToCsv } from "@/utils/export";
import { generatePageTitle } from "@/utils/seo";

const showStatus = [
  { label: "Booked", value: "booked" },
  { label: "Assigned", value: "assigned" },
  { label: "En Route", value: "enRoute" },
  { label: "On Location", value: "onLocation" },
  { label: "Trip Started", value: "tripStarted" },
  { label: "Created", value: "created" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];
function BookingPage() {
  const navigate = useNavigate();
  const [perPage, setperPage] = useState<number>(10);
  const [newPage, setNewPage] = useState<number>(1);
  const [selectedStatus, setSelectedStatus] = useState("");

  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });

  const [searchValue, setSearchValue] = useState("");
  const [rowSelection, setRowSelection] = useState<{ [key: string]: boolean }>(
    {},
  );

  const { data, isFetching, error, isError, refetch } = useFetchAllBookings({
    DateRange: dateRange,
    page: newPage,
    limit: perPage,
    status: selectedStatus?.value || selectedStatus, // Handle both object and string
    search: searchValue,
  });

  const statusCounts = data?.statusCounts;
  const calculatedTotalPages = data?.pagination?.totalPages || 0;

  const handleView = (id: string) => {
    navigate(constant.ROUTING_URLS.VIEW_BOOKING.replace(":id", id));
  };
  const columns = getBooking(handleView);

  // Handle CSV export
  const handleExportCsv = () => {
    const headers = [
      "ID",
      "Partner Id",
      "Trip Type",
      "scheduledTime",
      "Fare",
      "Status",
      "Created At",
    ];

    const csvData = data?.bookings?.map((v) => [
      v?.booking?.id || "",
      v?.booking?.partnerId || "",
      v?.booking?.trip?.tripType || v?.booking?.bookingType || "",
      v?.booking?.scheduledTime || "",
      v?.booking?.trip?.fare?.toString() || "",
      v?.booking?.status || "",
      formatDate(v?.booking?.createdAt || ""),
    ]);

    exportToCsv("booking_history", headers, csvData);
  };

  // Handle page change
  const handlePageChange = (value: number) => {
    setNewPage(value);
  };

  // Handle per-page size change
  const handlePerPageChange = (value: number) => {
    setperPage(value);
    setNewPage(1);
  };

  // Reset to page 1 when filters change
  useEffect(() => {
    setNewPage(1);
  }, [selectedStatus, dateRange, searchValue]);

  useEffect(() => {
    if (isError) {
      toast.error(error?.response?.data?.message);
    }
  }, [isError, error]);

  // Real-time updates via socket
  const { socket } = useSocket();
  useEffect(() => {
    if (!socket) return;

    const handleBookingUpdate = (data?: any) => {
      console.log("📩 Booking update received in List:", data);
      refetch().then((res) => {
        console.log(
          "✅ Booking list refetched. Status of first item:",
          res.data?.bookings?.[0]?.status,
        );
      });
    };

    socket.on("adminNewBooking", handleBookingUpdate);
    socket.on("adminAssignmentUpdate", handleBookingUpdate);
    socket.on("bookingStatusUpdate", handleBookingUpdate);

    return () => {
      socket.off("adminNewBooking", handleBookingUpdate);
      socket.off("adminAssignmentUpdate", handleBookingUpdate);
      socket.off("bookingStatusUpdate", handleBookingUpdate);
    };
  }, [socket, refetch]);

  return (
    <>
      <PageTitle title={generatePageTitle("Booking")} />
      <div className="p-6 space-y-6 md:p-8 md:space-y-8">
        <PageHeader
          title="Bookings"
          breadcrumbs={[{ label: "Home", path: "/" }, { label: "Bookings" }]}
          actionDetails={{
            stats: [
              {
                label: "Accepted",
                labelClassName: "text-base-primary/75",
                value: statusCounts?.accepted ?? 0,
                valueClassName: "text-base-primary",
              },
              {
                label: "Pending",
                labelClassName: "text-base-secondary/75",
                value: statusCounts?.pending ?? 0,
                valueClassName: "text-base-secondary",
              },
              {
                label: "Cancelled",
                labelClassName: "text-base-danger/75",
                value: statusCounts?.cancelled ?? 0,
                valueClassName: "text-base-danger",
              },
              {
                label: "Completed",
                labelClassName: "text-base-success/75",
                value: statusCounts?.completed ?? 0,
                valueClassName: "text-base-success",
              },
            ],
          }}
        />

        <div className="flex items-end justify-between gap-4">
          <div className="flex items-center gap-4 ">
            <Calendar28 dateRange={dateRange} setDateRange={setDateRange} />
          </div>
          <div className="w-full max-w-fit flex items-center justify-between gap-4">
            <Button
              onClick={() => {
                setSelectedStatus("");
                setDateRange({ from: undefined, to: undefined });
              }}
              type="button"
              variant={"outlineSecondary"}
            >
              <IconFilterX /> <span>Clear Filter</span>
            </Button>

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
            key={`${perPage}-${newPage}-${selectedStatus?.value || selectedStatus}-${searchValue}`}
            columns={columns}
            data={data?.bookings || []}
            rowSelection={rowSelection}
            onRowSelectionChange={setRowSelection}
            globalFilter={searchValue}
            onGlobalFilterChange={setSearchValue}
            manualFiltering={true}
            manualPagination={true}
          />
        )}

        {/* Pagination */}
        {calculatedTotalPages >= 1 && (
          <PaginationControls
            currentPage={newPage}
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

export default BookingPage;
