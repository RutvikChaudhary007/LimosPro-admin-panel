// @ts-nocheck
import useFetchAllContentBlock from "@/api/contentBlock.api";
import Header from "@/components/layouts/Header";
import { Spinner } from "@/components/Spinner";
import { getHomeContent, type THomeContent } from "@/components/table/column";
import { DataTable } from "@/components/table/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import usePagination from "@/hooks/use-pagination";
import { toastPromise } from "@/hooks/use-toast";
import { constant } from "@/lib/constant";
import queries from "@/lib/queries";
import { cn } from "@/lib/utils";
import { Plus, } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";


const ContentManagement = () => {
  const navigate = useNavigate();
   const perPage = 10;
   const [page, setCPage] = useState(1);
   
      const {data,refetch, isFetching} = useFetchAllContentBlock({limit:perPage, page});
    const [activeBtn, setActiveBtn] = useState<string>("Home");
    const tabsData = useMemo(()=>{
        const uniqueTabs = new Set();
        if (data?.blocks) {
          for (const rawData of data.blocks) {
            uniqueTabs.add(rawData?.pageName);
          }
        }
        return Array.from(uniqueTabs);
      },[data])
    const filteredData = data?.blocks?.filter((row)=>{
      // console.log("activeBtn",row?.pageName?.toLowerCase())
      if(activeBtn?.toLowerCase() === row?.pageName?.toLowerCase()){
        return true;
      }
    })
    // console.log("filteredData:",filteredData)
    const { currentPage, nextPage, prevPage, setPage, totalPages, currentItems } = usePagination<THomeContent>(filteredData, page, perPage, data?.pagination);
  
    useEffect(()=>{
      if(currentPage)
      setCPage(currentPage)
    },[currentPage]);
    const handleEdit = (id: string) => { console.log("Edit:", id)
        navigate(constant.ROUTING_URLS.EDIT_CONTENT_MANAGEMENT.replace(":id",id))
     };
     const deleteContentMutation = queries.useDeleteContentBlockMutation();
    const handleDelete = (id: string) => {
      toastPromise(deleteContentMutation.mutateAsync(id),{
        loading: "Deleting...",
        success: (res)=>{
          if(res?.status === true) refetch();
          setActiveBtn("Home")
          return "Yeah! successfully deleted the content."
        },
        error: (e)=> (e instanceof Error)? e.message: "Opps! failed to delete content."
      });
    };
    const columns =  getHomeContent(handleEdit, handleDelete);
  
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
          
            <div className="px-10 py-6 h-[calc(100vh-146px)] overflow-auto">
              <Header className="p-4 h-[79px] bg-[#FDFDFD] shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
                <div className="w-full h-full flex items-center justify-between">
                  <div>
                    <h2 className="font-medium text-xl text-black">Content Management</h2>
                    <h4><span className="text-[#959595] w-14 h-4">LIMOSPRO</span> <span className="text-[#959595] w-[116px] h-4">/ All Pages</span></h4>
                  </div>
                  <Link to={constant.ROUTING_URLS.CREATE_CONTENT_MANAGEMENT}>  <Button variant={"outline"} className="cursor-pointer bg-[#E4E4E4] flex items-center rounded">
                    <Plus className="text-[#515151]" />
                    <span className="text-[#515151] font-medium text-sm">Add New Page</span>
                  </Button>
                  </Link>
                </div>
              </Header>
      
              <div className="flex items-center justify-between">
                
                <div className="w-[369px] h-[39px] mt-5 flex items-center justify-between gap-3">
                  
                  <div className="p-2.5 w-[220px] h-full flex items-center focus-visible:border-none focus-visible:outline-none  rounded"><Input type="search" placeholder="search" className="text-[#959595] rounded"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)} /></div>
                </div>
              </div>
              <div className="flex items-center justify-between mt-5 overflow-y-scroll gap-2">
                {tabsData?.map((btn,i)=>(
                  <Button className={cn("bg-[#EEEEEE] text-[#C8C8C8] font-medium rounded hover:text-black",btn?.toLowerCase()===activeBtn?.toLowerCase()&& "bg-[#939393] text-white")} key={i} variant={"secondary"} onClick={()=>setActiveBtn(btn)}>
                  {btn}
                </Button>
                ))}
              </div>
       
       {/* Data */}
       
              {isFetching? <Spinner/>:<DataTable columns={columns} data={currentItems} rowSelection={rowSelection}
                onRowSelectionChange={setRowSelection}
                globalFilter={searchValue}
                onGlobalFilterChange={setSearchValue} />
              } 

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
          
  )
}

export default ContentManagement
