// @ts-nocheck

import { ChevronDown, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import useFetchALLIPWhiteLists from "@/api/ipWhiteList.api";
import BulkDeleteBtn from "@/components/bulkDeleteBtn/BulkDeleteBtn";
import { ErrorCard } from "@/components/common/ErrorCard";
import PageTitle from "@/components/common/PageTitle";
import Header from "@/components/layouts/BreadCramb";
import { Spinner } from "@/components/Spinner";
import { getIpWhiteList, type TIpWhiteList } from "@/components/table/column";
import { DataTable } from "@/components/table/data-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
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
import { toastPromise } from "@/hooks/use-toast";
import { constant } from "@/lib/constant";
import queries from "@/lib/queries";
import { generatePageTitle } from "@/utils/seo";

const showOptions = [
  { value: 10, label: "Show 10" },
  { value: 20, label: "Show 20" },
  { value: 30, label: "Show 30" },
];

const _tableData: TIpWhiteList[] = [
  {
    id: "1",
    ip: "127.0.0.1",
    name: "Localhost",
  },
  {
    id: "2",
    ip: "127.0.0.2",
    name: "Localhost2",
  },
  {
    id: "3",
    ip: "127.0.0.2",
    name: "Localhost2",
  },
  {
    id: "4",
    ip: "127.0.0.2",
    name: "Localhost2",
  },
  {
    id: "5",
    ip: "127.0.0.2",
    name: "Localhost2",
  },
  {
    id: "6",
    ip: "127.0.0.2",
    name: "Localhost2",
  },
  {
    id: "7",
    ip: "127.0.0.2",
    name: "Localhost2",
  },
  {
    id: "8",
    ip: "127.0.0.2",
    name: "Localhost2",
  },
  {
    id: "9",
    ip: "127.0.0.2",
    name: "Localhost2",
  },
  {
    id: "10",
    ip: "127.0.0.2",
    name: "Localhost2",
  },
  {
    id: "11",
    ip: "127.0.0.2",
    name: "Localhost2",
  },
  {
    id: "12",
    ip: "127.0.0.2",
    name: "Localhost2",
  },
  {
    id: "13",
    ip: "127.0.0.2",
    name: "Localhost2",
  },
  {
    id: "14",
    ip: "127.0.0.2",
    name: "Localhost2",
  },
  {
    id: "15",
    ip: "127.0.0.2",
    name: "Localhost2",
  },
  {
    id: "16",
    ip: "127.0.0.2",
    name: "Localhost2",
  },
  {
    id: "17",
    ip: "127.0.0.2",
    name: "Localhost2",
  },
  {
    id: "18",
    ip: "127.0.0.2",
    name: "Localhost2",
  },
  {
    id: "19",
    ip: "127.0.0.2",
    name: "Localhost2",
  },
  {
    id: "20",
    ip: "127.0.0.2",
    name: "Localhost2",
  },
  {
    id: "19",
    ip: "127.0.0.2",
    name: "Localhost2",
  },
  {
    id: "21",
    ip: "127.0.0.2",
    name: "Localhost2",
  },
  {
    id: "22",
    ip: "127.0.0.2",
    name: "Localhost2",
  },
  {
    id: "23",
    ip: "127.0.0.2",
    name: "Localhost2",
  },
  {
    id: "24",
    ip: "127.0.0.2",
    name: "Localhost2",
  },
  {
    id: "25",
    ip: "127.0.0.2",
    name: "Localhost2",
  },
  {
    id: "26",
    ip: "127.0.0.2",
    name: "Localhost2",
  },
  {
    id: "27",
    ip: "127.0.0.2",
    name: "Localhost2",
  },
  {
    id: "28",
    ip: "127.0.0.2",
    name: "Localhost2",
  },
  {
    id: "29",
    ip: "127.0.0.2",
    name: "Localhost2",
  },
  {
    id: "30",
    ip: "127.0.0.2",
    name: "Localhost2",
  },
  {
    id: "31",
    ip: "127.0.0.1",
    name: "Localhost",
  },
  {
    id: "32",
    ip: "127.0.0.2",
    name: "Localhost2",
  },
  {
    id: "33",
    ip: "127.0.0.2",
    name: "Localhost2",
  },
  {
    id: "34",
    ip: "127.0.0.2",
    name: "Localhost2",
  },
  {
    id: "35",
    ip: "127.0.0.2",
    name: "Localhost2",
  },
  {
    id: "36",
    ip: "127.0.0.2",
    name: "Localhost2",
  },
  {
    id: "37",
    ip: "127.0.0.2",
    name: "Localhost2",
  },
  {
    id: "38",
    ip: "127.0.0.2",
    name: "Localhost2",
  },
  {
    id: "39",
    ip: "127.0.0.2",
    name: "Localhost2",
  },
  {
    id: "40",
    ip: "127.0.0.2",
    name: "Localhost2",
  },
  {
    id: "41",
    ip: "127.0.0.1",
    name: "Localhost",
  },
  {
    id: "42",
    ip: "127.0.0.2",
    name: "Localhost2",
  },
  {
    id: "43",
    ip: "127.0.0.2",
    name: "Localhost2",
  },
  {
    id: "44",
    ip: "127.0.0.2",
    name: "Localhost2",
  },
  {
    id: "45",
    ip: "127.0.0.2",
    name: "Localhost2",
  },
  {
    id: "46",
    ip: "127.0.0.2",
    name: "Localhost2",
  },
  {
    id: "47",
    ip: "127.0.0.2",
    name: "Localhost2",
  },
  {
    id: "48",
    ip: "127.0.0.2",
    name: "Localhost2",
  },
  {
    id: "49",
    ip: "127.0.0.2",
    name: "Localhost2",
  },
  {
    id: "50",
    ip: "127.0.0.2",
    name: "Localhost2",
  },
];
const IpWhiteListPage = () => {
  const navigate = useNavigate();
  const [tableRef, setTableRef] = useState<any>(null);
  const [perPage, setPerPage] = useState(10);
  const [selected, setSelected] = useState(showOptions[0]);
  // const [data, setData] = useState<TIpWhiteList[]>(tableData);
  const { data, refetch, isFetching, isError } = useFetchALLIPWhiteLists(perPage);

  const { currentPage, setPage, totalPages, currentItems } = usePagination<TIpWhiteList>(
    data?.items,
    1,
    perPage,
    data?.pagination,
  );
  // console.log("tableData:",tableData.length)
  useEffect(() => {
    setPerPage(selected.value);
  }, [selected]);
  const handleEdit = (id: string) => {
    console.log("Edit:", id);
    navigate(constant.ROUTING_URLS.EDIT_IP_WHITE_LIST.replace(":id", id));
  };
  const deleteIPWhiteListMutation = queries.useDeleteIPWhiteListMutation();
  const bulkDeleteIPWhiteListMutation = queries.useBulkDeleteIPWhiteListMutation();
  const handleDelete = (id: string) => {
    try {
      toastPromise(deleteIPWhiteListMutation.mutateAsync(id), {
        loading: "Deleting IP White List...",
        success: (res) => {
          if (res) refetch();
          return "Yeah! IP White List deleted successfully.";
        },
        error: (e) => (e instanceof Error ? e.message : "Failed to delete IP White List."),
      });
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred.");
      }
    }
  };
  const columns = getIpWhiteList(handleEdit, handleDelete);

  const [searchValue, setSearchValue] = useState("");
  const [rowSelection, setRowSelection] = useState({});
  // Number of pages based on filtered data
  const calculatedTotalPages = Math.max(1, totalPages);

  // Handle page change
  const handlePageChange = (newPage: number) => {
    console.log("newPage:", newPage);
    setPage(newPage);
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
          {currentPage}
          {totalPages - 2}
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
      <PageTitle title={generatePageTitle("Ip WhiteList")} />
      <div className="p-6 space-y-6 md:p-8 md:space-y-8">
        <Header className="p-4 h-[79px] bg-[#FDFDFD] shadow-base-light">
          <div className="w-full h-full flex items-center justify-between">
            <div>
              <h2 className="font-medium text-xl text-black">IP White List</h2>
              <h4>
                <span className="text-[#959595] w-14 h-4">LIMOSPRO</span>{" "}
                <span className="text-[#959595] w-[116px] h-4">/ IP White List</span>
              </h4>
            </div>
            <Link to={constant.ROUTING_URLS.CREATE_IP_WHITE_LIST}>
              {" "}
              <Button variant={"secondary"} className="cursor-pointer bg-[#E4E4E4] flex items-center rounded">
                <Plus className="text-[#515151]" />
                <span className="text-[#515151] font-medium text-sm">Add IP</span>
              </Button>
            </Link>
          </div>
        </Header>

        <div className="flex justify-between">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="secondary"
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
              <BulkDeleteBtn
                rowSelection={rowSelection}
                tableRef={tableRef}
                bulkDeleteMutation={bulkDeleteIPWhiteListMutation}
                refetch={refetch}
                setRowSelection={setRowSelection}
                title="Ip WhiteLists"
                descTitle="ip whiteLists"
              />
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
            onTableReady={setTableRef}
            onRowSelectionChange={setRowSelection}
            globalFilter={searchValue}
            onGlobalFilterChange={setSearchValue}
          />
        )}

        {/* Pagination */}
        {totalPages > 0 && calculatedTotalPages > 1 && (
          <Pagination className="justify-end mt-5 cursor-pointer">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  // href={"?page="+currentPage}
                  onClick={() => handlePageChange(currentPage - 1)}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>

              {generatePaginationItems()}

              <PaginationItem>
                <PaginationNext
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

export default IpWhiteListPage;
