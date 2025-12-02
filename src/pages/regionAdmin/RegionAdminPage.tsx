import { Plus, Search, Trash2 } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import useFetchAllRegionAdmins from "@/api/regionAdmin.api";
import PageTitle from "@/components/common/PageTitle";
import { PageHeader } from "@/components/layouts/PageHeader";
import { PaginationControls } from "@/components/pagination";
import { Spinner } from "@/components/Spinner";
import {
  getRegionAdminColumns,
  type TRegionAdmin,
} from "@/components/table/column";
import { DataTable } from "@/components/table/data-table";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import usePagination from "@/hooks/use-pagination";
import { constant } from "@/lib/constant";
import { generatePageTitle } from "@/utils/seo";

function RegionAdminPage() {
  const navigate = useNavigate();
  const [newPage, setNewPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const { data, isFetching } = useFetchAllRegionAdmins({
    limit: perPage,
    page: newPage,
  });
  const { currentPage, setPage, totalPages, currentItems } =
    usePagination<TRegionAdmin>(
      data?.regionalAdmins || [],
      newPage,
      perPage,
      data?.pagination,
    );

  const handleEdit = useCallback(
    (id: string) => {
      navigate(constant.ROUTING_URLS.EDIT_REGION_ADMIN.replace(":id", id));
    },
    [navigate],
  );
  const handleDelete = useCallback((id: string) => {
    console.log(id);
    // setData((prev) =>
    //   prev.filter((row) => row.id != id))
  }, []);
  const handleAccess = useCallback((id: string) => {
    console.log("manage access:", id);
  }, []);
  const columns = useMemo(
    () => getRegionAdminColumns(handleEdit, handleDelete, handleAccess),
    [handleEdit, handleDelete, handleAccess],
  );
  const [searchValue, setSearchValue] = useState("");
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});

  // Number of pages based on filtered data
  const calculatedTotalPages = Math.max(1, totalPages);

  // Unified handler for page and page size changes
  const handlePageChange = (value: number) => {
    // If value is a page size option, update page size
    if (value === 10 || value === 20 || value === 30) {
      setPerPage(value);
      setNewPage(1);
      setPage(1);
    } else {
      // Otherwise it's a page change
      setPage(value);
      setNewPage(value);
      window.scrollTo(0, 0);
    }
  };

  return (
    <>
      <PageTitle title={generatePageTitle("Region Admin")} />
      <div className="p-6 space-y-6 lg:p-8 lg:space-y-8">
        <PageHeader
          title="Region Management"
          breadcrumbs={[
            { label: "Home", path: "/" },
            { label: "Region Management" },
            { label: "Regional Admins" },
          ]}
          action={{
            label: "Add Regional Admin",
            icon: <Plus />,
            link: constant.ROUTING_URLS.CREATE_REGION_ADMIN,
          }}
        />

        <div className="w-full flex items-center justify-end gap-4">
          <span
            className={`${
              Object.keys(rowSelection).filter((k) => rowSelection[k])
                .length === 0
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
                // console.log("data:", data);
                // console.log("rowSelection:", rowSelection);
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
        {totalPages >= 0 && calculatedTotalPages >= 1 && (
          <PaginationControls
            currentPage={currentPage}
            totalPages={calculatedTotalPages}
            onPageChange={handlePageChange}
            perPage={perPage}
            totalItems={data?.pagination?.totalItems}
          />
        )}
      </div>
    </>
  );
}

export default RegionAdminPage;
