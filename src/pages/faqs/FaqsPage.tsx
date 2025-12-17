// @ts-nocheck

import { Plus, Search } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFetchAllFAQs } from "@/api";
import BulkDeleteBtn from "@/components/bulkDeleteBtn/BulkDeleteBtn";
import { ErrorCard } from "@/components/common/ErrorCard";
import PageTitle from "@/components/common/PageTitle";
import { PageHeader } from "@/components/layouts/PageHeader";
import { PaginationControls } from "@/components/pagination";
import { Spinner } from "@/components/Spinner";
import { getFaqs, type TFaqs } from "@/components/table/column";
import { DataTable } from "@/components/table/data-table";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { toastPromise, useToast } from "@/hooks/use-toast";
import usePagination from "@/hooks/usePagination";
import { constant } from "@/lib/constant";
import queries from "@/lib/queries";
import { generatePageTitle } from "@/utils/seo";

const FaqsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [newPage, setNewPage] = useState(1);
  const [tableRef, setTableRef] = useState<any>(null);
  const [perPage, setPerPage] = useState(10);
  const { data, refetch, isFetching, isError } = useFetchAllFAQs({
    page: newPage,
    limit: perPage,
  });
  const { currentPage, setPage, totalPages, currentItems } =
    usePagination<TFaqs>(data?.items, newPage, perPage, data?.pagination);

  const handleEdit = (id: string) => {
    console.log("Edit:", id);
    navigate(constant.ROUTING_URLS.EDIT_FAQ.replace(":id", id));
  };
  const deleteFaq = queries.useDeleteFaqMutation();
  const bulkDeleteFaq = queries.useBulkDeleteFaqMutation();
  const handleDelete = (id: string) => {
    try {
      toastPromise(deleteFaq.mutateAsync(id), {
        loading: "Deleting FAQ...",
        success: (res) => {
          if (res) refetch();
          return "Yeah! FAQ deleted successfully";
        },
        error: (e) =>
          e instanceof AxiosError
            ? e.response?.data?.data?.error || e.response?.data?.message
            : "Opps! Delete FAQ failed",
      });
    } catch (err) {
      if (err instanceof Error) {
        toast({
          title: "Delete FAQ failed",
          description: err.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Delete FAQ failed",
          description: "An unknown error occurred",
          variant: "destructive",
        });
      }
    }
  };
  const columns = getFaqs(handleEdit, handleDelete);

  const [searchValue, setSearchValue] = useState("");
  const [rowSelection, setRowSelection] = useState({});
  const calculatedTotalPages = Math.max(1, totalPages);

  // Handle page change
  const handlePageChange = (value: number) => {
    setNewPage(value);
    setPage(value);
    window.scrollTo(0, 0);
  };

  // Handle per-page size change
  const handlePerPageChange = (value: number) => {
    setPerPage(value);
    setNewPage(1);
    setPage(1);
    refetch();
  };

  if (isError) return <ErrorCard refetch={refetch} />;
  return (
    <>
      <PageTitle title={generatePageTitle("Faq")} />
      <div className="p-6 space-y-6 md:p-8 md:space-y-8">
        <PageHeader
          title="Frequently Asked Question"
          breadcrumbs={[{ label: "Home", path: "/" }, { label: "Faq" }]}
          action={{
            label: "Add Faq",
            icon: <Plus />,
            link: constant.ROUTING_URLS.CREATE_FAQ,
          }}
        />

        <div className="w-full flex items-center justify-end gap-4">
          <span
            className={`${Object.keys(rowSelection).filter((k) => rowSelection[k]).length === 0 ? "cursor-no-drop" : "cursor-pointer"}`}
          >
            <BulkDeleteBtn
              rowSelection={rowSelection}
              tableRef={tableRef}
              bulkDeleteMutation={bulkDeleteFaq}
              refetch={refetch}
              setRowSelection={setRowSelection}
              title="Faqs"
              descTitle="faqs"
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
            onPerPageChange={handlePerPageChange}
            totalItems={data?.pagination?.totalItems}
            perPage={perPage}
          />
        )}
      </div>
    </>
  );
};

export default FaqsPage;
