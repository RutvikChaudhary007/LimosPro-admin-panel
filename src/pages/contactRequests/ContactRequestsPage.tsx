import { Search, Trash2 } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { useFetchAllContactRequest } from "@/api";
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
import usePagination from "@/hooks/usePagination";
import { generatePageTitle } from "@/utils/seo";

const ContactRequestsPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isModal, setIsModal] = useState(false);
  const [newPage, setNewPage] = useState(1);
  const [perPage, setPerPage] = useState<number>(10);
  const [msgId, setMsgId] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] =
    useState<TContactRequest | null>(null);
  const { data, isFetching, refetch } = useFetchAllContactRequest({
    page: newPage,
    limit: perPage,
  });

  const { currentPage, setPage, totalPages, currentItems } =
    usePagination<TContactRequest>(
      data?.contactRequests ?? [],
      newPage,
      perPage,
      data?.pagination,
    );

  const handleView = useCallback((id: string) => {
    setIsOpen(true);
    setMsgId(id);
  }, []);

  const handleEmail = useCallback(
    (id: string) => {
      const request = currentItems.find((item) => item.id === id);
      if (request) {
        setSelectedRequest(request);
        setIsModal(true);
      }
    },
    [currentItems],
  );

  const columns = useMemo(
    () => getContactRequest(handleView, handleEmail),
    [handleView, handleEmail],
  );

  const [searchValue, setSearchValue] = useState("");
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});

  const calculatedTotalPages = Math.max(1, totalPages);

  const handlePageChange = (value: number) => {
    setNewPage(value);
    setPage(value);
    window.scrollTo(0, 0);
  };

  const handlePerPageChange = (value: number) => {
    setPerPage(value);
    setNewPage(1);
    setPage(1);
    refetch();
  };

  const selectedRowsCount = Object.keys(rowSelection).filter(
    (k) => rowSelection[k],
  ).length;

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
          <Button
            variant="outlineBlack"
            disabled={selectedRowsCount === 0}
            onClick={() => {
              setRowSelection({});
            }}
          >
            <span>Delete</span>
            <Trash2 />
          </Button>
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

        {/* Reply Dialog */}
        {selectedRequest && (
          <ReplyFC
            isModal={isModal}
            setIsModal={setIsModal}
            request={selectedRequest}
            onSuccess={refetch}
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

export default ContactRequestsPage;
