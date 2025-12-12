// @ts-nocheck

import type { Table } from "@tanstack/react-table";
import { Plus, Search } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useFetchAllPartners } from "@/api";
import BulkDeleteBtn from "@/components/bulkDeleteBtn/BulkDeleteBtn";
import { ErrorCard } from "@/components/common/ErrorCard";
import PageTitle from "@/components/common/PageTitle";
import { PageHeader } from "@/components/layouts/PageHeader";
import { PaginationControls } from "@/components/pagination";
import { Spinner } from "@/components/Spinner";
import { getOurPartner, type TOurPartner } from "@/components/table/column";
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

const OurPartnerPage = () => {
  const navigate = useNavigate();
  const [tableRef, setTableRef] = useState<Table<TOurPartner> | null>(null);
  const [perPage, setPerPage] = useState(10);
  const [newPage, setNewPage] = useState(1);
  // const [data, setData] = useState<TOurPartner[]>(tableData);
  const { data, refetch, isFetching, isError } = useFetchAllPartners({
    page: newPage,
    limit: perPage,
  });
  const { currentPage, setPage, totalPages, currentItems } =
    usePagination<TOurPartner>(data?.items, newPage, perPage, data?.pagination);

  const handleEdit = (id: string) => {
    console.log("Edit:", id);
    navigate(constant.ROUTING_URLS.EDIT_OUR_PARTNERS.replace(":id", id));
  };
  const deletePartnerMutation = queries.useDeleteOurPartnerMutation();
  const bulkDeletePartnerMutation = queries.useBulkDeleteOurPartnerMutation();
  const handleDelete = async (id: string) => {
    try {
      toastPromise(deletePartnerMutation.mutateAsync(id), {
        loading: "Deleting partner...",
        success: (res) => {
          if (res) refetch();
          return "Yeah! Partner deleted successfully";
        },
        error: (e) =>
          e instanceof Error ? e.message : "Opps! Failed to delete partner",
      });
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred");
      }
    }
  };
  const columns = getOurPartner(handleEdit, handleDelete);

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
      <PageTitle title={generatePageTitle("Our Partner")} />
      <div className="p-6 space-y-6 md:p-8 md:space-y-8">
        <PageHeader
          title="Our Partners"
          breadcrumbs={[
            { label: "Home", path: "/" },
            { label: "Our Partners" },
          ]}
          action={{
            label: "Add New Partner",
            icon: <Plus />,
            link: constant.ROUTING_URLS.CREATE_OUR_PARTNERS,
          }}
        />

        <div className="w-full flex items-center justify-end gap-4">
          <span
            className={`${Object.keys(rowSelection).filter((k) => rowSelection[k]).length === 0 ? "cursor-no-drop" : "cursor-pointer"}`}
          >
            <BulkDeleteBtn
              rowSelection={rowSelection}
              tableRef={tableRef}
              bulkDeleteMutation={bulkDeletePartnerMutation}
              refetch={refetch}
              setRowSelection={setRowSelection}
              title="Our Partners"
              descTitle="our partners"
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
            totalItems={data?.pagination?.totalItems}
            perPage={perPage}
          />
        )}
      </div>
    </>
  );
};

export default OurPartnerPage;
