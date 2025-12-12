import { Plus, Search } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  useDeleteBusinessPageLayout,
  useFetchAllBusinessPageLayouts,
} from "@/api";
import PageTitle from "@/components/common/PageTitle";
import { PageHeader } from "@/components/layouts/PageHeader";
import { PaginationControls } from "@/components/pagination";
import { Spinner } from "@/components/Spinner";
import { getPageColumns, type TPage } from "@/components/table/column";
import { DataTable } from "@/components/table/data-table";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { toastPromise } from "@/hooks/use-toast";
import usePagination from "@/hooks/usePagination";
import { constant } from "@/lib/constant";
import { generatePageTitle } from "@/utils/seo";

const PageListPage = () => {
  const navigate = useNavigate();
  const [newPage, setNewPage] = useState(1);
  const [tableRef, setTableRef] = useState<any>(null);
  const [perPage, setPerPage] = useState(10);

  const { data, refetch, isFetching } = useFetchAllBusinessPageLayouts({
    page: newPage,
    limit: perPage,
  });

  const { currentPage, setPage, totalPages, currentItems } =
    usePagination<TPage>(data?.pageLayout, newPage, perPage, data?.pagination);

  const handleEdit = (id: string) => {
    console.log("Edit:", id);
    navigate(constant.ROUTING_URLS.EDIT_CONTENT_MANAGEMENT.replace(":id", id));
  };

  const deletePageMutation = useDeleteBusinessPageLayout();

  const handleDelete = (id: string) => {
    try {
      toastPromise(deletePageMutation.mutateAsync(id), {
        loading: "Deleting Page...",
        success: (res) => {
          if (res) refetch();
          return "Yeah! Page deleted successfully.";
        },
        error: (e) =>
          e instanceof Error ? e.message : "Failed to delete Page.",
      });
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred.");
      }
    }
  };

  const columns = getPageColumns(handleEdit, handleDelete);

  const [searchValue, setSearchValue] = useState("");
  const [rowSelection, setRowSelection] = useState({});

  // Number of pages based on filtered data
  const calculatedTotalPages = Math.max(1, totalPages);

  // Unified handler for page and page size changes
  const handlePageChange = (value: number) => {
    // Check if it's a page size change (10, 20, or 30)
    if (value === 10 || value === 20 || value === 30) {
      setPerPage(value);
      setNewPage(1);
      setPage(1);
    } else {
      // Otherwise it's a page change
      setNewPage(value);
      setPage(value);
      window.scrollTo(0, 0);
    }
  };

  return (
    <>
      <PageTitle title={generatePageTitle("Pages")} />
      <div className="p-6 space-y-6 md:p-8 md:space-y-8">
        <PageHeader
          title="Pages"
          breadcrumbs={[
            { label: "Home", path: "/" },
            { label: "Content Management" },
            { label: "Pages" },
          ]}
          action={{
            label: "Create Page",
            icon: <Plus />,
            link: constant.ROUTING_URLS.CREATE_CONTENT_MANAGEMENT,
          }}
        />

        <div className="w-full flex items-center justify-end gap-4">
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
            onTableReady={setTableRef}
            onRowSelectionChange={setRowSelection}
            globalFilter={searchValue}
            onGlobalFilterChange={setSearchValue}
          />
        )}

        {/* Pagination */}
        {totalPages >= 0 && calculatedTotalPages >= 1 && (
          <PaginationControls
            key={tableRef?.current?.id}
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
};

export default PageListPage;
