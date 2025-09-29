/* eslint-disable no-unused-vars, @typescript-eslint/no-explicit-any */
import { deleteUser } from '@/api/deleteUser';
import UsefetchAllUsers from '@/api/getAllUser';
import { Spinner } from '@/components/Spinner';
import AdminRootLayout from '@/components/layouts/AdminRootLayout'
import Header from '@/components/layouts/Header';
import { getStatusColor, getUsers, type TUsers } from '@/components/table/column';
import { DataTable } from '@/components/table/data-table';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import usePagination from '@/hooks/use-pagination';
import { toastPromise, useToast} from '@/hooks/use-toast';
import { constant } from '@/lib/constant';
import type { ApiErrorResponse } from '@/types/global/ErrorResponse';
import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { ChevronDown, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import {  useNavigate } from 'react-router-dom';

const showStatus = [
  { label: 'Active', value: 'active' },
  { label: 'Pending', value: 'pending' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'Banned', value: 'banned' },
]

const showTime = [
  { label: 'All Time', value: '' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Monthly', value: 'monthly' },
  { label: 'Yearly', value: 'yearly' },
]

// const tableData: TUsers[] = [
//     {
//             id: "a4067b19-271d-4352-90dc-458f5fa97da3",
//             firstName: "NoahAnderson",
//             lastName: "",
//             email: "testuser@qalbit.com",
//             phoneNumber: "+1-424-231-3438",
//             dateOfBirth: "",
//             gender: "male",
//             status: "active",
//             paymentMethod: "creditCard",
//             profilePicture: "",
//             social: "",
//             createdAt: "Tue Jul 15 2025 18:11:52 GMT+0530 (India Standard Time)",
//             updatedAt: "Tue Jul 15 2025 18:11:52 GMT+0530 (India Standard Time)",
//             deletedAt: ""
//         },
//     {
//             id: "b4067b19-271d-4352-90dc-458f5fa97da3",
//             firstName: "Charlotte_Brown",
//             lastName: "",
//             email: "testuser2@qalbit.com",
//             phoneNumber: "+1-424-133-7698",
//             dateOfBirth: "",
//             gender: "male",
//             status: "banned",
//             paymentMethod: "creditCard",
//             profilePicture: "",
//             social: "",
//             createdAt: "Tue Jul 15 2025 18:11:52 GMT+0530 (India Standard Time)",
//             updatedAt: "Tue Jul 15 2025 18:11:52 GMT+0530 (India Standard Time)",
//             deletedAt: ""
//         },
//     {
//             id: "c4067b19-271d-4352-90dc-458f5fa97da4",
//             firstName: "Liam_Wilson99",
//             lastName: "",
//             email: "testuser3@qalbit.com",
//             phoneNumber: "+1-424-041-6798",
//             dateOfBirth: "",
//             gender: "male",
//             status: "inactive",
//             paymentMethod: "creditCard",
//             profilePicture: "",
//             social: "",
//             createdAt: "Tue Jul 15 2025 18:11:52 GMT+0530 (India Standard Time)",
//             updatedAt: "Tue Jul 15 2025 18:11:52 GMT+0530 (India Standard Time)",
//             deletedAt: ""
//         },
// ]
function UsersPage() {
  const {toast} = useToast();
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

  const {data, refetch, isFetching} = UsefetchAllUsers({DateRange:{startDate,endDate}});
  
  const { currentPage, nextPage, prevPage, setPage, totalPages, currentItems } = usePagination<TUsers>(data?.users, 1, perPage);

  const handleView = (id: string) => { console.log("view:", id)
    navigate(constant.ROUTING_URLS.VIEW_USERS.replace(":id",id));
   };

  const handleEdit = (id: string) => { console.log("Edit:", id)
    navigate(constant.ROUTING_URLS.EDIT_USERS.replace(":id",id));
   };
const deleteUserMutation = useMutation({
  mutationFn: deleteUser,
  onSuccess: ()=>{
    refetch();
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
        title: "Delete user",
        description: errorMessage,
        variant: "destructive",
      });
    }
})
    const handleDelete = async (id: string) => {
      toastPromise(await deleteUserMutation.mutateAsync(id),{
        loading: "Loading...",
        success: "yeah! user deleted successfully",
        error: "Failed to delete user.",
      })
    //   setData((prev) =>
    //     prev.filter((row) => row.id !== id))
    };

  const columns = getUsers(handleView,handleEdit, handleDelete)
  const [searchValue, setSearchValue] = useState("");
  const [rowSelection, setRowSelection] = useState<{ [key: string]: boolean }>({});

  
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
              <h2 className="font-medium text-xl text-black">User</h2>
              <h4> <span className="text-[#515151] w-[116px] h-4 text-xs">LIMOSPRO</span> <span className="text-xs text-[#939393] w-[50px] h-4">/ User</span></h4>
            </div>
            {/* <Link to={constant.ROUTING_URLS.CREATE_USERS}>  <Button variant={"outline"} className="cursor-pointer bg-[#E4E4E4] flex items-center rounded">
              <Plus className="text-[#515151]" />
              <span className="text-[#515151] font-medium text-sm">Add User</span>
            </Button>
            </Link> */}
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
                    className={`flex items-center rounded cursor-pointer justify-between focus:bg-gray-300 focus:text-black ${getStatusColor(option.label)} ${option.label === "Active" && "text-white"}`}
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
          <div className="w-[369px] h-[39px] mt-5 flex items-center justify-between gap-3">
            
            <span className={`${Object.keys(rowSelection).filter((k) => 
              rowSelection[k]).length === 0?"cursor-no-drop":"cursor-pointer"}`}>
              
            <Button variant={"outline"} className="p-2.5 w-[137px] h-full rounded flex items-center justify-evenly  cursor-pointer bg-[#FDFDFD] shadow-inner shadow-[#F1F1F1] hover:bg-none outline-0"
            
            disabled={Object.keys(rowSelection).filter((k) => rowSelection[k]).length === 0}
              onClick={() => {
                
                // setData((prev) =>prev.filter((_,i) => !rowSelection[i])
                // );
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
        {isFetching?(<Spinner/>):(<DataTable columns={columns} data={currentItems}

rowSelection={rowSelection}
 onRowSelectionChange={setRowSelection}
 globalFilter={searchValue}
 onGlobalFilterChange={setSearchValue} />
)}
         
        {/* Pagination */}
        {data?.users?.length > 0 && calculatedTotalPages > 1 && (
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

export default UsersPage
