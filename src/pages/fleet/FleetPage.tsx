// @ts-nocheck

import { IconFilterX } from "@tabler/icons-react";
import { Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFetchAllFleets } from "@/api";
import BulkDeleteBtn from "@/components/bulkDeleteBtn/BulkDeleteBtn";
import { ErrorCard } from "@/components/common/ErrorCard";
import PageTitle from "@/components/common/PageTitle";
import { PageHeader } from "@/components/layouts/PageHeader";
import PaginationControls from "@/components/pagination/PaginationControls";
import { Spinner } from "@/components/Spinner";
import { getFleets, type TFleet } from "@/components/table/column";
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
import { generatePageTitle } from "@/utils/seo";

const showTime = [
  { label: "Weekly", value: "weekly" },
  { label: "Monthly", value: "monthly" },
  { label: "Yearly", value: "yearly" },
];

function FleetPage() {
  const navigate = useNavigate();
  const [perPage, setperPage] = useState<number>(10);
  const [newPage, setNewPage] = useState<number>(1);
  const [tableRef, setTableRef] = useState<any>(null);
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

  const { data, refetch, isPending, isError } = useFetchAllFleets({
    DateRange: { startDate, endDate },
    page: newPage,
    limit: perPage,
  });
  const { currentPage, setPage, totalPages, currentItems } =
    usePagination<TFleet>(data?.vehicles, newPage, perPage, data?.pagination);

  const handleView = (id: string) => {
    navigate(constant.ROUTING_URLS.VIEW_FLEET.replace(":id", id));
  };
  const handleEdit = (id: string) => {
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
  };
  const columns = getFleets(handleView, handleEdit, handleDelete);
  const [searchValue, setSearchValue] = useState("");
  const [rowSelection, setRowSelection] = useState<{ [key: string]: boolean }>(
    {},
  );
  // Number of pages based on filtered data
  const calculatedTotalPages = Math.max(1, totalPages);

  // Unified handler for page and page size changes
  const handlePageChange = (value: number) => {
    // If value is larger than current page size, it's a page size change
    if (value > perPage || value === 10 || value === 20 || value === 30) {
      setperPage(value);
      setNewPage(1);
      setPage(1);
      // refetch();
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
              placeholder={"Selected Time"}
              items={showTime}
              value={selectedTime}
              setSelectedItem={setSelectedTime}
            />
          </div>
          <div className="w-full max-w-fit flex flex-wrap items-center justify-between gap-4">
            <Button
              onClick={() => {
                setSelectedTime("");
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

export default FleetPage;
