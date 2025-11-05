import UsefetchAllAffiliate, { getAllAffiliate } from "@/api/affiliate.api"
import { Spinner } from "@/components/Spinner"
import BulkDeleteBtn from "@/components/bulkDeleteBtn/BulkDeleteBtn"
import { ErrorCard } from "@/components/common/ErrorCard"
import Header from "@/components/layout/Header"
import { getAffiliate, getStatusColor, type TAffiliate } from "@/components/table/column"
import { DataTable } from "@/components/table/data-table"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import usePagination from "@/hooks/use-pagination"
import { toastPromise } from "@/hooks/use-toast"
import { constant } from "@/lib/constant"
import queries from "@/lib/queries"
import { useQueryClient } from "@tanstack/react-query"
import { ChevronDown, Plus } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"

const showStatus = [
  { label: "Active", value: "active" },
  { label: "Pending", value: "pending" },
  { label: "Inactive", value: "inactive" },
  { label: "Suspended", value: "suspended" },
]

const showTime = [
  { label: "All Time", value: "" },
  { label: "Weekly", value: "weekly" },
  { label: "Monthly", value: "monthly" },
  { label: "Yearly", value: "yearly" },
]

function AffiliatePage() {
  const navigate = useNavigate()
  const perPage = 10
  const [selectedStatus, setSelectedStatus] = useState(showStatus[0])
  const [selectedTime, setSelectedTime] = useState(showTime[0])
  // --- Time range helper ---
  const { startDate, endDate } = useMemo(() => {
    const now = new Date()
    const end = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59, 999)
    )
    let start: Date | undefined

    switch (selectedTime.value) {
      case "weekly": {
        // last 7 days inclusive (UTC)
        start = new Date(
          Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 6, 0, 0, 0, 0)
        )
        break
      }
      case "monthly": {
        start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0, 0))
        break
      }
      case "yearly": {
        start = new Date(Date.UTC(now.getUTCFullYear(), 0, 1, 0, 0, 0, 0))
        break
      }
      default: {
        // All time: leave undefined so callers can omit filters
        start = undefined
      }
    }

    return { startDate: start, endDate: selectedTime.value ? end : undefined }
  }, [selectedTime])

  const [newPage, setNewPage] = useState<number>(1)
  const {
    data: FetchData,
    refetch,
    isFetching,
    isError,
  } = UsefetchAllAffiliate({ DateRange: { startDate, endDate }, page: newPage })
  const [tableRef, setTableRef] = useState<unknown>(null)
  const queryClient = useQueryClient()
  useEffect(() => {
    if (FetchData?.pagination?.hasNextPage === true) {
      queryClient.prefetchQuery({
        queryKey: ["affiliate", { startDate, endDate }, newPage + 1],
        queryFn: () => getAllAffiliate({ startDate, endDate }, newPage + 1),
      })
    }
  }, [queryClient, newPage, FetchData])

  const { currentPage, setPage, totalPages, currentItems } = usePagination<TAffiliate>(
    FetchData?.affiliates,
    newPage,
    perPage,
    FetchData?.pagination
  )
  useEffect(() => {
    if (currentPage) {
      setNewPage(currentPage)
    }
  }, [currentPage])
  useEffect(() => {
    if (currentItems) {
      console.log("currentItems:", currentItems)
    }
  }, [currentItems])
  const handleView = (id: string) => {
    console.log("view:", id)
    navigate(constant.ROUTING_URLS.VIEW_AFFILIATE.replace(":id", id))
  }

  const deleteAffiliateMutation = queries.useDeleteAffiliateMutation()
  const bulkDeleteAffiliateMutation = queries.useBulkDeleteAffiliateMutation()
  const handleEdit = (id: string) => {
    console.log("Edit:", id)
    navigate(constant.ROUTING_URLS.EDIT_AFFILIATE.replace(":id", id))
  }
  const handleDelete = async (id: string) => {
    try {
      // Remove remember field before sending to API
      // await loginMutation.mutateAsync(loginData);
      toastPromise(deleteAffiliateMutation.mutateAsync(id), {
        loading: "Deleting Affiliate...",
        success: (res) => {
          if (res.status === true) refetch()
          return "Yeah! Affiliate deleted successfully!"
        },
        error: (e) => (e instanceof Error ? e.message : "Opps! Failed to delete affiliate"),
      })
    } catch (error) {
      // Error handling is done in onError callback
      console.error("Affiliate delete error:", error)
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error("Opps! An unknown error occurred.")
      }
    }
  }
  const columns = getAffiliate(handleView, handleEdit, handleDelete)
  const [searchValue, setSearchValue] = useState("")
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({})

  // Number of pages based on filtered data
  const calculatedTotalPages = Math.max(1, totalPages)
  // Handle page change
  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    setNewPage(newPage)
    window.scrollTo(0, 0)
  }

  // Generate pagination items
  const generatePaginationItems = () => {
    const items = []

    // Always show first page
    items.push(
      <PaginationItem key="first">
        <PaginationLink isActive={currentPage === 1} onClick={() => handlePageChange(1)}>
          1
        </PaginationLink>
      </PaginationItem>
    )

    // Show ellipsis if needed
    if (currentPage > 3) {
      items.push(
        <PaginationItem key="ellipsis-1">
          <PaginationEllipsis />
        </PaginationItem>
      )
    }

    // Show nearby pages
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(calculatedTotalPages - 1, currentPage + 1);
      i++
    ) {
      if (i === 1 || i === calculatedTotalPages) continue // Skip first and last pages as they're added separately

      items.push(
        <PaginationItem key={i}>
          <PaginationLink isActive={currentPage === i} onClick={() => handlePageChange(i)}>
            {i}
          </PaginationLink>
        </PaginationItem>
      )
    }

    // Show ellipsis if needed
    if (currentPage < calculatedTotalPages - 2) {
      items.push(
        <PaginationItem key="ellipsis-2">
          <PaginationEllipsis />
        </PaginationItem>
      )
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
      )
    }

    return items
  }

  if (isError) return <ErrorCard refetch={refetch} />

  return (
    <div className="space-y-8 px-8 pt-8">
      <Header className="h-[79px] bg-[#FDFDFD] p-4 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
        <div className="flex h-full w-full items-center justify-between">
          <div>
            <h2 className="text-xl font-medium text-black">Affiliate</h2>
            <h4>
              {" "}
              <span className="h-4 w-full text-xs text-[#959595]">LIMOSPRO</span>{" "}
              <span className="h-4 w-full max-w-[50px] text-xs text-[#3A3A3A]">/ Affiliate</span>
            </h4>
          </div>
          <Link to={constant.ROUTING_URLS.CREATE_AFFILIATE}>
            {" "}
            <Button>
              <Plus />
              <span>Add Affiliate</span>
            </Button>
          </Link>
        </div>
      </Header>

      <div className="flex justify-between gap-2.5">
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outlineBlack"
                className={` ${getStatusColor(selectedStatus.label)} ${selectedStatus.label === "Active" && "text-white"}`}
              >
                {selectedStatus.label} <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-full max-w-56 cursor-pointer bg-[#FDFDFD] shadow-inner shadow-[#F1F1F1]"
              align="start"
            >
              <DropdownMenuGroup>
                {showStatus.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    className={`flex cursor-pointer items-center justify-between ${getStatusColor(option.label)} ${option.label === "Active" && "text-white"}`}
                    onClick={() => setSelectedStatus(option)}
                  >
                    {option.label} <ChevronDown className="ml-2" />
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outlineBlack" className={`${"cursor-pointer"} bg-[#FFFFFF]`}>
                <span className="max-w-[120px] truncate">{selectedTime.label}</span>
                <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-full max-w-56 cursor-pointer bg-[#FDFDFD] shadow-inner shadow-[#F1F1F1]"
              align="start"
            >
              <DropdownMenuGroup>
                {showTime.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    className={`bg-[#FFFFFF]`}
                    onClick={() => setSelectedTime(option)}
                  >
                    {option.label} <ChevronDown />
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex w-full max-w-[369px] items-center justify-between gap-3">
          <span
            className={`${Object.keys(rowSelection).filter((k) => rowSelection[k]).length === 0 ? "cursor-no-drop" : "cursor-pointer"}`}
          >
            <BulkDeleteBtn
              rowSelection={rowSelection}
              tableRef={tableRef}
              bulkDeleteMutation={bulkDeleteAffiliateMutation}
              refetch={refetch}
              setRowSelection={setRowSelection}
              title="Affiliates"
              descTitle="affiliates"
            />
          </span>
          <div className="w-full max-w-[220px]">
            <Input
              type="search"
              placeholder="search"
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
        <Pagination className="mt-5 cursor-pointer justify-end">
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
                className={
                  currentPage === calculatedTotalPages ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}

export default AffiliatePage
