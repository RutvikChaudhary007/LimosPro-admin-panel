// @ts-nocheck

import { Search, Trash2 } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import useFetchAllContactRequest from "@/api/contactRequest.api";
import ReplyFC from "@/components/ContactRequests/ReplyFC";
import ViewModal from "@/components/ContactRequests/ViewModal";
import PageTitle from "@/components/common/PageTitle";
import { PageHeader } from "@/components/layouts/PageHeader";
import { PaginationControls } from "@/components/pagination";
import { Spinner } from "@/components/Spinner";
import {
  getContactRequest,
  type TContactRequest,
} from "@/components/table/column";
import { DataTable } from "@/components/table/data-table";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import usePagination from "@/hooks/use-pagination";
import { generatePageTitle } from "@/utils/seo";

const ContactRequestsPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isModal, setIsModal] = useState(false);
  const [newPage, setNewPage] = useState(1);
  const [perPage, setPerPage] = useState<number>(10);
  const [msgId, setMsgId] = useState<string | null>(null);
  const { data, isFetching, refetch } = useFetchAllContactRequest({
    page: newPage,
    limit: perPage,
  });

  const { currentPage, setPage, totalPages, currentItems } =
    usePagination<TContactRequest>(
      data?.contactRequests,
      newPage,
      perPage,
      data?.pagination,
    );

  const handleView = useCallback((id: string) => {
    console.log("view:", id);
    setIsOpen(true);
    setMsgId(id);
  }, []);
  const handleEmail = useCallback((id: string) => {
    console.log("Email:", id);
    setIsModal(true);
  }, []);
  const columns = useMemo(
    () => getContactRequest(handleView, handleEmail),
    [handleView, handleEmail],
  );

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

  return (
    <>
      <PageTitle title={generatePageTitle("Contact Request")} />
      <div className="p-6 space-y-6 md:p-8 md:space-y-8">
        <PageHeader
          title="Contact Requests"
          breadcrumbs={[
            { label: "Home", path: "/" },
            { label: "Contact Requests" },
          ]}
        />
        <div className="w-full flex items-center justify-end gap-4">
          <span
            className={`${Object.keys(rowSelection).filter((k) => rowSelection[k]).length === 0 ? "cursor-no-drop" : "cursor-pointer"}`}
          >
            <Button
              variant="outlineBlack"
              disabled={
                Object.keys(rowSelection).filter((k) => rowSelection[k])
                  .length === 0
              }
              onClick={() => {
                // setData((prev) =>
                //   prev.filter((row, i) => !rowSelection[i])
                // );
                //   console.log("data:", data);
                //   console.log("rowSelection:", rowSelection);
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

        {/* View Dialog */}
        {msgId && (
          <ViewModal id={msgId} open={isOpen} onOpenChange={setIsOpen} />
        )}
        {/* View Dialog */}
        <ReplyFC isModal={isModal} setIsModal={setIsModal} />
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

export default ContactRequestsPage;
