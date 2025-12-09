// @ts-nocheck

import type { Table } from "@tanstack/react-table";
import { Plus, Search } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useFetchAllNews } from "@/api";
import BulkDeleteBtn from "@/components/bulkDeleteBtn/BulkDeleteBtn";
import { ErrorCard } from "@/components/common/ErrorCard";
import PageTitle from "@/components/common/PageTitle";
import { PageHeader } from "@/components/layouts/PageHeader";
import { PaginationControls } from "@/components/pagination";
import { Spinner } from "@/components/Spinner";
import { getNews, type TNews } from "@/components/table/column";
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

const Newspage = () => {
  const navigate = useNavigate();
  const [tableRef, setTableRef] = useState<Table<TNews> | null>(null);
  const [perPage, setPerPage] = useState(10);
  const [newPage, setNewPage] = useState(1);
  const { data, refetch, isFetching, isError } = useFetchAllNews({
    page: newPage,
    limit: perPage,
  });
  const { currentPage, setPage, totalPages, currentItems } =
    usePagination<TNews>(data?.items, newPage, perPage, data?.pagination);

  const handleEdit = (id: string) => {
    console.log("Edit:", id);
    navigate(constant.ROUTING_URLS.EDIT_NEWS.replace(":id", id));
  };
  const deleteNews = queries.useDeleteNewsMutation();
  const bulkDeleteNews = queries.useBulkDeleteNewsMutation();
  const handleDelete = (id: string) => {
    try {
      toastPromise(deleteNews.mutateAsync(id), {
        loading: "Deleting news...",
        success: (res) => {
          if (res) refetch();
          return "News deleted successfully";
        },
        error: (e) =>
          e instanceof Error ? e.message : "Opps! Failed to delete news",
      });
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };
  const columns = getNews(handleEdit, handleDelete);

  const [searchValue, setSearchValue] = useState("");
  const [rowSelection, setRowSelection] = useState({});
  const calculatedTotalPages = Math.max(1, totalPages);

  const handlePageChange = (value: number) => {
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
      <PageTitle title={generatePageTitle("News")} />
      <div className="p-6 space-y-6 md:p-8 md:space-y-8">
        <PageHeader
          title="News"
          breadcrumbs={[{ label: "Home", path: "/" }, { label: "News" }]}
          action={{
            label: "Add News",
            icon: <Plus />,
            link: constant.ROUTING_URLS.CREATE_NEWS,
          }}
        />

        <div className="w-full flex items-center justify-end gap-4">
          <span
            className={`${Object.keys(rowSelection).filter((k) => rowSelection[k]).length === 0 ? "cursor-no-drop" : "cursor-pointer"}`}
          >
            <BulkDeleteBtn
              rowSelection={rowSelection}
              tableRef={tableRef}
              bulkDeleteMutation={bulkDeleteNews}
              refetch={refetch}
              setRowSelection={setRowSelection}
              title="News"
              descTitle="news"
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
            totalItems={data?.pagination?.total}
            perPage={perPage}
          />
        )}
      </div>
    </>
  );
};

export default Newspage;
