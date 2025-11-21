import { useQueryClient } from "@tanstack/react-query";
import type { Table } from "@tanstack/react-table";
import { Plus, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import UsefetchAllAffiliate, {
  getAllAffiliate,
} from "@/api/getAllAffiliate.api";
import BulkDeleteBtn from "@/components/bulkDeleteBtn/BulkDeleteBtn";
import { ErrorCard } from "@/components/common/ErrorCard";
import PageTitle from "@/components/common/PageTitle";
import { PageHeader } from "@/components/layouts/PageHeader";
import { Spinner } from "@/components/Spinner";
import { getAffiliate } from "@/components/table/column";
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
import type { IAffiliate } from "@/types/affiliate/affiliate.type";
import type { TBlkDelRes } from "@/types/global/BulkDeleteResponse.type";
import { generatePageTitle } from "@/utils/seo";

const showStatus = [
  { label: "Approved", value: "approved" },
  { label: "Pending", value: "pending" },
  { label: "Rejected", value: "rejected" },
];

const showTime = [
  // { label: "All Time", value: "All Time" },
  { label: "Weekly", value: "weekly" },
  { label: "Monthly", value: "monthly" },
  { label: "Yearly", value: "yearly" },
];

function AffiliatePage() {
  const navigate = useNavigate();
  const perPage = 10;
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  console.log("🚀 ~ AffiliatePage ~ selectedTime:", selectedTime);
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
      case "weekly": {
        // last 7 days inclusive (UTC)
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
        // All time: leave undefined so callers can omit filters
        start = undefined;
      }
    }

    return { startDate: start, endDate: selectedTime ? end : undefined };
  }, [selectedTime]);

  const [newPage, setNewPage] = useState<number>(1);
  const {
    data: FetchData,
    refetch,
    isFetching,
    isError,
  } = UsefetchAllAffiliate({
    DateRange: { startDate, endDate },
    page: newPage,
    status: selectedStatus,
  });
  const [tableRef, setTableRef] = useState<Table<IAffiliate> | null>(null);
  const queryClient = useQueryClient();
  useEffect(() => {
    if (FetchData?.pagination?.hasNextPage === true) {
      queryClient.prefetchQuery({
        queryKey: ["affiliate", { startDate, endDate }, newPage + 1],
        queryFn: () =>
          getAllAffiliate({ startDate, endDate }, newPage + 1, selectedStatus),
      });
    }
  }, [queryClient, newPage, FetchData, startDate, endDate, selectedStatus]);

  const { currentPage, setPage, totalPages, currentItems } =
    usePagination<IAffiliate>(
      FetchData?.affiliates,
      newPage,
      perPage,
      FetchData?.pagination,
    );
  useEffect(() => {
    if (currentPage) {
      setNewPage(currentPage);
    }
  }, [currentPage]);

  const handleView = (id: string) => {
    navigate(constant.ROUTING_URLS.VIEW_AFFILIATE.replace(":id", id));
  };

  const deleteAffiliateMutation = queries.useDeleteAffiliateMutation(refetch);
  const bulkDeleteAffiliateMutation = queries.useBulkDeleteAffiliateMutation();
  const handleEdit = (id: string) => {
    navigate(constant.ROUTING_URLS.EDIT_AFFILIATE.replace(":id", id));
  };
  const handleDelete = async (id: string) => {
    try {
      // Remove remember field before sending to API
      // await loginMutation.mutateAsync(loginData);
      toastPromise(deleteAffiliateMutation.mutateAsync(id), {
        loading: "Deleting Affiliate...",
        success: "Yeah! Affiliate deleted successfully!",
        error: (e) =>
          e instanceof Error ? e.message : "Opps! Failed to delete affiliate",
      });
    } catch (error) {
      // Error handling is done in onError callback
      console.error("Affiliate delete error:", error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Opps! An unknown error occurred.");
      }
    }
  };
  const columns = getAffiliate(handleView, handleEdit, handleDelete);
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
  // if(isFetching) return (<p>Loading...</p>)
  if (isError) return <ErrorCard refetch={refetch} />;
  return (
    <>
      <PageTitle title={generatePageTitle("Affiliate")} />
      <div className="p-6 space-y-6 md:p-8 md:space-y-8">
        <PageHeader
          title="Affiliate"
          breadcrumbs={[{ label: "Home", path: "/" }, { label: "Affiliate" }]}
          action={{
            label: "Add Affiliate",
            icon: <Plus />,
            link: constant.ROUTING_URLS.CREATE_AFFILIATE,
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
          <div className="w-full max-w-fit flex items-center justify-between gap-4">
            <span
              className={`${Object.keys(rowSelection).filter((k) => rowSelection[k]).length === 0 ? "cursor-no-drop" : "cursor-pointer"}`}
            >
              <BulkDeleteBtn<IAffiliate, TBlkDelRes>
                rowSelection={rowSelection}
                tableRef={tableRef}
                bulkDeleteMutation={bulkDeleteAffiliateMutation}
                refetch={refetch}
                setRowSelection={setRowSelection}
                title="Affiliates"
                descTitle="affiliates"
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
            rowSelection={rowSelection}
            onTableReady={setTableRef}
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

export default AffiliatePage;
