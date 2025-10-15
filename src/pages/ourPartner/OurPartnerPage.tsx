// @ts-nocheck
import useFetchALLPartners from "@/api/ourPartners.api";
import BulkDeleteBtn from "@/components/bulkDeleteBtn/BulkDeleteBtn";
import Header from "@/components/layouts/Header";
import { Spinner } from "@/components/Spinner";
import { getOurPartner, type TOurPartner } from "@/components/table/column";
import { DataTable } from "@/components/table/data-table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import usePagination from "@/hooks/use-pagination";
import { toastPromise } from "@/hooks/use-toast";
import { constant } from "@/lib/constant";
import queries from "@/lib/queries";
import { ChevronDown, Plus, Trash2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const showOptions = [
  { value: 10, label: "Show 10" },
  { value: 20, label: "Show 20" },
  { value: 30, label: "Show 30" },
];


const tableData: TOurPartner [] = [
  { id: "1", companyName: "Chris Johnson", url: "http://AAdmiralswasattentiveveryaccommodating.An", photo: "../../../public/sidebarIcons/feedback.svg", },
  { id: "2", companyName: "Ovi Smith", url: "http://AAdmiralswasattentiveveryaccommodating.in", photo: "../../../public/sidebarIcons/feedback.svg", },
  { id: "3", companyName: "June Parker", url: "http://AAdmiralswasattentiveveryaccommodating.com", photo: "../../../public/sidebarIcons/feedback.svg", },
  { id: "4", companyName: "Casey Walker", url: "Booking Agent", photo: "../../../public/sidebarIcons/feedback.svg", },
  { id: "5", companyName: "Jordon Lee", url: "Driver Relations Manager", photo: "companyName@photo.com", },
  { id: "6", companyName: "Taylor Morgan", url: "Fleet Supervisor", photo: "companyName@photo.com", },
  { id: "7", companyName: "Sam Patel", url: "Dispatcher", photo: "companyName@photo.com", },
  { id: "8", companyName: "Chris Johnson", url: "Sales Representative", photo: "companyName@photo.com", },
  { id: "9", companyName: "Ovi Smith", url: "Operations Manager", photo: "companyName@photo.com", },
  { id: "10", companyName: "June Parker", url: "Sales Representative", photo: "companyName@photo.com", },
  { id: "11", companyName: "Casey Walker", url: "Dispatcher", photo: "companyName@photo.com", },
  { id: "12", companyName: "Jordon Lee", url: "Fleet Supervisor", photo: "companyName@photo.com", },
  { id: "13", companyName: "Taylor Morgan", url: "Driver Relations Manager", photo: "companyName@photo.com", },
  { id: "14", companyName: "Sam Patel", url: "Booking Agent", photo: "companyName@photo.com", },
  { id: "15", companyName: "Chris Johnson", url: "Quality Assurance Officer", photo: "companyName@photo.com", },
  { id: "16", companyName: "Ovi Smith", url: "Administrative Assistant", photo: "companyName@photo.com", },
  { id: "17", companyName: "June Parker", url: "Booking Agent", photo: "companyName@photo.com", },
  { id: "18", companyName: "Casey Walker", url: "", photo: "companyName@photo.com", },
  { id: "19", companyName: "Jordon Lee", url: "", photo: "companyName@photo.com",  },
  { id: "20", companyName: "Taylor Morgan", url: "", photo: "companyName@photo.com", },
  { id: "21", companyName: "Sam Patel", url: "",photo: "companyName@photo.com",  },
  { id: "22", companyName: "Chris Johnson", url: "",photo: "companyName@photo.com",  },
  { id: "23", companyName: "Ovi Smith", url: "",photo: "companyName@photo.com",  },
  { id: "24", companyName: "June Parker", url: "", photo: "companyName@photo.com", },
  { id: "25", companyName: "Casey Walker", url: "", photo: "companyName@photo.com", },
  { id: "26", companyName: "Jordon Lee", url: "", photo: "companyName@photo.com", },
  { id: "27", companyName: "Taylor Morgan", url: "",photo: "companyName@photo.com",  },
  { id: "28", companyName: "Sam Patel", url: "",photo: "companyName@photo.com",  },
  { id: "29", companyName: "Sam Patel", url: "",photo: "companyName@photo.com",  },
  { id: "30", companyName: "Sam Patel", url: "", photo: "name@photo.com", },
  
];

const OurPartnerPage = () => {
 const navigate = useNavigate();
 const [tableRef, setTableRef] = useState<any>(null);
   const [perPage, setPerPage] = useState(10);
    const [selected, setSelected] = useState(showOptions[0]);
    // const [data, setData] = useState<TOurPartner[]>(tableData);
  const {data, refetch, isFetching} = useFetchALLPartners();
    const { currentPage, nextPage, prevPage, setPage, totalPages, currentItems } = usePagination<TOurPartner>(data?.items, 1, perPage, data?.pagination);
  
    useEffect(() => {
      setPerPage(selected.value);
    }, [selected])
    const handleEdit = (id: string) => { console.log("Edit:", id)
        navigate(constant.ROUTING_URLS.EDIT_OUR_PARTNERS.replace(":id",id))
     };
     const deletePartnerMutation = queries.useDeleteOurPartnerMutation();
     const bulkDeletePartnerMutation = queries.useBulkDeleteOurPartnerMutation();
    const handleDelete = async(id: string) => {
      try {
         toastPromise(deletePartnerMutation.mutateAsync(id),{
          loading: "Deleting partner...",
          success: (res)=>{
            if(res) refetch();
            return "Yeah! Partner deleted successfully";
          },
          error: (e)=> (e instanceof Error) ? e.message : "Opps! Failed to delete partner",
         });
      } catch (error) {
       if(error instanceof Error) {
        toast.error(error.message);
       }else{
        toast.error("An unknown error occurred");
       }
      }};
    const columns = getOurPartner(handleEdit, handleDelete);
  
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
      <>
        <div className="px-10 py-6 h-[calc(100vh-146px)] overflow-auto">
          <Header className="p-4 h-[79px] bg-[#FDFDFD] shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
            <div className="w-full h-full flex items-center justify-between">
              <div>
                <h2 className="font-medium text-xl text-black">Our Partners</h2>
                <h4><span className="text-[#959595] w-14 h-4">LIMOSPRO</span> <span className="text-[#959595] w-[116px] h-4">/ Our Partners</span></h4>
              </div>
              <Link to={constant.ROUTING_URLS.CREATE_OUR_PARTNERS}>  <Button variant={"outline"} className="cursor-pointer bg-[#E4E4E4] flex items-center rounded">
                <Plus className="text-[#515151]" />
                <span className="text-[#515151] font-medium text-sm">Add Partners</span>
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
              <BulkDeleteBtn rowSelection={rowSelection} tableRef={tableRef} bulkDeleteMutation={bulkDeletePartnerMutation} refetch={refetch} setRowSelection={setRowSelection} title="Our Partners" descTitle="our partners"/>
              </span>
              <div className="p-2.5 w-[220px] h-full flex items-center focus-visible:border-none focus-visible:outline-none"><Input type="search" placeholder="search" className="text-[#959595]"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)} /></div>
            </div>
          </div>
          {isFetching ? <Spinner /> : (<DataTable columns={columns} data={currentItems} rowSelection={rowSelection}
          onTableReady={setTableRef}
            onRowSelectionChange={setRowSelection}
            globalFilter={searchValue}
            onGlobalFilterChange={setSearchValue} />)}
  
          {/* Pagination */}
          {totalPages > 0 && calculatedTotalPages > 1 && (
            <Pagination className="justify-end mt-5 cursor-pointer">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href={"?page="+currentPage}
                    onClick={prevPage}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
  
                {generatePaginationItems()}
  
                <PaginationItem>
                  <PaginationNext
                    href={"?page="+currentPage}
                    onClick={nextPage}
                    className={currentPage === calculatedTotalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </>
    )
}

export default OurPartnerPage
