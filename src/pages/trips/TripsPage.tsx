import { IconFilterX } from "@tabler/icons-react";
import type { Table } from "@tanstack/react-table";
import { Search } from "lucide-react";
import { type JSX, useState } from "react";
import { useNavigate } from "react-router-dom";
import useFetchAllTrips from "@/api/getAllTrips.api";
import BulkDeleteBtn from "@/components/bulkDeleteBtn/BulkDeleteBtn";
import { ErrorCard } from "@/components/common/ErrorCard";
import PageTitle from "@/components/common/PageTitle";
import { PageHeader } from "@/components/layouts/PageHeader";
import { PaginationControls } from "@/components/pagination";
import { Spinner } from "@/components/Spinner";
import { getTrips, type TTrips } from "@/components/table/column";
import { DataTable } from "@/components/table/data-table";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { SelectDropDown } from "@/components/ui/select";
import usePagination from "@/hooks/use-pagination";
import { constant } from "@/lib/constant";
import queries from "@/lib/queries";
import { generatePageTitle } from "@/utils/seo";

const showStatus = [
  { label: "Completed", value: "completed" },
  { label: "Pending", value: "pending" },
  { label: "In Progress", value: "inProgress" },
  { label: "Cancelled", value: "cancelled" },
];

function TripsPage(): JSX.Element {
  const navigate = useNavigate();
  const [perPage, setperPage] = useState<number>(10);
  const [newPage, setNewPage] = useState<number>(1);
  const [tableRef, setTableRef] = useState<Table<TTrips> | null>(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const { data, refetch, isFetching, isError } = useFetchAllTrips({
    tripStatus: selectedStatus,
    page: newPage,
    limit: perPage,
  });
  const { currentPage, setPage, totalPages, currentItems } =
    usePagination<TTrips>(
      data?.trips ?? data,
      newPage,
      perPage,
      data?.pagination,
    );

  const handleView = (id: string) => {
    navigate(constant.ROUTING_URLS.VIEW_TRIPS.replace(":id", id));
  };
  const handleMap = (id: string) => {
    navigate(constant.ROUTING_URLS.TRIPS_MAP.replace(":id", id));
  };

  const columns = getTrips(handleView, handleMap);
  const [searchValue, setSearchValue] = useState("");
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});

  const bulkDeleteTripsMutation = queries.useBulkDeleteTripsMutation();

  // Number of pages based on filtered data
  const calculatedTotalPages = Math.max(1, totalPages);

  // Unified handler for page and page size changes
  const handlePageChange = (value: number) => {
    // If value is larger than current page size, it's a page size change
    if (value > perPage || value === 10 || value === 20 || value === 30) {
      setperPage(value);
      setNewPage(1);
      setPage(1);
      refetch();
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
      <PageTitle title={generatePageTitle("Trips")} />
      <div className="p-6 space-y-6 md:p-8 md:space-y-8">
        <PageHeader
          title="Trips"
          breadcrumbs={[{ label: "Home", path: "/" }, { label: "Trips" }]}
        />

        <div className="flex justify-between">
          <div className="flex items-center gap-4">
            <SelectDropDown
              placeholder={"Selected Status"}
              items={showStatus}
              value={selectedStatus}
              setSelectedItem={setSelectedStatus}
            />
          </div>
          <div className="w-full max-w-fit flex items-center justify-between gap-4">
            <Button
              onClick={() => {
                setSelectedStatus("");
                setSearchValue("");
              }}
              type="button"
              variant={"outlineSecondary"}
            >
              <IconFilterX /> <span>Clear Filter</span>
            </Button>
            <span
              className={`${Object.keys(rowSelection).filter((k) => rowSelection[k]).length === 0 ? "cursor-no-drop" : "cursor-pointer"}`}
            >
              <BulkDeleteBtn
                rowSelection={rowSelection}
                setRowSelection={setRowSelection}
                bulkDeleteMutation={bulkDeleteTripsMutation}
                refetch={refetch}
                tableRef={tableRef}
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
}

export default TripsPage;
