import { IconFilterX } from "@tabler/icons-react";
import type { Table } from "@tanstack/react-table";
import { Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useFetchAllChauffeur } from "@/api";
import BulkDeleteBtn from "@/components/bulkDeleteBtn/BulkDeleteBtn";
import { ErrorCard } from "@/components/common/ErrorCard";
import PageTitle from "@/components/common/PageTitle";
import { PageHeader } from "@/components/layouts/PageHeader";
import { PaginationControls } from "@/components/pagination";
import { Spinner } from "@/components/Spinner";
import { getChauffeur } from "@/components/table/column";
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
import type { TChauffeur } from "@/types/chauffeur/chauffeur.type";
import type { TBlkDelRes } from "@/types/global/BulkDeleteResponse.type";
import { generatePageTitle } from "@/utils/seo";

const showStatus = [
  { label: "Active", value: "Active" },
  { label: "Inactive", value: "Inactive" },
  { label: "Suspended", value: "Suspended" },
];

const showTime = [
  { label: "Weekly", value: "weekly" },
  { label: "Monthly", value: "monthly" },
  { label: "Yearly", value: "yearly" },
];

function ChauffeurPage() {
  const navigate = useNavigate();
  const [perPage, setperPage] = useState<number>(10);
  const [newPage, setNewPage] = useState<number>(1);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [searchValue, setSearchValue] = useState("");
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
  const { data, refetch, isFetching, isError } = useFetchAllChauffeur({
    DateRange: { startDate, endDate },
    page: newPage,
    limit: perPage,
    status: selectedStatus,
  });
  const [tableRef, setTableRef] = useState<Table<TChauffeur> | null>(null);
  // console.log("fetchedData:",data)

  /**
   * Dummy data
   */
  // const [data, setData] = useState<TChauffeur[]>(tableData);
  // const isFetching =   false;

  const handleView = (id: string) => {
    console.log("view:", id);
    navigate(constant.ROUTING_URLS.VIEW_CHAUFFEUR.replace(":id", id));
  };
  const handleEdit = (id: string) => {
    console.log("Edit:", id);
    navigate(constant.ROUTING_URLS.EDIT_CHAUFFEUR.replace(":id", id));
  };
  const deleteChauffeurMutation = queries.useDeleteChauffeurMutation();
  const bulkDeleteChauffeurMutation = queries.useBulkDeleteChauffeurMutation();
  const handleDelete = (id: string) => {
    console.log("id", id);
    try {
      toastPromise(deleteChauffeurMutation.mutateAsync(id), {
        loading: "Deleting chauffeur...",
        success: (res) => {
          if (res) refetch();
          return "Yeah! Chauffeur deleted successfully";
        },
        error: (e) =>
          e instanceof AxiosError
            ? e.response?.data?.data?.error || e.response?.data?.message
            : "Opps! Failed to delete chauffeur",
      });
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Unknown error occurred");
      }
    }
  };
  const columns = getChauffeur(handleView, handleEdit, handleDelete);

  const [rowSelection, setRowSelection] = useState<{ [key: string]: boolean }>(
    {},
  );

  /**
   * Below is for real data
   */
  const { currentPage, setPage, totalPages, currentItems } =
    usePagination<TChauffeur>(
      data?.chauffeurs || [],
      newPage,
      perPage,
      data?.pagination,
    );

  // Number of pages based on filtered data
  const calculatedTotalPages = Math.max(1, totalPages);

  // Handle page change
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
      <PageTitle title={generatePageTitle("Chauffeur")} />
      <div className="p-6 space-y-6 md:p-8 md:space-y-8">
        <PageHeader
          title="Chauffeur"
          breadcrumbs={[{ label: "Home", path: "/" }, { label: "Chauffeur" }]}
          action={{
            label: "Add Chauffeur",
            icon: <Plus />,
            link: constant.ROUTING_URLS.CREATE_CHAUFFEUR,
          }}
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
              <BulkDeleteBtn<TChauffeur, TBlkDelRes>
                rowSelection={rowSelection}
                tableRef={tableRef}
                bulkDeleteMutation={bulkDeleteChauffeurMutation}
                refetch={refetch}
                setRowSelection={setRowSelection}
                title="Chauffeurs"
                descTitle="chauffeur"
              />
            </span>
            <div>
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
            onRowSelectionChange={setRowSelection}
            onTableReady={setTableRef}
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

export default ChauffeurPage;
