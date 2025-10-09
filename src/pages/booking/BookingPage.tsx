// @ts-nocheck
import UsefetchAllBookings from '@/api/getAllBookings.api';
import { Spinner } from '@/components/Spinner';
import { Calendar28 } from '@/components/date/DateRange';
import AdminRootLayout from '@/components/layouts/AdminRootLayout'
import Header from '@/components/layouts/Header';
import { formatDate, getBooking, type TBooking } from '@/components/table/column';
import { DataTable } from '@/components/table/data-table';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import usePagination from '@/hooks/use-pagination';
import { constant } from '@/lib/constant';
import { exportToCsv } from '@/utils/export';
import { ChevronDown, Download } from 'lucide-react';
import {  useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';


const showStatus = [
    { label: 'Mark As', value: '' },
    { label: 'Completed', value: 'completed' },
];

// const tableData: TBooking[] = [
//     {
//         "id": "550e8400-e29b-41d4-a716-446655440000",
//         "userId": "550e8400-e29b-41d4-a716-446655440000",
//         "affiliateId": "550e8400-e29b-41d4-a716-446655440000",
//         "bookingType": "twoWay",
//         "pickupLocation": {
//             "latitude": 40.712776,
//             "longitude": -74.005974
//         },
//         "dropoffLocation": {
//             "latitude": 34.052235,
//             "longitude": -118.243683
//         },
//         "isThirdPartyUser": true,
//         "thirdPartyUser": {
//             "name": "test",
//             "email": "test@mailinator.com",
//             "phone": "9876543210"
//         },
//         "scheduledTime": "2025-04-16T15:30:00Z",
//         "fare": 99.99,
//         "status": "pending",
//         "createdAt": "2025-04-16T15:30:00Z",
//         "updatedAt": "2025-04-16T15:30:00Z"
//     },
//     {
//         "id": "550e8400-e29b-41d4-a716-446655440000",
//         "userId": "550e8400-e29b-41d4-a716-446655440000",
//         "affiliateId": "550e8400-e29b-41d4-a716-446655440000",
//         "bookingType": "twoWay",
//         "pickupLocation": {
//             "latitude": 40.712776,
//             "longitude": -74.005974
//         },
//         "dropoffLocation": {
//             "latitude": 34.052235,
//             "longitude": -118.243683
//         },
//         "isThirdPartyUser": true,
//         "thirdPartyUser": {
//             "name": "test",
//             "email": "test@mailinator.com",
//             "phone": "9876543210"
//         },
//         "scheduledTime": "2025-04-16T15:30:00Z",
//         "fare": 99.99,
//         "status": "pending",
//         "createdAt": "2025-04-16T15:30:00Z",
//         "updatedAt": "2025-04-16T15:30:00Z"
//     }
// ];

// type BookingStatus = "pending" | "accepted" | "canceled" | "completed";

// function countByStatus(bookings: TBooking[]) {
//     return bookings.reduce<Record<BookingStatus, number>>(
//         (acc, booking) => {
//             const status = booking.status as BookingStatus;
//             acc[status] = (acc[status] || 0) + 1;
//             return acc;
//         },
//         {
//             pending: 0,
//             accepted: 0,
//             canceled: 0,
//             completed: 0,
//         }
//     );
// }

type RowData = {
  affiliateId: string;
  id: string;
  status: string;
  createdAt: string | Date;
  updatedAt: string | Date;
};
function BookingPage() {
    const perPage = 10;
    const navigate = useNavigate();
    const [newPage, setNewPage] = useState<number>(1);
    const [selectedStatus, setSelectedStatus] = useState(showStatus[0]);
    
    const [dateRange, setDateRange] = useState<{

        from: Date | undefined;
        to: Date | undefined;
    }>({
        from: undefined,
        to: undefined,
    });
    // const [data, setData] = useState<TBooking[]>(tableData);
    const {data,  isFetching} = UsefetchAllBookings({DateRange: dateRange, page: newPage})

    useEffect(()=>{
        if(data){
            console.log("fetchData:",data)
        }
    },[data])

    const handleView = (id: string) => { console.log("view:", id)
        navigate(constant.ROUTING_URLS.VIEW_BOOKING.replace(":id",id));
     };
    const columns = getBooking(handleView);
    const [searchValue, setSearchValue] = useState("");
    const [rowSelection, setRowSelection] = useState<{ [key: string]: boolean }>({});

    // Filter data
    const filterData = data?.bookings?.filter((row:RowData) => {
        if (searchValue === "") return true;
        if (searchValue &&
            !row.affiliateId.toLowerCase().includes(searchValue.toLowerCase()) &&
            !row.id.toLowerCase().includes(searchValue.toLowerCase())) {
            return false;
        }

        if (selectedStatus && row.status.toLowerCase() !== selectedStatus.value.toLowerCase()) {
            return false;
        }

        // Date range filter
        if (dateRange.from) {
            const createdAt = new Date(row.createdAt);
            // console.log(`verificationDate:${verificationDate}`)
            // console.log(`dateRange.from:${dateRange.from}`)
            if (createdAt < dateRange.from) return false;
        }

        if (dateRange.to) {
            const updatedAt = new Date(row.updatedAt);
            const endOfDay = new Date(dateRange.to);
            // console.log(`verificationDate:${verificationDate}`)
            // console.log(`dateRange.to:${dateRange.to}`)
            endOfDay.setHours(23, 59, 59, 999);
            // console.log(`endofDay:${endOfDay}`)
            if (updatedAt > endOfDay) return false;
        }

        return true;
    });


    const { currentPage, nextPage, prevPage, setPage, totalPages, currentItems } = usePagination<TBooking>(filterData, newPage, perPage, data?.pagination);

    // const statusCounts = useMemo(() => {
        // return countByStatus(data?.statusCounts);
    // }, []);
    const statusCounts = data?.statusCounts;

      // Handle CSV export
  const handleExportCsv = () => {
    const headers = [
      'ID',
      'Affiliate Id',
      'bookingType',
      'scheduledTime',
      'price',
      'Status',
      'Created At',   
    ];

    const csvData = data?.bookings?.map(v => [
      v?.id || '',
      v?.affiliateId || '',
      v?.bookingType || '',
      v?.scheduledTime || '',
      v?.fare?.toString() || '',
      v?.status || '',
      formatDate(v?.createdAt || ''),
    ]);

    exportToCsv('booking_history', headers, csvData);

    // toast({
    //   title: "Export successful",
    //   description: "Verification history has been exported to CSV",
    // });
  };

    // Number of pages based on filtered data
    const calculatedTotalPages = Math.max(1, totalPages);

    // Handle page change
    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        setNewPage(newPage)
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
                        <div className='w-[416px] h-[47px]'>
                            <h2 className="font-medium text-xl text-black">Bookings</h2>
                            <h4> <span className="text-[#515151] w-[116px] h-4 text-xs">LIMOSPRO</span> <span className="text-xs text-[#939393] w-[50px] h-4">/ Bookings</span></h4>
                        </div>
                        <div className='w-[612px] h-[47px] flex gap-[50px]  items-center justify-between'>
                            <div className='flex flex-col gap-1'>
                                <div className='text-center text-[#5D5D5D] h-[27px] w-[79px] font-medium text-xl'>{statusCounts?.accepted}</div>
                                <div className='text-center text-black h-4 text-xs w-[79px]'>Accepted</div>
                            </div>
                            <div className='flex flex-col gap-1'>
                                <div className='text-center text-[#5D5D5D] h-[27px] w-[79px] font-medium text-xl'>{statusCounts?.pending}</div>
                                <div className='text-center text-black h-4 text-xs w-[79px]'>Pending</div>
                            </div>
                            <div className='flex flex-col gap-1'>
                                <div className='text-center text-[#5D5D5D] h-[27px] w-[79px] font-medium text-xl'>{statusCounts?.cancelled}</div>
                                <div className='text-center text-black h-4 text-xs w-[79px]'>Cancelled</div>
                            </div>
                            <div className='flex flex-col gap-1'>
                                <div className='text-center text-[#5D5D5D] h-[27px] w-[79px] font-medium text-xl'>{statusCounts?.completed}</div>
                                <div className='text-center text-black h-4 text-xs w-[79px]'>Completed</div>
                            </div>
                        </div>
                    </div>
                </Header>

                <div className="flex items-end justify-between gap-2.5">
                    <div className="flex items-center gap-3 ">
                        <Calendar28 dateRange={dateRange} setDateRange={setDateRange} />
                    </div>
                    <div className="w-[369px] h-[39px] mt-5 flex items-center justify-end gap-3">
                        <DropdownMenu >
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className={`w-[180px] h-[39px] flex items-center justify-between rounded shadow-inner shadow-[#F1F1F1] cursor-pointer bg-[#FFFFFF] `}>
                                    {selectedStatus.label} <ChevronDown className="ml-2" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56 bg-[#FDFDFD] shadow-inner shadow-[#F1F1F1] cursor-pointer" align="start">
                                <DropdownMenuGroup>
                                    {showStatus.map(option => (
                                        <DropdownMenuItem
                                            key={option.value}
                                            className={`flex items-center justify-between cursor-pointer bg-[#FFFFFF]`}
                                            onClick={() => setSelectedStatus(option)}
                                        >
                                            {option.label} <ChevronDown className="ml-2" />
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <div className="p-2.5 w-[97px] h-full flex items-center focus-visible:border-none focus-visible:outline-none   rounded">
                            <Button onClick={handleExportCsv} type='button' variant={"ghost"} className='cursor-pointer rounded p-0 bg-[#FDFDFD] inset-shadow-xs inset-shadow-[#F1F1F1] text-[#959595] text-sm'>Export <Download /></Button>
                        </div>
                    </div>
                </div>
                {isFetching? (<Spinner/>):(
                <DataTable columns={columns} data={currentItems} rowSelection={rowSelection}
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

export default BookingPage
