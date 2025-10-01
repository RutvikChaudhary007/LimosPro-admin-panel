// @ts-nocheck

import useFetchAllPayments from '@/api/getAllPayments.api';
import { Spinner } from '@/components/Spinner';
import AdminRootLayout from '@/components/layouts/AdminRootLayout';
import Header from '@/components/layouts/Header';
import { getPayments, getStatusColor, type TPayments } from '@/components/table/column';
import { DataTable } from '@/components/table/data-table';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import usePagination from '@/hooks/use-pagination';
import { constant } from '@/lib/constant';
import { ChevronDown, Download } from 'lucide-react';
import React, { useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom';

const showStatus = [
  { label: 'Select Status', value: '' },
  { label: 'Pending', value: 'pending' },
  { label: 'Failed', value: 'failed' },
  { label: 'Completed', value: 'completed' },
  { label: 'Refunded', value: 'refunded' },
];

const showOptions = [
  { label: 'Show 10', value: 10 },
  { label: 'Show 15', value: 15 },
  { label: 'Show 20', value: 20 },
  { label: 'Show 25', value: 25 },
];

const tableData: TPayments[] = [
        {
            id: "801c9f7e-7dfa-4f97-9664-912fe821db19",
            Status: "Pending",
            Amount: "1879",
            BookingId: "AA57329144",
            PassengerName: "Chris Johnson",
            PaymentId: "TRXPAY000111"
        },
        {
            id: "801c9f7e-7dfa-4f97-a664-912fe821db1b",
            Status: "InProgress",
            
            Amount: "1879",
            BookingId: "AA57329144",
            PassengerName: "Jane Smith",
            PaymentId: "SAMPLEPAY123"
        },
        
    ]
const PaymentsPage = () => {
  const navigate = useNavigate();
  
  const [newPage, setNewPage] = useState<number>(1);
    const [selectedStatus, setSelectedStatus] = useState(showStatus[0]);
    const [selectedOption, setSelectedOption] = useState(showOptions[0]);
  // const [data, setData] = useState<TPayments[]>(tableData);
  // const { currentPage, nextPage, prevPage, setPage, totalPages, currentItems } = usePagination<TPayments>(data, 1, perPage);
  const {data, isFetching} = useFetchAllPayments({page: newPage, limit: selectedOption.value, status: selectedStatus.value});
  const { currentPage, nextPage, prevPage, setPage, totalPages, currentItems } = usePagination<TPayments>(data?.payments, newPage, selectedOption.value, data?.pagination);


  
const handleView = useCallback((id: string) => { console.log("view:", id)
    navigate(constant.ROUTING_URLS.VIEW_PAYMENTS.replace(":id",id));
   }, []);
  const handleEdit = useCallback((id: string) => { console.log("Edit:", id)
    navigate(constant.ROUTING_URLS.EDIT_USERS.replace(":id",id));
   }, []);
  const columns = useMemo(() => getPayments(handleView,handleEdit),[handleView,handleEdit])
  const [searchValue, setSearchValue] = useState("");
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
        <PaginationLink
          isActive={currentPage === 1}
          onClick={() => handlePageChange(1)}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );

    // Show ellipsis if needed
    if (currentPage > 3) {
      items.push(
        <PaginationItem key="ellipsis-1">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Show nearby pages
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(calculatedTotalPages - 1, currentPage + 1); i++) {
      if (i === 1 || i === calculatedTotalPages) continue; // Skip first and last pages as they're added separately

      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            isActive={currentPage === i}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Show ellipsis if needed
    if (currentPage < calculatedTotalPages - 2) {
      items.push(
        <PaginationItem key="ellipsis-2">
          <PaginationEllipsis />
        </PaginationItem>
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
        </PaginationItem>
      );
    }

    return items;
  };
  return (
    <AdminRootLayout>
      <div className="px-10 py-6 h-[calc(100vh-146px)] overflow-auto">
        <Header className="p-4 h-[79px] bg-[#FDFDFD] shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
          <div className="w-full h-full flex items-center justify-between">
            <div>
              <h2 className="font-medium text-xl text-black">Payments</h2>
              <h4> <span className="text-[#515151] w-[116px] h-4 text-xs">LIMOSPRO</span> <span className="text-xs text-[#939393] w-[50px] h-4">/ Payments</span></h4>
            </div>
            
          </div>
        </Header>

        <div className="flex justify-between gap-2.5">
          <div className="flex items-center gap-3">
          <DropdownMenu >
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className={`w-[180px] h-[39px] flex items-center justify-between rounded mt-5 shadow-inner shadow-[#F1F1F1] cursor-pointer `}>
                {selectedOption.label} <ChevronDown className="ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-[#FDFDFD] shadow-inner shadow-[#F1F1F1] cursor-pointer" align="start">
              <DropdownMenuGroup>
                {showOptions.map(option => (
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
             <DropdownMenu >
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className={`w-[180px] h-[39px] flex items-center justify-between rounded shadow-inner shadow-[#F1F1F1] cursor-pointer `}>
                {selectedStatus.label} <ChevronDown className="ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-[#FDFDFD] shadow-inner shadow-[#F1F1F1] cursor-pointer" align="start">
              <DropdownMenuGroup>
                {showStatus.map(option => (
                  <DropdownMenuItem
                    key={option.value}
                    className={`flex items-center justify-between cursor-pointer ${getStatusColor(option.label)} ${option.label === "Active" && "text-white"}`}
                    onClick={() => setSelectedStatus(option)}
                  >
                    {option.label} <ChevronDown className="ml-2" />
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
            <span 
            // @ts-expect-error: We are intentionally assigning a number to a string type for testing.
            className={`${Object.keys(rowSelection).filter((k) => rowSelection[k]).length === 0?"cursor-no-drop":"cursor-pointer"}`}>
            <Button variant={"outline"} className="p-2.5 w-[137px] h-full rounded flex items-center justify-evenly  cursor-pointer bg-[#FDFDFD] shadow-inner shadow-[#F1F1F1] hover:bg-none outline-0"
            // @ts-expect-error: We are intentionally assigning a number to a string type for testing.
            disabled={Object.keys(rowSelection).filter((k) => rowSelection[k]).length === 0}
              onClick={() => {
                // @ts-expect-error: We are intentionally assigning a number to a string type for testing.
                setData((prev) =>prev.filter((row,i) => !rowSelection[i])
                );
                setRowSelection({});
              }}
            >
              <span className="text-[#959595] text-sm w-[93px] h-[19px]">Export</span>
              <Download size={14} className="text-[#959595] cursor-pointer" />
            </Button>
            </span>
          </div>
        </div>
        {isFetching ? (<Spinner/>):(
                  <DataTable columns={columns} data={currentItems} rowSelection={rowSelection}
                  onRowSelectionChange={setRowSelection}
                  globalFilter={searchValue}
                  onGlobalFilterChange={setSearchValue} />
        )}

        
        {/* Pagination */}
        {tableData.length > 0 && calculatedTotalPages > 1 && (
          <Pagination className="justify-end mt-5 cursor-pointer">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={prevPage}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>

              {generatePaginationItems()}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={nextPage}
                  className={currentPage === calculatedTotalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </AdminRootLayout>
  )
}

export default PaymentsPage
