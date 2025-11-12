import type { Table } from "@tanstack/react-table";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import useFetchAllChauffeur from "@/api/chauffeur.api";
import BulkDeleteBtn from "@/components/bulkDeleteBtn/BulkDeleteBtn";
import { ErrorCard } from "@/components/common/ErrorCard";
import PageTitle from "@/components/common/PageTitle";
import { PageHeader } from "@/components/layouts/PageHeader";
import { Spinner } from "@/components/Spinner";
import { getChauffeur } from "@/components/table/column";
import { DataTable } from "@/components/table/data-table";
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
import { SelectDropDown } from "@/components/ui/select";
import usePagination from "@/hooks/use-pagination";
import { toastPromise } from "@/hooks/use-toast";
import { constant } from "@/lib/constant";
import queries from "@/lib/queries";
import type { TChauffeur } from "@/types/chauffeur.type";
import type { TBlkDelRes } from "@/types/global/BulkDeleteResponse.type";
import { generatePageTitle } from "@/utils/seo";

const showStatus = [
  { label: "Active", value: "active" },
  { label: "Pending", value: "pending" },
  { label: "Inactive", value: "inactive" },
  { label: "Suspended", value: "suspended" },
];

const showTime = [
  { label: "All Time", value: "All Time" },
  { label: "Weekly", value: "weekly" },
  { label: "Monthly", value: "monthly" },
  { label: "Yearly", value: "yearly" },
];

