// @ts-nocheck

import { Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import UsefetchAllFleets from "@/api/getAllFleets.api";
import BulkDeleteBtn from "@/components/bulkDeleteBtn/BulkDeleteBtn";
import { ErrorCard } from "@/components/common/ErrorCard";
import PageTitle from "@/components/common/PageTitle";
import { PageHeader } from "@/components/layouts/PageHeader";
import { Spinner } from "@/components/Spinner";
import { getFleets, type TFleet } from "@/components/table/column";
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
import { generatePageTitle } from "@/utils/seo";

const showTime = [
  { label: "All Time", value: "All Time" },
  { label: "Weekly", value: "weekly" },
  { label: "Monthly", value: "monthly" },
  { label: "Yearly", value: "yearly" },
];

function FleetPage() {
  const [{ value: timeDefaultValue }] = showTime;
  const navigate = useNavigate();
  const perPage = 10;

  const [tableRef, setTableRef] = useState<any>(null);
  const [selectedTime, setSelectedTime] = useState(timeDefaultValue);
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

  // const [data, setData] = useState<TFleet[]>(tableData);
  const { data, refetch, isPending, isError } = UsefetchAllFleets({
    DateRange: { startDate, endDate },
  });
  const { currentPage, setPage, totalPages, currentItems } =
    usePagination<TFleet>(data?.vehicles, 1, perPage);
  // const { currentPage, nextPage, prevPage, setPage, totalPages, currentItems } = usePagination<TFleet>(data, 1, perPage);

  // const queryClient = useQueryClient();
  // useEffect(() => {
  //   queryClient.prefetchQuery(UsefetchAllFleets({DateRange: {startDate,endDate}, page: currentPage + 1}));
  // }, [queryClient, currentPage, startDate, endDate]);

  const handleView = (id: string) => {
    console.log("view:", id);
    navigate(constant.ROUTING_URLS.VIEW_FLEET.replace(":id", id));
  };
  const handleEdit = (id: string) => {
    console.log("Edit:", id);
    navigate(constant.ROUTING_URLS.EDIT_FLEET.replace(":id", id));
  };
  const deleteMutation = queries.useDeletefleetMutation(refetch);
  const bulkDeleteFleetsMutation = queries.useBulkDeletefleetMutation();
  const handleDelete = async (id: string) => {
    try {
      toastPromise(deleteMutation.mutateAsync(id), {
        loading: "Deleting...",
        success: "Yeah! fleet deleted successfully.",
        error: "Opps! failed to delete fleet.",
      });
    } catch (error) {
      console.log(error);
    }
    // setData((prev) => prev.filter((row) => row.id !== id));
  };
  const columns = getFleets(handleView, handleEdit, handleDelete);
  const [searchValue, setSearchValue] = useState("");
  const [rowSelection, setRowSelection] = useState({});
  // Number of pages based on filtered data
  const calculatedTotalPages = Math.max(1, totalPages);

  // if(isFetching) return <Spinner/>
  // Handle page change
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
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
      <PageTitle title={generatePageTitle("Fleet")} />
      <div className="p-6 space-y-6 md:p-8 md:space-y-8">
        <PageHeader
          title="Fleets"
          breadcrumbs={[{ label: "Home", path: "/" }, { label: "Fleets" }]}
          action={{
            label: "Add Fleet",
            icon: <Plus />,
            link: constant.ROUTING_URLS.CREATE_FLEET,
          }}
        />

        <div className="flex justify-between">
          <div className="flex items-center gap-4">
            <SelectDropDown
              placeholder={selectedTime}
              items={showTime}
              value={selectedTime}
              setSelectedItem={setSelectedTime}
            />
          </div>
          <div className="w-full max-w-fit flex items-center justify-between gap-4">
            <span
              className={`${Object.keys(rowSelection).filter((k) => rowSelection[k]).length === 0 ? "cursor-no-drop" : "cursor-pointer"}`}
            >
              <BulkDeleteBtn
                rowSelection={rowSelection}
                tableRef={tableRef}
                bulkDeleteMutation={bulkDeleteFleetsMutation}
                refetch={refetch}
                setRowSelection={setRowSelection}
                title="Fleets"
                descTitle="fleets"
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
        {isPending ? (
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

export default FleetPage;
