// @ts-nocheck

import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import { ChevronDown, Trash2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import useFetchAllContactRequest from "@/api/contactRequest.api";
import ReplyFC from "@/components/ContactRequests/ReplyFC";
import ViewModal from "@/components/ContactRequests/ViewModal";
import PageTitle from "@/components/common/PageTitle";
import Header from "@/components/layouts/BreadCramb";
import { Spinner } from "@/components/Spinner";
import {
  getContactRequest,
  type TContactRequest,
} from "@/components/table/column";
import { DataTable } from "@/components/table/data-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
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
import { generatePageTitle } from "@/utils/seo";

const showOptions = [
  { value: 10, label: "Show 10" },
  { value: 20, label: "Show 20" },
  { value: 30, label: "Show 30" },
];

const _tableData: TContactRequest[] = [
  {
    id: "1",
    message: "USA Regional Sales Manager",
    email: "name@email.com",
    phone: "+1-624-231-6798",
  },
  {
    id: "2",
    message: "Administrative Assistant",
    email: "name@email.com",
    phone: "+1-624-231-6798",
  },
  {
    id: "3",
    name: "June Parker",
    message: "Quality Assurance Officer",
    email: "name@email.com",
    phone: "+1-624-231-6798",
  },
  {
    id: "4",
    name: "Casey Walker",
    message: "Booking Agent",
    email: "name@email.com",
    phone: "+1-624-231-6798",
  },
  {
    id: "5",
    name: "Jordon Lee",
    message: "Driver Relations Manager",
    email: "name@email.com",
    phone: "+1-624-231-6798",
  },
  {
    id: "6",
    name: "Taylor Morgan",
    message: "Fleet Supervisor",
    email: "name@email.com",
    phone: "+1-624-231-6798",
  },
  {
    id: "7",
    name: "Sam Patel",
    message: "Dispatcher",
    email: "name@email.com",
    phone: "+1-624-231-6798",
  },
  {
    id: "8",
    name: "Chris Johnson",
    message: "Sales Representative",
    email: "name@email.com",
    phone: "+1-624-231-6798",
  },
  {
    id: "9",
    name: "Ovi Smith",
    message: "Operations Manager",
    email: "name@email.com",
    phone: "+1-624-231-6798",
  },
  {
    id: "10",
    name: "June Parker",
    message: "Sales Representative",
    email: "name@email.com",
    phone: "+1-624-231-6798",
  },
  {
    id: "11",
    name: "Casey Walker",
    message: "Dispatcher",
    email: "name@email.com",
    phone: "+1-624-231-6798",
  },
  {
    id: "12",
    name: "Jordon Lee",
    message: "Fleet Supervisor",
    email: "name@email.com",
    phone: "+1-624-231-6798",
  },
  {
    id: "13",
    name: "Taylor Morgan",
    message: "Driver Relations Manager",
    email: "name@email.com",
    phone: "+1-624-231-6798",
  },
  {
    id: "14",
    name: "Sam Patel",
    message: "Booking Agent",
    email: "name@email.com",
    phone: "+1-624-231-6798",
  },
  {
    id: "15",
    name: "Chris Johnson",
    message: "Quality Assurance Officer",
    email: "name@email.com",
    phone: "+1-624-231-6798",
  },
  {
    id: "16",
    name: "Ovi Smith",
    message: "Administrative Assistant",
    email: "name@email.com",
    phone: "+1-624-231-6798",
  },
  {
    id: "17",
    name: "June Parker",
    message: "Booking Agent",
    email: "name@email.com",
    phone: "+1-624-231-6798",
  },
  {
    id: "18",
    name: "Casey Walker",
    message: "",
    email: "name@email.com",
    phone: "+1-624-231-6798",
  },
  {
    id: "19",
    name: "Jordon Lee",
    message: "",
    email: "name@email.com",
    phone: "+1-624-231-6798",
  },
  {
    id: "20",
    name: "Taylor Morgan",
    message: "",
    email: "name@email.com",
    phone: "+1-624-231-6798",
  },
  {
    id: "21",
    name: "Sam Patel",
    message: "",
    email: "name@email.com",
    phone: "+1-624-231-6798",
  },
  {
    id: "22",
    name: "Chris Johnson",
    message: "",
    email: "name@email.com",
    phone: "+1-624-231-6798",
  },
  {
    id: "23",
    name: "Ovi Smith",
    message: "",
    email: "name@email.com",
    phone: "+1-624-231-6798",
  },
  {
    id: "24",
    name: "June Parker",
    message: "",
    email: "name@email.com",
    phone: "+1-624-231-6798",
  },
  {
    id: "25",
    name: "Casey Walker",
    message: "",
    email: "name@email.com",
    phone: "+1-624-231-6798",
  },
  {
    id: "26",
    name: "Jordon Lee",
    message: "",
    email: "name@email.com",
    phone: "+1-624-231-6798",
  },
  {
    id: "27",
    name: "Taylor Morgan",
    message: "",
    email: "name@email.com",
    phone: "+1-624-231-6798",
  },
  {
    id: "28",
    name: "Sam Patel",
    message: "",
    email: "name@email.com",
    phone: "+1-624-231-6798",
  },
  {
    id: "29",
    name: "Sam Patel",
    message: "",
    email: "name@email.com",
    phone: "+1-624-231-6798",
  },
  {
    id: "30",
    name: "Sam Patel",
    message: "",
    email: "name@email.com",
    phone: "+1-624-231-6798",
  },
  {
    id: "31",
    name: "Sam Patel",
    message: "",
    email: "name@email.com",
    phone: "+1-624-231-6798",
  },
  {
    id: "32",
    name: "Chris Johnson",
    message: "",
    email: "name@email.com",
    phone: "+1-624-231-6798",
  },
  {
    id: "33",
    name: "Ovi Smith",
    message: "",
    email: "name@email.com",
    phone: "+1-624-231-6798",
  },
  {
    id: "34",
    name: "June Parker",
    message: "",
    email: "name@email.com",
    phone: "+1-624-231-6798",
  },
  {
    id: "35",
    name: "Casey Walker",
    message: "",
    email: "name@email.com",
    phone: "+1-624-231-6798",
  },
  {
    id: "36",
    name: "Jordon Lee",
    message: "",
    email: "name@email.com",
    phone: "+1-624-231-6798",
  },
  {
    id: "37",
    name: "Taylor Morgan",
    message: "",
    email: "name@email.com",
    phone: "+1-624-231-6798",
  },
  {
    id: "38",
    name: "Sam Patel",
    message: "",
    email: "name@email.com",
    phone: "+1-624-231-6798",
  },
  {
    id: "39",
    name: "Sam Patel",
    message: "",
    email: "name@email.com",
    phone: "+1-624-231-6798",
  },
  {
    id: "40",
    name: "Sam Patel",
    message: "",
    email: "name@email.com",
    phone: "+1-624-231-6798",
  },
  {
    id: "41",
    name: "Sam Patel",
    message: "",
    email: "name@email.com",
    phone: "+1-624-231-6798",
  },
];

const ContactRequestsPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isModal, setIsModal] = useState(false);
  const [perPage, setPerPage] = useState(10);
  const [msgId, setMsgId] = useState<string | null>(null);
  const [selected, setSelected] = useState(showOptions[0]);
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
    setPerPage(selected.value);
  }, [selected]);
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
        <Header className="p-4 h-[79px] bg-[#FDFDFD] shadow-base-light">
          <div className="w-full h-full flex items-center justify-between">
            <div>
              <h2 className="font-medium text-xl text-black">
                Contact Requests
              </h2>
              <h4>
                <span className="text-[#959595] w-14 h-4">LIMOSPRO</span>{" "}
                <span className="text-[#959595] w-[116px] h-4">
                  / Contact Requests
                </span>
              </h4>
            </div>
          </div>
        </Header>

        <div className="flex justify-between">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="w-56 h-10 flex items-center justify-between rounded mt-5 shadow-inner shadow-[#F1F1F1] bg-[#FDFDFD] cursor-pointer"
              >
                {selected.label} <ChevronDown className="ml-2" />
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
                    className="flex items-center justify-between hover:bg-[#F1F1F1]"
                    onClick={() => setSelected(option)}
                  >
                    {option.label} <ChevronDown className="ml-2" />
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="w-[369px] h-[39px] mt-5 flex items-center justify-between gap-3">
            <span
              className={`${Object.keys(rowSelection).filter((k) => rowSelection[k]).length === 0 ? "cursor-no-drop" : "cursor-pointer"}`}
            >
              <Button
                variant={"outline"}
                className="p-2.5 w-[137px] h-full rounded flex items-center justify-evenly  cursor-pointer bg-[#FDFDFD] shadow-inner shadow-[#F1F1F1] hover:bg-none outline-0"
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
                <span className="text-[#959595] text-sm w-[93px] h-[19px]">
                  Delete
                </span>
                <Trash2 size={14} className="text-[#959595] cursor-pointer" />
              </Button>
            </span>
            <div className="p-2.5 w-[220px] h-full flex items-center focus-visible:border-none focus-visible:outline-none">
              <Input
                type="search"
                placeholder="search"
                className="text-[#959595]"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
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
