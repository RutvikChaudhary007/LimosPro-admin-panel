// @ts-nocheck
import UsefetchAllFleets from "@/api/getAllFleets";
import AdminRootLayout from "@/components/layouts/AdminRootLayout"
import Header from "@/components/layouts/Header";
import { getFleets, type TFleet } from "@/components/table/column";
import { DataTable } from "@/components/table/data-table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import usePagination from "@/hooks/use-pagination";
import { constant } from "@/lib/constant";
import { ChevronDown, Plus, Trash2 } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const showTime = [
  { label: 'All Time', value: '' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Monthly', value: 'monthly' },
  { label: 'Yearly', value: 'yearly' },
]

const tableData: TFleet[] = [
    {
        "id": "3959bb6d-8782-41db-9365-ff7876e88131",
        "affiliateId": "d194f9aa-8bee-4c36-9d50-c2df01882efe",
        "plateNumber": "AB-123-CDa",
        "brand": "Mercedes-S-classa",
        "model": "2024",
        "year": 2025,
        "color": "black",
        "vehicleType": "Executive Sedan Fit for 3 Passengers",
        "capacity": 3,
        "documents": [],
        "vehicleImages": [],
        "createdAt": "2025-07-15T12:43:58.461Z",
        "updatedAt": "2025-07-15T12:43:58.461Z",
        "deletedAt": null
    },
    {
        "id": "3959bb6d-8782-41db-9365-ff7876e88132",
        "affiliateId": "a194f9aa-8bee-4c36-9d50-c2df01882efe",
        "plateNumber": "BB-123-CDa",
        "brand": "Mercedes-S-classa",
        "model": "2023",
        "year": 2025,
        "color": "black",
        "vehicleType": "Executive Sedan Fit for 4 Passengers",
        "capacity": 4,
        "documents": [],
        "vehicleImages": [],
        "createdAt": "2025-07-15T12:43:58.461Z",
        "updatedAt": "2025-07-15T12:43:58.461Z",
        "deletedAt": null
    },
];
function FleetPage() {
  const navigate = useNavigate();
    const perPage = 10;

  const [selectedTime, setSelectedTime] = useState(showTime[0]);
  // const [data, setData] = useState<TFleet[]>(tableData);
  const {data, isFetching, error} = UsefetchAllFleets();
  const { currentPage, nextPage, prevPage, setPage, totalPages, currentItems } = usePagination<TFleet>(data?.vehicles, 1, perPage);


  const handleView = useCallback((id: string) => { console.log("view:", id)
    navigate(constant.ROUTING_URLS.VIEW_FLEET.replace(":id",id));
   }, []);
  const handleEdit = useCallback((id: string) => { console.log("Edit:", id)
    navigate(constant.ROUTING_URLS.EDIT_FLEET.replace(":id",id));
   }, []);
    const handleDelete = useCallback((id: string) => {
      setData((prev) => prev.filter((row) => row.id !== id));
      }, []);
  const columns = useMemo(() => getFleets(handleView,handleEdit, handleDelete),[handleView,handleEdit, handleDelete])
  const [searchValue, setSearchValue] = useState("");
  const [rowSelection, setRowSelection] = useState({});
if(isFetching) return (<p>Loading...</p>);
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
              <h2 className="font-medium text-xl text-black">Fleet</h2>
              <h4> <span className="text-[#515151] w-[116px] h-4 text-xs">LIMOSPRO</span> <span className="text-xs text-[#939393] w-[50px] h-4">/ Fleet</span></h4>
            </div>
            <Link to={constant.ROUTING_URLS.CREATE_FLEET}>  <Button variant={"outline"} className="cursor-pointer bg-[#E4E4E4] flex items-center rounded">
              <Plus className="text-[#515151]" />
              <span className="text-[#515151] font-medium text-sm">Add Fleet</span>
            </Button>
            </Link>
          </div>
        </Header>

        <div className="flex justify-between gap-2.5">
          <div className="flex items-center gap-3">
          <DropdownMenu >
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className={`w-[180px] h-[39px] flex items-center justify-between rounded mt-5 shadow-inner shadow-[#F1F1F1] cursor-pointer bg-[#FFFFFF] `}>
                {selectedTime.label} <ChevronDown className="ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-[#FDFDFD] shadow-inner shadow-[#F1F1F1] cursor-pointer" align="start">
              <DropdownMenuGroup>
                {showTime.map(option => (
                  <DropdownMenuItem
                    key={option.value}
                    className={`flex items-center justify-between cursor-pointer bg-[#FFFFFF]`}
                    onClick={() => setSelectedTime(option)}
                  >
                    {option.label} <ChevronDown className="ml-2" />
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          </div>
          <div className="w-[369px] h-[39px] mt-5 flex items-center justify-end gap-3">
            <span className={`${Object.keys(rowSelection).filter((k) => rowSelection[k]).length === 0?"cursor-no-drop":"cursor-pointer"}`}>
            <Button variant={"outline"} className="p-2.5 w-[137px] h-full rounded flex items-center justify-evenly  cursor-pointer bg-[#FDFDFD] shadow-inner shadow-[#F1F1F1] hover:bg-none outline-0"
            disabled={Object.keys(rowSelection).filter((k) => rowSelection[k]).length === 0}
              onClick={() => {
                setData((prev) =>prev.filter((row,i) => !rowSelection[i])
                );
                setRowSelection({});
              }}
            >
              <span className="text-[#959595] text-sm w-[93px] h-[19px]">Delete</span>
              <Trash2 size={14} className="text-[#959595] cursor-pointer" />
            </Button>
            </span>
            <div className="p-2.5 w-[220px] h-full flex items-center focus-visible:border-none focus-visible:outline-none"><Input type="search" placeholder="search" className="text-[#959595]" 
            value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            /></div>
          </div>
        </div>
        <DataTable columns={columns} data={currentItems} rowSelection={rowSelection}
          onRowSelectionChange={setRowSelection}
          globalFilter={searchValue}
          onGlobalFilterChange={setSearchValue} />
        
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

export default FleetPage
