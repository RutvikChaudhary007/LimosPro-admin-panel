import { ChevronDown, Download } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PageTitle from "@/components/common/PageTitle";
import Header from "@/components/layouts/BreadCramb";
import {
  getRefundRequest,
  getStatusColor,
  type TRefundRequest,
} from "@/components/table/column";
import { DataTable } from "@/components/table/data-table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Label } from "@/components/ui/label";
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

const showStatus = [
  { label: "Select Status", value: "" },
  { label: "InProgress", value: "in-progress" },
  { label: "Pending", value: "pending" },
  { label: "Failed", value: "failed" },
  { label: "Completed", value: "completed" },
  { label: "Refunded", value: "refunded" },
];

const showOptions = [
  { label: "Show 10", value: 10 },
  { label: "Show 15", value: 15 },
  { label: "Show 20", value: 20 },
  { label: "Show 25", value: 25 },
];

interface IModalData {
  user: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  chauffeur: string;
}
const tableData: TRefundRequest[] = [
  {
    id: "801c9f7e-7dfa-4f97-9664-912fe821db19",
    Status: "Pending",
    Amount: "1879",
    RefundId: "AA57329144",
    PassengerName: "Chris Johnson",
    PaymentId: "TRXPAY000111",
  },
  {
    id: "801c9f7e-7dfa-4f97-a664-912fe821db1b",
    Status: "InProgress",
    Amount: "1879",
    RefundId: "AA57329144",
    PassengerName: "Jane Smith",
    PaymentId: "SAMPLEPAY123",
  },
];

