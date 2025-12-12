//@ts-nocheck

import { Plus, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useFetchAllRegions } from "@/api";
import PageTitle from "@/components/common/PageTitle";
import { PageHeader } from "@/components/layouts/PageHeader";
import { Spinner } from "@/components/Spinner";
import { getRegionColumns, type TRegion } from "@/components/table/column";
import { DataTable } from "@/components/table/data-table";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { toastPromise } from "@/hooks/use-toast";
import usePagination from "@/hooks/usePagination";
import { constant } from "@/lib/constant";
import queries from "@/lib/queries";
import { generatePageTitle } from "@/utils/seo";
import { PaginationControls } from "../../components/pagination";

function RegionDashboardPage() {
  const navigate = useNavigate();
  const [perPage, setPerPage] = useState<number>(10);
  const [page, setCPage] = useState(1);
  const { data, refetch, isFetching } = useFetchAllRegions({
    page,
    limit: perPage,
  });
  const { currentPage, setPage, totalPages, currentItems } =
    usePagination<TRegion>(data?.regions, page, perPage, data?.pagination);

  useEffect(() => {
    setCPage(currentPage);
  }, [currentPage]);

  const handleEdit = (id: string) => {
    console.log("Edit:", id);
    navigate(constant.ROUTING_URLS.EDIT_REGION.replace(":id", id));
  };
  const deleteRegion = queries.useDeleteRegionMutation();
  const handleDelete = (id: string) => {
    try {
      toastPromise(deleteRegion.mutateAsync(id), {
        loading: "Deleting Region...",
        success: (res) => {
          if (res?.status === true) refetch();
          return "Yeah! Region deleted successfully";
        },
        error: (e) =>
          e instanceof AxiosError
            ? e.response?.data?.data?.error || e.response?.data?.message
            : "Opps! Error deleting region",
      });
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Opps! An unexpected error occured");
      }
    }
  };
  const editRegionMutation = queries.useEditRegionMutation();
  const handleAccess = async (id: string, permissionIds: string[]) => {
    console.log("manage access:", permissionIds, "id:", id);
    toastPromise(
      await editRegionMutation.mutateAsync({
        id,
        data: { permissionAccess: permissionIds },
      }),
      {
        loading: "Updating access...",
        success: (res) => {
          if (res.status === true) refetch();
          return "Yeah! Region updated.";
        },
        error: (e) =>
          e instanceof Error
            ? e.message
            : "Opps! Failed to update access permission.",
      },
    );
  };
  const columns = getRegionColumns(handleEdit, handleDelete, handleAccess);

  const [searchValue, setSearchValue] = useState("");
  const [rowSelection, setRowSelection] = useState({});
  // Number of pages based on filtered data
  const calculatedTotalPages = Math.max(1, totalPages);

  // Unified handler for page and page size changes
  const handlePageChange = (value: number) => {
    // If value is a page size option, update page size
    if (value === 10 || value === 20 || value === 30) {
      setPerPage(value);
      setCPage(1);
      setPage(1);
      refetch();
    } else {
      // Otherwise it's a page change
      setCPage(value);
      setPage(value);
      window.scrollTo(0, 0);
    }
  };

  return (
    <>
      <PageTitle title={generatePageTitle("Region")} />
      <div className="p-6 space-y-6 md:p-8 md:space-y-8">
        <PageHeader
          title="Region Management"
          breadcrumbs={[
            { label: "Home", path: "/" },
            { label: "Region Management" },
            { label: "Regions" },
          ]}
          action={{
            label: "Add Regions",
            icon: <Plus />,
            link: constant.ROUTING_URLS.CREATE_REGION,
          }}
        />

        <div className="w-full flex items-center justify-end gap-4">
          <span
            className={`${
              Object.keys(rowSelection).filter(
                (k) =>
                  // @ts-expect-error: We are intentionally assigning a number to a string type for testing.
                  rowSelection[k],
              ).length === 0
                ? "cursor-no-drop"
                : "cursor-pointer"
            }`}
          >
            <Button
              variant={"outlineBlack"}
              disabled={
                Object.keys(rowSelection).filter((k) => rowSelection[k])
                  .length === 0
              }
              onClick={() => {
                setData((prev) => prev.filter((_row, i) => !rowSelection[i]));
                console.log("data:", data);
                console.log("rowSelection:", rowSelection);
                setRowSelection({});
              }}
            >
              <span>Delete</span>
              <Trash2 />
            </Button>
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

export default RegionDashboardPage;
