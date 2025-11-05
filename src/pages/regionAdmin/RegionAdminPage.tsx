import useFetchAllRegionAdmins from "@/api/regionAdmin.api"
import Header from "@/components/layout/Header"
import { Spinner } from "@/components/Spinner"
import { getRegionAdminColumns, type TRegionAdmin } from "@/components/table/column"
import { DataTable } from "@/components/table/data-table"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
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
import { constant } from "@/lib/constant"
import { IconSearch } from "@tabler/icons-react"
import { ChevronDown, Plus, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"

const showOptions = [
  { value: 10, label: "Show 10" },
  { value: 20, label: "Show 20" },
  { value: 30, label: "Show 30" },
]

function RegionAdminPage() {
  const navigate = useNavigate()
  const [perPage, setPerPage] = useState(10)
  const [selected, setSelected] = useState(showOptions[0])
  const { data, isFetching } = useFetchAllRegionAdmins({ limit: perPage })
  const { currentPage, setPage, totalPages, currentItems } = usePagination<TRegionAdmin>(
    data?.regionalAdmins,
    1,
    perPage,
    data?.pagination
  )

  useEffect(() => {
    setPerPage(selected.value)
  }, [selected])

  const handleEdit = (id: string) => {
    console.log("Edit:", id)
    navigate(constant.ROUTING_URLS.EDIT_REGION_ADMIN)
  }
  const handleDelete = (id: string) => {
    console.log(id)
  }
  const columns = getRegionAdminColumns(handleEdit, handleDelete)
  const [searchValue, setSearchValue] = useState("")
  const [rowSelection, setRowSelection] = useState({})

  // Number of pages based on filtered data
  const calculatedTotalPages = Math.max(1, totalPages)

  // Handle page change
  const handlePageChange = (newPage: number) => {
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
              <span className="h-4 w-full max-w-[116px] text-[#959595]">
                Region Management
              </span>{" "}
              <span className="h-4 w-[50px] text-xs text-[#3A3A3A]">/ Region Admins</span>
            </h4>
          </div>
          <Link to={constant.ROUTING_URLS.CREATE_REGION_ADMIN}>
            <Button>
              <Plus />
              <span>Add Regional Admin</span>
            </Button>
          </Link>
        </div>
      </Header>

      <div className="flex justify-between">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outlineBlack">
              {selected.label} <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-full max-w-56 cursor-pointer bg-[#FDFDFD] shadow-inner shadow-[#F1F1F1]"
            align="start"
          >
            <DropdownMenuGroup>
              {showOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  className="flex items-center justify-between hover:bg-[#F1F1F1]"
                  onClick={() => setSelected(option)}
                >
                  {option.label} <ChevronDown />
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="flex w-full max-w-[369px] items-center justify-between gap-3">
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
                // console.log("data:", data);
                // console.log("rowSelection:", rowSelection);
                setRowSelection({})
              }}
            >
              <span>Delete</span>
              <Trash2 />
            </Button>
          </span>
          <div className="w-full max-w-[220px]">
            <InputGroup>
              <InputGroupInput
                type="search"
                placeholder="search"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
              <InputGroupAddon>
                <IconSearch />
              </InputGroupAddon>
            </InputGroup>
            {/* 
              <Input type="search" placeholder="search"  
            value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            /> */}
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
      {/* <div className="mt-5 py-4 border border-[#F1F1F1] rounded-[6px] inset-shadow-xs inset-shadow-[#F1F1F1]  shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
          <Table className=" bg-[#FDFDFD] ">
            <TableHeader className="w-full h-[31px] bg-[#F5F5F5]">
              <TableRow className="w-full h-full ">
                <TableHead className="w-[100px] px-4">#</TableHead>
                <TableHead>Regions</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="text-center">Access</TableHead>
                <TableHead className="text-right px-4">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="p-4">
              {currentItems && currentItems.map((row, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium px-4"><Checkbox className="data-[state=checked]:bg-[#d6d6d6] data-[state=checked]:border-[#d6d6d6] [&_[data-state=checked]>svg]:text-[#5A5A5A] " /></TableCell>
                  <TableCell>{row?.regionName}</TableCell>
                  <TableCell>{row?.email}</TableCell>
                  <TableCell className="text-center"><Button variant={"outline"} className='cursor-pointer w-[108px] h-[33px] text-sm'>Manage Access</Button></TableCell>
                  <TableCell className="text-right flex gap-2 justify-end px-4">
                    <Button variant={"outline"} className='cursor-pointer bg-[#F1F1F1] rounded w-[34px] h-[33px]'><Edit className='text-[#5A5A5A]' /></Button>
                    <Button variant={"outline"} className='cursor-pointer bg-[#F1F1F1] rounded w-[34px] h-[33px]'><Trash2 className='text-[#5A5A5A]' /></Button>
                  </TableCell>
                </TableRow>
              ))}

            </TableBody>
          </Table>

        </div> */}
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

export default RegionAdminPage