const RefundRequestPage = () => {
  const perPage = 10;
  const [selectedStatus, setSelectedStatus] = useState(showStatus[0]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(showOptions[0]);
  const [data] = useState<TRefundRequest[]>(tableData);
  const [modalData, setModalData] = useState<IModalData>({
    user: {
      firstName: "John",
      lastName: "Doe",
      email: "email@gmail.com",
      phone: "+1-424-231-6789",
    },
    chauffeur: "jdkfsalds",
  });
  const { currentPage, setPage, totalPages, currentItems } =
    usePagination<TRefundRequest>(data, 1, perPage);

  const handleView = useCallback((id: string) => {
    console.log("view:", id);

    setModalData({
      user: {
        firstName: "John",
        lastName: "Doe",
        email: "email@gmail.com",
        phone: "+1-424-231-6789",
      },
      chauffeur: "jdkfsalds",
    });
    setIsOpen(true);
  }, []);
  const columns = useMemo(() => getRefundRequest(handleView), [handleView]);
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});

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
      <PageTitle title={generatePageTitle("Refund Request")} />
      <div className="p-6 space-y-6 md:p-8 md:space-y-8">
        <Header className="p-4 h-[79px] bg-[#FDFDFD] shadow-base-light">
          <div className="w-full h-full flex items-center justify-between">
            <div>
              <h2 className="font-medium text-xl text-black">Refund Request</h2>
              <h4>
                {" "}
                <span className="text-[#515151] w-[116px] h-4 text-xs">
                  LIMOSPRO
                </span>{" "}
                <span className="text-xs text-[#939393] w-[50px] h-4">
                  / Refund Request
                </span>
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="secondary"
                  className={`w-[180px] h-[39px] flex items-center justify-between rounded shadow-inner shadow-[#F1F1F1] cursor-pointer `}
                >
                  {selectedStatus.label} <ChevronDown className="ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56 bg-[#FDFDFD] shadow-inner shadow-[#F1F1F1] cursor-pointer"
                align="start"
              >
                <DropdownMenuGroup>
                  {showStatus.map((option) => (
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
              className={`${
                Object.keys(rowSelection).filter((k) => rowSelection[k])
                  .length === 0
                  ? "cursor-no-drop"
                  : "cursor-pointer"
              }`}
            >
              <Button
                variant={"secondary"}
                className="p-2.5 w-[137px] h-full rounded flex items-center justify-evenly  cursor-pointer bg-[#FDFDFD] shadow-inner shadow-[#F1F1F1] hover:bg-none outline-0"
                disabled={
                  Object.keys(rowSelection).filter((k) => rowSelection[k])
                    .length === 0
                }
                onClick={() => {
                  // setData((prev) =>prev.filter((row,i) => !rowSelection[i])
                  // );
                  // setRowSelection({});
                }}
              >
                <span className="text-[#959595] text-sm w-[93px] h-[19px]">
                  Export
                </span>
                <Download size={14} className="text-[#959595] cursor-pointer" />
              </Button>
            </span>
          </div>
        </div>
        <DataTable
          columns={columns}
          data={currentItems}
          rowSelection={rowSelection}
          onRowSelectionChange={setRowSelection}
        />

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="overflow-y-scroll min-w-[640px] max-h-screen">
            <DialogHeader>
              <div className="w-full h-full space-y-6 ">
                <div className="flex items-center justify-between">
                  <DialogTitle>
                    <h4 className="font-semibold text-xl text-[#000000]">
                      Booking Id: TRXPAY000111
                    </h4>
                    <h5 className="text-[#5A5A5A] font-semibold">
                      Created on: 03-21-2025 at 05:30 PM
                    </h5>
                  </DialogTitle>
                </div>
              </div>
            </DialogHeader>

            <hr className="w-full h-[1px] bg-[#EEEEEE]" />
            <div className="w-full h-full space-y-4">
              <h6 className="text-sm text-[#5A5A5A] h-[19px] w-full">
                Passenger
              </h6>
              <div className="flex items-center gap-6">
                <Label className="min-w-[153px] text-sm font-semibold capitalize">
                  Name:
                </Label>
                <span className="text-[#3A3A3A] font-medium">
                  {modalData?.user.firstName} {modalData?.user.lastName}
                </span>
              </div>
              <div className="flex items-center gap-6">
                <Label className="min-w-[153px] text-sm font-semibold capitalize">
                  Email:
                </Label>
                <span className="text-[#3A3A3A] font-medium">
                  name@email.com
                </span>
              </div>
              <div className="flex items-center gap-6">
                <Label className="min-w-[153px] text-sm font-semibold capitalize">
                  phone:
                </Label>
                <span className="text-[#3A3A3A] font-medium">
                  +1-424-231-6798
                </span>
              </div>
              <div className="flex items-center gap-6">
                <Label className="min-w-[153px] text-sm font-semibold capitalize">
                  Booking ID:
                </Label>
                <span className="text-[#3A3A3A] font-medium">AA57329144</span>
              </div>
              <hr className="w-full h-[1px] bg-[#EEEEEE]" />
              <h6 className="text-sm text-[#5A5A5A] h-[19px] w-full">
                Car and Chauffeur
              </h6>

              <div className="flex items-center gap-6">
                <Label className="min-w-[153px] text-sm font-semibold capitalize">
                  Car Name::
                </Label>
                <span className="text-[#3A3A3A] font-medium">
                  Executive luxury Van (Minibus) Mercedes Benz Sprinter, Or
                  Similar.
                </span>
              </div>
              <div className="flex items-center gap-6">
                <Label className="min-w-[153px] text-sm font-semibold capitalize">
                  Chauffeur:
                </Label>
                <Link
                  to={`${constant.ROUTING_URLS.VIEW_CHAUFFEUR.replace(":id", modalData?.chauffeur)}`}
                  className="underline"
                >
                  <span className="text-[#3A3A3A] font-medium">
                    David Thompson
                  </span>
                </Link>
              </div>
              <hr className="w-full h-[1px] bg-[#EEEEEE]" />
              <h6 className="text-sm text-[#5A5A5A] h-[19px] w-full">Ride</h6>
              <div className="flex items-center gap-6">
                <Label className="min-w-[153px] text-sm font-semibold capitalize">
                  Status:
                </Label>
                <span
                  className={`text-[#3A3A3A] font-medium ${getStatusColor("Completed")} px-2 py-0.5 rounded`}
                >
                  Completed
                </span>
              </div>
              <div className="flex items-center gap-6">
                <Label className="min-w-[153px] text-sm font-semibold capitalize">
                  type:
                </Label>
                <span className="text-[#3A3A3A] font-medium">
                  Airport Transfer
                </span>
              </div>
              <div className="flex items-center gap-6">
                <Label className="min-w-[153px] text-sm font-semibold capitalize">
                  From:
                </Label>
                <span className="text-[#3A3A3A] font-medium">
                  Houston Airport Marriott at George Bush Intercontinental, John
                  F Kennedy Boulevard, Houston, TX, USA
                </span>
              </div>
              <div className="flex items-center gap-6">
                <Label className="min-w-[153px] text-sm font-semibold capitalize">
                  To:
                </Label>
                <span className="text-[#3A3A3A] font-medium">
                  Royal Caribbean International-Cruise Terminal 2, Harborside
                  Drive, Galveston, TX, USA
                </span>
              </div>
              <div className="flex items-center gap-6">
                <Label className="min-w-[153px] text-sm font-semibold capitalize">
                  Total Price:
                </Label>
                <span className="text-[#3A3A3A] font-medium">$1879</span>
              </div>
              <div className="flex items-center gap-6">
                <Label className="min-w-[153px] text-sm font-semibold capitalize">
                  Refund Price:
                </Label>
                <span className="text-[#3A3A3A] font-medium">$1879</span>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Pagination */}
        {tableData.length > 0 && calculatedTotalPages > 1 && (
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

export default RefundRequestPage;
