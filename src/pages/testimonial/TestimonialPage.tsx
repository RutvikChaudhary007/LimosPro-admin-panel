import type { Table } from "@tanstack/react-table";
import { Plus, Search } from "lucide-react";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useFetchAllTestimonials } from "@/api";
import BulkDeleteBtn from "@/components/bulkDeleteBtn/BulkDeleteBtn";
import { ErrorCard } from "@/components/common/ErrorCard";
import PageTitle from "@/components/common/PageTitle";
import { PageHeader } from "@/components/layouts/PageHeader";
import { PaginationControls } from "@/components/pagination";
import { Spinner } from "@/components/Spinner";
import { getTestimonial, type TTestimonial } from "@/components/table/column";
import { DataTable } from "@/components/table/data-table";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import usePagination from "@/hooks/use-pagination";
import { toastPromise } from "@/hooks/use-toast";
import { constant } from "@/lib/constant";
import queries from "@/lib/queries";
import { generatePageTitle } from "@/utils/seo";

const TestimonialPage = () => {
  const navigate = useNavigate();
  const [tableRef, setTableRef] = useState<Table<TTestimonial> | null>(null);
  const [perPage, setPerPage] = useState<number>(10);
  const [newPage, setNewPage] = useState(1);
  const { data, refetch, isFetching, isError } = useFetchAllTestimonials({
    page: newPage,
    limit: perPage,
  });

  const { currentPage, setPage, totalPages, currentItems } =
    usePagination<TTestimonial>(
      data?.testimonials,
      newPage,
      perPage,
      data?.pagination,
    );

  const handleEdit = useCallback(
    (id: string) => {
      console.log("Edit:", id);
      navigate(constant.ROUTING_URLS.EDIT_TESTIMONIALS.replace(":id", id));
    },
    [navigate],
  );
  const deleteTestimonial = queries.useDeleteTestimonialMutation();
  const bulkDeleteTestimonial = queries.useBulkDeleteTestimonialMutation();
  const handleDelete = (id: string) => {
    try {
      toastPromise(deleteTestimonial.mutateAsync(id), {
        loading: "Deleting testimonial...",
        success: (res) => {
          if (res) refetch();
          return "Yeah! Testimonial deleted successfully";
        },
        error: (e) =>
          e instanceof Error ? e.message : "Failed to delete testimonial",
      });
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error(`Unexpected error occurred: ${error}`);
      }
    }
    // setData((prev) =>
    //   prev.filter((row) => row.id !== id))
  };
  const columns = getTestimonial(handleEdit, handleDelete);

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
      <PageTitle title={generatePageTitle("Testimonials")} />
      <div className="p-6 space-y-6 md:p-8 md:space-y-8">
        <PageHeader
          title="Testimonials"
          breadcrumbs={[
            { label: "Home", path: "/" },
            { label: "Testimonials" },
          ]}
          action={{
            label: "Add Testimonial",
            icon: <Plus />,
            link: constant.ROUTING_URLS.CREATE_TESTIMONIALS,
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
            <BulkDeleteBtn
              rowSelection={rowSelection}
              tableRef={tableRef}
              bulkDeleteMutation={bulkDeleteTestimonial}
              refetch={refetch}
              setRowSelection={setRowSelection}
              title="Testimonials"
              descTitle="testimonials"
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
        {isFetching ? (
          <Spinner />
        ) : (
          <DataTable
            columns={columns}
            data={currentItems}
            onTableReady={setTableRef}
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
            totalItems={data?.pagination?.total}
            perPage={perPage}
          />
        )}
      </div>
    </>
  );
};

export default TestimonialPage;
