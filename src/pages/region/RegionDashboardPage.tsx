import useFetchAllRegions from "@/api/region.api"
import Header from "@/components/layout/Header"
import { Spinner } from "@/components/Spinner"
import { getRegionColumns } from "@/components/table/column"
import { DataTable } from "@/components/table/data-table"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
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
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import usePagination from "@/hooks/use-pagination"
import { toastPromise } from "@/hooks/use-toast"
import { constant } from "@/lib/constant"
import queries from "@/lib/queries"
import type { TRegion } from "@/types/region/region.type"
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu"
import { ChevronDown, Plus, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"

const showOptions = [
  { value: 10, label: "Show 10" },
  { value: 20, label: "Show 20" },
  { value: 30, label: "Show 30" },
]

function RegionDashboardPage() {
  const navigate = useNavigate()
  const [perPage, setPerPage] = useState(10)
  const [page, setCPage] = useState(1)
  const [selected, setSelected] = useState(showOptions[0])
  const { data, refetch, isFetching } = useFetchAllRegions({ limit: perPage })
  const { currentPage, setPage, totalPages, currentItems } = usePagination<TRegion>(
    data?.regions,
    page,
    perPage,
    data?.pagination
  )

  useEffect(() => {
    setCPage(currentPage)
  }, [currentPage])

  useEffect(() => {
    setPerPage(selected.value)
  }, [selected])

  const handleEdit = (id: string) => {
    console.log("Edit:", id)
    navigate(constant.ROUTING_URLS.EDIT_REGION.replace(":id", id))
  }
  const deleteRegion = queries.useDeleteRegionMutation()
  const handleDelete = (id: string) => {
    try {
      toastPromise(deleteRegion.mutateAsync(id), {
        loading: "Deleting Region...",
        success: (res) => {
          if (res?.status === true) refetch()
          return "Yeah! Region deleted successfully"
        },
        error: (e) => (e instanceof Error ? e.message : "Opps! Error deleting region"),
      })
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error("Opps! An unexpected error occured")
      }
    }
  }
  const editRegionMutation = queries.useEditRegionMutation()
  const handleAccess = async (id: string, permissionIds: string[]) => {
    console.log("manage access:", permissionIds, "id:", id)
    toastPromise(
      editRegionMutation.mutateAsync({ id, data: { permissionAccess: permissionIds } }),
      {
        loading: "Updating access...",
        success: (res) => {
          if (res.status === true) refetch()
          return "Yeah! Region updated."
        },
        error: (e) =>
          e instanceof Error ? e.message : "Opps! Failed to update access permission.",
      }
    )
  }
  const columns = getRegionColumns(handleEdit, handleDelete, handleAccess)

  const [searchValue, setSearchValue] = useState("")
  const [rowSelection, setRowSelection] = useState({})
  // Number of pages based on filtered data
  const calculatedTotalPages = Math.max(1, totalPages)

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setCPage(newPage)
    setPage(newPage)
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
  return (
    <div className="space-y-8 p-8">
      <Header className="h-[79px] bg-[#FDFDFD] p-4 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
        <div className="flex h-full w-full items-center justify-between">
          <div>
            <h2 className="text-xl font-medium text-black">Region Management</h2>
            <h4>
              {" "}
              <span className="h-4 w-[116px] text-[#959595]">Region Management</span>{" "}
              <span className="h-4 w-[50px] text-xs text-[#3A3A3A]">/ Region</span>
            </h4>
          </div>
          <Link to={constant.ROUTING_URLS.CREATE_REGION}>
            {" "}
            <Button>
              <Plus />
              <span>Add Region</span>
            </Button>
          </Link>
        </div>
      </Header>
      <div className="flex items-center justify-between">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outlineBlack">
              {selected.label} <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-56 cursor-pointer bg-[#FDFDFD] shadow-inner shadow-[#F1F1F1]"
            align="start"
          >
            <DropdownMenuGroup>
              {showOptions.map((option) => (
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
        <div className="flex h-[39px] w-[369px] items-center justify-between gap-3">
          <span
            className={`${
              Object.keys(rowSelection).filter(
                (k) =>
                  // @ts-expect-error: We are intentionally assigning a number to a string type for testing.
                  rowSelection[k]
              ).length === 0
                ? "cursor-no-drop"
                : "cursor-pointer"
            }`}
          >
            <Button
              variant={"outlineBlack"}
              // @ts-expect-error: We are intentionally assigning a number to a string type for testing.
              disabled={Object.keys(rowSelection).filter((k) => rowSelection[k]).length === 0}
              onClick={() => {
                // setData((prev) =>
                //    // @ts-expect-error: We are intentionally assigning a number to a string type for testing.
                //   prev.filter((row,i) => !rowSelection[i])
                // );
                console.log("data:", data)
                console.log("rowSelection:", rowSelection)
                setRowSelection({})
              }}
            >
              <span>Delete</span>
              <Trash2 />
            </Button>
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
          onRowSelectionChange={setRowSelection}
          globalFilter={searchValue}
          onGlobalFilterChange={setSearchValue}
        />
      )}

      {/* Pagination */}
      {totalPages > 0 && calculatedTotalPages > 1 && (
        <Pagination className="cursor-pointer justify-end">
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

export default RegionDashboardPage
