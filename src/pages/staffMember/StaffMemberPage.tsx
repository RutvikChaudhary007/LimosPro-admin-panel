import useFetchAllStaffMember from "@/api/staffMember.api";
import BulkDeleteBtn from "@/components/bulkDeleteBtn/BulkDeleteBtn";
import AdminRootLayout from "@/components/layouts/AdminRootLayout";
import Header from "@/components/layouts/Header";
import { Spinner } from "@/components/Spinner";
import { getStaffMember, type TStaffMember } from "@/components/table/column";
import { DataTable } from "@/components/table/data-table";
import { Button } from "@/components/ui/button";
// import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import usePagination from "@/hooks/use-pagination";
import { toastPromise } from "@/hooks/use-toast";
import { constant } from "@/lib/constant";
import queries from "@/lib/queries";
import { Plus,  } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";



// const tableData: TStaffMember [] = [
//   { id: "1", lastName:"adf", password:"dfa", role:"dfa", firstName: "Chris Johnson",  email: "name@email.com",  },
//   { id: "2", lastName:"adf", password:"dfa", role:"dfa", firstName: "Ovi Smith",  email: "name@email.com", },
//   { id: "3", lastName:"adf", password:"dfa", role:"dfa", firstName: "June Parker",  email: "name@email.com", },
//   { id: "4", lastName:"adf", password:"dfa", role:"dfa", firstName: "Casey Walker", email: "name@email.com",},
//   { id: "5", lastName:"adf", password:"dfa", role:"dfa", firstName: "Jordon Lee", email: "name@email.com",},
//   { id: "6", lastName:"adf", password:"dfa", role:"dfa", firstName: "Taylor Morgan", email: "name@email.com", },
//   { id: "7", lastName:"adf", password:"dfa", role:"dfa", firstName: "Sam Patel",  email: "name@email.com", },
//   { id: "8", lastName:"adf", password:"dfa", role:"dfa", firstName: "Chris Johnson",  email: "name@email.com", },
//   { id: "9", lastName:"adf", password:"dfa", role:"dfa", firstName: "Ovi Smith",  email: "name@email.com", },
//   { id: "10",lastName:"adf", password:"dfa", role:"dfa", firstName: "June Parker", email: "name@email.com", },
  
// ];

const StaffMemberPage = () => {
   const navigate = useNavigate();
  // const [perPage] = useState(10);
  const [tableRef, setTableRef] = useState<any>(null);
   const [newPage, setNewPage] = useState(1);
    // const [data, setData] = useState<TStaffMember[]>(tableData);
        const {data,refetch, isFetching} = useFetchAllStaffMember({page: newPage, limit: 10, })

  
    const { currentPage, nextPage, prevPage, setPage, totalPages, currentItems } = usePagination<TStaffMember>(data?.staffMembers, newPage, 10, data?.pagination);
  
    
    const handleEdit = useCallback((id: string) => { console.log("Edit:", id)
       navigate(constant.ROUTING_URLS.EDIT_STAFF_MEMBERS.replace(":id",id));
     }, []);
    const handleAccess = useCallback((id: string) => { console.log("Access:", id) }, []);
    const deleteStaffMember = queries.useDeleteStaffMemberMutation();
    const bulkDeleteStaffMember = queries.useBulkDeleteStaffMemberMutation();
    const handleDelete = useCallback((id: string) => {
      try {
        toastPromise(deleteStaffMember.mutateAsync({id}),{
          loading: "Deleting staff member...",
          success: (res)=>{
            if(res) refetch();
            return "Staff member deleted successfully";
          },
          error: (e)=> (e instanceof Error) ? e.message : "An unknown error occurred",
        })
      } catch (error) {
      if(error instanceof Error){
        toast.error(error.message);
      }else {
          toast.error("An unknown error occurred");
        }
      }
      // setData((prev) =>
      //   prev.filter((row) => row.id !== id))
    }, []);
    const columns = useMemo(() => getStaffMember(handleEdit,handleAccess, handleDelete), [handleEdit,handleAccess,handleDelete])
  
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
                <h2 className="font-medium text-xl text-black">Staff Members</h2>
                <h4><span className="text-[#959595] w-14 h-4">LIMOSPRO</span> <span className="text-[#959595] w-[116px] h-4">/ Staff Members</span></h4>
              </div>
              <Link to={constant.ROUTING_URLS.CREATE_STAFF_MEMBERS}>  <Button variant="secondary" className="cursor-pointer bg-[#E4E4E4] flex items-center rounded">
                <Plus className="text-[#515151]" />
                <span className="text-[#515151] font-medium text-sm">Add Staff Member</span>
              </Button>
              </Link>
            </div>
          </Header>
  
          <div className="flex justify-between mt-5">
            <div className=" w-[220px] h-full flex items-center focus-visible:border-none focus-visible:outline-none"><Input type="search" placeholder="search" className="text-[#959595]"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)} /></div>
            
            <div className="w-[369px] h-[39px] flex items-center justify-end gap-3">
              <span 

// @ts-expect-error: We are intentionally assigning a number to a string type for testing.
              className={`${Object.keys(rowSelection).filter((k) => rowSelection[k]).length === 0?"cursor-no-drop":"cursor-pointer"}`}>
              <BulkDeleteBtn rowSelection={rowSelection} tableRef={tableRef} bulkDeleteMutation={bulkDeleteStaffMember} refetch={refetch} setRowSelection={setRowSelection} title="Staff Members" descTitle="staff members"/>
              </span>
              
          </div>
          </div>
          {isFetching? <Spinner/> : (<DataTable columns={columns} data={currentItems} rowSelection={rowSelection}
            onTableReady={setTableRef}
            onRowSelectionChange={setRowSelection}
            globalFilter={searchValue}
            onGlobalFilterChange={setSearchValue} />
  )}
          
          {/* Pagination */}
          {totalPages > 0 && calculatedTotalPages > 1 && (
            <Pagination className="justify-end mt-5 cursor-pointer">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={()=>handlePageChange(currentPage - 1)}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
  
                {generatePaginationItems()}
  
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={()=>handlePageChange(currentPage + 1)}
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

export default StaffMemberPage
