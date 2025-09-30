// @ts-nocheck
import useFetchAllStaffMember from "@/api/getAllCrewMember";
import { Spinner } from "@/components/Spinner";
import AdminRootLayout from "@/components/layouts/AdminRootLayout";
import Header from "@/components/layouts/Header";
import { getCrewMember, type TCrewMember } from "@/components/table/column";
import { DataTable } from "@/components/table/data-table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import usePagination from "@/hooks/use-pagination";
import { constant } from "@/lib/constant";
import { ChevronDown, Plus, Trash2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const showOptions = [
  { value: 10, label: "Show 10" },
  { value: 20, label: "Show 20" },
  { value: 30, label: "Show 30" },
];


const tableData: TCrewMember [] = [
  { id: "1", name: "Chris Johnson", designation: "USA Regional Sales Manager", email: "name@email.com", phone: "+1-624-231-6798", },
  { id: "2", name: "Ovi Smith", designation: "Administrative Assistant", email: "name@email.com", phone: "+1-624-231-6798",},
  { id: "3", name: "June Parker", designation: "Quality Assurance Officer", email: "name@email.com", phone: "+1-624-231-6798",},
  { id: "4", name: "Casey Walker", designation: "Booking Agent", email: "name@email.com", phone: "+1-624-231-6798",},
  { id: "5", name: "Jordon Lee", designation: "Driver Relations Manager", email: "name@email.com", phone: "+1-624-231-6798",},
  { id: "6", name: "Taylor Morgan", designation: "Fleet Supervisor", email: "name@email.com", phone: "+1-624-231-6798",},
  { id: "7", name: "Sam Patel", designation: "Dispatcher", email: "name@email.com", phone: "+1-624-231-6798",},
  { id: "8", name: "Chris Johnson", designation: "Sales Representative", email: "name@email.com", phone: "+1-624-231-6798",},
  { id: "9", name: "Ovi Smith", designation: "Operations Manager", email: "name@email.com", phone: "+1-624-231-6798",},
  { id: "10", name: "June Parker", designation: "Sales Representative", email: "name@email.com", phone: "+1-624-231-6798",},
  { id: "11", name: "Casey Walker", designation: "Dispatcher", email: "name@email.com", phone: "+1-624-231-6798",},
  { id: "12", name: "Jordon Lee", designation: "Fleet Supervisor", email: "name@email.com", phone: "+1-624-231-6798",},
  { id: "13", name: "Taylor Morgan", designation: "Driver Relations Manager", email: "name@email.com", phone: "+1-624-231-6798",},
  { id: "14", name: "Sam Patel", designation: "Booking Agent", email: "name@email.com", phone: "+1-624-231-6798",},
  { id: "15", name: "Chris Johnson", designation: "Quality Assurance Officer", email: "name@email.com", phone: "+1-624-231-6798",},
  { id: "16", name: "Ovi Smith", designation: "Administrative Assistant", email: "name@email.com", phone: "+1-624-231-6798",},
  { id: "17", name: "June Parker", designation: "Booking Agent", email: "name@email.com", phone: "+1-624-231-6798",},
  { id: "18", name: "Casey Walker", designation: "", email: "name@email.com", phone: "+1-624-231-6798",},
  { id: "19", name: "Jordon Lee", designation: "", email: "name@email.com", phone: "+1-624-231-6798", },
  { id: "20", name: "Taylor Morgan", designation: "", email: "name@email.com", phone: "+1-624-231-6798",},
  { id: "21", name: "Sam Patel", designation: "",email: "name@email.com", phone: "+1-624-231-6798", },
  { id: "22", name: "Chris Johnson", designation: "",email: "name@email.com", phone: "+1-624-231-6798", },
  { id: "23", name: "Ovi Smith", designation: "",email: "name@email.com", phone: "+1-624-231-6798", },
  { id: "24", name: "June Parker", designation: "", email: "name@email.com", phone: "+1-624-231-6798",},
  { id: "25", name: "Casey Walker", designation: "", email: "name@email.com", phone: "+1-624-231-6798",},
  { id: "26", name: "Jordon Lee", designation: "", email: "name@email.com", phone: "+1-624-231-6798",},
  { id: "27", name: "Taylor Morgan", designation: "",email: "name@email.com", phone: "+1-624-231-6798", },
  { id: "28", name: "Sam Patel", designation: "",email: "name@email.com", phone: "+1-624-231-6798", },
  { id: "29", name: "Sam Patel", designation: "",email: "name@email.com", phone: "+1-624-231-6798", },
  { id: "30", name: "Sam Patel", designation: "", email: "name@email.com", phone: "+1-624-231-6798",},
  { id: "31", name: "Sam Patel", designation: "", email: "name@email.com", phone: "+1-624-231-6798",},
  { id: "32", name: "Chris Johnson", designation: "", email: "name@email.com", phone: "+1-624-231-6798",},
  { id: "33", name: "Ovi Smith", designation: "", email: "name@email.com", phone: "+1-624-231-6798",},
  { id: "34", name: "June Parker", designation: "", email: "name@email.com", phone: "+1-624-231-6798",},
  { id: "35", name: "Casey Walker", designation: "",email: "name@email.com", phone: "+1-624-231-6798", },
  { id: "36", name: "Jordon Lee", designation: "", email: "name@email.com", phone: "+1-624-231-6798",},
  { id: "37", name: "Taylor Morgan", designation: "", email: "name@email.com", phone: "+1-624-231-6798",},
  { id: "38", name: "Sam Patel", designation: "",email: "name@email.com", phone: "+1-624-231-6798", },
  { id: "39", name: "Sam Patel", designation: "", email: "name@email.com", phone: "+1-624-231-6798",},
  { id: "40", name: "Sam Patel", designation: "", email: "name@email.com", phone: "+1-624-231-6798",},
  { id: "41", name: "Sam Patel", designation: "",email: "name@email.com", phone: "+1-624-231-6798",},
  
];


const CrewMemberPage = () => {
  const naviagte = useNavigate();
   const [newPage, setNewPage] = useState(1);
    const [selected, setSelected] = useState(showOptions[0]);
    // const [data, setData] = useState<TCrewMember[]>(tableData);
    const {data, isFetching} = useFetchAllStaffMember({page: newPage, limit: selected.value})
  
    const { currentPage, nextPage, prevPage, setPage, totalPages, currentItems } = usePagination<TCrewMember>(data?.staffMembers, newPage, selected.value);
  
    
    const handleEdit = useCallback((id: string) => { console.log("Edit:", id)
      naviagte(constant.ROUTING_URLS.EDIT_CREW_MEMBERS.replace(":id",id));
     }, []);
    const handleDelete = useCallback((id: string) => {
      setData((prev) =>
        prev.filter((row) => row.id !== id))
    }, []);
    const columns = useMemo(() => getCrewMember(handleEdit, handleDelete), [handleDelete, handleEdit])
  
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
                <h2 className="font-medium text-xl text-black">Crew Member</h2>
                <h4><span className="text-[#959595] w-14 h-4">LIMOSPRO</span> <span className="text-[#959595] w-[116px] h-4">/ Crew Member</span></h4>
              </div>
              <Link to={constant.ROUTING_URLS.CREATE_CREW_MEMBERS}>  <Button variant={"outline"} className="cursor-pointer bg-[#E4E4E4] flex items-center rounded">
                <Plus className="text-[#515151]" />
                <span className="text-[#515151] font-medium text-sm">Add a Crew Member</span>
              </Button>
              </Link>
            </div>
          </Header>
  
          <div className="flex justify-between">
            <DropdownMenu >
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-56 h-10 flex items-center justify-between rounded mt-5 shadow-inner shadow-[#F1F1F1] bg-[#FDFDFD] cursor-pointer">
                  {selected.label} <ChevronDown className="ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-[#FDFDFD] shadow-inner shadow-[#F1F1F1] cursor-pointer" align="start">
                <DropdownMenuGroup>
                  {showOptions.map(option => (
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
              <span className={`${Object.keys(rowSelection).filter((k) => rowSelection[k]).length === 0?"cursor-no-drop":"cursor-pointer"}`}>
              <Button variant={"outline"} className="p-2.5 w-[137px] h-full rounded flex items-center justify-evenly  cursor-pointer bg-[#FDFDFD] shadow-inner shadow-[#F1F1F1] hover:bg-none outline-0"
                disabled={Object.keys(rowSelection).filter((k) => rowSelection[k]).length === 0}
                onClick={() => {
                  setData((prev) =>
                    prev.filter((row,i) => !rowSelection[i])
                  );
                //   console.log("data:", data);
                //   console.log("rowSelection:", rowSelection);
                  setRowSelection({});
                }}
              >
                <span className="text-[#959595] text-sm w-[93px] h-[19px]">Delete</span>
                <Trash2 size={14} className="text-[#959595] cursor-pointer" />
              </Button>
              </span>
              <div className="p-2.5 w-[220px] h-full flex items-center focus-visible:border-none focus-visible:outline-none"><Input type="search" placeholder="search" className="text-[#959595]"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)} /></div>
            </div>
          </div>
          {isFetching? (<Spinner/>):(
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

export default CrewMemberPage
