 
import { deleteAffiliate } from '@/api/deleteAffiliate';
import UsefetchAllAffiliate from '@/api/getAllAffiliate';
import AdminRootLayout from '@/components/layouts/AdminRootLayout'
import Header from '@/components/layouts/Header';
import { getAffiliate, getStatusColor, type TAffiliate } from '@/components/table/column';
import { DataTable } from '@/components/table/data-table';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import usePagination from '@/hooks/use-pagination';
import { toast, toastPromise } from '@/hooks/use-toast';
import { constant } from '@/lib/constant';
import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { ChevronDown, Plus, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';

const showStatus = [
  { label: 'Active', value: 'active' },
  { label: 'Pending', value: 'pending' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'Suspended', value: 'suspended' },
]

const showTime = [
  { label: 'All Time', value: '' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Monthly', value: 'monthly' },
  { label: 'Yearly', value: 'yearly' },
]

const tableData: TAffiliate[] = [
    {   
        id: "ba5227db-7a3f-45f5-945c-e9d5ef01968d",
        userId: "41811d39-6655-4007-b0d8-ee9b8136f85d",
        isChauffer: true,
        companyName: "bhoraniya enterprice",
        taxId: "tax-husain",
        entityType: "safe",
        businessEmail: "akbar.bhoraniya@qalbit.com",
        businessContactNumber: "1234567890",
        businessAddress: "272 Water Street, New York, NY 10038, United States of America",
        businessLocation: {
            latitude: 18.530802513337985,
            longitude: 73.85830250715696
        },
        commissionRate: "23.00",
        documents: [],
        stripeAccountId: "acct_1Rl8OPQK72ufJtl5",
        stripeAccountStatus: "inPogress",
        status: "pending",
        createdAt: "2025-07-15T12:55:37.323Z",
        updatedAt: "2025-07-15T12:55:37.323Z"
    },
    {   
        id: "ba5227db-7a3f-45f5-945c-e9d5ef01968b",
        userId: "41811d39-6655-4007-b0d8-ee9b8136f85d",
        isChauffer: true,
        companyName: "bhoraniya enterprice",
        taxId: "tax-husain",
        entityType: "safe",
        businessEmail: "akbar.bhoraniya@qalbit.com",
        businessContactNumber: "1234567890",
        businessAddress: "272 Water Street, New York, NY 10038, United States of America",
        businessLocation: {
            latitude: 18.530802513337985,
            longitude: 73.85830250715696
        },
        commissionRate: "23.00",
        documents: [],
        stripeAccountId: "acct_1Rl8OPQK72ufJtl5",
        stripeAccountStatus: "inPogress",
        status: "pending",
        createdAt: "2025-07-15T12:55:37.323Z",
        updatedAt: "2025-07-15T12:55:37.323Z"
    },
    {   
        id: "ba5227db-7a3f-45f5-945c-e9d5ef01968c",
        userId: "41811d39-6655-4007-b0d8-ee9b8136f85d",
        isChauffer: true,
        companyName: "bhoraniya enterprice",
        taxId: "tax-husain",
        entityType: "safe",
        businessEmail: "akbar.bhoraniya@qalbit.com",
        businessContactNumber: "1234567890",
        businessAddress: "272 Water Street, New York, NY 10038, United States of America",
        businessLocation: {
            latitude: 18.530802513337985,
            longitude: 73.85830250715696
        },
        commissionRate: "23.00",
        documents: [],
        stripeAccountId: "acct_1Rl8OPQK72ufJtl5",
        stripeAccountStatus: "inPogress",
        status: "pending",
        createdAt: "2025-07-15T12:55:37.323Z",
        updatedAt: "2025-07-15T12:55:37.323Z"
    },
    {   
        id: "ba5227db-7a3f-45f5-945c-e9d5ef01968e",
        userId: "41811d39-6655-4007-b0d8-ee9b8136f85d",
        isChauffer: true,
        companyName: "bhoraniya enterprice",
        taxId: "tax-husain",
        entityType: "safe",
        businessEmail: "akbar.bhoraniya@qalbit.com",
        businessContactNumber: "1234567890",
        businessAddress: "272 Water Street, New York, NY 10038, United States of America",
        businessLocation: {
            latitude: 18.530802513337985,
            longitude: 73.85830250715696
        },
        commissionRate: "23.00",
        documents: [],
        stripeAccountId: "acct_1Rl8OPQK72ufJtl5",
        stripeAccountStatus: "inPogress",
        status: "pending",
        createdAt: "2025-07-15T12:55:37.323Z",
        updatedAt: "2025-07-15T12:55:37.323Z"
    },
    {   
        id: "ba5227db-7a3f-45f5-945c-e9d5ef01968f",
        userId: "41811d39-6655-4007-b0d8-ee9b8136f85d",
        isChauffer: true,
        companyName: "bhoraniya enterprice",
        taxId: "tax-husain",
        entityType: "safe",
        businessEmail: "akbar.bhoraniya@qalbit.com",
        businessContactNumber: "1234567890",
        businessAddress: "272 Water Street, New York, NY 10038, United States of America",
        businessLocation: {
            latitude: 18.530802513337985,
            longitude: 73.85830250715696
        },
        commissionRate: "23.00",
        documents: [],
        stripeAccountId: "acct_1Rl8OPQK72ufJtl5",
        stripeAccountStatus: "inPogress",
        status: "pending",
        createdAt: "2025-07-15T12:55:37.323Z",
        updatedAt: "2025-07-15T12:55:37.323Z"
    },
    {   
        id: "ba5227db-7a3f-45f5-945c-e9d5ef01968g",
        userId: "41811d39-6655-4007-b0d8-ee9b8136f85d",
        isChauffer: true,
        companyName: "bhoraniya enterprice",
        taxId: "tax-husain",
        entityType: "safe",
        businessEmail: "akbar.bhoraniya@qalbit.com",
        businessContactNumber: "1234567890",
        businessAddress: "272 Water Street, New York, NY 10038, United States of America",
        businessLocation: {
            latitude: 18.530802513337985,
            longitude: 73.85830250715696
        },
        commissionRate: "23.00",
        documents: [],
        stripeAccountId: "acct_1Rl8OPQK72ufJtl5",
        stripeAccountStatus: "inPogress",
        status: "pending",
        createdAt: "2025-07-15T12:55:37.323Z",
        updatedAt: "2025-07-15T12:55:37.323Z"
    },
    {   
        id: "ba5227db-7a3f-45f5-945c-e9d5ef01968h",
        userId: "41811d39-6655-4007-b0d8-ee9b8136f85d",
        isChauffer: true,
        companyName: "bhoraniya enterprice",
        taxId: "tax-husain",
        entityType: "safe",
        businessEmail: "akbar.bhoraniya@qalbit.com",
        businessContactNumber: "1234567890",
        businessAddress: "272 Water Street, New York, NY 10038, United States of America",
        businessLocation: {
            latitude: 18.530802513337985,
            longitude: 73.85830250715696
        },
        commissionRate: "23.00",
        documents: [],
        stripeAccountId: "acct_1Rl8OPQK72ufJtl5",
        stripeAccountStatus: "inPogress",
        status: "pending",
        createdAt: "2025-07-15T12:55:37.323Z",
        updatedAt: "2025-07-15T12:55:37.323Z"
    },
    {   
        id: "ba5227db-7a3f-45f5-945c-e9d5ef01968i",
        userId: "41811d39-6655-4007-b0d8-ee9b8136f85d",
        isChauffer: true,
        companyName: "bhoraniya enterprice",
        taxId: "tax-husain",
        entityType: "safe",
        businessEmail: "akbar.bhoraniya@qalbit.com",
        businessContactNumber: "1234567890",
        businessAddress: "272 Water Street, New York, NY 10038, United States of America",
        businessLocation: {
            latitude: 18.530802513337985,
            longitude: 73.85830250715696
        },
        commissionRate: "23.00",
        documents: [],
        stripeAccountId: "acct_1Rl8OPQK72ufJtl5",
        stripeAccountStatus: "inPogress",
        status: "pending",
        createdAt: "2025-07-15T12:55:37.323Z",
        updatedAt: "2025-07-15T12:55:37.323Z"
    },
    {   
        id: "ba5227db-7a3f-45f5-945c-e9d5ef01968j",
        userId: "41811d39-6655-4007-b0d8-ee9b8136f85d",
        isChauffer: true,
        companyName: "bhoraniya enterprice",
        taxId: "tax-husain",
        entityType: "safe",
        businessEmail: "akbar.bhoraniya@qalbit.com",
        businessContactNumber: "1234567890",
        businessAddress: "272 Water Street, New York, NY 10038, United States of America",
        businessLocation: {
            latitude: 18.530802513337985,
            longitude: 73.85830250715696
        },
        commissionRate: "23.00",
        documents: [],
        stripeAccountId: "acct_1Rl8OPQK72ufJtl5",
        stripeAccountStatus: "inPogress",
        status: "pending",
        createdAt: "2025-07-15T12:55:37.323Z",
        updatedAt: "2025-07-15T12:55:37.323Z"
    },
    {   
        id: "ba5227db-7a3f-45f5-945c-e9d5ef01968k",
        userId: "41811d39-6655-4007-b0d8-ee9b8136f85d",
        isChauffer: true,
        companyName: "bhoraniya enterprice",
        taxId: "tax-husain",
        entityType: "safe",
        businessEmail: "akbar.bhoraniya@qalbit.com",
        businessContactNumber: "1234567890",
        businessAddress: "272 Water Street, New York, NY 10038, United States of America",
        businessLocation: {
            latitude: 18.530802513337985,
            longitude: 73.85830250715696
        },
        commissionRate: "23.00",
        documents: [],
        stripeAccountId: "acct_1Rl8OPQK72ufJtl5",
        stripeAccountStatus: "inPogress",
        status: "pending",
        createdAt: "2025-07-15T12:55:37.323Z",
        updatedAt: "2025-07-15T12:55:37.323Z"
    },
    {   
        id: "ba5227db-7a3f-45f5-945c-e9d5ef01968l",
        userId: "41811d39-6655-4007-b0d8-ee9b8136f85d",
        isChauffer: true,
        companyName: "bhoraniya enterprice",
        taxId: "tax-husain",
        entityType: "safe",
        businessEmail: "akbar.bhoraniya@qalbit.com",
        businessContactNumber: "1234567890",
        businessAddress: "272 Water Street, New York, NY 10038, United States of America",
        businessLocation: {
            latitude: 18.530802513337985,
            longitude: 73.85830250715696
        },
        commissionRate: "23.00",
        documents: [],
        stripeAccountId: "acct_1Rl8OPQK72ufJtl5",
        stripeAccountStatus: "inPogress",
        status: "pending",
        createdAt: "2025-07-15T12:55:37.323Z",
        updatedAt: "2025-07-15T12:55:37.323Z"
    },
    {   
        id: "ba5227db-7a3f-45f5-945c-e9d5ef01968m",
        userId: "41811d39-6655-4007-b0d8-ee9b8136f85d",
        isChauffer: true,
        companyName: "bhoraniya enterprice",
        taxId: "tax-husain",
        entityType: "safe",
        businessEmail: "akbar.bhoraniya@qalbit.com",
        businessContactNumber: "1234567890",
        businessAddress: "272 Water Street, New York, NY 10038, United States of America",
        businessLocation: {
            latitude: 18.530802513337985,
            longitude: 73.85830250715696
        },
        commissionRate: "23.00",
        documents: [],
        stripeAccountId: "acct_1Rl8OPQK72ufJtl5",
        stripeAccountStatus: "inPogress",
        status: "pending",
        createdAt: "2025-07-15T12:55:37.323Z",
        updatedAt: "2025-07-15T12:55:37.323Z"
    },
    {   
        id: "ba5227db-7a3f-45f5-945c-e9d5ef01968n",
        userId: "41811d39-6655-4007-b0d8-ee9b8136f85d",
        isChauffer: true,
        companyName: "bhoraniya enterprice",
        taxId: "tax-husain",
        entityType: "safe",
        businessEmail: "akbar.bhoraniya@qalbit.com",
        businessContactNumber: "1234567890",
        businessAddress: "272 Water Street, New York, NY 10038, United States of America",
        businessLocation: {
            latitude: 18.530802513337985,
            longitude: 73.85830250715696
        },
        commissionRate: "23.00",
        documents: [],
        stripeAccountId: "acct_1Rl8OPQK72ufJtl5",
        stripeAccountStatus: "inPogress",
        status: "pending",
        createdAt: "2025-07-15T12:55:37.323Z",
        updatedAt: "2025-07-15T12:55:37.323Z"
    },
]
function AffiliatePage() {
  const navigate = useNavigate();
    const perPage = 10;
  const [selectedStatus, setSelectedStatus] = useState(showStatus[0]);
  const [selectedTime, setSelectedTime] = useState(showTime[0]);
    // --- Time range helper ---
const { startDate, endDate } = useMemo(() => {
  const now = new Date();
  const end = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      23, 59, 59, 999
    )
  );
  let start: Date | undefined;

  switch (selectedTime.value) {
    case 'weekly': {
      // last 7 days inclusive (UTC)
      start = new Date(
        Date.UTC(
          now.getUTCFullYear(),
          now.getUTCMonth(),
          now.getUTCDate() - 6,
          0, 0, 0, 0
        )
      );
      break;
    }
    case 'monthly': {
      start = new Date(
        Date.UTC(
          now.getUTCFullYear(),
          now.getUTCMonth(),
          1,
          0, 0, 0, 0
        )
      );
      break;
    }
    case 'yearly': {
      start = new Date(
        Date.UTC(
          now.getUTCFullYear(),
          0,
          1,
          0, 0, 0, 0
        )
      );
      break;
    }
    default: {
      // All time: leave undefined so callers can omit filters
      start = undefined;
    }
  }

  return { startDate: start, endDate: selectedTime.value ? end : undefined };
}, [selectedTime]);


  const {data: FetchData, isFetching, error} = UsefetchAllAffiliate({DateRange:{startDate,endDate}});  
  const [data, setData] = useState<TAffiliate[]>([]);
  const { currentPage, nextPage, prevPage, setPage, totalPages, currentItems } = usePagination<TAffiliate>(data, 1, perPage);
useEffect(()=>{
  if(FetchData){
    setData(FetchData?.affiliates);
  }
},[FetchData])

  const handleView = (id: string) => { console.log("view:", id) 
    navigate(constant.ROUTING_URLS.VIEW_AFFILIATE.replace(":id",id));

  };
  const handleEdit = (id: string) => { console.log("Edit:", id)
    navigate(constant.ROUTING_URLS.EDIT_AFFILIATE.replace(":id",id));
   };
  const handleDelete = async(id: string) => {
    try {
     
      // Remove remember field before sending to API
      // await loginMutation.mutateAsync(loginData);
     toastPromise(await  deleteAffiliateMutation.mutateAsync(id), {
        loading: "Deleting...",
        success: "Affiliate deleted successfully!",
        error: (e) => (e instanceof Error ? e.message : "Failed to delete affiliate"),
      });
    } catch (error) {
      // Error handling is done in onError callback
      console.error('Affiliate delete error:', error);
    }
    };
  const columns = getAffiliate(handleView,handleEdit, handleDelete);
  const [searchValue, setSearchValue] = useState("");
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});

  const deleteAffiliateMutation = useMutation({
    mutationFn: deleteAffiliate,
    onSuccess: (response, variables) => {
      // TODO: need id
      // setData((prev) =>
      //   prev.filter((row) => row.id !== response.id))
    },
    onError: (err: unknown) => {
      let errorMessage = 'An unexpected error occurred';
      
      if (err && typeof err === 'object' && 'isAxiosError' in err) {
        const axiosError = err as AxiosError<ApiErrorResponse>;
        errorMessage = axiosError.response?.data?.message || axiosError.response?.data?.error || errorMessage;
      }
      
      // Don't show toast for rate limiting
      if (errorMessage.includes("429")) return;
      toast({
        title: "Delete affiliate Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  });
 
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
if(isFetching) return (<p>Loading...</p>)
  return (
    <AdminRootLayout>
        <div className="px-10 py-6 h-[calc(100vh-146px)] overflow-auto">
        <Header className="p-4 h-[79px] bg-[#FDFDFD] shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
          <div className="w-full h-full flex items-center justify-between">
            <div>
              <h2 className="font-medium text-xl text-black">Affiliate</h2>
              <h4> <span className="text-[#959595] w-[116px] h-4 text-xs">LIMOSPRO</span> <span className="text-xs text-[#3A3A3A] w-[50px] h-4">/ Affiliate</span></h4>
            </div>
            <Link to={constant.ROUTING_URLS.CREATE_AFFILIATE}>  <Button variant={"outline"} className="cursor-pointer bg-[#E4E4E4] flex items-center rounded">
              <Plus className="text-[#515151]" />
              <span className="text-[#515151] font-medium text-sm">Add Affiliate</span>
            </Button>
            </Link>
          </div>
        </Header>

        <div className="flex justify-between gap-2.5">
          <div className="flex items-center gap-3">
          <DropdownMenu >
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className={`w-[180px] h-[39px] flex items-center justify-between rounded mt-5 shadow-inner shadow-[#F1F1F1] cursor-pointer ${getStatusColor(selectedStatus.label)} ${selectedStatus.label === "Active" && "text-white"}`}>
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
          <DropdownMenu >
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className={`w-[180px] h-[39px] flex items-center justify-between rounded mt-5 shadow-inner shadow-[#F1F1F1] ${"cursor-pointer"} bg-[#FFFFFF] `}>
                <span className="truncate max-w-[120px]">{selectedTime.label}</span>
                <ChevronDown className="ml-2" />
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
          {/* {rangeLabel && (
            <span className="mt-5 text-xs text-[#6b7280]">{rangeLabel}</span>
          )} */}
          </div>
          <div className="w-[369px] h-[39px] mt-5 flex items-center justify-between gap-3">
            <span className={`${Object.keys(rowSelection).filter((k) => rowSelection[k]).length === 0?"cursor-no-drop":"cursor-pointer"}`}>
            <Button variant={"outline"} className={`p-2.5 w-[137px] h-full rounded flex items-center justify-evenly   bg-[#FDFDFD] shadow-inner shadow-[#F1F1F1] hover:bg-none outline-0`}
            disabled={Object.keys(rowSelection).filter((k) => rowSelection[k]).length === 0}
              onClick={() => {
                setData((prev) => prev.filter((_, i) => !rowSelection[i])
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

export default AffiliatePage
