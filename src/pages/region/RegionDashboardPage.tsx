//@ts-nocheck

import { AxiosError } from "axios";
import { Plus, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useFetchAllRegions } from "@/api";
import BulkDeleteBtn from "@/components/bulkDeleteBtn/BulkDeleteBtn";
import PageTitle from "@/components/common/PageTitle";
import { PageHeader } from "@/components/layouts/PageHeader";
import { PermissionGate } from "@/components/permissions";
import { Spinner } from "@/components/Spinner";
import { getRegionColumns, type TRegion } from "@/components/table/column";
import { DataTable } from "@/components/table/data-table";
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

  const handleEdit = useCallback(
    (id: string) => {
      console.log("Edit:", id);
      navigate(constant.ROUTING_URLS.EDIT_REGION.replace(":id", id));
    },
    [navigate],
  );
  const deleteRegion = queries.useDeleteRegionMutation();
  const bulkDeleteRegions = queries.useBulkDeleteRegionsMutation();
  const handleDelete = useCallback(
    (id: string) => {
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
              : e instanceof Error
                ? e.message
                : "Opps! Error deleting region",
        });
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("Opps! An unexpected error occured");
        }
      }
    },
    [deleteRegion, refetch],
  );
  // Region permissions are now managed via backend-user-service gRPC
  // Use PermissionIndicator component for viewing/managing permissions
  const columns = useMemo(
    () => getRegionColumns(handleEdit, handleDelete, deleteRegion.isPending),
    [handleEdit, handleDelete, deleteRegion.isPending],
  );

  const [searchValue, setSearchValue] = useState("");
  const [tableRef, setTableRef] = useState<any>(null);
  const [rowSelection, setRowSelection] = useState({});
  // Number of pages based on filtered data
  const calculatedTotalPages = Math.max(1, totalPages);

  // Handle page change
  const handlePageChange = (value: number) => {
    setCPage(value);
    setPage(value);
    window.scrollTo(0, 0);
  };

  // Handle per-page size change
  const handlePerPageChange = (value: number) => {
    setPerPage(value);
    setCPage(1);
    setPage(1);
    refetch();
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
            permission: "manageRegions",
            actionName: "create",
          }}
        />

        <div className="w-full flex items-center justify-end gap-4">
          <PermissionGate permission="manageRegions" action="bulkDelete">
            <BulkDeleteBtn
              rowSelection={rowSelection}
              tableRef={tableRef}
              bulkDeleteMutation={bulkDeleteRegions as any}
              refetch={refetch as any}
              setRowSelection={setRowSelection}
              title="Regions"
              descTitle="regions"
            />
          </PermissionGate>
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
            onTableReady={setTableRef}
          />
        )}

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

export default RegionDashboardPage;
