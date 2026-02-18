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
import usePagination from "@/hooks/usePagination";
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

type RowData = {
  partnerId: string;
  id: string;
  status: string;
  createdAt: string | Date;
  updatedAt: string | Date;
};
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
  // const [data, setData] = useState<TBooking[]>(tableData);
  const { data, isFetching, error, isError, refetch } = useFetchAllBookings({
    DateRange: dateRange,
    page: newPage,
    limit: perPage,
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
      !row.partnerId.toLowerCase().includes(searchValue.toLowerCase()) &&
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

  const { currentPage, setPage, totalPages, currentItems } =
    usePagination<TBooking>(filterData, newPage, perPage, data?.pagination);

  // const statusCounts = useMemo(() => {
  // return countByStatus(data?.statusCounts);
  // }, []);
  const statusCounts = data?.statusCounts;

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
      v?.id || "",
      v?.partnerId || "",
      v?.trip?.tripType || v?.bookingType || "",
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
  };

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
            // key={perPage}
            key={`${perPage}-${newPage}`}
            columns={columns}
            data={currentItems}
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

export default BookingPage;
