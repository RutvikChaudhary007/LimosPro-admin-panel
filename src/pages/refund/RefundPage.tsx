//@ts-nocheck

import useFetchAllRefund from "@/api/getAllRefund.api";
import { ErrorCard } from "@/components/common/ErrorCard";
import PageTitle from "@/components/common/PageTitle";
import Header from "@/components/layouts/BreadCramb";
import { Spinner } from "@/components/Spinner";
import { getRefund, getStatusColor, type TRefund } from "@/components/table/column";
import { DataTable } from "@/components/table/data-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import usePagination from "@/hooks/use-pagination";
import { constant } from "@/lib/constant";
import { generatePageTitle } from "@/utils/seo";
import { ChevronDown, Download } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const showOptions = [
  { label: "Show 10", value: 10 },
  { label: "Show 15", value: 15 },
  { label: "Show 20", value: 20 },
  { label: "Show 25", value: 25 },
];

// const tableData: TRefund[] = [
//         {
//             id: "801c9f7e-7dfa-4f97-9664-912fe821db19",
//             Status: "Pending",
//             amount: "1879",
//             refundId: "AA57329144",
//             PassengerName: "Chris Johnson",
//             PaymentId: "TRXPAY000111"
//         },
//         {
//             id: "801c9f7e-7dfa-4f97-a664-912fe821db1b",
//             Status: "InProgress",
//             amount: "1879",
//             refundId: "AA57329144",
//             PassengerName: "Jane Smith",
//             PaymentId: "SAMPLEPAY123"
//         },

//     ]

const RefundPage = () => {
  // const perPage = 10;
  const navigate = useNavigate();
  const [newPage, setNewPage] = useState(1);
  const [selectedOption, setSelectedOption] = useState(showOptions[0]);
  // const [data] = useState<TRefund[]>(tableData);
  const { data, isFetching, isError, refetch } = useFetchAllRefund({
    page: newPage,
    limit: selectedOption.value,
  });
  const { currentPage, setPage, totalPages, currentItems } = usePagination<TRefund>(
    data?.payments,
    newPage,
    selectedOption.value,
  );

  const handleView = useCallback((id: string) => {
    console.log("view:", id);
    navigate(constant.ROUTING_URLS.VIEW_REFUND);
  }, []);
  const columns = useMemo(() => getRefund(handleView), [handleView]);
  const [rowSelection, setRowSelection] = useState({});

  // Number of pages based on filtered data
  const calculatedTotalPages = Math.max(1, totalPages);

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    setNewPage(newPage);
    window.scrollTo(0, 0);
  };

  // Generate pagination items
  const generatePaginationItems = () => {
    const items = [];

    // Always show first page
    items.push(
      <PaginationItem key="first">
        <PaginationLink isActive={currentPage === 1} onClick={() => handlePageChange(1)}>
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
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(calculatedTotalPages - 1, currentPage + 1); i++) {
      if (i === 1 || i === calculatedTotalPages) continue; // Skip first and last pages as they're added separately

      items.push(
        <PaginationItem key={i}>
          <PaginationLink isActive={currentPage === i} onClick={() => handlePageChange(i)}>
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
  if (isError) return <ErrorCard refetch={refetch} />;
  return (
    <>
      <PageTitle title={generatePageTitle("Refund")} />
      <div className="p-6 space-y-6 md:p-8 md:space-y-8">
        <Header className="p-4 h-[79px] bg-[#FDFDFD] shadow-base-light">
          <div className="w-full h-full flex items-center justify-between">
            <div>
              <h2 className="font-medium text-xl text-black">Refund</h2>
              <h4>
                {" "}
                <span className="text-[#515151] w-[116px] h-4 text-xs">LIMOSPRO</span>{" "}
                <span className="text-xs text-[#939393] w-[50px] h-4">/ Refund</span>
              </h4>
            </div>
          </div>
        </Header>

        <div className="flex justify-between gap-2.5">
          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className={`w-[180px] h-[39px] flex items-center justify-between rounded mt-5 shadow-inner shadow-[#F1F1F1] cursor-pointer `}
                >
                  {selectedOption.label} <ChevronDown className="ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56 bg-[#FDFDFD] shadow-inner shadow-[#F1F1F1] cursor-pointer"
                align="start"
              >
                <DropdownMenuGroup>
                  {showOptions.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      className={`flex items-center justify-between cursor-pointer ${getStatusColor(option.label)} ${option.label === "Active" && "text-white"}`}
                      onClick={() => setSelectedOption(option)}
                    >
                      {option.label} <ChevronDown className="ml-2" />
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="w-[369px] h-[39px] mt-5 flex items-center justify-end gap-3">
            <span
              className={`${Object.keys(rowSelection).filter((k) => rowSelection[k]).length === 0 ? "cursor-no-drop" : "cursor-pointer"}`}
            >
              <Button
                variant={"outline"}
                className="p-2.5 w-[137px] h-full rounded flex items-center justify-evenly  cursor-pointer bg-[#FDFDFD] shadow-inner shadow-[#F1F1F1] hover:bg-none outline-0"
                disabled={Object.keys(rowSelection).filter((k) => rowSelection[k]).length === 0}
                onClick={() => {
                  // setData((prev) =>prev.filter((row,i) => !rowSelection[i])
                  // );
                  // setRowSelection({});
                }}
              >
                <span className="text-[#959595] text-sm w-[93px] h-[19px]">Export</span>
                <Download size={14} className="text-[#959595] cursor-pointer" />
              </Button>
            </span>
          </div>
        </div>
        {isFetching ? (
          <Spinner />
        ) : (
          <DataTable
            columns={columns}
            // @ts-expect-error: We are intentionally assigning a number to a string type for testing.
            data={currentItems}
            rowSelection={rowSelection}
            onRowSelectionChange={setRowSelection}
          />
        )}

        {/* Pagination */}
        {totalPages > 0 && calculatedTotalPages > 1 && (
          <Pagination className="justify-end mt-5 cursor-pointer">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={() => handlePageChange(currentPage - 1)}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>

              {generatePaginationItems()}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={() => handlePageChange(currentPage + 1)}
                  className={currentPage === calculatedTotalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </>
  );
};

export default RefundPage;