// const tableData: TChauffeur[] = [
//         {
//             "id": "801c9f7e-7dfa-4f97-9664-912fe821db19",
//             "businessAddress": "dafs",
//             "password": "dfa",
//             "user": {
//               "firstName": "dkfsa",
//               "lastName": "dfas",
//               "email": "ddfa@email.com"
//             },
//             "userId": "1b54693c-685f-4360-b07d-6ebfe74a96a7",
//             "affiliateId": "ba5227db-7a3f-45f5-945c-e9d5ef01968d",
//             "status": "Active",
//             "panNumber": "chauffeur_pan_875f",
//             "licenseNumber": "license_number_875f",
//             "vehicleId": "3959bb6d-8782-41db-9365-ff7876e88131",
//             "documents": [
//                 {
//                     "size": 254971,
//                     "fileUrl": "https://qb-nauticalnode.s3.ap-south-1.amazonaws.com/chauffeurs/1752584832584-Screenshot%20%287%29.png",
//                     "mimetype": "image/png",
//                     "originalName": "Screenshot (7).png"
//                 },
//                 {
//                     "size": 316890,
//                     "fileUrl": "https://qb-nauticalnode.s3.ap-south-1.amazonaws.com/chauffeurs/1752584832590-Screenshot%202023-07-25%20120555.png",
//                     "mimetype": "image/png",
//                     "originalName": "Screenshot 2023-07-25 120555.png"
//                 }
//             ],
//             "rating": "5.00",
//             "availability": true,
//             "location": {
//                 "latitude": 40.76303278785429,
//                 "longitude": -73.81583247888925
//             },
//             "gratuity": "0.00",
//             "createdAt": "2025-07-15T13:07:17.448Z",
//             "updatedAt": "2025-07-15T13:07:17.448Z",
//             "vehicle": {
//                 "id": "3959bb6d-8782-41db-9365-ff7876e88131",
//                 "affiliateId": "d194f9aa-8bee-4c36-9d50-c2df01882efe",
//                 "plateNumber": "AB-123-CDa",
//                 "brand": "Mercedes-S-classa",
//                 "model": "2024",
//                 "year": 2025,
//                 "color": "black",
//                 "vehicleType": "Executive Sedan Fit for 3 Passengers",
//                 "capacity": 4,
//                 "documents": [],
//                 "vehicleImages": [],
//                 "createdAt": "2025-07-15T12:43:58.461Z",
//                 "updatedAt": "2025-07-15T12:43:58.461Z",
//                 "deletedAt": null
//             }
//         },
//         {
//             "id": "801c9f7e-7dfa-4f97-9664-912fe821db17",
//             "businessAddress": "dafs",
//             "password": "dfa",
//             "user": {
//               "firstName": "dkfsa",
//               "lastName": "dfas",
//               "email": "ddfa@email.com"
//             },
//             "userId": "1b54693c-685f-4360-b07d-6ebfe74a96a7",
//             "affiliateId": "ba5227db-7a3f-45f5-945c-e9d5ef01968d",
//             "status": "pending",
//             "panNumber": "chauffeur_pan_875f",
//             "licenseNumber": "license_number_875f",
//             "vehicleId": "3959bb6d-8782-41db-9365-ff7876e88131",
//             "documents": [
//                 {
//                     "size": 254971,
//                     "fileUrl": "https://qb-nauticalnode.s3.ap-south-1.amazonaws.com/chauffeurs/1752584832584-Screenshot%20%287%29.png",
//                     "mimetype": "image/png",
//                     "originalName": "Screenshot (7).png"
//                 },
//                 {
//                     "size": 316890,
//                     "fileUrl": "https://qb-nauticalnode.s3.ap-south-1.amazonaws.com/chauffeurs/1752584832590-Screenshot%202023-07-25%20120555.png",
//                     "mimetype": "image/png",
//                     "originalName": "Screenshot 2023-07-25 120555.png"
//                 }
//             ],
//             "rating": "5.00",
//             "availability": true,
//             "location": {
//                 "latitude": 40.76303278785429,
//                 "longitude": -73.81583247888925
//             },
//             "gratuity": "0.00",
//             "createdAt": "2025-07-15T13:07:17.448Z",
//             "updatedAt": "2025-07-15T13:07:17.448Z",
//             "vehicle": {
//                 "id": "3959bb6d-8782-41db-9365-ff7876e88131",
//                 "affiliateId": "d194f9aa-8bee-4c36-9d50-c2df01882efe",
//                 "plateNumber": "AB-123-CDa",
//                 "brand": "Mercedes-S-classa",
//                 "model": "2024",
//                 "year": 2025,
//                 "color": "black",
//                 "vehicleType": "Executive Sedan Fit for 3 Passengers",
//                 "capacity": 4,
//                 "documents": [],
//                 "vehicleImages": [],
//                 "createdAt": "2025-07-15T12:43:58.461Z",
//                 "updatedAt": "2025-07-15T12:43:58.461Z",
//                 "deletedAt": null
//             }
//         },
//         {
//             "id": "801c9f7e-7dfa-4f97-9664-912fe821db16",
//             "businessAddress": "dafs",
//             "password": "dfa",
//             "user": {
//               "firstName": "dkfsa",
//               "lastName": "dfas",
//               "email": "ddfa@email.com"
//             },
//             "userId": "1b54693c-685f-4360-b07d-6ebfe74a96a7",
//             "affiliateId": "ba5227db-7a3f-45f5-945c-e9d5ef01968d",
//             "status": "inactive",
//             "panNumber": "chauffeur_pan_875f",
//             "licenseNumber": "license_number_875f",
//             "vehicleId": "3959bb6d-8782-41db-9365-ff7876e88131",
//             "documents": [
//                 {
//                     "size": 254971,
//                     "fileUrl": "https://qb-nauticalnode.s3.ap-south-1.amazonaws.com/chauffeurs/1752584832584-Screenshot%20%287%29.png",
//                     "mimetype": "image/png",
//                     "originalName": "Screenshot (7).png"
//                 },
//                 {
//                     "size": 316890,
//                     "fileUrl": "https://qb-nauticalnode.s3.ap-south-1.amazonaws.com/chauffeurs/1752584832590-Screenshot%202023-07-25%20120555.png",
//                     "mimetype": "image/png",
//                     "originalName": "Screenshot 2023-07-25 120555.png"
//                 }
//             ],
//             "rating": "5.00",
//             "availability": true,
//             "location": {
//                 "latitude": 40.76303278785429,
//                 "longitude": -73.81583247888925
//             },
//             "gratuity": "0.00",
//             "createdAt": "2025-07-15T13:07:17.448Z",
//             "updatedAt": "2025-07-15T13:07:17.448Z",
//             "vehicle": {
//                 "id": "3959bb6d-8782-41db-9365-ff7876e88131",
//                 "affiliateId": "d194f9aa-8bee-4c36-9d50-c2df01882efe",
//                 "plateNumber": "AB-123-CDa",
//                 "brand": "Mercedes-S-classa",
//                 "model": "2024",
//                 "year": 2025,
//                 "color": "black",
//                 "vehicleType": "Executive Sedan Fit for 3 Passengers",
//                 "capacity": 4,
//                 "documents": [],
//                 "vehicleImages": [],
//                 "createdAt": "2025-07-15T12:43:58.461Z",
//                 "updatedAt": "2025-07-15T12:43:58.461Z",
//                 "deletedAt": null
//             }
//         },
//         {
//             "id": "801c9f7e-7dfa-4f97-9664-912fe821db15",
//             "businessAddress": "dafs",
//             "password": "dfa",
//             "user": {
//               "firstName": "dkfsa",
//               "lastName": "dfas",
//               "email": "ddfa@email.com"
//             },
//             "userId": "1b54693c-685f-4360-b07d-6ebfe74a96a7",
//             "affiliateId": "ba5227db-7a3f-45f5-945c-e9d5ef01968d",
//             "status": "suspended",
//             "panNumber": "chauffeur_pan_875f",
//             "licenseNumber": "license_number_875f",
//             "vehicleId": "3959bb6d-8782-41db-9365-ff7876e88131",
//             "documents": [
//                 {
//                     "size": 254971,
//                     "fileUrl": "https://qb-nauticalnode.s3.ap-south-1.amazonaws.com/chauffeurs/1752584832584-Screenshot%20%287%29.png",
//                     "mimetype": "image/png",
//                     "originalName": "Screenshot (7).png"
//                 },
//                 {
//                     "size": 316890,
//                     "fileUrl": "https://qb-nauticalnode.s3.ap-south-1.amazonaws.com/chauffeurs/1752584832590-Screenshot%202023-07-25%20120555.png",
//                     "mimetype": "image/png",
//                     "originalName": "Screenshot 2023-07-25 120555.png"
//                 }
//             ],
//             "rating": "5.00",
//             "availability": true,
//             "location": {
//                 "latitude": 40.76303278785429,
//                 "longitude": -73.81583247888925
//             },
//             "gratuity": "0.00",
//             "createdAt": "2025-07-15T13:07:17.448Z",
//             "updatedAt": "2025-07-15T13:07:17.448Z",
//             "vehicle": {
//                 "id": "3959bb6d-8782-41db-9365-ff7876e88131",
//                 "affiliateId": "d194f9aa-8bee-4c36-9d50-c2df01882efe",
//                 "plateNumber": "AB-123-CDa",
//                 "brand": "Mercedes-S-classa",
//                 "model": "2024",
//                 "year": 2025,
//                 "color": "black",
//                 "vehicleType": "Executive Sedan Fit for 3 Passengers",
//                 "capacity": 4,
//                 "documents": [],
//                 "vehicleImages": [],
//                 "createdAt": "2025-07-15T12:43:58.461Z",
//                 "updatedAt": "2025-07-15T12:43:58.461Z",
//                 "deletedAt": null
//             }
//         },
//     ]
function ChauffeurPage() {
  const navigate = useNavigate();
  const perPage = 10;
  const [{ value: statusDefaultValue }] = showStatus;
  const [{ value: timeDefaultValue }] = showTime;
  const [newPage, setNewPage] = useState<number>(1);
  const [selectedStatus, setSelectedStatus] = useState(statusDefaultValue);
  const [selectedTime, setSelectedTime] = useState(timeDefaultValue);
  // --- Time range helper ---
  const { startDate, endDate } = useMemo(() => {
    const now = new Date();
    const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59, 999));
    let start: Date | undefined;

    switch (selectedTime) {
      case "weekly": {
        // last 7 days inclusive (UTC)
        start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 6, 0, 0, 0, 0));
        break;
      }
      case "monthly": {
        start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0, 0));
        break;
      }
      case "yearly": {
        start = new Date(Date.UTC(now.getUTCFullYear(), 0, 1, 0, 0, 0, 0));
        break;
      }
      default: {
        // All time: leave undefined so callers can omit filters
        start = undefined;
      }
    }

    return { startDate: start, endDate: selectedTime ? end : undefined };
  }, [selectedTime]);
  const { data, refetch, isFetching, isError } = useFetchAllChauffeur({
    DateRange: { startDate, endDate },
    page: newPage,
  });
  const [tableRef, setTableRef] = useState<Table<TChauffeur> | null>(null);
  // console.log("fetchedData:",data)

  /**
   * Dummy data
   */
  // const [data, setData] = useState<TChauffeur[]>(tableData);
  // const isFetching =   false;

  const handleView = (id: string) => {
    console.log("view:", id);
    navigate(constant.ROUTING_URLS.VIEW_CHAUFFEUR.replace(":id", id));
  };
  const handleEdit = (id: string) => {
    console.log("Edit:", id);
    navigate(constant.ROUTING_URLS.EDIT_CHAUFFEUR.replace(":id", id));
  };
  const deleteChauffeurMutation = queries.useDeleteChauffeurMutation();
  const bulkDeleteChauffeurMutation = queries.useBulkDeleteChauffeurMutation();
  const handleDelete = (id: string) => {
    console.log("id", id);
    try {
      toastPromise(deleteChauffeurMutation.mutateAsync(id), {
        loading: "Deleting chauffeur...",
        success: (res) => {
          if (res) refetch();
          return "Yeah! Chauffeur deleted successfully";
        },
        error: (e) => (e instanceof Error ? e.message : "Opps! Failed to delete chauffeur"),
      });
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Unknown error occurred");
      }
    }
    // setData((prev) =>
    //   prev.filter((row) => row.id !== id))
  };
  const columns = getChauffeur(handleView, handleEdit, handleDelete);

  const [searchValue, setSearchValue] = useState("");
  const [rowSelection, setRowSelection] = useState<{ [key: string]: boolean }>({});

  /**
   * Below is for dummy data
   */
  // const { currentPage, nextPage, prevPage, setPage, totalPages, currentItems } = usePagination<TChauffeur>(data || [], newPage, perPage, );
  /**
   * Below is for real data
   */
  const { currentPage, setPage, totalPages, currentItems } = usePagination<TChauffeur>(
    data?.chauffeurs || [],
    newPage,
    perPage,
    data?.pagination,
  );

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
      <PageTitle title={generatePageTitle("Chauffeur")} />
      <div className="p-6 space-y-6 md:p-8 md:space-y-8">
        <PageHeader
          title="Chauffeur"
          breadcrumbs={[{ label: "Home", path: "/" }, { label: "Chauffeur" }]}
          action={{
            label: "Add Chauffeur",
            icon: <Plus />,
            link: constant.ROUTING_URLS.CREATE_CHAUFFEUR,
          }}
        />

        <div className="flex justify-between gap-2.5">
          <div className="flex items-center gap-3">
            <SelectDropDown
              placeholder={selectedStatus}
              items={showStatus}
              value={selectedStatus}
              setSelectedItem={setSelectedStatus}
            />
            <SelectDropDown
              placeholder={selectedTime}
              items={showTime}
              value={selectedTime}
              setSelectedItem={setSelectedTime}
            />
          </div>
          <div className="w-[369px] h-[39px] mt-5 flex items-center justify-end gap-3">
            <span
              className={`${Object.keys(rowSelection).filter((k) => rowSelection[k]).length === 0 ? "cursor-no-drop" : "cursor-pointer"}`}
            >
              <BulkDeleteBtn<TChauffeur, TBlkDelRes>
                rowSelection={rowSelection}
                tableRef={tableRef}
                bulkDeleteMutation={bulkDeleteChauffeurMutation}
                refetch={refetch}
                setRowSelection={setRowSelection}
                title="Chauffeurs"
                descTitle="chauffeur"
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
            onRowSelectionChange={setRowSelection}
            onTableReady={setTableRef}
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
                  href="#"
                  onClick={() => handlePageChange(currentPage - 1)}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>

              {generatePaginationItems()}

              <PaginationItem>
                <PaginationNext
                  href="#"
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
}

export default ChauffeurPage;
