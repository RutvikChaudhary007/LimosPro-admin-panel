// @ts-nocheck

import { Search, Trash2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import useFetchAllContactRequest from "@/api/contactRequest.api";
import ReplyFC from "@/components/ContactRequests/ReplyFC";
import ViewModal from "@/components/ContactRequests/ViewModal";
import PageTitle from "@/components/common/PageTitle";
import { PageHeader } from "@/components/layouts/PageHeader";
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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { SelectDropDown } from "@/components/ui/select";
import usePagination from "@/hooks/use-pagination";
import { generatePageTitle } from "@/utils/seo";

const showOptions = [
  { value: "10", label: "Show 10" },
  { value: "20", label: "Show 20" },
  { value: "30", label: "Show 30" },
];

const ContactRequestsPage = () => {
  const [{ value: optionDefaultValue }] = showOptions;
  const [isOpen, setIsOpen] = useState(false);
  const [isModal, setIsModal] = useState(false);
  const [perPage, setPerPage] = useState<number>(
    parseInt(optionDefaultValue, 10),
  );
  const [msgId, setMsgId] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] =
    useState<string>(optionDefaultValue);
  const { data, isFetching } = useFetchAllContactRequest();
  // const [data, setData] = useState<TContactRequest[]>(tableData);

  const { currentPage, nextPage, prevPage, setPage, totalPages, currentItems } =
    usePagination<TContactRequest>(
      data?.contactRequests,
      1,
      perPage,
      data?.pagination,
    );

  useEffect(() => {
    setPerPage(parseInt(selectedOption, 10));
  }, [selectedOption]);
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

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo(0, 0);
  };

  // Generate pagination items
  const generatePaginationItems = () => {
    const items = [];

    // Always show first page
    items.push(
      <PaginationItem key="first">
        <PaginationLink
          isActive={currentPage === 1}
          onClick={() => handlePageChange(1)}
        >
          1
        </PaginationLink>
      </PaginationItem>,
    );

    // Show ellipsis if needed
    if (currentPage > 3) {
      items.push(
        <PaginationItem key="ellipsis-1">
          <PaginationEllipsis />
        </PaginationItem>,
      );
    }

    // Show nearby pages
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(calculatedTotalPages - 1, currentPage + 1);
      i++
    ) {
      if (i === 1 || i === calculatedTotalPages) continue; // Skip first and last pages as they're added separately

      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            isActive={currentPage === i}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </PaginationLink>
        </PaginationItem>,
      );
    }

    // Show ellipsis if needed
    if (currentPage < calculatedTotalPages - 2) {
      items.push(
        <PaginationItem key="ellipsis-2">
          <PaginationEllipsis />
        </PaginationItem>,
      );
    }

    // Always show last page if there's more than one page
    if (calculatedTotalPages > 1) {
      items.push(
        <PaginationItem key="last">
          <PaginationLink
            isActive={currentPage === calculatedTotalPages}
            onClick={() => handlePageChange(calculatedTotalPages)}
          >
            {calculatedTotalPages}
          </PaginationLink>
        </PaginationItem>,
      );
    }

    return items;
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

        <div className="flex justify-between">
          <SelectDropDown
            placeholder={selectedOption}
            items={showOptions}
            value={selectedOption}
            setSelectedItem={setSelectedOption}
          />
          <div className="w-full max-w-fit flex items-center justify-between gap-4">
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
        {totalPages > 0 && calculatedTotalPages > 1 && (
          <Pagination className="justify-end mt-5 cursor-pointer">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={() => handlePageChange(currentPage - 1)}
                  className={
                    currentPage === 1 ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>

              {generatePaginationItems()}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={() => handlePageChange(currentPage + 1)}
                  className={
                    currentPage === calculatedTotalPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </>
  );
};

export default ContactRequestsPage;
